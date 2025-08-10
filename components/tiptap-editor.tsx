// components/tiptap-editor.tsx
'use client'


import { TextStyleKit } from '@tiptap/extension-text-style'
import type { Editor } from '@tiptap/react'
import { EditorContent, useEditor, useEditorState } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { ImportDocx } from '@tiptap-pro/extension-import-docx'
import { ExportDocx } from '@tiptap-pro/extension-export-docx'
import React, { useEffect, useState } from 'react'

const extensions = [TextStyleKit, StarterKit]

function MenuBar({ editor }: { editor: Editor }) {
  const editorState = useEditorState({
    editor,
    selector: ctx => {
      return {
        isBold: ctx.editor.isActive('bold') ?? false,
        canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
        isItalic: ctx.editor.isActive('italic') ?? false,
        canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
        isStrike: ctx.editor.isActive('strike') ?? false,
        canStrike: ctx.editor.can().chain().toggleStrike().run() ?? false,
        isCode: ctx.editor.isActive('code') ?? false,
        canCode: ctx.editor.can().chain().toggleCode().run() ?? false,
        canClearMarks: ctx.editor.can().chain().unsetAllMarks().run() ?? false,
        isParagraph: ctx.editor.isActive('paragraph') ?? false,
        isHeading1: ctx.editor.isActive('heading', { level: 1 }) ?? false,
        isHeading2: ctx.editor.isActive('heading', { level: 2 }) ?? false,
        isHeading3: ctx.editor.isActive('heading', { level: 3 }) ?? false,
        isHeading4: ctx.editor.isActive('heading', { level: 4 }) ?? false,
        isHeading5: ctx.editor.isActive('heading', { level: 5 }) ?? false,
        isHeading6: ctx.editor.isActive('heading', { level: 6 }) ?? false,
        isBulletList: ctx.editor.isActive('bulletList') ?? false,
        isOrderedList: ctx.editor.isActive('orderedList') ?? false,
        isCodeBlock: ctx.editor.isActive('codeBlock') ?? false,
        isBlockquote: ctx.editor.isActive('blockquote') ?? false,
        canUndo: ctx.editor.can().chain().undo().run() ?? false,
        canRedo: ctx.editor.can().chain().redo().run() ?? false,
      }
    },
  })

  return (
    <div className="flex flex-wrap gap-2 p-4 border-b bg-gray-50 dark:bg-gray-800">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editorState.canBold}
        className={`p-2 rounded ${editorState.isBold ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
      >
        Bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editorState.canItalic}
        className={`p-2 rounded ${editorState.isItalic ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
      >
        Italic
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editorState.canStrike}
        className={`p-2 rounded ${editorState.isStrike ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
      >
        Strike
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editorState.canCode}
        className={`p-2 rounded ${editorState.isCode ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
      >
        Code
      </button>
      <button 
        onClick={() => editor.chain().focus().unsetAllMarks().run()}
        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        Clear marks
      </button>
      <button 
        onClick={() => editor.chain().focus().clearNodes().run()}
        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        Clear nodes
      </button>
      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={`p-2 rounded ${editorState.isParagraph ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
      >
        Paragraph
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded ${editorState.isHeading1 ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
      >
        H1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded ${editorState.isHeading2 ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
      >
        H2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-2 rounded ${editorState.isHeading3 ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
      >
        H3
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={`p-2 rounded ${editorState.isHeading4 ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
      >
        H4
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        className={`p-2 rounded ${editorState.isHeading5 ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
      >
        H5
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        className={`p-2 rounded ${editorState.isHeading6 ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
      >
        H6
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded ${editorState.isBulletList ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
      >
        Bullet list
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded ${editorState.isOrderedList ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
      >
        Ordered list
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`p-2 rounded ${editorState.isCodeBlock ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
      >
        Code block
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded ${editorState.isBlockquote ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
      >
        Blockquote
      </button>
      <button 
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        Horizontal rule
      </button>
      <button 
        onClick={() => editor.chain().focus().setHardBreak().run()}
        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        Hard break
      </button>
      <button 
        onClick={() => editor.chain().focus().undo().run()} 
        disabled={!editorState.canUndo}
        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
      >
        Undo
      </button>
      <button 
        onClick={() => editor.chain().focus().redo().run()} 
        disabled={!editorState.canRedo}
        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
      >
        Redo
      </button>
    </div>
  )
}

export function TipTapEditor({ initialContent = '' }: { initialContent?: string }) {
  const [mounted, setMounted] = useState(false)
  const editor = useEditor({
    extensions,
    content: initialContent || `
      <h2>Hi there,</h2>
      <p>this is a <em>basic</em> example of <strong>Tiptap</strong>.</p>
      <ul>
        <li>That's a bullet list with one...</li>
        <li>...or two list items.</li>
      </ul>
      <pre><code>console.log('Hello world!')</code></pre>
      <blockquote>Wow, that's amazing. Good work!</blockquote>
    `,
    editorProps: {
      attributes: {
        class: 'min-h-[300px] p-6 prose dark:prose-invert prose-sm sm:prose-base max-w-none focus:outline-none',
      },
    },
    immediatelyRender: false
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !editor) {
    return (
      <div className="border rounded-lg shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700 p-4">
        Loading editor...
      </div>
    )
  }

  return (
    <div className="border rounded-lg shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}