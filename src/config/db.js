import mongoose from "mongoose";

export const connectDB = async (mongoURI) => {
  try {
    const  connectionInstance = await mongoose.connect(mongoURI);
    console.log(`MongoDB connected ${connectionInstance.connection.host}`, );
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};