const SOUNDS = {
  critical: '/sounds/CRITICAL_NOTIF.mp3',
  danger:   '/sounds/DANGER_NOTIF.mp3',
  alert:    '/sounds/DANGER_NOTIF.mp3',
  warning:  '/sounds/NORMAL_NOTIF_2.mp3',
  info:     '/sounds/NORMAL_NOTIF.mp3',
  success:  '/sounds/SUCCESS_NOTIF.mp3',
  optimal:  '/sounds/SUCCESS_NOTIF.mp3',
  normal:   '/sounds/NORMAL_NOTIF_2.mp3',
  default:  '/sounds/NORMAL_NOTIF.mp3',
};

const STATUS_OVERRIDE = {
  high:   '/sounds/CRITICAL_NOTIF.mp3',
  medium: '/sounds/NORMAL_NOTIF_2.mp3',
  low:    '/sounds/NORMAL_NOTIF.mp3',
};

// ✅ Track kung naka-unlock na ang audio
let audioUnlocked = false;

export function markAudioUnlocked() {
  audioUnlocked = true;
  console.log("🔊 Audio marked as unlocked");
}

function playAudio(src) {
  // ✅ Hindi mag-play kapag hindi pa nag-iinteract ang user
  if (!audioUnlocked) {
    console.warn('🔇 Audio not yet unlocked — skipping sound');
    return;
  }

  console.log(`🔊 Playing: ${src}`);
  const audio = new Audio(src);
  audio.volume = 0.5;
  audio.play().catch((err) => console.warn('Sound blocked:', err.message));
}

export function playNotifSound(type = 'default', status = null) {
  const isMuted = localStorage.getItem('soundMuted') === 'true';
  if (isMuted) return;

  const normalizedStatus = status?.toLowerCase();
  const normalizedType   = type?.toLowerCase();

  // ✅ Status HIGH = always critical sound
  if (normalizedStatus === 'high') {
    return playAudio('/sounds/CRITICAL_NOTIF.mp3');
  }

  // ✅ Type muna
  if (SOUNDS[normalizedType]) {
    return playAudio(SOUNDS[normalizedType]);
  }

  // ✅ Fallback sa status
  if (STATUS_OVERRIDE[normalizedStatus]) {
    return playAudio(STATUS_OVERRIDE[normalizedStatus]);
  }

  playAudio(SOUNDS.default);
}