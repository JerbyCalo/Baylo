"use client";

import { useRouter } from "next/navigation";
import { formatRelativeDate } from "@/utils/formatDate";

/**
 * Strip HTML tags from a string to produce plain text.
 * Uses regex-based approach (safe for display — never renders as HTML).
 */
function stripHtml(html) {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * NoteCard — card for a single note.
 * Props: note, subjectId
 */
export default function NoteCard({ note, subjectId }) {
  const router = useRouter();

  const preview = stripHtml(note.content);

  const handleClick = () => {
    router.push(`/note/${note.id}?subjectId=${subjectId}`);
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer rounded-xl border border-surface-border bg-surface-card p-4 shadow-sm transition-shadow hover:shadow-md animate-fade-in"
    >
      <h4 className="truncate text-sm font-semibold text-gray-900">
        {note.title}
      </h4>

      {/* 2-line plain text preview */}
      <p className="mt-1.5 line-clamp-2 text-sm text-surface-muted leading-relaxed">
        {preview || "Empty note"}
      </p>

      {/* Meta */}
      <div className="mt-3 flex items-center gap-2 text-xs text-surface-muted">
        <span>{note.authorName}</span>
        <span>·</span>
        <span>
          {note.createdAt ? formatRelativeDate(note.createdAt) : "Just now"}
        </span>
      </div>
    </div>
  );
}
