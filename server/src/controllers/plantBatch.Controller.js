// plantBatches.controller.js

import * as plantBatchModels from "../models/plantBatchesModels.js"
import * as trayModels from "../models/trayModels.js"
import * as plantBatchHistoryModel from "../models/plantBatchesHistoryModels.js"
import * as deviceTokenModel from "../models/deviceTokenModels.js"
import {notifyBatchCreated} from "./notifications.Controller.js"
import { createNotif } from "../models/notificationModels.js"
import { sendPushNotification } from "../utils/firebaseAdmin.js"


// ===== GET all plant batches =====
export const getPlantBatches = async (req, res) => {
  try {
    const batches = await plantBatchModels.readPlantBatches();
    res.status(200).json(batches);
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









export const updatePastHarvestStatus = async (forceBatchId = null, forceUpdate = false) => {  
  try {
    const allBatches = await plantBatchModels.readPlantBatches();
    
    const batches = forceBatchId 
      ? allBatches.filter(b => Number(b.batch_id) === Number(forceBatchId))
      : allBatches;

    const now = new Date();
    const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const tomorrow = new Date(today);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

    const parseUTCDate = (dateStr) => {
      if (dateStr instanceof Date) {
        return new Date(Date.UTC(
          dateStr.getFullYear(),
          dateStr.getMonth(),
          dateStr.getDate()
        ));
      }
      const datePart = String(dateStr).split("T")[0];
      const [year, month, day] = datePart.split("-").map(Number);
      return new Date(Date.UTC(year, month - 1, day));
    };

    const pushToAllDevices = async (title, message, type = "info", status = "Low") => {
      const devices = await deviceTokenModel.getAllDeviceTokens();
      if (devices.length > 0) {
        await Promise.all(
          devices.map(device =>
            sendPushNotification(device.push_token, title, message, type, status)
          )
        );
      }
    };

    for (const batch of batches) {
      if (!batch.date_planted || batch.expected_harvest_days == null) continue;

      const planted = parseUTCDate(batch.date_planted);
      const harvestDate = new Date(planted);
      harvestDate.setUTCDate(harvestDate.getUTCDate() + Number(batch.expected_harvest_days));

      const expected = harvestDate;

      let newStatus;
      if (batch.harvested_at || batch.harvest_status === "Harvested") {
        newStatus = "Harvested";
      } else if (expected.getTime() === today.getTime()) {
        newStatus = "Due Now";
      } else if (expected.getTime() === tomorrow.getTime()) {
        newStatus = "Due Tomorrow";
      } else if (expected > today) {
        newStatus = "Not Ready";
      } else {
        newStatus = "Past Due";
      }

      const statusChanged = batch.harvest_status !== newStatus;

      if (statusChanged || forceUpdate) {
        await plantBatchModels.updateHarvestStatus(newStatus, batch.batch_id);
      }

      const plantedStr = planted.toISOString().slice(0, 10);
      const harvestStr = harvestDate.toISOString().slice(0, 10);

      if (newStatus === "Due Tomorrow") {
        console.log(`📢 Notifying: Due Tomorrow — ${batch.batch_number}`);
        await createNotif({
          type: "Warning",
          status: "Medium",
          message: `Harvest Reminder\n1 Day Remaining before harvest\n\nPlant: [${batch.batch_number}] ${batch.plant_name}\nPlanted: ${plantedStr}\nExpected Harvest: ${harvestStr}`
        });

        if (statusChanged || forceUpdate) {
          await pushToAllDevices(
            "Harvest Reminder",
            `[${batch.batch_number}] ${batch.plant_name} is a Day Remaining before harvest`,
            "Warning",
            "Medium"
          );
        }

      } else if (newStatus === "Due Now") {
        console.log(`📢 Notifying: Due Now — ${batch.batch_number}`);
        await createNotif({
          type: "Success",
          status: "Low",
          message: `Harvest Day!\nIt's time to harvest today!\n\nPlant: [${batch.batch_number}] ${batch.plant_name}\nPlanted: ${plantedStr}\nHarvest Date: ${harvestStr}`
        });

        if (statusChanged || forceUpdate) {
          await pushToAllDevices(
            "Harvest Day!",
            `[${batch.batch_number}] ${batch.plant_name} harvest is today!`,
            "Success",
            "Low"
          );
        }

      } else if (newStatus === "Past Due") {
        console.log(`📢 Notifying: Past Due — ${batch.batch_number}`);
        await createNotif({
          type: "Critical",
          status: "High",
          message: `Overdue Harvest!\nThis batch is past its harvest date!\n\nPlant: [${batch.batch_number}] ${batch.plant_name}\nPlanted: ${plantedStr}\nExpected Harvest: ${harvestStr}`
        });

        if (statusChanged || forceUpdate) {
          await pushToAllDevices(
            "Overdue Harvest!",
            `[${batch.batch_number}] ${batch.plant_name}'s This batch is past its harvest date!`,
            "Critical",
            "High"
          );
        }

      } else if (newStatus === "Harvested") {
        console.log(`📢 Notifying: Harvested — ${batch.batch_number}`);
        await createNotif({
          type: "Success",
          status: "Low",
          message: `Batch Harvested!\n[${batch.batch_number}] ${batch.plant_name} is Successfully Harvested\nPlanted: ${plantedStr}\nHarvested: ${harvestStr}`
        });

        if (statusChanged || forceUpdate) {
          await pushToAllDevices(
            "Batch Harvested!",
            `[${batch.batch_number}] ${batch.plant_name} is Successfully Harvested`,
            "Success",
            "Low"
          ); 
        }
      } else {
        console.log(`⏭️ No notify for ${batch.batch_number} — status: ${newStatus}`);
      }
    }

  } catch (err) {
    console.error("Error updating harvest status:", err);
  }
};


















// ===== UPDATE a plant batch =====
export const updatePlantBatch = async (req, res) => {
  try {
    const { batch_id } = req.params;
    const batchData = req.body;
    const { tray_id } = batchData;

    const existingTray = await trayModels.readTrayById(tray_id);
    if (!existingTray) return res.status(404).json({ message: "Selected Tray not found" });

    const existingBatch = await plantBatchModels.readPlantBatchById(batch_id);
    if (!existingBatch) return res.status(404).json({ message: "Plant batch not found" });

    const updatedBatch = await plantBatchModels.updatePlantBatch(batchData, batch_id);

    // ✅ Pass batch_id — force evaluate yung specific batch na na-update
    await notifyBatchCreated(updatedBatch, "update");
     await updatePastHarvestStatus(batch_id, true)
    res.status(200).json(updatedBatch);


  } catch (err) {
    console.error("CONTROLLER: Error updating plant batch", err);
    res.status(500).json({ message: "Error updating plant batch", err });
  }
};



export const markBatchAsHarvested = async (req, res) => {
    try {
      const {batch_id} = req.params;
      const {harvest_status} = req.body;

      const batch = await plantBatchModels.updateHarvestStatus(harvest_status, batch_id);
  
      await notifyBatchCreated(batch, "update");
     await updatePastHarvestStatus(batch_id, true)

      res.status(200).json({ message: `Harvest status updated successfully`, data: batch });
    } catch (error) {
      console.error("Error updating batch's harvest status:", error);
      res.status(500).json({ message: "Error updating harvest status" });
    }
};




export const createPlantBatch = async (req, res) => {
  try {
    const batchData = req.body;
    const { tray_id } = batchData;

    const existingTray = await trayModels.readTrayById(tray_id);
    if (!existingTray) return res.status(404).json({ message: "Selected Tray not found" });

    const batch = await plantBatchModels.createPlantBatch(batchData);
    await trayModels.updateTrayStatus(tray_id, "Occupied")

    res.status(201).json(batch);

    await notifyBatchCreated(batch, "insert");
    await updatePastHarvestStatus(batch.batch_id, true); 
  } catch (err) {
    console.error("CONTROLLER: Error creating plant batch", err);
    res.status(500).json({ message: "Error creating plant batch", err });
  }
};



// ===== DELETE a plant batch =====
export const deletePlantBatch = async (req, res) => {
  try {
    const { batch_id } = req.params;
    const existingBatch = await plantBatchModels.readPlantBatchById(batch_id);
    if (!existingBatch) return res.status(404).json({ message: "Plant batch not found" });

    await plantBatchHistoryModel.createHistoryRecord(existingBatch);
    const deletedBatch = await plantBatchModels.deletePlantBatch(batch_id);

    await trayModels.updateTrayStatus(existingBatch.tray_id, "Available");

    res.status(200).json({ message: "Plant batch deleted successfully", deletedBatch });

  } catch (err) {
    res.status(500).json({ message: "Error deleting plant batch", err });
    console.error("CONTROLLER: Error deleting plant batch", err);
  }
};
