"use client"

import { useUploadLabReport } from '@/hooks/useDoctors'
import { useRef, useState } from 'react'

interface Props {
  labResultId: string
}

export function UploadLabReportButton({ labResultId }: Props) {
  const { mutate, isPending, isSuccess, isError, error } = useUploadLabReport(labResultId)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleUpload = () => {
    if (selectedFile) {
      mutate({ reportFile: selectedFile })
    }
  }

  if (isSuccess) {
    return <span className="text-xs text-green-600 font-medium">Report Uploaded ✓</span>
  }

  return (
    <div className="flex flex-col items-start gap-1">
      {!selectedFile ? (
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isPending}
          className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Choose PDF
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600 truncate max-w-37.5">
            {selectedFile.name}
          </span>
          <button
            onClick={handleUpload}
            disabled={isPending}
            className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {isPending ? 'Uploading...' : 'Upload Report'}
          </button>
          <button
            onClick={() => {
              setSelectedFile(null)
              if (fileInputRef.current) fileInputRef.current.value = ''
            }}
            disabled={isPending}
            className="text-xs text-red-500 hover:text-red-700"
          >
            ✕
          </button>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="hidden"
      />
      {isError && (
        <span className="text-xs text-red-500">
          {error instanceof Error ? error.message : 'Failed. Try again.'}
        </span>
      )}
    </div>
  )
}