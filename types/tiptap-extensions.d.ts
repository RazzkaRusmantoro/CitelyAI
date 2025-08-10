// types/tiptap-extensions.d.ts
import '@tiptap/core'
import type { ImportOptions } from '@tiptap-pro/extension-import-docx'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    import: {
      import: (options: { file: File }) => ReturnType
    }
  }
}
