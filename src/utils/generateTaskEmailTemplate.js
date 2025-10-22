const BASE_URL = process.env.SERVER_URL || "http://localhost:5000";
console.log(BASE_URL)
const generateTaskEmailTemplate = (task, managerName) => {
  return `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; color: #333; background-color: #f7f9fc; padding: 20px;">
    <div style="max-width: 700px; margin: 0 auto; background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">

      <!-- Header -->
      <div style="background-color: #0056b3; padding: 20px 30px; display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center;">
          <img src="${BASE_URL}/images/logo.png" alt="Knowledge Manager" style="height: 38px; margin-right: 12px;" />
          <h2 style="color: white; margin: 0; font-weight: 600;">Task Assignment Notification</h2>
        </div>
      </div>

      <!-- Body -->
      <div style="padding: 30px;">
        <p style="font-size: 16px;">Dear <strong>${task.owner}</strong>,</p>

        <p style="font-size: 15px; line-height: 1.6;">
          You have been assigned new action items under the task:
          <strong style="color: #0056b3;">${task.taskTitle || "Unnamed Task"}</strong>.
        </p>

        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr style="background-color: #e9f1fb; text-align: left;">
              <th style="padding: 10px; border: 1px solid #d0d7e3;">#</th>
              <th style="padding: 10px; border: 1px solid #d0d7e3;">Task Name</th>
              <th style="padding: 10px; border: 1px solid #d0d7e3;">Priority</th>
              <th style="padding: 10px; border: 1px solid #d0d7e3;">Due Date</th>
              <th style="padding: 10px; border: 1px solid #d0d7e3;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${task.task
              .map(
                (t, i) => `
                <tr style="background-color: ${i % 2 === 0 ? "#fff" : "#f7faff"};">
                  <td style="padding: 10px; border: 1px solid #d0d7e3;">${i + 1}</td>
                  <td style="padding: 10px; border: 1px solid #d0d7e3; font-weight: 800;">${t.taskName}</td>
                  <td style="padding: 10px; border: 1px solid #d0d7e3;">${t.Priority}</td>
                  <td style="padding: 10px; border: 1px solid #d0d7e3;">${t.DueDate}</td>
                  <td style="padding: 10px; border: 1px solid #d0d7e3; text-transform: capitalize;">${t.status}</td>
                </tr>
              `
              )
              .join("")}
          </tbody>
        </table>

        <p style="margin-top: 24px; font-size: 15px;">
          Please ensure timely completion of the above tasks. If you have any questions or need clarification, feel free to reach out.
        </p>

        <p style="margin-top: 20px; font-size: 15px;">
          Best regards,<br>
          <strong>${managerName || "Manager"}</strong><br>
          <span style="color: #555;">Grazitti Interactive</span><br>
          <a href="https://www.grazitti.com" style="color: #0056b3; text-decoration: none;">www.grazitti.com</a>
        </p>
      </div>

      <!-- Footer -->
      <div style="background-color: #f1f3f6; padding: 16px; text-align: center; font-size: 12px; color: #888;">
        <p style="margin: 0;">This is an automated email from the Grazitti Task Management System.</p>
      </div>
    </div>
  </div>
  `;
};


export { generateTaskEmailTemplate }