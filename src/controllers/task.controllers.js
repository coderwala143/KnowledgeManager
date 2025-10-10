import { Task } from "../models/task.models.js";
import { generateTasksFromNotes } from "../services/task.services.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// const createTaskFromTranscript = asyncHandler(async (req, res) => {
//   const { id: transcriptId } = req.params;
//   console.log("Transcript ID: ", req.params);
//   const tasks = await generateTasksFromNotes(transcriptId);
//   if (tasks.taskCreated === false) {
//     throw new ApiError(tasks.status, tasks.message);
//   }
//   res
//     .status(200)
//     .json(new ApiResponse(200, tasks, "Tasks created from transcript notes"));
// });

const getAllTasks = asyncHandler(async(req, res) => {
    const transcriptId = req.params.id;
    if (!transcriptId) {
        throw new ApiError(400, "Transcript id required");
    }

    const tasks = await Task.find({ transcriptId }).populate('transcriptId')
    if (!tasks || tasks.length === 0) {
        throw new ApiError(404, "No tasks found for this transcript");
    }
    res.status(200).json(new ApiResponse(200, tasks, "Tasks fetched successfully"));
})

export { getAllTasks };
