'use client'

import Tiptap from '@/components/tiptap-pro'
import { useRef } from 'react'

export default function Citation() {
    const tiptapRef = useRef<{ handleDownload: () => void }>(null)

    const handleDownload = () => {
        tiptapRef.current?.handleDownload()
    }

    return (
        <main className='relative flex min-h-screen items-center justify-center bg-gray-50 p-4'>

            <Tiptap ref={tiptapRef} />
        </main>
    )
}