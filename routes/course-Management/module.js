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

router.get("/getall", getModules);

router.get("/getone/:id", getSingleModule);

router.put("/update/:id", updateModule);

router.delete("/delete/:id", deleteModule);

export default router;
