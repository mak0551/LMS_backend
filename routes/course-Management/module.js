import express from "express";
import {
  createModule,
  deleteModule,
  getModuleByCourse,
  getModules,
  getSingleModule,
  updateModule,
} from "../../controllers/course-Management/module.js";
import { authorizationToken } from "../../middleware/authToken.js";
const router = express.Router();

router.post("/add", authorizationToken, createModule);

router.get("/getall", getModules);

router.get("/getone/:id", getSingleModule);

router.get("/getbycourse/:id", getModuleByCourse);

router.put("/update/:id", authorizationToken, updateModule);

router.delete("/delete/:id", authorizationToken, deleteModule);

export default router;
