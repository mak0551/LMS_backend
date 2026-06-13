import { enrollMent } from "../models/course-Management/enrollment.js";

export const findEnrollment = async (courseId, studentId) => {
  return await enrollMent.findOne({ courseId, studentId });
};

export const findEnrollmentById = async (enrollmentId) => {
  return await enrollMent.findById(enrollmentId);
};

export const findEnrollmentsByStudentId = async (studentId) => {
  return await enrollMent.find({ studentId }).populate({
    path: "courseId",
    populate: {
      path: "teacher",
      select: "name profileImg",
    },
  });
};

export const findAllEnrollments = async () => {
  return await enrollMent.find();
};

export const addEnrollment = async (enrollmentData) => {
  return await enrollMent.create(enrollmentData);
};

export const updateEnrollmentById = async (enrollmentId, updateData) => {
  return await enrollMent.findByIdAndUpdate(enrollmentId, updateData, {
    new: true,
  });
};

export const deleteEnrollment = async (courseId, studentId) => {
  return await enrollMent.findOneAndDelete({ courseId, studentId });
};

export const deleteEnrollmentsByCourseId = async (courseId) => {
  return await enrollMent.deleteMany({ courseId });
};
