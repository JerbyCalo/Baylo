"use client";

import { useState } from "react";
import { X, Copy, Check } from "lucide-react";

/**
 * ShareLinkModal — modal to share a subject's join code.
 * Props: subject, isOpen, onClose
 */
export default function ShareLinkModal({ subject, isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !subject) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(subject.shareCode || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback — select-and-copy not needed for modern browsers
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-sm rounded-2xl border border-surface-border bg-white p-6 shadow-xl animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">Share Subject</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-surface-muted transition-colors hover:bg-surface hover:text-gray-900"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Share code display */}
        <div className="mb-4 flex items-center justify-center">
          <span className="rounded-xl bg-brand-muted px-6 py-3 text-2xl font-bold tracking-[0.3em] text-brand-dark mono">
            {subject.shareCode}
          </span>
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className={`mb-4 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
            copied
              ? "bg-green-50 text-green-700"
              : "bg-brand text-white hover:bg-brand-dark"
          }`}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy Code
            </>
          )}
        </button>

        {/* Instruction */}
        <p className="text-center text-sm text-surface-muted">
          Share this code with your classmates so they can join this subject.
        </p>
      </div>
    </div>
  );
}
