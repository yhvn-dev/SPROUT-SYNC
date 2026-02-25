// plantBatches.routes.js
import * as plantBatchHistoryController from "../../controllers/plantBatchHistory.Controller.js";
import { verifyAccessToken } from "../../middlewares/authMiddleware.js";
import express from "express";

const router = express.Router();

router.get("/get/pbh",verifyAccessToken,plantBatchHistoryController.getPlantBatchHistory);
router.get("/get/pbh/total",verifyAccessToken,plantBatchHistoryController.getPlantBatchHistoryTotals)
router.get("/get/pbh/growthbyweek",verifyAccessToken,plantBatchHistoryController.getSeedlingGrowthOverTime)
router.post("/post/pbh",verifyAccessToken,plantBatchHistoryController.createHistoryRecord);
router.delete("/delete/pbh/:history_id",verifyAccessToken,plantBatchHistoryController.deletePlantBatchHistory)

export default router;