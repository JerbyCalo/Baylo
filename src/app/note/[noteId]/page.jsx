"use client";

import { useState, useEffect, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useNotes } from "@/hooks/useNotes";
import NoteEditor from "@/components/notes/NoteEditor";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Navbar from "@/components/layout/Navbar";
import { ArrowLeft, Trash2 } from "lucide-react";
import { formatRelativeDate } from "@/utils/formatDate";

export default function ViewEditNotePage({ params }) {
  const { noteId } = use(params);
  const searchParams = useSearchParams();
  const subjectId = searchParams.get("subjectId");
  const { user, loading: authLoading, userProfile } = useRequireAuth();
  const router = useRouter();

  const [note, setNote] = useState(null);
  const [noteLoading, setNoteLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const authorName = userProfile?.displayName || user?.displayName || "Unknown";
  const { getNote, updateNote, deleteNote } = useNotes(
    subjectId,
    user?.uid,
    authorName,
  );

  // Fetch the note using the subjectId from the URL search param
  useEffect(() => {
    if (!user || !noteId || !subjectId) return;

    const fetchNote = async () => {
      setNoteLoading(true);
      try {
        const noteData = await getNote(noteId);
        if (noteData) {
          setNote(noteData);
          setTitle(noteData.title || "");
          setContent(noteData.content || "");
        } else {
          setNote(null);
        }
      } catch (error) {
        console.error("Error fetching note:", error);
      } finally {
        setNoteLoading(false);
      }
    };

    fetchNote();
  }, [user, noteId, subjectId]);

  if (authLoading || noteLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null;
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-surface">
        <Navbar onToggleSidebar={() => {}} />
        <div className="flex items-center justify-center py-20">
          <p className="text-surface-muted">Note not found.</p>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    if (!title.trim()) return;
    setSaving(true);
    try {
      await updateNote(noteId, { title: title.trim(), content });
    } catch {
      // Error toast handled in hook
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteNote(noteId);
      router.push(`/subject/${subjectId}`);
    } catch {
      // Error toast handled in hook
    } finally {
      setDeleting(false);
    }
  };

  const handleBack = () => {
    router.push(`/subject/${subjectId}`);
  };

  return (
    <div className="min-h-screen bg-surface">
      <Navbar onToggleSidebar={() => {}} />

      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Back link */}
        <button
          onClick={handleBack}
          className="mb-6 flex items-center gap-1.5 text-sm font-medium text-surface-muted transition-colors hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to subject
        </button>

        <div className="space-y-6">
          {/* Title input */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title"
            className="w-full rounded-xl border border-surface-border bg-white px-4 py-3 text-lg font-semibold text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand-muted"
          />

          {/* Meta info */}
          <div className="flex items-center gap-3 text-sm text-surface-muted">
            <span>{note.authorName}</span>
            <span>·</span>
            <span>
              {note.updatedAt
                ? `Updated ${formatRelativeDate(note.updatedAt)}`
                : note.createdAt
                  ? `Created ${formatRelativeDate(note.createdAt)}`
                  : ""}
            </span>
          </div>

          {/* Editor */}
          <NoteEditor
            initialContent={note.content || ""}
            onChange={setContent}
          />

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              {deleting ? "Deleting..." : "Delete"}
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-surface"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!title.trim() || saving}
                className="flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <span className="inline-block h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
