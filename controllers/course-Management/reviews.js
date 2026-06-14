import { findUserById } from "../../repositories/user.js";
import { findCourseById, updateCourseById } from "../../repositories/course.js";
import {
  addReview,
  deleteReviewById,
  findReviewsByCourseId,
  findReviewById,
} from "../../repositories/review.js";

export const createReview = async (req, res) => {
  try {
    const { courseId, userId, rating, comment } = req.body;

    if (!courseId || !userId || !rating) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const findCourse = await findCourseById(courseId);
    if (!findCourse) {
      return res.status(404).json({ message: "course not found" });
    }
    const finduser = await findUserById(userId);
    if (!finduser) {
      return res.status(404).json({ message: "user not found" });
    }

    const newReview = await addReview({ courseId, userId, rating, comment });

    await updateCourseById(findCourse._id, {
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
    const findReviews = await findReviewsByCourseId(courseId);

    if (findReviews.length < 1) {
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
    const { id } = req.params;
    const userId = req.user._id;

    const findReview = await findReviewById(id);
    const findCourse = await findCourseById(findReview.courseId);

    if (
      findReview.userId.toString() !== userId &&
      findCourse.teacher.toString() !== userId
    ) {
      return res.status(400).json({
        message: `you can't delete this review because its not yours`,
      });
    }

    await updateCourseById(findReview.courseId, {
      $pull: { reviews: id },
    });
    await deleteReviewById(id);

    res.status(200).json({ message: "deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "internal server error", message: err.message });
  }
};
