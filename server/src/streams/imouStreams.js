import { exec } from "child_process";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";
import { fileURLToPath } from "url";

/* ===============================
   FIX __dirname FOR ES MODULES
================================ */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ===============================
   LOAD ENV VARIABLES
================================ */
dotenv.config({
  path: path.resolve(__dirname, "./../../.env"),
});

/* ===============================
   RTSP URL (IMOU)
================================ */
const rtspUrl = `rtsp://${process.env.IMOU_USER}:${process.env.IMOU_PASS}@${process.env.IMOU_IP}:554/cam/realmonitor?channel=1&subtype=0`;

/* ===============================
   STREAMS DIRECTORY
================================ */
const streamsDir = path.resolve(__dirname, "../streams");
const outputPath = path.join(streamsDir, "stream.m3u8");

// Ensure folder exists
if (!fs.existsSync(streamsDir)) {
  fs.mkdirSync(streamsDir, { recursive: true });
}

/* ===============================
   CLEAN OLD FILES
================================ */
const cleanOldSegments = () => {
  const files = fs.readdirSync(streamsDir);
  for (const file of files) {
    if (file.endsWith(".ts") || file.endsWith(".m3u8")) {
      fs.unlinkSync(path.join(streamsDir, file));
    }
  }
};

/* ===============================
   FFMPEG PROCESS HOLDER
================================ */
let ffmpegProcess = null;




/* ===============================
   START STREAM
================================ */
export const startStream = (req, res) => {
  if (ffmpegProcess) {
    return res.json({ message: "Stream already running ✅" });
  }

  cleanOldSegments();

  const ffmpegCommand = `
    ffmpeg -rtsp_transport tcp -fflags +genpts
    -i "${rtspUrl}"
    -map 0:v:0 -map 0:a?
    -c:v libopenh264
    -g 48
    -c:a aac -ar 16000
    -f hls
    -hls_time 2
    -hls_list_size 5
    -hls_flags delete_segments+append_list
    "${outputPath}"
  `.replace(/\s+/g, " ").trim();

  ffmpegProcess = exec(ffmpegCommand);

  ffmpegProcess.stdout?.on("data", (data) => {
    console.log(`FFmpeg: ${data}`);
  });

  ffmpegProcess.stderr?.on("data", (data) => {
    console.log(`FFmpeg: ${data}`);
  });

  ffmpegProcess.on("close", (code) => {
    console.log(`❌ FFmpeg exited with code ${code}`);
    ffmpegProcess = null;
  });

  console.log("✅ IMOU HLS stream started (OpenH264)");
  return res.json({ message: "Stream started ✅" });
};

/* ===============================
   STOP STREAM
================================ */
export const stopStream = (req, res) => {
  if (!ffmpegProcess) {
    return res.json({ message: "No stream running ❌" });
  }

  ffmpegProcess.kill("SIGINT");
  ffmpegProcess = null;

  console.log("🛑 IMOU HLS stream stopped");
  return res.json({ message: "Stream stopped 🛑" });
};




/* ===============================
   STREAM STATUS
================================ */
export const streamStatus = (req, res) => {
  return res.json({
    running: Boolean(ffmpegProcess),
    message: ffmpegProcess
      ? "Stream is running ✅"
      : "Stream is stopped ❌",
  });
};