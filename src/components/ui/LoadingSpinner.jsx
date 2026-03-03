"use client";

export default function LoadingSpinner({ fullPage = true, size = "lg" }) {
  const sizeClasses = {
    sm: "h-5 w-5 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-3",
  };

  const spinner = (
    <div
      className={`${sizeClasses[size]} rounded-full border-brand-muted border-t-brand animate-spin`}
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
