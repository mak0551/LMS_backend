import {
  checkEnrollment,
  createEnrollment,
  getEnrollmentById,
  getEnrollments,
  getEnroolledCourses,
  removeEnrollment,
  updateEnrollment,
} from "../../controllers/course-Management/enrollment.js";
import express from "express";

const router = express.Router();

router.post("/add", createEnrollment);

router.get("/getall", getEnrollments);
router.get("/getbyid/:id", getEnrollmentById);
router.get("/check", checkEnrollment);
router.get("/getenrolled-courses/:id", getEnroolledCourses);

router.put("/update/:id", updateEnrollment);

router.delete("/delete", removeEnrollment);

export default router;
