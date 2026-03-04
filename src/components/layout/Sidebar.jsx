"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { BookOpen, Code, Plus, X } from "lucide-react";

// Static placeholder subjects for Phase 2
const DUMMY_SUBJECTS = [
  {
    id: "subject-1",
    name: "Data Structures",
    code: "CS 201",
    color: "#6366f1",
    icon: "Code",
  },
  {
    id: "subject-2",
    name: "Calculus II",
    code: "MATH 102",
    color: "#f59e0b",
    icon: "BookOpen",
  },
];

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-surface-border bg-white transition-transform duration-200 ease-in-out
          lg:static lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Sidebar header (mobile only — close button) */}
        <div className="flex h-16 items-center justify-between border-b border-surface-border px-4 lg:hidden">
          <span className="text-lg font-bold text-gray-900">Subjects</span>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-surface-muted transition-colors hover:bg-surface hover:text-gray-900"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sidebar title (desktop only) */}
        <div className="hidden lg:flex h-16 items-center border-b border-surface-border px-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-surface-muted">
            My Subjects
          </span>
        </div>

        {/* Subject list */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {DUMMY_SUBJECTS.map((subject) => {
            const isActive = pathname === `/subject/${subject.id}`;
            return (
              <Link
                key={subject.id}
                href={`/subject/${subject.id}`}
                onClick={onClose}
                className={`
                  group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
                  ${
                    isActive
                      ? "bg-brand-muted text-brand-dark"
                      : "text-gray-700 hover:bg-surface"
                  }
                `}
              >
                {/* Color accent bar */}
                <span
                  className="h-8 w-1 rounded-full shrink-0"
                  style={{ backgroundColor: subject.color }}
                />
                <div className="min-w-0">
                  <p className="truncate">{subject.name}</p>
                  <p
                    className={`text-xs ${
                      isActive ? "text-brand" : "text-surface-muted"
                    }`}
                  >
                    {subject.code}
                  </p>
                </div>
              </Link>
            );
          })}

          {DUMMY_SUBJECTS.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-surface-muted">
              No subjects yet
            </p>
          )}
        </nav>

        {/* Add Subject button — pinned at bottom */}
        <div className="border-t border-surface-border p-3">
          <button
            onClick={() => {
              // Will open AddSubjectModal in Phase 3
            }}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            <Plus className="h-4 w-4" />
            Add Subject
          </button>
        </div>
      </aside>
    </>
  );
}
