import app from "./src/app.js";

import { connectDB } from "./src/config/db.js";
import dotenv from "dotenv";
dotenv.config();
// const HOST = '172.16.5.3'
const HOST = '10.49.33.16'
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/knowledge_manager";

connectDB(MONGO_URI).then(() => {
  app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://172.16.5.3:${PORT}`);
  });
}).catch((error) => {
  console.error("Failed to connect to the database:", error);
});