const SOUNDS = {
  critical: '/sounds/CRITICAL_NOTIF.mp3',
  danger:   '/sounds/DANGER NOTIF.mp3',
  alert:    '/sounds/DANGER NOTIF.mp3',
  warning:  '/sounds/NORMAL_NOTIF 2.mp3',
  info:     '/sounds/INFO_notif.mp3',
  success:  '/sounds/SUCCESS_NOTIF.mp3',
  optimal:  '/sounds/SUCCESS_NOTIF.mp3',
  normal:   '/sounds/NORMAL_NOTIF 2.mp3',
  default:  '/sounds/default.mp3',
};

const STATUS_OVERRIDE = {
  high:   '/sounds/CRITICAL_NOTIF.mp3',
  medium: '/sounds/NORMAL_NOTIF 2.mp3',
  low:    '/sounds/INFO_notif.mp3',
};


export function playNotifSound(type = 'default', status = null) {
  const isMuted = localStorage.getItem('soundMuted') === 'true';
  if (isMuted) return;
  
  const normalizedStatus = status?.toLowerCase();
  const normalizedType   = type?.toLowerCase();

  const src =
    STATUS_OVERRIDE[normalizedStatus] ??
    SOUNDS[normalizedType] ??
    SOUNDS.default;

  const audio = new Audio(src);
  audio.volume = 0.5;

  audio.play().catch((err) => {
    console.warn('Notification sound blocked:', err.message);
  });
}