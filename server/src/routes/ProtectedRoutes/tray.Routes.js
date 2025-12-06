import * as trayController from "../../controllers/tray.Controller.js";
import { validateTrays } from "../../middlewares/trayMiddleware.js";
import express from "express";

const router = express.Router();

router.get("/get/trays", trayController.getTrays);
router.get("/get/trays/:tray_id",trayController.getTrayById);
router.post("/post/trays",validateTrays,trayController.createTray);
router.put("/put/trays/:tray_id",validateTrays,trayController.updateTray);
router.delete("/delete/trays/:tray_id",trayController.deleteTray);

export default router;
    