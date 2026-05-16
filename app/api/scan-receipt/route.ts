import { asyncHandler } from "@/utils/asyncHandler";
import { ApiResponse } from "@/utils/ApiResponse";
import { ApiError } from "@/utils/ApiError";

export const POST = asyncHandler(
  async (req: Request) => {

    const body = await req.json();

    const { imageUrl } = body;

    if (!imageUrl) {
      throw new ApiError(
        400,
        "Image URL required"
      );
    }

    // OCR API CALL
    const response = await fetch(
      "https://api.ocr.space/parse/image",
      {
        method: "POST",

        headers: {
          apikey:
            process.env
              .OCR_SPACE_API_KEY!,
        },

        body: new URLSearchParams({
          url: imageUrl,
          language: "eng",
          isOverlayRequired: "false",
        }),
      }
    );

    const data =
      await response.json();

    console.log(
      "OCR RESPONSE:",
      data
    );

    // EXTRACT TEXT
    const extractedText =
      data?.ParsedResults?.[0]
        ?.ParsedText || "";

    return Response.json(
      new ApiResponse(
        200,
        {
          extractedText,
        },
        "Receipt scanned successfully"
      )
    );
  }
);