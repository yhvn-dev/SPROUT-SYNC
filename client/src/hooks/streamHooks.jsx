import { useEffect, useState, useRef, useCallback } from "react";
import Hls from "hls.js";
import { startStream, stopStream, getStreamsStatus } from "../data/streamServices";

const STREAM_URL = `${import.meta.env.VITE_API_URL}/streams/stream.m3u8`;

// ===============================
// Wait until .m3u8 has real segments
// ===============================
const waitForStream = async (maxRetries = 20, interval = 2000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await fetch(`${STREAM_URL}?nocache=${Date.now()}`);
      if (res.ok) {
        const text = await res.text();
        if (text.includes("#EXTM3U") && text.includes("#EXTINF")) {
          console.log(`✅ Stream ready after ${i + 1} attempt(s)`);
          return true;
        }
      }
    } catch (err) {
      console.warn(`⏳ Attempt ${i + 1} failed:`, err.message);
    }
    console.log(`⏳ Waiting for stream segments... ${i + 1}/${maxRetries}`);
    await new Promise(resolve => setTimeout(resolve, interval));
  }
  throw new Error("Stream did not become ready in time.");
};

// ===============================
// Hook: useStream
// ===============================
export const useStream = () => {
  const [running, setRunning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  // ===============================
  // Initialize HLS when running = true
  // ===============================
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Cleanup previous HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (!running) {
      video.pause();
      video.removeAttribute("src");
      video.load();
      return;
    }

    // Safari native HLS
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = `${STREAM_URL}?nocache=${Date.now()}`;
      video.play().catch(err => console.warn("Autoplay blocked:", err));
      return;
    }

    // HLS.js fallback
    if (!Hls.isSupported()) {
      setError("HLS not supported in this browser.");
      return;
    }

    const hls = new Hls({
      lowLatencyMode: true,
      liveSyncDurationCount: 3,
      liveMaxLatencyDurationCount: 6,
      maxBufferLength: 10,
      backBufferLength: 30,
      enableWorker: true,
    });

    hlsRef.current = hls;
    hls.loadSource(`${STREAM_URL}?nocache=${Date.now()}`);
    hls.attachMedia(video);

    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      video.play().catch(err => console.warn("Autoplay blocked:", err));
    });

    hls.on(Hls.Events.ERROR, (event, data) => {
      console.error("HLS ERROR:", data);
      if (data.fatal) {
        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          console.warn("🔁 HLS network error, retrying...");
          hls.startLoad();
        } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
          console.warn("🔁 HLS media error, recovering...");
          hls.recoverMediaError();
        } else {
          setError("Stream error. Try restarting.");
          hls.destroy();
          hlsRef.current = null;
          setRunning(false);
        }
      }
    });

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [running]);

  // ===============================
  // Fetch initial status on mount
  // ===============================
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await getStreamsStatus();
        setRunning(res.data.running);
      } catch (err) {
        console.error("Stream status error:", err);
      }
    };
    fetchStatus();
  }, []);

  // ===============================
  // Start Stream
  // ===============================
  const start = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Tell backend to start FFmpeg
      await startStream();
      console.log("▶️ FFmpeg started, waiting for segments...");

      // 2. Wait until .m3u8 actually has segments
      await waitForStream();

      // 3. Stream ready → display video
      setRunning(true);
      console.log("✅ Stream running");

    } catch (err) {
      console.error("Start stream error:", err);
      setError("Failed to start stream. Check camera or FFmpeg.");
      setRunning(false);
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // Stop Stream
  // ===============================
  const stop = async () => {
    try {
      setLoading(true);
      setError(null);

      await stopStream();

      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }

      setRunning(false);
      console.log("🛑 Stream stopped");

    } catch (err) {
      console.error("Stop stream error:", err);
      setError("Failed to stop stream.");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // Refresh stream status
  // ===============================
  const refreshStatus = useCallback(async () => {
    try {
      const res = await getStreamsStatus();
      setRunning(res.data.running);
    } catch (err) {
      console.error("Refresh status error:", err);
    }
  }, []);

  return { running, loading, error, videoRef, start, stop, refreshStatus };
};