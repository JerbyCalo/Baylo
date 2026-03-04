"use client";

import { useRouter } from "next/navigation";
import NoteCard from "./NoteCard";
import EmptyState from "@/components/ui/EmptyState";
import { Plus, FileText } from "lucide-react";

/**
 * NoteList — list of notes with a "New Note" button.
 * Props: notes, subjectId, loading
 */
export default function NoteList({ notes, subjectId, loading }) {
  const router = useRouter();

  const handleNewNote = () => {
    router.push(`/note/new?subjectId=${subjectId}`);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-brand" />
          <h2 className="text-lg font-bold text-gray-900">Notes</h2>
          {!loading && (
            <span className="rounded-full bg-brand-muted px-2 py-0.5 text-xs font-medium text-brand-dark">
              {notes.length} {notes.length === 1 ? "note" : "notes"}
            </span>
          )}
        </div>
        <button
          onClick={handleNewNote}
          className="flex items-center gap-1.5 rounded-lg bg-brand px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
        >
          <Plus className="h-4 w-4" />
          New Note
        </button>
      </div>

      {/* Loading skeletons */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl border border-surface-border bg-surface-card p-4"
            >
              <div className="h-4 w-1/2 rounded bg-gray-200" />
              <div className="mt-2 h-3 w-full rounded bg-gray-100" />
              <div className="mt-1 h-3 w-3/4 rounded bg-gray-100" />
              <div className="mt-3 h-3 w-1/3 rounded bg-gray-100" />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && notes.length === 0 && (
        <EmptyState
          icon="FileText"
          title="No notes yet"
          description="Start by writing your first note for this subject."
          actionLabel="Write your first note"
          onAction={handleNewNote}
        />
      )}

      {/* Note cards */}
      {!loading && notes.length > 0 && (
        <div className="space-y-3">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} subjectId={subjectId} />
          ))}
        </div>
      )}
    </div>
  );
}
