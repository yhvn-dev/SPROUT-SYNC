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
      exec(`taskkill /PID ${pid} /T /F`, (err) => {
        if (err) console.warn("taskkill warning:", err.message);
        else console.log(`🛑 FFmpeg process ${pid} killed (Windows)`);
        resolve();
      });
    } else {
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

  // Verify env vars are loaded
  if (!process.env.IMOU_USER || !process.env.IMOU_PASS || !process.env.IMOU_IP) {
    console.error("❌ Missing IMOU env variables!");
    return res.status(500).json({ message: "Missing camera credentials in .env" });
  }

  console.log(`📡 Connecting to RTSP: rtsp://${process.env.IMOU_USER}:***@${process.env.IMOU_IP}:554/...`);
  console.log(`📁 Output path: ${outputPath}`);

  // Ensure streams dir exists (in case it was deleted)
  if (!fs.existsSync(streamsDir)) {
    fs.mkdirSync(streamsDir, { recursive: true });
    console.log("📁 Streams directory recreated");
  }

  cleanOldSegments();

  const ffmpegArgs = [
    "-y",
    "-rtsp_transport", "tcp",
    "-fflags", "+genpts+discardcorrupt",
    "-use_wallclock_as_timestamps", "1",
    "-i", rtspUrl,
    "-map", "0:v:0",
    "-c:v", "libx264",
    "-preset", "ultrafast",
    "-tune", "zerolatency",
    "-profile:v", "baseline",
    "-level", "3.1",
    "-g", "30",
    "-keyint_min", "30",
    "-sc_threshold", "0",
    "-b:v", "1500k",
    "-maxrate", "1500k",
    "-bufsize", "3000k",
    "-an",
    "-f", "hls",
    "-hls_time", "2",
    "-hls_list_size", "5",
    "-hls_flags", "delete_segments+append_list+independent_segments",
    "-hls_segment_filename", path.join(streamsDir, "segment%03d.ts"),
    outputPath,
];


  ffmpegProcess = spawn("ffmpeg", ffmpegArgs, {
    detached: false,
    stdio: ["ignore", "pipe", "pipe"],
  });

  ffmpegPid = ffmpegProcess.pid;

  if (!ffmpegPid) {
    console.error("❌ FFmpeg failed to spawn — is ffmpeg installed?");
    ffmpegProcess = null;
    return res.status(500).json({ message: "FFmpeg failed to start. Is ffmpeg installed and in PATH?" });
  }

  console.log(`✅ FFmpeg started with PID: ${ffmpegPid}`);

  ffmpegProcess.stdout?.on("data", (data) => {
    console.log(`[FFmpeg STDOUT]: ${data.toString().trim()}`);
  });

  ffmpegProcess.stderr?.on("data", (data) => {
    const msg = data.toString().trim();
    console.log(`[FFmpeg STDERR]: ${msg}`);

    // Detect common errors and log clearly
    if (msg.includes("Connection refused")) {
      console.error("❌ RTSP Connection refused — check camera IP and port");
    } else if (msg.includes("401") || msg.includes("Unauthorized")) {
      console.error("❌ RTSP Auth failed — check IMOU_USER and IMOU_PASS");
    } else if (msg.includes("No such file or directory")) {
      console.error("❌ Output path issue — check streams directory permissions");
    } else if (msg.includes("Opening") && msg.includes(".m3u8")) {
      console.log("✅ HLS playlist created successfully!");
    } else if (msg.includes("segment")) {
      console.log("📦 Segment being written...");
    }
  });

  ffmpegProcess.on("close", (code) => {
    console.log(`⚠️ FFmpeg exited with code: ${code}`);
    if (code !== 0 && code !== null) {
      console.error("❌ FFmpeg crashed — review STDERR logs above for the cause");
    }
    ffmpegProcess = null;
    ffmpegPid = null;
  });

  ffmpegProcess.on("error", (err) => {
    if (err.code === "ENOENT") {
      console.error("❌ FFmpeg not found — install ffmpeg and make sure it's in your PATH");
    } else {
      console.error("FFmpeg spawn error:", err.message);
    }
    ffmpegProcess = null;
    ffmpegPid = null;
  });

  return res.json({
    message: "Stream started ✅",
    pid: ffmpegPid,
    outputPath,
  });
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
  const segmentFiles = fs.existsSync(streamsDir)
    ? fs.readdirSync(streamsDir).filter((f) => f.endsWith(".ts"))
    : [];

  return res.json({
    running: Boolean(ffmpegProcess),
    pid: ffmpegPid || null,
    segmentCount: segmentFiles.length,
    segments: segmentFiles,
    outputPath,
    message: ffmpegProcess ? "Stream is running ✅" : "Stream is stopped ❌",
  });
};