import mongoose from "mongoose";
const noteSchema = new mongoose.Schema(
  {
    meetingCauptureId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MeetingCapture",
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
        type: String,
        required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    transcriptId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transcript",
    },
    generatedTaskIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    status: {
      type: String,
      enum: ["draft", "finalized"],
      default: "draft",
    },
  },
  { timestamps: true }
);
