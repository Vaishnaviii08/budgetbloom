import cron from "node-cron";
import User from "../models/User.js";

//To automatically reset monthlyEarnings and monthlySpendings to 0 on the 1st of every month
cron.schedule("0 0 * * *", async () => {
  const today = new Date();

  if (today.getDate() === 1) {
    try {
      const result = await User.updateMany({}, {
        $set: {
          monthlyEarnings: 0,
          monthlySpendings: 0,
        },
      });

      console.log(`[CRON] Monthly stats reset for ${result.modifiedCount} users`);
    } catch (error) {
      console.error("[CRON] Error resetting monthly stats:", error.message);
    }
  }
});