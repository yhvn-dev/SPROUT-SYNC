import * as trayController from "../../controllers/trays.Controller.js"
import { validateTrays } from "../../middlewares/traysMiddleware.js";
import express from "express"

const router = express.Router()

router.get("/get/trays" ,trayController.getTrays);
router.get("/get/trays/:tray_id" , trayController.getTrayById)
router.post("/post/trays", validateTrays,trayController.createTrays);
router.put("/put/trays/:tray_id", validateTrays,trayController.updateTrays);
router.delete("/delete/trays/:tray_id",trayController.deleteTrays);

export default router



 