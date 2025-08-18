// app/dashboard/citation/page.tsx
import { TipTapEditor } from '@/components/tiptap-editor'
import UploadBox from '@/components/upload-pro'
import Link from 'next/link'

export default function DashboardCitation() {
  return (
    <main className="min-h-screen w-full bg-white dark:bg-gray-900">
      <div className="w-full max-w-7xl mx-auto px-4 py-10">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-black dark:text-white">
              Cite Papers with Assistant Pro
            </h1>
            <p className="text-xl md:text-2xl font-medium text-gray-800 dark:text-gray-300">
              with an Interative and Advanced Editor
            </p>
          </div>
          
          <UploadBox/>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 border border-gray-200 dark:border-gray-700">
            <Link href="/ai-citation" className="bg-yellow-600 hover:bg-yellow-700 text-xs text-white font-medium px-0 py-3 rounded-md transition-all duration-200 w-full h-full flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]">
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

          {/* <TipTapEditor /> */}
        </div>
      </div>
    </main>
  )
}