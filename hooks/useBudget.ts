"use client";

import { useEffect, useState } from "react";

/**
 * Why this file exists:
 * This custom hook handles all budget data caching in localStorage, 
 * calculates progress percentages, and groups totals for the Budget Tracker view.
 */
export function useBudget() {
  const [budget, setBudget] = useState<number>(0);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);

  // 1. Initial load from localstorage and backend
  useEffect(() => {
    const savedBudget = localStorage.getItem("budget");
    if (savedBudget !== null) {
      setBudget(JSON.parse(savedBudget));
    }
    setLoaded(true);
    fetchExpenses();
  }, []);

  // 2. Automatically save budget changes to localstorage
  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem("budget", JSON.stringify(budget));
  }, [budget, loaded]);

  // 3. Fetch expenses
  const fetchExpenses = async () => {
    try {
      const res = await fetch("/api/expenses");
      const data = await res.json();
      setExpenses(data.data || []);
    } catch (error) {
      console.error("Fetch Budget Expenses Error:", error);
    }
  };

  // 4. Compute derived budget statistics
  const totalSpent = expenses.reduce(
    (total, expense) => total + Number(expense.amount),
    0
  );

  const remainingBudget = budget - totalSpent;

  // Ensure percentage behaves when budget is zero to avoid division by zero (returns NaN or Infinity)
  const percentage = Math.min(
    (totalSpent / (budget || 1)) * 100,
    100
  );

  // 5. Aggregate category totals
  const categoryTotals = expenses.reduce((acc: any, expense: any) => {
    const category = expense.category || "Other";
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += Number(expense.amount);
    return acc;
  }, {});

  return {
    budget,
    setBudget,
    totalSpent,
    remainingBudget,
    percentage,
    categoryTotals,
  };
}
