import { useEffect, useState, useRef, useCallback } from "react";
import Hls from "hls.js";
import { startStream, stopStream, getStreamsStatus } from "../data/streamServices";

const STREAM_URL = `${import.meta.env.VITE_API_URL}/streams/stream.m3u8`;

/* ===============================
   WAIT FOR VALID HLS SEGMENTS
================================ */
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
    } catch {}
    console.log(`⏳ Waiting for stream... ${i + 1}/${maxRetries}`);
    await new Promise(r => setTimeout(r, interval));
  }
  throw new Error("Stream not ready");
};

/* ===============================
   SAFE VIDEO PLAY
================================ */
const safePlay = async (video) => {
  if (!video) return;

  if (video.readyState < 2) {
    await new Promise(resolve =>
      video.addEventListener("canplay", resolve, { once: true })
    );
  }

  try {
    await video.play();
  } catch (err) {
    if (err.name !== "AbortError") {
      console.warn("play() failed:", err);
    }
  }
};

/* ===============================
   ATTACH HLS
================================ */
const attachHls = (video, hlsRef, setError) => {
  if (!video) return;

  // Clean previous
  if (hlsRef.current) {
    hlsRef.current.destroy();
    hlsRef.current = null;
  }

  video.pause();
  video.removeAttribute("src");
  video.load();

  // Native HLS (Safari)
  if (video.canPlayType("application/vnd.apple.mpegurl")) {
    video.src = `${STREAM_URL}?nocache=${Date.now()}`;
    safePlay(video);
    return;
  }

  if (!Hls.isSupported()) {
    setError("HLS not supported");
    return;
  }

  const hls = new Hls({
    lowLatencyMode: true,
    liveSyncDurationCount: 3,
    liveMaxLatencyDurationCount: 6,
    maxBufferLength: 10,
    backBufferLength: 30,
  });

  hlsRef.current = hls;

  hls.loadSource(`${STREAM_URL}?nocache=${Date.now()}`);
  hls.attachMedia(video);

  hls.on(Hls.Events.MANIFEST_PARSED, () => {
    safePlay(video);
  });

  hls.on(Hls.Events.ERROR, (_, data) => {
    console.error("HLS ERROR:", data);
    if (data.fatal) {
      if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
        hls.startLoad();
      } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
        hls.recoverMediaError();
      } else {
        hls.destroy();
        hlsRef.current = null;
        setError("Stream crashed");
      }
    }
  });
};

/* ===============================
   MAIN HOOK
================================ */
export const useStream = () => {
  const [running, setRunning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  /* ===============================
     VIDEO REF CALLBACK
  ================================ */
  const setVideoRef = useCallback((node) => {
    if (node) {
      videoRef.current = node;
    }
  }, []);
  
  /* ===============================
     AUTO ATTACH WHEN READY
  ================================ */

  
useEffect(() => {
  if (!running || !videoRef.current) return;

  const video = videoRef.current;

  // Check if Hls is supported
  if (Hls.isSupported()) {
    import('hls.js').then(HlsModule => {
      const hls = new HlsModule.default();
      hls.loadSource(`${import.meta.env.VITE_API_URL}/streams/stream.m3u8`);
      hls.attachMedia(video);
      hls.on(HlsModule.default.Events.MANIFEST_PARSED, () => {
        video.play().catch(err => console.warn("Video play failed:", err));
      });

      return () => {
        hls.destroy();
      };
    });
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    // Fallback for Safari
    video.src = `${import.meta.env.VITE_API_URL}/streams/stream.m3u8`;
    video.addEventListener('loadedmetadata', () => video.play());
  }
}, [running, videoRef]);



  /* ===============================
     INITIAL STATUS CHECK
  ================================ */
  useEffect(() => {
    const init = async () => {
      try {
        const res = await getStreamsStatus();
        setRunning(res.data.running);
      } catch (err) {
        console.error(err);
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
      console.log("▶️ FFmpeg started");

      await waitForStream();

      setRunning(true); // <-- THIS triggers attach effect
    } catch (err) {
      setError("Failed to start stream");
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
      await stopStream();

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
    } catch {
      setError("Failed to stop stream");
    } finally {
      setLoading(false);
    }
  };

  return {
    running,
    loading,
    error,
    videoRef: setVideoRef,
    start,
    stop,
  };
};