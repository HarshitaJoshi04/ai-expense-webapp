import cloudinary from "@/utils/cloudinary";
import { asyncHandler } from "@/utils/asyncHandler";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
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
