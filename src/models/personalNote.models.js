import mongoose from "mongoose";    

const personalNoteSchema = new mongoose.Schema(
  {
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const PersonalNote = mongoose.model("PersonalNote", personalNoteSchema);

export { PersonalNote };