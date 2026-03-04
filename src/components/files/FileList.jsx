"use client";

import FileCard from "@/components/files/FileCard";
import EmptyState from "@/components/ui/EmptyState";
import { FolderOpen } from "lucide-react";

/**
 * FileList — renders a list of FileCards or skeleton/empty states.
 *
 * Props:
 *   files    — Firestore file documents
 *   onDelete — (fileId, storagePath) => Promise
 *   loading  — boolean
 */
export default function FileList({ files, onDelete, loading }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-xl border border-surface-border bg-surface-card p-4 animate-pulse"
          >
            <div className="h-11 w-11 rounded-full bg-surface-border" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-2/3 rounded bg-surface-border" />
              <div className="h-3 w-1/2 rounded bg-surface-border" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!files || files.length === 0) {
    return (
      <EmptyState
        icon={FolderOpen}
        title="No files yet"
        description="Upload PDFs, slides, or documents to share with your class."
      />
    );
  }

  return (
    <div className="space-y-3">
      {files.map((file) => (
        <FileCard key={file.id} file={file} onDelete={onDelete} />
      ))}
    </div>
  );
}
