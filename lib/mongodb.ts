import mongoose from "mongoose";

const MONGODB_URI=process.env.MONGODB_URI!;

if(!MONGODB_URI){
  throw new Error("Please define MONGODB_URI");
}

export const connectDB=async()=>{
  try {
    await mongoose.connect(MONGODB_URI)
    console.log("MongoDB Connected")
  } catch (error) {
    console.log("MongoDB Connection Error",error);

    process.exit(1);//Stops server completely if DB fails.
  }
}