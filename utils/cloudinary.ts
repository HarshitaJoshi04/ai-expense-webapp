import {v2 as cloudinary} from "cloudinary";

// Why this file exists:
// This file configures the Cloudinary SDK client. Cloudinary is a cloud service 
// for image upload, optimization, and Content Delivery Network (CDN) delivery.
// We upload receipt images here and receive an optimized HTTPS image URL.
//
// SDK Configuration:
// Cloudinary requires cloud credentials. These are loaded from our server-side 
// `.env.local` file at runtime, keeping secrets secure.

cloudinary.config({
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  api_key:process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_API_SECRET,
})

export default cloudinary;