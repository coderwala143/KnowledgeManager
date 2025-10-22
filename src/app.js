import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import audioRoutes from "./routes/audio.routes.js";
import transcriptionRoutes from "./routes/transcription.routes.js";
import taskRoutes from "./routes/task.routes.js";
import GrazittiRoutes from "./routes/grazittiRoutes.routes.js"
import { scheduleWeeklyStatusEmails } from "./utils/weeklyStatusMail.js";
import cors from "cors";
dotenv.config();
const app = express();
app.use(cors(
    {origin: "*"}
));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Welcome to the Knowledge Manager API");
});

app.use("/api/v1/auth", authRoutes)
app.use('/api/v1/upload', audioRoutes);
app.use('/api/v1/transcripts', transcriptionRoutes)
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/grazitti', GrazittiRoutes)

// Start the weekly email scheduler
scheduleWeeklyStatusEmails() 

app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        success: err.success || false,
        message: err.message || "Internal Server Error",
        errors: err.errors || [],
        stack: err.stack,
    });
})
export default app;