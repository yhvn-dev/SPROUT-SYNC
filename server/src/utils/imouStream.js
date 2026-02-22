import { exec, spawn } from "child_process";
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

const streamsDir = path.resolve(__dirname, "../../streams/");
const outputPath = path.join(streamsDir, "stream.m3u8");


// Ensure folder exists
if (!fs.existsSync(streamsDir)) {
  fs.mkdirSync(streamsDir, { recursive: true });
}

/* ===============================
   CLEAN OLD FILES
================================ */

const cleanOldSegments = () => {
  try {
    const files = fs.readdirSync(streamsDir);
    for (const file of files) {
      if (file.endsWith(".ts") || file.endsWith(".m3u8")) {
        fs.unlinkSync(path.join(streamsDir, file));
      }
    }
    console.log("🧹 Old segments cleaned");
  } catch (err) {
    console.error("Cleanup error:", err.message);
  }
};

/* ===============================
   FFMPEG PROCESS HOLDER
================================ */
let ffmpegProcess = null;
let ffmpegPid = null;

/* ===============================
   KILL FFMPEG (Windows + Unix)
================================ */
const killFFmpeg = () => {
  return new Promise((resolve) => {
    if (!ffmpegProcess && !ffmpegPid) return resolve();

    const pid = ffmpegPid;

    // Clear refs immediately
    ffmpegProcess = null;
    ffmpegPid = null;

    if (process.platform === "win32") {
      // Windows — taskkill force kills the entire process tree
      exec(`taskkill /PID ${pid} /T /F`, (err) => {
        if (err) console.warn("taskkill warning:", err.message);
        else console.log(`🛑 FFmpeg process ${pid} killed (Windows)`);
        resolve();
      });
    } else {
      // Linux / Mac
      try {
        process.kill(pid, "SIGKILL");
        console.log(`🛑 FFmpeg process ${pid} killed (Unix)`);
      } catch (err) {
        console.warn("Kill warning:", err.message);
      }
      resolve();
    }
  });
};

/* ===============================
   START STREAM
================================ */
export const startStream = (req, res) => {
  if (ffmpegProcess) {
    return res.json({ message: "Stream already running ✅" });
  }

  cleanOldSegments();

  const ffmpegArgs = [
    "-rtsp_transport", "tcp",
    "-fflags", "+genpts",
    "-i", rtspUrl,
    "-map", "0:v:0",
    "-map", "0:a?",
    "-c:v", "libopenh264",
    "-g", "48",
    "-c:a", "aac",
    "-ar", "16000",
    "-f", "hls",
    "-hls_time", "2",
    "-hls_list_size", "5",
    "-hls_flags", "delete_segments+append_list",
    outputPath
  ];

  // Use spawn instead of exec — better process control
  ffmpegProcess = spawn("ffmpeg", ffmpegArgs);
  ffmpegPid = ffmpegProcess.pid;

  console.log(`✅ FFmpeg started with PID: ${ffmpegPid}`);

  ffmpegProcess.stdout?.on("data", (data) => {
    console.log(`FFmpeg: ${data}`);
  });

  ffmpegProcess.stderr?.on("data", (data) => {
    console.log(`FFmpeg: ${data}`);
  });

  ffmpegProcess.on("close", (code) => {
    console.log(`FFmpeg exited with code ${code}`);
    ffmpegProcess = null;
    ffmpegPid = null;
  });

  ffmpegProcess.on("error", (err) => {
    console.error("FFmpeg error:", err.message);
    ffmpegProcess = null;
    ffmpegPid = null;
  });

  return res.json({ message: "Stream started ✅" });
};

/* ===============================
   STOP STREAM
================================ */
export const stopStream = async (req, res) => {
  if (!ffmpegProcess) {
    return res.json({ message: "No stream running ❌" });
  }

  try {
    await killFFmpeg();

    // Wait a moment before cleaning files so FFmpeg fully releases them
    setTimeout(() => {
      cleanOldSegments();
      console.log("🧹 Stream files cleaned after stop");
    }, 1000);

    return res.json({ message: "Stream stopped 🛑" });
  } catch (err) {
    console.error("Stop stream error:", err.message);
    return res.status(500).json({ message: "Failed to stop stream", error: err.message });
  }
};





/* ===============================
   STREAM STATUS
================================ */
export const streamStatus = (req, res) => {
  return res.json({
    running: Boolean(ffmpegProcess),
    message: ffmpegProcess ? "Stream is running ✅" : "Stream is stopped ❌",
  });
};