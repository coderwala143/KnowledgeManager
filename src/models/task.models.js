// models/task.js
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    //   reporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    //   assigneeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    reporterName: { type: String, required: true },
    assigneeName: { type: String, default: null },
    status: {
      type: String,
      enum: ["suggested", "todo", "in_progress", "done"],
      default: "suggested",
    },
    dueDate: { type: Date, default: null },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    source: { type: String, default: "meeting" },
    meetingCaptureId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MeetingCapture",
    },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

export { Task };
