import app from "./src/app.js";

import { connectDB } from "./src/config/db.js";
import dotenv from "dotenv";
dotenv.config();
const HOST = '172.16.4.229'
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/knowledge_manager";

connectDB(MONGO_URI).then(() => {
  app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://172.16.4.229:${PORT}`);
  });
}).catch((error) => {
  console.error("Failed to connect to the database:", error);
});