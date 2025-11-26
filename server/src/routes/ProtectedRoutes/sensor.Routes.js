import express from "express"
import * as sensorController from "../../controllers/sensor.Controller.js"
import  {sensorValidation} from "../../middlewares/sensorMiddleware.js"

const router = express.Router()

    router.get("/get/sensors/:sensor_id",sensorController.selectSensor)
    router.get("/get/sensors",sensorController.selectSensors)
    router.get("/get/count/sensors",sensorController.countSensors)
    router.get("/get/count/sensors/:bed_id",sensorController.countSensorByBed)
    router.post("/post/sensors",sensorValidation,sensorController.insertSensor)
    router.put("/put/sensors/:sensor_id",sensorValidation,sensorController.updateSensor)
    router.delete("/delete/sensors/:sensor_id",sensorController.deleteSensor)

export default router