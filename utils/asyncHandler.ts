// Why this file exists:
// This is a utility wrapper for Next.js route handlers.
//
// Interview Concept - Higher-Order Functions (HOF) & DRY Principle:
// Writing try-catch blocks in every API endpoint violates the DRY (Don't Repeat Yourself) principle.
// `asyncHandler` is a Higher-Order Function—it takes an API route function as an argument 
// and returns a new wrapped function. This new function automatically catches any thrown errors 
// (like `ApiError`) and formats them into a clean, JSON-based 500 error response.
// This centralizes error handling, keeping the code in route files clean and focused on business logic.

export const asyncHandler =
  (
    requestHandler: Function
  ) =>

  async (
    req: Request,
    context?: any
  ) => {

    try {

      return await requestHandler(
        req,
        context
      );

    } catch (error: any) {

      return Response.json(
        {
          success: false,
          message:
            error.message ||
            "Something went wrong",
        },
        {
          status:
            error.statusCode || 500,
        }
      );

    }
  };