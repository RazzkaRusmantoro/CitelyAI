'use client';
import { useState, useCallback, ChangeEvent } from 'react';

export default function UploadBox() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

  const ALLOWED_FILE_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];

  const handleFileChange = useCallback((selectedFile: File | null) => {
    setError(null);
    
    if (!selectedFile) {
      setFile(null);
      return;
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(selectedFile.type)) {
      setError('Invalid file type. Please upload a PDF, DOCX, or TXT file.');
      return;
    }

    // Validate file size
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError('File size exceeds the 20MB limit.');
      return;
    }

    setFile(selectedFile);
  }, []);

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    handleFileChange(selectedFile);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0] || null;
    handleFileChange(droppedFile);
  };

  return (
    <div className="w-full max-w-3xl bg-white rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 dark:bg-gray-800 mt-5 p-4">
      <div 
        className={`relative rounded-md border-2 border-dashed ${isDragging ? 'border-blue-500' : 'border-gray-300 dark:border-gray-600'} bg-gray-50/50 dark:bg-gray-700/30 flex flex-col items-center justify-center gap-2 p-8 transition-colors`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <input 
          type="file" 
          id="file-upload"
          className="hidden"
          accept=".pdf,.docx,.txt"
          onChange={onInputChange}
        />
        
        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center gap-2">
          <div className={`w-6 h-6 rounded-full ${file ? 'bg-green-100 dark:bg-green-900' : 'bg-gray-200 dark:bg-gray-600'} flex items-center justify-center`}>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-4 w-4 ${file ? 'text-green-600 dark:text-green-300' : 'text-gray-500 dark:text-gray-400'}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d={file ? "M5 13l4 4L19 7" : "M12 4v16m8-8H4"} 
              />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {file ? file.name : 'Upload or drag a file here'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : 'PDF, DOCX, or TXT files (max 20MB)'}
            </p>
          </div>
        </label>

        {file && (
          <button
            type="button"
            className="mt-2 text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400"
            onClick={() => {
              setFile(null);
              setError(null);
              // Clear the file input value
              const fileInput = document.getElementById('file-upload') as HTMLInputElement;
              if (fileInput) fileInput.value = '';
            }}
          >
            Remove file
          </button>
        )}

        {error && (
          <p className="mt-2 text-xs text-red-500 dark:text-red-400">{error}</p>
        )}
      </div>
    </div>
  );
};