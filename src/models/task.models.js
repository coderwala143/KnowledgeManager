// models/task.js
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    transcriptId: { type: mongoose.Schema.Types.ObjectId, ref: "Transcript" },
    owner: { type: String }, // extracted from action item
    taskTitle: { type: String }, // extracted from action item
    task: [String], // extracted from action item
    priority: { type: String }, // extracted from action item
    dueDate: { type: String, default: null }, // extracted from action item
    status: {
      type: String,
      enum: ["todo", "in_progress", "done"],
      default: "todo",
    },
      
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

export { Task };
