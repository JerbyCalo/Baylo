"use client";

/**
 * MemberCard — displays a single subject member.
 *
 * Props:
 *   member        — { uid, displayName, school, course }
 *   isOwner       — boolean: true if this member is the subject owner
 *   currentUserId — uid of the logged-in user
 */
export default function MemberCard({ member, isOwner, currentUserId }) {
  const initial = member.displayName.charAt(0).toUpperCase();
  const isCurrentUser = member.uid === currentUserId;

  return (
    <div className="flex items-center gap-3 rounded-xl border border-surface-border bg-surface-card px-4 py-3 shadow-sm animate-fade-in">
      {/* Avatar */}
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white">
        {initial}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="truncate text-sm font-semibold text-gray-900">
            {member.displayName}
          </span>

          {/* Owner badge — takes priority; never show "You" alongside it */}
          {isOwner && (
            <span className="shrink-0 rounded-full bg-brand px-2 py-0.5 text-xs font-semibold text-white">
              Owner
            </span>
          )}

          {/* You badge — only when not the owner */}
          {!isOwner && isCurrentUser && (
            <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-surface-muted">
              You
            </span>
          )}
        </div>

        {member.course && (
          <p className="mt-0.5 truncate text-xs text-surface-muted">
            {member.course}
          </p>
        )}
      </div>
    </div>
  );
}
