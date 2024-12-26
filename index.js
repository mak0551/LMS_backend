import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import userRouter from "./routes/user.js";
import course from "./routes/course.js"

const connetWithRetry = () => {
  return mongoose
    .connect(process.env.DB_URL)
    .then(() => console.log("DataBase Connected Successfully"))
    .catch((err) => {
      console.error("Error connecting database retry after 5 seconds", err);
      setTimeout(connetWithRetry, 5000);
    });
};
connetWithRetry();
const app = express();
app.use(express.json());

app.listen(process.env.PORT, () => {
  console.log(`server listening on port ${process.env.PORT}`);
});

app.use("/users", userRouter);
app.use("/course", course)

app.get("/", (req, res) => res.status(200).send("Home"));
