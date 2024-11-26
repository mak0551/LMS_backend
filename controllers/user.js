import user from "../models/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const addUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the email already exists
    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    // Creating user
    const newUser = await user.create({
      ...req.body,
      password: hashedPassword,
    });

    // Generating JWT token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET
    );

    // set token as Cookie
    res.cookie("accessToken", token, { httpOnly: true });

    res
      .status(200)
      .json({ message: "user Created", token: token, user: newUser });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
