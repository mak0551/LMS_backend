import express from "express";
import {
  addUser,
  login,
  resendOtpEmail,
  verifyEmail,
  verifyLogin,
} from "../controllers/user.js";
const router = express.Router();

router.post("/register", addUser);

router.post("/verifyemail", verifyEmail);

router.post("/resendotpemail", resendOtpEmail);

router.post("/login", login);

router.post("/verifylogin", verifyLogin);

export default router;
