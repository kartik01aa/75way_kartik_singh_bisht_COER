import { RequestHandler } from "express";
import { User, Product } from "../models/schema";
import CustomAPIError from "../errors/custom-error";
import { genSaltSync, hashSync, compareSync } from "bcrypt";
import Jwt from "jsonwebtoken";
import {sendQuantityEmail} from '../controllers/nodemailer'


export const registerUser: RequestHandler = async (req, res, next) => {
  try {
    const { name, age, gender, email, phone, password, roles } = req.body;

    // input passed or not
    if (!name) throw new CustomAPIError("Name required.");
    if (!age) throw new CustomAPIError("Age required.");
    if (!email) throw new CustomAPIError("Email required.");
    if (!password) throw new CustomAPIError("Password required.");
    if (!roles) throw new CustomAPIError("Roles not specified required.");
    if (!gender) throw new CustomAPIError("Phone number required.");

    const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const pass: RegExp =
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;

    // check input for correctness
    if (!pass.test(password.toString()))
      throw new CustomAPIError(
        "Enter valid password with uppercase, lowercase, number & @"
      );
    if (!expression.test(email.toString()))
      throw new CustomAPIError("Enter valid email");
    if (typeof phone !== "number" && ("" + phone).length !== 10)
      throw new CustomAPIError(
        "Phone number should only have 10 digits, No character allowed."
      );

    // checking if user already exist
    const existinguser = await User.findOne({ email });

    if (existinguser) {
      throw new CustomAPIError("User already exists")
    }
    // password hashing and inserting data in Database
    const salt = genSaltSync(10);
    const hashPassword = hashSync(password.toString(), salt);
    await new User({
      name,
      age,
      email,
      phone,
      password: hashPassword,
      gender,
      roles,
      imageUrl: " ",
    }).save();

    return res.status(200).json({ msg: "New user registered" });
  } catch (error) {
    next(error);
  }
};

export const loginUser: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existinguser = await User.findOne({ email });
    //if user is not found
    if (!existinguser) {
      return res.status(407).json({ message: "User does not Exist" });
    }
    const isMatch = compareSync("" + password, existinguser.password);
    //if password doens't match
    if (!isMatch) {
      return res.status(407).json({ message: "Password not match" });
    }
    const id = existinguser._id;
    let refereshToken = "",
      AccessToken = "";
      let payload = { "id" : "1"};
    refereshToken = await Jwt.sign(
      {payload, id },
      process.env.JWT_REFRESH_SECRET_KEY!,
      {
        expiresIn: "2h",noTimestamp:true
      }
    );
  
    AccessToken = await Jwt.sign({payload, id }, process.env.JWT_SECRET_KEY!, {
      expiresIn: "30m",noTimestamp:true
    });
    res.cookie("authToken", AccessToken, { httpOnly: true });
    res.cookie("refreshToken", refereshToken, { httpOnly: true })
    res.cookie("id", id, { httpOnly: false })

    return res.status(201).json({
      refereshToken,
      AccessToken,
      message: "User logged in successfully",
    });

    next();
  } catch (err) {
    return res.status(407).json({ message: err });
  }
};

export const logout: RequestHandler = (req, res, next) => {
  try {
    res.clearCookie("authToken");
    res.clearCookie("refreshToken");
    return res
      .status(200)
      .json({ ok: true, message: "User has been logged out" });
  } catch (err) {
    next(err);
  }
};

export const addItems: RequestHandler = async (req, res, next) => {
  try {
    const { name, quantity } = req.body;
    const id = req.cookies.id;
   
    const user: any = await User.findById(`${id}`);
    console.log(user)
    if (user.roles !== "admin") {
      throw new CustomAPIError("Only admin is allowed to add products")
    }

    await new Product({
      name,
      quantity,
    }).save();
    const product = await Product.findOne({ name: `${name}` }).exec()
    res.cookie('productId',product?._id,{httpOnly : true }) ; 

    return res.status(200).json({ msg: "New product added" });
  } catch (err) {
    next(err);
  }
};
export const orderProduct: RequestHandler = async (req, res, next) => {
  try {
    const { name, quantity } = req.body;
   
    const product = await Product.findOne({ name: `${name}` }).exec() 
    console.log(product?._id)
    let q:any = product?.quantity;
    console.log(quantity)
    console.log(q)
    if(quantity > q){
      throw new CustomAPIError(`${quantity} ${name} not available`)
    }
    let left = q - quantity;
    console.log(left)
    await Product.findByIdAndUpdate(
      { _id: product?._id },
      {
        quantity: left,
      },
    );
    if(left <= 10){
      await sendQuantityEmail(product?._id,product?.name, left)
    }

    return res.status(200).json({ msg: "Your order executed successfully" });
  } catch (err) {
    next(err);
  }
};


// controller for checking
export const getAllUser: RequestHandler = async(req, res, next) => {
  try{
    const user = await User.find().exec();
    console.log(user);
    return res.status(200).json({user});

}catch(err){
    return res.status(407).json({message: err});
}   
};
export const getAllProduct: RequestHandler = async(req, res, next) => {
  try{
    const product = await Product.find().exec();
    console.log(product);
    return res.status(200).json({product});

}catch(err){
    return res.status(407).json({message: err});
}   
};
