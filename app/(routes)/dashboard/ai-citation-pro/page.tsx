// app/dashboard/citation/page.tsx
import { TipTapEditor } from '@/components/tiptap-editor'

export default function DashboardCitation() {
  return (
    <main className="min-h-screen w-full bg-white dark:bg-gray-900">
      <div className="w-full max-w-7xl mx-auto px-4 py-20">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-black dark:text-white">
              Cite Sources in Seconds
            </h1>
            <p className="text-xl md:text-2xl font-medium text-gray-800 dark:text-gray-300">
              with AI-Powered Precision
            </p>
          </div>
          
          <TipTapEditor />
        </div>
      </div>
    </main>
  )
}