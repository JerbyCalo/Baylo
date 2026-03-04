"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, LogOut, ChevronDown, Menu } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar({ onToggleSidebar }) {
  const { user, userProfile, logout } = useAuth();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Hide Navbar on auth pages
  const authRoutes = ["/login", "/register"];
  if (authRoutes.includes(pathname)) return null;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayName =
    userProfile?.displayName || user?.displayName || "Student";
  const initial = displayName.charAt(0).toUpperCase();
  const school = userProfile?.school || "";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-surface-border bg-white px-4 lg:px-6">
      {/* Left section */}
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          onClick={onToggleSidebar}
          className="rounded-lg p-2 text-surface-muted transition-colors hover:bg-surface hover:text-gray-900 lg:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Logo */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-lg px-1 transition-colors hover:opacity-80"
        >
          <BookOpen className="h-6 w-6 text-brand" />
          <span className="text-lg font-bold text-gray-900">StudyHub</span>
        </Link>
      </div>

      {/* Right section */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-surface"
        >
          {/* Avatar */}
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white">
            {initial}
          </div>
          {/* School name — hidden on small screens */}
          {school && (
            <span className="hidden text-sm font-medium text-gray-700 sm:inline">
              {school}
            </span>
          )}
          <ChevronDown className="h-4 w-4 text-surface-muted" />
        </button>

        {/* Dropdown */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 rounded-xl border border-surface-border bg-white py-1 shadow-lg animate-fade-in">
            {/* User info */}
            <div className="border-b border-surface-border px-4 py-3">
              <p className="text-sm font-semibold text-gray-900">
                {displayName}
              </p>
              {school && (
                <p className="mt-0.5 text-xs text-surface-muted">{school}</p>
              )}
            </div>
            {/* Logout */}
            <button
              onClick={() => {
                setDropdownOpen(false);
                logout();
              }}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
