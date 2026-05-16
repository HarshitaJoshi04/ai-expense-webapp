import groq from "@/lib/groq";

import { asyncHandler } from "@/utils/asyncHandler";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";

export const POST = asyncHandler(
  async (req: Request) => {

    const body = await req.json();

    const { extractedText } = body;

    if (!extractedText) {
      throw new ApiError(
        400,
        "Receipt text required"
      );
    }

    // AI RESPONSE
    const completion =
      await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              `
              You are an AI receipt analyzer.

              Extract:
              - merchant
              - amount
              - category
              - date

              Return ONLY valid JSON.
              `,
          },

          {
            role: "user",
            content: extractedText,
          },
        ],

        model: "llama-3.3-70b-versatile",
      });

    const response =
      completion.choices[0]
        .message.content;

    return Response.json(
      new ApiResponse(
        200,
        response,
        "Receipt analyzed successfully"
      )
    );
  }
);