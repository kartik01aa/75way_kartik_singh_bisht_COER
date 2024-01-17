import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { Request, Response, NextFunction } from "express";
import { User } from "../models/schema";

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
  cloud_name: "drm7dvyyt",
  api_key: "753724826474299",
  api_secret: "2XbN2SSaxAD0uaONp7oZTEITTu4",
  secure: true,
});
let url: string;

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
      return res.status(200).json({msg:"Image uploader successfully"})
    }
  } catch (err) {
    return res.status(400).json({ msg: err });
  }
};
export { fileUploader, url };
