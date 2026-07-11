import Groq from "groq-sdk";

// Why this file exists:
// This file initializes and exports the Groq SDK client instance.
// By centralizing the initialization here, we avoid recreating the Groq client instance 
// across multiple route files, keeping our memory usage clean.
//
// Interview Concept - Environment Variables & Security:
// We read the api key from `process.env.GROQ_API_KEY`. In Next.js, variables that do NOT
// start with `NEXT_PUBLIC_` are strictly kept server-side. This is crucial for security,
// ensuring our LLM keys are never leaked to the client browser!

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export default groq;