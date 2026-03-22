import cron from "node-cron";
import { updatePastHarvestStatus } from "../controllers/plantBatch.Controller.js";

// ===== Helper function =====
export const toDateOnlyUTC = (date) =>
  new Date(Date.UTC(  
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate()
  ));

cron.schedule("* * * * *", async () => { 
  console.log("⏰ Running daily harvest check:", new Date().toISOString());
  try {
    await updatePastHarvestStatus();
  } catch (error) {
    console.error("❌ Error running daily harvest check:", error);
  }
});