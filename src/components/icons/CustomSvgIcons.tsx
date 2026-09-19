import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

export const IconFlammeNuru: React.FC<IconProps> = ({
  className = '',
  size = 24,
  strokeWidth = 1.75,
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Flamme asymétrique Nuru inspirée de la braise du soir */}
    <path
      d="M12 2C10.2 5.5 13.5 8.5 11.5 12C10.2 10.2 9.5 8.5 9.5 6C6.5 8.8 5 12.5 5 15.5C5 19.1 8.1 22 12 22C15.9 22 19 19.1 19 15.5C19 11.2 15.5 8 13.8 5C13.2 4 12.6 3 12 2Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 18C10.6 18 9.5 16.9 9.5 15.5C9.5 13.8 11 12.5 12 10.5C13 12.5 14.5 13.8 14.5 15.5C14.5 16.9 13.4 18 12 18Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconBaobab: React.FC<IconProps> = ({
  className = '',
  size = 24,
  strokeWidth = 1.75,
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Silhouette du grand baobab africain : tronc puissant et branches sculptées */}
    <path
      d="M3 21H21"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <path
      d="M8.5 21C8.2 17 9 14.5 10 12C9 10 6 8.5 4.5 6"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15.5 21C15.8 17 15 14.5 14 12C15 10 18 8.5 19.5 6"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 12V6M14 12V6"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <path
      d="M8 6C8 3.8 9.8 2 12 2C14.2 2 16 3.8 16 6"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.5 5C5 3 6.5 2 8 2.5"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <path
      d="M18.5 5C19 3 17.5 2 16 2.5"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </svg>
);

export const IconCalebasse: React.FC<IconProps> = ({
  className = '',
  size = 24,
  strokeWidth = 1.75,
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Récipient calebasse traditionnel pour le journal intime */}
    <path
      d="M10 3H14M10.5 3C10.5 4.5 9 6 8 8C6 11 4.5 14.5 5.5 18C6.5 21 9 22 12 22C15 22 17.5 21 18.5 18C19.5 14.5 18 11 16 8C15 6 13.5 4.5 13.5 3"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.5 15C10 16.5 14 16.5 15.5 15"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </svg>
);

export const IconNoeudAdinkra: React.FC<IconProps> = ({
  className = '',
  size = 24,
  strokeWidth = 1.75,
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Nœud adinkra de sagesse et résilience */}
    <path
      d="M6 12C6 8.7 8.7 6 12 6C15.3 6 18 8.7 18 12C18 15.3 15.3 18 12 18C8.7 18 6 15.3 6 12Z"
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <path
      d="M12 2V6M12 18V22M2 12H6M18 12H22"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <circle cx="12" cy="12" r="2.2" stroke={color} strokeWidth={strokeWidth} />
  </svg>
);

export const IconKalachakraRespiration: React.FC<IconProps> = ({
  className = '',
  size = 24,
  strokeWidth = 1.75,
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Spirale douce de respiration et d'ancrage */}
    <path
      d="M12 3C7 3 3 7 3 12C3 17 7 21 12 21C16.5 21 20.5 17.5 20.5 13C20.5 9 17.5 6 13.5 6C10 6 7 8.5 7 12C7 15 9.5 17 12.5 17C15 17 17 15.5 17 13C17 11 15.5 9.5 13.5 9.5C12 9.5 11 10.5 11 12"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </svg>
);

export const IconLuneTamTam: React.FC<IconProps> = ({
  className = '',
  size = 24,
  strokeWidth = 1.75,
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Croissant de lune protecteur avec motif tambour tam-tam */}
    <path
      d="M20 15.5C18.8 16.5 17.2 17 15.5 17C10.8 17 7 13.2 7 8.5C7 6.8 7.5 5.2 8.5 4C4.8 5.5 2.2 9.2 2.2 13.5C2.2 18.7 6.5 22.8 11.8 22.8C16 22.8 19.6 20 20 15.5Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13 3L16 6M16 3L13 6"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </svg>
);

export const IconSoleilLevant: React.FC<IconProps> = ({
  className = '',
  size = 24,
  strokeWidth = 1.75,
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Soleil d'aube au-dessus de la ligne d'horizon */}
    <path d="M3 18H21" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <path
      d="M6 18C6 14.7 8.7 12 12 12C15.3 12 18 14.7 18 18"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <path d="M12 6V9M5 11L7.5 12.5M19 11L16.5 12.5M8 7L9.5 9M16 7L14.5 9" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </svg>
);

export const IconOiseauLibere: React.FC<IconProps> = ({
  className = '',
  size = 24,
  strokeWidth = 1.75,
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Oiseau en plein essor poétique */}
    <path
      d="M3 14C5.5 13 8 9 9.5 5C11.5 8 14.5 9.5 18 9C15 11 13 13 12 16C11 19 9.5 21 8.5 21C8 20 8.5 18 7.5 16C6 17 4.5 18 3.5 19C4 17 4 15 3 14Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13 7C16 6 19.5 6.5 21.5 8.5"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </svg>
);

export const IconGraine: React.FC<IconProps> = ({
  className = '',
  size = 24,
  strokeWidth = 1.75,
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Graine germée avec sa première étincelle */}
    <path
      d="M12 21C8.5 21 6 18 6 14.5C6 10.5 10 5 12 3C14 5 18 10.5 18 14.5C18 18 15.5 21 12 21Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 21V12M12 12C12 9.5 14 8 16 8"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </svg>
);

export const IconReglagesCustom: React.FC<IconProps> = ({
  className = '',
  size = 24,
  strokeWidth = 1.75,
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="12" cy="12" r="3.5" stroke={color} strokeWidth={strokeWidth} />
    <path
      d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
