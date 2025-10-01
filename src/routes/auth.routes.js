import express from "express";
import { googleAuthCallback, googleAuthUrl } from "../controllers/auth.controllers.js";
const router = express.Router();

router.get("/google", googleAuthUrl);
router.get("/google/callback", googleAuthCallback);

export default router;