import * as readingsController from "../../controllers/readings.Controller.js";
import { verifyAccessToken } from "../../middlewares/authMiddleware.js";
import express from "express";


const router = express.Router();

    router.get("/get/readings",readingsController.getReadings);
    router.get("/get/readings/last24h",readingsController.getReadingsLast24h)
    router.get("/get/readings/latest" ,readingsController.getLatestReadingsPerSensor) 
    router.get("/get/readings/average/:sensor_type",readingsController.getAverageBySensorType)
    router.get("/get/readings/average",readingsController.getAverageReadings)
    router.get("/get/readings/:reading_id",readingsController.getReadingById);
    router.post("/post/readings",readingsController.createReadings);
    router.put("/put/readings/:reading_id", readingsController.updateReadings);
    router.delete("/delete/readings/all",readingsController.deleteAllReadings);
    router.delete('/delete/readings/type/:type',readingsController.removeAllReadingsByType);
    router.delete("/delete/readings/:reading_id",readingsController.deleteReadings);
    
export default router;

    
