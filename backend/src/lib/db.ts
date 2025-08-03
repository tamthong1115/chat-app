import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI as string);
    console.log(`Connected to mongodb ${conn.connection.host}`);
  } catch (error) {
    console.log(`Failed to connect mongodb ${error}`);
  }
};
