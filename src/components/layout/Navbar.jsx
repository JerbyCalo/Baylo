"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, ChevronDown, Menu } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import BayloLogo from "@/components/layout/BayloLogo";

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
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-brand-brown bg-brand-teal-dark px-4 lg:px-6">
      {/* Left section */}
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          onClick={onToggleSidebar}
          className="rounded-lg p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Logo */}
        <Link
          href="/dashboard"
          className="flex items-center rounded-lg px-1 transition-colors hover:opacity-80"
        >
          <BayloLogo size="md" showText={true} />
        </Link>
      </div>

      {/* Right section */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/10"
        >
          {/* Avatar */}
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-yellow text-sm font-bold text-brand-teal-dark">
            {initial}
          </div>
          {/* School name — hidden on small screens */}
          {school && (
            <span className="hidden text-sm font-medium text-white/80 sm:inline">
              {school}
            </span>
          )}
          <ChevronDown className="h-4 w-4 text-white/70" />
        </button>

        {/* Dropdown */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 rounded-xl border border-brand-brown bg-white py-1 shadow-lg animate-fade-in z-50 text-brand-teal-dark">
            {/* User info */}
            <div className="border-b border-brand-brown/30 px-4 py-3">
              <p className="text-sm font-semibold text-brand-teal-dark">
                {displayName}
              </p>
              {school && (
                <p className="mt-0.5 text-xs text-brand-brown">{school}</p>
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
