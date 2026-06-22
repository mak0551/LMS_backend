import express from "express";
import {
  deleteUser,
  getAllTeachers,
  getAllUsers,
  getCurrentUser,
  getUserById,
  updateUser,
} from "../controllers/user.js";
const router = express.Router();

router.put("/update/:id", updateUser);

router.delete("/delete/:id", deleteUser);

router.get("/getcurrentuser", getCurrentUser);

router.get("/getall", getAllUsers);

router.get("/getbyid/:id", getUserById);

router.get("/getallteachers", getAllTeachers);

export default router;
