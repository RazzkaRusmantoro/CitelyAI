'use client'

import { IconFileText, IconLink, IconClipboardText } from '@tabler/icons-react';
import { useState, ChangeEvent } from 'react';

export default function DashboardSummarizer() {
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    setIsTyping(newText.length > 0);
  };

  const showPlaceholderContent = !isTyping;

  return (
    <main className="min-h-full w-full">
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
                    <div className="relative flex bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden pointer-events-auto">
                      <button className="hover:cursor-pointer relative px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-1">
                        <IconFileText className="h-4 w-4" />
                        <span>Sample Text</span>
                      </button>
                      <div className="h-full w-px bg-gray-200"></div>
                      <button className="hover:cursor-pointer relative px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-1">
                        <IconLink className="h-4 w-4" />
                        <span>Add URL</span>
                      </button>
                      <div className="h-full w-px bg-gray-200"></div>
                      <button className="hover:cursor-pointer relative px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-1">
                        <IconClipboardText className="h-4 w-4" />
                        <span>Paste Text</span>
                      </button>
                    </div>

                    <div className="mt-2 bg-white/90 px-2 py-1 rounded text-xs text-gray-500 pointer-events-auto">
                      OR drag & drop file/image
                    </div>
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
                  <button className="hover:cursor-pointer bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
                    Summarize
                  </button>
                </div>
              </div>
              
              <div className="flex-1">
                <div className="h-96 p-4">
                  <div className="w-full h-full text-gray-500">
                    Your summarized content will appear here...
                  </div>
                </div>
                <div className="border-t border-gray-200 p-4 flex justify-end">
                  <button className="hover:cursor-pointer text-gray-700 hover:bg-gray-100 font-medium py-2 px-4 rounded-lg transition-colors border border-gray-300 mr-2">
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}