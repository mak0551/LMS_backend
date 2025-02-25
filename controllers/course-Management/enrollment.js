import { course } from "../../models/course-Management/course.js";
import { enrollMent } from "../../models/course-Management/enrollment.js";
import user from "../../models/user.js";

export const createEnrollment = async (req, res) => {
  try {
    const { courseId, studentId } = req.body;

    const userExists = await user.findById(studentId);
    if (!userExists) return res.status(404).json({ message: "User not found" });

    const courseExists = await course.findById(courseId);
    if (!courseExists)
      return res.status(404).json({ message: "Course not found" });

    const existingEnrollment = await enrollMent.findOne({
      courseId: courseId,
      studentId: studentId,
    });
    if (existingEnrollment)
      return res.status(400).json({ message: "User already enrolled" });

    await course.findByIdAndUpdate(
      courseId,
      { $push: { enrolledBy: studentId } },
      { new: true }
    );

    const newEnrollment = await enrollMent.create({
      courseId: courseId,
      studentId: studentId,
    });

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
    const findEnrollments = await enrollMent.find();
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
    const findEnrollment = await enrollMent.findById(id);
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
    const updatedEnrollment = await enrollMent.findByIdAndUpdate(id, body, {
      new: true,
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

    await course.findByIdAndUpdate(
      courseId,
      { $pull: { enrolledBy: studentId } },
      { new: true }
    );

    const enrollment = await enrollMent.findOneAndDelete({
      courseId: courseId,
      studentId: studentId,
    });

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

    const existingEnrollment = await enrollMent.findOne({
      courseId: courseId,
      studentId: studentId,
    });

    res.status(200).json({ isEnrolled: !!existingEnrollment });
  } catch (error) {
    res
      .status(500)
      .json({ message: "internal Server error", error: error.message });
  }
};

export const getEnroolledCourses = async (req, res) => {
  try {
    const { id } = req.params;
    const findUser = await user.findById(id);

    if (!findUser) return res.status(404).json({ message: "user not found" });

    const getCourses = await enrollMent.find({ studentId: id }).populate({
      path: "courseId",
      populate: {
        path: "teacher",
        select: "name profileImg"
      },
    });

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
