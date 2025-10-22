import { sendEmail } from "../utils/emailService.js";
import { generateTaskEmailTemplate } from "../utils/generateTaskEmailTemplate.js";

const sendEmailToAssignee = async (emailList, task) => {
  if (!emailList?.length || !task?.actionItems?.length) {
    console.warn("No emails or action items found");
    return { success: false, message: "No emails or action items found" };
  }

  // Prepare parallel email sending promises
  const sendPromises = emailList.map(async (email) => {
    try {
      // Find all assigned items for this email
      const assignedItems = task.actionItems.filter((item) => {
        if (!item.owner || !email) return false;

        const emailName = email.split("@")[0].toLowerCase();
        const normalizedEmailName = emailName.replace(/\./g, "").trim();
        const normalizedOwner = item.owner
          .toLowerCase()
          .replace(/\s+/g, "")
          .trim();

        return normalizedOwner.includes(normalizedEmailName);
      });

      if (!assignedItems.length) {
        return {
          email,
          status: "skipped",
          message: "No matching action items found",
        };
      }

      // Generate email body
      const htmlBody = generateTaskEmailTemplate({
        owner: assignedItems[0].owner,
        taskTitle: task.title,
        task: assignedItems,
      });

      // Send email
      const result = await sendEmail(
        email,
        `New Task Assigned: ${task.title || "Task Notification"}`,
        htmlBody
      );

      return {
        email,
        status: "sent",
        messageId: result?.messageId || null,
      };
    } catch (error) {
      console.error(`Error sending mail to ${email}:`, error.message);
      return {
        email,
        status: "failed",
        error: error.message,
      };
    }
  });

  // Wait for all promises to resolve
  const results = await Promise.all(sendPromises);

  // Summarize results
  return {
    total: emailList.length,
    sent: results.filter((r) => r.status === "sent").length,
    failed: results.filter((r) => r.status === "failed").length,
    skipped: results.filter((r) => r.status === "skipped").length,
    details: results,
  };
};

export { sendEmailToAssignee };
