import cron from "node-cron";
import * as notifyController  from "../controllers/notifications.Controller.js";

cron.schedule('0 8 * * *', async () => {
  console.log('⏰ Running daily harvest check...');
  await notifyController.notifyReplantDate();
});

export const toDateOnlyUTC = (date) =>
  new Date(Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate()
  ));