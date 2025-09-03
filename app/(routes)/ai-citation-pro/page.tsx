'use client'

import { useEffect, useState, useRef, Suspense } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useSearchParams } from 'next/navigation'
import Tiptap from '@/components/tiptap-pro'
import { ChevronDown, ChevronRight, ExternalLink, Copy } from 'lucide-react'

interface Reference {
  cited_sentence: string;
  paper_id: string;
  paper_title: string;
}

interface PaperDetails {
  title: string;
  authors: string[];
  url: string;
  year?: number;
  abstract?: string;
  fieldsOfStudy?: string[];
  publicationDate?: string;
  error?: string;
}

type CitationStyle = 'APA' | 'MLA' | 'Chicago' | 'Harvard';

interface HighlightedSentence {
  sentence: string;
  color: string;
  isActive: boolean;
  paper_id: string;
  paper_title: string;
}

export default function Citation() {
    const searchParams = useSearchParams()
    const fileId = searchParams.get('fileId')
    const supabase = createClient()
    const [uniqueReferences, setUniqueReferences] = useState<Reference[]>([])
    const [paperDetails, setPaperDetails] = useState<Record<string, PaperDetails>>({})
    const [loading, setLoading] = useState(true)
    const [expandedPapers, setExpandedPapers] = useState<Record<string, boolean>>({})
    const [listExpanded, setListExpanded] = useState(true)
    const [bibExpanded, setBibExpanded] = useState(true)
    const [fetchError, setFetchError] = useState<string | null>(null)
    const [citationStyle, setCitationStyle] = useState<CitationStyle>('MLA')
    const [copied, setCopied] = useState(false)
    const [highlightedSentences, setHighlightedSentences] = useState<HighlightedSentence[]>([])
    const tiptapRef = useRef<any>(null)
    const [expandedSentence, setExpandedSentence] = useState<string | null>(null)
    const [showRephrasePopup, setShowRephrasePopup] = useState(false)
    const [rephraseSentence, setRephraseSentence] = useState('')
    const [loadingRecite, setLoadingRecite] = useState<Record<string, boolean>>({});
    const [loadingRephrase, setLoadingRephrase] = useState<Record<string, boolean>>({});
    const [rephraseOptions, setRephraseOptions] = useState<string[]>([]);
    const [currentRephraseSentence, setCurrentRephraseSentence] = useState<string>('');
    const [selectedRephrase, setSelectedRephrase] = useState<string>('');
    const [applyingRephrase, setApplyingRephrase] = useState(false);
    const [removingSentence, setRemovingSentence] = useState<string | null>(null);
    const [removeError, setRemoveError] = useState<string | null>(null);


    const handleRephrase = async (citedSentence: string) => {
        try {
            setLoadingRephrase(prev => ({ ...prev, [citedSentence]: true }));
            
            const response = await fetch('/api/rephrase', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                citedSentence,
                fileId
            })
            });

            if (!response.ok) {
            throw new Error('Failed to get rephrases');
            }

            const result = await response.json();
            
            if (!result.success) {
            throw new Error('Rephrase operation failed');
            }

            const { rephrases } = result;
            
            // Show popup with rephrase options
            setRephraseOptions(rephrases);
            setCurrentRephraseSentence(citedSentence);
            setShowRephrasePopup(true);

        } catch (error) {
            console.error('Error getting rephrases:', error);
            // Show error notification to user
        } finally {
            setLoadingRephrase(prev => ({ ...prev, [citedSentence]: false }));
        }
    };

    const applyRephrase = async (selectedOption: string) => {
        try {
            setApplyingRephrase(true); // Start loading
            
            const response = await fetch('/api/apply-rephrase', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                originalSentence: currentRephraseSentence,
                rephrasedSentence: selectedOption,
                fileId
            })
            });

            if (!response.ok) {
            throw new Error('Failed to apply rephrase');
            }

            const result = await response.json();
            
            if (!result.success) {
            throw new Error('Apply rephrase operation failed');
            }

            // Update the UI state with the rephrased sentence
            setHighlightedSentences(prev => 
            prev.map(item => 
                item.sentence === currentRephraseSentence 
                ? { 
                    ...item, 
                    sentence: selectedOption
                    } 
                : item
            )
            );

            // Update the editor content AND the cited sentences in Tiptap
            if (tiptapRef.current) {
            tiptapRef.current.updateSentence(currentRephraseSentence, selectedOption);
            tiptapRef.current.updateCitedSentence(currentRephraseSentence, selectedOption);
            
            await saveContentToSupabase();
            }

            if (expandedSentence === currentRephraseSentence) {
            setExpandedSentence(selectedOption);
            }

            setShowRephrasePopup(false);
            setRephraseOptions([]);
            setCurrentRephraseSentence('');
            setSelectedRephrase('');

        } catch (error) {
            console.error('Error applying rephrase:', error);
        } finally {
            setApplyingRephrase(false);
        }
    };

    useEffect(() => {
        const updateOpenedAt = async () => {
            if (!fileId) return;
            
            try {
                const { error } = await supabase
                .from('files_pro')
                .update({ opened_at: new Date().toISOString() })
                .eq('id', fileId);
                
                if (error) {
                console.error('Error updating opened_at:', error);
                }
            } catch (error) {
                console.error('Error updating opened_at:', error);
            }
        };

        updateOpenedAt();
    }, [fileId, supabase]);

    useEffect(() => {
        if (!fileId) return

        const fetchReferences = async () => {
            try {
                setLoading(true)
                setFetchError(null)

                const { data: fileStatus, error: statusError } = await supabase
                    .from('files_pro')
                    .select('completion')
                    .eq('id', fileId)
                    .single()

                if (statusError) throw statusError

                if (fileStatus.completion !== 'complete') {
                    await waitForCompletion()
                }

                const { data, error } = await supabase
                    .from('files_pro')
                    .select('references, cited_sentences')
                    .eq('id', fileId)
                    .single()

                if (error) throw error
                
                if (data?.cited_sentences && Array.isArray(data.cited_sentences)) {
                    const sentences = data.cited_sentences.map((item: any) => ({
                        sentence: item.text,
                        paper_id: item.paper_id,
                        paper_title: item.paper_title,
                        color: 'var(--tt-color-highlight-blue)',
                        isActive: false
                    }))
                    setHighlightedSentences(sentences)
                }

                if (data?.references) {
                    const uniqueRefs = Array.from(
                        new Set(data.references.map((ref: Reference) => ref.paper_id))
                        )
                        .map(id => data.references.find((ref: Reference) => ref.paper_id === id))
                        .filter(Boolean) as Reference[];
                    
                    setUniqueReferences(uniqueRefs)
                    const initialExpandedState = uniqueRefs.reduce((acc, ref) => {
                        acc[ref.paper_id] = false
                        return acc
                    }, {} as Record<string, boolean>)
                    setExpandedPapers(initialExpandedState)
                    await fetchPaperDetailsBatch(uniqueRefs)
                }
            } catch (error) {
                console.error('Error fetching references:', error)
                setFetchError('Failed to load references from database')
            } finally {
                setLoading(false)
            }
        }

        const waitForCompletion = async (maxAttempts = 100, interval = 10000) => {
            for (let attempt = 0; attempt < maxAttempts; attempt++) {
                const { data, error } = await supabase
                    .from('files_pro')
                    .select('completion')
                    .eq('id', fileId)
                    .single()

                if (error) throw error
                
                if (data.completion === 'complete') {
                    return true
                }

                await new Promise(resolve => setTimeout(resolve, interval))
            }
            
            window.location.reload()

            return new Promise(() => {})
        }

        fetchReferences()
    }, [fileId, supabase])


    const fetchPaperDetailsBatch = async (refs: Reference[]) => {
        try {
            setFetchError(null);
            const paperIds = refs.map(ref => ref.paper_id).filter(Boolean);
            
            if (paperIds.length === 0) return;

            const apiUrl = `https://api.semanticscholar.org/graph/v1/paper/batch?fields=title,authors,year,url,abstract,fieldsOfStudy,publicationDate`;
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'x-api-key': process.env.SEMANTIC_SCHOLAR_API_KEY || '',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ids: paperIds
                })
            });
            
            // Handle rate limiting and server errors gracefully
            if (response.status === 429 || response.status >= 500) {
                console.log('Semantic Scholar API rate limited or server error, will retry individually');
                await fetchPaperDetailsIndividual(refs);
                return;
            }
            
            if (!response.ok) {
                console.log(`Semantic Scholar API returned ${response.status}, will retry individually`);
                await fetchPaperDetailsIndividual(refs);
                return;
            }
            
            const batchData = await response.json();
            const details: Record<string, PaperDetails> = {};

            refs.forEach((ref, index) => {
                const paperData = batchData[index];
                if (paperData && !paperData.error) {
                    details[ref.paper_id] = {
                        title: paperData.title || ref.paper_title,
                        authors: paperData.authors?.map((a: any) => a.name) || [],
                        url: paperData.url || `https://www.semanticscholar.org/paper/${ref.paper_id}`,
                        year: paperData.year,
                        abstract: paperData.abstract,
                        fieldsOfStudy: paperData.fieldsOfStudy,
                        publicationDate: paperData.publicationDate
                    };
                } else {
                    // Don't mark as error, just use basic info
                    details[ref.paper_id] = {
                        title: ref.paper_title,
                        authors: [],
                        url: `https://www.semanticscholar.org/paper/${ref.paper_id}`,
                        // No error field - we'll keep trying in the background
                    };
                }
            });
            
            setPaperDetails(details);
        } catch (error) {
            console.log('Batch request failed, falling back to individual requests:', error);
            await fetchPaperDetailsIndividual(refs);
        }
    };

    const fetchPaperDetailsIndividual = async (refs: Reference[]) => {
        try {
            const details: Record<string, PaperDetails> = {};
            const updatedPaperDetails = { ...paperDetails };
            
            for (const ref of refs) {
                if (!ref.paper_id) continue;
                
                // Skip if we already have good data for this paper
                if (updatedPaperDetails[ref.paper_id]?.authors?.length > 0) {
                    details[ref.paper_id] = updatedPaperDetails[ref.paper_id];
                    continue;
                }
                
                try {
                    const apiUrl = `https://api.semanticscholar.org/graph/v1/paper/${ref.paper_id}?fields=title,authors,year,url,abstract,fieldsOfStudy,publicationDate`;
                    
                    const response = await fetch(apiUrl, {
                        headers: {
                            'x-api-key': process.env.SEMANTIC_SCHOLAR_API_KEY || ''
                        }
                    });
                    
                    // Handle rate limits with exponential backoff
                    if (response.status === 429) {
                        console.log(`Rate limited for paper ${ref.paper_id}, will retry later`);
                        // Set basic info and continue
                        details[ref.paper_id] = {
                            title: ref.paper_title,
                            authors: [],
                            url: `https://www.semanticscholar.org/paper/${ref.paper_id}`
                        };
                        continue;
                    }
                    
                    if (!response.ok) {
                        console.log(`Failed to fetch paper ${ref.paper_id}: ${response.status}`);
                        details[ref.paper_id] = {
                            title: ref.paper_title,
                            authors: [],
                            url: `https://www.semanticscholar.org/paper/${ref.paper_id}`
                        };
                        continue;
                    }
                    
                    const data = await response.json();
                    details[ref.paper_id] = {
                        title: data.title || ref.paper_title,
                        authors: data.authors?.map((a: any) => a.name) || [],
                        url: data.url || `https://www.semanticscholar.org/paper/${ref.paper_id}`,
                        year: data.year,
                        abstract: data.abstract,
                        fieldsOfStudy: data.fieldsOfStudy,
                        publicationDate: data.publicationDate
                    };
                    
                    // Update state progressively as we get data
                    setPaperDetails(prev => ({
                        ...prev,
                        [ref.paper_id]: details[ref.paper_id]
                    }));
                    
                } catch (error) {
                    console.log(`Error fetching paper ${ref.paper_id}:`, error);
                    details[ref.paper_id] = {
                        title: ref.paper_title,
                        authors: [],
                        url: `https://www.semanticscholar.org/paper/${ref.paper_id}`
                    };
                }
                
                // Add delay between requests to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            
            // Final update with all collected details
            setPaperDetails(prev => ({ ...prev, ...details }));
            
        } catch (error) {
            console.log('Error in individual paper fetching:', error);
            // Don't set fetchError - we want to keep trying silently
        }
    };

    const togglePaperExpand = (paperId: string) => {
        setExpandedPapers(prev => ({
            ...prev,
            [paperId]: !prev[paperId]
        }))
    }

    const toggleListExpand = () => {
        setListExpanded(!listExpanded)
    }

    const formatCitation = (paperId: string, style: CitationStyle): string => {
        const paper = paperDetails[paperId];
        if (!paper) return "Loading citation...";
        
        const currentDate = new Date().toLocaleDateString('en-US', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
        }).replace(',', '');
        
        let authorList = '';
        if (paper.authors && paper.authors.length > 0) {
            if (style === 'APA' || style === 'Harvard') {
                if (paper.authors.length === 1) {
                    authorList = paper.authors[0];
                } else if (paper.authors.length === 2) {
                    authorList = `${paper.authors[0]} & ${paper.authors[1]}`;
                } else {
                    authorList = `${paper.authors[0]} et al.`;
                }
            } else {
                if (paper.authors.length === 1) {
                    authorList = paper.authors[0];
                } else if (paper.authors.length === 2) {
                    authorList = `${paper.authors[0]} and ${paper.authors[1]}`;
                } else {
                    authorList = `${paper.authors.slice(0, -1).join(', ')}, and ${paper.authors[paper.authors.length - 1]}`;
                }
            }
        }

        const title = paper.title || 'Untitled';
        const journal = paper.fieldsOfStudy?.[0] || 'Journal';
        const year = paper.year || 'n.d.';

        switch(style) {
            case 'APA':
                return `${authorList} (${year}). ${title}. ${journal}.`;
            case 'MLA':
                return `${authorList}. "${title}" ${journal}, ${paper.publicationDate ? new Date(paper.publicationDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }).replace(',', '') : year}.`;
            case 'Chicago':
                return `${authorList}. "${title}" ${journal}. Accessed ${currentDate}.`;
            case 'Harvard':
                return `${authorList} ${year}, ${title}, ${journal}, viewed ${currentDate}.`;
            default:
                return `${authorList} (${year}). ${title}`;
        }
    }

    const copyToClipboard = () => {
        const formattedCitations = uniqueReferences.map(ref => 
            formatCitation(ref.paper_id, citationStyle)
        ).join('\n\n');
        
        navigator.clipboard.writeText(formattedCitations)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
            });
    }

    const handleRemoveSentence = async (sentence: string) => {
        try {
            // Check if this sentence exists in our state (it might have been updated)
            setRemovingSentence(sentence);
            setRemoveError(null);

            const actualSentence = highlightedSentences.find(item => item.sentence === sentence)?.sentence || sentence;
            
            // First remove from the UI state immediately for better UX
            setHighlightedSentences(prev => 
                prev.filter(item => item.sentence !== actualSentence)
            );
            
            // Remove from the editor
            if (tiptapRef.current) {
                tiptapRef.current.removeSentence(actualSentence);
            }
            
            // If the removed sentence was expanded, collapse it
            if (expandedSentence === actualSentence) {
                setExpandedSentence(null);
            }
            
            // Remove from Supabase
            await removeCitedSentenceFromSupabase(actualSentence);
            
        } catch (error) {
            console.error('Error removing cited sentence:', error);
            setRemoveError('Failed to remove citation. Please try again.');
            
            // If there was an error, reload the data to restore the correct state
            const { data: fileData, error: fetchError } = await supabase
                .from('files_pro')
                .select('cited_sentences')
                .eq('id', fileId)
                .single();
                
            if (!fetchError && fileData?.cited_sentences) {
                const sentences = fileData.cited_sentences.map((item: any) => ({
                    sentence: item.text,
                    paper_id: item.paper_id,
                    paper_title: item.paper_title,
                    color: 'var(--tt-color-highlight-blue)',
                    isActive: false
                }));
                setHighlightedSentences(sentences);
            }
        } finally {
            setRemovingSentence(null);
        }
    };

    const removeCitedSentenceFromSupabase = async (sentence: string) => {
        try {
            if (!fileId) return;

            // First get the current cited_sentences array
            const { data: currentFile, error: fetchError } = await supabase
                .from('files_pro')
                .select('cited_sentences, content')
                .eq('id', fileId)
                .single();

            if (fetchError) throw fetchError;

            if (currentFile?.cited_sentences && Array.isArray(currentFile.cited_sentences)) {
                // Filter out the removed sentence - handle different possible structures
                const updatedCitedSentences = currentFile.cited_sentences.filter(
                    (item: any) => {
                        // Handle different possible structures
                        if (typeof item === 'string') {
                            return item !== sentence;
                        } else if (item && typeof item === 'object') {
                            return item.text !== sentence && 
                                item.sentence !== sentence && 
                                item.cited_sentence !== sentence;
                        }
                        return true; // Keep if we can't determine the structure
                    }
                );

                // Also get the updated content from the editor
                let updatedContent = currentFile.content;
                if (tiptapRef.current) {
                    updatedContent = tiptapRef.current.getContent();
                }

                // Update the database with both cited_sentences and content
                const { error: updateError } = await supabase
                    .from('files_pro')
                    .update({ 
                        cited_sentences: updatedCitedSentences,
                        content: updatedContent,
                    })
                    .eq('id', fileId);

                if (updateError) throw updateError;

                console.log('Cited sentence removed from Supabase and content updated');
            }
        } catch (error) {
            console.error('Error removing cited sentence from Supabase:', error);
            throw error;
        }
    };

    const handleSentenceClick = (sentence: string) => {
        // Check if this sentence exists in our state (it might have been updated)
        const actualSentence = highlightedSentences.find(item => item.sentence === sentence)?.sentence || sentence;
        
        // If clicking the same sentence that's already expanded, collapse it
        if (expandedSentence === actualSentence) {
            setExpandedSentence(null);
            
            // Update the highlighted sentences state to deactivate this one
            const updatedSentences = highlightedSentences.map(item => ({
            ...item,
            isActive: false // Deactivate all sentences when collapsing
            }));
            setHighlightedSentences(updatedSentences);
            
            // Call the Tiptap component's method to update highlights (without clearing all)
            if (tiptapRef.current) {
            // Only update the specific sentence's highlight
            tiptapRef.current.toggleSentenceHighlight(actualSentence, false);
            }
        } 
        // If clicking a different sentence while one is already expanded
        else if (expandedSentence !== null) {
            // First collapse the currently expanded sentence and remove its highlight
            const previousSentence = expandedSentence;
            setExpandedSentence(actualSentence);
            
            // Update the highlighted sentences state - deactivate previous, activate new
            const updatedSentences = highlightedSentences.map(item => ({
            ...item,
            isActive: item.sentence === actualSentence
            }));
            setHighlightedSentences(updatedSentences);
            
            // Call the Tiptap component's method to update highlights
            if (tiptapRef.current) {
            // Update both sentences without clearing all highlights
            tiptapRef.current.toggleSentenceHighlight(previousSentence, false);
            tiptapRef.current.toggleSentenceHighlight(actualSentence, true);
            tiptapRef.current.scrollToSentence(actualSentence);
            }
        }
        // If no sentence is currently expanded, just expand this one
        else {
            setExpandedSentence(actualSentence);
            
            // Update the highlighted sentences state to activate this one
            const updatedSentences = highlightedSentences.map(item => ({
            ...item,
            isActive: item.sentence === actualSentence
            }));
            setHighlightedSentences(updatedSentences);
            
            // Call the Tiptap component's method to add highlight and scroll
            if (tiptapRef.current) {
            tiptapRef.current.toggleSentenceHighlight(actualSentence, true);
            tiptapRef.current.scrollToSentence(actualSentence);
            }
        }
    };

    const handleRecite = async (citedSentence: string) => {
        try {
            // Set loading state for this specific sentence
            setLoadingRecite(prev => ({ ...prev, [citedSentence]: true }));
            
            const sentenceData = highlightedSentences.find(item => item.sentence === citedSentence);
            if (!sentenceData) return;

            const response = await fetch('/api/recite', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                citedSentence,
                fileId
            })
            });

            if (!response.ok) {
            throw new Error('Failed to recite');
            }

            const result = await response.json();
            
            if (!result.success) {
            throw new Error('Recite operation failed');
            }

            const { newCitation, newPaperId, newPaperTitle } = result;

            // Create the new sentence with updated citation
            const sentenceWithoutCitation = citedSentence.replace(/\([^)]*\)\.?$/, '').trim();
            const newSentence = `${sentenceWithoutCitation} ${newCitation}.`;

            // Update the UI state with the new sentence text
            setHighlightedSentences(prev => 
            prev.map(item => 
                item.sentence === citedSentence 
                ? { 
                    ...item, 
                    sentence: newSentence, // Update to the new sentence text
                    citation: newCitation,
                    paper_id: newPaperId,
                    paper_title: newPaperTitle
                    } 
                : item
            )
            );

            // Update the editor content
            if (tiptapRef.current) {
            tiptapRef.current.updateCitation(citedSentence, newCitation);
            
            // Also update the cited sentence text in the editor's internal state
            tiptapRef.current.findAndUpdateCitedSentences(citedSentence, newSentence);

            // Save the updated content to Supabase
            await saveContentToSupabase();
            }

            // If this sentence was expanded, update the expanded state
            if (expandedSentence === citedSentence) {
            setExpandedSentence(newSentence);
            }

            // Refresh paper details if we have a new paper
            if (newPaperId && !paperDetails[newPaperId]) {
            setPaperDetails(prev => ({
                ...prev,
                [newPaperId]: {
                title: newPaperTitle,
                authors: [],
                url: `https://www.semanticscholar.org/paper/${newPaperId}`
                }
            }));
            
            fetchPaperDetailsIndividual([{ 
                paper_id: newPaperId, 
                paper_title: newPaperTitle, 
                cited_sentence: newSentence // Use the new sentence text
            }]);
            }

        } catch (error) {
            console.error('Error reciting:', error);
            // Show error notification to user
        } finally {
            // Clear loading state regardless of success or failure
            setLoadingRecite(prev => ({ ...prev, [citedSentence]: false }));
        }
    };

    

    const saveContentToSupabase = async () => {
        try {
            if (!tiptapRef.current || !fileId) return;
            
            const content = tiptapRef.current.getContent();
            
            const { error } = await supabase
            .from('files_pro')
            .update({ content })
            .eq('id', fileId);

            if (error) {
            console.error('Error saving content to Supabase:', error);
            } else {
            console.log('Content successfully saved to Supabase');
            }
        } catch (error) {
            console.error('Error in saveContentToSupabase:', error);
        }
    };

    useEffect(() => {
        // Re-apply highlights whenever highlightedSentences changes
        if (tiptapRef.current && highlightedSentences.length > 0) {
            // Use a small timeout to ensure the DOM is updated
            setTimeout(() => {
            highlightedSentences.forEach(sentence => {
                tiptapRef.current.toggleSentenceHighlight(sentence.sentence, sentence.isActive);
            });
            }, 100);
        }
    }, [highlightedSentences]);

    useEffect(() => {
        // Re-apply highlights whenever highlightedSentences changes
        if (tiptapRef.current && highlightedSentences.length > 0) {
            // Use a small timeout to ensure the DOM is updated
            setTimeout(() => {
            // Only update sentences that need highlighting changes
            const sentencesToUpdate = highlightedSentences.filter(sentence => 
                sentence.isActive || 
                !highlightedSentences.find(s => s.sentence === sentence.sentence && !s.isActive)
            );
            
            if (sentencesToUpdate.length > 0) {
                tiptapRef.current.toggleSentenceHighlight(sentencesToUpdate[0].sentence, sentencesToUpdate[0].isActive);
            }
            }, 100);
        }
    }, [highlightedSentences]);

    return (
        <main className='relative flex min-h-screen bg-[#F6F5F1] p-4 overflow-hidden'>
            <div className='flex w-full gap-6 h-[calc(100vh-2rem)]'>
                {/* Tiptap Editor */}
                <div className='w-[70%] rounded-lg overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none]'>
                    <style jsx>{`
                    .overflow-y-auto::-webkit-scrollbar {
                        display: none;
                    }
                    `}</style>
                    <Suspense fallback={<div>Loading editor tool...</div>}>
                        <Tiptap ref={tiptapRef} />
                    </Suspense>
                </div>
                
                {/* Right Panel */}
                <div className='w-[30%]'>
                    <div className='sticky top-4 h-full bg-white rounded-lg shadow-md p-6 overflow-y-auto'>
                        <div className='space-y-4'>
                            {/* Cited Sentences Section */}
                            <div className='p-4 border border-gray-200 rounded-lg'>
                            <div 
                                className="flex items-center justify-between cursor-pointer mb-4"
                                onClick={toggleListExpand}
                            >
                                <h3 className='font-semibold text-lg'>
                                Cited Sentences ({highlightedSentences.length})
                                </h3>
                                {listExpanded ? (
                                <ChevronDown className="h-5 w-5 text-gray-500" />
                                ) : (
                                <ChevronRight className="h-5 w-5 text-gray-500" />
                                )}
                            </div>
                            
                            {loading ? (
                                <div className="space-y-3">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="animate-pulse">
                                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-4 bg-gray-100 rounded w-full"></div>
                                    </div>
                                ))}
                                </div>
                            ) : listExpanded && (
                                <div className="space-y-4">
                                {highlightedSentences.map((item, index) => {
                                    const isExpanded = expandedSentence === item.sentence;
                                    const isActive = item.isActive;
                                    const paperDetailsForSentence = paperDetails[item.paper_id];
                                    
                                    return (
                                    <div 
                                        key={index} 
                                        className={`border-b border-gray-100 pb-4 last:border-0 rounded transition-colors ${
                                        isActive ? 'bg-orange-50 border-orange-200' : 'hover:bg-gray-50'
                                        }`}
                                    >
                                        <div 
                                        className="flex items-start cursor-pointer"
                                        onClick={() => handleSentenceClick(item.sentence)}
                                        >
                                            <div className="flex-shrink-0 pt-1 pr-2">
                                                {isExpanded ? (
                                                <ChevronDown className="h-4 w-4 text-gray-500" />
                                                ) : (
                                                <ChevronRight className="h-4 w-4 text-gray-500" />
                                                )}
                                            </div>
                                            <div className="flex-grow">
                                                {/* Display the cited sentence */}
                                                <p className="text-sm text-gray-700 italic">
                                                "{item.sentence}"
                                                </p>
                                            </div>
                                        </div>
                                        
                                        {isExpanded && (
                                            <div className="pl-6 pt-3">
                                                {/* Paper details section - similar to References */}
                                                <div className="flex flex-wrap gap-2 text-xs">        
                                                <a
                                                    href={paperDetailsForSentence?.url || `https://www.semanticscholar.org/paper/${item.paper_id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center text-blue-600 hover:text-blue-800"
                                                >
                                                    View Paper
                                                    <ExternalLink className="h-3 w-3 ml-1" />
                                                </a>
                                                </div>
                                                
                                                {/* Add the three buttons here */}
                                                <div className="flex gap-2 mt-2">
                                                <button 
                                                    className="px-3 py-1.5 bg-amber-50 text-amber-700 text-xs rounded-md border border-amber-200 hover:bg-amber-100 hover:border-amber-300 transition-colors hover:cursor-pointer shadow-sm hover:shadow-md flex items-center justify-center font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRephrase(item.sentence);
                                                    }}
                                                    disabled={loadingRephrase[item.sentence]}
                                                    >
                                                    {loadingRephrase[item.sentence] ? (
                                                        <div className="flex items-center">
                                                        <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-amber-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Processing...
                                                        </div>
                                                    ) : (
                                                        'Rephrase'
                                                    )}
                                                </button>
                                                <button 
                                                    className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs rounded-md border border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-colors hover:cursor-pointer shadow-sm hover:shadow-md flex items-center justify-center font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRecite(item.sentence);
                                                    }}
                                                    disabled={loadingRecite[item.sentence]}
                                                    >
                                                    {loadingRecite[item.sentence] ? (
                                                        <div className="flex items-center">
                                                        <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Processing...
                                                        </div>
                                                    ) : (
                                                        'Recite'
                                                    )}
                                                </button>
                                                <button 
                                                    className="px-3 py-1.5 bg-red-50 text-red-700 text-xs rounded-md border border-red-200 hover:bg-red-100 hover:border-red-300 transition-colors hover:cursor-pointer shadow-sm hover:shadow-md flex items-center justify-center font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRemoveSentence(item.sentence);
                                                    }}
                                                    disabled={removingSentence === item.sentence}
                                                >
                                                    {removingSentence === item.sentence ? (
                                                        <div className="flex items-center">
                                                            <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-red-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                            Removing...
                                                        </div>
                                                    ) : (
                                                        'Remove'
                                                    )}
                                                </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    )
                                })}
                                </div>
                            )}
                            </div>
                            
                            {/* References Section */}
                            <div className='p-4 border border-gray-200 rounded-lg'>
                                <div 
                                    className="flex items-center justify-between cursor-pointer mb-4"
                                    onClick={toggleListExpand}
                                >
                                    <h3 className='font-semibold text-lg'>
                                        References ({uniqueReferences.length})
                                    </h3>
                                    {listExpanded ? (
                                        <ChevronDown className="h-5 w-5 text-gray-500" />
                                    ) : (
                                        <ChevronRight className="h-5 w-5 text-gray-500" />
                                    )}
                                </div>
                                
                                {fetchError && (
                                    <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded mb-4 text-sm">
                                        {fetchError}
                                    </div>
                                )}
                                
                                {loading ? (
                                    <div className="space-y-3">
                                        {Array.from({ length: 3 }).map((_, i) => (
                                            <div key={i} className="animate-pulse">
                                                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                                                <div className="h-4 bg-gray-100 rounded w-full"></div>
                                            </div>
                                        ))}
                                    </div>
                                ) : listExpanded && (
                                    <div className="space-y-4">
                                        {uniqueReferences.map((ref) => {
                                            const details = paperDetails[ref.paper_id]
                                            const isExpanded = expandedPapers[ref.paper_id] || false
                                            const hasError = details?.error
                                            
                                            return (
                                                <div key={ref.paper_id} className="border-b border-gray-100 pb-4 last:border-0">
                                                    <div 
                                                        className="flex items-start cursor-pointer group"
                                                        onClick={() => togglePaperExpand(ref.paper_id)}
                                                    >
                                                        <div className="flex-shrink-0 pt-1 pr-2">
                                                            {isExpanded ? (
                                                                <ChevronDown className="h-4 w-4 text-gray-500" />
                                                            ) : (
                                                                <ChevronRight className="h-4 w-4 text-gray-500" />
                                                            )}
                                                        </div>
                                                        <div className="flex-grow">
                                                            <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                                                {details?.title || ref.paper_title}
                                                            </h4>
                                                            {details?.authors && details.authors.length > 0 && (
                                                                <p className="text-sm text-gray-600 mt-1">
                                                                    {details.authors.slice(0, 3).join(', ')}
                                                                    {details.authors.length > 3 && ' et al.'}
                                                                    {details.year && ` • ${details.year}`}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    
                                                    {isExpanded && details && (
                                                        <div className="pl-6 pt-3 space-y-3">
                                                            <div className="flex flex-wrap gap-2 text-sm">
                                                                {details.year && (
                                                                    <span className="bg-gray-100 px-2 py-1 rounded">
                                                                        {details.year}
                                                                    </span>
                                                                )}
                                                                <a
                                                                    href={details.url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="inline-flex items-center text-blue-600 hover:text-blue-800"
                                                                >
                                                                    View Paper
                                                                    <ExternalLink className="h-3 w-3 ml-1" />
                                                                </a>
                                                            </div>
                                                            
                                                            {details.abstract && (
                                                                <div className="mt-3">
                                                                    <h5 className="text-sm font-medium text-gray-700 mb-1">Abstract</h5>
                                                                    <p className="text-sm text-gray-600">
                                                                        {details.abstract}
                                                                    </p>
                                                                </div>
                                                            )}
                                                            
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Bibliography Formats Section */}
                            <div className='p-4 border border-gray-200 rounded-lg'>
                                <div 
                                    className="flex items-center justify-between cursor-pointer mb-4"
                                    onClick={() => setBibExpanded(!bibExpanded)}
                                >
                                    <h3 className='font-semibold text-lg'>
                                        Bibliography Formats
                                    </h3>
                                    {bibExpanded ? (
                                        <ChevronDown className="h-5 w-5 text-gray-500" />
                                    ) : (
                                        <ChevronRight className="h-5 w-5 text-gray-500" />
                                    )}
                                </div>

                                {bibExpanded && (
                                    <div className="space-y-4">
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {(['APA', 'MLA', 'Chicago', 'Harvard'] as CitationStyle[]).map(style => (
                                                <button
                                                    key={style}
                                                    onClick={() => setCitationStyle(style)}
                                                    className={`hover:cursor-pointer px-3 py-1 text-sm rounded-md ${citationStyle === style 
                                                        ? 'bg-blue-600 text-white' 
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                                >
                                                    {style}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="relative">
                                            <textarea
                                                className="w-full h-64 p-3 border border-gray-300 rounded-md bg-gray-50 text-sm font-mono resize-none"
                                                value={uniqueReferences.map(ref => 
                                                    formatCitation(ref.paper_id, citationStyle)
                                                ).join('\n\n')}
                                                readOnly
                                            />
                                            <button
                                                onClick={copyToClipboard}
                                                className="hover:cursor-pointer absolute top-2 right-2 p-2 bg-white rounded-md border border-gray-300 hover:bg-gray-100 transition-colors"
                                                title="Copy to clipboard"
                                            >
                                                <Copy className="h-4 w-4 text-gray-600" />
                                            </button>
                                        </div>

                                        <div className="text-xs text-gray-500">
                                            <p>Citations are automatically formatted in {citationStyle} style.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showRephrasePopup && (
                <div 
                    className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
                    onClick={() => setShowRephrasePopup(false)}
                >
                    <div 
                    className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-196 overflow-y-auto animate-popup"
                    onClick={(e) => e.stopPropagation()}
                    >
                    <h3 className="text-lg font-semibold mb-4">Choose a rephrasing option:</h3>
                    
                    <div className="space-y-3 mb-4">
                        {rephraseOptions.map((option, index) => (
                            <div 
                            key={index}
                            className={`p-3 border rounded-md cursor-pointer transition-colors ${
                                selectedRephrase === option 
                                ? 'border-green-500 bg-green-50' 
                                : 'border-gray-200 hover:border-green-300'
                            } ${applyingRephrase ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={() => !applyingRephrase && setSelectedRephrase(option)}
                            >
                            <p className="text-sm">{option}</p>
                            </div>
                        ))}
                    </div>
                    
                    <div className="flex justify-end gap-2">
                        <button
                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
                        onClick={() => setShowRephrasePopup(false)}
                        disabled={applyingRephrase}
                        >
                        Cancel
                        </button>
                        <button
                        className="px-4 py-2 bg-amber-500 text-white text-sm rounded-md hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px] hover:cursor-pointer"
                        onClick={() => applyRephrase(selectedRephrase)}
                        disabled={!selectedRephrase || applyingRephrase}
                        >
                        {applyingRephrase ? (
                            <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Applying...
                            </>
                        ) : (
                            'Apply Rephrase'
                        )}
                        </button>
                    </div>
                    </div>
                    
                    <style jsx>{`
                    @keyframes popup {
                        0% {
                        transform: scale(0.85);
                        opacity: 0;
                        }
                        100% {
                        transform: scale(1);
                        opacity: 1;
                        }
                    }
                    
                    .animate-popup {
                        animation: popup 0.175s ease-out forwards;
                    }
                    `}</style>
                </div>
            )}
        </main>
    )
}