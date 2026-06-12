import {course} from "../models/course-Management/course.js";

export const deleteManyCoursesByIds = async (courseIds) => {
  return await course.deleteMany({ _id: { $in: courseIds } });
};
