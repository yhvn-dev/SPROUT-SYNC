// plantBatches.routes.js
import * as plantBatchHistoryController from "../../controllers/plantBatchHistory.Controller.js";
import { verifyAccessToken } from "../../middlewares/authMiddleware.js";
import express from "express";

const router = express.Router();

router.get("/get/pbh",plantBatchHistoryController.getPlantBatchHistory);
router.get("/get/pbh/total",plantBatchHistoryController.getPlantBatchHistoryTotals)
router.get("/get/pbh/growthbyweek",plantBatchHistoryController.getSeedlingGrowthOverTime)
router.post("/post/pbh",plantBatchHistoryController.createHistoryRecord);
router.delete("/delete/pbh/:history_id",plantBatchHistoryController.deletePlantBatchHistory)

export default router;