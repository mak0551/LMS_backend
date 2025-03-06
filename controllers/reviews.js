import { course } from "../models/course-Management/course.js";
import user from "../models/user.js";
import { review } from "../models/reviews.js";

export const createReview = async (req, res) => {
  try {
    const { courseId, userId, rating, comment } = req.body;

    if (!courseId || !userId || !rating) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const findCourse = await course.findById(courseId);
    if (!findCourse) {
      return res.status(404).json({ message: "course not found" });
    }
    const finduser = await user.findById(userId);
    if (!finduser) {
      return res.status(404).json({ message: "user not found" });
    }

    const newReview = new review({ courseId, userId, rating, comment });
    await newReview.save();

    await course.findByIdAndUpdate(findCourse._id, {
      $push: { reviews: newReview._id },
    });

    res
      .status(201)
      .json({ message: "Review added successfully", review: newReview });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getReviewsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const findReviews = await review.find({ courseId: courseId });
    if (courseId.length < 1) {
      return res.status(404).json({ message: "no reviews found" });
    }
    res.status(200).json(findReviews);
  } catch (err) {
    res
      .status(500)
      .json({ error: "internal server error", message: err.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { id, userId } = req.params;

    const findReview = await review.findById(id);
    const findCourse = await course.findById(findReview.courseId);

    if (
      findReview.userId.toString() !== userId &&
      findCourse.teacher.toString() !== userId
    ) {
      return res.status(400).json({
        message: `you can't delete this review because its not yours`,
      });
    }

    await course.findByIdAndUpdate(findReview.courseId, {
      $pull: { reviews: id },
    });
    await review.findByIdAndDelete(id);

    res.status(200).json({ message: "deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "internal server error", message: err.message });
  }
};
