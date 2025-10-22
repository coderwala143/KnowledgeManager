import { Task } from "../models/task.models.js";
import { Transcript } from "../models/transcript.models.js";

const generateTasksFromNotes = async (transcript, notes) => {
  if (!transcript) {
    return {
      taskCreated: false,
      message: "Transcript not found",
      status: 404,
    };
  }
  if (transcript.status !== "completed") {
    return {
      taskCreated: false,
      message: "Transcript not completed yet",
      status: 400,
    };
  }
  const task = await Task.findOne({ transcriptId: transcript._id });
  if (task) {
    return {
      taskCreated: false,
      message: "Tasks already generated for this transcript",
      status: 409,
    };
  }
  const newTask = new Task({
    userId: transcript.userId,
    transcriptId: transcript._id,
    transcriptTitle: transcript.transcriptTitle,
    actionItems: notes,
  });
  await newTask.save();
  return newTask;
};

export { generateTasksFromNotes };
