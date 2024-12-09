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
  const mailoptions = {
    from: process.env.EMAIL,
    to: toEmail,
    subject: subject,
    html: `<h1> hello world ${body}</h1>`,
  };

  // now sending the mail
  try {
    const info = await transporter.sendMail(mailoptions); // ye sendMail nodemailer ka method hai ene mailOptions leta jisme ka se aara kiss ku jaara bolna padhta aur callBack b leta nai diye toh b chalta
    console.log("Email Sent:", info.response); // ab info sendMailer ka bangaya na toh response sendMail ka ek method hai jo response show karta
  } catch (err) {
    console.log("Error sending message", err);
  }
};
