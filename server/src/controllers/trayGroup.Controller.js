// trayGroups.controller.js
import * as trayGroupModels from "../models/trayGroupsModel.js";

// ===== GET all tray groups =====
export const getTrayGroups = async (req, res) => {
  try {
    const groups = await trayGroupModels.readTrayGroups()
    res.status(200).json(groups);
    console.log("TRAY GROUPS:", groups);
  } catch (err) {
    console.error("CONTROLLER: Error getting tray groups", err);
    res.status(500).json({ message: "Error getting tray groups", err });
  }
};

// ===== GET tray group by ID =====
export const getTrayGroupById = async (req, res) => {
  try {
    const {tray_group_id}= req.params
    const group = await trayGroupModels.readTrayGroupById(tray_group_id)
    
    if (!group) return res.status(404).json({ message: "Tray group not found" });

    res.status(200).json(group);
    console.log("TRAY GROUP:", group);
    
  } catch (err) {
    console.error("CONTROLLER: Error getting tray group by ID", err);
    res.status(500).json({ message: "Error getting tray group", err });
  }
};


// ===== CREATE a new tray group =====
export const createTrayGroup = async (req, res) => {
  try {
    const trayGroupData = req.body;
    const group = await trayGroupModels.createTrayGroups(trayGroupData)
    res.status(201).json(group);
    console.log("TRAY GROUP CREATED:", group);
  } catch (err) {
    console.error("CONTROLLER: Error creating tray group", err);
    res.status(500).json({ message: "Error creating tray group", err });
  }
};



// ===== UPDATE a tray group =====
export const updateTrayGroup = async (req, res) => {
  try {
    
    const {tray_group_id}= req.params
    const trayGroupData = req.body;

    const existingGroup = await trayGroupModels.readTrayGroupById(tray_group_id)
    if (!existingGroup) return res.status(404).json({ message: "Tray group not found" });

    const updatedGroup = await trayGroupModels.updateTrayGroups(trayGroupData,tray_group_id);
    res.status(200).json(updatedGroup);
    console.log("TRAY GROUP UPDATED:", updatedGroup);
  } catch (err) {
    console.error("CONTROLLER: Error updating tray group", err);
    res.status(500).json({ message: "Error updating tray group", err });
  }
};





// ===== DELETE a tray group =====
export const deleteTrayGroup = async (req, res) => {
  try {
    const {tray_group_id} = req.params

    const existingGroup = await trayGroupModels.readTrayGroupById(tray_group_id)
    if (!existingGroup) return res.status(404).json({ message: "Tray group not found" });

    const deletedGroup = await trayGroupModels.deleteTrayGroups(tray_group_id);
    res.status(200).json({ message: "Tray group deleted successfully", deletedGroup });
    console.log("TRAY GROUP DELETED:", deletedGroup);

  } catch (err) {
    console.error("CONTROLLER: Error deleting tray group", err);
    res.status(500).json({ message: "Error deleting tray group", err });
  }
};
