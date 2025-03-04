import { course } from "../../models/course-Management/course.js";
import { module } from "../../models/course-Management/module.js";
import user from "../../models/user.js";

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
    const findCourse = await course.findById(id).populate("teacher module");
    if (!findCourse) {
      return res.status(404).json({ message: "No records found" });
    }
    return res.status(200).json(findCourse);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", message: err.message });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const findCourse = await course.find({}).populate("teacher");
    if (findCourse.length === 0) {
      return res.status(404).json({ message: "No records found" });
    }
    return res.status(200).json(findCourse);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", message: err.message });
  }
};

export const getCoursesByTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const findTeacher = await user.findById(id).populate("courses");
    if (!findTeacher) {
      return res.status(404).json({ message: "teacher not found" });
    }
    // console.log(findTeacher);
    if (!findTeacher.courses || findTeacher.courses.length === 0) {
      return res.status(404).json({
        message: "No courses found for this teacher",
      });
    }
    res.status(200).json(findTeacher.courses);
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
    return res.status(200).json(findCourse);
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
    await module.deleteMany({ courseId: findCourse._id });
    await course.findByIdAndDelete(id);

    return res.status(200).json({ message: "deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", message: err.message });
  }
};
