import express from "express";

const router = express.Router()

import { getGrazittiUserInfo, sendEmail } from "../controllers/grazittiUsersInfo.controllers.js";

router.get("/users", getGrazittiUserInfo)
router.post("/mail/:id", sendEmail)

export default router;
