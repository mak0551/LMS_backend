import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// ye transporter ka logic likna zaroori hai ye nodemailer website se miljata
const transporter = nodemailer.createTransport({
  service: "gmail", // agar ethereal(smtp server for testing iss ka mail nai aata receivers address pe) toh ye service: "gmail" nai likhna
  host: "smtp.gmail.com", //"smtp.ethereal.email",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.EMAIL, // gmail ka email
    pass: process.env.EMAILPASSWORD, // gmali ka app password settings me rehta
  },
});

// mailoptions and callback

export const mailSend = async (toEmail, subject, body) => {
  // here we are add mailoptions for sending mail llike from, to, subject, and html to design template these all mailoptions are meant to be send in the transporter.sendMail(mailoptions) function which is a method of nodemailer
  const mailoptions = {
    from: process.env.EMAIL,
    to: toEmail,
    subject: subject,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Learning Management System - One-Time Password</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .container {
            background-color: #f4f4f4;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
        }
        .otp {
            background-color: #007bff;
            color: white;
            padding: 10px 15px;
            font-size: 24px;
            font-weight: bold;
            border-radius: 5px;
            display: inline-block;
            margin: 15px 0;
            letter-spacing: 3px;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #666;
        }
    </style>
</head>
<body>
    ${body}
</body>
</html>`,
  };
  try {
    const info = await transporter.sendMail(mailoptions); // ye sendMail nodemailer ka method hai ene mailOptions leta jisme kisku aara kisku jaara aur subject kya hai mail ka bolna padhta aur callBack b leta nai diye toh b chalta callback ki zaroorat vanillajs mein padhti eder apan dusre function se call karre transporter.sendMail ku
    console.log("Email Sent:", info.response); // ab info sendMailer ka bangaya na toh response sendMail ka ek method hai jo response show karta
  } catch (err) {
    console.log("Error sending message", err);
  }
};

export const sendEmailVerificationOtp = async (email, otp, fullName) => {
  try {
    const subject = "your one time passcode to verify email";
    const body = `<div class="container">
        <h1>Learning Management System</h1>
        <p>Hello, ${fullName}!</p>
        <p>Your One-Time Password (OTP) to verify your email is:</p>
        <div class="otp">${otp}</div>
        <p>This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
        <p>If you did not request this OTP, please ignore this email or contact support.</p>
        <div class="footer">
            © 2024 Learning Management System. All rights reserved.
        </div>
    </div>`;
    await mailSend(email, subject, body);
  } catch (err) {
    console.log("error sending email", err);
  }
};

export const emailOtpVerified = async (email, fullName) => {
  try {
    const subject = "email verified successfully";
    const body = `<div class="container">
        <h1>Learning Management System</h1>
        <p>Hello, ${fullName}!</p>
        <p>Your email ${email} is verified successfully</p>
        <p>This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
        <p>Incase you didn't requested to verify , please contact support.</p>
        <div class="footer">
            © 2024 Learning Management System. All rights reserved.
        </div>
    </div>`;
    await mailSend(email, subject, body);
  } catch (err) {
    console.log("error sending email");
  }
};

export const sendLoginOtp = async (email, otp, fullName) => {
  try {
    const subject = "your one time passcode for logging in";
    const body = `<div class="container">
        <h1>Learning Management System</h1>
        <p>Hello, ${fullName}!</p>
        <p>Your One-Time Password (OTP) for login is:</p>
        <div class="otp">${otp}</div>
        <p>This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
        <p>If you did not request this OTP, please ignore this email or contact support.</p>
        <div class="footer">
            © 2024 Learning Management System. All rights reserved.
        </div>
    </div>`;
    await mailSend(email, subject, body);
  } catch (err) {
    console.log("error sending email", err);
  }
};

export const loginSuccessful = async (email, fullName) => {
  try {
    const subject = "login successful";
    const body = `<div class="container">
        <h1>Learning Management System</h1>
        <p>Hello, ${fullName}!</p>
        <p>You have successfully logged into your account </p>
        <p>Incase this is not you, please contact support.</p>
        <div class="footer">
            © 2024 Learning Management System. All rights reserved.
        </div>
    </div>`;
    await mailSend(email, subject, body);
  } catch (err) {
    console.log("error sending email");
  }
};

export const forgotPasswordEmail = async (email, otp, fullName) => {
  try {
    const subject = "forgot password email";
    const body = `<div class="container">
        <h1>Learning Management System</h1>
        <p>Hello, ${fullName}!</p>
        <p>Your OTP to reset your password </p>
        <div class="otp">${otp}</div>
        <p>Incase this is not you, please don't share this Otp to anyone .</p>
        <div class="footer">
            © 2024 Learning Management System. All rights reserved.
        </div>
    </div>`;
    await mailSend(email, subject, body);
  } catch (err) {
    console.log("error sending email", err);
  }
};
