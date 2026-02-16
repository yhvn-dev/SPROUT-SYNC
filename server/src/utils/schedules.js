import cron from "node-cron";
import * as notifyController from "../controllers/notifications.Controller.js";


// Production: run every day at 7 AM
cron.schedule("* 6 * * *", async () => {
  console.log("⏰ Running daily harvest check:", new Date().toISOString());
  try {
    await notifyController.notifyReplantDate();
  } catch (error) {
    console.error("❌ Error running daily harvest check:", error);
  }
});


// Helper function
export const toDateOnlyUTC = (date) =>
  new Date(Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate()
  ));