"use client";

import { useState } from "react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import EmptyState from "@/components/ui/EmptyState";

// Placeholder subject cards for Phase 2
const PLACEHOLDER_SUBJECTS = [
  {
    id: "subject-1",
    name: "Data Structures",
    code: "CS 201",
    color: "#6366f1",
    memberCount: 12,
  },
  {
    id: "subject-2",
    name: "Calculus II",
    code: "MATH 102",
    color: "#f59e0b",
    memberCount: 8,
  },
];

function SubjectCardSkeleton({ subject }) {
  return (
    <div className="group relative flex overflow-hidden rounded-xl border border-surface-border bg-surface-card shadow-sm transition-shadow hover:shadow-md animate-fade-in">
      {/* Color accent bar */}
      <div
        className="w-1.5 shrink-0"
        style={{ backgroundColor: subject.color }}
      />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              {subject.name}
            </h3>
            <p className="mt-0.5 text-sm text-surface-muted">{subject.code}</p>
          </div>
          <span className="rounded-full bg-brand-muted px-2.5 py-0.5 text-xs font-medium text-brand-dark">
            {subject.memberCount} members
          </span>
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-surface-muted">
          <span>Click to view notes &amp; files</span>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user, loading, userProfile } = useRequireAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null; // useRequireAuth will redirect to /login
  }

  const displayName = userProfile?.displayName || user.displayName || "Student";

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col">
        <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        <main className="flex-1 p-6 space-y-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {displayName} 👋
          </h1>

          {/* Subject grid */}
          {PLACEHOLDER_SUBJECTS.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {PLACEHOLDER_SUBJECTS.map((subject) => (
                <SubjectCardSkeleton key={subject.id} subject={subject} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon="BookOpen"
              title="No subjects yet"
              description="Create your first subject or join one with a share code."
              actionLabel="Add Subject"
              onAction={() => {
                // Will open AddSubjectModal in Phase 3
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
}
