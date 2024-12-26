import express from "express";
import {
  createCourse,
  deleteCourse,
  getAllCourses,
  getCourse,
  getCoursesByLevel,
  getCoursesByTeacher,
  updateCourse,
} from "../controllers/course-Management/course.js";
const router = express.Router();

router.post("/create", createCourse);

router.post("/get", getCourse);

router.post("/getall", getAllCourses);

router.post("/getbyteacher", getCoursesByTeacher);

router.post("/getbylvl", getCoursesByLevel);

router.post("/update", updateCourse);

router.post("/delete", deleteCourse);

export default router;
