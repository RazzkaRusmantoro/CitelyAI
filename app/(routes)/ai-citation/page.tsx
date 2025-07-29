'use client'

import Tiptap from '@/components/tiptap'
import { useRef, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import Viewer from '@/components/viewer';
import TempPDFViewer from '@/components/TempViewer'
import ExistingPDFViewer from '@/components/ExistingPDFViewer';
import { useSearchParams } from 'next/navigation'


export default function Citation() {
    // const tiptapRef = useRef<{ handleDownload: () => void }>(null)
    const searchParams = useSearchParams()
    const fileId = searchParams.get('fileId')

    // const handleDownload = () => {
    //     tiptapRef.current?.handleDownload()
    // }

    return (
        <main className='relative flex min-h-screen items-center justify-center bg-[#F6F5F1] p-4'>
            {/* Download Button */}
            <div className='absolute top-4 right-4'>
                <button 
                    // onClick={handleDownload}
                    className='px-4 py-2 bg-yellow-500 text-white rounded-md shadow-md hover:bg-yellow-600 transition cursor-pointer'
                >
                    Download
                </button>
            </div>
            {/* The viewer goes here  */}
            <ExistingPDFViewer />
        </main>
    )
}