'use client'

import Tiptap from '@/components/tiptap'
import { useRef } from 'react'

export default function Citation() {
    const tiptapRef = useRef<{ handleDownload: () => void }>(null)

    const handleDownload = () => {
        tiptapRef.current?.handleDownload()
    }

    return (
        <main className='relative flex min-h-screen items-center justify-center bg-[#F6F5F1] p-4'>
            {/* Download Button */}
            <div className='absolute top-4 right-4'>
                <button 
                    onClick={handleDownload}
                    className='px-4 py-2 bg-yellow-500 text-white rounded-md shadow-md hover:bg-yellow-600 transition cursor-pointer'
                >
                    Download
                </button>
            </div>

            <Tiptap ref={tiptapRef} />
        </main>
    )
}