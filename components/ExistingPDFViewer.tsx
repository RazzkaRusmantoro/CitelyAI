"use client";

import { Document, Page, pdfjs } from "react-pdf";
import type { TextItem } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { useSearchParams } from "next/navigation";
import { MultiStepLoader as Loader } from "@/components/multi-step-loader";
import { Highlighter } from 'lucide-react';

interface ExistingPDFViewerProps {
  onLoadComplete?: () => void;
  highlightEnabled?: boolean;
}

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
  
const loadingStates = [
  { text: "Locating your file" },
  { text: "Preparing document" },
  { text: "Rendering content" },
  { text: "Assembling Citations" },
  { text: "Ready to view" },
];

export default function ExistingPDFViewer({ onLoadComplete, highlightEnabled = true }: ExistingPDFViewerProps) {
  const searchParams = useSearchParams();
  const fileId = searchParams.get("fileId");
  const [numPages, setNumPages] = useState<number | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLoader, setShowLoader] = useState(false); // Start with loader hidden
  const [loaderComplete, setLoaderComplete] = useState(false);
  const [citationTexts, setCitationTexts] = useState<string[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionError, setConversionError] = useState<string | null>(null);
  const [citationComplete, setCitationComplete] = useState(false);
  const citationCalledRef = useRef(false);

  const supabase = createClient();

  const textRenderer = useCallback(
    (textItem: TextItem) => {
      if (!highlightEnabled || citationTexts.length === 0) return textItem.str;
      
      const pattern = new RegExp(
        citationTexts.map(text => escapeRegExp(text)).join('|'),
        'gi'
      );
      
      return textItem.str.replace(pattern, (match) => `<mark class="bg-yellow-200">${match}</mark>`);
    },
    [citationTexts, highlightEnabled]
  );

  function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  useEffect(() => {
    if (!fileId) return;

    const checkFileStatus = async () => {
      try {
        setLoading(true);
        
        // First check the file status in Supabase
        const { data: fileData, error } = await supabase
          .from('files')
          .select('completion, file_path_pdf, file_url, references, citations')
          .eq('id', fileId)
          .single();

        if (error) throw error;

        // If file is already completed, just fetch the URL and citations
        if (fileData?.completion === 'complete') {
          let url = fileData.file_url;
          
          if (!url && fileData.file_path_pdf) {
            const { data: { publicUrl } } = await supabase.storage
              .from('user-uploads')
              .getPublicUrl(fileData.file_path_pdf);
            url = publicUrl;
          }

          if (url) {
            setFileUrl(url);
            
            // Set citation texts if available
             if (fileData.citations) {
              setCitationTexts(fileData.citations);
            } else if (fileData.references) {
              // Fallback to extracting from references if citations column doesn't exist
              const texts = fileData.references.map((ref: any) => ref.cited_sentence);
              setCitationTexts(texts);
            }
            
            setCitationComplete(true);
            if (onLoadComplete) onLoadComplete();
            return;
          }
        }

        // If not completed, show loader and proceed with citation process
        setShowLoader(true);
        if (!citationCalledRef.current) {
          citationCalledRef.current = true;
          await processCitations();
        }
      } catch (err) {
        console.error('Error checking file status:', err);
        setError(err instanceof Error ? err.message : 'Failed to check file status');
      } finally {
        setLoading(false);
      }
    };

    checkFileStatus();
  }, [fileId, supabase]);

  const processCitations = useCallback(async () => {
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
      
      if (data.citationTexts && Array.isArray(data.citationTexts)) {
        setCitationTexts(data.citationTexts);
      }
      
      setCitationComplete(true);
    } catch (error) {
      console.error('Error processing citations:', error);
      setConversionError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsConverting(false);
    }
  }, [fileId]);

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
    if (onLoadComplete) {
      onLoadComplete();
    }
  }

  // Skip loader entirely if file is already complete
  if (loading && !showLoader) {
    return <div className="w-full flex items-center justify-center">Loading...</div>;
  }

  if (!loaderComplete && showLoader) {
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
        <div className="wheel-and-hamster">
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
            customTextRenderer={textRenderer}
          />
        ))}
      </Document>
    </div>
  );
}