import express from "express";
import { createTranscription, getAllTranscripts, getTranscript } from "../controllers/transcription.controllers.js";
const router = express.Router();

router.post("/start", createTranscription);
router.get("/get-all-transcripts", getAllTranscripts)
router.get("/:id", getTranscript)

export default router;