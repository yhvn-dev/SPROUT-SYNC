// plant.Controller.js
import * as plantModel from '../models/plantModels.js';

/* =========================
   CREATE PLANT
========================= */
export const createPlant = async (req, res) => {
  try {
    const { name, description, reference_link, moisture_min, moisture_max, group_id } = req.body;

    if (!name || moisture_min === undefined || moisture_max === undefined) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const plant = await plantModel.createPlant(
      name,
      description || null,
      reference_link || null,
      moisture_min,
      moisture_max,
      group_id || null
    );

    res.status(200).json({
      success: true,
      message: "Plant created successfully",
      plant,
    });
  } catch (err) {
    console.error("CONTROLLER: Error creating plant", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   GET ALL PLANTS
========================= */
export const getAllPlants = async (req, res) => {
  try {
    const plants = await plantModel.getAllPlants();
    res.status(200).json({ success: true, plants });
  } catch (err) {
    console.error("CONTROLLER: Error fetching plants", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   GET PLANT BY ID
========================= */
export const getPlantById = async (req, res) => {
  try {
    const { plant_id } = req.params;
    const plant = await plantModel.getPlantById(plant_id);

    if (!plant) {
      return res.status(404).json({ success: false, message: "Plant not found" });
    }

    res.status(200).json({ success: true, plant });
  } catch (err) {
    console.error("CONTROLLER: Error fetching plant by ID", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   UPDATE PLANT
========================= */
export const updatePlant = async (req, res) => {
  try {
    const { plant_id } = req.params;
    const { name, description, reference_link, moisture_min, moisture_max, group_id } = req.body;

    const plant = await plantModel.updatePlant(
      plant_id,
      name,
      description,
      reference_link,
      moisture_min,
      moisture_max,
      group_id
    );

    if (!plant) {
      return res.status(404).json({ success: false, message: "Plant not found" });
    }

    res.status(200).json({ success: true, message: "Plant updated successfully", plant });
  } catch (err) {
    console.error("CONTROLLER: Error updating plant", err);
    res.status(500).json({ success: false, message: err.message });
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

    res.status(200).json({ success: true, message: "Plant deleted successfully", plant });
  } catch (err) {
    console.error("CONTROLLER: Error deleting plant", err);
    res.status(500).json({ success: false, message: err.message });
  }
};