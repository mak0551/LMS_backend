import express from "express";
import {
  createCourse,
  deleteCourse,
  getAllCourses,
  getCourse,
  getCoursesByLevel,
  getCoursesByTeacher,
  updateCourse,
} from "../../controllers/course-Management/course.js";
const router = express.Router();

router.post("/create", createCourse);

router.get("/getbyid/:id", getCourse);

router.get("/getall", getAllCourses);

router.get("/getbyteacher/:id", getCoursesByTeacher);

router.get("/getbylvl", getCoursesByLevel);

router.put("/update/:id", updateCourse);

router.delete("/delete/:id", deleteCourse);

export default router;
