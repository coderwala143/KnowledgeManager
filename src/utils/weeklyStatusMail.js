import cron from "node-cron";
import { Task } from "../models/task.models.js";
import { sendEmail } from "./emailService.js";
import { generateWeeklyTaskEmail } from "./generateStatusFormTemplate.js";
import { formatEmail } from "./formalEmail.js";

export const scheduleWeeklyStatusEmails = () => {
  // Runs every Monday at 9AM
  cron.schedule(
    process.env.TEST_MODE,
    async () => {
      console.log("📅 Running weekly status email job...");

      try {
        // Fetch tasks with overall status not Completed
        const tasks = await Task.find({ taskStatus: { $ne: "Completed" } });

        if (!tasks.length) {
          console.log("✅ No pending tasks found.");
          return;
        }

        // For each task, group action items by owner
        for (const task of tasks) {
          const ownerMap = {};

          task.actionItems.forEach((ai) => {
            if (!ownerMap[ai.owner]) ownerMap[ai.owner] = [];
            ownerMap[ai.owner].push(ai);
          });

          // Send email to each owner
          for (const [owner, actionItems] of Object.entries(ownerMap)) {
            // You may replace `email` with real email mapping if owner name ≠ email
            const email = formatEmail(owner);

            const htmlBody = generateWeeklyTaskEmail({
              assigneeName: owner,
              email,
              task,
            });
            try {
              await sendEmail(
                email, // Map owner name to email domain
                `Weekly Task Update: ${task.transcriptTitle}`,
                htmlBody
              );
              console.log(`📨 Email sent to ${email}`);
            } catch (err) {
              console.error(
                `❌ Failed to send email to ${email}:`,
                err.message
              );
            }
          }
        }
      } catch (err) {
        console.error("❌ Error in weekly status email job:", err);
      }
    },
    { timezone: "Asia/Kolkata" }
  );
};
