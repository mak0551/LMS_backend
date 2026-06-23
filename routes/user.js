import express from "express";
import {
  becomeInstructor,
  deleteUser,
  getAllTeachers,
  getAllUsers,
  getCurrentUser,
  getUserById,
  updateUser,
} from "../controllers/user.js";
import { authenticateToken } from "../middleware/authToken.js";
const router = express.Router();

router.get("/getallteachers", getAllTeachers);

router.use(authenticateToken);

router.put("/update/:id", updateUser);

router.put("/become-instructor/:id", becomeInstructor);

router.delete("/delete/:id", deleteUser);

router.get("/getcurrentuser", getCurrentUser);

router.get("/getall", getAllUsers);

router.get("/getbyid/:id", getUserById);

export default router;
