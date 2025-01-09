import express from "express";
import {
  createModule,
  deleteModule,
  getModules,
  getSingleModule,
  updateModule,
} from "../../controllers/course-Management/module.js";
const router = express.Router();

router.post("/add", createModule);

router.get("/getone", getModules);

router.get("/getall", getSingleModule);

router.put("/update", updateModule);

router.delete("/delete", deleteModule);

export default router;
