import * as trayModel from "../models/trayModels.js";
import * as trayGroupModel from "../models/trayGroupsModel.js"
import { json } from "express";


// ===== GET all trays =====
export const getTrays = async (req, res) => {
  try {
    const trays = await trayModel.readTrays()
    res.status(200).json(trays);
    console.log("TRAY GROUPS:", trays);
    
  } catch (err) {
    console.error("CONTROLLER: Error getting trays", err);
    res.status(500).json({ message: "Error getting trays", err });
  }
};



// ===== GET trays by ID =====
export const getTrayById = async (req, res) => {
  try {
    const {tray_id}= req.params
    const tray = await trayModel.readTrayById(tray_id)
    
    if (!tray) return res.status(404).json({ message: "Tray not found" });
    res.status(200).json(tray)
    console.log("TRAY :", tray);
    
  } catch (err) {
    console.error("CONTROLLER: Error getting tray by ID", err);
    res.status(500).json({ message: "Error getting tray ", err });
  }
};


export const createTrays = async (req, res) => {
  try {
    const trayData = req.body;
    const { tray_group_id } = trayData; // get tray_group_id from body

    // check if tray group exists
    const existingTrayGroup = await trayGroupModel.readTrayGroupById(tray_group_id);
    if (!existingTrayGroup) {
      return res.status(404).json({ message: "Tray group with this id doesn't exist" });
    }

    // create tray
    const tray = await trayModel.createTray(trayData);
    res.status(201).json(tray);
    console.log("TRAY CREATED:", tray);

  } catch (err) {
    console.error("CONTROLLER: Error creating tray", err);
    res.status(500).json({ message: "Error creating tray", err });
  }
};
  



// ===== UPDATE a tray =====
export const updateTrays  = async (req, res) => {
  try {
    
    const {tray_id} = req.params
    const trayData = req.body;

    const existingTray = await trayModel.readTrayById(tray_id)
    if (!existingTray) return res.status(404).json({ message: "Tray not found" });

    const existingTrayGroupId = await trayGroupModel.readTrayGroupById(trayData.tray_group_id)
    if (!existingTrayGroupId) {
      return res.status(404).json({ message: "Tray group with this id doesn't exist" });
    }

    const updated = await trayModel.updateTrays(trayData,tray_id);
    res.status(200).json(updated);
    console.log("TRAY UPDATED:", updated);

  } catch (err) {
    console.error("CONTROLLER: Error updating tray", err);
    res.status(500).json({ message: "Error updating tray", err });
  }
};



// ===== DELETE a tray =====
export const deleteTrays = async (req, res) => {
  try {
    const {tray_id} = req.params
    
    const existingTray = await trayModel.readTrayById(tray_id)
    if (!existingTray) return res.status(404).json({ message: "Tray not found" });

    const deletedTray = await trayModel.deleteTrays(tray_id);
    res.status(200).json({ message: "Tray deleted successfully",deletedTray});
    console.log("TRAY DELETED:", deletedTray);
  } catch (err) {
    console.error("CONTROLLER: Error deleting tray", err);
    res.status(500).json({ message: "Error deleting tray", err });
  }
};
