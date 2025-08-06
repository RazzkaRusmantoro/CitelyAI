
'use client';

import { Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Reference {
  id: string;
  title: string;
  abstract?: string;
  authors?: { name: string }[];
  year?: number;
  url?: string;
}

export function BibliographyTable({ 
  initialReferences,
  userId 
}: { 
  initialReferences: Reference[];
  userId: string;
}) {
  const [references, setReferences] = useState<Reference[]>(initialReferences);

  async function handleDelete(referenceId: string) {
    try {

      setReferences(prev => prev.filter(ref => ref.id !== referenceId));

      const response = await fetch('/api/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, referenceId }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete reference');
      }
    } catch (error) {
      console.error('Error deleting reference:', error);
      setReferences(initialReferences);
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden mr-4">
      <div className="grid grid-cols-10 gap-4 p-4 bg-gray-100 dark:bg-gray-700 font-semibold">
        <div className="col-span-6">Title</div>
        <div className="col-span-3">Authors</div>
        <div className="col-span-1">Year</div>
      </div>
      
      {references.length > 0 ? (
        references.map((ref) => (
          <div 
            key={ref.id} 
            className="grid grid-cols-10 gap-4 p-4 border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="col-span-6 flex items-start justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {ref.url ? (
                    <a href={ref.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {ref.title}
                    </a>
                  ) : (
                    ref.title
                  )}
                </h3>
                {ref.abstract && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                    {ref.abstract}
                  </p>
                )}
              </div>
              <button 
                onClick={() => handleDelete(ref.id)}
                className="hover:cursor-pointer text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors ml-2"
                title="Delete reference"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
            
            <div className="col-span-3 text-gray-700 dark:text-gray-300">
              {ref.authors && ref.authors.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {ref.authors.slice(0, 3).map((author, index) => (
                    <span key={index} className="text-sm">
                      {author.name}
                      {index < ref.authors!.length - 1 && index < 2 ? ',' : ''}
                    </span>
                  ))}
                  {ref.authors.length > 3 && (
                    <span className="text-sm">+{ref.authors.length - 3} more</span>
                  )}
                </div>
              ) : (
                'Authors not available'
              )}
            </div>
            
            <div className="col-span-1 text-gray-600 dark:text-gray-400">
              {ref.year || 'N/A'}
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-10 p-4 text-center text-gray-600 dark:text-gray-400">
          No references found
        </div>
      )}
    </div>
  );
}