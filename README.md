# AI Expense Agent 🤖💸

An intelligent, full-stack personal finance tracker built using **Next.js 16 (App Router)**, **React 19**, **MongoDB**, and the **Groq SDK** (Llama 3.3). 

This project allows users to scan paper receipts, automatically extract purchase details via AI, track monthly budget targets, visualize spending distributions, and generate personalized financial advice.

---

## 🌟 Core Features

1. **AI Receipt Scanning**: Upload images of receipts (Cloudinary). The text is extracted via OCR (OCR.Space) and structured into clean, editable fields (merchant, amount, category) by Groq's Llama 3.3 model.
2. **Human-in-the-Loop Validation**: Extracted AI fields populate the entry form, allowing users to verify or edit values before saving.
3. **Monthly Budget Tracking**: Input a budget limit and see your remaining funds computed in real-time, accompanied by a dynamic progress bar that warns you when limits are exceeded.
4. **Interactive Analytics**: View a responsive categorization pie chart powered by Recharts.
5. **AI Financial Insights**: Get 3 actionable suggestions to improve your financial habits based on your category totals and budget ratios.

---

## 🛠️ Technology Stack

* **Frontend**: Next.js App Router (Client/Server Components), React 19, Tailwind CSS, Lucide React (Icons), Recharts (Data Visualizations)
* **Backend**: Next.js Serverless Route Handlers, Node.js
* **Database**: MongoDB Atlas with Mongoose ODM
* **AI & OCR Engines**: Groq SDK (Llama 3.3 70B model), OCR.Space API
* **Cloud Storage**: Cloudinary (Receipt image CDN hosting)

---

## 📁 Folder Structure

```text
├── app/                      # Next.js App Router root
│   ├── ai-insight/           # AI Insights Page (Client Component)
│   ├── analytics/            # Recharts Analytics Page (Client Component)
│   ├── budget/               # Budget Progress Tracker Page (Client Component)
│   ├── dashboard/            # Core Expense Entry Dashboard (Client Component)
│   ├── api/                  # Backend Serverless Route Handlers
│   │   ├── ai-insights/      # Generates financial recommendations via Groq
│   │   ├── analyze-receipt/  # Parses raw OCR text into structured JSON via Groq
│   │   ├── expenses/         # Handles fetching (GET) and creating (POST) expenses
│   │   │   └── [id]/         # Handles deleting (DELETE) dynamic records
│   │   ├── scan-receipt/     # Integrates with OCR.Space to extract text
│   │   └── upload/           # Parses multipart files and uploads to Cloudinary
│   ├── layout.tsx            # Global Root Layout and Google Fonts config
│   ├── page.tsx              # Application Landing Page
│   └── globals.css           # Tailwind CSS directives
├── components/               # Reusable UI component cards
│   ├── AddExpenseCard.tsx    # Manual entry form
│   ├── BudgetTrackerCard.tsx # Budget inputs and spent summaries
│   ├── ExpenseList.tsx       # Expense list with delete triggers and receipt thumbnails
│   ├── Navbar.tsx            # Sticky, responsive header navbar
│   └── ReceiptUploadCard.tsx # File drag-and-drop / selector frame
├── lib/                      # SDK clients and helper connections
│   ├── groq.ts               # Initializes Groq SDK client
│   └── mongodb.ts            # Implements connection pooling for serverless environments
├── models/                   # Mongoose Database Schemas
│   └── Expense.ts            # Schema rules for Mongoose Expense documents
├── utils/                    # Shared backend helpers
│   ├── ApiError.ts           # Standardized API error helper class
│   ├── ApiResponse.ts        # Standardized API success helper class
│   ├── asyncHandler.ts       # Higher-Order Function to catch endpoint errors
│   └── cloudinary.ts         # Cloudinary configuration
```

---

## ⚙️ Setup & Local Installation

### Prerequisites
* [Node.js](https://nodejs.org) (v18 or higher recommended)
* [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or local MongoDB server)
* Accounts for [Cloudinary](https://cloudinary.com), [Groq Cloud](https://console.groq.com), and [OCR.Space](https://ocr.space/ocrapi) (free keys)

### Installation Steps

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd ai-expense-agent
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the project root and add the following keys:
   ```env
   # MongoDB Database URI
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/database_name

   # Groq Cloud API Key
   GROQ_API_KEY=gsk_your_groq_api_key

   # Cloudinary Media Configuration
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret

   # OCR.Space API Key (free tier available)
   OCR_SPACE_API_KEY=your_ocr_space_api_key
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for Production**:
   To compile and check for build issues:
   ```bash
   npm run build
   ```

---

## 🔄 End-to-End AI Scanning Pipeline Flow

When a user scans a receipt, the application processes the data in the following sequential flow:

```
[User Uploads File] 
        │
        ▼
1. Frontend sends file to /api/upload
        │
        ▼
2. API reads FormData, streams binary file to Cloudinary, and returns image CDN URL
        │
        ▼
3. Frontend sends image URL to /api/scan-receipt
        │
        ▼
4. API sends URL to OCR.Space, parses text, and returns raw strings
        │
        ▼
5. Frontend sends text to /api/analyze-receipt
        │
        ▼
6. API sends text to Groq Llama 3.3, extracts merchant/amount/category JSON, and returns JSON
        │
        ▼
7. Frontend parses JSON and populates the manual form inputs
        │
        ▼
[User verifies details and clicks "Add Expense"] -> Saves to MongoDB Atlas
```

---

## 🎯 Clean Code & Serverless Best Practices

* **Connection Pooling Caching**: Rather than reconnecting to Mongoose on every function request, database connections are cached globally to protect DB resources from serverless connection exhaustion.
* **Higher-Order Functions**: API routes are wrapped in an `asyncHandler` HOF, eliminating boilerplate `try-catch` structures and standardizing JSON errors.
* **Separation of Concerns**: UI components compile client-side logic, and page routes assemble views, while Mongoose defines schemas and models.
* **Hydration Safety**: Uses mounting hooks to read client-side `localStorage` data, preventing Next.js server pre-rendering hydration mismatches.
