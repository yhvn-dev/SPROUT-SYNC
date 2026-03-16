import * as plantModel from "../models/plantModels.js"

/* =========================
   CREATE PLANT
========================= */
export const createPlant = async (req, res) => {
  try {
    const { name, moisture_min, moisture_max, group_id } = req.body;

    const plant = await  plantModel.createPlant(name, moisture_min, moisture_max, group_id);
    return res.status(201).json({ success: true, data: plant });
  } catch (err) {
    console.error("CONTROLLER: Error creating plant", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/* =========================
   GET ALL PLANTS
========================= */
export const getAllPlants = async (req, res) => {
  try {
    const plants = await  plantModel.getAllPlants();
    return res.status(200).json({ success: true, data: plants });
  } catch (err) {
    console.error("CONTROLLER: Error fetching plants", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/* =========================
   GET PLANT BY ID
========================= */
export const getPlantById = async (req, res) => {
  try {
    const { plant_id } = req.params;

    const plant = await  plantModel.getPlantById(plant_id);
    if (!plant) {
      return res.status(404).json({ success: false, message: "Plant not found" });
    }

    return res.status(200).json({ success: true, data: plant });
  } catch (err) {
    console.error("CONTROLLER: Error fetching plant by ID", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/* =========================
   UPDATE PLANT
========================= */
export const updatePlant = async (req, res) => {
  try {
    const { plant_id } = req.params;
    const { name, moisture_min, moisture_max, group_id } = req.body;

    if (!name || !moisture_min || !moisture_max || !group_id) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const plant = await  plantModel.updatePlant(plant_id, name, moisture_min, moisture_max, group_id);
    if (!plant) {
      return res.status(404).json({ success: false, message: "Plant not found" });
    }

    return res.status(200).json({ success: true, data: plant });
  } catch (err) {
    console.error("CONTROLLER: Error updating plant", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};






/* =========================
   DELETE PLANT
========================= */
export const deletePlant = async (req, res) => {
  try {
    const { plant_id } = req.params;

    const plant = await plantModel.deletePlant(plant_id);
    if (!plant) {
      return res.status(404).json({ success: false, message: "Plant not found" });
    }

    return res.status(200).json({ success: true, data: plant });
  } catch (err) {
    console.error("CONTROLLER: Error deleting plant", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};