"use client";

import { useEffect, useState } from "react";

/**
 * Why this file exists:
 * This custom hook isolates the business logic for the AI Financial Insights view.
 * It compiles the user's spending profile, submits it to the Groq serverless handler, 
 * and returns the structured advice array.
 */
export function useAiInsights() {
  const [tips, setTips] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchingAI, setFetchingAI] = useState(false);
  const [budget, setBudget] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);

  // Core aggregator and API coordinator
  const loadFinancialData = async () => {
    try {
      setLoading(true);
      
      // A. Load budget from client storage
      const savedBudget = localStorage.getItem("budget");
      const currentBudget = savedBudget ? JSON.parse(savedBudget) : 0;
      setBudget(currentBudget);

      // B. Load recent expenses
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

      // C. Submit dataset payload to our Llama API Route
      setFetchingAI(true);
      const aiRes = await fetch("/api/ai-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

  // Trigger on component mount
  useEffect(() => {
    loadFinancialData();
  }, []);

  return {
    tips,
    loading,
    fetchingAI,
    budget,
    totalSpent,
    loadFinancialData,
  };
}
