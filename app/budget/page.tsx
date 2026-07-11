"use client";

// Why this file exists:
// This page provides a dedicated Budget Tracker view.
//
// Ponytail Philosophy:
// We delegate all budget management, localStorage persistence logic, and category summations 
// to our custom `useBudget` hook. This keeps this component extremely lean (under 120 lines)
// and simple to explain to a junior developer.

import DashboardNavbar from "@/components/Navbar";
import BudgetTrackerCard from "@/components/BudgetTrackerCard";
import { useBudget } from "@/hooks/useBudget";

export default function BudgetPage() {
  const {
    budget,
    setBudget,
    totalSpent,
    remainingBudget,
    percentage,
    categoryTotals,
  } = useBudget();

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#090D16] text-slate-900 dark:text-white transition-colors duration-300 relative overflow-hidden">
      
      {/* Decorative top blur gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[250px] bg-gradient-to-b from-purple-500/5 to-transparent blur-3xl pointer-events-none" />
        
      {/* Navbar */}
      <div className="relative z-20">
        <DashboardNavbar name="Budget Tracker" />
      </div>

      <div className="p-2 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 dark:border-white/5 pb-3">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold p-1 tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
              Budget Tracker
            </h1>
            <p className="text-slate-500 dark:text-gray-400 mt-2 text-sm sm:text-base">
              Track and visualize your spending habits
            </p>
          </div>
          
          <div className="flex items-center space-x-2.5 bg-green-500/10 border border-green-500/20 rounded-xl px-2 py-2 w-fit">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-semibold text-green-600 dark:text-green-400">
              Active Budget Limit
            </span>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="relative z-10 py-10 px-4 sm:px-6 max-w-2xl mx-auto space-y-6">

        {/* Budget Input & Sum Cards */}
        <div className="w-full">
          <BudgetTrackerCard totalSpent={totalSpent} />
        </div>

        {/* Progress Bar Card */}
        <div className="bg-white dark:bg-[#111625] rounded-3xl border border-slate-100 dark:border-white/5 shadow-md p-6 w-full transition-all duration-300">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-800 dark:text-gray-200">
              Budget Usage
            </h2>
            <p className={`font-bold ${totalSpent > budget ? "text-rose-500" : "text-emerald-500"}`}>
              {percentage.toFixed(0)}%
            </p>
          </div>

          {/* Progress Bar container */}
          <div className="w-full h-4 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden border border-slate-200/20 dark:border-white/5">
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${
                totalSpent > budget
                  ? "bg-gradient-to-r from-rose-500 to-red-500"
                  : "bg-gradient-to-r from-emerald-500 to-teal-500"
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>

          {/* Over-spent Warning badge */}
          {remainingBudget < 0 && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 font-semibold p-4 rounded-2xl mt-6 text-sm flex items-center gap-2">
              ⚠️ Budget Exceeded! Try scanning and optimizing insights.
            </div>
          )}
        </div>

        {/* Category Spending list */}
        <div className="bg-white dark:bg-[#111625] rounded-3xl border border-slate-100 dark:border-white/5 shadow-md p-6 w-full transition-all duration-300">
          <h2 className="text-xl font-bold text-slate-800 dark:text-gray-200 mb-6">
            Category Spending
          </h2>

          <div className="space-y-3.5">
            {Object.entries(categoryTotals).map(([category, amount]: any) => (
              <div
                key={category}
                className="flex items-center justify-between border border-slate-100 dark:border-white/5 bg-slate-50/20 dark:bg-white/[0.01] hover:bg-slate-50 dark:hover:bg-white/[0.02] rounded-2xl p-4 transition duration-200 hover:shadow-sm"
              >
                <p className="text-slate-800 dark:text-gray-200 font-bold text-base">
                  {category}
                </p>
                <p className="text-xl font-black text-slate-800 dark:text-white tracking-tight">
                  ₹{amount}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}