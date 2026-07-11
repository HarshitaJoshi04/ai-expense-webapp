"use client";

import { useEffect, useState } from "react";

// Pre-defined styling colors matching our premium aesthetics
const CATEGORY_COLORS: Record<string, string> = {
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

/**
 * Why this file exists:
 * This custom hook handles all data parsing, loading, and formatting for the Analytics page.
 * It separates business math (like category reductions) from component rendering.
 */
export function useAnalytics() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [budget, setBudget] = useState<number>(0);

  // 1. Fetch data from DB
  const fetchExpenses = async () => {
    try {
      const res = await fetch("/api/expenses");
      const data = await res.json();
      setExpenses(data.data || []);
    } catch (error) {
      console.error("Fetch Analytics Expenses Error:", error);
    }
  };

  // 2. Load states on mount
  useEffect(() => {
    fetchExpenses();

    const savedBudget = localStorage.getItem("budget");
    if (savedBudget !== null) {
      setBudget(JSON.parse(savedBudget));
    }
  }, []);

  // 3. Compute derived totals
  const totalSpent = expenses.reduce(
    (total, expense) => total + Number(expense.amount),
    0
  );

  const remainingBudget = budget - totalSpent;

  // 4. Reduce expenses list into category aggregates
  const categoryTotals = expenses.reduce((acc: any, expense: any) => {
    const category = expense.category || "Other";
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += Number(expense.amount);
    return acc;
  }, {});

  // 5. Build Recharts data array format
  const chartData = [
    ...Object.entries(categoryTotals).map(([category, amount]) => ({
      name: category,
      value: Number(amount),
    })),
    {
      name: "Remaining",
      value: remainingBudget > 0 ? remainingBudget : 0,
    },
  ].filter(item => item.value > 0); // Hide empty sections to make charting clean

  // 6. Dynamic color provider function based on category name
  const getColor = (category: string, index: number) => {
    return (
      CATEGORY_COLORS[category] ||
      FALLBACK_COLORS[index % FALLBACK_COLORS.length]
    );
  };

  return {
    budget,
    totalSpent,
    remainingBudget: remainingBudget > 0 ? remainingBudget : 0,
    chartData,
    getColor,
  };
}
