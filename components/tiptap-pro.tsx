'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import { forwardRef, useImperativeHandle, useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { ColorHighlightPopover } from '@/components/tiptap-ui/color-highlight-popover'
import { EditorContext } from '@tiptap/react'

interface HighlightedSentence {
  sentence: string;
  color: string;
  isActive: boolean;
}

interface TiptapProps {
  processingComplete?: boolean;
}

type ProcessingStatus = 'idle' | 'processing' | 'complete' | 'failed';

const Tiptap = forwardRef(({ processingComplete }: TiptapProps, ref) => {
  const searchParams = useSearchParams()
  const fileId = searchParams.get('fileId')
  const [isLoading, setIsLoading] = useState(!!fileId)
  const [citedSentences, setCitedSentences] = useState<HighlightedSentence[]>([])
  const supabase = createClient()
  const editorRef = useRef<HTMLDivElement>(null)
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>('idle')
  const [initialCheckComplete, setInitialCheckComplete] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: 'my-paragraph',
          },
        },
      }),
      Highlight.configure({ multicolor: true }),
    ],
    content: '<p></p>',
    editorProps: {
      attributes: {
        class: 'prose focus:outline-none min-h-full',
      },
    },
    immediatelyRender: false,
  })

  // Function to highlight cited sentences
  const highlightCitedSentences = (editorInstance: any, sentencesToHighlight: HighlightedSentence[]) => {
    if (!editorInstance || sentencesToHighlight.length === 0) return

    // Get the current content as text (without HTML tags)
    const contentText = editorInstance.getText();
    
    // First, clear only the highlights that are no longer needed
    const currentHighlights = new Set(sentencesToHighlight.map(s => s.sentence));
    
    // Then apply new highlights
    sentencesToHighlight.forEach(({sentence, isActive}) => {
      // Clean the sentence for better matching
      const cleanSentence = sentence.replace(/<[^>]*>/g, '').trim()
      if (!cleanSentence) return

      // Use a more flexible matching approach
      const escapedSentence = cleanSentence.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      // Try exact match first
      let regex = new RegExp(escapedSentence, 'gi');
      let match = regex.exec(contentText);
      
      // If no exact match, try a more flexible approach (match most words)
      if (!match) {
        const words = cleanSentence.split(/\s+/).filter(word => word.length > 3);
        if (words.length > 0) {
          const pattern = words.join('.*');
          regex = new RegExp(pattern, 'gi');
          match = regex.exec(contentText);
        }
      }
      
      if (match) {
        const start = match.index;
        const end = start + match[0].length;
        
        // Set selection and apply highlight
        editorInstance.commands.setTextSelection({ from: start + 1, to: end + 1 });
        
        if (isActive) {
          editorInstance.commands.setHighlight({ color: 'var(--tt-color-highlight-orange)' });
        } else {
          editorInstance.commands.setHighlight({ color: 'var(--tt-color-highlight-yellow)' });
        }
      }
    });
    
    // Clear selection after highlighting
    editorInstance.commands.setTextSelection({ from: 0, to: 0 });
  };

  // Function to toggle sentence highlight
  const toggleSentenceHighlight = (sentence: string) => {
    setCitedSentences(prev => {
      const updated = prev.map(item => 
        item.sentence === sentence 
          ? {...item, isActive: !item.isActive} 
          : item
      );
      
      // Update highlights after state change
      if (editor) {
        setTimeout(() => highlightCitedSentences(editor, updated), 0);
      }
      
      return updated;
    });
  }

  const updateSentence = (oldSentence: string, newSentence: string) => {
    if (!editor) return;
    
    // Get the current content as text
    const contentText = editor.getText();
    
    // Clean the old sentence for better matching
    const cleanOldSentence = oldSentence.replace(/<[^>]*>/g, '').trim();
    
    // Find the old sentence in the content
    const regex = new RegExp(cleanOldSentence.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const match = regex.exec(contentText);
    
    if (match) {
      const start = match.index + 1;
      const end = start + cleanOldSentence.length;
      
      // Replace the text in the editor
      editor.commands.setTextSelection({ from: start, to: end });
      editor.commands.deleteSelection();
      editor.commands.insertContent(newSentence);
      
      // Clear selection
      editor.commands.setTextSelection({ from: 0, to: 0 });
    }
  };

  const updateCitation = (oldSentence: string, newCitation: string) => {
    if (!editor) return;
    
    // Get the current content as text
    const contentText = editor.getText();
    
    // Clean the old sentence for better matching
    const cleanOldSentence = oldSentence.replace(/<[^>]*>/g, '').trim();
    
    // Find the old sentence in the content
    const regex = new RegExp(cleanOldSentence.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const match = regex.exec(contentText);
    
    if (match) {
      const start = match.index + 1;
      const end = start + cleanOldSentence.length;
      
      // Create the new sentence with updated citation
      const sentenceWithoutCitation = cleanOldSentence.replace(/\([^)]*\)\.?$/, '').trim();
      const newSentence = `${sentenceWithoutCitation} ${newCitation}.`;
      
      // Replace the text in the editor
      editor.commands.setTextSelection({ from: start, to: end });
      editor.commands.deleteSelection();
      editor.commands.insertContent(newSentence);
      
      // Clear selection
      editor.commands.setTextSelection({ from: 0, to: 0 });
    }
  };

  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  const debouncedHighlightCitedSentences = useRef(
    debounce((editorInstance: any, sentences: HighlightedSentence[]) => {
      highlightCitedSentences(editorInstance, sentences);
    }, 50)
  ).current;

  useImperativeHandle(ref, () => ({
    getContent: () => {
      if (!editor) return ''
      return editor.getHTML()
    },
    clearContent: () => {
      if (!editor) return
      editor.commands.clearContent()
    },
    setContent: (content: string) => {
      if (!editor) return
      editor.commands.setContent(content)
      // Highlight cited sentences after setting content
      if (citedSentences.length > 0) {
        setTimeout(() => highlightCitedSentences(editor, citedSentences), 100)
      }
    },
    toggleSentenceHighlight: (sentence: string, shouldHighlight: boolean) => {
      if (!editor) return
      
      setCitedSentences(prev => {
        const updated = prev.map(item => 
          item.sentence === sentence 
            ? {...item, isActive: shouldHighlight} 
            : item
        );
        
        // Use debounced highlighting
        debouncedHighlightCitedSentences(editor, updated);
        
        return updated;
      });
    },
    scrollToSentence: (sentence: string) => {
      if (!editor) return
      
      // Get the current content as text (without HTML tags)
      const contentText = editor.getText();
      
      // Clean the sentence for better matching
      const cleanSentence = sentence.replace(/<[^>]*>/g, '').trim()
      if (!cleanSentence) return

      // Find the first occurrence of this sentence in the content
      const regex = new RegExp(cleanSentence.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
      const match = regex.exec(contentText);
      
      if (match) {
        const start = match.index;
        const end = start + cleanSentence.length;
        
        // Set selection to scroll to the sentence
        editor.commands.setTextSelection({ from: start, to: end });
        
        // Scroll the editor container to the selection
        const editorElement = editorRef.current;
        if (editorElement) {
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            range.startContainer.parentElement?.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            });
          }
        }
        
        // Clear selection after scrolling
        setTimeout(() => {
          editor.commands.setTextSelection({ from: 0, to: 0 });
        }, 1000);
      }
    },
    removeSentence: (sentence: string) => {
      if (!editor) return;
      
      // Get the current content as text
      const contentText = editor.getText();
      
      // Clean the sentence for better matching
      const cleanSentence = sentence.replace(/<[^>]*>/g, '').trim();
      if (!cleanSentence) return;
      
      // Find all occurrences of this sentence
      const regex = new RegExp(cleanSentence.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      let match;
      
      while ((match = regex.exec(contentText)) !== null) {
          const start = match.index;
          const end = start + match[0].length;
          
          // Set selection and delete the sentence
          editor.commands.setTextSelection({ from: start + 1, to: end + 1 });
          editor.commands.deleteSelection();
      }
      
      // Clear selection after deletion
      editor.commands.setTextSelection({ from: 0, to: 0 });
      
      // Also update the cited sentences state
      setCitedSentences(prev => 
          prev.filter(item => item.sentence !== sentence)
      );
    },
    findAndUpdateCitedSentences: (oldSentence: string, newSentence: string) => {
      setCitedSentences(prev => 
        prev.map(item => 
          item.sentence === oldSentence 
            ? { ...item, sentence: newSentence }
            : item
        )
      );
      return true;
    },
    updateCitation,
    clearAllHighlights: () => {
      if (!editor) return;
      editor.commands.unsetAllMarks();
      // Also reset all cited sentences to inactive
      setCitedSentences(prev => prev.map(item => ({...item, isActive: false})));
    },
    updateSentence,
    updateCitedSentence: (oldSentence: string, newSentence: string) => {
      setCitedSentences(prev => 
        prev.map(item => 
          item.sentence === oldSentence 
            ? { ...item, sentence: newSentence }
            : item
        )
      );
      return true;
    },
  }))

  // Function to check processing status and handle accordingly
  const checkProcessingStatus = async () => {
    if (!fileId) return;
    
    try {
      const { data: fileData, error } = await supabase
        .from('files_pro')
        .select('processing_status, content, cited_sentences')
        .eq('id', fileId)
        .single();

      if (error) throw error;
      
      if (fileData) {
        setProcessingStatus(fileData.processing_status as ProcessingStatus);
        
        // Handle different statuses
        switch (fileData.processing_status) {
          case 'idle':
            // Start citation processing
            await startCitationProcessing();
            break;
            
          case 'processing':
            // Keep showing loader, we'll check again later
            setIsLoading(true);
            // Set up polling to check status periodically
            setTimeout(checkProcessingStatus, 3000); // Check every 3 seconds
            break;
            
          case 'complete':
            // Load content and cited sentences
            if (fileData.content) {
              const htmlContent = fileData.content.startsWith('<') 
                ? fileData.content 
                : `<p>${fileData.content.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</p>`;
              
              if (editor) {
                editor.commands.setContent(htmlContent);
              }
              
              // Store cited sentences
              if (fileData.cited_sentences && Array.isArray(fileData.cited_sentences)) {
                const highlightedSentences = fileData.cited_sentences.map((item: any) => ({
                  sentence: item.text,
                  color: 'var(--tt-color-highlight-yellow)',
                  isActive: false
                }));
                setCitedSentences(highlightedSentences);
              }
              
              setIsLoading(false);
            }
            break;
            
          case 'failed':
            console.error('Citation processing failed. Please upload the file again.');
            setIsLoading(false);
            break;
            
          default:
            setIsLoading(false);
            break;
        }
      }
    } catch (error) {
      console.error('Error checking processing status:', error);
      setIsLoading(false);
    } finally {
      setInitialCheckComplete(true);
    }
  };

  // Function to start citation processing
  const startCitationProcessing = async () => {
    if (!fileId) return;
    
    try {
      // Update status to processing
      const { error: updateError } = await supabase
        .from('files_pro')
        .update({ processing_status: 'processing' })
        .eq('id', fileId);
        
      if (updateError) throw updateError;
      
      setProcessingStatus('processing');
      setIsLoading(true);
      
      // Call the citation API
      const apiResponse = await fetch('/api/cite-pro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileId }),
      });
      
      if (!apiResponse.ok) {
        throw new Error('API call failed');
      }
      
      // Set up polling to check when processing is complete
      setTimeout(checkProcessingStatus, 3000); // Check every 3 seconds
      
    } catch (error) {
      console.error('Error starting citation processing:', error);
      
      // Update status to failed
      await supabase
        .from('files_pro')
        .update({ processing_status: 'failed' })
        .eq('id', fileId);
        
      setProcessingStatus('failed');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!editor || !fileId || initialCheckComplete) return;

    // Initial check of processing status
    checkProcessingStatus();
  }, [fileId, editor, initialCheckComplete, supabase])

  // Effect to re-highlight when cited sentences change
  useEffect(() => {
    if (editor && citedSentences.length > 0) {
      // Delay highlighting to ensure editor is ready
      setTimeout(() => highlightCitedSentences(editor, citedSentences), 100)
    }
  }, [citedSentences, editor])
  
  // Show different loading messages based on processing status
  const getLoadingMessage = () => {
    switch (processingStatus) {
      case 'idle':
        return 'Preparing to process citations...';
      case 'processing':
        return 'Processing citations... This may take a few minutes.';
      case 'failed':
        return 'Citation processing failed. Please upload the file again.';
      default:
        return 'Loading content...';
    }
  };

  return (
    <EditorContext.Provider value={{ editor }}>
      <div 
        ref={editorRef}
        className="bg-white shadow-md p-8 mx-auto relative" 
        style={{ 
          width: '210mm', 
          minHeight: '297mm',
        }}
      >
        {isLoading && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
            <div className="animate-pulse flex flex-col items-center">
              {processingStatus !== 'failed' && (
                <svg className="animate-spin h-8 w-8 text-blue-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              <p>{getLoadingMessage()}</p>
            </div>
          </div>
        )}
        
        {/* Color Highlight Popover */}
        {editor && (
          <ColorHighlightPopover
            editor={editor}
            hideWhenUnavailable={true}
            onApplied={({ color, label }) => console.log(`Applied highlight: ${label} (${color})`)}
          />
        )}
        
        <EditorContent editor={editor} role="presentation" />
      </div>
    </EditorContext.Provider>
  )
})

Tiptap.displayName = 'Tiptap'

export default Tiptap