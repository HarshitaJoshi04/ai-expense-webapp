import { connectDB } from "@/lib/mongodb";
import Expense from "@/models/Expense";
import { asyncHandler } from "@/utils/asyncHandler";
import { ApiResponse } from "@/utils/ApiResponse";
import { ApiError } from "@/utils/ApiError";

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