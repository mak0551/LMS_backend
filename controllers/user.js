import { deleteManyCoursesByIds } from "../repositories/course.js";
import {
  findAllUsers,
  findUserById,
  findAllTeachers,
  deleteUserById,
  updateUserData,
} from "../repositories/user.js";

// update user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const updatedUser = await updateUserData({ _id: id }, body);
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", message: err.message });
  }
};

// delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    var findUser = await findUserById(id);
    if (!findUser) {
      return res.status(404).json({ message: "User not found" });
    }
    if (findUser.courses && findUser.courses.length > 0) {
      await deleteManyCoursesByIds(findUser.courses);
    }
    await deleteUserById(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", message: err.message });
  }
};

// get current user
export const getCurrentUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const findUser = await findUserById(req.user.id);
    if (!findUser) {
      return res.status(404).json({ message: "user not found" });
    }

    const user = findUser.toObject();
    delete user.password;

    res.status(200).json({ user });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", message: err.message });
  }
};

// get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await findAllUsers();
    if (users.length === 0) {
      return res.status(404).json({ message: "No records found" });
    }

    // const sanitizedUsers = users.map((user) => {
    //   const obj = user.toObject();
    //   delete obj.password;
    //   return obj;
    // });

    // res.json(sanitizedUsers);

    res.status(200).json(users);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", message: err.message });
  }
};

// get single user by id
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await findUserById(id);
    if (!user) {
      return res.status(404).json({ message: "No records found" });
    }
    const User = user.toObject();
    delete User.password;
    res.status(200).json(User);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", message: err.message });
  }
};

export const getAllTeachers = async (req, res) => {
  try {
    const getTeachers = await findAllTeachers();
    if (getTeachers.length === 0) {
      return res.status(404).json({ message: "no records found" });
    }
    res.status(200).json(getTeachers);
  } catch (err) {
    res
      .status(500)
      .json({ message: "internal server error", error: err.message });
  }
};
