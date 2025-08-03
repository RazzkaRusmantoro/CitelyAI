'use client'

import { IconFileText, IconLink, IconClipboardText, IconArrowRight } from '@tabler/icons-react';
import { useState, ChangeEvent, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

export default function DashboardSummarizer() {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [url, setUrl] = useState('');
  const urlInputRef = useRef<HTMLInputElement>(null);

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    setIsTyping(newText.length > 0);
  };

  const handlePasteText = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText);
      setIsTyping(clipboardText.length > 0);
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
      // Fallback for browsers that don't support clipboard API
      const textarea = document.createElement('textarea');
      textarea.style.position = 'fixed';
      document.body.appendChild(textarea);
      textarea.focus();
      const result = document.execCommand('paste');
      if (result) {
        setText(textarea.value);
        setIsTyping(textarea.value.length > 0);
      }
      document.body.removeChild(textarea);
    }
  };

  const handleSummarize = async () => {
    if (!text.trim()) {
      setError('Please enter some text to summarize');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setSummary(data.summary);
    } catch (err) {
      console.error('Failed to summarize text:', err);
      setError('Failed to summarize text. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSummarizeUrl = async (url: string) => {
    if (!url.trim()) {
      setError('Please enter a valid URL');
      return;
    }

    setIsLoading(true);
    setError('');
    setShowUrlInput(false);

    try {
      const response = await fetch('http://localhost:5000/api/summarize-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setSummary(data.summary);
      setUrl(''); // Clear the URL input after successful submission
    } catch (err) {
      console.error('Failed to summarize URL:', err);
      setError('Failed to summarize URL. Please check the URL and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopySummary = () => {
    if (!summary) return;
    navigator.clipboard.writeText(summary)
      .then(() => {
        console.log('Summary copied to clipboard');
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  const handleAddUrlClick = () => {
    setShowUrlInput(true);
  };

  const handleUrlSubmit = () => {
    if (url.trim()) {
      handleSummarizeUrl(url);
    }
  };

  useEffect(() => {
    if (showUrlInput && urlInputRef.current) {
      urlInputRef.current.focus();
    }
  }, [showUrlInput]);

  const handleClickOutside = (e: React.MouseEvent) => {
    if (showUrlInput && 
        e.target !== urlInputRef.current && 
        !(e.target as HTMLElement).closest('.url-input-container')) {
      setShowUrlInput(false);
      setUrl('');
    }
  };

  const showPlaceholderContent = !isTyping;

  return (
    <main className="min-h-full w-full" onClick={handleClickOutside}>
      <div className="w-full">
        <div className="relative top-20 ml-20 space-y-2">
          <div className="">
            <h1 className="text-3xl md:text-4xl font-bold text-black dark:text-white">
                Quick Paper Summarizer
            </h1>
            <p className="text-xl md:text-2xl font-medium text-gray-800 dark:text-gray-300">
              Summarize complex academic texts into concise insights with AI
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-1 mt-8 w-full max-w-5xl">
            <div className="flex flex-col md:flex-row">
              <div className="flex-1 border-r border-gray-200 relative">
                {showPlaceholderContent && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
                    {showUrlInput ? (
                      <div className="url-input-container flex items-center pointer-events-auto bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
                        <input
                          ref={urlInputRef}
                          type="url"
                          className="px-3 py-1.5 text-sm w-64 focus:outline-none"
                          placeholder="https://example.com/article"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                        />
                        <button 
                          className={`hover:cursor-pointer px-2 py-1.5 text-gray-700 hover:bg-gray-50 transition-all ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                          onClick={handleUrlSubmit}
                          disabled={isLoading}
                        >
                          <IconArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="relative flex bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden pointer-events-auto">
                          <button className="hover:cursor-pointer relative px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-1">
                            <IconFileText className="h-4 w-4" />
                            <span>Sample Text</span>
                          </button>
                          <div className="h-full w-px bg-gray-200"></div>
                          <button 
                            className="hover:cursor-pointer relative px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-1"
                            onClick={handleAddUrlClick}
                          >
                            <IconLink className="h-4 w-4" />
                            <span>Add URL</span>
                          </button>
                          <div className="h-full w-px bg-gray-200"></div>
                          <button 
                            className="hover:cursor-pointer relative px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-1"
                            onClick={handlePasteText}
                          >
                            <IconClipboardText className="h-4 w-4" />
                            <span>Paste Text</span>
                          </button>
                        </div>

                        <div className="mt-2 bg-white/90 px-2 py-1 rounded text-xs text-gray-500 pointer-events-auto">
                          OR drag & drop file (not yet complete)
                        </div>
                      </>
                    )}
                  </div>
                )}

                <div className="h-96 p-4">
                  <textarea 
                    className="w-full h-full text-gray-700 focus:outline-none resize-none"
                    placeholder={showPlaceholderContent ? "Enter or paste paper here..." : ""}
                    value={text}
                    onChange={handleTextChange}
                  />
                </div>
                <div className="border-t border-gray-200 p-4 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Word count: {text.split(/\s+/).filter(Boolean).length} | Character count: {text.length}
                  </div>
                  <button 
                    className={`hover:cursor-pointer bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-6 rounded-lg transition-colors ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    onClick={handleSummarize}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Summarizing...' : 'Summarize'}
                  </button>
                </div>
              </div>
              
              <div className="flex-1">
                <div className="h-96 p-4">
                    {summary ? (
                    <div className="w-full h-full overflow-auto">
                        <ReactMarkdown
                        components={{
                            h2: ({node, ...props}) => (
                            <h2 className="text-lg font-bold mt-4 mb-2 text-gray-800 border-b pb-1" {...props}/>
                            ),
                            ul: ({node, ...props}) => (
                            <ul className="list-disc pl-5 space-y-2 my-2" {...props}/>  
                            ),
                            li: ({node, ...props}) => (
                            <li className="text-gray-700 leading-relaxed block" {...props}/> 
                            ),
                            p: ({node, ...props}) => (
                            <p className="text-gray-700 mb-3 leading-relaxed" {...props}/>
                            )
                        }}
                        >
                        {summary}
                        </ReactMarkdown>
                    </div>
                    ) : (
                    <div className="w-full h-full text-gray-500 flex items-center justify-center">
                        {isLoading ? 'Generating summary...' : 'Your summarized content will appear here...'}
                    </div>
                    )}
                </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}