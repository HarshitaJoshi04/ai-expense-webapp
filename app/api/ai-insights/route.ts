import groq from "@/lib/groq";
import { asyncHandler } from "@/utils/asyncHandler";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";

// Why this file exists:
// This route handler takes the user's spending profile (budget, total spent, and category totals)
// and uses the Groq SDK (Llama 3.3 model) to generate 3 customized, actionable financial insights.
//
// Next.js Route Handler Concept:
// In Next.js App Router, API routes are created using file-based routing. Any `route.ts` file 
// inside the `app/api/` directory acts as an API endpoint. Here, we export a POST function 
// to receive client requests.
export const POST = asyncHandler(async (req: Request) => {
  const body = await req.json();
  const { budget, totalSpent, categoryTotals } = body;

  // Validate request parameters (defensive programming practice)
  if (budget === undefined || totalSpent === undefined || !categoryTotals) {
    throw new ApiError(400, "Missing required parameters: budget, totalSpent, or categoryTotals.");
  }

  // Define a precise prompt requesting Groq to return only a JSON array of strings
  const prompt = `
    You are a professional financial advisor AI. 
    Analyze the user's budget and spending profile:
    - Monthly Budget: ₹${budget}
    - Total Spent: ₹${totalSpent}
    - Spending Categories: ${JSON.stringify(categoryTotals)}

    Generate 3 actionable, specific, and encouraging financial tips.
    Keep each tip under 20 words.
    
    Return ONLY a JSON array of 3 strings. Example format:
    [
      "You have spent 25% of your budget on Food. Cooking at home can save ₹1,000.",
      "Your remaining budget is ₹8,000. You are on track to meet your savings goals!",
      "Bills category is high this month. Review your active subscriptions to find hidden leaks."
    ]
  `;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a direct, professional, and helpful financial assistant. You return ONLY valid JSON arrays.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3, // Low temperature for consistent formatting
    });

    const aiContent = completion.choices[0].message.content || "[]";
    
    // Clean potential markdown fencing from the response
    const cleanedJson = aiContent
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const tips = JSON.parse(cleanedJson);

    return Response.json(
      new ApiResponse(200, tips, "Insights generated successfully.")
    );
  } catch (error: any) {
    console.error("Groq AI Insights Error:", error);
    
    // Fallback tips in case the Groq API fails or rate limits, ensuring robust UX
    const fallbackTips = [
      "Track your expenses regularly to keep a pulse on your spending habits.",
      "Consider setting category limits to prevent overspending on dining and entertainment.",
      "Save at least 10% of your remaining budget as an emergency fund."
    ];
    
    return Response.json(
      new ApiResponse(200, fallbackTips, "Failed to connect to AI, returned fallbacks.")
    );
  }
});
