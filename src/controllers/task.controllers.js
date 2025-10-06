import { generateTasksFromNotes } from "../services/task.services.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const createTaskFromTranscript = asyncHandler(async (req, res) => {
  const { id: transcriptId } = req.params;
  console.log("Transcript ID: ", req.params);
  const tasks = await generateTasksFromNotes(transcriptId);
  if (tasks.taskCreated === false) {
    throw new ApiError(tasks.status, tasks.message);
  }
  res
    .status(200)
    .json(new ApiResponse(200, tasks, "Tasks created from transcript notes"));
});

export { createTaskFromTranscript };
