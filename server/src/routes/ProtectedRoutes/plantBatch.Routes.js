// plantBatches.routes.js
import * as plantBatchController from "../../controllers/plantBatch.Controller.js";
import {validatePlantBatch} from "../../middlewares/plantBatchesMiddleware.js"
import { verifyAccessToken } from "../../middlewares/authMiddleware.js";
import express from "express";

const router = express.Router();

router.get("/get/pb",verifyAccessToken,plantBatchController.getPlantBatches);
router.get("/get/pb/total",verifyAccessToken,plantBatchController.getPlantBatchTotals)
router.get("/get/pb/growthbyweek",verifyAccessToken,plantBatchController.getSeedlingGrowthOverTime)
router.get("/get/pb/:batch_id",verifyAccessToken,plantBatchController.getPlantBatchById);


router.post("/post/pb",verifyAccessToken,validatePlantBatch, plantBatchController.createPlantBatch);
router.put("/put/pb/:batch_id",verifyAccessToken,validatePlantBatch, plantBatchController.updatePlantBatch);
router.delete("/delete/pb/:batch_id",verifyAccessToken,plantBatchController.deletePlantBatch);


export default router;