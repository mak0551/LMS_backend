import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com", //"smtp.ethereal.email",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAILPASSWORD,
  },
});

// mailoptions and callback

export const mailSend = async (subject, body) => {
  const mailoptions = {
    from: process.env.EMAIL,
    to: "mohammedahmedkhan551@gmail.com",
    subject: subject,
    html: `<h1> hello world ${body}</h1>`,
  };

  // now sending the mail
  try {
    const info = await transporter.sendMail(mailoptions);
    console.log("Email Sent:", info.response);
  } catch (err) {
    console.log("Error sending message", err);
  }
};
