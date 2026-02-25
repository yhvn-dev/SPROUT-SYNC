import express from "express";
import { startStream, stopStream, streamStatus } from "../../utils/imouStream.js";
import { verifyAccessToken } from "../../middlewares/authMiddleware.js";


const router = express.Router();

    router.get("/start-stream",verifyAccessToken,startStream);
    router.get("/stop-stream",verifyAccessToken,stopStream);
    router.get("/status",verifyAccessToken,streamStatus);

export default router;