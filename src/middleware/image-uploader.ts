import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { Request, Response, NextFunction } from "express";
import { User, Product } from "../models/schema";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage: storage });

cloudinary.config({
  cloud_name: "ddxpchjay",
  api_key: "957539457285927",
  api_secret: "jvjhjIR838M6QX7OVW7FyWZyS00",
  secure: true,
});
let url: string;
let urlArray: string[] = [];

let fileUploader = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.cookies.id;
  try {
    if (req.file) {
      console.log(req.file.path);
      const result = await cloudinary.uploader.upload(req.file.path);
      console.log(result);
      url = result.secure_url;

      await User.findByIdAndUpdate(
        { _id: id },
        {
          imageUrl: url,
        }
      );

      return res.status(200).json({ msg: "Image uploader successfully" });
    }
  } catch (err) {
    return res.status(400).json({ msg: err });
  }
};

let productImageUploader = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const productId = req.cookies.productId;
  console.log(productId);
  try {
    let sarray = [];
    if (req.files) {
      const files = Array.isArray(req.files) ? req.files : [req.files];

      for (const file of files) {
        const result = await cloudinary.uploader.upload(file.path as string);
        sarray.push(result.secure_url);
      }
      urlArray = sarray;
      console.log(sarray);
      console.log(urlArray);

      await Product.findByIdAndUpdate(
        { _id: productId },
        {
          $set: {
            productImageUrl: urlArray,
          },
        }
      );
      return res.status(200).json({ msg: "Image uploaded successfully" });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({ msg: err });
  }
};

export { fileUploader, productImageUploader, url, urlArray };
