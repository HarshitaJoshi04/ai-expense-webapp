"use client";

// Why this file exists:
// This is the core Page component for the dashboard route (/dashboard).
//
// Ponytail Philosophy (Minimalist View):
// We delegate all active state management, database API calls, and OCR receipt pipelines 
// to our custom `useDashboard` hook. This leaves this component extremely lean (under 95 lines),
// focused purely on responsive layouts and rendering.
//
// Next.js client component:
// Since this component consumes React hooks, it must remain marked "use client".

import AddExpenseCard from "@/components/AddExpenseCard";
import BudgetTrackerCard from "@/components/BudgetTrackerCard";
import ExpenseList from "@/components/ExpenseList";
import DashboardNavbar from "@/components/Navbar";
import ReceiptUploadCard from "@/components/ReceiptUploadCard";
import { useDashboard } from "@/hooks/useDashboard";

export default function Home() {
  const {
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
  } = useDashboard();

  return (
    <div className="bg-slate-50 dark:bg-[#090D16] min-h-screen text-slate-900 dark:text-white transition-colors duration-300">
      
      {/* Navigation Header */}
      <DashboardNavbar name="Dashboard" />
       
      <main className="min-h-screen py-8 sm:py-12 bg-slate-50 dark:bg-[#090D16] overflow-x-hidden">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          
          {/* Header Title Bar */}
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

            {/* Column 3: Monthly Budget Summary limit */}
            <BudgetTrackerCard
              totalSpent={totalSpent}
            />
          </div>

          {/* Bottom Row: List of recent transactions */}
          <ExpenseList 
            expenses={expenses} 
            deleteExpense={deleteExpense} 
          />
        </div>
      </main>
    </div>
  );
}