"use client";

// Why this file exists:
// This component displays a list of recent expenses. It handles showing receipt previews,
// merchant and category information, formatting amounts in INR, and deleting expenses.
//
// Interview Concept - Client Components:
// This is a client-side component because it requires direct user interaction (deleting an expense)
// and handles dynamic formatting (like `toLocaleDateString` which runs in the user's local timezone).
//
// Interview Concept - Reconciliation & Keys:
// When mapping arrays in React, we must provide a unique `key` prop (here: `expense._id`).
// This helps React's Virtual DOM identify which items have changed, been added, or been removed,
// optimizing rendering performance.

interface ExpenseListProps {
  expenses: Array<{
    _id: string;
    amount: number;
    category: string;
    merchant: string;
    receiptImage?: string;
    createdAt: string;
  }>;
  deleteExpense: (id: string) => Promise<void>;
}

const ExpenseList = ({
  expenses,
  deleteExpense,
}: ExpenseListProps) => {
  return (
    <div className="mt-10 bg-white dark:bg-[#111625] rounded-3xl border border-slate-100 dark:border-white/5 shadow-md p-5 sm:p-6 overflow-hidden">

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <h2 className="text-2xl text-slate-800 dark:text-gray-200 font-bold">
          Recent Expenses
        </h2>
        <p className="text-slate-500 dark:text-gray-400 font-medium">
          {expenses.length} {expenses.length === 1 ? "Transaction" : "Transactions"}
        </p>
      </div>

      {/* Expense List Container */}
      <div className="space-y-4">
        {expenses.length === 0 ? (
          // Empty State - Crucial for professional UX
          <div className="text-center py-12 text-slate-400 dark:text-gray-500 border border-dashed border-slate-200 dark:border-white/10 rounded-2xl bg-slate-50/50 dark:bg-white/[0.01]">
            No expenses added yet. Try uploading a receipt or enter one manually above.
          </div>
        ) : (
          // Map list items
          expenses.map((expense) => (
            <div
              key={expense._id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 border border-slate-100 dark:border-white/5 bg-slate-50/20 dark:bg-white/[0.01] hover:bg-slate-50 dark:hover:bg-white/[0.02] rounded-2xl p-4 hover:shadow-sm transition duration-200"
            >
              
              {/* Left Section: Receipt Image + Details */}
              <div className="flex items-center gap-4">
                {/* Conditionally render receipt image if available */}
                {expense.receiptImage && (
                  <img
                    src={expense.receiptImage}
                    alt="Receipt Thumbnail"
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border border-slate-200 dark:border-white/10"
                  />
                )}

                {/* Text Information */}
                <div>
                  <p className="font-bold text-slate-800 dark:text-gray-200 text-lg">
                    {expense.category}
                  </p>
                  <p className="text-slate-500 dark:text-gray-400 font-medium text-sm mt-0.5">
                    {expense.merchant}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-gray-500 mt-1">
                    {new Date(expense.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {/* Right Section: Amount + Actions */}
              <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-slate-100 dark:border-white/5 pt-3 sm:pt-0 shrink-0">
                {/* Amount displaying in Indian Rupees (₹) */}
                <div className="text-2xl text-slate-800 dark:text-white font-black tracking-tight">
                  ₹{expense.amount}
                </div>

                {/* Delete Trigger Button */}
                <button
                  onClick={() => deleteExpense(expense._id)}
                  className="text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 rounded text-sm px-3 py-2.5 transition duration-200 shadow-sm border border-transparent hover:border-rose-500/20 cursor-pointer"
                >
                  Delete
                </button>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default ExpenseList;
