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
import { authorizationToken } from "../../middleware/authToken.js";
const router = express.Router();

router.post("/create",authorizationToken ,createCourse);

router.get("/getbyid/:id", getCourse);

router.get("/getall", getAllCourses);

router.get("/getbyteacher/:id", getCoursesByTeacher);

router.get("/getbylvl", getCoursesByLevel);

router.put("/update/:id",authorizationToken, updateCourse);

router.delete("/delete/:id", authorizationToken, deleteCourse);

export default router;
