import * as plantGroupModel from "../models/plantGroupModels.js";

/* =========================
   CREATE PLANT GROUP
========================= */
export const createPlantGroup = async (req, res) => {
  try {
    const { group_name, moisture_min, moisture_max } = req.body;

    if (!group_name || moisture_min === undefined || moisture_max === undefined) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const group = await plantGroupModel.createPlantGroup(
      group_name,
      moisture_min,
      moisture_max
    );

    res.status(200).json({
      success: true,
      message: "Plant group created successfully",
      group,
    });
  } catch (err) {
    console.error("CONTROLLER: Error creating plant group", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   FETCH ALL PLANT GROUPS
========================= */
export const fetchAllPlantGroups = async (req, res) => {
  try {
    const groups = await plantGroupModel.getAllPlantGroups();
    res.status(200).json({
      success: true,
      groups,
    });
  } catch (err) {
    console.error("CONTROLLER: Error fetching all plant groups", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   FETCH SINGLE PLANT GROUP
========================= */
export const fetchPlantGroupById = async (req, res) => {
  try {
    const { plant_group_id } = req.params;

    if (!plant_group_id) {
      return res.status(400).json({ success: false, message: "Missing plant_group_id" });
    }

    const group = await plantGroupModel.getPlantGroupById(plant_group_id);

    if (!group) {
      return res.status(404).json({ success: false, message: "Plant group not found" });
    }

    res.status(200).json({
      success: true,
      group,
    });
  } catch (err) {
    console.error("CONTROLLER: Error fetching plant group", err);
    res.status(500).json({ success: false, message: err.message });
  }
};


/* =========================
   UPDATE PLANT GROUP
========================= */
export const updatePlantGroup = async (req, res) => {
  try {
    const { plant_group_id } = req.params;
    const { group_name, moisture_min, moisture_max } = req.body;

    if (!plant_group_id || !group_name || moisture_min === undefined || moisture_max === undefined) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const updatedGroup = await plantGroupModel.updatePlantGroup(
      plant_group_id,
      group_name,
      moisture_min,
      moisture_max
    );

    if (!updatedGroup) {
      return res.status(404).json({ success: false, message: "Plant group not found" });
    }

    res.status(200).json({
      success: true,
      message: "Plant group updated successfully",
      group: updatedGroup,
    });
  } catch (err) {
    console.error("CONTROLLER: Error updating plant group", err);
    res.status(500).json({ success: false, message: err.message });
  }
};



/* =========================
   DELETE PLANT GROUP
========================= */
export const deletePlantGroup = async (req, res) => {
  try {
    const { plant_group_id } = req.params;

    if (!plant_group_id) {
      return res.status(400).json({ success: false, message: "Missing plant_group_id" });
    }

    const deletedGroup = await plantGroupModel.deletePlantGroup(plant_group_id);

    if (!deletedGroup) {
      return res.status(404).json({ success: false, message: "Plant group not found" });
    }

    res.status(200).json({
      success: true,
      message: "Plant group deleted successfully",
      group: deletedGroup,
    });
  } catch (err) {
    console.error("CONTROLLER: Error deleting plant group", err);
    res.status(500).json({ success: false, message: err.message });
  }
};