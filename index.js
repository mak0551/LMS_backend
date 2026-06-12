import app from "./app.js";
import dotenv from "dotenv";
import { connectWithRetry } from "./config/db.js";

dotenv.config();

const startServer = async () => {
  await connectWithRetry();
  app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
  });
};

startServer();