import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { triggerHaptic } from '../../utils/soundAndHaptics';
import { authenticateWithBiometrics, isBiometricsAvailable } from '../../utils/biometrics';

interface PinScreenProps {
  correctPin: string;
  biometricsEnabled?: boolean;
  onSuccess: () => void;
  onDecoyEmergency?: () => void;
}

export const PinScreen: React.FC<PinScreenProps> = ({
  correctPin,
  biometricsEnabled = false,
  onSuccess,
  onDecoyEmergency,
}) => {
  const [enteredDigits, setEnteredDigits] = useState<string[]>([]);
  const [errorCount, setErrorCount] = useState<number>(0);
  const [lockoutSeconds, setLockoutSeconds] = useState<number>(0);
  const [shakeError, setShakeError] = useState<boolean>(false);
  const [biometricSupported, setBiometricSupported] = useState<boolean>(false);

  useEffect(() => {
    isBiometricsAvailable().then((avail) => {
      setBiometricSupported(avail);
      if (avail && biometricsEnabled) {
        // Déclenchement automatique discret de l'authentification biométrique
        authenticateWithBiometrics().then((ok) => {
          if (ok) {
            triggerHaptic('victory');
            onSuccess();
          }
        });
      }
    });
  }, [biometricsEnabled, onSuccess]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (lockoutSeconds > 0) {
      interval = setInterval(() => {
        setLockoutSeconds((prev) => (prev > 1 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [lockoutSeconds]);

  const handleBiometricClick = async () => {
    triggerHaptic('tap');
    const success = await authenticateWithBiometrics();
    if (success) {
      triggerHaptic('victory');
      onSuccess();
    }
  };

  const handleDigit = (digit: string) => {
    if (lockoutSeconds > 0) return;
    if (enteredDigits.length >= 6) return;

    triggerHaptic('tap');
    const newDigits = [...enteredDigits, digit];
    setEnteredDigits(newDigits);

    if (newDigits.length === 6) {
      const code = newDigits.join('');
      if (code === correctPin || code === '123456') {
        triggerHaptic('victory');
        onSuccess();
      } else {
        setShakeError(true);
        setTimeout(() => setShakeError(false), 500);
        setEnteredDigits([]);
        const nextErrors = errorCount + 1;
        setErrorCount(nextErrors);
        if (nextErrors >= 3) {
          setLockoutSeconds(30);
        }
      }
    }
  };

  const handleDelete = () => {
    if (enteredDigits.length > 0) {
      triggerHaptic('tap');
      setEnteredDigits(enteredDigits.slice(0, -1));
    }
  };

  return (
    <div
      className="relative flex h-full min-h-[620px] w-full flex-col items-center justify-between bg-[#0E1620] px-6 py-10 text-[#F4E9D8]"
      id="nuru-pin-screen"
    >
      {/* Header sécurité */}
      <div className="flex flex-col items-center text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1B2A41] text-[#D4A24C]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <h2
          style={{ fontFamily: 'var(--font-heading, sans-serif)' }}
          className="text-xl font-bold tracking-tight text-[#F4E9D8]"
        >
          Espace Secret Protégé
        </h2>
        <p className="mt-1 text-xs text-[#9AA8BA]">
          {lockoutSeconds > 0
            ? `Trop de tentatives. Attends ${lockoutSeconds}s.`
            : 'Saisis ton code à 6 chiffres ou ton empreinte'}
        </p>
      </div>

      {/* Les 6 gouttes d'eau de remplissage */}
      <motion.div
        animate={shakeError ? { x: [-10, 10, -8, 8, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-center gap-3 my-4"
      >
        {[0, 1, 2, 3, 4, 5].map((index) => {
          const filled = index < enteredDigits.length;
          return (
            <motion.div
              key={index}
              initial={false}
              animate={
                filled
                  ? { scale: [1, 1.3, 1], backgroundColor: '#D4A24C' }
                  : { scale: 1, backgroundColor: 'rgba(255, 255, 255, 0.15)' }
              }
              transition={{ duration: 0.2 }}
              className="h-3.5 w-3.5 rounded-full border border-[#D4A24C]/40"
            />
          );
        })}
      </motion.div>

      {/* Pavé numérique JetBrains Mono */}
      <div className="w-full max-w-xs">
        <div className="grid grid-cols-3 gap-3.5">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              disabled={lockoutSeconds > 0}
              onClick={() => handleDigit(digit)}
              style={{ fontFamily: 'var(--font-mono, monospace)' }}
              className="flex h-16 w-full items-center justify-center rounded-2xl bg-[#1B2A41]/80 text-2xl font-medium text-[#F4E9D8] transition active:scale-95 active:bg-[#C96A3F] disabled:opacity-30 shadow-sm"
            >
              {digit}
            </button>
          ))}

          {/* Bouton biométrie si supporté */}
          {biometricSupported ? (
            <button
              type="button"
              onClick={handleBiometricClick}
              className="flex h-16 w-full flex-col items-center justify-center rounded-2xl bg-[#1B2A41]/40 text-[#D4A24C] hover:bg-[#1B2A41]/80 transition active:scale-95"
              title="Empreinte / Biométrie"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2a10 10 0 0 0-10 10c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
              </svg>
              <span className="text-[9px] mt-0.5">Biométrie</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onDecoyEmergency}
              className="flex h-16 w-full items-center justify-center rounded-2xl text-[11px] font-medium text-[#9AA8BA] hover:text-[#F4E9D8] transition active:scale-95"
            >
              Leurre
            </button>
          )}

          {/* Chiffre 0 */}
          <button
            type="button"
            disabled={lockoutSeconds > 0}
            onClick={() => handleDigit('0')}
            style={{ fontFamily: 'var(--font-mono, monospace)' }}
            className="flex h-16 w-full items-center justify-center rounded-2xl bg-[#1B2A41]/80 text-2xl font-medium text-[#F4E9D8] transition active:scale-95 active:bg-[#C96A3F] disabled:opacity-30 shadow-sm"
          >
            0
          </button>

          {/* Bouton Effacer */}
          <button
            type="button"
            onClick={handleDelete}
            className="flex h-16 w-full items-center justify-center rounded-2xl bg-[#1B2A41]/40 text-sm font-medium text-[#9AA8BA] hover:text-[#F4E9D8] transition active:scale-95"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
              <line x1="18" y1="9" x2="12" y2="15" />
              <line x1="12" y1="9" x2="18" y2="15" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 text-center pt-2 text-[11px] text-[#9AA8BA]">
        {onDecoyEmergency && biometricSupported && (
          <button
            type="button"
            onClick={onDecoyEmergency}
            className="text-[#9AA8BA] underline underline-offset-2 hover:text-white"
          >
            Mode Leurre
          </button>
        )}
        <span>Code démo : <strong className="font-mono text-[#D4A24C]">123456</strong></span>
      </div>
    </div>
  );
};
