import UploadBox from '@/components/upload-source';
import Link from 'next/link';
import { FiSearch } from 'react-icons/fi';
import SearchBar from '@/components/search-bar';
import PDFViewer from '@/components/TempViewer';
import '@/lib/pdfjs'

export default function DashboardCitation() {
  return (
    <main className="min-h-full w-full">
      <div className="w-full">
        <div className="relative top-20 ml-20 space-y-2">
          {/* PDF Viewer Section */}
          <section aria-labelledby="pdf-viewer-heading" className="mb-12">
            <h2 id="pdf-viewer-heading" className="sr-only">PDF Viewer</h2>
            <PDFViewer />
          </section>
        </div>
      </div>
    </main>
  );
}