import GrazittiUser from "../models/grazittiUsers.models.js";
import { Task } from "../models/task.models.js";
import { sendEmailToAssignee } from "../services/sendEmailToAssignee.services.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

// Route: GET /api/users?query=<name>
const getGrazittiUserInfo = asyncHandler(async (req, res) => {
  const { query } = req.query;

  if (!query || query.trim() === "") {
    return res.status(400).json({ message: "Query parameter is required" });
  }

  // Case-insensitive regex for partial matches
  const regex = new RegExp("^" + query, "i");

  // Search by name OR email OR reporting_manager
  const users = await GrazittiUser.find({
    $or: [{ email: { $regex: regex } }, { name: { $regex: regex } }],
  })
    .limit(5) // limit to 5 results for fast autocomplete-like response
    .select("name email reporting_manager"); // return only essential fields

  res.status(200).json(users);
});

const sendEmail = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const emailList = req.body;
  const task = await Task.findById(id)
  if(!task){
    throw new ApiError(404, "Task Not found!")
  }
  let result = await sendEmailToAssignee(emailList, task)
  console.log("Result - ",result)
  res.json(result);
});

export { getGrazittiUserInfo, sendEmail };
