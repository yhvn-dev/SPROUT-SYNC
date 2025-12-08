import * as trayGroupController from "../../controllers/trayGroup.Controller.js"
import { validateTrayGroups } from "../../middlewares/trayGroupMiddleware.js";
import express from "express"

const router = express.Router()

router.get("/get/tg" ,trayGroupController.getTrayGroups);
router.get("/get/tg/:tray_group_id" , trayGroupController.getTrayGroupById)
router.post("/post/tg",validateTrayGroups,trayGroupController.createTrayGroup);
router.put("/put/tg/:tray_group_id",validateTrayGroups,trayGroupController.updateTrayGroup);
router.delete("/delete/tg/:tray_group_id",validateTrayGroups,trayGroupController.deleteTrayGroup);


export default router



 