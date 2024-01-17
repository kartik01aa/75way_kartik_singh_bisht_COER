import { Request, Response } from "express";
import nodemailer from "nodemailer";

const sendMails = async (req: Request, res: Response) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS,
    },
  });
  console.log("running")
  try {
    const mailOptions = {
      from: process.env.NODEMAILER_USER,
      to: "kartiksinghbisht1@gmail.com",
      subject: "hi user",
      text: `Hi from kartik`,
    };

    transporter.sendMail(mailOptions, async (err, info) => {
      if (err) {
          console.log("lost")
        return res.status(500).json({ msg: "not successful" });
      } else {
          console.log("pass")
        return res.json({ msg: "Email sent successfully" });
      }
    });
  } catch (err) {
    return res.status(500).json({ msg: "Error generated" });
  }
}
export default sendMails;