import mongoose, { Schema } from "mongoose";

// Why this file exists:
// This file defines the Mongoose Schema and Model for our "Expense" database document.
// Mongoose acts as an Object Data Modeling (ODM) library for MongoDB, providing structured schema validation
// and helping map JavaScript objects to database collections.
//
// Next.js Concept - Model Caching:
// In normal Node.js apps, models are created once. But in Next.js development mode,
// files are hot-reloaded (re-evaluated) on save. If we try to call `mongoose.model("Expense", schema)`
// repeatedly, Mongoose will throw a `OverwriteModelError`.
// To solve this, we check if the model is already cached: `mongoose.models.Expense || mongoose.model("Expense", expenseSchema)`.

const expenseSchema = new Schema(
  {
    amount: {

      type: Number,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    merchant: {
      type: String,
      required: true,
    },

    receiptImage: {
      type: String,
      default: "",
    },

    extractedText: {
      type: String,
      default: "",
    },

    aiGenerated: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Expense =
  mongoose.models.Expense ||
  mongoose.model("Expense", expenseSchema);

export default Expense;