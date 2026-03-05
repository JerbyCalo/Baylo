"use client";

import { useState, useEffect, use } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useSubjects } from "@/hooks/useSubjects";
import { useNotes } from "@/hooks/useNotes";
import { useFiles } from "@/hooks/useFiles";
import { useMembers } from "@/hooks/useMembers";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import NoteList from "@/components/notes/NoteList";
import FileUploader from "@/components/files/FileUploader";
import FileList from "@/components/files/FileList";
import MemberList from "@/components/members/MemberList";
import ShareLinkModal from "@/components/share/ShareLinkModal";
import AddSubjectModal from "@/components/subject/AddSubjectModal";
import { Share2, FolderOpen } from "lucide-react";
import * as LucideIcons from "lucide-react";

export default function SubjectDetailPage({ params }) {
  const { subjectId } = use(params);
  const { user, loading: authLoading, userProfile } = useRequireAuth();
  const { subjects, addSubject } = useSubjects(user?.uid);

  const authorName = userProfile?.displayName || user?.displayName || "Unknown";
  const { notes, loading: notesLoading } = useNotes(
    subjectId,
    user?.uid,
    authorName,
  );
  const {
    files,
    loading: filesLoading,
    uploadFile,
    deleteFile,
    isUploading,
  } = useFiles(subjectId, user?.uid, authorName);
  const { members, loading: membersLoading } = useMembers(subjectId);

  const [subject, setSubject] = useState(null);
  const [subjectLoading, setSubjectLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Fetch subject document on mount
  useEffect(() => {
    if (!subjectId) return;

    const fetchSubject = async () => {
      setSubjectLoading(true);
      try {
        const subjectDoc = await getDoc(doc(db, "subjects", subjectId));
        if (subjectDoc.exists()) {
          setSubject({ id: subjectDoc.id, ...subjectDoc.data() });
        } else {
          setSubject(null);
        }
      } catch (error) {
        console.error("Error fetching subject:", error);
      } finally {
        setSubjectLoading(false);
      }
    };

    fetchSubject();
  }, [subjectId]);

  if (authLoading || subjectLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null;
  }

  if (!subject) {
    return (
      <div className="min-h-screen bg-surface">
        <Navbar onToggleSidebar={() => {}} />
        <div className="flex items-center justify-center py-20">
          <p className="text-surface-muted">Subject not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        subjects={subjects}
        onAddSubject={() => setAddModalOpen(true)}
      />

      <div className="flex flex-1 flex-col">
        <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        <main className="flex-1 p-6 space-y-6">
          {/* Subject header */}
          <div className="rounded-xl border border-surface-border bg-surface-card shadow-sm overflow-hidden">
            <div className="flex items-center gap-4 p-5">
              {/* Left color accent bar */}
              <div
                className="self-stretch w-1 rounded-full shrink-0"
                style={{ backgroundColor: subject.color }}
              />

              {/* Subject icon */}
              {(() => {
                const SubjectIcon =
                  LucideIcons[subject.icon] || LucideIcons.BookOpen;
                return (
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: subject.color + "22" }}
                  >
                    <SubjectIcon
                      className="h-5 w-5"
                      style={{ color: subject.color }}
                    />
                  </div>
                );
              })()}

              {/* Name + badge */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-bold text-gray-900 truncate">
                    {subject.name}
                  </h1>
                  <span className="shrink-0 rounded-full border border-surface-border bg-surface px-2.5 py-0.5 text-xs font-medium text-surface-muted">
                    {subject.code}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-surface-muted">
                  {subject.memberIds?.length || 0}{" "}
                  {subject.memberIds?.length === 1 ? "member" : "members"}
                </p>
              </div>

              {/* Share button */}
              <button
                onClick={() => setShareOpen(true)}
                className="shrink-0 flex items-center gap-2 rounded-lg border border-surface-border bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-surface"
              >
                <Share2 className="h-4 w-4" />
                Share
              </button>
            </div>
          </div>

          {/* Three-column layout on xl, single column below */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            {/* Notes */}
            <section>
              <NoteList
                notes={notes}
                subjectId={subjectId}
                loading={notesLoading}
                currentUserId={user.uid}
              />
            </section>

            {/* Files */}
            <section>
              <div className="mb-4 flex items-center gap-2">
                <FolderOpen className="h-5 w-5 text-brand" />
                <h2 className="text-lg font-bold text-gray-900">Files</h2>
                {files.length > 0 && (
                  <span className="rounded-full bg-brand-muted px-2.5 py-0.5 text-xs font-semibold text-brand">
                    {files.length} {files.length === 1 ? "file" : "files"}
                  </span>
                )}
              </div>
              <div className="space-y-4">
                <FileUploader onUpload={uploadFile} isUploading={isUploading} />
                <FileList
                  files={files}
                  onDelete={deleteFile}
                  loading={filesLoading}
                  currentUserId={user.uid}
                />
              </div>
            </section>

            {/* Members */}
            <section>
              <MemberList
                members={members}
                ownerId={subject.ownerId}
                currentUserId={user.uid}
                loading={membersLoading}
              />
            </section>
          </div>
        </main>
      </div>

      {/* Share modal */}
      <ShareLinkModal
        subject={subject}
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
      />

      {/* Add Subject modal (from sidebar) */}
      <AddSubjectModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={addSubject}
      />
    </div>
  );
}
