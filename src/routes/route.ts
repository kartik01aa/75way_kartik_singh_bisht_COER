import { Router } from "express";
import {
  registerUser,
  loginUser,
  addItems,
  logout,
  getAllUser,
  getAllProduct,
  orderProduct,
} from "../controllers/controller";
import { checkAuth, ownership } from "../middleware/Auth";
import {
  fileUploader,
  productImageUploader,
  upload,
} from "../middleware/image-uploader";
import sendMails from "../controllers/nodemailer";

const router = Router();

router.post("/registerUser", registerUser);
router.post("/uploadImageUser", upload.single("image"), fileUploader);
router.post(
  "/uploadImageProduct",
  upload.array("images", 10),
  productImageUploader
);
router.route("/loginUser").post(loginUser);
router.post("/addProduct", checkAuth, addItems);
router.post("/orderProduct", checkAuth, orderProduct);
router.get("/getAllProduct", getAllProduct);
router.get("/logout", logout);
router.get("/getAllUsers", getAllUser);

export default router;
