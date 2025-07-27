'use client'

import { useEffect, useRef } from 'react'
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist'
import 'pdfjs-dist/web/pdf_viewer.css'

GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'

export default function PdfViewer() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const init = async () => {
      if (!containerRef.current) {
        console.error('Container ref is null')
        return
      }

      const pdfjsViewer = await import('pdfjs-dist/web/pdf_viewer')

      const eventBus = new pdfjsViewer.EventBus()
      const linkService = new pdfjsViewer.PDFLinkService({ eventBus })
      const l10n = pdfjsViewer.NullL10n

      const viewer = new pdfjsViewer.PDFViewer({
        container: containerRef.current,
        eventBus,
        linkService,
        l10n,
        textLayerMode: 2,
      })

      linkService.setViewer(viewer)

      const loadingTask = getDocument('/Document.pdf')
      loadingTask.promise.then(pdfDoc => {
        viewer.setDocument(pdfDoc)
        linkService.setDocument(pdfDoc, null)
      })
    }

    init()
  }, [])

  return (
    <div style={{ height: '100vh', overflow: 'auto' }}>
      <div ref={containerRef} className="pdfViewer" />
    </div>
  )
}
