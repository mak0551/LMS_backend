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
import { authenticateToken, authorizationToken } from "../../middleware/authToken.js";
const router = express.Router();

router.get("/getall", getAllCourses);

router.get("/getbylvl", getCoursesByLevel);

router.get("/getbyid/:id", getCourse);

router.get("/getbyteacher/:id", getCoursesByTeacher);

app.use(authenticateToken);

router.post("/create",authorizationToken ,createCourse);

router.put("/update/:id",authorizationToken, updateCourse);

router.delete("/delete/:id", authorizationToken, deleteCourse);

export default router;
