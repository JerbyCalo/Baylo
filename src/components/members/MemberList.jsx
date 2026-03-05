"use client";

import { Users } from "lucide-react";
import MemberCard from "./MemberCard";
import EmptyState from "@/components/ui/EmptyState";

/**
 * MemberList — renders the member roster for a subject.
 *
 * Props:
 *   members       — array of { uid, displayName, school, course }
 *   ownerId       — uid of the subject owner
 *   currentUserId — uid of the logged-in user
 *   loading       — boolean
 */
export default function MemberList({
  members,
  ownerId,
  currentUserId,
  loading,
}) {
  // Owner first, then alphabetically
  const sorted = loading
    ? []
    : [...members].sort((a, b) => {
        if (a.uid === ownerId) return -1;
        if (b.uid === ownerId) return 1;
        return a.displayName.localeCompare(b.displayName);
      });

  return (
    <div>
      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <Users className="h-5 w-5 text-brand" />
        <h2 className="text-lg font-bold text-gray-900">Members</h2>
        {!loading && (
          <span className="rounded-full bg-brand-muted px-2 py-0.5 text-xs font-medium text-brand-dark">
            {members.length} {members.length === 1 ? "member" : "members"}
          </span>
        )}
      </div>

      {/* Loading skeletons */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-xl border border-surface-border bg-surface-card px-4 py-3 animate-pulse"
            >
              <div className="h-9 w-9 shrink-0 rounded-full bg-gray-200" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 w-1/2 rounded bg-gray-200" />
                <div className="h-3 w-1/3 rounded bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && members.length === 0 && (
        <EmptyState
          icon="Users"
          title="No members found"
          description="Members who join this subject will appear here."
        />
      )}

      {/* Member cards */}
      {!loading && sorted.length > 0 && (
        <div className="space-y-3">
          {sorted.map((member) => (
            <MemberCard
              key={member.uid}
              member={member}
              isOwner={member.uid === ownerId}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
