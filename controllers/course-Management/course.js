import {
  findTeacherById,
  findUserById,
  updateUserData,
} from "../../repositories/user.js";
import {
  addCourse,
  deleteCourseById,
  findAllCourses,
  findCourseById,
  findCoursesByLevel,
  updateCourseById,
} from "../../repositories/course.js";
import {
  deleteManyReviewsByCourseId,
  getAverageRatingsForCourses,
} from "../../repositories/review.js";
import { deleteEnrollmentsByCourseId } from "../../repositories/enrollment.js";
import { deleteModulesByCourseId } from "../../repositories/module.js";

export const createCourse = async (req, res) => {
  try {
    const body = req.body;
    const findTeacher = await findUserById(body.teacher);
    // console.log(findTeacher, body.teacher);
    // if (findTeacher.role !== "admin" && findTeacher.role !== "teacher") {
    //   return res.status(400).json({ message: "teacher not found" });
    // }
    if (!findTeacher) {
      return res.status(404).json({ message: "no records found" });
    }
    const newCourse = await addCourse(body);
    await updateUserData(
      { _id: newCourse.teacher },
      {
        $push: { courses: newCourse._id },
      },
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

    const findCourse = await findCourseById(id);
    if (!findCourse) {
      return res.status(404).json({ message: "No records found" });
    }

    const averageRating = await getAverageCourseRating(findCourse._id); // toFixed(2) gives two two numbers after decimal example 4.23, 0.00, 2.00

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
    const findCourse = await findAllCourses();
    if (findCourse.length < 1) {
      return res.status(404).json({ message: "No records found" });
    }
    const courseIds = findCourse.map((course) => course._id);

    const ratingsMap = await getAverageRatingsForCourses(courseIds);

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

    const findTeacher = await findTeacherById(id);
    if (!findTeacher) {
      return res.status(404).json({ message: "teacher not found" });
    }

    if (!findTeacher.courses || findTeacher.courses.length === 0) {
      return res.status(404).json({
        message: "No courses found for this teacher",
      });
    }

    const courseIds = findTeacher.courses.map((e) => e._id);

    const ratingMap = await getAverageRatingsForCourses(courseIds);
    // const result = await review.aggregate([
    //   { $match: { courseId: { $in: ids } } },
    //   { $group: { _id: "$courseId", averageRating: { $avg: "$rating" } } },
    // ]);

    // const ratingMap = new Map(
    //   result.map((e) => [e._id.toString(), e.averageRating.toFixed(2)]),
    // );

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
    const findCourse = await findCoursesByLevel(level);
    if (findCourse.length === 0) {
      return res.status(404).json({ message: "No courses found" });
    }
    const courseIds = findCourse.map((e) => e._id);

    // const result = await review.aggregate([
    //   { $match: { courseId: { $in: ids } } },
    //   { $group: { _id: "$courseId", averageRating: { $avg: "$rating" } } },
    // ]);

    // const ratingMap = new Map(
    //   result.map((e) => [e._id.toString(), e.averageRating.toFixed(2)]),
    // );
    const ratingMap = await getAverageRatingsForCourses(courseIds);

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
    const updatedCourse = await updateCourseById(id, body);
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
    const findCourse = await findCourseById(id);
    if (!findCourse) {
      return res
        .status(404)
        .json({ message: "no course found with the provided ID to delete" });
    }

    await updateUserData(
      { _id: findCourse.teacher },
      { $pull: { courses: id } },
    );
    await deleteEnrollmentsByCourseId(findCourse._id);
    await deleteModulesByCourseId(findCourse._id);
    await deleteManyReviewsByCourseId({ courseId: findCourse._id });
    await deleteCourseById(id);

    return res.status(200).json({ message: "deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", message: err.message });
  }
};
