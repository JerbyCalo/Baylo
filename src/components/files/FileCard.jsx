"use client";

import { useState } from "react";
import * as Icons from "lucide-react";
import { Download, Trash2 } from "lucide-react";
import { getFileIcon, formatFileSize } from "@/utils/fileHelpers";
import { formatDisplayDate } from "@/utils/formatDate";

/**
 * FileCard — displays an uploaded file with download and inline-confirm delete.
 *
 * Props:
 *   file     — Firestore file document
 *   onDelete — (fileId) => Promise
 */
export default function FileCard({ file, onDelete }) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Resolve the Lucide icon component from the string name
  const iconName = getFileIcon(file.fileType);
  const IconComponent = Icons[iconName] || Icons.File;

  // Map icon name to a background tint
  const iconBgMap = {
    FileText: "bg-red-100 text-red-600",
    Image: "bg-emerald-100 text-emerald-600",
    FileType: "bg-blue-100 text-blue-600",
    Table: "bg-green-100 text-green-600",
    Presentation: "bg-orange-100 text-orange-600",
    Archive: "bg-yellow-100 text-yellow-600",
    File: "bg-gray-100 text-gray-600",
  };

  const iconClasses = iconBgMap[iconName] || iconBgMap.File;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete(file.id);
    } catch {
      // Error toast handled in hook
    } finally {
      setDeleting(false);
      setConfirmingDelete(false);
    }
  };

  return (
    <div className="flex items-center gap-4 rounded-xl border border-surface-border bg-surface-card p-4 shadow-sm transition-shadow hover:shadow-md animate-fade-in">
      {/* Icon */}
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${iconClasses}`}
      >
        <IconComponent className="h-5 w-5" />
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-gray-900">
          {file.name}
        </p>
        <p className="mt-0.5 text-xs text-surface-muted">
          {file.uploaderName} · {formatFileSize(file.fileSize)}
          {file.createdAt && ` · ${formatDisplayDate(file.createdAt)}`}
        </p>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-1">
        {/* Download */}
        <a
          href={file.downloadURL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-surface hover:text-brand"
          title="Download"
        >
          <Download className="h-4 w-4" />
        </a>

        {/* Delete / Confirm */}
        {confirmingDelete ? (
          <div className="flex items-center gap-1">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-md bg-red-600 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
            >
              {deleting ? "..." : "Confirm"}
            </button>
            <button
              onClick={() => setConfirmingDelete(false)}
              disabled={deleting}
              className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-200 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmingDelete(true)}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
