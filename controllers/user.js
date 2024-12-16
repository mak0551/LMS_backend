import { UserOTP } from "../models/otp.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { otpVerified, sendEmailOtp } from "../config/sendMail.js";
import user from "../models/user.js";

export const addUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await user.findOne({ email }); // Check if the email already exists
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // hashing the password

    // Creating user
    const newUser = await user.create({
      ...req.body,
      password: hashedPassword,
    });

    // generating otp
    let OTP = Math.floor(Math.random() * 900000) + 100000;
    // add otp to the otp model
    let otp = new UserOTP({
      email: email,
      otp: OTP,
      createdAt: new Date(),
      expireAt: new Date(Date.now() + 86400000),
    });
    await otp.save();

    // calling send mail function
    await sendEmailOtp(email, OTP, newUser.name);

    res.status(200).json({
      message:
        "user Created and mail sent successfully please verify before logging in",
      user: newUser,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // finding user
    const User = await user.findOne({ email });
    if (!User) {
      return res
        .status(404)
        .json({ message: `user with the email ${email} not found` });
    }

    // finding otp according to user email
    const getOtp = await UserOTP.find({ email });
    if (!getOtp.length === 0) {
      return res.status(404).json({ message: "No OTP records found" });
    }

    // matching otp
    const matchOtp = getOtp.find((e) => e.otp == otp);
    if (!matchOtp) return res.status(404).json({ message: "Incorrect otp" });

    // calculating time differrence
    const timeNow = new Date();
    const createdAt = new Date(matchOtp.createdAt);
    const timeDifference = timeNow - createdAt;

    // check if the time difference is more than 15 minutes (900,000 milliseconds)
    if (timeDifference > 9000000) {
      await UserOTP.deleteMany({ email: email }); // Delete OTP records for the user's email
      return res.status(400).json({ message: "otp expired" });
    }

    // now deleting the otp's for the email
    await UserOTP.deleteMany({
      email: email,
    });

    User.isVerified = true;
    await User.save();

    // sending verification successful email
    await otpVerified(email, User.name);

    res.status(200).json({ message: "mail sent successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", message: err.message });
  }
};

// Generating JWT token
// const token = jwt.sign(
//   { id: newUser._id, email: newUser.email },
//   process.env.JWT_SECRET
// );

// set token as Cookie
// res.cookie("accessToken", token, { httpOnly: true });
