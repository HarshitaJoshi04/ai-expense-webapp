import mongoose, { Schema } from "mongoose";

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