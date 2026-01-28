import * as esp32Controller from "../../controllers/esp32.Controller.js";
import express from "express";

const router = express.Router();

    router.post("/post/waterBokchoyGroup",esp32Controller.waterBokchoyGroup)
    router.post("/post/waterPechayGroup",esp32Controller.waterPechayGroup)
    router.post("/post/waterMustasaGroup",esp32Controller.waterMustasaGroup)
    router.post("/post/waterAllGroups",esp32Controller.waterAllGroups)

export default router;