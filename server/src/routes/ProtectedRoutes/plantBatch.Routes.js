// plantBatches.routes.js
import * as plantBatchController from "../../controllers/plantBatch.Controller.js";
import {validatePlantBatch} from "../../middlewares/plantBatchesMiddleware.js";
import express from "express";

const router = express.Router();

router.get("/get/pb", plantBatchController.getPlantBatches);
router.get("/get/pb/total",plantBatchController.getPlantBatchTotals)
router.get("/get/pb/:batch_id", plantBatchController.getPlantBatchById);

router.post("/post/pb", validatePlantBatch, plantBatchController.createPlantBatch);
router.put("/put/pb/:batch_id", validatePlantBatch, plantBatchController.updatePlantBatch);
router.delete("/delete/pb/:batch_id",plantBatchController.deletePlantBatch);


export default router;