import { course } from "../../models/course-Management/course.js";
import { module } from "../../models/course-Management/module.js";
import { review } from "../../models/reviews.js";
import { enrollMent } from "../../models/course-Management/enrollment.js";
import user from "../../models/user.js";
import { populate } from "dotenv";

export const createCourse = async (req, res) => {
  try {
    const body = req.body;
    const findTeacher = await user.findById(body.teacher);
    // console.log(findTeacher, body.teacher);
    // if (findTeacher.role !== "admin" && findTeacher.role !== "teacher") {
    //   return res.status(400).json({ message: "teacher not found" });
    // }
    if (!findTeacher) {
      return res.status(404).json({ message: "no records found" });
    }
    const newCourse = await course.create(body);
    await user.findByIdAndUpdate(
      newCourse.teacher,
      {
        $push: { courses: newCourse._id },
      },
      { new: true }
    );
    res.status(200).json(newCourse);
  } catch (err) {
    // console.error("Server Error:", err); // Log backend error
    res
      .status(500)
      .json({ error: "Internal server error", message: err.message });
  }
};

export const getCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const findCourse = await course
      .findById(id)
      .populate("teacher module reviews");
    if (!findCourse) {
      return res.status(404).json({ message: "No records found" });
    }
    const result = await review.aggregate([
      { $match: { courseId: findCourse._id } },
      { $group: { _id: "$courseId", averageRating: { $avg: "$rating" } } },
    ]);

    const averageRating =
      result.length > 0 ? result[0].averageRating.toFixed(2) : "0.00"; // toFixed(2) gives two two numbers after decimal example 4.23, 0.00, 2.00
    const payload = { findCourse, rating: averageRating };

    return res.status(200).json(payload);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", message: err.message });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const findCourse = await course.find({}).populate("teacher");
    if (findCourse.length < 1) {
      return res.status(404).json({ message: "No records found" });
    }
    const ids = findCourse.map((course) => course._id);

    const result = await review.aggregate([
      { $match: { courseId: { $in: ids } } },
      { $group: { _id: "$courseId", averageRating: { $avg: "$rating" } } },
    ]);

    const ratingsMap = new Map(
      result.map((e) => [e._id.toString(), e.averageRating.toFixed(2)])
    );

    const courseWithRatings = findCourse.map((course) => ({
      ...course.toObject(),
      averageRating: ratingsMap.get(course._id.toString()) || "0.00",
    }));

    return res.status(200).json(courseWithRatings);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", message: err.message });
  }
};

export const getCoursesByTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const findTeacher = await user
      .findById(id)
      .populate({ path: "courses", populate: { path: "enrolledBy reviews" } });
    if (!findTeacher) {
      return res.status(404).json({ message: "teacher not found" });
    }
    if (!findTeacher.courses || findTeacher.courses.length === 0) {
      return res.status(404).json({
        message: "No courses found for this teacher",
      });
    }

    const ids = findTeacher.courses.map((e) => e._id);

    const result = await review.aggregate([
      { $match: { courseId: { $in: ids } } },
      { $group: { _id: "$courseId", averageRating: { $avg: "$rating" } } },
    ]);

    const ratingMap = new Map(
      result.map((e) => [e._id.toString(), e.averageRating.toFixed(2)])
    );

    const finalResult = findTeacher.courses.map((course) => ({
      ...course.toObject(),
      averageRating: ratingMap.get(course._id.toString()) || "0.00",
    }));

    res.status(200).json(finalResult);
  } catch (err) {
    res
      .status(500)
      .json({ error: "internal server error", message: err.message });
  }
};

export const getCoursesByLevel = async (req, res) => {
  try {
    const { level } = req.body;
    const findCourse = await course.find({ level: level });
    if (findCourse.length === 0) {
      return res.status(404).json({ message: "No courses found" });
    }
    const ids = findCourse.map((e) => e._id);

    const result = await review.aggregate([
      { $match: { courseId: { $in: ids } } },
      { $group: { _id: "$courseId", averageRating: { $avg: "$rating" } } },
    ]);

    const ratingMap = new Map(
      result.map((e) => [e._id.toString(), e.averageRating.toFixed(2)])
    );

    const finalResult = findCourse.map((course) => ({
      ...course.toObject(),
      averageRating: ratingMap.get(course._id.toString()) || "0.00",
    }));

    return res.status(200).json(finalResult);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", message: err.message });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const updatedCourse = await course.findByIdAndUpdate(id, body, {
      new: true,
    });
    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }
    return res
      .status(200)
      .json({ message: "updated successfully", updatedCourse });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", message: err.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const findCourse = await course.findById(id);
    if (!findCourse) {
      return res
        .status(404)
        .json({ message: "no course found with the provided ID to delete" });
    }

    await user.findOneAndUpdate(
      { _id: findCourse.teacher },
      { $pull: { courses: id } },
      { new: true }
    );
    await enrollMent.deleteMany({ courseId: findCourse._id });
    await module.deleteMany({ courseId: findCourse._id });
    await course.findByIdAndDelete(id);

    return res.status(200).json({ message: "deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", message: err.message });
  }
};
