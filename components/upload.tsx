'use client';
import { useState, useCallback, ChangeEvent, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import type { User } from "@/app/auth/getUser";

interface Props {
  user: User;
}

interface SubscriptionData {
  credits: number;
  total_credits: number;
}

export default function UploadBox({ user }: Props) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [remainingCredits, setRemainingCredits] = useState(0);
  const [loadingCredits, setLoadingCredits] = useState(true);
  const [showToast, setShowToast] = useState(false);

  const CREDITS_REQUIRED = 1000;
  const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
  const ALLOWED_FILE_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];

  // Fetch user's credits from Supabase
  useEffect(() => {
    const fetchUserCredits = async () => {
      if (user?.id) {
        setLoadingCredits(true);
        try {
          const supabase = createClient();
          const { data, error } = await supabase
            .from('Subscriptions')
            .select('credits')
            .eq('user_id', user.id)
            .single();

          if (!error && data) {
            setRemainingCredits(data.credits);
          } else {
            console.error('Error fetching user credits:', error);
            setRemainingCredits(0);
          }
        } catch (error) {
          console.error('Error fetching user credits:', error);
          setRemainingCredits(0);
        } finally {
          setLoadingCredits(false);
        }
      }
    };

    fetchUserCredits();
  }, [user?.id]);

  useEffect(() => {
    if (file && showCreditModal === false) {
      handleUpload();
    }
  }, [file, showCreditModal]);

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

    // Show credit confirmation modal instead of immediately uploading
    setFile(selectedFile);
    setShowCreditModal(true);
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

  const handleProceed = () => {
    if (remainingCredits < CREDITS_REQUIRED) {
      // Show toast instead of proceeding
      setShowToast(true);
      // Hide toast after 3 seconds
      setTimeout(() => setShowToast(false), 3000);
      return;
    }
    
    setShowCreditModal(false);
    // The useEffect will trigger the upload when showCreditModal becomes false
  };

  const handleCancel = () => {
    setShowCreditModal(false);
    setFile(null);
  };

  return (
    <>
      <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 dark:bg-gray-800 mt-5 p-4">
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

      {/* Credit Confirmation Modal */}
      {showCreditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Confirm Upload
            </h3>
            
            {loadingCredits ? (
              <div className="animate-pulse space-y-2 mb-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            ) : (
              <>
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  You have <span className="font-semibold">{remainingCredits.toLocaleString()}</span> remaining credits.
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  This feature will cost <span className="font-semibold">{CREDITS_REQUIRED.toLocaleString()}</span> credits. Would you like to proceed?
                </p>
              </>
            )}
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors hover:cursor-pointer"
                disabled={loadingCredits}
              >
                Cancel
              </button>
              <button
                onClick={handleProceed}
                className="px-4 py-2 text-sm font-medium text-white bg-amber-500 rounded-md hover:bg-amber-600 transition-colors hover:cursor-pointer"
                disabled={loadingCredits}
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification - Only show when explicitly triggered */}
      {showToast && (
        <div className="toast-notification toast-visible">
          <div className="bg-red-500 text-white px-6 py-3 rounded-md shadow-lg flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>Insufficient credits</span>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes slideIn {
          0% {
            transform: translate(-50%, -100%);
            opacity: 0;
          }
          70% {
            transform: translate(-50%, 10%);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }
        
        @keyframes fadeOut {
          0% {
            opacity: 1;
            transform: translate(-50%, 0);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -20px);
            visibility: hidden;
          }
        }
        
        .toast-notification {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1000;
          transition: all 0.3s ease;
        }
        
        .toast-visible {
          animation: slideIn 0.25s forwards;
        }
        
        .toast-hidden {
          animation: fadeOut 0.5s forwards;
        }
      `}</style>
    </>
  );
};