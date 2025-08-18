"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface DocumentCardProps {
  documentNumber: number;
  title?: string;
  modifiedDate?: string;
  width?: string;
  height?: string;
  fileUrl?: string;
  fileId?: string;
}

export const DocumentCard = ({
  documentNumber,
  title = `Document ${documentNumber}`,
  modifiedDate = 'Modified today',
  width = '160px',
  height = '226px',
  fileUrl,
  fileId
}: DocumentCardProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!fileUrl) {
      setLoading(false);
      return;
    }

    const loadPreview = async () => {
      try {
        const loadingTask = pdfjs.getDocument(fileUrl);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);
        
        const viewport = page.getViewport({ scale: 0.5 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        await page.render({
          canvasContext: context!,
          viewport
        }).promise;
        
        setPreviewUrl(canvas.toDataURL());
      } catch (error) {
        console.error('Error generating PDF preview:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPreview();
  }, [fileUrl]);

  return (
    <Link 
      href={`/ai-citation${fileId ? `?fileId=${fileId}` : ''}`} // Update href to include fileId
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden
             transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:-translate-y-2 hover:shadow-lg hover:rotate-5 hover:scale-[1.02]"
      style={{ width, height }}
    >
      <div className="h-full flex flex-col">
        <div className="flex-1 bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
          {loading ? (
            <div className="animate-pulse w-full h-full bg-gray-200 dark:bg-gray-600"></div>
          ) : previewUrl ? (
            <img 
              src={previewUrl} 
              alt={`Preview of ${title}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <svg 
              className="w-10 h-10 text-gray-400 dark:text-gray-500 transition-transform duration-300 group-hover:scale-110" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
              />
            </svg>
          )}
        </div>
        <div className="p-3">
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate transition-all duration-300 group-hover:text-gray-900 dark:group-hover:text-white">
            {title}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{modifiedDate}</p>
        </div>
      </div>
    </Link>
  );
};