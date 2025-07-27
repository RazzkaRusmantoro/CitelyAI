import type { ReactNode } from 'react'
import Script from 'next/script'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <head>
        <Script src="/pdf.worker.min.js" strategy="beforeInteractive" />
        <Script
          src="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://unpkg.com/pdfjs-dist@3.4.120/web/pdf_viewer.js"
          strategy="beforeInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
