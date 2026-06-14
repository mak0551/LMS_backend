import {
  checkEnrollment,
  createEnrollment,
  getEnrollmentById,
  removeEnrollment,
  updateEnrollment,
  getEnrollmentsByTeacher,
  getEnrollmentsByStudent,
} from "../../controllers/course-Management/enrollment.js";
import express from "express";
import { authorizationToken } from "../../middleware/authToken.js";

const router = express.Router();

router.post("/add", createEnrollment);

router.get("/getallforteacher/:id", authorizationToken, getEnrollmentsByTeacher);
router.get("/getallforstudent/:id", getEnrollmentsByStudent);
router.get("/getbyid/:id", getEnrollmentById);
router.get("/check", checkEnrollment);

router.put("/update/:id", updateEnrollment);

router.delete("/delete", removeEnrollment);

export default router;
