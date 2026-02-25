import express from "express";
import * as deviceTokenController from "../../controllers/deviceToken.Controller.js";
import { verifyAccessToken } from "../../middlewares/authMiddleware.js";

const router = express.Router();

    router.get("/get/deviceToken/all",verifyAccessToken,deviceTokenController.fetchAllUserDevices);
    router.get("/get/deviceToken/:user_id",verifyAccessToken,deviceTokenController.fetchUserDevices);
    router.post("/post/deviceToken/register",verifyAccessToken,deviceTokenController.registerDevice);
    router.delete("/delete/all/deviceToken",verifyAccessToken,deviceTokenController.removeAllDevice);
    router.delete("/delete/deviceToken",verifyAccessToken,deviceTokenController.removeDevice);
 
export default router;