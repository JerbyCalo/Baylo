"use client";

import { useRequireAuth } from "@/hooks/useRequireAuth";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function DashboardPage() {
  const { user, loading, userProfile } = useRequireAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null; // useRequireAuth will redirect to /login
  }

  return (
    <div className="flex min-h-screen bg-surface">
      <main className="flex-1 p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back,{" "}
          {userProfile?.displayName || user.displayName || "Student"} 👋
        </h1>
        <p className="text-surface-muted">
          Your dashboard is ready. Subjects and notes will appear here in Phase
          2.
        </p>
        <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-surface-border bg-surface-card p-12">
          <div className="text-center">
            <p className="text-lg font-medium text-gray-700">No subjects yet</p>
            <p className="mt-1 text-sm text-surface-muted">
              Create your first subject or join one with a share code.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
