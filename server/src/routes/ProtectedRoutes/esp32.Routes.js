import * as esp32Controller from "../../controllers/esp32.Controller.js";
import express from "express";

const router = express.Router();

    router.post("/post/closeBokchoyGroup",esp32Controller.closeBokchoyGroup)
    router.post("/post/closePechayGroup",esp32Controller.closePechayGroup)
    router.post("/post/closeMustasaGroup",esp32Controller.closeMustasaGroup)
    router.post("/post/closeAllGroups",esp32Controller.closeAllGroups)


export default router;