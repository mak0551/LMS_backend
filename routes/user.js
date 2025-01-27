import express from "express";
import {
  addUser,
  deleteUser,
  forgotPassword,
  getAllTeachers,
  getAllUsers,
  getUserById,
  login,
  resendOtpEmail,
  resetPassword,
  updateUser,
  verifyEmail,
  verifyLogin,
  verifyOtp,
} from "../controllers/user.js";
const router = express.Router();

router.post("/register", addUser);

router.post("/verifyemail", verifyEmail);

router.post("/resendotpemail", resendOtpEmail);

router.post("/login", login);

router.post("/verifylogin", verifyLogin);

router.post("/forgotpassword", forgotPassword);

router.post("/verifyotp", verifyOtp);

router.post("/resetpassword", resetPassword);

router.put("/update/:id", updateUser);

router.delete("/delete/:id", deleteUser);

router.get("/getall", getAllUsers);

router.get("/getbyid/:id", getUserById);

router.get("/getallteachers", getAllTeachers);

export default router;
