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

  const [isConverting, setIsConverting] = useState(false)
  const [conversionError, setConversionError] = useState<string | null>(null)

  const supabase = createClient();

  {/* FetchFileURL useEffect*/}
  useEffect(() => {
    async function fetchFileUrl() {
      try {
        setLoading(true);
        setShowLoader(true);
        loaderStartTime.current = Date.now();

        const { data: fileData, error: fileError } = await supabase
          .from("files")
          .select("file_url, file_path")
          .eq("id", fileId)
          .single();

        if (fileError) throw fileError;

        if (!fileData?.file_url) {
          if (fileData?.file_path) {
            const { data: publicUrlData } = await supabase.storage
              .from("user-uploads")
              .getPublicUrl(fileData.file_path);

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

    if (fileId) {
      fetchFileUrl();
    }
  }, [fileId, supabase]);

  {/* Loader useEffect */}
  useEffect(() => {
    if (showLoader) {
      const totalLoaderDuration = loadingStates.length * 1000;
      const timer = setTimeout(() => {
        setLoaderComplete(true);
        setShowLoader(false);
      }, totalLoaderDuration);

      return () => clearTimeout(timer);
    }
  }, [showLoader]);

  {/* Extracting text useEffect */}
  useEffect(() => {
    async function extractTextFromPDF(pdfUrl: string) {
      const loadingTask = pdfjs.getDocument(pdfUrl);
      const pdf = await loadingTask.promise;
      let fullText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();

        const pageText = textContent.items
          .map((item) => ("str" in item ? item.str : ""))
          .join(" ");

        fullText += pageText + "\n\n";
      }

      return fullText;
    }

    async function processFile(fileUrl: string) {
      try {
        setIsConverting(true);
        setConversionError(null);

        let fullText = "";
        
        if (fileUrl.toLowerCase().endsWith('.pdf')) {
          fullText = await extractTextFromPDF(fileUrl);
          console.log("FULL TEXT:", fullText);
        } else if (fileUrl.toLowerCase().endsWith('.docx') || fileUrl.toLowerCase().endsWith('.doc')) {
          // Extract PDF Version of Word File
          console.log("Word document detected");


          return;
        } else {
          // Extract PDF Version of Text File
          console.log("Unsupported file type (or text)");
          return;
        }

        const response = await fetch('/api/cite', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fileUrl, fileId, fullText }),
        });

        if (!response.ok) {
          throw new Error(`Conversion failed: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Conversion successful:', data);
      } catch (error) {
        console.error('Error processing file:', error);
        setConversionError(error instanceof Error ? error.message : 'Unknown error occurred');
      } finally {
        setIsConverting(false);
      }
    }

    if (fileUrl) {
      processFile(fileUrl);
    }
  }, [fileUrl, fileId]);

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
  if (!fileUrl) return <div>No file found</div>;

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
