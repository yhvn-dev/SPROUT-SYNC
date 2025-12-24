// plantBatches.routes.js
import * as plantBatchHistoryController from "../../controllers/plantBatchHistory.Controller.js";
import express from "express";

const router = express.Router();

router.get("/get/pbh", plantBatchHistoryController.getPlantBatchHistory);
router.post("/post/pbh", plantBatchHistoryController.createHistoryRecord);

export default router;