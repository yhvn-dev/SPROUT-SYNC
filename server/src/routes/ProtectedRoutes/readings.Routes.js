import * as readingController from "../../controllers/readings.Controller.js"
import express from "express"

const router = express.Router()

    router.get("/get/readings", readingController.selectReadings)
    router.get("/get/readings/count", readingController.countReadings)
    router.get("/get/readings/:reading_id", readingController.selectReading)
    router.post("/post/readings", readingController.insertReadings)
    router.put("/put/readings/:reading_id",readingController.updateReadings)
    router.delete("/delete/readings/:reading_id",readingController.removeReadings)

export default router   