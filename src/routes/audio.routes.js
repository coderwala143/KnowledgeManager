import express from "express";

import { uploadAudio } from "../controllers/audio.controllers.js";
import upload from "../utils/audioMulter.js";

const router = express.Router();

router.post("/upload-audio", upload.single("audio"), uploadAudio);

export default router;