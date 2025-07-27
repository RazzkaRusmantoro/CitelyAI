"use client";
import dynamic from "next/dynamic";

export const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  { 
    ssr: false,
    loading: () => <div>Loading PDF viewer...</div>
  }
);

// Your PDFDocument export (unchanged)
export { PDFDocument } from '@/components/pdf-document';