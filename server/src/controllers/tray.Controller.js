// trays.controller.js
import * as trayGroupModels from "../models/trayGroupsModel.js"
import * as plantBatchModels from "../models/plantBatchesModels.js"
import * as trayModels from "../models/trayModels.js";

// ===== GET all trays =====
export const getTrays = async (req, res) => {
  try {
    const trays = await trayModels.readTrays();
    res.status(200).json(trays);
    console.log("TRAYS:", trays);
  } catch (err) {
    console.error("CONTROLLER: Error getting trays", err);
    res.status(500).json({ message: "Error getting trays", err });
  }
};

// ===== GET tray by ID =====
export const getTrayById = async (req, res) => {
  try {
    const { tray_id } = req.params;
    const tray = await trayModels.readTrayById(tray_id);

    if (!tray) return res.status(404).json({ message: "Tray not found" });

    res.status(200).json(tray);
    console.log("TRAY:", tray);
  } catch (err) {
    console.error("CONTROLLER: Error getting tray by ID", err);
    res.status(500).json({ message: "Error getting tray", err });
  }
};

// ===== CREATE a new tray =====
export const createTray = async (req, res) => {
  try {
    const trayData = req.body;
    const {tray_group_id,batch_id} = trayData
  

    const existingTrayGroup = await trayGroupModels.readTrayGroupById(tray_group_id)
    if(!existingTrayGroup ) return res.status(404).json({ message: "Tray group not found" });

    const existingBatchGroup = await plantBatchModels.readPlantBatchById(batch_id)
    if(!existingBatchGroup) return res.status(404).json({ message: "Plant Batch not found" });

    const tray = await trayModels.createTray(trayData);
    res.status(201).json(tray);
    console.log("TRAY CREATED:", tray);
    
  } catch (err) {
    console.error("CONTROLLER: Error creating tray", err);
    res.status(500).json({ message: "Error creating tray", err });
  }
};

// ===== UPDATE a tray =====
export const updateTray = async (req, res) => {
  try {
    const { tray_id } = req.params;
    const trayData = req.body;
    const {tray_group_id,batch_id} = trayData
    
    const existingTrayGroup = await trayGroupModels.readTrayGroupById(tray_group_id)
    if(!existingTrayGroup ) return res.status(404).json({ message: "Tray group not found" });

    const existingBatchGroup = await plantBatchModels.readPlantBatchById(batch_id)
    if(!existingBatchGroup) return res.status(404).json({ message: "Plant Batch not found" });

    const existingTray = await trayModels.readTrayById(tray_id);
    if (!existingTray) return res.status(404).json({ message: "Tray not found" });

    const updatedTray = await trayModels.updateTray(trayData, tray_id);
    res.status(200).json(updatedTray);
    console.log("TRAY UPDATED:", updatedTray);
    
  } catch (err) {
    console.error("CONTROLLER: Error updating tray", err);
    res.status(500).json({ message: "Error updating tray", err });
  }
};



// ===== DELETE a tray =====
export const deleteTray = async (req, res) => {
  try {
    const { tray_id } = req.params;

    const existingTray = await trayModels.readTrayById(tray_id);
    if (!existingTray) return res.status(404).json({ message: "Tray not found" });

    const deletedTray = await trayModels.deleteTray(tray_id);
    res.status(200).json({ message: "Tray deleted successfully", deletedTray });
    console.log("TRAY DELETED:", deletedTray);
  } catch (err) {
    console.error("CONTROLLER: Error deleting tray", err);
    res.status(500).json({ message: "Error deleting tray", err });
  }
};
