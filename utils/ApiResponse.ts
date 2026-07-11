// Why this file exists:
// This is a helper class to standardize successful API response structures.
// In standard backend architectures, all successful API responses should return a consistent payload:
// { statusCode: 200, data: {...}, success: true, message: "..." }
// This makes it easy for the frontend to write generalized wrapper clients (like Axios/fetch interceptors).

class ApiResponse {
  statusCode:number;

  data:any;
  success:boolean;
  message:string;

  constructor(statusCode:number, data:any, message:string = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

export { ApiResponse };