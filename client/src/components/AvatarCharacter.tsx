import type { Avatar } from '../types';

const HAIR_COLORS: Record<string, string> = {
  brown: '#5D4037',
  blonde: '#F5DEB3',
  black: '#1a1a1a',
  red: '#C62828',
};

const TOP_COLORS: Record<string, string> = {
  default: '#7C3AED',
  red: '#EF4444',
  blue: '#3B82F6',
  green: '#22C55E',
  purple: '#A855F7',
};

const BOTTOM_COLORS: Record<string, string> = {
  default: '#1E40AF',
  jeans: '#2563EB',
  shorts: '#0EA5E9',
  skirt: '#EC4899',
};

const SHOE_COLORS: Record<string, string> = {
  default: '#374151',
  sneakers: '#F97316',
  boots: '#78350F',
  sandals: '#FBBF24',
};

interface Props {
  gender: 'boy' | 'girl';
  avatar: Avatar;
  size?: number;
}

export function AvatarCharacter({ gender, avatar, size = 160 }: Props) {
  const hairColor = HAIR_COLORS[avatar.hair] || HAIR_COLORS.brown;
  const isGirl = gender === 'girl';
  const hairLong = avatar.hairStyle === 'long' || avatar.hairStyle === 'curly';

  return (
    <svg viewBox="0 0 120 200" width={size} height={size * 1.67} className="avatar-svg">
      {/* Shoes */}
      <ellipse cx="42" cy="188" rx="14" ry="6" fill={SHOE_COLORS[avatar.shoes] || SHOE_COLORS.default} />
      <ellipse cx="78" cy="188" rx="14" ry="6" fill={SHOE_COLORS[avatar.shoes] || SHOE_COLORS.default} />
      {/* Legs */}
      <rect x="38" y="145" width="14" height="42" rx="4" fill={avatar.skin} />
      <rect x="68" y="145" width="14" height="42" rx="4" fill={avatar.skin} />
      {/* Bottom */}
      {avatar.bottom === 'skirt' && isGirl ? (
        <path d="M35 115 L85 115 L95 150 L25 150 Z" fill={BOTTOM_COLORS.skirt} />
      ) : (
        <rect x="35" y="115" width="50" height="35" rx="6" fill={BOTTOM_COLORS[avatar.bottom] || BOTTOM_COLORS.default} />
      )}
      {/* Top */}
      <rect x="32" y="78" width="56" height="42" rx="10" fill={TOP_COLORS[avatar.top] || TOP_COLORS.default} />
      {/* Arms */}
      <rect x="18" y="82" width="14" height="38" rx="6" fill={avatar.skin} />
      <rect x="88" y="82" width="14" height="38" rx="6" fill={avatar.skin} />
      {/* Head */}
      <circle cx="60" cy="52" r="32" fill={avatar.skin} />
      {/* Eyes */}
      <ellipse cx="48" cy="50" rx="4" ry="5" fill="#1a1a1a" />
      <ellipse cx="72" cy="50" rx="4" ry="5" fill="#1a1a1a" />
      <circle cx="49" cy="48" r="1.5" fill="white" />
      <circle cx="73" cy="48" r="1.5" fill="white" />
      {/* Smile */}
      <path d="M48 62 Q60 72 72 62" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
      {/* Hair back */}
      {hairLong && (
        <ellipse cx="60" cy="35" rx="34" ry="28" fill={hairColor} />
      )}
      {/* Hair front */}
      {avatar.hairStyle === 'curly' ? (
        <>
          <circle cx="35" cy="30" r="10" fill={hairColor} />
          <circle cx="50" cy="22" r="10" fill={hairColor} />
          <circle cx="70" cy="22" r="10" fill={hairColor} />
          <circle cx="85" cy="30" r="10" fill={hairColor} />
        </>
      ) : (
        <path
          d={isGirl && hairLong
            ? 'M28 45 Q30 10 60 8 Q90 10 92 45 Q85 55 60 50 Q35 55 28 45'
            : 'M30 40 Q32 18 60 16 Q88 18 90 40 Q82 48 60 44 Q38 48 30 40'}
          fill={hairColor}
        />
      )}
      {/* Accessories */}
      {avatar.accessory === 'glasses' && (
        <>
          <circle cx="48" cy="50" r="10" fill="none" stroke="#374151" strokeWidth="2" />
          <circle cx="72" cy="50" r="10" fill="none" stroke="#374151" strokeWidth="2" />
          <line x1="58" y1="50" x2="62" y2="50" stroke="#374151" strokeWidth="2" />
        </>
      )}
      {avatar.accessory === 'hat' && (
        <ellipse cx="60" cy="22" rx="36" ry="10" fill="#EF4444" />
      )}
      {avatar.accessory === 'bow' && isGirl && (
        <path d="M52 18 L48 8 L56 16 L64 8 L60 18 Z" fill="#EC4899" />
      )}
      {avatar.accessory === 'backpack' && (
        <rect x="82" y="85" width="22" height="35" rx="6" fill="#F59E0B" />
      )}
    </svg>
  );
}
