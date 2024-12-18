import { course } from "../../models/course";
import user from "../../models/user";

export const createCourse = async (req, res) => {
  try {
    const body = req.body;
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
    res
      .status(500)
      .json({ error: "Internal server error", message: err.message });
  }
};

export const getCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const findCourse = await course.findById(id);
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
    const findCourse = await course.find({});
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
    await course.findByIdAndDelete(id);
    return res.status(200).json({ message: "deleted successfully" });
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
