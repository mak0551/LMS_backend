import express from "express";
import { createReview, deleteReview, getReviewsByCourse } from "../../controllers/course-Management/reviews.js";
const router = express.Router();

router.post("/create", createReview);

router.get("/getbycourse/:courseId", getReviewsByCourse);

router.delete("/delete/:id", deleteReview);

export default router;
