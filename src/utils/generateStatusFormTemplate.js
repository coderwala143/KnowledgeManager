// import jwt from "jsonwebtoken";
import { generateGoogleFormLink } from "./generateGoogleFormLink.js";


// export const generateStatusEmailTemplate = (task, actionItems, ownerName) => {
//   console.log("task - ", task);
//   const rows = actionItems
//     .map((ai) => {
//       const subtaskRows = ai.task
//         .map((t, idx) => {
//           const token = jwt.sign(
//             {
//               taskId: task._id,
//               owner: ownerName,
//               actionItem: ai.taskTitle,
//               subtaskIndex: idx,
//             },
//             process.env.JWT_SECRET,
//             { expiresIn: "1d" } // Link valid for 7 days
//           );


//           const updateUrl = `http://localhost:5173/update-status?token=${token}`;

//           //   const updateUrl = `http://172.16.5.3:5656/api/v1/tasks/update-status?token=${token}`;
//           const dueDate = new Date(t.DueDate).toLocaleDateString();
//           return `
//             <tr>
//               <td>${t.taskName}</td>
//               <td>${t.Priority}</td>
//               <td>${dueDate}</td>
//               <td>${t.status}</td>
//               <td><a href="${updateUrl}" style="color:#fff;background:#007bff;padding:6px 12px;border-radius:5px;text-decoration:none;">Update</a></td>
//             </tr>`;
//         })
//         .join("");

//       return `
//         <tr>
//           <td colspan="5" style="background:#f0f0f0;font-weight:bold;">Action Item: ${ai.taskTitle}</td>
//         </tr>
//         ${subtaskRows}`;
//     })
//     .join("");

//   return `
//     <div style="font-family:Arial, sans-serif; color:#333;">
//       <h2>Weekly Task Reminder</h2>
//       <p>Hi ${ownerName},</p>
//       <p>Please review your assigned tasks for "${task.transcriptTitle}":</p>
//       <table border="1" cellspacing="0" cellpadding="6" style="border-collapse:collapse;width:100%;">
//         <thead>
//           <tr style="background:#ddd;">
//             <th>Task</th>
//             <th>Priority</th>
//             <th>Due Date</th>
//             <th>Status</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           ${rows}
//         </tbody>
//       </table>
//       <p style="margin-top:12px;">This reminder will stop automatically once the overall task is marked "Completed".</p>
//     </div>`;
// };


const generateWeeklyTaskEmail = ({ assigneeName, email, task }) => {
  let tasksHtml = "";

  // Loop through each subtask to generate individual links
  task.actionItems.forEach(ai => {
    if (ai.owner.toLowerCase() === assigneeName.toLowerCase()) {
      ai.task.forEach(subtask => {
        if (subtask.status !== "completed") {
          const formLink = generateGoogleFormLink({
            email,
            taskId: task._id,
            taskTitle: ai.taskTitle,
            status: subtask.status
          });

          tasksHtml += `
            <li style="margin-bottom:12px;">
              <strong>${subtask.taskName}</strong> — Due: ${subtask.DueDate || "N/A"}<br>
              Status: ${subtask.status}<br>
              <a href="${formLink}" 
                 style="display:inline-block; margin-top:5px; background:#007bff; color:white; padding:8px 16px; border-radius:4px; text-decoration:none;">
                 Update Status
              </a>
            </li>
          `;
        }
      });
    }
  });

  return `
    <div style="font-family:Arial,sans-serif; color:#333;">
      <img src="https://yourdomain.com/logo.png" alt="Company Logo" style="width:120px; margin-bottom:20px;">
      <h3>Hello ${assigneeName},</h3>
      <p>You have the following action items pending. Please update their status by clicking the "Update Status" button:</p>
      <ul style="list-style-type:none; padding-left:0;">
        ${tasksHtml || "<li>No pending tasks!</li>"}
      </ul>
      <p>Thanks,<br>Project Manager</p>
    </div>
  `;
}

export { generateWeeklyTaskEmail}