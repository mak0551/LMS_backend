import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectWithRetry = () => {
  return mongoose
    .connect(process.env.DB_URL)
    .then(() => {
      console.log("Database connected successfully");
    })
    .catch((err) => {
      console.error("Error connecting database retry after 5 seconds", err);
      setTimeout(connectWithRetry, 5000);
    });
};
