import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { startStream, stopStream, streamStatus } from "./src/utils/imouStream.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(cors({
  origin: "*", // pwede mong i-restrict later
  credentials: true
}));

// Serve HLS files
app.use("/streams", express.static(path.resolve("streams"), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith(".m3u8")) {
      res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
    } else if (filePath.endsWith(".ts")) {
      res.setHeader("Content-Type", "video/MP2T");
    }
  }
}));

// Stream routes
app.get("/streams/start-stream", startStream);
app.get("/streams/stop-stream", stopStream);
app.get("/streams/status", streamStatus);

const PORT = 4001;

app.listen(PORT, () => {
  console.log(`🎥 Stream server running on http://localhost:${PORT}`);
});