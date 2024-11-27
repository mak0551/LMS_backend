import user from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { mailSend } from "../config/sendMail.js";

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

export const testEmail = async (req, res) => {
  try {
    await mailSend("Test Email", "This is a test email sent from Nodemailer");
    res.status(200).send("mail sent successfully");
  } catch (error) {
    console.error("Test email failed:", error);
    res.status(500).josn({ msg: "Internal server error" });
  }
};

// testEmail();
