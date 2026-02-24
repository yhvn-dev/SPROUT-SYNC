// plant.Routes.js
import express from 'express';
import * as plantController from '../../controllers/plant.Controller.js';
import { validatePlants } from "../../middlewares/plantsMiddleware.js"; 



const router = express.Router();

    router.post('/post/plants',validatePlants,plantController.createPlant);
    router.get('/get/plants',plantController.getAllPlants);
    router.get('/get/plants/:plant_id',plantController.getPlantById);
    router.put('/put/plants/:plant_id',validatePlants,plantController.updatePlant);
    router.delete('/delete/plants/:plant_id',plantController.deletePlant);

export default router;