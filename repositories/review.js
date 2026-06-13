import { review } from "../models/reviews.js";

export const addReview = async (reviewData) => {
  return await review.create(reviewData);
};

export const findReviewByCourseId = async (courseId) => {
  return await review.findOne({ courseId }).populate("userId");
};

export const findReviewById = async (reviewId) => {
  return await review.findById(reviewId);
};

export const getAverageCourseRating = async (courseId) => {
  const result = await review.aggregate([
    { $match: { courseId } },
    { $group: { _id: "$courseId", averageRating: { $avg: "$rating" } } },
  ]);

  return result.length > 0 ? result[0].averageRating.toFixed(2) : "0.00";
};

export const getAverageRatingsForCourses = async (courseIds) => {
  const result = await review.aggregate([
    {
      $match: {
        courseId: { $in: courseIds },
      },
    },
    {
      $group: {
        _id: "$courseId",
        averageRating: { $avg: "$rating" },
      },
    },
  ]);

  return new Map(
    result.map((item) => [item._id.toString(), item.averageRating.toFixed(2)]),
  );
};

export const deleteReviewById = async (reviewId) => {
  return await review.findByIdAndDelete(reviewId);
};

export const deleteManyReviewsByCourseId = async (courseId) => {
  return await review.deleteMany({ courseId });
};
