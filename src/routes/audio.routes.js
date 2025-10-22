import express from "express";

import { uploadFiles } from "../controllers/uploads.controllers.js";
import upload from "../utils/audioMulter.js";
import { createTranscript } from "../controllers/transcription.controllers.js";

const router = express.Router();

router.post("/file", upload.single("file"), uploadFiles, createTranscript);

export default router;
