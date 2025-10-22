import express from "express";
import { getAllTasks, getParticularTasks, updateSubtaskStatus, updateTaskItem } from "../controllers/task.controllers.js";

const router = express.Router();

router.get("/", getAllTasks);
router.put("/update-status", updateSubtaskStatus);
router.get("/:id", getParticularTasks);
router.put("/:id", updateTaskItem)

export default router;