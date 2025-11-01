import * as userController from "../../controllers/user.Controller.js"
import { verifyAccessToken, verifyRefreshToken } from '../../middlewares/authMiddleware.js';
import * as authController  from "../../controllers/auth.Controller.js" 
import * as userValidation from "../../middlewares/userValidation.js"
import multer from "multer"
import express from "express"
import path from "path"


const router = express.Router()

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Folder where files will be saved
  },
  filename: (req, file, cb) => {
    // Keep original extension (.jpg, .png, etc.)
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

export const upload = multer({ storage });


router.get("/users", verifyAccessToken, userController.getUsers);
router.get("/users/count",verifyAccessToken, userController.getUsersCount)
router.get("/users/roles",verifyAccessToken, userController.getUserCountByRole)
router.get("/users/status",userController.getUserByStatus)
router.get("/users/me",verifyAccessToken,userController.getLoggedUser)     
router.get("/users/filter",userController.getFilteredUser)
router.get("/users/search",userController.searchUser);         
router.get("/users/:user_id", verifyAccessToken, userController.selectUser);



router.post("/users", verifyAccessToken,upload.single("profile_picture"),userValidation.insertUserValidation,userController.insertUsers);
router.put("/users/:user_id", verifyAccessToken,upload.single("profile_picture"),userValidation.updateUserValidation, userController.updateUser);
router.delete("/users/logout-all",verifyRefreshToken, authController.logoutAllDevices)
router.delete("/users/logout",verifyRefreshToken,authController.logoutFromThisDevice)
router.delete("/users/:user_id", verifyAccessToken, userController.deleteUser);


export default router



 