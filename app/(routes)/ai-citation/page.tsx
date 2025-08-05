'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useSearchParams } from 'next/navigation'
import ExistingPDFViewer from '@/components/ExistingPDFViewer';
import { ChevronDown, ChevronRight, ExternalLink, Copy } from 'lucide-react';

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

export default function Citation() {
    const searchParams = useSearchParams()
    const fileId = searchParams.get('fileId')
    const supabase = createClient()
    const [uniqueReferences, setUniqueReferences] = useState<Reference[]>([])
    const [paperDetails, setPaperDetails] = useState<Record<string, PaperDetails>>({})
    const [loading, setLoading] = useState(true)
    const [expandedPapers, setExpandedPapers] = useState<Record<string, boolean>>({})
    const [pdfLoaded, setPdfLoaded] = useState(false)
    const [listExpanded, setListExpanded] = useState(true)
    const [bibExpanded, setBibExpanded] = useState(true)
    const [fetchError, setFetchError] = useState<string | null>(null)
    const [citationStyle, setCitationStyle] = useState<CitationStyle>('MLA')
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        if (!fileId || !pdfLoaded) return

        const fetchReferences = async () => {
            try {
                setLoading(true)
                setFetchError(null)
                const { data, error } = await supabase
                    .from('files')
                    .select('references')
                    .eq('id', fileId)
                    .single()

                if (error) throw error
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

        fetchReferences()
    }, [fileId, supabase, pdfLoaded])

    const fetchPaperDetailsBatch = async (refs: Reference[]) => {
        try {
            setFetchError(null)
            const paperIds = refs.map(ref => ref.paper_id).filter(Boolean)
            
            if (paperIds.length === 0) return

            const apiUrl = `https://api.semanticscholar.org/graph/v1/paper/batch?fields=title,authors,year,url,abstract,fieldsOfStudy,publicationDate`
            console.log('Fetching paper details in batch from:', apiUrl)
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'x-api-key': process.env.SEMANTIC_SCHOLAR_API_KEY || '',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ids: paperIds
                })
            })
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            
            const batchData = await response.json()
            const details: Record<string, PaperDetails> = {}

            refs.forEach((ref, index) => {
                const paperData = batchData[index]
                if (paperData && !paperData.error) {
                    details[ref.paper_id] = {
                        title: paperData.title || ref.paper_title,
                        authors: paperData.authors?.map((a: any) => a.name) || [],
                        url: paperData.url || `https://www.semanticscholar.org/paper/${ref.paper_id}`,
                        year: paperData.year,
                        abstract: paperData.abstract,
                        fieldsOfStudy: paperData.fieldsOfStudy,
                        publicationDate: paperData.publicationDate
                    }
                } else {
                    details[ref.paper_id] = {
                        title: ref.paper_title,
                        authors: [],
                        url: `https://www.semanticscholar.org/paper/${ref.paper_id}`,
                        error: paperData?.error || 'Failed to fetch details'
                    }
                }
            })
            
            setPaperDetails(details)
        } catch (error) {
            console.error('Error in fetchPaperDetailsBatch:', error)
            setFetchError('Failed to fetch paper details from Semantic Scholar')
            
            if (refs.length > 0) {
                console.log('Attempting fallback to individual requests...')
                await fetchPaperDetailsIndividual(refs)
            }
        }
    }

    const fetchPaperDetailsIndividual = async (refs: Reference[]) => {
        try {
            const details: Record<string, PaperDetails> = {}
            
            for (const ref of refs) {
                if (!ref.paper_id) continue
                
                try {
                    const apiUrl = `https://api.semanticscholar.org/graph/v1/paper/${ref.paper_id}?fields=title,authors,year,url,abstract,fieldsOfStudy,publicationDate`
                    console.log('Fetching individual paper details from:', apiUrl)
                    
                    const response = await fetch(apiUrl, {
                        headers: {
                            'x-api-key': process.env.SEMANTIC_SCHOLAR_API_KEY || ''
                        }
                    })
                    
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`)
                    }
                    
                    const data = await response.json()
                    details[ref.paper_id] = {
                        title: data.title || ref.paper_title,
                        authors: data.authors?.map((a: any) => a.name) || [],
                        url: data.url || `https://www.semanticscholar.org/paper/${ref.paper_id}`,
                        year: data.year,
                        abstract: data.abstract,
                        fieldsOfStudy: data.fieldsOfStudy,
                        publicationDate: data.publicationDate
                    }
                } catch (error) {
                    console.error(`Error fetching details for paper ${ref.paper_id}:`, error)
                    details[ref.paper_id] = {
                        title: ref.paper_title,
                        authors: [],
                        url: `https://www.semanticscholar.org/paper/${ref.paper_id}`,
                        error: 'Failed to fetch details'
                    }
                }
                
                await new Promise(resolve => setTimeout(resolve, 200))
            }
            
            setPaperDetails(details)
        } catch (error) {
            console.error('Error in fetchPaperDetailsIndividual:', error)
        }
    }

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

    return (
        <main className='relative flex min-h-screen bg-[#F6F5F1] p-4'>
            <div className='flex w-full gap-6'>
                {/* PDF Viewer */}
                <div className='w-[70%] rounded-lg overflow-hidden'>
                    <ExistingPDFViewer onLoadComplete={() => setPdfLoaded(true)} />
                </div>
                
                {/* References Panel */}
                <div className='w-[50%]'>
                    <div className='sticky top-4 h-[calc(100vh-2rem)] bg-white rounded-lg shadow-md p-6 overflow-y-auto'>
                        <div className='space-y-4'>
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
                                
                                {!pdfLoaded ? (
                                    <div className="flex items-center justify-center py-8">
                                        <div className="text-gray-500">
                                            Document processing in progress...
                                        </div>
                                    </div>
                                ) : loading ? (
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
                                                            {hasError && (
                                                                <p className="text-sm text-red-500 mt-1">
                                                                    Could not load full details
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
        </main>
    )
}