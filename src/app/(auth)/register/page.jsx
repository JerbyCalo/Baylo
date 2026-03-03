"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { BookOpen, Loader2 } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const { register } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [school, setSchool] = useState("");
  const [course, setCourse] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleRegister = async () => {
    if (!displayName || !email || !password || !school || !course) {
      const toast = (await import("react-hot-toast")).default;
      toast.error("Please fill in all fields.");
      return;
    }

    setSubmitting(true);
    try {
      await register(email, password, displayName, school, course);
    } catch {
      // Error toast already handled in useAuth
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="mb-8 flex items-center justify-center gap-2">
          <BookOpen className="h-8 w-8 text-brand" />
          <span className="text-2xl font-bold text-brand">StudyHub</span>
        </div>

        {/* Card */}
        <div className="rounded-xl bg-surface-card p-8 shadow-md border border-surface-border">
          <h1 className="mb-1 text-2xl font-bold text-gray-900">
            Create your account
          </h1>
          <p className="mb-6 text-sm text-surface-muted">
            Join StudyHub and start sharing notes with classmates.
          </p>

          <div className="space-y-4">
            {/* Display Name */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Jerby Calo"
                className="w-full rounded-lg border border-surface-border bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-brand focus:ring-2 focus:ring-brand-muted transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-surface-border bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-brand focus:ring-2 focus:ring-brand-muted transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full rounded-lg border border-surface-border bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-brand focus:ring-2 focus:ring-brand-muted transition-all"
              />
            </div>

            {/* School */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                School
              </label>
              <input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                placeholder="e.g. Mindanao State University"
                className="w-full rounded-lg border border-surface-border bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-brand focus:ring-2 focus:ring-brand-muted transition-all"
              />
            </div>

            {/* Course */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Course
              </label>
              <input
                type="text"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                placeholder="e.g. BS Computer Science"
                className="w-full rounded-lg border border-surface-border bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-brand focus:ring-2 focus:ring-brand-muted transition-all"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleRegister}
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </div>

          {/* Footer link */}
          <p className="mt-6 text-center text-sm text-surface-muted">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-brand hover:text-brand-dark transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
