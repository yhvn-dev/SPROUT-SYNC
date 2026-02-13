import * as sensorController from "../../controllers/sensor.Controller.js"
import {validateSensors} from "../../middlewares/sensorMiddleware.js"
import { verifyAccessToken } from "../../middlewares/authMiddleware.js";

import express from "express"

const router = express.Router()

    router.get("/get/sensors" , sensorController.getSensors);
    router.get("/get/sensors/:sensor_id",sensorController.getSensorById)
    router.post("/post/sensors",sensorController.createSensors);
    router.put("/put/sensors/:sensor_id",sensorController.updateSensors);
    router.delete("/delete/sensors/:sensor_id",sensorController.deleteSensors);

export default router



 