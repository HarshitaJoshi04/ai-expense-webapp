# Technical Interview Study Guide & Project Explanations
*AI Expense Agent - Refactored for Interview Readiness*

Use this document to prepare for your coding interviews. It contains clear, professional explanations, system architecture details, and answers to common follow-up questions.

---

## 1. 2-Minute Project Explanation (The "Elevator Pitch")
> **How to present this in an interview:**
> *"I built **AI Expense Agent**, an intelligent financial tracker that simplifies manual logging by leveraging OCR and LLMs. 
> 
> The core problem it solves is that manual expense tracking is tedious and prone to human error. With my application, a user simply uploads a receipt image. The app automatically runs it through an OCR engine (OCR.Space) to extract raw text, and then uses a Large Language Model (Llama 3.3 via the Groq SDK) to parse, categorize, and extract structured metrics like merchant, category, amount, and date.
> 
> It's built with Next.js (App Router), React, MongoDB (Mongoose ODM), Tailwind CSS for styling, and Recharts for interactive analytics. I implemented connection-pooling caching for database efficiency in serverless environments, added responsive budgets, and integrated dynamic AI spending insights."*

---

## 2. 5-Minute Project Explanation (Detailed Walkthrough)
> **How to present this when asked to go deeper:**
> *"I built a full-stack **AI Expense Tracker** using **Next.js 16** and **React 19**. The project is structured into three main views: the Transaction Dashboard, Spending Analytics, and AI Insights.
> 
> Let's look at the flow of the primary feature—AI Receipt Scanning:
> 1. **Image Upload**: When a user selects a receipt image, the frontend reads the file and uploads it to our Route Handler (`/api/upload`). Here, we read the multipart form, convert the file into an ArrayBuffer, and stream it to **Cloudinary** which returns a hosted CDN URL.
> 2. **OCR Parsing**: We pass this CDN URL to `/api/scan-receipt`, which calls the external **OCR.Space API** via form URL encoding. This returns the raw text from the receipt.
> 3. **Structured AI Extraction**: We send the raw text to `/api/analyze-receipt`, which queries **Groq Llama 3.3-70B**. The prompt directs the LLM to structure the details and output only a clean JSON object containing merchant, amount, category, and date.
> 4. **Human-in-the-Loop Validation**: Instead of adding the expense directly to the database, the AI outputs populate the input form first. The user can review, edit, or confirm the details, which is a major UX best practice. Clicking 'Add Expense' saves it to **MongoDB Atlas**.
> 
> To track their finances, the user can set a budget limit. The app calculates their remaining balance in real-time, displays a responsive pie chart distribution via **Recharts**, and generates 3 personalized tips on the **AI Insights** page based on their category spending ratios."*

---

## 3. Deep Technical Architecture
Below is the data flow and system architecture:

```
[Client Browser]
   |
   +---> (POST /api/upload) ----------> [Cloudinary CDN] (Stores Image)
   |                                          | (Returns URL)
   +---> (POST /api/scan-receipt) ----> [OCR.Space API] (Extracts Text)
   |                                          | (Returns Text)
   +---> (POST /api/analyze-receipt) -> [Groq API (Llama 3.3)] (Extracts JSON)
   |                                          | (Returns JSON)
   | (User Confirms Details)
   +---> (POST /api/expenses) --------> [MongoDB Atlas] (Saves Document)
```

### Why Next.js Was Chosen
1. **Unified Stack**: Next.js combines the frontend UI and backend API routes in a single repository. There is no need to spin up and deploy a separate Node/Express server.
2. **Serverless Optimized**: Next.js Route Handlers map files directly to serverless endpoints, which auto-scale automatically.
3. **Typography & Core Optimizations**: Built-in components like `<Link>` optimize client-side routing, and font packages avoid external requests.

### Why MongoDB (Mongoose) Was Chosen
* **JSON Consistency**: Receipts and expense structures are natural documents. MongoDB stores documents in BSON (binary JSON), which matches our frontend JavaScript data structures perfectly.
* **ODM Layer**: Mongoose provides schemas and built-in type casting (e.g. converting string amounts to numbers) on top of MongoDB's schemaless database.

### Why This Folder Structure Was Chosen
* We follow Next.js App Router conventions:
  - `app/` handles page routes and API route handlers.
  - `components/` isolates UI code (keeping pages thin).
  - `lib/` contains shared API configurations (MongoDB, Groq SDK).
  - `utils/` houses global error and response formatters.
  - `models/` stores database schema models.

---

## 4. Probable Interviewer Questions & Ideal Answers

### Q1: "How do you handle database connections in a serverless environment like Next.js?"
* **Junior Answer (Avoid this):** *"I just call `mongoose.connect()` whenever the API runs."*
* **Ideal Answer (Say this):** *"In a standard server-based app (like Express), the server runs continuously and maintains a single persistent connection pool. In a serverless environment (like Next.js on Vercel), functions spin up and down dynamically to handle requests. If we connect to Mongoose on every call, we will spawn hundreds of connections and quickly exhaust the database limit. 
To prevent this, I implemented **Connection Pooling Caching** in `lib/mongodb.ts`. I store a reference to the active database connection in a global variable `(global as any).mongoose`. On subsequent requests, the function checks if a connection is already cached. If so, it reuses it. Otherwise, it initiates a new connection."*

### Q2: "What is a Hydration Mismatch in Next.js, and how did you prevent it when loading the budget?"
* **Ideal Answer:** *"Next.js pre-renders the page into static HTML on the server, then React hydrates it on the browser. If the server-rendered HTML doesn't match the browser's initial render, React throws a Hydration Mismatch error.
Since `localStorage` only exists in the browser, reading it during the server pre-rendering phase yields `undefined`, while on the browser it returns the actual budget value. This causes a mismatch. 
To solve this, I initialized the budget state to `0` during server rendering. Then, I used a `useEffect` hook to read the real value from localStorage. Since `useEffect` only fires after the component has mounted on the client, we prevent hydration errors entirely."*

### Q3: "What is the difference between Server Components and Client Components in Next.js?"
* **Ideal Answer:** *"In Next.js App Router, components are Server Components by default. They run entirely on the server, have direct secure access to databases, and send zero JavaScript to the client, which improves loading times. 
Client Components are declared using the `"use client"` directive. They run on the client browser and are required whenever you need interactivity (such as `onClick` handlers), React Hooks (like `useState` or `useEffect`), or browser APIs (like `localStorage` or DOM charting)."*

### Q4: "Why did you implement a Human-in-the-Loop flow for the AI receipt scanner?"
* **Ideal Answer:** *"OCR text extractions and LLM predictions are not 100% accurate; receipts can be blurry, crumpled, or written in complex fonts. If we added scanned data directly to the database, a single AI mistake would corrupt the user's records. 
By populating the manual entry form first, we let the user inspect, edit, and confirm the merchant, category, and amount before writing to MongoDB. This improves data reliability and user confidence."*

---

## 5. Challenges Faced & Solutions

### Challenge 1: LLM outputting Conversational Text instead of pure JSON
* **Problem**: Llama models often prefix their answers with *"Here is your JSON response..."* which crashes `JSON.parse()`.
* **Solution**: I used prompt engineering to enforce strict JSON arrays. In the API endpoint and frontend, I added sanitation logic (`.replace(/```json/g, "").replace(/```/g, "").trim()`) to clean markdown tags before parsing. I also set the LLM `temperature` to `0.3` for predictable, structured outputs.

### Challenge 2: Process Termination in Serverless Routes
* **Problem**: The original database setup used `process.exit(1)` upon connection failures.
* **Solution**: In serverless functions, calling `process.exit(1)` kills the container node instance, crashing the app for all users. I refactored `lib/mongodb.ts` to throw standard JavaScript errors so that the higher-order wrapper `asyncHandler` catches the failure and returns a clean 500 API response instead.

---

## 6. Future Scope & Improvements
If I had more time, I would implement:
1. **User Authentication**: Implement NextAuth.js or Clerk to support secure multi-user logins so users can see only their private expenses.
2. **Bulk Receipt Scanning**: Enable uploading multiple images simultaneously using queue queues.
3. **Scheduled Email Summaries**: Set up a CRON job route to email weekly spending reports using Resend.
