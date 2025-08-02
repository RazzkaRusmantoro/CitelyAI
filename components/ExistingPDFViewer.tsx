// components/ExistingPDFViewer.tsx
"use client";

import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { useSearchParams } from "next/navigation";
import { MultiStepLoader as Loader } from "@/components/multi-step-loader";

// PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
  
const loadingStates = [
  { text: "Locating your file" },
  { text: "Preparing document" },
  { text: "Rendering content" },
  { text: "Assembling Citations" },
  { text: "Ready to view" },
];

export default function ExistingPDFViewer() {
  const searchParams = useSearchParams();
  const fileId = searchParams.get("fileId");
  const [numPages, setNumPages] = useState<number | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLoader, setShowLoader] = useState(true);
  const [loaderComplete, setLoaderComplete] = useState(false);
  const loaderStartTime = useRef(Date.now());

  const [isConverting, setIsConverting] = useState(false);
  const [conversionError, setConversionError] = useState<string | null>(null);
  const [citationComplete, setCitationComplete] = useState(false);
  const citationCalledRef = useRef(false); // Add this ref to track if citation was called

  const supabase = createClient();

  // First effect: Handle the loader animation
  useEffect(() => {
    if (showLoader) {
      const totalLoaderDuration = loadingStates.length * 4000;
      const timer = setTimeout(() => {
        setLoaderComplete(true);
        setShowLoader(false);
      }, totalLoaderDuration);

      return () => clearTimeout(timer);
    }
  }, [showLoader]);

  // Second effect: Initiate the citation process when fileId is available
  useEffect(() => {
    if (!fileId || citationCalledRef.current) return; // Skip if already called
    citationCalledRef.current = true; // Mark as called

    async function processCitations() {
      try {
        setIsConverting(true);
        setConversionError(null);

        const response = await fetch('/api/cite', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fileId }),
        });

        if (!response.ok) {
          throw new Error(`Citation failed: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Citation successful:', data);
        setCitationComplete(true);
      } catch (error) {
        console.error('Error processing citations:', error);
        setConversionError(error instanceof Error ? error.message : 'Unknown error occurred');
      } finally {
        setIsConverting(false);
      }
    }

    processCitations();
  }, [fileId]);

  // Third effect: Fetch file URL only after citations are complete
  useEffect(() => {
    if (!citationComplete || !fileId) return;

    async function fetchFileUrl() {
      try {
        setLoading(true);

        const { data: fileData, error: fileError } = await supabase
          .from("files")
          .select("file_url, file_path_pdf")
          .eq("id", fileId)
          .single();

        if (fileError) throw fileError;

        if (!fileData?.file_url) {
          if (fileData?.file_path_pdf) {
            const { data: publicUrlData } = await supabase.storage
              .from("user-uploads")
              .getPublicUrl(fileData.file_path_pdf);

            setFileUrl(publicUrlData.publicUrl);
          } else {
            throw new Error("No file URL or path available");
          }
        } else {
          setFileUrl(fileData.file_url);
        }
      } catch (err) {
        console.error("Error fetching file:", err);
        setError(err instanceof Error ? err.message : "Failed to load PDF");
      } finally {
        setLoading(false);
      }
    }

    fetchFileUrl();
  }, [citationComplete, fileId, supabase]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  if (!loaderComplete) {
    return (
      <div className="w-full flex items-center justify-center">
        <Loader loadingStates={loadingStates} loading={true} duration={1000} />
      </div>
    );
  }

  if (error) return <div>Error: {error}</div>;
  if (conversionError) return <div>Citation Error: {conversionError}</div>;
  if (!fileUrl) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div
        aria-label="Orange and tan hamster running in a metal wheel"
        role="img"
        className="wheel-and-hamster"
      >
        <div className="wheel"></div>
        <div className="hamster">
          <div className="hamster__body">
            <div className="hamster__head">
              <div className="hamster__ear"></div>
              <div className="hamster__eye"></div>
              <div className="hamster__nose"></div>
            </div>
            <div className="hamster__limb hamster__limb--fr"></div>
            <div className="hamster__limb hamster__limb--fl"></div>
            <div className="hamster__limb hamster__limb--br"></div>
            <div className="hamster__limb hamster__limb--bl"></div>
            <div className="hamster__tail"></div>
          </div>
        </div>
        <div className="spoke"></div>
      </div>

      <div className="mt-6 text-lg font-medium text-center">
        Loading Citations...
      </div>
    </div>
  );
}


  return (
    <div className="flex flex-col items-center relative">
      <Document
        file={fileUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        error={<div>Failed to load PDF</div>}
      >
        {Array.from(new Array(numPages), (el, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            width={800}
            className="mb-4 border border-gray-300"
            loading={<div>Loading page {index + 1}...</div>}
          />
        ))}
      </Document>
    </div>
  );
}