import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {
  emailOtpVerified,
  forgotPasswordEmail,
  loginSuccessful,
  sendEmailVerificationOtp,
  sendLoginOtp,
} from "../services/sendMail.js";
import {
  findOneUser,
  createUser,
  updateUserData,
  createOtp,
  findOtpByEmail,
  deleteOtpByEmail,
} from "../repositories/user.js";

// register user
export const addUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await findOneUser({ email }); // Check if the email already exists
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // hashing the password

    // Creating user
    const newUser = await createUser({
      ...req.body,
      role: "student",
      password: hashedPassword,
    });

    // // generating otp
    // let OTP = Math.floor(Math.random() * 900000) + 100000;

    // // add otp to the otp model
    // await createOtp(email, OTP);

    // // calling send mail function
    // await sendEmailVerificationOtp(email, OTP, newUser.name);

    // res.status(200).json({
    //   message:
    //     "user Created and email sent successfully please verify before logging in",
    //   user: newUser,
    // });

    const token = jwt.sign(
      {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
      },
      process.env.JWT_SECRET,
    );

    res.cookie("accessToken", token, { httpOnly: true });
    res.status(200).json({
      message: "user Created successfully",
      user: newUser,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

// verify user email
export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // finding user
    const User = await findOneUser({ email });
    if (!User) {
      return res
        .status(404)
        .json({ message: `user with the email ${email} not found` });
    }

    // checking if user is already verified
    if (User.isVerified) {
      return res.status(400).json({ message: "already verified" });
    }

    // finding otp according to user email
    const getOtp = await findOtpByEmail(email);
    if (!getOtp) {
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
      await deleteOtpByEmail(email); // Delete OTP records for the user's email
      return res.status(400).json({ message: "otp expired" });
    }

    // now deleting the otp's for the email
    await deleteOtpByEmail(email);

    User.isVerified = true;
    await User.save();

    // sending verification successful email
    await emailOtpVerified(email, User.name);

    res.status(200).json({ message: "email verified successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", message: err.message });
  }
};

// resend otp for email verification
export const resendOtpEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const User = await findOneUser({ email });
    if (!User) {
      return res.status(404).json({ message: "user not found" });
    }

    // generating otp
    let OTP = Math.floor(Math.random() * 900000) + 100000;

    // add otp to the otp model
    await createOtp(email, OTP);

    // calling send mail function
    await sendEmailVerificationOtp(email, OTP, User.name);

    res.status(200).json({ message: "email sent successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", message: err.message });
  }
};

// login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const User = await findOneUser({ email });
    if (!User) {
      return res.status(404).json({ message: "user not found" });
    }

    // if (!User.isVerified) {
    //   return res
    //     .status(400)
    //     .json({ message: "please verify your email before loggin in" });
    // }

    const checkPassword = await bcrypt.compare(password, User.password);
    if (!checkPassword) {
      return res.status(400).json({ message: "invalid password" });
    }

    // // generating otp
    // let OTP = Math.floor(Math.random() * 900000) + 100000;
    // // add otp to the otp model
    // let otp = new UserOTP({
    //   email: email,
    //   otp: OTP,
    //   createdAt: new Date(),
    //   expireAt: new Date(Date.now() + 86400000),
    // });
    // await otp.save();
    // // calling send mail function
    // await sendLoginOtp(email, OTP, User.name);
    // res.status(200).json({
    //   message: `otp has successfully sent to ${email} please verify to login`,
    // });

    // Generating JWT token
    const token = jwt.sign(
      {
        id: User._id,
        email: User.email,
        role: User.role,
      },
      process.env.JWT_SECRET,
    );

    //set token as Cookie
    res.cookie("accessToken", token, { httpOnly: true });

    // await loginSuccessful(email, User.name);

    res.status(200).json({ message: "login successful", token, user: User });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", message: err.message });
  }
};

// verify otp to login
export const verifyLogin = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // finding user
    const User = await findOneUser({ email });
    if (!User) {
      return res
        .status(404)
        .json({ message: `user with the email ${email} not found` });
    }

    // checking if user is not verified
    if (!User.isVerified) {
      return res
        .status(400)
        .json({ message: "please verify your email before loggin in" });
    }

    // finding otp according to user email
    const getOtp = await findOtpByEmail(email);
    if (!getOtp) {
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
      await deleteOtpByEmail(email); // Delete OTP records for the user's email
      return res.status(400).json({ message: "otp expired" });
    }

    // now deleting the otp's for the email
    await deleteOtpByEmail(email);

    // Generating JWT token
    const token = jwt.sign(
      {
        id: User._id,
        email: User.email,
        role: User.role,
      },
      process.env.JWT_SECRET,
    );

    //set token as Cookie
    res.cookie("accessToken", token, { httpOnly: true });

    await loginSuccessful(email, User.name);

    res
      .status(200)
      .json({ message: "otp verified successfully", token, user: User });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", message: err.message });
  }
};

// forgot password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const findEmail = await findOneUser({ email: email });
    if (!findEmail) {
      return res
        .status(404)
        .json({ message: `User with the email ${email} not found` });
    }
    let OTP = Math.floor(Math.random() * 900000) + 100000;

    await createOtp(email, OTP);

    console.log(findEmail.name);
    await forgotPasswordEmail(email, OTP, findEmail.name);
    res.status(200).json({
      message: "otp sent successfully please verify to reset your password",
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", message: err.message });
  }
};

// verify otp
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const User = await findOneUser({ email });
    if (!User) {
      return res
        .status(404)
        .json({ message: `user with the email ${email} not found` });
    }
    if (!User.isVerified) {
      return res
        .status(400)
        .json({ message: "please verify your email before loggin in" });
    }

    // finding otp according to user email
    const getOtp = await findOtpByEmail(email);
    if (!getOtp) {
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
      await deleteOtpByEmail(email); // Delete OTP records for the user's email
      return res.status(400).json({ message: "otp expired" });
    }

    // now deleting the otp's for the email
    await deleteOtpByEmail(email);

    // Generating JWT token
    const token = jwt.sign(
      {
        otpVerified: true,
      },
      process.env.JWT_SECRET,
    );

    //set token as Cookie
    res.cookie("accessToken", token, { httpOnly: true });

    res
      .status(200)
      .json({ message: "otp verified successfully", token, user: User });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", message: err.message });
  }
};

// reset password
export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const token = req.cookies.accessToken; // we are extracting token from cookie or we can extract it from req.header.authorization also
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    let decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedToken.otpVerified) {
      return res
        .status(403)
        .json({ message: "OTP verification is required to reset password" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const updatedUser = await updateUserData(
      { email },
      { $set: { password: hashedPassword } },
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", message: err.message });
  }
};

// logout user
export const logout = async (req, res) => {
  try {
    res.clearCookie("accessToken");
    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", message: err.message });
  }
};
