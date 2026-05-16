"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";

export default function Home() {

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [merchant, setMerchant] = useState("");

  const [budget, setBudget] = useState("");

  const [receiptUrl, setReceiptUrl] =
    useState("");

  const [expenses, setExpenses] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [receiptImage, setReceiptImage] =
    useState<string | null>(null);

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
  // TOTAL SPENT
  // =========================

  const totalSpent = expenses.reduce(
    (total, expense) =>
      total + Number(expense.amount),
    0
  );

  // =========================
  // REMAINING BUDGET
  // =========================

  const remainingBudget =
    Number(budget || 0) - totalSpent;

  // =========================
  // ADD EXPENSE
  // =========================

  const addExpense = async () => {
    try {

      setLoading(true);

      await fetch("/api/expenses", {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          amount,
          category,
          merchant,
          receiptImage: receiptUrl,
        }),
      });

      // CLEAR FORM

      setAmount("");
      setCategory("");
      setMerchant("");

      // REFRESH DATA

      fetchExpenses();

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  // =========================
  // UPLOAD RECEIPT
  // =========================

  const uploadReceipt = async (
    file: File
  ) => {

    try {

      // LOCAL PREVIEW

      setReceiptImage(
        URL.createObjectURL(file)
      );

      // FORM DATA

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      // =========================
      // UPLOAD IMAGE
      // =========================

      const uploadRes =
        await fetch(
          "/api/upload",
          {
            method: "POST",
            body: formData,
          }
        );

      const uploadData =
        await uploadRes.json();

      const imageUrl =
        uploadData.data.imageUrl;

      console.log(
        "IMAGE URL:",
        imageUrl
      );

      // SAVE CLOUDINARY URL

      setReceiptUrl(imageUrl);

      // =========================
      // OCR SCAN
      // =========================

      const scanRes =
        await fetch(
          "/api/scan-receipt",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              imageUrl,
            }),
          }
        );

      const scanData =
        await scanRes.json();

      console.log(
        "OCR TEXT:",
        scanData
      );

      const extractedText =
        scanData.data.extractedText;

      // =========================
      // AI ANALYSIS
      // =========================

      const analyzeRes =
        await fetch(
          "/api/analyze-receipt",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              extractedText,
            }),
          }
        );

      const analyzeData =
        await analyzeRes.json();

      console.log(
        "AI RESPONSE:",
        analyzeData
      );

      // =========================
      // CLEAN AI RESPONSE
      // =========================

      const aiResponse =
        analyzeData?.data;

      if (!aiResponse) {

        console.log(
          "No AI response"
        );

        return;
      }

      const cleanedResponse =
        aiResponse
          .replace(
            /```json/g,
            ""
          )
          .replace(
            /```/g,
            ""
          )
          .trim();

      const aiData =
        JSON.parse(
          cleanedResponse
        );

      console.log(
        "PARSED AI:",
        aiData
      );

      // =========================
      // AUTO FILL FORM
      // =========================

      setAmount(
        aiData.amount
          ?.toString() || ""
      );

      setMerchant(
        aiData.merchant || ""
      );

      setCategory(
        aiData.category || ""
      );

    } catch (error) {

      console.log(
        "Upload Error:",
        error
      );

    }
  };

  useEffect(() => {

    fetchExpenses();

  }, []);

  return (

    <main className="min-h-screen bg-gray-100">

      {/* HEADER */}

      <div className="bg-black text-white px-8 py-6 shadow-lg">
        <Navbar />
      </div>

      <div className="p-8">

        {/* TOP SECTION */}

        <div className="grid lg:grid-cols-3 gap-6">

          {/* ADD EXPENSE CARD */}

          <div className="bg-white rounded-2xl shadow-md p-6">

            <h2 className="text-2xl text-gray-600 font-bold mb-6">
              Add Expense
            </h2>

            <div className="space-y-4">

              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) =>
                  setAmount(
                    e.target.value
                  )
                }
                className="w-full text-gray-600 border border-gray-300 p-3 rounded-xl outline-none focus:border-black"
              />

              <input
                type="text"
                placeholder="Category"
                value={category}
                onChange={(e) =>
                  setCategory(
                    e.target.value
                  )
                }
                className="w-full text-gray-600 border border-gray-300 p-3 rounded-xl outline-none focus:border-black"
              />

              <input
                type="text"
                placeholder="Merchant / Shop"
                value={merchant}
                onChange={(e) =>
                  setMerchant(
                    e.target.value
                  )
                }
                className="w-full text-gray-600 border border-gray-300 p-3 rounded-xl outline-none focus:border-black"
              />

              <button
                onClick={
                  addExpense
                }
                disabled={loading}
                className="w-full bg-black text-white py-3 rounded-xl hover:opacity-90 transition"
              >

                {loading
                  ? "Adding..."
                  : "Add Expense"}

              </button>

            </div>
          </div>

          {/* RECEIPT UPLOAD */}

          <div className="bg-white rounded-2xl shadow-md p-6">

            <h2 className="text-2xl text-gray-600 font-bold mb-6">
              Upload Receipt
            </h2>

            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center hover:border-black transition">

              <input
                type="file"
                accept="image/*"
                className="mb-4"
                onChange={(e) => {

                  const file =
                    e.target.files?.[0];

                  if (file) {
                    uploadReceipt(file);
                  }

                }}
              />

              <p className="text-gray-500">
                Upload receipt image for AI analysis
              </p>

              {/* IMAGE PREVIEW */}

              {receiptImage && (

                <img
                  src={receiptImage}
                  alt="Receipt Preview"
                  className="w-64 mx-auto mt-6 rounded-xl shadow-md"
                />

              )}

            </div>
          </div>

          {/* SUMMARY CARD */}

          <div className="bg-white rounded-2xl shadow-md p-6">

            <h2 className="text-xl font-semibold text-gray-600">
              Monthly Budget
            </h2>

            {/* BUDGET INPUT */}

            <div className="mt-4">

              <input
                type="number"
                value={budget}
                onChange={(e) =>
                  setBudget(
                    e.target.value
                  )
                }
                className="w-full bg-gray-100 border border-gray-300 rounded-xl p-3 outline-none"
                placeholder="Enter monthly budget"
              />

            </div>

            {/* REMAINING */}

            <p className="text-5xl font-bold mt-6">
              ₹{remainingBudget}
            </p>

            <p className="text-gray-500 mt-2">
              Remaining Budget
            </p>

            {/* TOTAL SPENT */}

            <div className="mt-10">

              <h2 className="text-xl font-semibold text-gray-600">
                Total Spent
              </h2>

              <p className="text-4xl font-bold mt-4">
                ₹{totalSpent}
              </p>

              <p className="text-gray-500 mt-2">
                This Month
              </p>

            </div>

          </div>
        </div>

        {/* EXPENSE LIST */}

        <div className="mt-10 bg-white rounded-2xl shadow-md p-6">

          <div className="flex items-center justify-between mb-6">

            <h2 className="text-2xl text-gray-600 font-bold">
              Recent Expenses
            </h2>

            <p className="text-gray-500">
              {expenses.length} Transactions
            </p>

          </div>

          <div className="space-y-4">

            {expenses.length === 0 ? (

              <div className="text-center py-10 text-gray-500">
                No expenses added yet
              </div>

            ) : (

              expenses.map(
                (expense) => (

                  <div
                    key={expense._id}
                    className="flex items-center justify-between border border-gray-200 rounded-xl p-4 hover:shadow-md transition"
                  >

                    <div className="flex items-center gap-4">

                      {expense.receiptImage && (

                        <img
                          src={
                            expense.receiptImage
                          }
                          alt="Receipt"
                          className="w-20 h-20 object-cover rounded-xl"
                        />

                      )}

                      <div>

                        <p className="font-semibold text-gray-700 text-lg">
                          {
                            expense.category
                          }
                        </p>

                        <p className="text-gray-500">
                          {
                            expense.merchant
                          }
                        </p>

                        <p className="text-sm text-gray-400 mt-1">
                          {new Date(
                            expense.createdAt
                          ).toLocaleDateString()}
                        </p>

                      </div>

                    </div>

                    <div className="text-xl text-gray-700 font-bold">
                      ₹{expense.amount}
                    </div>

                  </div>

                )
              )

            )}

          </div>

        </div>

      </div>

    </main>
  );
}