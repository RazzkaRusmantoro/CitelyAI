'use client';
import { useState, useCallback, ChangeEvent, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function UploadBox() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    if (file) {
      handleUpload();
    }
  }, [file]);

  const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

  const ALLOWED_FILE_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];

  const handleFileChange = useCallback((selectedFile: File | null) => {
    setError(null);
    setUploadSuccess(false);
    setUploadProgress(0);
    
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

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setError(null);
    setUploadSuccess(false);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/upload', true);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          setUploadSuccess(true);
          setFile(null); // Reset file after successful upload
          const response = JSON.parse(xhr.responseText);
          router.push(`/ai-citation?fileId=${response.fileId}`);
        } else {
          const errorResponse = JSON.parse(xhr.responseText);
          setError(errorResponse.error || 'Upload failed');
        }
        setIsUploading(false);
      };

      xhr.onerror = () => {
        setError('Network error during upload');
        setIsUploading(false);
      };

      xhr.send(formData);


    } catch (err) {
      setError('An unexpected error occurred');
      setIsUploading(false);
      console.error('Upload error:', err);
    }

  };

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
          disabled={isUploading}
        />
        
        <label htmlFor="file-upload" className={`cursor-pointer flex flex-col items-center justify-center gap-2 ${isUploading ? 'opacity-50' : ''}`}>
          <div className={`w-6 h-6 rounded-full ${
            uploadSuccess ? 'bg-green-100 dark:bg-green-900' : 
            isUploading ? 'bg-blue-100 dark:bg-blue-900' : 
            file ? 'bg-gray-200 dark:bg-gray-600' : 'bg-gray-200 dark:bg-gray-600'
          } flex items-center justify-center`}>
            {uploadSuccess ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : isUploading ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600 dark:text-blue-300 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            )}
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {isUploading ? `Uploading... ${uploadProgress}%` : 
               uploadSuccess ? 'Upload complete!' :
               file ? file.name : 'Drag & drop a file or click to browse'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : 'PDF, DOCX, or TXT files (max 20MB)'}
            </p>
          </div>
        </label>

        {isUploading && (
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
            <div 
              className="bg-blue-500 h-2 rounded-full" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}

        {error && (
          <p className="mt-2 text-xs text-red-500 dark:text-red-400">{error}</p>
        )}

        {(uploadSuccess && !isUploading) && (
          <button
            type="button"
            className="mt-2 text-xs text-blue-500 hover:text-blue-700 dark:hover:text-blue-400"
            onClick={() => setUploadSuccess(false)}
          >
            Upload another file
          </button>
        )}
      </div>
    </div>
  );
};