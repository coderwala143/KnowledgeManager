import express from "express";
import { getRecentTranscripts, getTranscript } from "../controllers/transcription.controllers.js";
const router = express.Router();

router.get("/", getRecentTranscripts)
router.get("/:id", getTranscript)

export default router;