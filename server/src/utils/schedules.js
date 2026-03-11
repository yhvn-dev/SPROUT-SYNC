import cron from "node-cron";
import * as notifyController from "../controllers/notifications.Controller.js";
import * as plantBatchController from "../controllers/plantBatch.Controller.js"; // <-- import update function


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
    await plantBatchController.updatePastHarvestStatus?.()
    await notifyController.notifyReplantDate();
  } catch (error) {
    console.error("❌ Error running daily harvest check:", error);
  }
});