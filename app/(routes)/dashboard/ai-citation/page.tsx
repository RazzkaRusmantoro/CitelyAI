import { DocumentCard } from '@/components/document';
import UploadBox from '@/components/upload';
import Link from 'next/link';
import { getUser } from "@/app/auth/getUser";
import { createClient } from "@/utils/supabase/client";

export default async function DashboardCitation() {
  const supabase = createClient();
  const user = await getUser();
  const userId = user?.id;

  // Fetch user's files from Supabase
  let { data: files, error } = await supabase
    .from('files')
    .select('id, filename, opened_at, file_url')
    .eq('user_id', userId)
    .order('opened_at', { ascending: false });

  if (error) {
    console.error('Error fetching files:', error);
    // You might want to handle this error more gracefully in your UI
    files = [];
  }

  // Format the opened_at date to a readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `Opened ${diffInSeconds} second${diffInSeconds === 1 ? '' : 's'} ago`;
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `Opened ${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `Opened ${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) {
      return 'Opened yesterday';
    }
    
    if (diffInDays < 7) {
      return `Opened ${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
    }
    
    return `Opened on ${date.toLocaleDateString()}`;
  };

  return (
    <main className="min-h-screen w-full bg-white dark:bg-gray-900">
      <div className="w-full max-w-7xl mx-auto px-4 py-10">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-black dark:text-white">
              Cite Papers in Seconds
            </h1>
            <p className="text-xl md:text-2xl font-medium text-gray-800 dark:text-gray-300">
              with AI-Powered Precision
            </p>
          </div>
          
          {/* Upload Box*/}
          <div className="bg-white dark:bg-gray-800 dark:border-gray-700">
            <UploadBox/>
          </div>

          

          <div className="mt-10">
            <span className="text-black dark:text-gray-300 font-medium mb-4 block">
              Recent Documents
            </span>
            {files && files.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {files.map((file) => (
                  <DocumentCard 
                    key={file.id}
                    documentNumber={file.id}
                    title={file.filename}
                    modifiedDate={formatDate(file.opened_at)}
                    width="clamp(120px, 12vw, 160px)"
                    height="clamp(170px, 17vw, 226px)"
                    fileUrl={file.file_url}
                    fileId={file.id}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No documents found. Upload or create one to get started.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}