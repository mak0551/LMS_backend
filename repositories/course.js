import { course } from "../models/course-Management/course.js";

export const addCourse = async (courseData) => {
  return await course.create(courseData);
};

export const findCourseById = async (courseId) => {
  return await course.findById(courseId).populate("teacher module reviews");
};

export const findAllCourses = async () => {
  return await course.find().populate("teacher module reviews");
};

export const findCoursesByLevel = async (level) => {
  return await course.find({ level }).populate("teacher module reviews");
};

export const updateCourseById = async (courseId, updateData) => {
  return await course.findByIdAndUpdate(courseId, updateData, { new: true });
};

export const deleteCourseById = async (courseId) => {
  return await course.findByIdAndDelete(courseId);
};

export const deleteManyCoursesByIds = async (courseIds) => {
  return await course.deleteMany({ _id: { $in: courseIds } });
};