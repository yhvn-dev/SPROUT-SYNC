import express from "express";
import * as deviceTokenController from "../../controllers/deviceToken.Controller.js";

const router = express.Router();

    router.get("/get/deviceToken/all", deviceTokenController.fetchAllUserDevices);
    router.get("/get/deviceToken/:user_id", deviceTokenController.fetchUserDevices);
    router.post("/post/deviceToken/register",deviceTokenController.registerDevice);
    router.delete("/delete/all/deviceToken", deviceTokenController.removeAllDevice);
    router.delete("/delete/deviceToken", deviceTokenController.removeDevice);
 
export default router;