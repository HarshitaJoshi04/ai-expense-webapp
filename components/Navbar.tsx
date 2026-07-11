"use client";

// Why this file exists:
// This is the main Navigation Bar for the dashboard pages. It provides links to different features
// (Dashboard, Budget, Analytics, AI Insights) and handles responsiveness for mobile screens.
//
// Next.js Link Pre-fetching:
// Next.js `<Link>` component pre-fetches pages automatically. When a link enters the user's viewport,
// Next.js starts downloading the page structure in the background. By the time the user clicks it,
// the transition is instantaneous.

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";

export default function DashboardNavbar({
  name = "Dashboard",
}: any) {

  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);

  return (

    <nav className="w-full sticky top-0 z-50 bg-[#0B1120]/90 backdrop-blur-lg border-b border-white/10">

      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* LOGO */}

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-200 to-blue-900 flex items-center justify-center font-bold text-lg shadow-lg">
            Æ
          </div>

          <h1 className="text-2xl font-bold bg-gradient-to-tr from-purple-200 to-blue-900 bg-clip-text text-transparent">
            {name}
          </h1>

        </div>

        {/* DESKTOP MENU */}

        <div className="hidden md:flex items-center gap-6 text-sm font-medium">

          <Link
            href="/dashboard"
            className="hover:text-purple-400 transition"
          >
            Dashboard
          </Link>

          {/* DROPDOWN */}

          <div className="relative">

            <button
              onClick={() => setDropdown(!dropdown)}
              className="flex items-center gap-1 hover:text-green-400 transition cursor-pointer"
            >
              Features
              <ChevronDown
                size={18}
                className={`transition-transform ${
                  dropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {dropdown && (

              <div className="absolute top-12 right-0 w-60 bg-[#111827] border border-white/10 rounded-2xl shadow-2xl p-2 space-y-1">

                <Link
                  href="/budget"
                  className="block px-4 py-3 rounded-xl hover:bg-white/5 transition"
                >
                   Budget Tracker
                </Link>

                <Link
                  href="/analytics"
                  className="block px-4 py-3 rounded-xl hover:bg-white/5 transition"
                >
                   Analytics
                </Link>

                <Link
                  href="/ai-insight"
                  className="block px-4 py-3 rounded-xl hover:bg-white/5 transition"
                >
                   AI Insights
                </Link>

                <Link
                  href="/settings"
                  className="block px-4 py-3 rounded-xl hover:bg-white/5 transition"
                >
                   Settings
                </Link>

              </div>
            )}
          </div>

        </div>

        {/* MOBILE MENU BUTTON */}

        <button
          className="md:hidden bg-white/5 p-2 rounded-lg cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>

      </div>

      {/* MOBILE MENU */}

      {open && (

        <div className="md:hidden px-6 pb-6">

          <div className="bg-[#111827] border border-white/10 rounded-2xl p-4 flex flex-col gap-3 shadow-xl">

            <Link
              href="/dashboard"
              className="hover:bg-white/5 p-3 rounded-xl transition"
            >
              Dashboard
            </Link>

            <Link
              href="/budget"
              className="hover:bg-white/5 p-3 rounded-xl transition"
            >
               Budget Tracker
            </Link>

            <Link
              href="/analytics"
              className="hover:bg-white/5 p-3 rounded-xl transition"
            >
               Analytics
            </Link>

            {/* FIXED: corrected route path from /ai-insights to /ai-insight */}
            <Link
              href="/ai-insight"
              className="hover:bg-white/5 p-3 rounded-xl transition"
            >
               AI Insights
            </Link>

            <Link
              href="/settings"
              className="hover:bg-white/5 p-3 rounded-xl transition"
            >
               Settings
            </Link>

          </div>
        </div>
      )}
    </nav>
  );
}