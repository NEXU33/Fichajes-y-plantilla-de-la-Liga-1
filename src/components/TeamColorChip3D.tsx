import React from 'react';

interface TeamColorChip3DProps {
  primaryColor: string;
  secondaryColor?: string;
  teamName?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

// Helper to lighten/darken hex colors
function adjustColor(hex: string, amount: number): string {
  let col = hex.replace('#', '').trim();
  if (col.length === 3) {
    col = col.split('').map((c) => c + c).join('');
  }
  const num = parseInt(col, 16);
  if (isNaN(num)) return hex;

  let r = (num >> 16) + amount;
  let g = ((num >> 8) & 0x00ff) + amount;
  let b = (num & 0x0000ff) + amount;

  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

// Helper to compute contrast color (dark or light)
function getContrastColor(hex: string): string {
  let col = hex.replace('#', '').trim();
  if (col.length === 3) {
    col = col.split('').map((c) => c + c).join('');
  }
  const num = parseInt(col, 16);
  if (isNaN(num)) return '#FFFFFF';

  const r = num >> 16;
  const g = (num >> 8) & 0x00ff;
  const b = num & 0x0000ff;

  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 165 ? '#0F172A' : '#FFFFFF';
}

export const TeamColorChip3D: React.FC<TeamColorChip3DProps> = ({
  primaryColor,
  secondaryColor,
  teamName,
  size = 'md',
  showLabel = false,
  className = '',
}) => {
  const safePrimary = primaryColor && primaryColor.startsWith('#') ? primaryColor : '#C8102E';
  const lightColor = adjustColor(safePrimary, 45);
  const darkColor = adjustColor(safePrimary, -55);
  const deepEdge = adjustColor(safePrimary, -80);
  const contrastColor = getContrastColor(safePrimary);

  // Size dimensions
  const sizeMap = {
    xs: { dim: 26, inner: 18, iconSize: 11, border: 1.5, text: 'text-[9px]' },
    sm: { dim: 34, inner: 24, iconSize: 14, border: 2, text: 'text-[10px]' },
    md: { dim: 46, inner: 34, iconSize: 18, border: 2.5, text: 'text-xs' },
    lg: { dim: 64, inner: 48, iconSize: 26, border: 3, text: 'text-sm' },
  };

  const config = sizeMap[size] || sizeMap.md;

  return (
    <div
      className={`inline-flex items-center gap-2.5 select-none ${className}`}
      title={teamName ? `Ficha 3D: Camiseta oficial de ${teamName} (${safePrimary})` : `Ficha 3D Color Oficial: ${safePrimary}`}
    >
      {/* 3D Chip Cylinder Wrapper with 3D Tilt perspective */}
      <div
        className="relative group cursor-pointer transition-transform duration-300 ease-out transform hover:scale-110 hover:-translate-y-1"
        style={{ width: config.dim, height: config.dim }}
      >
        {/* Soft 3D base drop shadow beneath chip */}
        <div
          className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4/5 h-2 rounded-full opacity-60 blur-[2px] transition-all group-hover:opacity-80 group-hover:blur-[3px] group-hover:w-[90%]"
          style={{ backgroundColor: deepEdge }}
        />

        {/* Outer 3D Rim / Coin Edge */}
        <div
          className="absolute inset-0 rounded-full flex items-center justify-center transition-shadow duration-300"
          style={{
            background: `linear-gradient(135deg, ${lightColor} 0%, ${safePrimary} 45%, ${deepEdge} 100%)`,
            boxShadow: `
              0 6px 12px -1px rgba(0, 0, 0, 0.55),
              0 3px 6px -1px rgba(0, 0, 0, 0.35),
              inset 0 3px 4px rgba(255, 255, 255, 0.5),
              inset 0 -3px 5px rgba(0, 0, 0, 0.6)
            `,
            border: `${config.border}px solid ${lightColor}`,
          }}
        >
          {/* Milled Decorative Perforation Ring */}
          <div
            className="absolute inset-[3px] rounded-full border border-dashed pointer-events-none opacity-40 transition-opacity group-hover:opacity-60"
            style={{ borderColor: contrastColor }}
          />

          {/* Secondary Color Outer Accent Ring (if secondaryColor is provided) */}
          {secondaryColor && secondaryColor.startsWith('#') && (
            <div
              className="absolute inset-[5px] rounded-full opacity-70 pointer-events-none"
              style={{
                border: `1.5px solid ${secondaryColor}`,
                boxShadow: `0 0 4px ${secondaryColor}66`,
              }}
            />
          )}

          {/* Inner Convex Face */}
          <div
            className="relative rounded-full flex items-center justify-center overflow-hidden transition-transform duration-200"
            style={{
              width: config.inner,
              height: config.inner,
              background: `radial-gradient(circle at 35% 30%, ${lightColor} 0%, ${safePrimary} 65%, ${darkColor} 100%)`,
              boxShadow: `
                inset 0 2px 4px rgba(255, 255, 255, 0.65),
                inset 0 -2px 4px rgba(0, 0, 0, 0.55)
              `,
            }}
          >
            {/* Top Gloss Sheen Overlay */}
            <div className="absolute -top-1/3 left-0 right-0 h-3/4 bg-gradient-to-b from-white/40 via-white/10 to-transparent rounded-full pointer-events-none transform -rotate-12" />

            {/* Embossed Jersey Icon in Center */}
            <svg
              viewBox="0 0 24 24"
              fill={contrastColor}
              style={{
                width: config.iconSize,
                height: config.iconSize,
                filter: `drop-shadow(0 1px 1px rgba(0,0,0,0.5))`,
                opacity: 0.92,
              }}
              className="transform group-hover:scale-110 transition-transform"
            >
              {/* Stylized Football Jersey / Camiseta */}
              <path d="M8 2a2 2 0 0 0-2 2v1.27c-1.3.43-2.3 1.5-2.73 2.87L2.1 11.8a1 1 0 0 0 1.25 1.25l2.65-.8V20a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-7.75l2.65.8a1 1 0 0 0 1.25-1.25l-1.17-3.66c-.43-1.37-1.43-2.44-2.73-2.87V4a2 2 0 0 0-2-2h-8zm2 2h4a2 2 0 0 1-4 0z" />
            </svg>

            {/* Specular Glint Reflection Dot */}
            <div className="absolute top-1 left-2 w-1.5 h-1 rounded-full bg-white/70 blur-[0.3px]" />
          </div>
        </div>
      </div>

      {/* Optional Descriptive Label */}
      {showLabel && (
        <div className="flex flex-col leading-none">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Ficha 3D
          </span>
          <span
            className={`font-black ${config.text} text-white flex items-center gap-1 mt-0.5`}
          >
            Camiseta Principal
          </span>
        </div>
      )}
    </div>
  );
};
