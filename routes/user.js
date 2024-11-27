import express from "express";
import { testEmail } from "../controllers/user.js";
const router = express.Router();

router.get("/get", testEmail);

export default router;
