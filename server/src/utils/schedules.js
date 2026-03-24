import cron from "node-cron";
import { updatePastHarvestStatus } from "../controllers/plantBatch.Controller.js";

export const toDateOnlyUTC = (date) =>
  new Date(Date.UTC(  
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate()
  )); 
  
cron.schedule('0 7 * * *', async () => { 
  console.log("⏰ 7AM MYT Harvest Check:", new Date().toLocaleString('en-US', {timeZone: 'Asia/Kuala_Lumpur'}));
  try {
    await updatePastHarvestStatus();
  } catch (error) {
    console.error("❌ Error running harvest check:", error);
  }
}, {
  timezone: "Asia/Kuala_Lumpur"  
});