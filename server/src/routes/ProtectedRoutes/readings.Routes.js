import * as readingsController from "../../controllers/readings.Controller.js";
import { verifyAccessToken } from "../../middlewares/authMiddleware.js";
import express from "express";


const router = express.Router();

    router.get("/get/readings",verifyAccessToken,readingsController.getReadings);
    router.get("/get/readings/last24h",verifyAccessToken,readingsController.getReadingsLast24h)
    router.get("/get/readings/latest",verifyAccessToken,readingsController.getLatestReadingsPerSensor) 
    router.get("/get/readings/average/:sensor_type",verifyAccessToken,readingsController.getAverageBySensorType)
    router.get("/get/readings/average",verifyAccessToken,readingsController.getAverageReadings)
    router.get("/get/readings/:reading_id",verifyAccessToken,readingsController.getReadingById);
    router.post("/post/readings",readingsController.createReadings);
    router.put("/put/readings/:reading_id",verifyAccessToken,readingsController.updateReadings);
    router.delete("/delete/readings/all",verifyAccessToken,readingsController.deleteAllReadings);
    router.delete('/delete/readings/type/:type',verifyAccessToken,readingsController.removeAllReadingsByType);
    router.delete("/delete/readings/:reading_id",verifyAccessToken,readingsController.deleteReadings);
    
export default router;

    
