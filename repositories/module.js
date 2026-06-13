import { module } from "../models/course-Management/module.js";

export const addModule = async (moduleData) => {
  return await module.create(moduleData);
};

export const findModuleById = async (moduleId) => {
  return await module.findById(moduleId);
};

export const findAllModules = async () => {
  return await module.find({});
};

export const findModulesByCourseId = async (courseId) => {
  return await module.find({ courseId });
};

export const updateModuleById = async (moduleId, updateData) => {
  return await module.findByIdAndUpdate(moduleId, updateData, { new: true });
};

export const deleteModuleById = async (moduleId) => {
  return await module.findByIdAndDelete(moduleId);
};

export const deleteModulesByCourseId = async (courseId) => {
  return await module.deleteMany({ courseId });
};
