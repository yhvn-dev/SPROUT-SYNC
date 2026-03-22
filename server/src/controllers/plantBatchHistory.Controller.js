// plantBatchHistory.controller.js
import * as historyModels from "../models/plantBatchesHistoryModels.js";





// ===== GET all history records =====
export const getPlantBatchHistory = async (req, res) => {
  try {
    const history = await historyModels.readPlantBatchHistory();
    res.status(200).json(history);
  } catch (err) {
    console.error("CONTROLLER: Error getting plant batch history", err);
    res.status(500).json({ message: "Error getting plant batch history", err });
  }
};

// ===== GET history by history_id =====
export const getHistoryById = async (req, res) => {
    
  try {
    const { history_id } = req.params;
    const record = await historyModels.readHistoryById(history_id)
    if (!record) return res.status(404).json({ message: "History record not found" });
    res.status(200).json(record);
  } catch (err) {
    console.error("CONTROLLER: Error getting history by ID", err);
    res.status(500).json({ message: "Error getting history record", err });
  }
  
};

// ===== GET history by batch_id =====
export const getHistoryByBatchId = async (req, res) => {
  try {
    const { batch_id } = req.params;
    const records = await historyModels.readHistoryByBatchId()
    res.status(200).json(records);
    console.log(`HISTORY RECORDS for batch ${batch_id}:`, records);
  } catch (err) {
    console.error("CONTROLLER: Error getting history by batch ID", err);
    res.status(500).json({ message: "Error getting history records", err });
  }
};


// ===== GET totals of all plant batches =====
export const getPlantBatchHistoryTotals = async (req, res) => {

  try {
    const totals = await historyModels.readPlantBatchHistoryTotals()
    res.status(200).json(totals);
    console.log("PLANT BATCH HISTORY TOTALS:", totals);
  } catch (err) {
    console.error("CONTROLLER: Error getting plant batch history totals", err);
    res.status(500).json({ message: "Error getting plant batch history totals", err });
  }
  
};




// ===== GET Seedling Growth Over Time per Batch =====
export const getSeedlingGrowthOverTime = async (req, res) => {
  try {
    const growthData = await historyModels.readSeedlingGrowthByWeekAll()
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



// ===== CREATE a history record manually =====
export const createHistoryRecord = async (req, res) => {
  try {
    const historyData = req.body;
    const record = await historyModels.createHistoryRecord(historyData);
    res.status(201).json(record);
    console.log("HISTORY RECORD CREATED:", record);
  } catch (err) {
    console.error("CONTROLLER: Error creating history record", err);
    res.status(500).json({ message: "Error creating history record", err });
  }
};



// ===== DELETE a plant batch =====
export const deletePlantBatchHistory = async (req, res) => {
  try {
    const { history_id } = req.params;
    const existingBatchHistory = await historyModels.readHistoryByBatchId(history_id)
    if (!existingBatchHistory) return res.status(404).json({ message: "Plant batch history not found" });

    const deletedBatchHistory = await historyModels.deleteHistoryRecord(history_id )
    res.status(200).json({ message: "Plant batch history deleted successfully", deletedBatchHistory});
    console.log("PLANT BATCH HISTORY DELETED:", deletedBatchHistory);
  } catch (err) {
    console.error("CONTROLLER: Error deleting plant batch history", err);
    res.status(500).json({ message: "Error deleting plant batch history", err });
  }
};

