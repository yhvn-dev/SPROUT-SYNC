// plant.Routes.js
import express from 'express';
import * as plantController from '../../controllers/plant.Controller.js';

const router = express.Router();

    router.post('/post/plants', plantController.createPlant);
    router.get('/get/plants', plantController.getAllPlants);
    router.get('/get/plants/:plant_id', plantController.getPlantById);
    router.put('/put/plants/:plant_id', plantController.updatePlant);
    router.delete('/delete/plants/:plant_id', plantController.deletePlant);

export default router;