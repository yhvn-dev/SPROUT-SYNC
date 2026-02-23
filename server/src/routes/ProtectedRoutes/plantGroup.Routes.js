import * as plantGroupController from "../../controllers/plantGroup.Controller.js";
import { validatePlantGroups } from "../../middlewares/plantGroupMiddleware.js"; // optional middleware
import express from "express";

const router = express.Router();

    router.get("/get/plant_groups", plantGroupController.fetchAllPlantGroups);
    router.get("/get/plant_groups/:plant_group_id", plantGroupController.fetchPlantGroupById);
    router.post("/post/plant_groups", validatePlantGroups, plantGroupController.createPlantGroup);
    router.put("/put/plant_groups/:plant_group_id", validatePlantGroups, plantGroupController.updatePlantGroup);
    router.delete("/delete/plant_groups/:plant_group_id", plantGroupController.deletePlantGroup);

export default router;