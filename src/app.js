import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import audioRoutes from "./routes/audio.routes.js";
import transcriptionRoutes from "./routes/transcription.routes.js";
import taskRoutes from "./routes/task.routes.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Welcome to the Knowledge Manager API");
});


// Test route to verify Supabase connection
// app.get('/api/test-supabase', async (req, res) => {
//   try {
//     // Example: list buckets (requires service key)
//     const { data, error } = await supabase.storage.listBuckets();
//     console.log(data);
//     if (error) throw error;
//     res.json({ success: true, buckets: data });
//   } catch (err) {
//     console.error('Supabase test failed:', err.message);
//     res.status(500).json({ success: false, error: err.message });
//   }
// });


app.use("/api/v1/auth", authRoutes)
app.use('/api/v1/audio', audioRoutes);
app.use('/api/v1/transcription', transcriptionRoutes)
app.use('/api/v1/task', taskRoutes);

app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        success: err.success || false,
        message: err.message || "Internal Server Error",
        errors: err.errors || [],
        stack: err.stack,
    });
})
export default app;