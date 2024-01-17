import {Router} from 'express'
import multer from 'multer'
import {registerUser, loginUser, addItems, logout, getAllUser, getAllProduct, orderProduct} from '../controllers/controller';
// import { getuserdata } from '../controllers/getUserData';
import {checkAuth, ownership} from '../middleware/Auth';
// import { logout } from '../controllers/logout';
import {fileUploader, upload} from "../middleware/image-uploader"
import sendMails from "../controllers/nodemailer"

const router = Router()

router.post('/registerUser',registerUser);
router.post('/uploadImageUser',upload.single('image'),fileUploader);
router.route('/loginUser').post(loginUser);
router.post('/addProduct',checkAuth,addItems);
router.post('/orderProduct',checkAuth,orderProduct);
router.get('/getAllProduct',sendMails,getAllProduct);
// router.get('/getuserdata/:id',checkAuth, ownership, getuserdata);
router.get('/logout', logout);
// router.put('/user/:id',checkAuth, ownership, updateUser);
// router.delete('/user/:id',checkAuth, ownership, deleteUser);
router.get('/getAllUsers',getAllUser )

export default router;