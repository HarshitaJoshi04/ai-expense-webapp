import { asyncHandler } from "@/utils/asyncHandler";
import { ApiResponse } from "@/utils/ApiResponse";
import { ApiError } from "@/utils/ApiError";

// Why this file exists:
// This API Route handles receipt scanning. It receives a Cloudinary image URL and sends it
// to the external OCR.Space API. OCR.Space reads the image and returns the raw parsed text.
//
// Integration Concept:
// We communicate with OCR.Space using `fetch` inside a POST request.
// The OCR.Space API expects parameters encoded as `application/x-www-form-urlencoded`.
// We achieve this in JS by passing a `new URLSearchParams({...})` body.

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