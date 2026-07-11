import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Expense from "@/models/Expense";
import { asyncHandler } from "@/utils/asyncHandler";
import { ApiResponse } from "@/utils/ApiResponse";
import { ApiError } from "@/utils/ApiError";

// Why this file exists:
// This is a Dynamic Route endpoint. The folder name is `[id]`, which means Next.js will capture
// whatever value is passed in the URL (e.g. `/api/expenses/65b6f3c...`) and map it to a parameter.
// This route specifically handles DELETE requests to remove a single expense.
//
// Next.js Route Params Concept:
// Route handlers receive a `context` parameter containing `params`.
// In Next.js App Router, `context.params` must be awaited before accessing its keys.
// We validate the ID using Mongoose `ObjectId.isValid(id)` before querying to prevent database query syntax errors.

export const DELETE =

  asyncHandler(
    async (
      req: Request,
      context: any
    ) => {

      await connectDB();

      // AWAIT PARAMS

      const params =
        await context.params;

      const id = params.id;

      console.log(id);

      // VALIDATE ID

      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {

        throw new ApiError(
          400,
          "Invalid Expense ID"
        );

      }

      // DELETE EXPENSE

      const expense =
        await Expense.findByIdAndDelete(
          id
        );

      // CHECK EXISTS

      if (!expense) {

        throw new ApiError(
          404,
          "Expense not found"
        );

      }

      return Response.json(
        new ApiResponse(
          200,
          expense,
          "Expense Deleted Successfully"
        )
      );
    }
  );