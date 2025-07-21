'use client'

import { FiUpload, FiX, FiFile, FiCheckCircle } from 'react-icons/fi'

export default function DocumentUpload() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Drag and drop area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <div className="flex flex-col items-center justify-center space-y-2">
          <FiUpload className="w-8 h-8 text-gray-400" />
          <p className="font-medium">Drag and drop files here</p>
          <p className="text-sm text-gray-500">PDF, DOC, DOCX (max 5MB)</p>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept=".pdf,.doc,.docx"
          />
        </div>
      </div>

      {/* File list */}
    

    </div>
  )
}