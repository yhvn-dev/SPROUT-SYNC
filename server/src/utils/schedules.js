import cron from "node-cron";
import * as notifyController  from "../controllers/notifications.Controller.js";

// Runs EVERY DAY at 4:00 PM (server time)
cron.schedule("0 16 * * *", async () => {
  console.log("⏰ Running daily harvest check:", new Date().toISOString());
  await notifyController.notifyReplantDate();
});

export const toDateOnlyUTC = (date) =>
  new Date(Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate()
  ));

