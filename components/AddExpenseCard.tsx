"use client";

// Why this file exists:
// This component provides the UI for manual expense entry. 
// It allows the user to input the amount, category, and merchant, and submits it to the parent dashboard.
//
// Interview Concept - Controlled Components:
// This form uses "Controlled Components". The input values are bound to React state variables 
// passed down as props (amount, category, merchant). Any keystroke updates the parent state 
// via state setter functions (setAmount, setCategory, setMerchant). This ensures the React state 
// remains the "single source of truth".

type AddExpenseCardProps = {
  amount: string;
  setAmount: React.Dispatch<React.SetStateAction<string>>;

  category: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;

  merchant: string;
  setMerchant: React.Dispatch<React.SetStateAction<string>>;

  addExpense: () => void;

  loading: boolean;
};

function AddExpenseCard({
  amount,
  setAmount,
  category,
  setCategory,
  merchant,
  setMerchant,
  addExpense,
  loading,
}: AddExpenseCardProps) {

  return (
    <div className="bg-white dark:bg-[#111625] rounded-3xl p-6 w-full transition-all duration-300 border border-slate-150 dark:border-white/5 shadow-md">
      
      {/* Card Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-gray-200">
          Add Expense
        </h2>
        {/* Visual Badge to indicate this is for quick manual entry */}
        <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20 uppercase tracking-wider">
          Quick Entry
        </span>
      </div>

      <div className="space-y-4">
        
        {/* Amount Input Field */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 dark:text-gray-500 block mb-1.5 uppercase tracking-wider">
            Amount (INR)
          </label>
          <input
            type="number"
            placeholder="Enter amount (e.g. 120)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            // Tailwind design styling: focus ring for accessibility, transition effects for premium feel
            className="w-full bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-white/10 rounded-xl py-3 px-4 outline-none transition-all duration-200 focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 text-slate-800 dark:text-white placeholder-slate-400 font-semibold"
          />
        </div>

        {/* Category Input Field */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 dark:text-gray-500 block mb-1.5 uppercase tracking-wider">
            Category
          </label>
          <input
            type="text"
            placeholder="Food, Travel, Bills..."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-white/10 rounded-xl py-3 px-4 outline-none transition-all duration-200 focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 text-slate-800 dark:text-white placeholder-slate-400 font-medium"
          />
        </div>

        {/* Merchant Input Field */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 dark:text-gray-500 block mb-1.5 uppercase tracking-wider">
            Merchant / Shop
          </label>
          <input
            type="text"
            placeholder="Amazon, Starbucks, Rent..."
            value={merchant}
            onChange={(e) => setMerchant(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-white/10 rounded-xl py-3 px-4 outline-none transition-all duration-200 focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 text-slate-800 dark:text-white placeholder-slate-400 font-medium"
          />
        </div>

        {/* Submit Button with Loading State */}
        <button
          onClick={addExpense}
          disabled={loading}
          // Disabled state prevents double-submissions (good UX and data integrity)
          className="w-full mt-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-gray-100 text-white py-3.5 px-4 rounded-xl font-bold tracking-wide shadow-md active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center space-x-2 cursor-pointer"
        >
          {loading ? (
            <>
              {/* Spinner animation using clean inline SVG */}
              <svg className="animate-spin h-5 w-5 text-current" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Adding...</span>
            </>
          ) : (
            <span>Add Expense</span>
          )}
        </button>

      </div>
    </div>
  );
}

export default AddExpenseCard;
