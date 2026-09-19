import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { AdinkraPattern } from '../AdinkraPattern';

interface SplashProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 1400);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      onClick={onComplete}
      className="relative flex h-full min-h-[600px] w-full flex-col items-center justify-center overflow-hidden bg-[#FAF4EA] text-[#1B2A41] cursor-pointer"
      id="nuru-splash-screen"
    >
      <AdinkraPattern opacity={0.05} />

      {/* Halo pulsant représentant la braise qui s'élargit */}
      <motion.div
        initial={{ scale: 0.2, opacity: 0 }}
        animate={{ scale: [0.2, 1.8, 2.4], opacity: [0, 0.45, 0.15] }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
        className="absolute h-64 w-64 rounded-full bg-gradient-to-tr from-[#C96A3F] via-[#D4A24C] to-transparent blur-3xl pointer-events-none"
      />

      <div className="relative z-10 flex flex-col items-center">
        {/* Symbole graine/braise */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
          className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#C96A3F] to-[#D4A24C] shadow-lg shadow-[#C96A3F]/20"
        >
          <div className="h-4 w-4 rounded-full bg-[#FAF4EA] animate-ping" />
        </motion.div>

        {/* Titre Nuru en Fraunces */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          style={{ fontFamily: 'var(--font-display, serif)' }}
          className="text-5xl font-normal tracking-wide text-[#1B2A41]"
        >
          Nuru
        </motion.h1>

        {/* Sous-titre discret */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.75 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-2 text-xs font-medium uppercase tracking-[0.25em] text-[#5B6779]"
        >
          Sanctuaire & Dignité
        </motion.p>
      </div>
    </div>
  );
};
