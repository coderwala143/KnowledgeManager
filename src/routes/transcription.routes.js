import express from "express";
import { createTranscription } from "../controllers/transcription.controllers.js";
const router = express.Router();

router.post("/start", createTranscription);

export default router;