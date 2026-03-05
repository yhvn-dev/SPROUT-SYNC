import { useEffect, useState, useRef, useCallback } from "react";
import Hls from "hls.js";
import { startStream, stopStream, getStreamsStatus } from "../data/streamServices";

const STREAM_URL = `${import.meta.env.VITE_DEV_URL}/streams/stream.m3u8`;

/* ===============================
   WAIT FOR VALID HLS SEGMENTS
================================ */
const waitForStream = async (maxRetries = 30, interval = 2000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await fetch(`${STREAM_URL}?nocache=${Date.now()}`);
      if (res.ok) {
        const text = await res.text();
        if (text.includes("#EXTM3U") && text.includes(".ts")) {
          console.log(`✅ Stream ready after ${i + 1} attempt(s)`);
          return true;
        }
      }
    } catch {}
    console.log(`⏳ Waiting for stream... ${i + 1}/${maxRetries}`);
    await new Promise(r => setTimeout(r, interval));
  }
  throw new Error("Stream not ready after max retries");
};

export const useStream = () => {
  const [running, setRunning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const attachAttempts = useRef(0);

  /* ===============================
     ATTACH HLS TO VIDEO
     FIX: force hls.js even on Chrome
     to avoid native HEVC fallback
  ================================ */
  const attachHls = useCallback(() => {
    const video = videoRef.current;

    if (!video) {
      attachAttempts.current += 1;
      if (attachAttempts.current > 20) {
        console.error("❌ videoRef never became available");
        return;
      }
      console.warn(`⚠️ videoRef not ready, retrying... (${attachAttempts.current})`);
      setTimeout(attachHls, 300);
      return;
    }

    attachAttempts.current = 0;
    console.log("✅ videoRef ready, attaching HLS...");

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    video.pause();
    video.removeAttribute("src");
    video.load();

    const streamUrl = `${STREAM_URL}?nocache=${Date.now()}`;

    // FIX: Always use hls.js if supported — never use native HLS
    // Native HLS on Chrome can't handle HEVC and causes DEMUXER errors
    if (Hls.isSupported()) {
      console.log("🎬 Using hls.js (forced)");

      const hls = new Hls({
        lowLatencyMode: true,
        liveSyncDurationCount: 3,
        liveMaxLatencyDurationCount: 6,
        maxBufferLength: 10,
        backBufferLength: 30,
        enableWorker: true,
        progressive: false,
      });

      hlsRef.current = hls;
      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        console.log("✅ HLS media attached");
      });

      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        console.log("✅ HLS manifest parsed");
        data.levels.forEach((level, i) => {
          console.log(`   Level ${i} codec:`, level.attrs?.CODECS);
        });
        video.play()
          .then(() => console.log("▶️ Video playing!"))
          .catch(err => console.warn("⚠️ play() failed:", err.message));
      });

      hls.on(Hls.Events.FRAG_LOADED, (event, data) => {
        console.log(`📦 Fragment loaded: ${data.frag.sn}`);
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        console.error("HLS ERROR:", data.type, data.details);
        if (data.fatal) {
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
            console.warn("🌐 Network error — retrying...");
            hls.startLoad();
          } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
            console.warn("🎥 Media error — recovering...");
            hls.recoverMediaError();
          } else {
            console.error("💥 Fatal HLS error");
            hls.destroy();
            hlsRef.current = null;
            setError("Stream crashed. Please try again.");
          }
        }
      });

    // FIX: Safari fallback only — Safari doesn't support hls.js
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      console.log("🍎 Safari fallback — using native HLS");
      video.src = streamUrl;
      video.load();
      video.play().catch(err => console.warn("Safari play() failed:", err));
    } else {
      setError("HLS is not supported in this browser");
    }
  }, []);

  /* ===============================
     AUTO ATTACH WHEN RUNNING
  ================================ */
  useEffect(() => {
    if (!running) return;

    console.log("🔄 running=true, scheduling HLS attach...");

    let timer;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        timer = setTimeout(() => {
          attachHls();
        }, 500);
      });
    });

    return () => {
      clearTimeout(timer);
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
        console.log("🧹 HLS destroyed on cleanup");
      }
    };
  }, [running, attachHls]);

  /* ===============================
     INITIAL STATUS CHECK
  ================================ */
  useEffect(() => {
    const init = async () => {
      try {
        const res = await getStreamsStatus();
        const isRunning = res.data.running;
        console.log("📊 Initial stream status:", isRunning);
        setRunning(isRunning);
      } catch (err) {
        console.error("Failed to get stream status:", err);
      }
    };
    init();
  }, []);

  /* ===============================
     START STREAM
  ================================ */
  const start = async () => {
    try {
      setLoading(true);
      setError(null);

      await startStream();
      console.log("▶️ FFmpeg started on backend");

      await waitForStream();
      console.log("✅ Stream segments ready");

      setRunning(true);
    } catch (err) {
      console.error("Start stream error:", err);
      setError("Failed to start stream. Check camera connection.");
      setRunning(false);
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     STOP STREAM
  ================================ */
  const stop = async () => {
    try {
      setLoading(true);
      setError(null);

      await stopStream();
      console.log("🛑 FFmpeg stopped on backend");

      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }

      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.removeAttribute("src");
        videoRef.current.load();
      }

      setRunning(false);
    } catch (err) {
      console.error("Stop stream error:", err);
      setError("Failed to stop stream.");
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     REFRESH STATUS
  ================================ */
  const refreshStatus = async () => {
    try {
      const res = await getStreamsStatus();
      setRunning(res.data.running);
      console.log("🔄 Stream status refreshed:", res.data.running);
    } catch (err) {
      console.error("Failed to refresh stream status:", err);
    }
  };

  return {
    running,
    loading,
    error,
    videoRef,
    start,
    stop,
    refreshStatus,
  };
};