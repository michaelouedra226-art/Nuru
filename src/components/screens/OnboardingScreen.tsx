import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MainReason } from '../../types';
import { AdinkraPattern } from '../AdinkraPattern';
import { IconGraine } from '../icons/CustomSvgIcons';
import { triggerHaptic } from '../../utils/soundAndHaptics';

interface OnboardingProps {
  onComplete: (data: {
    userName: string;
    reasons: MainReason[];
    temptationHour: number;
    startDateTimestamp: number;
  }) => void;
}

export const OnboardingScreen: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [name, setName] = useState('');
  const [reasons, setReasons] = useState<MainReason[]>(['faith', 'energy']);
  const [temptationHour, setTemptationHour] = useState<number>(22);
  const [startType, setStartType] = useState<'today' | 'past'>('today');
  const [pastDays, setPastDays] = useState<number>(0);

  const toggleReason = (reason: MainReason) => {
    triggerHaptic('tap');
    if (reasons.includes(reason)) {
      if (reasons.length > 1) {
        setReasons(reasons.filter((r) => r !== reason));
      }
    } else {
      setReasons([...reasons, reason]);
    }
  };

  const handleFinish = () => {
    triggerHaptic('victory');
    const startTimestamp =
      startType === 'today'
        ? Date.now()
        : Date.now() - Math.max(0, pastDays) * 24 * 3600 * 1000;

    onComplete({
      userName: name.trim() || 'Ami',
      reasons,
      temptationHour,
      startDateTimestamp: startTimestamp,
    });
  };

  return (
    <div
      className="relative flex h-full min-h-[620px] w-full flex-col justify-between overflow-hidden bg-[#FAF4EA] px-6 py-8 text-[#1B2A41]"
      id="nuru-onboarding-screen"
    >
      <AdinkraPattern opacity={0.04} />

      {/* Barre de progression */}
      <div className="relative z-10 mx-auto flex w-full max-w-sm items-center justify-between gap-2 pt-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              step >= i ? 'bg-[#C96A3F]' : 'bg-[#1B2A41]/10'
            }`}
          />
        ))}
      </div>

      <div className="relative z-10 my-auto w-full max-w-sm mx-auto">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#C96A3F]">
                Étape 1 sur 4
              </div>
              <h2
                style={{ fontFamily: 'var(--font-heading, sans-serif)' }}
                className="text-2xl font-bold text-[#1B2A41]"
              >
                Comment veux-tu qu’on t’appelle ?
              </h2>
              <p className="mt-2 text-sm text-[#5B6779]">
                Ce prénom reste strictement sur ton appareil. Aucune donnée ne quitte ce téléphone.
              </p>

              <div className="mt-8 w-full">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex : Moussa, Aïcha, Tunde..."
                  maxLength={24}
                  className="w-full rounded-2xl border border-[#1B2A41]/15 bg-white px-5 py-4 text-center text-lg font-medium text-[#1B2A41] shadow-sm outline-none transition focus:border-[#C96A3F] focus:ring-2 focus:ring-[#C96A3F]/20"
                />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col"
            >
              <div className="text-center">
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#C96A3F]">
                  Étape 2 sur 4
                </div>
                <h2
                  style={{ fontFamily: 'var(--font-heading, sans-serif)' }}
                  className="text-2xl font-bold text-[#1B2A41]"
                >
                  Qu’est-ce qui t’anime ?
                </h2>
                <p className="mt-1 text-xs text-[#5B6779]">
                  Choisis ce qui compte le plus pour toi aujourd’hui.
                </p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  {
                    id: 'faith' as MainReason,
                    title: 'Ma foi',
                    desc: 'Pureté du cœur & prière',
                    icon: '🕊',
                  },
                  {
                    id: 'energy' as MainReason,
                    title: 'Mon énergie',
                    desc: 'Vitalité, clarté & force',
                    icon: '⚡',
                  },
                  {
                    id: 'relations' as MainReason,
                    title: 'Mes relations',
                    desc: 'Regard franc & respect',
                    icon: '🤝',
                  },
                  {
                    id: 'studies' as MainReason,
                    title: 'Études & Travail',
                    desc: 'Focus absolu & ambition',
                    icon: '📚',
                  },
                ].map((item) => {
                  const isSelected = reasons.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleReason(item.id)}
                      className={`flex flex-col items-start rounded-2xl p-4 text-left transition-all ${
                        isSelected
                          ? 'border-2 border-[#C96A3F] bg-white shadow-md shadow-[#C96A3F]/10'
                          : 'border border-[#1B2A41]/10 bg-white/70 hover:bg-white'
                      }`}
                    >
                      <span className="text-2xl mb-2">{item.icon}</span>
                      <span className="text-sm font-bold text-[#1B2A41]">{item.title}</span>
                      <span className="mt-1 text-[11px] leading-tight text-[#5B6779]">
                        {item.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#C96A3F]">
                Étape 3 sur 4
              </div>
              <h2
                style={{ fontFamily: 'var(--font-heading, sans-serif)' }}
                className="text-2xl font-bold text-[#1B2A41]"
              >
                Ton heure critique
              </h2>
              <p className="mt-2 text-xs text-[#5B6779]">
                L’heure où l’isolement ou la fatigue rendent la tentation plus lourde. Nuru te
                proposera un mot d’ancrage doux juste avant.
              </p>

              <div className="mt-8 flex flex-col items-center">
                <div
                  style={{ fontFamily: 'var(--font-mono, monospace)' }}
                  className="text-5xl font-bold text-[#C96A3F]"
                >
                  {String(temptationHour).padStart(2, '0')}:00
                </div>
                <span className="mt-1 text-xs text-[#5B6779]">
                  {temptationHour >= 21 || temptationHour < 5 ? 'Créneau de nuit' : 'En journée'}
                </span>

                <div className="mt-6 w-full max-w-xs">
                  <input
                    type="range"
                    min="0"
                    max="23"
                    value={temptationHour}
                    onChange={(e) => {
                      setTemptationHour(Number(e.target.value));
                      triggerHaptic('tap');
                    }}
                    className="w-full accent-[#C96A3F] cursor-pointer"
                  />
                  <div className="mt-2 flex justify-between text-[11px] font-mono text-[#5B6779]">
                    <span>00:00</span>
                    <span>12:00</span>
                    <span>23:00</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col text-center"
            >
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#C96A3F]">
                Étape 4 sur 4
              </div>
              <h2
                style={{ fontFamily: 'var(--font-heading, sans-serif)' }}
                className="text-2xl font-bold text-[#1B2A41]"
              >
                Ton jalon réel de départ
              </h2>
              <p className="mt-1 text-xs text-[#5B6779]">
                Pour que ton compteur et tes badges soient 100% réels dès la première seconde.
              </p>

              <div className="mt-6 space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('tap');
                    setStartType('today');
                    setPastDays(0);
                  }}
                  className={`w-full rounded-2xl p-4 text-left border transition ${
                    startType === 'today'
                      ? 'border-2 border-[#3B6255] bg-white shadow-xs'
                      : 'border-[#1B2A41]/10 bg-white/70'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <strong className="text-xs text-[#1B2A41] block">
                        Je commence aujourd'hui (Instant présent)
                      </strong>
                      <span className="text-[11px] text-[#5B6779]">
                        Le compteur débutera exactement à 0 jour, 0 heure, 0 minute.
                      </span>
                    </div>
                    <span className="text-lg">🌱</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('tap');
                    setStartType('past');
                    if (pastDays === 0) setPastDays(1);
                  }}
                  className={`w-full rounded-2xl p-4 text-left border transition ${
                    startType === 'past'
                      ? 'border-2 border-[#C96A3F] bg-white shadow-xs'
                      : 'border-[#1B2A41]/10 bg-white/70'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <strong className="text-xs text-[#1B2A41] block">
                        J'ai déjà commencé mon chemin
                      </strong>
                      <span className="text-[11px] text-[#5B6779]">
                        Je veux intégrer mes jours déjà accomplis.
                      </span>
                    </div>
                    <span className="text-lg">⏳</span>
                  </div>
                </button>

                {startType === 'past' && (
                  <div className="rounded-2xl border border-[#C96A3F]/30 bg-white p-4 text-left">
                    <label className="text-xs font-semibold text-[#1B2A41] block mb-1">
                      Nombre de jours déjà accomplis :
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min="1"
                        max="3650"
                        value={pastDays}
                        onChange={(e) => setPastDays(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-24 rounded-xl border border-[#1B2A41]/20 px-3 py-2 text-center font-mono text-base font-bold text-[#C96A3F]"
                      />
                      <span className="text-xs text-[#5B6779]">
                        {pastDays <= 1 ? 'jour d’abstinence' : 'jours d’abstinence'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="step-5"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center text-center"
            >
              <motion.div
                initial={{ scale: 0.8, rotate: -5 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, type: 'spring' }}
                className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#3B6255]/10 text-[#3B6255]"
              >
                <IconGraine size={42} color="#3B6255" />
              </motion.div>

              <h2
                style={{ fontFamily: 'var(--font-display, serif)' }}
                className="text-3xl text-[#1B2A41]"
              >
                Bienvenue, {name || 'Ami'}.
              </h2>
              <p className="mt-3 text-base text-[#5B6779] leading-relaxed">
                Tu n’es pas seul. Tu n’es pas ton échec.<br />
                Chaque jour compte. Ton sanctuaire commence ici.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation inférieure */}
      <div className="relative z-10 mx-auto w-full max-w-sm pt-4">
        {step < 5 ? (
          <div className="flex items-center gap-3">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3 | 4)}
                className="rounded-2xl border border-[#1B2A41]/15 bg-white px-5 py-3.5 text-sm font-semibold text-[#1B2A41] transition hover:bg-[#FAF4EA]"
              >
                Retour
              </button>
            )}
            <button
              type="button"
              disabled={step === 1 && !name.trim()}
              onClick={() => {
                triggerHaptic('tap');
                if (step === 4) {
                  setStep(5);
                } else {
                  setStep((s) => (s + 1) as 1 | 2 | 3 | 4 | 5);
                }
              }}
              className="flex-1 rounded-2xl bg-[#C96A3F] py-3.5 text-center text-sm font-semibold text-white shadow-md shadow-[#C96A3F]/25 transition hover:bg-[#b5582f] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Continuer
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleFinish}
            className="w-full rounded-2xl bg-[#3B6255] py-4 text-center text-sm font-semibold text-white shadow-md shadow-[#3B6255]/25 transition hover:bg-[#2e4f44]"
          >
            Entrer dans mon Sanctuaire
          </button>
        )}
      </div>
    </div>
  );
};
