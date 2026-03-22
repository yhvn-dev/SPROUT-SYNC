// ✅ Track kung naka-unlock na ang audio
let audioUnlocked = false;

export function markAudioUnlocked() {
  audioUnlocked = true;
  console.log("🔊 Audio marked as unlocked");
}

export function playNotifSound() {
  const isMuted = localStorage.getItem('soundMuted') === 'true';
  if (isMuted) return;

  if (!audioUnlocked) {
    console.warn('🔇 Audio not yet unlocked — skipping sound');
    return;
  }

  console.log(`🔊 Playing notification sound`);
  const audio = new Audio('/sounds/NORMAL_NOTIF.mp3');
  audio.volume = 0.5;
  audio.play().catch((err) => console.warn('Sound blocked:', err.message));
}