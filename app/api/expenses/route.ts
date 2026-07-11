import { connectDB } from "@/lib/mongodb";
import Expense from "@/models/Expense";
import { asyncHandler } from "@/utils/asyncHandler";
import { ApiResponse } from "@/utils/ApiResponse";
import { ApiError } from "@/utils/ApiError";

// Why this file exists:
// This is the core API Route for managing expenses. It handles:
// - POST requests: Save a new manual or AI-extracted expense to MongoDB.
// - GET requests: Retrieve all saved expenses sorted by creation date.
//
// Next.js Route Handler HTTP Mapping:
// In Next.js App Router, we export functions named after HTTP verbs (GET, POST, etc.) 
// to handle different requests hitting the same path.
// Every request first invokes `await connectDB()` to ensure our database connection is hot.

export const POST = asyncHandler(async (req: Request) => {

  await connectDB();

  const body = await req.json();

  const { amount, category, merchant ,receiptImage} = body;

  if (!amount || !category || !merchant) {
    throw new ApiError(400, "All fields are required");
  }

  const expense = await Expense.create({
    amount,
    category,
    merchant,
    receiptImage
  });

  return Response.json(
    new ApiResponse(
      201,
      expense,
      "Expense Added Successfully"
    )
  );
});

export const GET = asyncHandler(async () => {
  await connectDB();

  const expenses = await Expense.find().sort({
    createdAt: -1,
  });

  return Response.json(
    new ApiResponse(
      200,
      expenses,
      "Expenses Fetched Successfully"
    )
  );
});