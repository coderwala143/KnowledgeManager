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

const getAllTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({});
  if (!tasks || tasks.length == 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, tasks, "No task has created!"));
  }
  res
    .status(200)
    .json(new ApiResponse(200, tasks, "Tasks fetched successfully"));
});

const getParticularTasks = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(400, "Task id required");
  }
  const task = await Task.findById(id);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }
  res.status(200).json(new ApiResponse(200, task, "Task fetched successfully"));
});

const updateTaskItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  console.log("Incoming Task Data:", data.actionItems);

  // 1️⃣ Validate params
  if (!id) throw new ApiError(400, "Task ID is required");

  // 2️⃣ Find the task
  const task = await Task.findById(id);
  if (!task) throw new ApiError(404, "Task not found");

  task.actionItems = data.actionItems;

  await task.save();

  // 9️⃣ Respond with success
  res.status(200).json(new ApiResponse(200, task, "Task updated successfully"));
});

const updateSubtaskStatus = asyncHandler(async (req, res) => {
  const {
    taskId,
    owner,
    actionItem,
    subtaskIndex,
    status: newStatus,
    reason,
  } = req.body;

  console.log('body - ',req.body)

  if (!taskId || !owner || !actionItem || subtaskIndex == null || !newStatus)
    throw new ApiError(400, "Missing required fields");

  // 1️⃣ Fetch task
  const taskDoc = await Task.findById(taskId);
  if (!taskDoc) throw new ApiError(404, "Task not found");

  // 2️⃣ Locate action item index
  const aiIndex = taskDoc.actionItems.findIndex(
    (ai) => ai.owner === owner && ai.taskTitle === actionItem
  );
  if (aiIndex === -1) throw new ApiError(404, "Action item not found");

  // 3️⃣ Locate and update subtask
  const subtask = taskDoc.actionItems[aiIndex].task[subtaskIndex];
  if (!subtask) throw new ApiError(404, "Subtask not found");

  subtask.status = newStatus;
  if (reason) subtask.reason = reason;

  // Mark the nested array as modified (🔥 Important)
  taskDoc.markModified(`actionItems.${aiIndex}.task.${subtaskIndex}.status`);
  if (reason) taskDoc.markModified(`actionItems.${aiIndex}.task.${subtaskIndex}.reason`);

  // 4️⃣ Recalculate overall task status
  const allCompleted = taskDoc.actionItems.every((ai) =>
    ai.task.every((t) => t.status === "completed")
  );
  taskDoc.taskStatus = allCompleted ? "completed" : "pending";

  // Mark top-level taskStatus as modified as well
  taskDoc.markModified("taskStatus");

  // 5️⃣ Save
  await taskDoc.save();

  // 6️⃣ Refetch for verification
  const updatedTask = await Task.findById(taskId);
  const updatedSubtask =
    updatedTask.actionItems[aiIndex].task[subtaskIndex];

  console.log("✅ Updated subtask:", updatedSubtask);

  res.status(200).json(
    new ApiResponse(200, updatedTask, "Subtask status updated successfully")
  );
});



export { getAllTasks, getParticularTasks, updateTaskItem, updateSubtaskStatus };
