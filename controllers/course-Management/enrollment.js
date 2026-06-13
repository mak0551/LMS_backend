import { findCourseById } from "../../repositories/course.js";
import {
  addEnrollment,
  deleteEnrollment,
  findAllEnrollments,
  findEnrollment,
  findEnrollmentById,
  findEnrollmentsByStudentId,
  updateEnrollmentById,
} from "../../repositories/enrollment.js";
import { findUserById } from "../../repositories/user.js";

export const createEnrollment = async (req, res) => {
  try {
    const { courseId, studentId } = req.body;

    const userExists = await findUserById(studentId);
    if (!userExists) return res.status(404).json({ message: "User not found" });

    const courseExists = await findCourseById(courseId);
    if (!courseExists)
      return res.status(404).json({ message: "Course not found" });

    const existingEnrollment = await findEnrollment(courseId, studentId);
    if (existingEnrollment)
      return res.status(400).json({ message: "User already enrolled" });

    await updateCourseById(courseId, { $push: { enrolledBy: studentId } });

    const newEnrollment = await addEnrollment({ courseId, studentId });

    res.status(200).json({
      message: "User enrolled successfully",
      enrollment: newEnrollment,
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "internal server error", message: err.message });
  }
};

export const getEnrollments = async (req, res) => {
  try {
    const findEnrollments = await findAllEnrollments();
    if (findEnrollments.length === 0) {
      return res.status(404).json({ message: "no records found" });
    }
    res.status(200).json(findEnrollments);
  } catch (err) {
    res
      .status(500)
      .json({ error: "internal server error", message: err.message });
  }
};

export const getEnrollmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const findEnrollment = await findEnrollmentById(id);
    if (!findEnrollment) {
      return res.status(404).json({ message: "no records found" });
    }
    res.status(200).json(findEnrollment);
  } catch (err) {
    res
      .status(500)
      .json({ error: "internal server error", message: err.message });
  }
};

export const updateEnrollment = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const updatedEnrollment = await updateEnrollmentById(id, body);
    if (!updatedEnrollment) {
      return res.status(404).json({ message: "no records found to update" });
    }
    res.status(200).json(updatedEnrollment);
  } catch (err) {
    res
      .status(500)
      .json({ error: "internal server error", message: err.message });
  }
};

export const removeEnrollment = async (req, res) => {
  try {
    const { courseId, studentId } = req.body;

    await updateCourseById(courseId, { $pull: { enrolledBy: studentId } });

    const enrollment = await deleteEnrollment(courseId, studentId);

    if (!enrollment)
      return res.status(404).json({ message: "Enrollment not found" });

    res.status(200).json({ message: "User unenrolled successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "internal Server error", error: error.message });
  }
};

export const checkEnrollment = async (req, res) => {
  try {
    const { courseId, studentId } = req.query;

    if (!courseId || !studentId) {
      return res.status(400).json({ message: "Missing courseId or studentId" });
    }

    const existingEnrollment = await findEnrollment(courseId, studentId);

    res.status(200).json({ isEnrolled: !!existingEnrollment });
  } catch (error) {
    res
      .status(500)
      .json({ message: "internal Server error", error: error.message });
  }
};

export const getEnrolledCourses = async (req, res) => {
  try {
    const { id } = req.params;
    const findUser = await findUserById(id);

    if (!findUser) return res.status(404).json({ message: "user not found" });

    const getCourses = await findEnrollmentsByStudentId(id);

    if (getCourses.length < 1) {
      return res.status(404).json({ message: "not enrolled in any courses" });
    }

    res.status(200).json(getCourses);
  } catch (err) {
    res
      .status(500)
      .json({ error: "internal server error", message: err.message });
  }
};
