"use client";

// Why this file exists:
// This component displays the user's monthly budget limit, calculates the remaining budget,
// and shows the total amount spent. It allows the user to edit the budget limit directly,
// which is saved and synced back to client-side localStorage.
//
// React Concepts:
// - useEffect with dependency arrays: We use a first useEffect with `[]` (empty dependency array)
//   to load the saved budget from localStorage on mount. We use a second useEffect with `[budget, loaded]`
//   to automatically write to localStorage whenever the budget state changes.

import { useEffect, useState } from "react";

const BudgetTrackerCard = ({
  totalSpent,
}: any) => {


  const [budget, setBudget] = useState(0);
  const [loaded, setLoaded] = useState(false);

  // LOAD BUDGET FIRST
  useEffect(() => {

    const savedBudget =
      localStorage.getItem("budget");

    if (savedBudget !== null) {
      setBudget(JSON.parse(savedBudget));
    }

    setLoaded(true);

  }, []);

  // SAVE BUDGET
  useEffect(() => {

    if (!loaded) return;

    localStorage.setItem(
      "budget",
      JSON.stringify(budget)
    );

  }, [budget, loaded]);

  const remainingBudget =
    budget - totalSpent;

  return (
    <div className="bg-white dark:bg-[#111625] rounded-3xl border border-slate-100 dark:border-white/5 shadow-md p-6 w-full transition-all duration-300">

      {/* Title */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold text-slate-800 dark:text-gray-200">
          Monthly Budget
        </h2>
        <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20 uppercase tracking-wider">
          Limit
        </span>
      </div>

      {/* Budget Input */}
      <input
        type="number"
        placeholder="Enter budget limit"
        value={budget || ""}
        onChange={(e) =>
          setBudget(Number(e.target.value))
        }
        className="w-full bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-white/10 rounded-2xl py-3 px-4 text-base font-semibold outline-none transition-all duration-200 focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 text-slate-800 dark:text-white placeholder-slate-400"
      />

      {/* Remaining Budget */}
      <div className="mt-6 bg-slate-50 dark:bg-white/[0.01] border border-slate-100 dark:border-white/5 rounded-2xl p-4 transition-all duration-200 hover:scale-[1.01]">
        <p className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider">
          Remaining Budget
        </p>
        <h1 className="text-3xl font-black text-emerald-500 mt-1 tracking-tight truncate">
          ₹{remainingBudget}
        </h1>
      </div>

      {/* Total Spent */}
      <div className="mt-4 bg-slate-50 dark:bg-white/[0.01] border border-slate-100 dark:border-white/5 rounded-2xl p-4 transition-all duration-200 hover:scale-[1.01]">
        <p className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider">
          Total Spent
        </p>
        <h1 className="text-2xl font-black text-rose-500 mt-1 tracking-tight truncate">
          ₹{totalSpent}
        </h1>
      </div>

    </div>
  );
};

export default BudgetTrackerCard;