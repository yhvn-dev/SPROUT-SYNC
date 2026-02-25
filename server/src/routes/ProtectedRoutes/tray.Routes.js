import * as trayController from "../../controllers/tray.Controller.js";
import { validateTrays, } from "../../middlewares/trayMiddleware.js";
import { verifyAccessToken } from "../../middlewares/authMiddleware.js";

import express from "express";

const router = express.Router();

router.get("/get/trays",verifyAccessToken,trayController.getTrays);
router.get("/get/trays/count",trayController.getTrayGroupsWithCount);
router.get("/get/trays/:tray_id",verifyAccessToken,trayController.getTrayById);
router.post("/post/trays",verifyAccessToken,validateTrays,trayController.createTray);
router.put("/put/trays/:tray_id",verifyAccessToken,validateTrays,trayController.updateTray);

router.delete("/delete/trays/:tray_id",verifyAccessToken,trayController.deleteTray);
export default router;
    