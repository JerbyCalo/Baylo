"use client";

import { useRef, useState, useCallback } from "react";
import { Upload, Loader2 } from "lucide-react";

/**
 * FileUploader — Drag-and-drop zone with animated uploading state.
 *
 * Props:
 *   onUpload    — (file: File) => Promise
 *   isUploading — boolean (true while Uploadthing is uploading)
 */
export default function FileUploader({ onUpload, isUploading = false }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadingName, setUploadingName] = useState("");

  const handleFile = useCallback(
    async (file) => {
      if (!file) return;
      setUploadingName(file.name);
      try {
        await onUpload(file);
      } finally {
        setUploadingName("");
      }
    },
    [onUpload],
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleInputChange = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      // Reset input so same file can be re-selected
      e.target.value = "";
    },
    [handleFile],
  );

  // Accepted extensions for the file input
  const acceptString =
    ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg,.zip";

  if (isUploading) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-brand bg-brand-muted/30 p-8 text-center animate-fade-in">
        <Loader2 className="mb-3 h-10 w-10 text-brand animate-spin" />
        {uploadingName && (
          <p className="mb-1 max-w-full truncate text-sm font-medium text-gray-700">
            Uploading: {uploadingName}
          </p>
        )}
        <p className="text-xs text-surface-muted">
          Please wait while your file is being uploaded...
        </p>
      </div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-colors cursor-pointer ${
        dragOver
          ? "border-brand bg-brand-muted/20"
          : "border-surface-border bg-surface-card hover:border-brand/40"
      }`}
      onClick={() => inputRef.current?.click()}
    >
      <Upload
        className={`mb-3 h-10 w-10 ${
          dragOver ? "text-brand" : "text-surface-muted"
        }`}
      />
      <p className="text-sm font-medium text-gray-700">
        Drag & drop a file here
      </p>
      <p className="mt-1 text-xs text-surface-muted">
        PDF, DOCX, XLSX, PPTX, PNG, JPG, ZIP — Max 16 MB
      </p>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          inputRef.current?.click();
        }}
        className="mt-4 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
      >
        Browse Files
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={acceptString}
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
}
