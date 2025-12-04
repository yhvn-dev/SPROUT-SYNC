import * as trayGroupController from "../../controllers/trayGroup.Controller.js"
import { validateTrayGroup } from "../../middlewares/trayGroupMiddleware.js";
import express from "express"

const router = express.Router()

router.get("/get/tg" ,trayGroupController.getTrayGroups);
router.get("/get/tg/:tray_group_id" , trayGroupController.getTrayGroupById)

router.post("/post/tg",validateTrayGroup,trayGroupController.createTrayGroup);
router.put("/put/tg/:tray_group_id",validateTrayGroup,trayGroupController.updateTrayGroup);
router.delete("/delete/tg/:tray_group_id",validateTrayGroup,trayGroupController.deleteTrayGroup);


export default router



 