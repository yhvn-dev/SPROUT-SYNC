// plantBatches.controller.js

import * as plantBatchModels from "../models/plantBatchesModels.js"
import * as trayModels from "../models/trayModels.js"
import * as plantBatchHistoryModel from "../models/plantBatchesHistoryModels.js"
import {notifyBatchCreated} from "./notifications.Controller.js"



// ===== GET all plant batches =====
export const getPlantBatches = async (req, res) => {
  try {
    const batches = await plantBatchModels.readPlantBatches();
    res.status(200).json(batches);
    console.log("PLANT BATCHES:", batches);
  } catch (err) {
    console.error("CONTROLLER: Error getting plant batches", err);
    res.status(500).json({ message: "Error getting plant batches", err });
  }
};


// ===== GET single plant batch by ID =====
export const getPlantBatchById = async (req, res) => {
  try {
    const { batch_id } = req.params;
    const batch = await plantBatchModels.readPlantBatchById(batch_id);

    if (!batch) return res.status(404).json({ message: "Plant batch not found" });

    res.status(200).json(batch);
    console.log("PLANT BATCH:", batch);
  } catch (err) {
    console.error("CONTROLLER: Error getting plant batch by ID", err);
    res.status(500).json({ message: "Error getting plant batch", err });
  }
};


// ===== GET totals of all plant batches =====
export const getPlantBatchTotals = async (req, res) => {

  try {
    const totals = await plantBatchModels.getPlantBatchTotals()
    res.status(200).json(totals);
    console.log("PLANT BATCH TOTALS:", totals);
  } catch (err) {
    console.error("CONTROLLER: Error getting plant batch totals", err);
    res.status(500).json({ message: "Error getting plant batch totals", err });
  }
  
};




// ===== GET Seedling Growth Over Time per Batch =====
export const getSeedlingGrowthOverTime = async (req, res) => {
  try {
    const growthData = await plantBatchModels.getSeedlingGrowthByWeekAll();
    const seedlingGrowthData = growthData.map(item => {
      const grown = Number(item.total_grown ?? 0);
      const dead = Number(item.total_dead ?? 0);
      const replanted = Number(item.total_replanted ?? 0);

      const weekDate = new Date(item.week_start);
      const weekLabel = `Week of ${weekDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })}`;

      return {
        week: weekLabel,
        grown,
        dead,
        replanted,
        total: grown + dead + replanted
      };
    });

    return res.status(200).json({ seedlingGrowthData });

  } catch (error) {
    console.error("Error fetching seedling growth:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



// ===== CREATE a new plant batch =====
export const createPlantBatch = async (req, res) => {
  try {
    const batchData = req.body;
    const {tray_id} = batchData

    const existingTray = await trayModels.readTrayById(tray_id)
    if (!existingTray) return res.status(404).json({ message: "Selected Tray not found" });
    const batch = await plantBatchModels.createPlantBatch(batchData)  
    res.status(201).json(batch);
    await notifyBatchCreated(batch);
   
    console.log("PLANT BATCH CREATED:", batch);  
  } catch (err) {
    console.error("CONTROLLER: Error creating plant batch", err);
    res.status(500).json({ message: "Error creating plant batch", err });
  }
};




// ===== UPDATE a plant batch =====
export const updatePlantBatch = async (req, res) => {
  try {
    const { batch_id } = req.params;
    const batchData = req.body;
    const {tray_id} = batchData

    const existingTray = await trayModels.readTrayById(tray_id)
    if (!existingTray) return res.status(404).json({ message: "Selected Tray not found" });

    const existingBatch = await plantBatchModels.readPlantBatchById(batch_id);
    if (!existingBatch) return res.status(404).json({ message: "Plant batch not found" });

    const updatedBatch = await plantBatchModels.updatePlantBatch(batchData, batch_id);
    res.status(200).json(updatedBatch);
    console.log("PLANT BATCH UPDATED:", updatedBatch);
    
  } catch (err) {
    console.error("CONTROLLER: Error updating plant batch", err);
    res.status(500).json({ message: "Error updating plant batch", err });
  }
};



// ===== CHECK and UPDATE batches past harvest =====
export const updatePastHarvestStatus = async () => {
  try {
    const batches = await plantBatchModels.readPlantBatches();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const batch of batches) {
      if (!batch.date_planted || batch.expected_harvest_days == null) continue;

      let newStatus;
      const expected = new Date(batch.date_planted);
      expected.setDate(expected.getDate() + Number(batch.expected_harvest_days));
      expected.setHours(0, 0, 0, 0);

      if (batch.harvested_at) {
        newStatus = "Harvested";
      } else if (expected > today) {
        newStatus = "Not Ready";
      } else if (expected.getTime() === today.getTime()) {
        newStatus = "Due Now";
      } else {
        newStatus = "Past Due";
      }
      if (batch.harvest_status !== newStatus) {
        await plantBatchModels.updateHarvestStatus(batch.batch_id, newStatus);
        console.log(`Batch ${batch.batch_id} harvest_status updated to '${newStatus}'`);
      }
    }
  } catch (err) {
    console.error("Error updating harvest status:", err);
  }
};



// ===== DELETE a plant batch =====
export const deletePlantBatch = async (req, res) => {
  try {
    const { batch_id } = req.params;
    const existingBatch = await plantBatchModels.readPlantBatchById(batch_id);
    if (!existingBatch) return res.status(404).json({ message: "Plant batch not found" });

    console.log("EXISTING BATCH",existingBatch)

    await plantBatchHistoryModel.createHistoryRecord(existingBatch)
    const deletedBatch = await plantBatchModels.deletePlantBatch(batch_id);
    res.status(200).json({ message: "Plant batch deleted successfully", deletedBatch});
    console.log("PLANT BATCH DELETED:", deletedBatch);

    
  } catch (err) {
    console.error("CONTROLLER: Error deleting plant batch", err);
    res.status(500).json({ message: "Error deleting plant batch", err });
  }
};
