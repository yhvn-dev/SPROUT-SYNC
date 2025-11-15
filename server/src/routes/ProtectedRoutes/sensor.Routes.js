import express from "express"
import * as sensorController from "../../controllers/sensor.Controller.js"

const router = express.Router()

router.get("/get/sensors",sensorController.selectSensors)
router.get("/get/sensors/:sensor_id",sensorController.selectSensors)
router.post("/post/sensors",sensorController.insertSensor)
router.put("/put/sensors/:sensor_id",sensorController.updateSensor)
router.delete("/delete/sensors/:sensor_id",sensorController.deleteSensor)

export default router