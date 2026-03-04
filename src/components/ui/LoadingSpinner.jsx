"use client";

/**
 * LoadingSpinner — reusable spinner component
 *
 * Variants:
 *   fullPage (default) — centered on the full screen
 *   inline             — centered with vertical padding (e.g. inside a section)
 *   button             — tiny spinner for use inside buttons (no wrapper)
 *
 * Usage:
 *   <LoadingSpinner />                        // full page
 *   <LoadingSpinner fullPage={false} />        // inline section
 *   <LoadingSpinner variant="button" />        // inside a button
 */
export default function LoadingSpinner({
  fullPage = true,
  variant,
  size = "lg",
}) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-[3px]",
  };

  // Button variant — minimal inline spinner, inherits text color
  if (variant === "button") {
    return (
      <span
        className="inline-block h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin"
        role="status"
        aria-label="Loading"
      />
    );
  }

  const spinner = (
    <div
      className={`${sizeClasses[size]} rounded-full border-brand-muted border-t-brand animate-spin`}
      role="status"
      aria-label="Loading"
    />
  );

  if (fullPage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">{spinner}</div>
  );
}
