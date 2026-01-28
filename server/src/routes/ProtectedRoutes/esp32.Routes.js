import * as esp32Controller from "../../controllers/esp32.Controller.js";
import express from "express";

const router = express.Router();

    router.post("/post/openBokchoyValve",esp32Controller.openBokchoyValve)
    router.post("/post/openPechayValve",esp32Controller.openPechayValve)
    router.post("/post/openMustasaValve",esp32Controller.openMustasaValve)
    router.post("/post/openAllValves",esp32Controller.openAllValves)

export default router;