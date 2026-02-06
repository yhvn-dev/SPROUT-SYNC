import * as readingController from "../../controllers/readings.Controller.js";
import express from "express";

const router = express.Router();



    router.get("/get/readings", readingController.getReadings);
    router.get("/get/readings/last24h",readingController.getReadingsLast24h)
    router.get("/get/readings/latest",readingController.getLatestReadingsPerSensor) 
    router.get("/get/readings/average/:sensor_type",readingController.getAverageBySensorType)
    router.get("/get/readings/average",readingController.getAverageReadings)
    router.get("/get/readings/:reading_id", readingController.getReadingById);
    router.post("/post/readings", readingController.createReadings);
    router.put("/put/readings/:reading_id", readingController.updateReadings);
    router.delete("/delete/readings/all", readingController.deleteAllReadings);
    router.delete("/delete/readings/:reading_id", readingController.deleteReadings);


export default router;
    
