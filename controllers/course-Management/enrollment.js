import { findCourseById } from "../../repositories/course.js";
import {
  addEnrollment,
  deleteEnrollment,
  findAllEnrollmentsForStudent,
  findAllEnrollmentsForTeacher,
  findEnrollment,
  findEnrollmentById,
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

export const getEnrollmentsByTeacher = async (req, res) => {
  try {
    const teacherId = req.params.id;
    const userId = req.user.id;

    if (teacherId !== userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const findTeacher = await findUserById(teacherId);
    if (!findTeacher) {
      return res.status(404).json({ message: "teacher not found" });
    }

    const courses = findTeacher?.courses;

    const findEnrollments = await findAllEnrollmentsForTeacher(courses);
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

export const getEnrollmentsByStudent = async (req, res) => {
  try {
    const studentId = req.params.id;
    const userId = req.user.id;

    if (studentId !== userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const findStudent = await findUserById(studentId);
    if (!findStudent) {
      return res.status(404).json({ message: "student not found" });
    }

    const findEnrollments = await findAllEnrollmentsForStudent(studentId);
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
    const userId = req.user.id;
    const findEnrollment = await findEnrollmentById(id);
    if (!findEnrollment) {
      return res.status(404).json({ message: "no records found" });
    }

    if (
      !findEnrollment?.studentId?.equals(userId) &&
      !findEnrollment?.courseId?.teacher.equals(userId) &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Forbidden. You are not the owner of this enrollment.",
      });
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
    const { enrollmentData, status } = req.body;

    const updatedEnrollment = await updateEnrollmentById(id, {
      enrollmentData,
      status,
    });
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