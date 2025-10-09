import express from "express";

import { uploadFiles } from "../controllers/uploads.controllers.js";
import upload from "../utils/audioMulter.js";
import { createTranscription } from "../controllers/transcription.controllers.js";

const router = express.Router();

router.post("/upload-audio", upload.single("audio"), uploadFiles, createTranscription);

export default router;