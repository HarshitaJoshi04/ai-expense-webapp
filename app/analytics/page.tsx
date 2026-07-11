"use client";

// Why this file exists:
// This page aggregates and visualizes the user's spending habits using Recharts.
//
// Ponytail Philosophy:
// We delegate all category calculations, localstorage loading, and color mappings 
// to our custom `useAnalytics` hook. This keeps the rendering code extremely short (under 135 lines)
// and clean.
//
// Recharts Client-side rendering:
// Interactive SVGs require access to browser size and DOM events. Thus, this must remain a client component.

import DashboardNavbar from "@/components/Navbar";
import { useAnalytics } from "@/hooks/useAnalytics";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function Analytics() {
  const {
    budget,
    totalSpent,
    remainingBudget,
    chartData,
    getColor,
  } = useAnalytics();

  return (
    <div className="bg-slate-50 dark:bg-[#090D16] min-h-screen text-slate-900 dark:text-white transition-colors duration-300 relative overflow-hidden font-sans">
      
      {/* Decorative top blur gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[250px] bg-gradient-to-b from-purple-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* Navbar */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-[#090D16]/80 backdrop-blur-md border-b border-slate-100 dark:border-white/5 shadow-sm">
        <DashboardNavbar name="Analytics" />
      </div>

      {/* Main Content */}
      <main className="relative z-10 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 max-w-7xl mx-auto">
        <div className="w-full">

          {/* Header */}
          <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 dark:border-white/5 pb-6">
            <div>
              <h1 className="text-3xl p-1 sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                Spending Analytics
              </h1>
              <p className="text-slate-500 dark:text-gray-400 mt-1 text-sm sm:text-base">
                Track and visualize your spending habits
              </p>
            </div>
            
            <div className="flex items-center space-x-2.5 bg-purple-500/10 border border-purple-500/20 rounded-xl px-4 py-2 w-fit">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                Live Insights
              </span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            {/* Budget */}
            <div className="bg-white dark:bg-[#111625] rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm p-6">
              <p className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider">
                Total Budget
              </p>
              <h2 className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-3 break-words tracking-tight">
                ₹{budget}
              </h2>
            </div>

            {/* Spent */}
            <div className="bg-white dark:bg-[#111625] rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm p-6">
              <p className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider">
                Total Spent
              </p>
              <h2 className="text-2xl sm:text-3xl font-black text-rose-500 mt-3 break-words tracking-tight">
                ₹{totalSpent}
              </h2>
            </div>

            {/* Remaining */}
            <div className="bg-white dark:bg-[#111625] rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm p-6 sm:col-span-2 xl:col-span-1">
              <p className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider">
                Remaining Budget
              </p>
              <h2 className="text-2xl sm:text-3xl font-black text-blue-500 mt-3 break-words tracking-tight">
                ₹{remainingBudget}
              </h2>
            </div>
          </div>

          {/* Chart Card */}
          <div className="bg-white dark:bg-[#111625] rounded-3xl border border-slate-100 dark:border-white/5 shadow-md p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-white/5 pb-4">
              <h2 className="text-xl font-bold text-slate-800 dark:text-gray-200">
                Expense Distribution
              </h2>
              <span className="text-xs font-semibold bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-300 px-3 py-1.5 rounded-lg border border-slate-200/40 dark:border-white/5">
                {chartData.length} Categories
              </span>
            </div>

            {/* Responsive Chart */}
            <div className="w-full h-[320px] sm:h-[450px] lg:h-[500px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius="80%"
                    innerRadius="45%"
                    paddingAngle={3}
                    cornerRadius={8}
                    labelLine={false}
                    label={({ name }) => name}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={getColor(entry.name, index)}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{
                      fontSize: "14px",
                      paddingTop: "20px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default Analytics;