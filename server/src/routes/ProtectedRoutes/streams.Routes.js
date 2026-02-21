import express from "express";
import { startStream, stopStream, streamStatus } from "../../streams/imouStreams.js";

const router = express.Router();

// Start / Stop / Status endpoints
router.get("/start-stream", startStream);
router.get("/stop-stream", stopStream);
router.get("/status", streamStatus);

export default router;