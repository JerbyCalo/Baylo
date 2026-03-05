"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import BayloLogo from "@/components/layout/BayloLogo";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      const toast = (await import("react-hot-toast")).default;
      toast.error("Please fill in all fields.");
      return;
    }

    setSubmitting(true);
    try {
      await login(email, password);
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
        <div className="mb-8 flex items-center justify-center">
          <BayloLogo size="lg" textClass="text-brand-teal-dark" />
        </div>

        {/* Card */}
        <div className="rounded-xl bg-surface-card p-8 shadow-md border border-brand-brown">
          <h1 className="mb-1 text-2xl font-bold text-gray-900">
            Welcome back
          </h1>
          <p className="mb-6 text-sm text-surface-muted">
            Sign in to continue to Baylo.
          </p>

          <div className="space-y-4">
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
                className="w-full rounded-lg border border-brand-brown bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/30 transition-all"
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
                placeholder="Enter your password"
                className="w-full rounded-lg border border-brand-brown bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/30 transition-all"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleLogin();
                }}
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleLogin}
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-yellow px-4 py-2.5 text-sm font-semibold text-brand-teal-dark transition-colors hover:bg-brand-gold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </div>

          {/* Footer link */}
          <p className="mt-6 text-center text-sm text-surface-muted">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-brand-teal hover:text-brand-teal-dark transition-colors"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
