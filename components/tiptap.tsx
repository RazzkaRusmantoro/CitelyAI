'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect, useState, forwardRef, useImperativeHandle } from 'react'
import { useSearchParams } from 'next/navigation'
import { fetchFileContent } from '@/utils/fetchFileContent'
import { createClient } from '@/utils/supabase/client'

const Tiptap = forwardRef((props, ref) => {
  const searchParams = useSearchParams()
  const fileId = searchParams.get('fileId')
  const [isLoading, setIsLoading] = useState(!!fileId)
  const [error, setError] = useState<string | null>(null)
  const [originalFileType, setOriginalFileType] = useState<string | null>(null)
  const supabase = createClient()

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: 'my-paragraph',
          },
        },
      }),
    ],
    content: '<p></p>',
    editorProps: {
      attributes: {
        class: 'prose focus:outline-none min-h-full',
      },
    },
    immediatelyRender: false,
  })

  useImperativeHandle(ref, () => ({
    handleDownload: async () => {
      if (!editor || !fileId) return

      try {
        const htmlContent = editor.getHTML()

        const { data: fileData, error: fetchError } = await supabase
          .from('files')
          .select('file_type, filename')
          .eq('id', fileId)
          .single()

        if (fetchError) throw fetchError

        let blob: Blob
        let fileName = fileData.filename || `document_${Date.now()}`

        if (fileData.file_type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
          const response = await fetch('/api/export-docx', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ html: htmlContent, fileName, fileId })
          })
          const blobData = await response.blob()
          blob = new Blob([blobData], { type: fileData.file_type })
          fileName = fileName.endsWith('.docx') ? fileName : `${fileName}.docx`
        } else if (fileData.file_type === 'application/pdf') {
          console.log("This is the fileId:", fileId)
          const response = await fetch('/api/export-pdf', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ html: htmlContent, fileName, fileId })
          })
          const blobData = await response.blob()
          blob = new Blob([blobData], { type: fileData.file_type })
          fileName = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`
        } else {
          blob = new Blob([htmlContent], { type: 'text/plain' })
          fileName = fileName.endsWith('.txt') ? fileName : `${fileName}.txt`
        }

        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      } catch (err) {
        console.error('Download failed:', err)
        alert('Failed to export document')
      }
    }
  }))

  useEffect(() => {
    if (!editor) return;

    if (!fileId) {
      editor.commands.setContent('<p>Welcome to Citely! Upload a document or start writing.</p>')
      return
    }

    const loadFileContent = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const { content, fileName } = await fetchFileContent(fileId)

        const htmlContent = content.startsWith('<')
          ? content
          : `<p>${content.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</p>`

        editor.commands.setContent(htmlContent)

      } catch (err) {
        console.error('Failed to load file:', err)
        setError('Failed to load document')
        editor.commands.setContent('<p>Error loading document. Please try again.</p>')
      } finally {
        setIsLoading(false)
      }
    }

    loadFileContent()
  }, [fileId, editor])

  return (
    <div className="bg-white shadow-md p-8 mt-10 mx-auto relative" style={{ 
      width: '210mm', 
      minHeight: '297mm',
    }}>
      {isLoading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
          <div className="animate-pulse flex flex-col items-center">
            <svg className="animate-spin h-8 w-8 text-blue-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p>Loading document...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <EditorContent editor={editor} />
    </div>
  )
})

export default Tiptap