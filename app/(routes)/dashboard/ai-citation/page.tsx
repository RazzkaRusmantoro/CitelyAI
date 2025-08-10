import { DocumentCard } from '@/components/document';
import UploadBox from '@/components/upload';
import Link from 'next/link';

export default function DashboardCitation() {
  return (
    <main className="min-h-full w-full">
      <div className="w-full flex flex-col items-center">
        <div className="relative top-20 w-full max-w-6xl px-4 space-y-2">
          <div className="">
            <h1 className="text-3xl md:text-4xl font-bold text-black dark:text-white">
              Cite Sources in Seconds
            </h1>
            <p className="text-xl md:text-2xl font-medium text-gray-800 dark:text-gray-300">
              with AI-Powered Precision
            </p>
          </div>
          
          {/* Upload Box*/}
          <div className="flex justify-center">
            <UploadBox/>
          </div>

          <div className="w-full h-15 bg-white rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 dark:bg-gray-800 p-3 flex items-center justify-center">
            <Link href="/ai-citation" className="bg-yellow-600 hover:bg-yellow-700 text-xs text-white font-medium px-0 py-3 rounded-md transition-al duration-200 w-full h-full flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 4v16m8-8H4" 
                />
              </svg>
              Create a Blank Document
            </Link>
          </div>

          <div className="relative top-10">
            <span className="text-black dark:text-gray-300 font-medium mb-4 block">
              Recent Documents
            </span>
            <div className="grid grid-cols-6 gap-0 w-288 h-120">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                <DocumentCard 
                  key={num}
                  documentNumber={num}
                  width="clamp(120px, 12vw, 160px)"
                  height="clamp(170px, 17vw, 226px)"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}