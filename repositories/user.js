import { course } from "../models/course-Management/course.js";
import { UserOTP } from "../models/otp.js";
import user from "../models/user.js";

export const findOneUser = async (userData) => {
  return await user.findOne(userData);
};

export const findUserById = async (userId) => {
  return await user.findById(userId);
};

export const findAllUsers = async () => {
  return await user.find();
};

export const findAllTeachers = async () => {
  return await user.find({ courses: { $exists: true, $ne: [] } });
};

export const findTeacherById = async (teacherId) => {
  return await course.find({ teacher: teacherId }).populate({
    path: "courses",
    populate: [
      { path: "enrolledBy" },
      {
        path: "reviews",
        populate: { path: "userId", select: "name" },
      },
    ],
  });
};

export const createUser = async (userData) => {
  const newUser = new user(userData);
  return await newUser.save();
};

export const updateUserData = async (userData, updateData) => {
  return await user.findOneAndUpdate(userData, updateData, { new: true });
};

export const deleteUserById = async (userId) => {
  return await user.findByIdAndDelete(userId);
};

// otp queries
export const createOtp = async (email, otp) => {
  return UserOTP.create({
    email,
    otp,
    createdAt: new Date(),
    expireAt: new Date(Date.now() + 86400000),
  });
};

export const findOtpByEmail = async (email) => {
  return await UserOTP.findOne({ email });
};

export const deleteOtpByEmail = async (email) => {
  return await UserOTP.deleteMany({ email });
};
