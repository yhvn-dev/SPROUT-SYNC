import express from "express"
import * as sensorController from "../../controllers/sensor.Controller.js"

const router = express.Router()

router.get("/get/sensors/:sensor_id",sensorController.selectSensor)
router.get("/get/sensors",sensorController.selectSensors)
router.get("/get/count/sensors",sensorController.countSensors)
router.get("/get/count/sensors/:bed_id",sensorController.countSensorByBed)
router.post("/post/sensors",sensorController.insertSensor)
router.put("/put/sensors/:sensor_id",sensorController.updateSensor)
router.delete("/delete/sensors/:sensor_id",sensorController.deleteSensor)

export default router