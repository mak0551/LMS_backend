import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();

import userRouter from "./routes/user.js";
import course from "./routes/course-Management/course.js";
import module from "./routes/course-Management/module.js";
import enrollment from "./routes/course-Management/enrollment.js";
import review from "./routes/review.js";
// import fileUpload from "./routes/course-Management/upload.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/users", userRouter);
app.use("/course", course);
app.use("/module", module);
app.use("/enrollment", enrollment);
app.use("/review", review);
// app.use("/file", fileUpload);

app.get("/", (req, res) => res.status(200).send("Home"));

export default app;