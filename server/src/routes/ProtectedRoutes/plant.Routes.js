// plant.Routes.js
import express from 'express'; 
import * as plantController from '../../controllers/plant.Controller.js';
import { validatePlants } from "../../middlewares/plantsMiddleware.js"; 
import { verifyAccessToken } from "../../middlewares/authMiddleware.js";


const router = express.Router();

    router.post('/post/plants',verifyAccessToken,validatePlants,plantController.createPlant);
    router.get('/get/plants',verifyAccessToken,plantController.getAllPlants);
    router.get('/get/plants/:plant_id',verifyAccessToken,plantController.getPlantById);
    router.put('/put/plants/:plant_id',verifyAccessToken,validatePlants,plantController.updatePlant);
    router.delete('/delete/plants/:plant_id',verifyAccessToken,plantController.deletePlant);

export default router;