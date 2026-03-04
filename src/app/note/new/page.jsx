"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useNotes } from "@/hooks/useNotes";
import NoteEditor from "@/components/notes/NoteEditor";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Navbar from "@/components/layout/Navbar";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

export default function NewNotePage() {
  const { user, loading, userProfile } = useRequireAuth();
  const searchParams = useSearchParams();
  const subjectId = searchParams.get("subjectId");
  const router = useRouter();

  const authorName = userProfile?.displayName || user?.displayName || "Unknown";
  const { addNote } = useNotes(subjectId, user?.uid, authorName);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null;
  }

  if (!subjectId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <p className="text-surface-muted">Missing subject ID.</p>
      </div>
    );
  }

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Please enter a title.");
      return;
    }

    setSaving(true);
    try {
      await addNote(title.trim(), content);
      router.push(`/subject/${subjectId}`);
    } catch {
      // Error toast handled in hook
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/subject/${subjectId}`);
  };

  return (
    <div className="min-h-screen bg-surface">
      <Navbar onToggleSidebar={() => {}} />

      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Back link */}
        <button
          onClick={handleCancel}
          className="mb-6 flex items-center gap-1.5 text-sm font-medium text-surface-muted transition-colors hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to subject
        </button>

        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">New Note</h1>
            <p className="mt-1 text-sm text-surface-muted">
              Write and save your notes using the rich text editor below.
            </p>
          </div>

          {/* Title input */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title"
            className="w-full rounded-xl border border-surface-border bg-white px-4 py-3 text-lg font-semibold text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand-muted"
          />

          {/* Editor */}
          <NoteEditor initialContent="" onChange={setContent} />

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={handleCancel}
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
                "Save Note"
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
