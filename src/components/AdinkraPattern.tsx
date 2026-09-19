import React from 'react';

interface PatternProps {
  className?: string;
  opacity?: number;
}

export const AdinkraPattern: React.FC<PatternProps> = ({
  className = '',
  opacity = 0.04,
}) => (
  <div
    className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    style={{ opacity }}
    aria-hidden="true"
  >
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern
          id="adinkra-grid"
          width="80"
          height="80"
          patternUnits="userSpaceOnUse"
        >
          {/* Symbole Gye Nyame & chevrons Bogolan stylisés */}
          <path
            d="M20 10 L40 30 L60 10"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M20 70 L40 50 L60 70"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="40" cy="40" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M40 24 V34 M40 46 V56 M24 40 H34 M46 40 H56"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M10 20 L30 40 L10 60"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
          />
          <path
            d="M70 20 L50 40 L70 60"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#adinkra-grid)" />
    </svg>
  </div>
);
