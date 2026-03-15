import * as esp32Controller from "../../controllers/esp32.Controller.js";
import express from "express";
import { verifyAccessToken } from "../../middlewares/authMiddleware.js";


const router = express.Router();

    router.post("/post/closeBokchoyGroup",verifyAccessToken,esp32Controller.closeBokchoyGroup)
    router.post("/post/closePechayGroup",verifyAccessToken,esp32Controller.closePechayGroup)
    router.post("/post/closeMustasaGroup",verifyAccessToken,esp32Controller.closeMustasaGroup)
    router.post("/post/closeAllGroups",verifyAccessToken,esp32Controller.closeAllGroups)
    router.post("/post/forceOFF_ON_System",verifyAccessToken,esp32Controller.systemPower)


export default router;