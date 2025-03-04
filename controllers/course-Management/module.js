import { course } from "../../models/course-Management/course.js";
import { module } from "../../models/course-Management/module.js";

export const createModule = async (req, res) => {
  try {
    const body = req.body;
    const { courseId } = req.body;
    const findCourse = await course.findById(courseId);
    if (!findCourse) {
      return res.status(404).json({ message: "no course found" });
    }
    const newModule = await module.create(body);
    await course.findByIdAndUpdate(
      courseId,
      { $push: { module: newModule.id } },
      { new: true }
    );
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
    const modules = await module.find({});
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
    const modules = await module.findById(id);
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
    const findCourse = await course.findById(id);
    if (!findCourse)
      return res.status(404).json({ message: "course not found" });
    const findModule = await module.find({ courseId: findCourse._id });
    if (findModule.length < 1) {
      return res.status(404).json({ message: "no modules found" });
    }
    res.status(200).json(findModule);
  } catch (err) {
    res.status(500).json({ error: "internal server error" });
  }
};

export const updateModule = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const updatedModule = await module.findByIdAndUpdate(id, body, {
      new: true,
    });
    if (!updateModule) {
      return res.status(404).json({ message: "no module found to update" });
    }
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
    const findModule = await module.findById(id);
    await course.findByIdAndUpdate(
      findModule.courseId,
      { $pull: { module: id } },
      { new: true }
    );
    const deleteModule = await module.findByIdAndDelete(id);
    if (!deleteModule) {
      return res.status(404).json({ message: "no module found to delete" });
    }
    res.status(200).json({ message: "deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "internal server error", message: err.message });
  }
};
