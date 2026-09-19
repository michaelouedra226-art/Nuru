/**
 * Gestion du son procédural et des retours haptiques
 * 100% autonome et hors-ligne via Web Audio API et navigator.vibrate
 * Génération mathématique en temps réel (aucun téléchargement de fichier MP3)
 */

let audioCtx: AudioContext | null = null;
let activeAmbientNodes: {
  stop: () => void;
} | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Joue un son de battement cardiaque doux ponctuel (rythme lub-dub)
 */
export function playGentleHeartbeat() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Premier coup (lub)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(58, now);
    osc1.frequency.exponentialRampToValueAtTime(36, now + 0.12);

    gain1.gain.setValueAtTime(0.25, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.14);

    // Second coup (dub)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(50, now + 0.14);
    osc2.frequency.exponentialRampToValueAtTime(30, now + 0.28);

    gain2.gain.setValueAtTime(0.18, now + 0.14);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.14);
    osc2.stop(now + 0.3);
  } catch {
    // Silencieux
  }
}

/**
 * Démarre une ambiance sonore procédurale en boucle continue
 * @param type 'heartbeat' | 'theta' | 'rain'
 */
export function startAmbientSound(type: 'heartbeat' | 'theta' | 'rain'): void {
  stopAmbientSound();

  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    if (type === 'heartbeat') {
      // Boucle de battement à 54 BPM (1.11 seconde d'intervalle)
      let isRunning = true;
      const intervalId = setInterval(() => {
        if (!isRunning) return;
        playGentleHeartbeat();
      }, 1110);
      playGentleHeartbeat();

      activeAmbientNodes = {
        stop: () => {
          isRunning = false;
          clearInterval(intervalId);
        },
      };
    } else if (type === 'theta') {
      // Ondes Thêta binaurales : 200 Hz oreille gauche, 205.5 Hz oreille droite
      // Différence de 5.5 Hz induisant une synchronisation cérébrale apaisante
      const merger = ctx.createChannelMerger(2);
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 1.5);

      const oscLeft = ctx.createOscillator();
      oscLeft.type = 'sine';
      oscLeft.frequency.setValueAtTime(196.0, ctx.currentTime); // G3

      const oscRight = ctx.createOscillator();
      oscRight.type = 'sine';
      oscRight.frequency.setValueAtTime(201.5, ctx.currentTime); // 5.5 Hz binaural delta

      oscLeft.connect(merger, 0, 0);
      oscRight.connect(merger, 0, 1);
      merger.connect(masterGain);
      masterGain.connect(ctx.destination);

      oscLeft.start();
      oscRight.start();

      activeAmbientNodes = {
        stop: () => {
          const now = ctx.currentTime;
          masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.8);
          setTimeout(() => {
            try {
              oscLeft.stop();
              oscRight.stop();
              merger.disconnect();
              masterGain.disconnect();
            } catch {
              // Silencieux
            }
          }, 850);
        },
      };
    } else if (type === 'rain') {
      // Générateur procédural de bruit de pluie et vent apaisant (bruit brun/rose filtré)
      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      // Génération de bruit rose/brun par intégration
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5; // Gain compensatoire
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Filtre passe-bas modélisant la pluie sur le feuillage et le sol
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(550, ctx.currentTime);
      filter.Q.setValueAtTime(0.8, ctx.currentTime);

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 1.2);

      whiteNoise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      whiteNoise.start();

      activeAmbientNodes = {
        stop: () => {
          const now = ctx.currentTime;
          gainNode.gain.linearRampToValueAtTime(0.0001, now + 0.6);
          setTimeout(() => {
            try {
              whiteNoise.stop();
              whiteNoise.disconnect();
              filter.disconnect();
              gainNode.disconnect();
            } catch {
              // Silencieux
            }
          }, 650);
        },
      };
    }
  } catch {
    // Silencieux si restrictions de lecture audio
  }
}

/**
 * Arrête tout son d'ambiance actif
 */
export function stopAmbientSound(): void {
  if (activeAmbientNodes) {
    try {
      activeAmbientNodes.stop();
    } catch {
      // Silencieux
    }
    activeAmbientNodes = null;
  }
}

/**
 * Joue une note de clarté kora/bol zen lors de la complétion d'un cycle SOS
 */
export function playVictoryChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const frequencies = [261.63, 329.63, 392.0, 523.25]; // C-E-G-C

    frequencies.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + index * 0.08);

      gain.gain.setValueAtTime(0.12, now + index * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.08 + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + index * 0.08);
      osc.stop(now + index * 0.08 + 1.3);
    });
  } catch {
    // Silencieux
  }
}

/**
 * Haptique douce
 */
export function triggerHaptic(type: 'tap' | 'breath_step' | 'heart' | 'victory') {
  if (typeof navigator === 'undefined' || !navigator.vibrate) return;

  try {
    switch (type) {
      case 'tap':
        navigator.vibrate(12);
        break;
      case 'breath_step':
        navigator.vibrate(25);
        break;
      case 'heart':
        navigator.vibrate([40, 90, 40]);
        break;
      case 'victory':
        navigator.vibrate([30, 60, 30, 80, 70]);
        break;
    }
  } catch {
    // Silencieux
  }
}
