import React, { useState } from 'react';
import { triggerHaptic } from '../../utils/soundAndHaptics';

interface DecoyProps {
  unlockCode: string;
  onUnlockNuru: () => void;
  onExitDecoy: () => void;
}

export const DecoyCalculatorScreen: React.FC<DecoyProps> = ({
  unlockCode,
  onUnlockNuru,
  onExitDecoy,
}) => {
  const [display, setDisplay] = useState('0');
  const [history, setHistory] = useState('');

  const playKeySound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(120, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.03);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.035);
    } catch {
      // Ignorer si audio non autorisé
    }
  };

  const handlePress = (val: string) => {
    playKeySound();
    triggerHaptic('tap');

    if (val === 'C') {
      setDisplay('0');
      setHistory('');
      return;
    }

    if (val === '±') {
      if (display !== '0' && display !== 'Erreur') {
        setDisplay((prev) => (prev.startsWith('-') ? prev.slice(1) : '-' + prev));
      }
      return;
    }

    if (val === '%') {
      try {
        const num = parseFloat(display);
        if (!isNaN(num)) {
          setDisplay(String(num / 100));
        }
      } catch {
        setDisplay('Erreur');
      }
      return;
    }

    if (val === '=') {
      // Vérifier si la saisie correspond au code de déverrouillage de Nuru
      const targetPin = unlockCode?.trim() || '1234';
      if (display === targetPin) {
        onUnlockNuru();
        return;
      }

      try {
        const sanitized = display.replace(/×/g, '*').replace(/÷/g, '/');
        if (/^[\d+\-*/. ]+$/.test(sanitized)) {
          // Calcul arithmétique pur
          const result = Function(`'use strict'; return (${sanitized})`)();
          setHistory(display + ' =');
          setDisplay(String(result));
        }
      } catch {
        setDisplay('Erreur');
      }
      return;
    }

    setDisplay((prev) => {
      if (prev === '0' || prev === 'Erreur') return val;
      return prev + val;
    });
  };

  return (
    <div
      className="relative flex h-full min-h-[620px] w-full flex-col justify-between bg-black p-5 text-white"
      id="nuru-decoy-calculator"
    >
      {/* Header discret */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-[11px] font-mono text-zinc-500">Calculatrice Système</span>
        <button
          type="button"
          onClick={onExitDecoy}
          className="text-[10px] text-zinc-600 hover:text-zinc-400 p-1"
        >
          Quitter le leurre
        </button>
      </div>

      {/* Écran d'affichage */}
      <div className="flex flex-col items-end justify-end py-6 px-2">
        <div className="text-xs font-mono text-zinc-500 h-5">{history}</div>
        <div className="text-5xl font-light font-mono tracking-tight text-white line-clamp-1">
          {display}
        </div>
      </div>

      {/* Clavier standard calculatrice iOS / Android */}
      <div className="grid grid-cols-4 gap-3 pb-4">
        {[
          { label: 'C', type: 'fn' },
          { label: '±', type: 'fn' },
          { label: '%', type: 'fn' },
          { label: '÷', type: 'op' },
          { label: '7', type: 'num' },
          { label: '8', type: 'num' },
          { label: '9', type: 'num' },
          { label: '×', type: 'op' },
          { label: '4', type: 'num' },
          { label: '5', type: 'num' },
          { label: '6', type: 'num' },
          { label: '-', type: 'op' },
          { label: '1', type: 'num' },
          { label: '2', type: 'num' },
          { label: '3', type: 'num' },
          { label: '+', type: 'op' },
          { label: '0', type: 'zero' },
          { label: '.', type: 'num' },
          { label: '=', type: 'equal' },
        ].map((btn, idx) => {
          const isZero = btn.type === 'zero';
          const isOp = btn.type === 'op';
          const isEqual = btn.type === 'equal';
          const isFn = btn.type === 'fn';

          return (
            <button
              key={idx}
              type="button"
              onClick={() => handlePress(btn.label)}
              className={`flex h-16 items-center justify-center rounded-full text-xl font-medium transition active:scale-95 ${
                isZero ? 'col-span-2 justify-start pl-7' : ''
              } ${
                isEqual || isOp
                  ? 'bg-amber-600 text-white active:bg-amber-700'
                  : isFn
                  ? 'bg-zinc-400 text-black active:bg-zinc-500'
                  : 'bg-zinc-800 text-white active:bg-zinc-700'
              }`}
            >
              {btn.label}
            </button>
          );
        })}
      </div>

      <div className="text-center text-[10px] text-zinc-600 pb-1">
        Code secret pour déverrouiller Nuru : <span className="font-mono">{unlockCode}</span> puis <span className="font-mono">=</span>
      </div>
    </div>
  );
};
