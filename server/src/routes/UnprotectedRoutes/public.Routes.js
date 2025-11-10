import * as userController from '../../controllers/user.Controller.js'
import { loginValidation } from "../../middlewares/loginValidation.js";
import { refreshAccessToken } from '../../controllers/auth.Controller.js';
import express from "express";

    const router = express.Router()
    router.post("/login", loginValidation, userController.loginUser); // public
    router.post("/refresh-token",refreshAccessToken);

export default router


