"use client";

// Why this file exists:
// This page provides the frontend interface for the "AI Insights" feature.
// It loads the user's monthly budget (from localStorage) and expenses (from the database),
// aggregates the data, calls our backend AI Insights API, and displays personalized
// financial recommendations.
//
// React Concepts Used:
// - useState: Manages local data like fetching, loading state, and tips arrays.
// - useEffect: Initiates data fetches on mount.
// - Conditional Rendering: Displays skeleton loader, fallback state, or loaded insights based on API status.

import { useEffect, useState } from "react";
import DashboardNavbar from "@/components/Navbar";
import { Sparkles, TrendingUp, ShieldAlert, RefreshCw } from "lucide-react";

export default function AIInsightPage() {
  const [tips, setTips] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchingAI, setFetchingAI] = useState(false);
  const [budget, setBudget] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);

  // Fetch expenses and calculate metrics
  const loadFinancialData = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch budget from local storage
      const savedBudget = localStorage.getItem("budget");
      const currentBudget = savedBudget ? JSON.parse(savedBudget) : 0;
      setBudget(currentBudget);

      // 2. Fetch expenses from API
      const res = await fetch("/api/expenses");
      const json = await res.json();
      const expensesList = json.data || [];

      // Calculate total spent
      const spentSum = expensesList.reduce(
        (sum: number, exp: any) => sum + Number(exp.amount),
        0
      );
      setTotalSpent(spentSum);

      // Group categories
      const categoryTotals = expensesList.reduce((acc: any, exp: any) => {
        const cat = exp.category || "Other";
        acc[cat] = (acc[cat] || 0) + Number(exp.amount);
        return acc;
      }, {});

      // 3. Request AI recommendations
      setFetchingAI(true);
      const aiRes = await fetch("/api/ai-insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          budget: currentBudget,
          totalSpent: spentSum,
          categoryTotals,
        }),
      });

      const aiJson = await aiRes.json();
      setTips(aiJson.data || []);
    } catch (error) {
      console.error("Failed to load insights:", error);
    } finally {
      setFetchingAI(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFinancialData();
  }, []);

  return (
    <div className="bg-slate-50 dark:bg-[#090D16] min-h-screen text-slate-900 dark:text-white transition-colors duration-300 relative overflow-hidden font-sans">
      
      {/* Background Decorative Blurs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[300px] bg-gradient-to-b from-purple-500/10 to-transparent blur-3xl pointer-events-none" />

      {/* Navigation */}
      <DashboardNavbar name="AI Insights" />

      {/* Main Container */}
      <main className="relative z-10 px-4 py-8 sm:px-6 sm:py-12 lg:px-8 max-w-4xl mx-auto">
        
        {/* Header Block */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 dark:border-white/5 pb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
              AI Financial Insights
            </h1>
            <p className="text-slate-500 dark:text-gray-400 mt-1 text-sm sm:text-base">
              Personalized budget analysis powered by Groq Llama 3.3
            </p>
          </div>

          <button
            onClick={loadFinancialData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 rounded-xl transition duration-200 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={14} className={fetchingAI ? "animate-spin" : ""} />
            Re-Analyze
          </button>
        </div>

        {/* Loading / Insights Content */}
        {loading ? (
          // Skeleton Loading State - Simulates component structures for a premium visual flow
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-[#111625] rounded-3xl p-6 border border-slate-100 dark:border-white/5 animate-pulse flex items-start space-x-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-white/5 shrink-0" />
                <div className="space-y-2 w-full">
                  <div className="h-4 bg-slate-200 dark:bg-white/5 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 dark:bg-white/5 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : tips.length === 0 ? (
          // Empty State
          <div className="text-center py-16 bg-white dark:bg-[#111625] border border-dashed border-slate-200 dark:border-white/10 rounded-3xl">
            <p className="text-slate-500 dark:text-gray-400 font-semibold text-lg">No Financial Insights Available</p>
            <p className="text-slate-400 dark:text-gray-500 text-sm mt-1">Please set a budget and add expenses on the dashboard first.</p>
          </div>
        ) : (
          // Loaded Cards
          <div className="space-y-6">
            
            {/* Quick Metrics Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-purple-500/5 border border-purple-500/10 rounded-3xl p-6">
              <div>
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Active Budget Status</span>
                <p className="text-sm text-gray-300 mt-1">
                  You have spent <span className="font-bold text-white">₹{totalSpent}</span> out of your <span className="font-bold text-white">₹{budget}</span> limit.
                </p>
              </div>
              <div className="flex items-center sm:justify-end">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-purple-500/10 border border-purple-500/20 text-purple-300">
                  <Sparkles size={12} />
                  AI Analysis Up-To-Date
                </span>
              </div>
            </div>

            {/* List of Insights */}
            <div className="space-y-4">
              {tips.map((tip, idx) => {
                // Assign icons dynamically based on index for variety
                const icon = idx === 0 
                  ? <Sparkles className="w-6 h-6 text-purple-400" />
                  : idx === 1 
                  ? <TrendingUp className="w-6 h-6 text-emerald-400" />
                  : <ShieldAlert className="w-6 h-6 text-amber-400" />;

                const bgGlow = idx === 0
                  ? "from-purple-500/10 to-transparent"
                  : idx === 1
                  ? "from-emerald-500/10 to-transparent"
                  : "from-amber-500/10 to-transparent";

                return (
                  <div
                    key={idx}
                    className="relative bg-white dark:bg-[#111625] rounded-3xl p-6 border border-slate-100 dark:border-white/5 shadow-md flex items-start space-x-4 overflow-hidden group hover:scale-[1.01] transition-transform duration-300"
                  >
                    {/* Corner gradient glow on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${bgGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                    {/* Icon container */}
                    <div className="relative z-10 p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 shrink-0">
                      {icon}
                    </div>

                    {/* Content */}
                    <div className="relative z-10 space-y-1.5">
                      <h3 className="text-xs font-bold text-slate-400 dark:text-gray-400 uppercase tracking-widest">
                        Insight #{idx + 1}
                      </h3>
                      <p className="text-slate-800 dark:text-gray-200 font-semibold text-lg leading-relaxed">
                        {tip}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            
          </div>
        )}

      </main>
    </div>
  );
}