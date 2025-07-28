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
    const [isConverting, setIsConverting] = useState(false)
    const [conversionError, setConversionError] = useState<string | null>(null)

    useEffect(() =>{
        const convertPdfToDocx = async () => {
            if (!fileId) return;
            
            try {
                setIsConverting(true)
                setConversionError(null)
                
                const response = await fetch('/api/cite', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ fileId }),
                })

                if (!response.ok) {
                    throw new Error(`Conversion failed: ${response.statusText}`)
                }

                const data = await response.json()
                console.log('Conversion successful:', data)
            } catch (error) {
                console.error('Error converting PDF to DOCX:', error)
                setConversionError(error instanceof Error ? error.message : 'Unknown error occurred')
            } finally {
                setIsConverting(false)
            }
        }

        convertPdfToDocx()
    }, [fileId])



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