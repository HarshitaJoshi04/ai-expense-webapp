"use client";

// Why this file exists:
// This page aggregates and visualizes the user's spending habits using charts.
// It fetches expenses from the DB, reads the budget limit, categorizes the total spend, 
// and renders a Pie Chart detailing category distribution.
//
// React/Next.js Charting Concept:
// Visual charting libraries like Recharts require direct access to the DOM API (browser size, window dimensions) 
// to render responsive SVGs. Since Server Components do not have access to the browser window or DOM, 
// charting pages must be client-side ("use client").
//
// Interview Tip - Data Processing on Frontend vs Backend:
// Here we load the entire list of expenses and group them by category on the client-side using `array.reduce`.
// For junior roles, this is perfectly fine and shows clean JS skills.
// However, if asked how to scale this for millions of rows, explain that you would delegate calculations
// to the database (e.g. MongoDB Aggregation Pipeline `db.expenses.aggregate(...)`) and fetch only the 
// grouped results to reduce network payload sizes.

import DashboardNavbar from "@/components/Navbar";
import { useEffect, useState } from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";


// =========================
// CATEGORY COLORS
// =========================

const CATEGORY_COLORS: Record<
  string,
  string
> = {
  Food: "#22c55e",
  Shopping: "#3b82f6",
  Travel: "#f97316",
  Bills: "#ef4444",
  Entertainment: "#a855f7",
  Health: "#14b8a6",
  Fuel: "#eab308",
  Education: "#ec4899",
  Salary: "#6366f1",
  Remaining: "#9ca3af",
};

// =========================
// FALLBACK COLORS
// =========================

const FALLBACK_COLORS = [
  "#22c55e",
  "#3b82f6",
  "#f97316",
  "#ef4444",
  "#a855f7",
  "#14b8a6",
  "#eab308",
  "#ec4899",
  "#6366f1",
  "#0ea5e9",
];

function Analytics() {

  // =========================
  // STATES
  // =========================

  const [expenses, setExpenses] =
    useState<any[]>([]);

  const [budget, setBudget] =
    useState<number>(0);

  // =========================
  // FETCH EXPENSES
  // =========================

  const fetchExpenses = async () => {

    try {

      const res = await fetch(
        "/api/expenses"
      );

      const data = await res.json();

      setExpenses(data.data);

    } catch (error) {

      console.log(error);

    }
  };

  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {

    fetchExpenses();

    const savedBudget =
      localStorage.getItem("budget");

    if (savedBudget !== null) {

      setBudget(
        JSON.parse(savedBudget)
      );

    }

  }, []);

  // =========================
  // TOTAL SPENT
  // =========================

  const totalSpent =
    expenses.reduce(
      (total, expense) =>
        total +
        Number(expense.amount),
      0
    );

  // =========================
  // REMAINING BUDGET
  // =========================

  const remainingBudget =
    budget - totalSpent;

  // =========================
  // CATEGORY TOTALS
  // =========================

  const categoryTotals =
    expenses.reduce(
      (acc: any, expense: any) => {

        const category =
          expense.category || "Other";

        if (!acc[category]) {

          acc[category] = 0;

        }

        acc[category] += Number(
          expense.amount
        );

        return acc;

      },
      {}
    );

  // =========================
  // CHART DATA
  // =========================

  const chartData = [

    ...Object.entries(
      categoryTotals
    ).map(
      ([category, amount]) => ({
        name: category,
        value: Number(amount),
      })
    ),

    {
      name: "Remaining",
      value:
        remainingBudget > 0
          ? remainingBudget
          : 0,
    },

  ];

  // =========================
  // GET COLOR
  // =========================

  const getColor = (
    category: string,
    index: number
  ) => {

    return (
      CATEGORY_COLORS[
        category
      ] ||
      FALLBACK_COLORS[
        index %
          FALLBACK_COLORS.length
      ]
    );
  };

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

        {/* Container */}

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

            <div className="bg-white dark:bg-[#111625] rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm p-6 hover:shadow-md transition-shadow duration-300">

              <p className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider">
                Total Budget
              </p>

              <h2 className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-3 break-words tracking-tight">
                ₹{budget}
              </h2>

            </div>

            {/* Spent */}

            <div className="bg-white dark:bg-[#111625] rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm p-6 hover:shadow-md transition-shadow duration-300">

              <p className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider">
                Total Spent
              </p>

              <h2 className="text-2xl sm:text-3xl font-black text-rose-500 mt-3 break-words tracking-tight">
                ₹{totalSpent}
              </h2>

            </div>

            {/* Remaining */}

            <div className="bg-white dark:bg-[#111625] rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm p-6 hover:shadow-md transition-shadow duration-300 sm:col-span-2 xl:col-span-1">

              <p className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider">
                Remaining Budget
              </p>

              <h2 className="text-2xl sm:text-3xl font-black text-blue-500 mt-3 break-words tracking-tight">
                ₹{
                  remainingBudget > 0
                    ? remainingBudget
                    : 0
                }
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

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

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
                    label={({ name }) =>
                      name
                    }
                  >

                    {chartData.map(
                      (
                        entry,
                        index
                      ) => (

                        <Cell
                          key={`cell-${index}`}
                          fill={getColor(
                            entry.name,
                            index
                          )}
                        />

                      )
                    )}

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