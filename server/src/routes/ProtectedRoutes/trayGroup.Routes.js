import * as trayGroupController from "../../controllers/trayGroup.Controller.js"
import { validateTrayGroups, } from "../../middlewares/trayGroupMiddleware.js";
import { verifyAccessToken } from "../../middlewares/authMiddleware.js";

import express from "express"

const router = express.Router()

    router.get("/get/tg",verifyAccessToken,trayGroupController.getTrayGroups);
    router.get("/get/tg/:tray_group_id",verifyAccessToken,trayGroupController.getTrayGroupById)
    router.post("/post/tg", verifyAccessToken,validateTrayGroups,trayGroupController.createTrayGroup);
    router.put("/put/tg/:tray_group_id",verifyAccessToken,validateTrayGroups,trayGroupController.updateTrayGroup);
    router.delete("/delete/tg/:tray_group_id",verifyAccessToken,trayGroupController.deleteTrayGroup);


export default router



 