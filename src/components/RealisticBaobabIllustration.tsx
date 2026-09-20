import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export interface BaobabStageData {
  level: number;
  stageName: string;
  scientificName: string;
  subtitle: string;
  neuroBiology: string;
  nextMilestoneDays: number;
  progressPercent: number;
}

interface RealisticBaobabIllustrationProps {
  days: number;
  size?: 'compact' | 'standard' | 'hero';
  showDetailsCard?: boolean;
}

type CircadianTime = 'dawn' | 'day' | 'dusk' | 'night';

export const getBaobabBiologicalStage = (days: number): BaobabStageData => {
  if (days < 3) {
    const next = 3;
    const progress = Math.min(100, Math.round((days / next) * 100));
    return {
      level: 1,
      stageName: 'Graine en terre',
      scientificName: 'Adansonia — Germination',
      subtitle: 'La graine fende la terre d’argile, l’ancrage commence.',
      neuroBiology: 'Réinitialisation dopaminergique initiale. Le cerveau surmonte le manque impulsif et pose les bases d’une nouvelle plasticité.',
      nextMilestoneDays: 3,
      progressPercent: progress,
    };
  }
  if (days < 14) {
    const next = 14;
    const progress = Math.min(100, Math.round(((days - 3) / (next - 3)) * 100));
    return {
      level: 2,
      stageName: 'Jeune pousse',
      scientificName: 'Adansonia — Cotylédons',
      subtitle: 'Tige souple et vivante déployant ses premières feuilles vers l’aube.',
      neuroBiology: 'Baisse du cortisol de stress, restauration progressive de la clarté mentale et de la concentration diurne.',
      nextMilestoneDays: 14,
      progressPercent: progress,
    };
  }
  if (days < 60) {
    const next = 60;
    const progress = Math.min(100, Math.round(((days - 14) / (next - 14)) * 100));
    return {
      level: 3,
      stageName: 'Jeune arbre robuste',
      scientificName: 'Adansonia — Ramification',
      subtitle: 'Tronc s’élargissant pour stocker l’eau vitale de la résilience.',
      neuroBiology: 'Augmentation de la densité des récepteurs dopaminergiques D2. Le cortex préfrontal reprend le contrôle souverain des impulsions.',
      nextMilestoneDays: 60,
      progressPercent: progress,
    };
  }
  if (days < 180) {
    const next = 180;
    const progress = Math.min(100, Math.round(((days - 60) / (next - 60)) * 100));
    return {
      level: 4,
      stageName: 'Baobab vigoureux',
      scientificName: 'Adansonia — Tronc en bouteille',
      subtitle: 'Écorce protectrice indéchirable face aux tempêtes de la vie.',
      neuroBiology: 'Consolidation neuro-structurelle : les anciennes voies neuronales compulsives s’atrophient au profit de circuits de volonté stables.',
      nextMilestoneDays: 180,
      progressPercent: progress,
    };
  }
  return {
    level: 5,
    stageName: 'Grand Baobab séculaire',
    scientificName: 'Adansonia digitata — Maître de la savane',
    subtitle: 'Arbre millénaire dont l’ombre et la sagesse abritent les générations.',
    neuroBiology: 'Maîtrise de soi pérenne. Équilibre profond du système nerveux autonome, sérénité intérieure et dignité inébranlable.',
    nextMilestoneDays: 365,
    progressPercent: 100,
  };
};

const getCircadianFromHour = (hour: number): CircadianTime => {
  if (hour >= 5 && hour < 10) return 'dawn';
  if (hour >= 10 && hour < 17) return 'day';
  if (hour >= 17 && hour < 21) return 'dusk';
  return 'night';
};

export const RealisticBaobabIllustration: React.FC<RealisticBaobabIllustrationProps> = ({
  days,
  size = 'standard',
  showDetailsCard = true,
}) => {
  const stage = getBaobabBiologicalStage(days);
  const [circadianTime, setCircadianTime] = useState<CircadianTime>('dawn');
  const [isManualOverride, setIsManualOverride] = useState(false);

  useEffect(() => {
    if (!isManualOverride) {
      const currentHour = new Date().getHours();
      setCircadianTime(getCircadianFromHour(currentHour));
    }
  }, [isManualOverride]);

  // Dimensions
  const dim = size === 'compact' ? 140 : size === 'hero' ? 240 : 190;

  // Sky gradients and theme colors
  const skyThemes = {
    dawn: {
      bg: 'from-[#1B2A41] via-[#4A3229] to-[#D4A24C]/40',
      sunColor: '#FFE194',
      sunGlow: '#D4A24C',
      soil: '#9E4A28',
      label: 'Aube claire',
    },
    day: {
      bg: 'from-[#22485C] via-[#3E6F74] to-[#FAF4EA]',
      sunColor: '#FFF4CC',
      sunGlow: '#E5A93C',
      soil: '#A8522E',
      label: 'Plein jour',
    },
    dusk: {
      bg: 'from-[#1A1A32] via-[#5A2C38] to-[#C96A3F]/50',
      sunColor: '#FFB877',
      sunGlow: '#C96A3F',
      soil: '#73331D',
      label: 'Crépuscule doré',
    },
    night: {
      bg: 'from-[#0A1118] via-[#101E2E] to-[#1B2A41]',
      sunColor: '#E6EFF8',
      sunGlow: '#7EA2C7',
      soil: '#3B2418',
      label: 'Nuit sereine',
    },
  };

  const currentTheme = skyThemes[circadianTime];

  return (
    <div className="w-full flex flex-col items-center">
      {/* Conteneur de l'illustration vivante */}
      <div
        className="relative w-full rounded-3xl overflow-hidden border border-[#1B2A41]/10 shadow-sm transition-all duration-700"
        style={{ maxWidth: size === 'hero' ? '420px' : '360px' }}
      >
        {/* Voûte céleste circadienne adaptative */}
        <div
          className={`absolute inset-0 bg-gradient-to-b ${currentTheme.bg} transition-all duration-700`}
        />

        {/* Étoiles pour la nuit et l'aube */}
        {(circadianTime === 'night' || circadianTime === 'dawn') && (
          <div className="absolute inset-0 pointer-events-none opacity-60">
            <div className="absolute top-4 left-8 h-1 w-1 rounded-full bg-white animate-pulse" />
            <div className="absolute top-10 right-14 h-1.5 w-1.5 rounded-full bg-amber-100" />
            <div className="absolute top-14 left-1/3 h-1 w-1 rounded-full bg-white opacity-40" />
            <div className="absolute top-6 right-1/3 h-1 w-1 rounded-full bg-white opacity-70" />
            <div className="absolute top-16 right-8 h-1.5 w-1.5 rounded-full bg-amber-200 animate-pulse" />
          </div>
        )}

        {/* Astre solaire ou lunaire selon le cycle */}
        <motion.div
          key={circadianTime}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute pointer-events-none"
          style={{
            top: circadianTime === 'night' ? '18%' : '20%',
            right: circadianTime === 'night' ? '22%' : '24%',
          }}
        >
          {circadianTime === 'night' ? (
            /* Croissant de lune paisible */
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
                fill="#E8EFF8"
                opacity="0.9"
              />
            </svg>
          ) : (
            /* Disque solaire bienveillant avec aura diffuse */
            <div className="relative flex items-center justify-center">
              <div
                className="h-16 w-16 rounded-full blur-md"
                style={{ backgroundColor: currentTheme.sunGlow, opacity: 0.4 }}
              />
              <div
                className="absolute h-9 w-9 rounded-full shadow-inner"
                style={{ backgroundColor: currentTheme.sunColor }}
              />
            </div>
          )}
        </motion.div>

        {/* Zone de dessin SVG du Baobab biologique réaliste */}
        <div className="relative z-10 flex flex-col items-center justify-end pt-4 pb-2">
          <svg
            width={dim}
            height={dim}
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-md"
          >
            <defs>
              {/* Dégradé écorce réaliste texturée */}
              <linearGradient id="barkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#1B2B24" />
                <stop offset="30%" stop-color="#2D4539" />
                <stop offset="60%" stop-color="#466958" />
                <stop offset="85%" stop-color="#345042" />
                <stop offset="100%" stop-color="#17241E" />
              </linearGradient>

              {/* Dégradé de la canopée / feuilles */}
              <radialGradient id="foliageDenseGrad" cx="50%" cy="40%" r="55%">
                <stop offset="0%" stop-color="#73A38F" />
                <stop offset="50%" stop-color="#4B7765" />
                <stop offset="85%" stop-color="#284A3D" />
                <stop offset="100%" stop-color="#162E25" />
              </radialGradient>

              {/* Dégradé de terre latéritique riche */}
              <linearGradient id="soilLayerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color={currentTheme.soil} />
                <stop offset="50%" stop-color="#6B2E18" />
                <stop offset="100%" stop-color="#38170B" />
              </linearGradient>

              <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.25" />
              </filter>
            </defs>

            {/* STRATE DE TERRE ET SOL NOURRICIER */}
            <path
              d="M10 178 C 50 172, 100 175, 150 171 C 175 169, 195 174, 200 176 L200 200 L0 200 L0 177 Z"
              fill="url(#soilLayerGrad)"
            />
            {/* Ligne d'horizon de terre cuite avec cailloutis d'argile */}
            <path
              d="M10 178 Q 100 173 190 176"
              stroke="#D4A24C"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.5"
            />

            {/* STADE 1 : Graine en germination */}
            {stage.level === 1 && (
              <g id="baobab-stage-1">
                {/* Racine pivotante qui s'enfonce dans le sol */}
                <path
                  d="M100 175 C 98 182, 103 188, 101 194"
                  stroke="#E5BA6C"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {/* La graine d'Adansonia réniforme */}
                <ellipse cx="100" cy="172" rx="7.5" ry="5.5" fill="#8B4513" stroke="#4A2508" strokeWidth="1.2" />
                <ellipse cx="98" cy="171" rx="4" ry="2.5" fill="#C96A3F" />
                {/* Première tigelle émergeant avec perle de rosée */}
                <path
                  d="M100 168 C 100 160, 104 154, 107 148"
                  stroke="#5C8B7A"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                {/* Deux petites folioles naissantes */}
                <path
                  d="M107 148 C 102 144, 98 147, 95 150 C 99 152, 104 151, 107 148 Z"
                  fill="#78A594"
                />
                <path
                  d="M107 148 C 112 144, 116 147, 119 150 C 115 152, 110 151, 107 148 Z"
                  fill="#78A594"
                />
                {/* Perle d'eau étincelante */}
                <circle cx="107" cy="147" r="1.8" fill="#FAF4EA" opacity="0.9" />
              </g>
            )}

            {/* STADE 2 : Jeune pousse avec cotylédons */}
            {stage.level === 2 && (
              <g id="baobab-stage-2">
                {/* Réseau de radicelles */}
                <path d="M100 175 Q 92 186 86 193" stroke="#9E6138" strokeWidth="2" strokeLinecap="round" />
                <path d="M100 175 Q 107 187 114 194" stroke="#9E6138" strokeWidth="2" strokeLinecap="round" />
                {/* Tige vigoureuse évasée à la base */}
                <path
                  d="M97 175 C 97 155, 98 135, 100 120 C 102 135, 103 155, 103 175 Z"
                  fill="#456C5B"
                />
                {/* Ramification haute */}
                <path
                  d="M100 135 C 93 125, 85 120, 78 116"
                  stroke="#456C5B"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                />
                <path
                  d="M100 130 C 107 122, 115 118, 122 115"
                  stroke="#456C5B"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                />
                <path
                  d="M100 120 C 100 110, 101 102, 100 95"
                  stroke="#456C5B"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {/* Feuilles palmées du jeune baobab */}
                <ellipse cx="74" cy="114" rx="10" ry="5.5" transform="rotate(-20 74 114)" fill="#689E88" />
                <ellipse cx="126" cy="113" rx="10" ry="5.5" transform="rotate(20 126 113)" fill="#689E88" />
                <ellipse cx="100" cy="92" rx="7" ry="9" fill="#78AB95" />
                <ellipse cx="88" cy="125" rx="7" ry="4" transform="rotate(-15 88 125)" fill="#4E7B6A" />
                <ellipse cx="112" cy="123" rx="7" ry="4" transform="rotate(15 112 123)" fill="#4E7B6A" />
              </g>
            )}

            {/* STADE 3 : Jeune arbre avec tronc caractéristique qui renfle */}
            {stage.level === 3 && (
              <g id="baobab-stage-3">
                {/* Racines d'ancrage visibles au sol */}
                <path d="M88 177 C 82 176, 75 180, 68 184" stroke="#2B4237" strokeWidth="3" strokeLinecap="round" />
                <path d="M112 177 C 118 176, 125 180, 132 184" stroke="#2B4237" strokeWidth="3" strokeLinecap="round" />
                {/* Tronc renflé (bouteille conique) */}
                <path
                  d="M87 176 C 85 152, 90 130, 93 115 C 88 105, 80 96, 74 88 C 79 90, 89 95, 95 105 C 97 95, 99 82, 100 75 C 102 83, 103 95, 105 105 C 111 95, 121 90, 126 88 C 120 96, 112 105, 107 115 C 110 130, 115 152, 113 176 Z"
                  fill="url(#barkGradient)"
                />
                {/* Textures d'écorce horizontales */}
                <path d="M93 150 Q 100 146 107 150" stroke="#7BA896" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
                <path d="M91 162 Q 100 157 109 162" stroke="#7BA896" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
                <path d="M95 135 Q 100 132 105 135" stroke="#7BA896" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
                {/* Grappes de canopée dense */}
                <ellipse cx="100" cy="74" rx="22" ry="14" fill="url(#foliageDenseGrad)" />
                <ellipse cx="76" cy="85" rx="16" ry="11" fill="url(#foliageDenseGrad)" />
                <ellipse cx="124" cy="85" rx="16" ry="11" fill="url(#foliageDenseGrad)" />
              </g>
            )}

            {/* STADE 4 : Baobab vigoureux & tronc massif en bouteille */}
            {stage.level === 4 && (
              <g id="baobab-stage-4">
                {/* Contreforts puissants dans la latérite */}
                <path d="M78 177 C 70 178, 60 182, 52 188" stroke="#1D2E26" strokeWidth="5" strokeLinecap="round" />
                <path d="M122 177 C 130 178, 140 182, 148 188" stroke="#1D2E26" strokeWidth="5" strokeLinecap="round" />
                {/* Tronc massif caractéristique */}
                <path
                  d="M78 176 C 74 150, 80 120, 88 100 C 80 90, 68 80, 56 70 C 65 72, 78 78, 88 88 C 91 76, 94 62, 95 52 C 98 62, 101 76, 104 88 C 114 78, 127 72, 136 70 C 124 80, 112 90, 104 100 C 112 120, 118 150, 114 176 Z"
                  fill="url(#barkGradient)"
                  filter="url(#softShadow)"
                />
                {/* Rides et plis d'écorce volumétriques */}
                <g stroke="#8DB8A6" strokeWidth="1.2" strokeLinecap="round" opacity="0.5">
                  <path d="M86 155 Q 96 148 106 155" />
                  <path d="M84 140 Q 96 133 108 140" />
                  <path d="M85 168 Q 96 162 107 168" />
                  <path d="M89 122 Q 96 117 103 122" />
                </g>
                {/* Canopée étagée sculptée */}
                <ellipse cx="96" cy="54" rx="34" ry="18" fill="url(#foliageDenseGrad)" />
                <ellipse cx="62" cy="68" rx="24" ry="14" fill="url(#foliageDenseGrad)" />
                <ellipse cx="130" cy="68" rx="24" ry="14" fill="url(#foliageDenseGrad)" />
                <ellipse cx="44" cy="78" rx="14" ry="9" fill="#3B6255" opacity="0.9" />
                <ellipse cx="148" cy="78" rx="14" ry="9" fill="#3B6255" opacity="0.9" />
                {/* Oiseaux de liberté planant près de la cime */}
                <g stroke="#FAF4EA" strokeWidth="1.3" strokeLinecap="round" opacity="0.85" fill="none">
                  <path d="M30 45 Q 34 40 38 45 Q 42 40 46 45" />
                  <path d="M148 38 Q 152 34 156 38 Q 160 34 164 38" />
                </g>
              </g>
            )}

            {/* STADE 5 : Grand Baobab Séculaire (Monument de dignité) */}
            {stage.level === 5 && (
              <g id="baobab-stage-5">
                {/* Immense assise racinaire séculaire */}
                <path d="M68 177 C 56 179, 42 184, 30 191" stroke="#16251E" strokeWidth="7" strokeLinecap="round" />
                <path d="M132 177 C 144 179, 158 184, 170 191" stroke="#16251E" strokeWidth="7" strokeLinecap="round" />
                <path d="M96 177 C 98 184, 102 189, 100 196" stroke="#1D3027" strokeWidth="4" strokeLinecap="round" />
                {/* Tronc titanesque multi-séculaire avec contreforts sculptés */}
                <path
                  d="M68 176 C 62 145, 70 110, 82 86 C 72 74, 55 64, 40 54 C 54 56, 70 64, 82 74 C 86 60, 92 46, 95 34 C 99 46, 105 60, 109 74 C 121 64, 137 56, 151 54 C 136 64, 119 74, 109 86 C 121 110, 129 145, 123 176 Z"
                  fill="url(#barkGradient)"
                  filter="url(#softShadow)"
                />
                {/* Cavité sacrée naturelle du baobab centenaire */}
                <ellipse cx="95" cy="155" rx="7.5" ry="12" fill="#0E1713" opacity="0.9" />
                <path d="M95 144 C 92 149, 92 161, 95 166" stroke="#D4A24C" strokeWidth="1" opacity="0.5" />
                {/* Écorce striée d'histoire et de lumière */}
                <g stroke="#A2CCBB" strokeWidth="1.4" strokeLinecap="round" opacity="0.55">
                  <path d="M78 150 Q 94 142 113 150" />
                  <path d="M75 135 Q 95 126 116 135" />
                  <path d="M80 165 Q 95 158 112 165" />
                  <path d="M82 115 Q 95 108 108 115" />
                  <path d="M85 98 Q 95 92 105 98" />
                </g>
                {/* Somptueuse canopée étalée */}
                <g opacity="0.95">
                  <ellipse cx="95" cy="38" rx="42" ry="22" fill="url(#foliageDenseGrad)" />
                  <ellipse cx="50" cy="52" rx="30" ry="17" fill="url(#foliageDenseGrad)" />
                  <ellipse cx="140" cy="52" rx="30" ry="17" fill="url(#foliageDenseGrad)" />
                  <ellipse cx="28" cy="64" rx="18" ry="11" fill="#3B6255" />
                  <ellipse cx="162" cy="64" rx="18" ry="11" fill="#3B6255" />
                </g>
                {/* Halo d'or au sommet de la cime */}
                <path
                  d="M 50 40 Q 95 24 140 40"
                  stroke="#FFE294"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  opacity="0.8"
                  fill="none"
                />
                {/* Oiseaux libres volant en V majestueux */}
                <g stroke="#FAF4EA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.9">
                  <path d="M 22 34 Q 26 29 30 34 Q 34 29 38 34" />
                  <path d="M 152 26 Q 157 21 162 26 Q 167 21 172 26" />
                  <path d="M 166 38 Q 170 34 174 38 Q 178 34 182 38" />
                </g>
              </g>
            )}
          </svg>
        </div>

        {/* Sélecteur de moment circadien discret & interactif */}
        <div className="relative z-20 flex items-center justify-between px-4 py-2 border-t border-white/10 bg-black/25 backdrop-blur-xs text-white">
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-semibold tracking-wide">
              {currentTheme.label}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {(['dawn', 'day', 'dusk', 'night'] as CircadianTime[]).map((timeKey) => (
              <button
                key={timeKey}
                type="button"
                onClick={() => {
                  setIsManualOverride(true);
                  setCircadianTime(timeKey);
                }}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-medium transition-all ${
                  circadianTime === timeKey
                    ? 'bg-white/25 text-white font-bold'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                {timeKey === 'dawn' ? 'Aube' : timeKey === 'day' ? 'Jour' : timeKey === 'dusk' ? 'Soir' : 'Nuit'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Carte descriptive biologique et neuro-scientifique */}
      {showDetailsCard && (
        <div className="mt-3 w-full rounded-2xl border border-[#1B2A41]/10 bg-white p-4 shadow-xs text-left">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C96A3F]">
                Stade {stage.level} / 5
              </span>
              <h3
                style={{ fontFamily: 'var(--font-heading, sans-serif)' }}
                className="text-base font-bold text-[#1B2A41]"
              >
                {stage.stageName}
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[#5B6779] italic">
              {stage.scientificName}
            </span>
          </div>

          <p className="mt-1.5 text-xs text-[#5B6779] leading-relaxed">
            {stage.subtitle}
          </p>

          {/* Jauge de progression vers le prochain stade */}
          {stage.level < 5 && (
            <div className="mt-3 pt-3 border-t border-[#1B2A41]/5">
              <div className="flex justify-between text-[11px] mb-1">
                <span className="font-semibold text-[#1B2A41]">
                  Prochaine ramification
                </span>
                <span className="font-bold text-[#3B6255]">
                  {days} / {stage.nextMilestoneDays} j ({stage.progressPercent}%)
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-[#FAF4EA] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stage.progressPercent}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-[#3B6255] to-[#D4A24C]"
                />
              </div>
            </div>
          )}

          {/* Impact neurobiologique réel prouvé */}
          <div className="mt-3 rounded-xl bg-[#FAF4EA] p-3 border border-[#1B2A41]/5">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#3B6255]">
                Impact neurobiologique réel
              </span>
            </div>
            <p className="text-[11px] text-[#1B2A41]/85 leading-relaxed">
              {stage.neuroBiology}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
