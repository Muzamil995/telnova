import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGO_URI) {
    throw new Error("Missing MONGO_URI environment variable");
  }

  if (isConnected) {
    console.log("MongoDB is already connected");
    return;
  }

  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      dbName:
        process.env.NODE_ENV === "development"
          ? "telnova-ai-dev"
          : "telnova-ai-prod",
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });

    isConnected = connection.connections[0]?.readyState === 1;

    console.log("MongoDB Connected");
  } catch (error) {
    isConnected = false;
    console.log(error);
    throw new Error(`MongoDB connection failed: ${error}`);
  }
};
