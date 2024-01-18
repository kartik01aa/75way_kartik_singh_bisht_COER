import { Request, Response } from "express";
import nodemailer from "nodemailer";
import { Product, User } from "../models/schema";
import CustomAPIError from "../errors/custom-error";

const sendMails = async () => {
  // fetching product details for sending product using email
  const product = await Product.find().exec();
  const user = await User.find().exec();
  let emailArray = [];
  for (var u of user) {
    if (u.roles === "admin") {
      emailArray.push(u.email);
      console.log(u.email);
    }
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS,
    },
  });
  try {
    const mailOptions = {
      from: process.env.NODEMAILER_USER,
      to: emailArray,
      subject: "Product details",
      html: `${product.map((p) => {
        return `<div>
        <h2>ProductId : ${p._id} </h2>
        <h2>ProductName : ${p.name} , ProductQuantity  ${p.quantity} </h2>
         <br> 
          </div>`;
      })}`,
    };

    transporter.sendMail(mailOptions, async (err, info) => {
      if (err) {
        console.log("lost");
        throw new CustomAPIError("Not successfully");
      } else {
        console.log("Email sent successfully");
        return;
      }
    });
  } catch (err) {
    console.log("Error");
  }
};

export const sendQuantityEmail = async (id:any,name:any,quantity:number) => {
  // fetching admin details for sending product using email
  const user = await User.find().exec();
  let emailArray = [];
  for (var u of user) {
    if (u.roles === "admin") {
      emailArray.push(u.email);
      console.log(u.email);
    }
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS,
    },
  });
  try {
    const mailOptions = {
      from: process.env.NODEMAILER_USER,
      to: emailArray,
      subject: "Less quantity left details",
      html: 
        `<div>
        <h2>ProductId : ${id} </h2>
        <h2>ProductName : ${name} , ProductQuantity  ${quantity} </h2>
        <h3>Only ${quantity} quantity left in inventory.</h3>
         <br> 
          </div>`
      
    };

    transporter.sendMail(mailOptions, async (err, info) => {
      if (err) {
        console.log("lost");
        throw new CustomAPIError("Not successfully");
      } else {
        console.log("Email sent successfully");
        return;
      }
    });
  } catch (err) {
    console.log("Error");
  }
};


export default sendMails;
