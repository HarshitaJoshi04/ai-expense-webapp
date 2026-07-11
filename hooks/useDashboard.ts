"use client";

import { useEffect, useState } from "react";

/**
 * Why this file exists:
 * This is a custom React hook that encapsulates all state, side effects, and API requests 
 * for the Expense Dashboard page.
 * 
 * Separating Logic from Presentation:
 * Under the Ponytail philosophy, we keep React visual components thin and focused on rendering. 
 * By extracting this logic, we keep our dashboard page component under 150 lines. 
 * This is an excellent design pattern to discuss during technical interviews.
 */
export function useDashboard() {
  // 1. STATE DEFINITIONS
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [merchant, setMerchant] = useState("");
  const [receiptUrl, setReceiptUrl] = useState("");
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [receiptImage, setReceiptImage] = useState<string | null>(null);

  // 2. FETCH EXPENSES FROM DATABASE
  const fetchExpenses = async () => {
    try {
      const res = await fetch("/api/expenses");
      const data = await res.json();
      setExpenses(data.data || []);
    } catch (error) {
      console.error("Fetch Expenses Error:", error);
    }
  };

  // 3. CREATE MANUAL EXPENSE
  const addExpense = async () => {
    if (!amount || !category || !merchant) {
      alert("Please fill in all fields before adding an expense.");
      return;
    }

    try {
      setLoading(true);
      await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          category,
          merchant,
          receiptImage: receiptUrl,
        }),
      });

      // Clear the input fields on success
      setAmount("");
      setCategory("");
      setMerchant("");
      setReceiptUrl("");
      setReceiptImage(null);

      // Re-fetch updated expenses
      await fetchExpenses();
    } catch (error) {
      console.error("Add Expense Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // 4. DELETE AN EXPENSE BY ID
  const deleteExpense = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this expense?");
    if (!confirmDelete) return;

    try {
      await fetch(`/api/expenses/${id}`, {
        method: "DELETE",
      });

      // Optimistic UI update: remove item from the array locally first to feel instantaneous
      setExpenses((prev) => prev.filter((exp) => exp._id !== id));
    } catch (error) {
      console.error("Delete Expense Error:", error);
    }
  };

  // 5. COORDINATE THREE-STEP AI SCAN PIPELINE
  const uploadReceipt = async (file: File) => {
    try {
      // Step A: Local client-side preview immediately for responsive UX
      setReceiptImage(URL.createObjectURL(file));
      setLoading(true);

      // Step B: Upload file binary to Cloudinary via FormData
      const formData = new FormData();
      formData.append("file", file);

      console.log("Step 1: Uploading binary receipt image...");
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();
      const imageUrl = uploadData.data.imageUrl;
      setReceiptUrl(imageUrl);

      // Step C: Send Cloudinary URL to OCR Space API
      console.log("Step 2: Performing OCR scan...");
      const scanRes = await fetch("/api/scan-receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
      });
      const scanData = await scanRes.json();
      const extractedText = scanData.data.extractedText;

      if (!extractedText.trim()) {
        alert("OCR did not find readable text. Please fill details manually.");
        setLoading(false);
        return;
      }

      // Step D: Send raw OCR text to Groq Llama 3.3 for structured JSON output
      console.log("Step 3: Querying Groq AI for details extraction...");
      const analyzeRes = await fetch("/api/analyze-receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ extractedText }),
      });
      const analyzeData = await analyzeRes.json();
      const aiResponse = analyzeData?.data;

      if (!aiResponse) {
        throw new Error("No response received from the AI model.");
      }

      // Clean potential markdown formatting indicators (```json ... ```)
      const cleanedResponse = aiResponse
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const aiData = JSON.parse(cleanedResponse);

      // Populate input states so users can verify/edit before writing to database (Human-in-the-Loop)
      setAmount(aiData.amount?.toString() || "");
      setMerchant(aiData.merchant || "");
      setCategory(aiData.category || "");
    } catch (error) {
      console.error("AI Scanning Pipeline Failed:", error);
      alert("Failed to scan receipt. You can still input details manually.");
    } finally {
      setLoading(false);
    }
  };

  // 6. CALCULATE TOTAL MONEY SPENT (derived state)
  const totalSpent = expenses.reduce(
    (total, expense) => total + Number(expense.amount),
    0
  );

  // 7. INITIAL MOUNT EFFECT
  useEffect(() => {
    fetchExpenses();
  }, []);

  // Expose hooks variables and functions to page components
  return {
    amount,
    setAmount,
    category,
    setCategory,
    merchant,
    setMerchant,
    expenses,
    loading,
    receiptImage,
    addExpense,
    deleteExpense,
    uploadReceipt,
    totalSpent,
  };
}
