import {
  createEnrollment,
  deleteEnrollment,
  getEnrollmentById,
  getEnrollments,
  updateEnrollment,
} from "../../controllers/course-Management/enrollment.js";
import express from "express";

const router = express.Router();

router.post("/add", createEnrollment);

router.get("/getall", getEnrollments);

router.get("/getbyid/:id", getEnrollmentById);

router.put("/update/:id", updateEnrollment);

router.delete("/delete/:id", deleteEnrollment);

export default router;
