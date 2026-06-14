import express from "express";
import {
  addUser,
  forgotPassword,
  login,
  logout,
  resendOtpEmail,
  resetPassword,
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

router.post("/logout", logout);

export default router;
