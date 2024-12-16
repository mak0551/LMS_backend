import express from "express";
import { addUser, verifyEmail } from "../controllers/user.js";
const router = express.Router();

router.post("/register", addUser);

router.post("/verify", verifyEmail)

export default router;
