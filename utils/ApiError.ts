// Why this file exists:
// This is a custom error utility class that extends JavaScript's built-in `Error` class.
// Standardizing API error responses (status codes, message formats, arrays of detailed validation errors)
// is a major best practice. It ensures the frontend always receives errors in a consistent structure.
//
// Object-Oriented JS Concept:
// We use inheritance (`extends Error`) and call the parent constructor (`super(message)`) 
// to inherit standard error properties like the call stack trace.

class ApiError extends Error {
  statusCode: number;

  data: null;
  success: boolean;
  errors: any[];

  constructor(
    statusCode: number,
    message: string = "Something went wrong",
    errors: any[] = [],
    stack: string = ""
  ) {
    super(message);

    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };