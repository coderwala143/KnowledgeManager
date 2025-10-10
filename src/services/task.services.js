import { Task } from "../models/task.models.js";
import { Transcript } from "../models/transcript.models.js";

const generateTasksFromNotes = async (transcript) => {
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

  if (!transcript || transcript.notes?.actionItems?.length === 0) {
    return {
      taskCreated: false,
      message: "No action items found in notes",
      status: 400,
    };
  }

  const tasks = [];
  for (const item of transcript.notes.actionItems) {
    const task = new Task({
      userId: transcript.userId,
      transcriptId: transcript._id,
      owner: item.owner,
      title: item.taskTitle,
      description: item.task.join(" "),
      task: item.task,
      priority: item.Priority || "medium",
      dueDate: item.DueDate,
    });
    await task.save();
    tasks.push(task);
  }
  return tasks;
};

export { generateTasksFromNotes };
