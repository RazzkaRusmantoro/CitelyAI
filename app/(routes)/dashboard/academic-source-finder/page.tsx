import UploadBox from '@/components/upload-source';
import Link from 'next/link';
import { FiSearch } from 'react-icons/fi';
import SearchBar from '@/components/search-bar';

export default function DashboardCitation() {
  return (
    <main className="min-h-full w-full">
      <div className="w-full">
        <div className="relative top-20 ml-20 space-y-2">
          <div className="">
            <h1 className="text-3xl md:text-4xl font-bold text-black dark:text-white">
              Relevant Academic Source Research Tool
            </h1>
            <p className="text-xl md:text-2xl font-medium text-gray-800 dark:text-gray-300">
              Powered By Advanced AI
            </p>
          </div>
          
          {/* Upload Box*/}
          <UploadBox/>

          {/* Search Bar */}
          <SearchBar/>

        </div>
      </div>
    </main>
  );
}