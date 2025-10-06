import express from "express";
import { createTaskFromTranscript } from "../controllers/task.controllers.js";

const router = express.Router();
router.post("/from-transcript/:id", createTaskFromTranscript);

export default router;