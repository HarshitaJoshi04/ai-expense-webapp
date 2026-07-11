"use client";

// Why this file exists:
// This is the core page of the Dashboard. It acts as the "smart manager" or orchestrator of the dashboard UI.
// It holds the state for manual input, tracks loading indicators, and manages the list of expenses.
// It also coordinates the multi-step receipt upload and extraction process.
//
// Next.js Concept - Client Components & "use client":
// By default, components in the Next.js App Router are Server Components (which run only on the server).
// Since this page handles client-side state (useState), lifecycle events (useEffect), and user events
// (button clicks, file uploads), we must declare it as a Client Component using the "use client" directive at the very top.

import AddExpenseCard from "@/components/AddExpenseCard";
import BudgetTrackerCard from "@/components/BudgetTrackerCard";
import ExpenseList from "@/components/ExpenseList";
import DashboardNavbar from "@/components/Navbar";
import ReceiptUploadCard from "@/components/ReceiptUploadCard";
import { useEffect, useState } from "react";

export default function Home() {
  // ----------------------------------------------------
  // 1. STATE DEFINITIONS
  // ----------------------------------------------------
  // React State Hook (useState) allows us to store user inputs and server data.
  // When these state variables change, React automatically updates (re-renders) the UI.
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [merchant, setMerchant] = useState("");

  const [budget, setBudget] = useState(0);
  const [receiptUrl, setReceiptUrl] = useState("");
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Storing the local preview URL of the uploaded image before it's sent to the cloud
  const [receiptImage, setReceiptImage] = useState<string | null>(null);

  // ----------------------------------------------------
  // 2. EXPENSE ACTIONS (API REQUESTS)
  // ----------------------------------------------------

  /**
   * Deletes an expense by its database ID.
   * 
   * Data Flow:
   * User clicks Delete -> Confirm popup -> DELETE fetch request -> DB updates -> UI updates
   */
  const deleteExpense = async (id: string) => {
    // Standard browser confirmation popup for good UX
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (!confirmDelete) return;

    try {
      console.log("Deleting expense ID:", id);

      // Call our Dynamic Route API: /api/expenses/[id]
      const res = await fetch(`/api/expenses/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      console.log("Delete response:", data);

      // Optimistic UI updates: Remove the deleted item from our local state array immediately
      // without needing to reload the entire list from the database.
      setExpenses((prev: any[]) =>
        prev.filter((expense) => expense._id !== id)
      );

    } catch (error) {
      console.error("Delete Expense Error:", error);
    }
  };

  /**
   * Fetches the full list of expenses from the database.
   */
  const fetchExpenses = async () => {
    try {
      const res = await fetch("/api/expenses");
      const data = await res.json();
      
      // Update local state with database results
      setExpenses(data.data);
    } catch (error) {
      console.error("Fetch Expenses Error:", error);
    }
  };

  /**
   * Calculates the total money spent by summing all expense amounts.
   * 
   * JavaScript Concept - Array.prototype.reduce:
   * Recomputes the sum on every render. If expenses change, reduce iterates through the array
   * to compute a single total value.
   */
  const totalSpent = expenses.reduce(
    (total, expense) => total + Number(expense.amount),
    0,
  );

  /**
   * Computes how much budget is remaining.
   */
  const remainingBudget = Number(budget || 0) - totalSpent;

  /**
   * Creates a new manual expense in the database.
   */
  const addExpense = async () => {
    // Basic frontend validation
    if (!amount || !category || !merchant) {
      alert("Please fill in all fields before adding an expense.");
      return;
    }

    try {
      setLoading(true);

      // Send a POST request to our API Route
      await fetch("/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          category,
          merchant,
          receiptImage: receiptUrl,
        }),
      });

      // Clear the inputs on success
      setAmount("");
      setCategory("");
      setMerchant("");
      setReceiptUrl("");
      setReceiptImage(null);

      // Refresh the expense list from the DB
      fetchExpenses();
    } catch (error) {
      console.error("Add Expense Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------
  // 3. AI SCANNING PIPELINE
  // ----------------------------------------------------
  /**
   * Coordinates the entire AI scan flow:
   * 
   * 1. User uploads a receipt image.
   * 2. Send image binary to /api/upload -> Image saved on Cloudinary -> Returns secure URL.
   * 3. Send Cloudinary URL to /api/scan-receipt -> OCR Space extracts raw text -> Returns text.
   * 4. Send raw text to /api/analyze-receipt -> Groq LLM parses details into JSON -> Returns JSON.
   * 5. Populate input form fields with AI predictions.
   * 
   * Analogy:
   * Think of it as a factory pipeline:
   * [Raw File] -> [Cloud Storage (Cloudinary)] -> [Text Reader (OCR)] -> [Smart Brain (Groq LLM)] -> [Filled Form]
   */
  const uploadReceipt = async (file: File) => {
    try {
      // 1. Create a local preview URL so the user sees their receipt image instantly
      setReceiptImage(URL.createObjectURL(file));
      setLoading(true); // set page loading state

      const formData = new FormData();
      formData.append("file", file);

      console.log("Pipeline Step 1: Uploading image to Cloudinary...");
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();
      const imageUrl = uploadData.data.imageUrl;
      setReceiptUrl(imageUrl);

      console.log("Pipeline Step 2: Sending image URL to OCR Space...");
      const scanRes = await fetch("/api/scan-receipt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl }),
      });
      const scanData = await scanRes.json();
      const extractedText = scanData.data.extractedText;

      if (!extractedText.trim()) {
        alert("OCR failed to extract readable text. Please enter the details manually.");
        setLoading(false);
        return;
      }

      console.log("Pipeline Step 3: Sending raw text to Groq LLM...");
      const analyzeRes = await fetch("/api/analyze-receipt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ extractedText }),
      });
      const analyzeData = await analyzeRes.json();
      const aiResponse = analyzeData?.data;

      if (!aiResponse) {
        throw new Error("No response received from the AI model.");
      }

      // Clean Markdown tags if returned by the LLM
      const cleanedResponse = aiResponse
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      // Parse JSON string into a JS object
      const aiData = JSON.parse(cleanedResponse);

      // Populate manual entry inputs so the user can verify/edit before adding to the DB.
      // This is a "Human-in-the-loop" pattern which is a major design best practice!
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

  // ----------------------------------------------------
  // 4. LIFECYCLE EFFECTS
  // ----------------------------------------------------
  // The useEffect hook runs once when the component mounts to load recent expenses.
  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div className="bg-slate-50 dark:bg-[#090D16] min-h-screen text-slate-900 dark:text-white transition-colors duration-300">
      
      {/* Navbar Component */}
      <DashboardNavbar name="Dashboard" />
       
      <main className="min-h-screen py-8 sm:py-12 bg-slate-50 dark:bg-[#090D16] overflow-x-hidden">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          
          {/* Dashboard Header */}
          <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 dark:border-white/5 pb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                Expense Dashboard
              </h1>
              <p className="text-slate-500 dark:text-gray-400 mt-1 text-sm sm:text-base">
                Track and visualize your spending habits
              </p>
            </div>
            
            {/* Visual Indicator of AI active status */}
            <div className="flex items-center space-x-2.5 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-2 w-fit">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                AI Active & Ready
              </span>
            </div>
          </div>

          {/* Three-Column Grid Setup: Add Expense | Upload Receipt | Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Column 1: Add Manual Expense */}
            <AddExpenseCard
              amount={amount}
              setAmount={setAmount}
              category={category}
              setCategory={setCategory}
              merchant={merchant}
              setMerchant={setMerchant}
              addExpense={addExpense}
              loading={loading}
            />

            {/* Column 2: Upload Receipt OCR Upload */}
            <ReceiptUploadCard
              uploadReceipt={uploadReceipt}
              receiptImage={receiptImage}
            />

            {/* Column 3: Monthly Budget Summary limits */}
            <BudgetTrackerCard
              budget={budget}
              setBudget={setBudget}
              totalSpent={totalSpent}
              remainingBudget={remainingBudget}
            />
          </div>

          {/* Bottom Row: List of recent transactions */}
          <ExpenseList expenses={expenses} deleteExpense={deleteExpense} />
        </div>
      </main>
    </div>
  );
}