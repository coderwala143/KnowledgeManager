import { Task } from "../models/task.models.js";
import { Transcript } from "../models/transcript.models.js";

const generateTasksFromNotes = async (transcriptId) => {
  const transcript = await Transcript.findById(transcriptId);
  console.log("Transcript found: ", transcript);
  if(!transcript) {
    return {
        taskCreated: false,
        message: "Transcript not found",
        status: 404
    }
  }
  if(transcript.status !== "completed") {
    return {
        taskCreated: false,
        message: "Transcript not completed yet",
        status: 400
    }
  }
  const task = await Task.findOne({ transcriptId });
  if(task) {
    return {
        taskCreated: false,
        message: "Tasks already generated for this transcript",
        status: 409
    }
  }

  if (!transcript || !transcript.notes?.actionItems?.length) {
    return {
        taskCreated: false,
        message: "No action items found in notes",
        status: 400
    }
  }

  const tasks = [];
  for (const item of transcript.notes.actionItems) {
    // Basic text clean-up
    const title = item.trim();

    // Simple heuristic: detect assigned person if present (“Ravi to fix login bug”)
    const match = title.match(/^([A-Z][a-z]+)\s+to\s+(.*)$/);
    const assignedTo = match ? match[1] : null;
    const taskTitle = match ? match[2] : title;

    const task = new Task({
      userId: transcript.userId,
      transcriptId,
      title: taskTitle,
      assignedTo,
    });

    await task.save();
    tasks.push(task);
  }
  return tasks;
};

export { generateTasksFromNotes };