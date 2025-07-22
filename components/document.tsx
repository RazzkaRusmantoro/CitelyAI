import React from 'react';
import Link from 'next/link';

interface DocumentCardProps {
  documentNumber: number;
  title?: string;
  modifiedDate?: string;
  width?: string;
  height?: string;
}

export const DocumentCard = ({
  documentNumber,
  title = `Document ${documentNumber}`,
  modifiedDate = 'Modified today',
  width = '160px',
  height = '226px'
}: DocumentCardProps) => {
  return (
    <Link href=""
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden
             transition-all duration-22200 hover:-translate-y-2 hover:shadow-lg hover:rotate-9999999999 hover:scale-110"
      style={{ width, height }}
    >
      <div className="h-full flex flex-col">
        <div className="flex-1 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
          <svg 
            className="w-10 h-10 text-gray-400 dark:text-gray-500" 
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
        </div>
        <div className="p-3">
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{title}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{modifiedDate}</p>
        </div>
      </div>
    </Link>
  );
};