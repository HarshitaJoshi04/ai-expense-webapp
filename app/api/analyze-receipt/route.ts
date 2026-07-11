import groq from "@/lib/groq";
import { asyncHandler } from "@/utils/asyncHandler";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";

// Why this file exists:
// This endpoint receives raw OCR text from a scanned receipt and sends it to Groq Llama 3.3.
// The AI is prompted to parse the text and structure it as a clean JSON object containing
// merchant, amount, category, and date.
//
// Interview Concept - Prompt Engineering & Structured JSON Output:
// LLMs are naturally conversational, but for software apps we need structured data (JSON).
// We achieve this by:
// 1. Defining a precise schema inside the system prompt.
// 2. Instructing the AI to return ONLY valid raw JSON without conversational fluff.
// 3. Cleaning potential markdown formatting characters (```json ... ```) on the client/backend before parsing.

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