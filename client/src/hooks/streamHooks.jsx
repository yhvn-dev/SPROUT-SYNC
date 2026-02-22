import { useEffect, useState, useRef, useCallback } from "react";
import Hls from "hls.js";
import { startStream, stopStream, getStreamsStatus } from "../data/streamServices";

const STREAM_URL = `${import.meta.env.VITE_API_URL}/streams/stream.m3u8`;

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

const safePlay = async (video) => {
  if (!video) return;
  if (video.readyState < 2) {
    await new Promise((resolve) => {
      const onReady = () => {
        video.removeEventListener("canplay", onReady);
        resolve();
      };
      video.addEventListener("canplay", onReady);
    });
  }
  try {
    await video.play();
  } catch (err) {
    if (err.name !== "AbortError") {
      console.warn("play() failed:", err);
    }
  }
};

const attachHls = (video, hlsRef, setError, setRunning) => {
  video.pause();
  video.removeAttribute("src");
  video.load();

  if (hlsRef.current) {
    hlsRef.current.destroy();
    hlsRef.current = null;
  }

  if (video.canPlayType("application/vnd.apple.mpegurl")) {
    video.src = `${STREAM_URL}?nocache=${Date.now()}`;
    safePlay(video);
    return;
  }

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
    safePlay(video);
  });

  hls.on(Hls.Events.ERROR, (event, data) => {
    console.error("HLS ERROR:", data);
    if (data.fatal) {
      if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
        console.warn("🔁 Retrying...");
        hls.startLoad();
      } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
        console.warn("🔁 Recovering...");
        hls.recoverMediaError();
      } else {
        setError("Stream error. Try restarting.");
        hls.destroy();
        hlsRef.current = null;
        setRunning(false);
      }
    }
  });
};

export const useStream = () => {
  const [running, setRunning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const videoElRef = useRef(null);
  const hlsRef = useRef(null);

  const videoRef = useCallback((node) => {
    if (node) videoElRef.current = node;
  }, []);

  // ✅ On mount — fetch status, if already running attach HLS immediately
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await getStreamsStatus();
        const isRunning = res.data.running;
        setRunning(isRunning);

        // ✅ KEY: kung running na sa backend, attach HLS agad after mount
        if (isRunning) {
          // Hintayin muna na ma-mount ang video element
          const waitForVideoEl = () => new Promise((resolve) => {
            const check = () => {
              if (videoElRef.current) return resolve(videoElRef.current);
              requestAnimationFrame(check);
            };
            check();
          });

          const video = await waitForVideoEl();
          attachHls(video, hlsRef, setError, setRunning);
        }
      } catch (err) {
        console.error("Stream status error:", err);
      }
    };
    fetchStatus();
  }, []);

  const start = async () => {
    try {
      setLoading(true);
      setError(null);
      await startStream();
      console.log("▶️ FFmpeg started, waiting for segments...");
      await waitForStream();
      console.log("✅ Stream ready — reloading page to display video...");

      // ✅ THE FIX: i-reload ang page — on mount makita niya na running=true
      // at mag-aattach ng HLS automatically
      window.location.reload();

    } catch (err) {
      console.error("Start stream error:", err);
      setError("Failed to start stream. Check camera or FFmpeg.");
      setRunning(false);
    } finally {
      setLoading(false);
    }
  };

  const stop = async () => {
    try {
      setLoading(true);
      setError(null);
      await stopStream();
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      const video = videoElRef.current;
      if (video) {
        video.pause();
        video.removeAttribute("src");
        video.load();
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

  const refreshStatus = useCallback(async () => {
    try {
      const res = await getStreamsStatus();
      const isRunning = res.data.running;
      setRunning(isRunning);
      if (isRunning && videoElRef.current) {
        attachHls(videoElRef.current, hlsRef, setError, setRunning);
      }
    } catch (err) {
      console.error("Refresh status error:", err);
    }
  }, []);

  return { running, loading, error, videoRef, start, stop, refreshStatus };
};