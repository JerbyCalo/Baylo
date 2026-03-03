"use client";

import * as LucideIcons from "lucide-react";

export default function EmptyState({
  icon = "Inbox",
  title,
  description,
  actionLabel,
  onAction,
}) {
  const IconComponent = LucideIcons[icon] || LucideIcons.Inbox;

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-surface-border bg-surface-card p-12 text-center animate-fade-in">
      <IconComponent className="h-12 w-12 text-surface-muted mb-4" />
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-surface-muted">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-4 rounded-lg bg-brand px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
