import { findCourseById, updateCourseById } from "../../repositories/course.js";
import {
  addModule,
  deleteModuleById,
  findAllModules,
  findModuleById,
  findModulesByCourseId,
  updateModuleById,
} from "../../repositories/module.js";
import { findUserById } from "../../repositories/user.js";

export const createModule = async (req, res) => {
  try {
    const body = req.body;
    // const courseId = body.map((e) => e.courseId);
    const courseId = body[0].courseId;
    const findCourse = await findCourseById(courseId);
    if (!findCourse) {
      return res.status(404).json({ message: "no course found" });
    }
    const newModule = await addModule(body);
    const moduleIds = newModule.map((e) => e._id);
    await updateCourseById(courseId, {
      $push: { module: { $each: moduleIds } },
    });
    res.status(200).json(newModule);
  } catch (err) {
    // console.error("Server Error:", err); // Log backend error
    res
      .status(500)
      .json({ error: "internal server error", message: err.message });
  }
};

export const getModules = async (req, res) => {
  try {
    const modules = await findAllModules();
    if (modules.length === 0) {
      return res.status(404).json({ message: "no records found" });
    }
    res.status(200).json(modules);
  } catch (err) {
    res
      .status(500)
      .json({ error: "internal server error", message: err.message });
  }
};

export const getSingleModule = async (req, res) => {
  try {
    const { id } = req.params;
    const modules = await findModuleById(id);
    if (!modules) {
      return res.status(404).json({ message: "no records found" });
    }
    res.status(200).json(modules);
  } catch (err) {
    res
      .status(500)
      .json({ error: "internal server error", message: err.message });
  }
};

export const getModuleByCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const findCourse = await findCourseById(id);
    if (!findCourse)
      return res.status(404).json({ message: "course not found" });

    const findModule = await findModulesByCourseId(findCourse._id);
    if (findModule.length < 1) {
      return res.status(404).json({ message: "no modules found" });
    }

    res.status(200).json(findModule);
  } catch (err) {
    res
      .status(500)
      .json({ error: "internal server error", message: err.message });
  }
};

export const updateModule = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const body = req.body;

    const findUser = await findUserById(userId);
    if (!findUser) {
      return res.status(404).json({ message: "user not found, Invalid Token" });
    }

    const findModule = await findModuleById(id);
    if (!findModule) {
      return res
        .status(404)
        .json({ message: "no module found with the provided ID to update" });
    }

    if (
      !findUser?.courses?.some((courseId) =>
        courseId.equals(findModule.courseId),
      ) &&
      findUser.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Forbidden. You are not the owner of this course." });
    }

    const updatedModule = await updateModuleById(id, body);

    res.status(200).json(updatedModule);
  } catch (err) {
    res
      .status(500)
      .json({ error: "internal server error", message: err.message });
  }
};

export const deleteModule = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const findUser = await findUserById(userId);
    if (!findUser) {
      return res.status(404).json({ message: "user not found, Invalid Token" });
    }

    const findModule = await findModuleById(id);
    if (!findModule) {
      return res.status(404).json({ message: "no module found to delete" });
    }

    if (
      !findUser?.courses?.some((courseId) =>
        courseId.equals(findModule.courseId),
      ) &&
      findUser.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Forbidden. You are not the owner of this course." });
    }

    await updateCourseById(findModule.courseId, { $pull: { module: id } });
    await deleteModuleById(id);

    res.status(200).json({ message: "deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "internal server error", message: err.message });
  }
};
