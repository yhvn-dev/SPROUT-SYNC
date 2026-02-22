import express from "express";
import { startStream, stopStream, streamStatus } from "../../utils/imouStream.js";

const router = express.Router();

    router.get("/start-stream", startStream);
    router.get("/stop-stream", stopStream);
    router.get("/status", streamStatus);

export default router;