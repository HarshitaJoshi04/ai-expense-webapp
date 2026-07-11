import cloudinary from "@/utils/cloudinary";
import { asyncHandler } from "@/utils/asyncHandler";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";

// Why this file exists:
// This endpoint receives receipt image files uploaded from the client-side form,
// buffers the binary file data into memory, converts it to a Base64 string, and uploads
// it to Cloudinary. It returns a secure, hosted image URL to the client.
//
// Next.js Multipart Form Parsing Concept:
// To read binary files from a request, we call `await req.formData()`.
// Since Cloudinary's Node SDK expects a file stream or a base64 string rather than a browser File object,
// we convert the file into an ArrayBuffer, map it to a Node `Buffer`, and format it into 
// a Base64 data-URI string before calling `cloudinary.uploader.upload()`.

export const POST = asyncHandler(async (req: Request) => {

  const formData = await req.formData();
  const file = formData.get("file") as File;
  console.log(file);
  console.log("UPLOAD API HIT");
  if (!file) {
    throw new ApiError(400, "No file uploaded");
  }

  const bytes = await file.arrayBuffer();

  const buffer = Buffer.from(bytes);

  const base64Image = `data:${file.type};base64,${buffer.toString("base64")}`;

  const uploadedImage = await cloudinary.uploader.upload(base64Image, {
    folder: "ai-expense-agent",
  });

  return Response.json(
    new ApiResponse(
      200,
      {
        imageUrl: uploadedImage.secure_url,
      },
      "Image uploaded Successfully",
    ),
  );
});
