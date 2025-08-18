'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { forwardRef, useImperativeHandle, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

const Tiptap = forwardRef((props, ref) => {
  const searchParams = useSearchParams()
  const fileId = searchParams.get('fileId')
  const [isLoading, setIsLoading] = useState(!!fileId)
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
    getContent: () => {
      if (!editor) return ''
      return editor.getHTML()
    },
    clearContent: () => {
      if (!editor) return
      editor.commands.clearContent()
    },
    setContent: (content: string) => {
      if (!editor) return
      editor.commands.setContent(content)
    }
  }))

  useEffect(() => {
    if (!editor || !fileId) return

    const loadContent = async () => {
      try {
        setIsLoading(true)
        
        // First check the file status in Supabase
        const { data: fileData, error: fileError } = await supabase
          .from('files_pro')
          .select('content, completion')
          .eq('id', fileId)
          .single()

        if (fileError) throw fileError
        if (!fileData?.content) throw new Error('No content found')

        // If file is already completed, just load the content
        if (fileData.completion === 'complete') {
          const htmlContent = fileData.content.startsWith('<') 
            ? fileData.content 
            : `<p>${fileData.content.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</p>`
          
          editor.commands.setContent(htmlContent)
          return
        }

        // If not complete, call the citation API
        const apiResponse = await fetch('/api/cite-pro', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fileId }),
        })
        
        if (!apiResponse.ok) {
          throw new Error('API call failed')
        }

        // After citation processing, fetch the updated content
        const { data: updatedData, error: updatedError } = await supabase
          .from('files_pro')
          .select('content')
          .eq('id', fileId)
          .single()

        if (updatedError) throw updatedError
        if (!updatedData?.content) throw new Error('No content found after processing')

        const htmlContent = updatedData.content.startsWith('<') 
          ? updatedData.content 
          : `<p>${updatedData.content.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</p>`

        editor.commands.setContent(htmlContent)
      } catch (error) {
        console.error('Error loading content:', error)
        editor.commands.setContent('<p>Error loading content</p>')
      } finally {
        setIsLoading(false)
      }
    }

    loadContent()
  }, [fileId, editor, supabase])

  return (
    <div className="bg-white shadow-md p-8 mx-auto relative" style={{ 
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
            <p>Loading content...</p>
          </div>
        </div>
      )}
      
      <EditorContent editor={editor} />
    </div>
  )
})

export default Tiptap