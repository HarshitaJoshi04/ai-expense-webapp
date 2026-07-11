
"use client";

// Why this file exists:
// This is the Landing Page of our application, located at the root path '/'.
// It showcases the key capabilities of our AI Expense Tracker (AI scan, budgets, analytics)
// using interactive preview cards and client-side tabs.
//
// Next.js Link Concept:
// We import the `<Link>` component from 'next/link'.
// Unlike standard HTML anchor tags (`<a>`), which trigger a full browser reload, Next.js `<Link>` 
// intercepts client-side clicks, pre-fetches linked routes in the background, and dynamically 
// updates the view. This creates a fast, single-page-app (SPA) navigation feel.

import Link from "next/link";
import { useState } from "react";

export default function Home() {

  const [activeTab, setActiveTab] = useState("scan");

  const mockFeatures = [
    {
      id: "scan",
      title: "AI Receipt Scanning",
      description: "Snap a photo of any receipt. Our advanced AI scans, extracts merchants, amounts, and dates automatically in seconds.",
      icon: (
        <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      preview: (
        <div className="bg-[#161B22] p-6 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
            <span className="text-xs text-gray-400 font-mono">RECEIPT_SCAN_v2.1.png</span>
            <span className="text-xs text-purple-400 font-semibold bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">AI Extraction Active</span>
          </div>
          <div className="space-y-3 font-mono text-sm">
            <div className="flex justify-between items-center text-gray-300">
              <span>Merchant:</span>
              <span className="text-white font-bold bg-white/5 px-2 py-0.5 rounded">Starbucks Coffee</span>
            </div>
            <div className="flex justify-between items-center text-gray-300">
              <span>Date:</span>
              <span className="text-white">May 25, 2026</span>
            </div>
            <div className="flex justify-between items-center text-gray-300">
              <span>Category:</span>
              <span className="text-purple-400 font-semibold">Food & Beverage</span>
            </div>
            <div className="border-t border-white/5 pt-3 flex justify-between items-center text-lg">
              <span className="text-gray-400">Total Amount:</span>
              <span className="text-emerald-400 font-bold">$14.50</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "budget",
      title: "Smart Budget Tracking",
      description: "Set budgets and track them effortlessly. Get real-time alerts before you overspend, guided by intelligent AI recommendations.",
      icon: (
        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      preview: (
        <div className="bg-[#161B22] p-6 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-semibold text-gray-200">Monthly Budget Status</h4>
            <span className="text-xs text-blue-400 font-semibold bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">68% Spent</span>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                <span>Spent: $680.00</span>
                <span>Budget: $1,000.00</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2.5 rounded-full" style={{ width: '68%' }} />
              </div>
            </div>
            <div className="bg-blue-500/5 border border-blue-500/15 rounded-xl p-3 flex items-start space-x-2">
              <span className="text-blue-400 text-sm">💡</span>
              <p className="text-xs text-gray-300 leading-relaxed">
                <span className="text-blue-300 font-semibold">AI Tip:</span> You're spending slightly faster on <span className="text-white font-medium">Dining Out</span> this week. Try keeping lunch costs under $15.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "insights",
      title: "Interactive Analytics",
      description: "Visual dashboards showing exactly where your money goes. Slice and dice data by merchant, date, or category.",
      icon: (
        <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.003 9.003 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
      ),
      preview: (
        <div className="bg-[#161B22] p-6 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-semibold text-gray-200">Category breakdown</h4>
            <span className="text-xs text-gray-400">May 2026</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <span className="text-gray-300">Food & Dining</span>
              </div>
              <span className="text-white font-semibold">42%</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-gray-300">Transportation</span>
              </div>
              <span className="text-white font-semibold">28%</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-gray-300">Utilities</span>
              </div>
              <span className="text-white font-semibold">18%</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                <span className="text-gray-300">Entertainment</span>
              </div>
              <span className="text-white font-semibold">12%</span>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[#090D16] text-white selection:bg-purple-500/30 selection:text-purple-200 overflow-x-hidden relative font-sans">
      
      {/* Background Decorative Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[150px] pointer-events-none" />

      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#090D16]/75 border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-200 to-blue-900 flex items-center justify-center shadow-lg shadow-purple-100/20">
              <span className="font-extrabold text-xl tracking-tight text-white">Æ</span>
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              AI Expense Agent
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-400">
            <a href="#features" className="hover:text-white transition-colors duration-200">Features</a>
            <a href="#workflow" className="hover:text-white transition-colors duration-200">How it works</a>
            <a href="#pricing" className="hover:text-white transition-colors duration-200">Pricing</a>
          </nav>

          <div className="flex items-center space-x-4">
            <Link href="/login">
              <span className="text-sm font-semibold text-gray-300 hover:text-white transition-colors duration-200 px-4 py-2 cursor-pointer">
                Log In
              </span>
            </Link>
            <Link href="/signup">
              <span className="text-sm font-semibold bg-gradient-to-r from-purple-200 to-blue-500 hover:from-purple-500 hover:to-blue-500 text-white px-5 py-2.5 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 cursor-pointer">
                Sign Up
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4.5 py-1.5 mb-8 hover:bg-white/8 transition-colors duration-200 cursor-pointer">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            <span className="text-xs font-semibold text-purple-300 tracking-wide uppercase">Introducing Version 2.0</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
            Finance tracking,
            <span className="block mt-2 bg-gradient-to-r from-purple-400 via-pink-200 to-blue-100 bg-clip-text text-transparent">
              powered by intelligence.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-gray-400 text-lg md:text-xl leading-relaxed mb-12">
            Upload your receipts and let our advanced AI extract, analyze, and categorize your expenses in seconds. Track budgets, view deep analytics, and save smarter.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <span className="w-full sm:w-auto inline-flex items-center justify-center bg-white text-black hover:bg-gray-100 font-bold px-8 py-4 rounded-xl transition-all duration-200 hover:scale-[1.02] shadow-xl shadow-white/5 cursor-pointer">
                Start Tracking Free
                <svg className="w-5 h-5 ml-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </Link>
            <Link href="/dashboard">
              <span className="w-full sm:w-auto inline-flex items-center justify-center bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 font-semibold px-8 py-4 rounded-xl transition-all duration-200 hover:scale-[1.02] cursor-pointer">
                Go to Dashboard
              </span>
            </Link>
          </div>
        </div>


      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 border-t border-white/5 relative bg-[#090D16]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
              Everything you need to master your money.
            </h2>
            <p className="text-gray-400">
              An intelligent companion designed to simplify expense tracking and deliver meaningful financial insights.
            </p>
          </div>

          {/* Interactive Feature Tabs */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-4">
              {mockFeatures.map((feat) => (
                <button
                  key={feat.id}
                  onClick={() => setActiveTab(feat.id)}
                  className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 flex items-start space-x-4 outline-none ${
                    activeTab === feat.id
                      ? "bg-white/5 border-white/10 shadow-lg shadow-purple-500/5"
                      : "bg-transparent border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <div className={`p-3 rounded-xl ${
                    activeTab === feat.id ? "bg-white/10" : "bg-white/5"
                  }`}>
                    {feat.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white mb-1.5">{feat.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{feat.description}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="lg:col-span-7">
              <div className="bg-[#0e121b] border border-white/5 rounded-3xl p-4 md:p-8 shadow-2xl relative overflow-hidden flex items-center justify-center min-h-[340px]">
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 to-blue-500/5" />
                <div className="w-full max-w-md relative z-10 transition-all duration-500 scale-95 md:scale-100">
                  {mockFeatures.find((f) => f.id === activeTab)?.preview}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5 bg-[#06080F] text-gray-500 text-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-white">AI Expense Agent</span>
            <span className="text-gray-600">|</span>
            <span>Intelligent Finance Tracking</span>
          </div>
          <div className="flex space-x-6">
            <a href="#features" className="hover:text-white transition-colors duration-200">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors duration-200">Pricing</a>
            <a href="#" className="hover:text-white transition-colors duration-200">Privacy Policy</a>
          </div>
          <p className="text-xs">&copy; 2026 AI Expense Agent. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
