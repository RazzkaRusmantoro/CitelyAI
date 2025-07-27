
import { useState, useEffect } from "react";
import { PDFViewer, PDFDocument } from "@/components/thing";
import ExistingPDFViewer from '@/components/ExistingPDFViewer';

export default function Viewer() {
    return (
        <div className="w-full h-screen">
            <ExistingPDFViewer />
        </div>
    );
}