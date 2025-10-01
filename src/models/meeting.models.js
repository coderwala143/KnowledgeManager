import mongoose, { Mongoose } from "mongoose";

const meetingCaptureSchema = new mongoose.Schema(
  {
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    source: {
        type: String,
        enum: ['zoom','teams','meet','webex','other'], 
        default: 'other' 
    },
    audioUrl: {
        type: String,
    },
    transcriptId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transcript',        
    },
    notesId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Notes',
    },
    status: { 
        type: String, 
        enum: ['capturing','uploaded','processed'], 
        default: 'capturing' 
    }
  },
  { timestamps: true }
);

const MeetingCapture = mongoose.model("MeetingCapture", meetingCaptureSchema);

export { MeetingCapture };