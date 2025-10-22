// models/task.js
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    transcriptId: { type: mongoose.Schema.Types.ObjectId, ref: "Transcript" },
    transcriptTitle: { type: String },
    actionItems: [
        // {
        //     // item1
        // },
        // {
        //     // item2
        // }
    ],
    taskStatus: {
        type: String,
        enum: ["pending", "in Progress", "completed"],
        default: "pending"
    }
}, { timestamps: true });

const Task = mongoose.model("Task", taskSchema);

export { Task };
