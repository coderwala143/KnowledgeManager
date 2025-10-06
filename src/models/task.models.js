// models/task.js
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    transcriptId: { type: mongoose.Schema.Types.ObjectId, ref: "Transcript" },
    title: { type: String, required: true },
    description: String,
    status: {
      type: String,
      enum: ["todo", "in_progress", "done"],
      default: "todo",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    dueDate: Date,
    assignedTo: { type: String }, // optionally extracted from text (“Ravi to fix bug”)
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

export { Task };
