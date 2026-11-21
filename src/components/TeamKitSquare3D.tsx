import React, { useState } from 'react';
import { getTeamKitConfig } from '../utils/teamKits2026';

interface TeamKitSquare3DProps {
  primaryColor: string;
  shortsColor: string;
  teamName: string;
  logoUrl?: string;
  size?: 'sm' | 'md' | 'lg';
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

// Generate team initials for fallback badge
function getTeamInitials(name: string): string {
  const clean = name.replace(/^(Club|Asociación Deportiva|CD|FBC|FC)\s+/i, '').trim();
  const words = clean.split(' ').filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return clean.slice(0, 2).toUpperCase();
}

export const TeamKitSquare3D: React.FC<TeamKitSquare3DProps> = ({
  primaryColor,
  shortsColor,
  teamName,
  logoUrl,
  size = 'md',
  className = '',
}) => {
  const [logoFailed, setLogoFailed] = useState(false);

  const safePrimary = primaryColor && primaryColor.startsWith('#') ? primaryColor : '#800020';
  const safeShorts = shortsColor && shortsColor.startsWith('#') ? shortsColor : '#FFFFFF';

  const primaryLight = adjustColor(safePrimary, 40);
  const primaryDark = adjustColor(safePrimary, -50);
  const shortsLight = adjustColor(safeShorts, 30);
  const shortsDark = adjustColor(safeShorts, -40);

  const contrastJersey = getContrastColor(safePrimary);
  const contrastShorts = getContrastColor(safeShorts);

  const sizeMap = {
    sm: { box: 'w-12 h-12', rounded: 'rounded-xl', icon: 14, text: 'text-[10px]' },
    md: { box: 'w-14 h-14', rounded: 'rounded-2xl', icon: 18, text: 'text-xs' },
    lg: { box: 'w-16 h-16', rounded: 'rounded-2xl', icon: 22, text: 'text-sm' },
  };

  const dim = sizeMap[size] || sizeMap.md;
  const initials = getTeamInitials(teamName || 'L1');
  const kitConfig = getTeamKitConfig(teamName || '');

  return (
    <div
      className={`relative group select-none flex-shrink-0 ${dim.box} ${className}`}
      title={`Indumentaria Oficial de ${teamName}: Camiseta (${safePrimary}) • Short (${safeShorts})`}
    >
      {/* 3D Drop Shadow Base */}
      <div
        className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-[85%] h-2.5 rounded-full blur-[3px] opacity-65 group-hover:opacity-85 group-hover:blur-[4px] group-hover:w-[92%] transition-all duration-300 -z-10"
        style={{ backgroundColor: primaryDark }}
      />

      {/* 3D Chunky Box Container with Physical Depth */}
      <div
        className={`relative w-full h-full ${dim.rounded} overflow-hidden transition-all duration-300 ease-out transform group-hover:scale-105 group-hover:-translate-y-1 group-hover:rotate-1`}
        style={{
          boxShadow: `
            0 10px 20px -3px rgba(0, 0, 0, 0.75),
            0 4px 6px -2px rgba(0, 0, 0, 0.45),
            inset 0 2px 3px rgba(255, 255, 255, 0.5),
            inset 0 -3px 4px rgba(0, 0, 0, 0.75)
          `,
          border: '1.5px solid rgba(255, 255, 255, 0.25)',
        }}
      >
        {/* Top Half: CAMISETA PRINCIPAL (60% height) with 2-color pattern & collar border */}
        <div
          className="relative w-full h-[58%] flex items-center justify-center overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${primaryLight} 0%, ${safePrimary} 60%, ${primaryDark} 100%)`,
          }}
        >
          {/* Top Collar Border Band */}
          <div
            className="absolute top-0 left-0 right-0 h-1.5 z-20 pointer-events-none"
            style={{
              backgroundColor: kitConfig.collarColor,
              boxShadow: '0 1px 2px rgba(0,0,0,0.4)',
            }}
          />

          {/* Sleeve Cuff Accent Borders on Lateral Edges */}
          <div
            className="absolute top-1/4 bottom-1/4 left-0 w-1 rounded-r z-20 pointer-events-none"
            style={{ backgroundColor: kitConfig.cuffColor }}
          />
          <div
            className="absolute top-1/4 bottom-1/4 right-0 w-1 rounded-l z-20 pointer-events-none"
            style={{ backgroundColor: kitConfig.cuffColor }}
          />

          {/* 2-Color Torso Pattern Overlay */}
          {kitConfig.pattern === 'stripes' && (
            <div className="absolute inset-0 pointer-events-none flex opacity-85">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-full flex-1"
                  style={{
                    backgroundColor: i % 2 === 1 ? kitConfig.secondaryColor : 'transparent',
                  }}
                />
              ))}
            </div>
          )}

          {kitConfig.pattern === 'sash' && (
            <div
              className="absolute -top-4 -bottom-4 w-3.5 pointer-events-none opacity-95 shadow-md"
              style={{
                left: '38%',
                backgroundColor: kitConfig.secondaryColor,
                transform: 'rotate(-38deg)',
              }}
            />
          )}

          {kitConfig.pattern === 'halves' && (
            <div
              className="absolute top-0 bottom-0 left-0 w-1/2 pointer-events-none opacity-95"
              style={{ backgroundColor: kitConfig.secondaryColor }}
            />
          )}

          {kitConfig.pattern === 'hoops' && (
            <div className="absolute inset-0 pointer-events-none flex flex-col justify-around py-1 opacity-80">
              <div className="h-1 w-full" style={{ backgroundColor: kitConfig.secondaryColor }} />
              <div className="h-1 w-full" style={{ backgroundColor: kitConfig.secondaryColor }} />
            </div>
          )}

          {kitConfig.pattern === 'shoulder_panels' && (
            <div
              className="absolute top-0 left-0 right-0 h-2.5 pointer-events-none opacity-90"
              style={{ backgroundColor: kitConfig.secondaryColor }}
            />
          )}

          {/* Top gloss reflection highlight */}
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/35 to-transparent pointer-events-none z-10" />

          {/* Jersey Icon in relief */}
          <svg
            viewBox="0 0 24 24"
            fill={contrastJersey}
            style={{
              width: dim.icon,
              height: dim.icon,
              filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.6))',
              opacity: 0.95,
            }}
            className="relative z-10 transform group-hover:scale-110 transition-transform"
          >
            <path d="M8 2a2 2 0 0 0-2 2v1.27c-1.3.43-2.3 1.5-2.73 2.87L2.1 11.8a1 1 0 0 0 1.25 1.25l2.65-.8V20a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-7.75l2.65.8a1 1 0 0 0 1.25-1.25l-1.17-3.66c-.43-1.37-1.43-2.44-2.73-2.87V4a2 2 0 0 0-2-2h-8zm2 2h4a2 2 0 0 1-4 0z" />
          </svg>

          {/* Light spec glint on top left corner */}
          <div className="absolute top-1 left-1.5 w-2 h-1 rounded-full bg-white/60 blur-[0.4px] pointer-events-none z-20" />
        </div>

        {/* 3D Seam Divider Line with Embossed Shadow */}
        <div
          className="relative w-full h-[3px] z-10"
          style={{
            background: 'linear-gradient(90deg, rgba(255,255,255,0.4) 0%, rgba(0,0,0,0.6) 100%)',
            boxShadow: '0 1px 2px rgba(0,0,0,0.7)',
          }}
        />

        {/* Bottom Half: SHORT PRINCIPAL (42% height) */}
        <div
          className="relative w-full h-[42%] flex items-center justify-center overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${shortsLight} 0%, ${safeShorts} 60%, ${shortsDark} 100%)`,
          }}
        >
          {/* Subtle Shorts Icon / Silhouette */}
          <svg
            viewBox="0 0 24 24"
            fill={contrastShorts}
            style={{
              width: dim.icon * 0.85,
              height: dim.icon * 0.85,
              filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.4))',
              opacity: 0.9,
            }}
            className="transform group-hover:scale-105 transition-transform"
          >
            {/* Stylized Shorts Shape */}
            <path d="M6 3h12a1 1 0 0 1 1 1v10a1 1 0 0 1-.8 1l-4.2-1.5-2 3.5a1 1 0 0 1-1.74 0l-2-3.5L5.8 15A1 1 0 0 1 5 14V4a1 1 0 0 1 1-1z" />
          </svg>

          {/* Bottom bevel shadow edge */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40 pointer-events-none" />
        </div>

        {/* Optional Logo Overlay in Center (if logo is available and loaded) */}
        {logoUrl && !logoFailed && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-1.5">
            <img
              src={logoUrl}
              alt=""
              className="max-w-[70%] max-h-[70%] object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] opacity-95 group-hover:scale-110 transition-transform"
              onError={() => setLogoFailed(true)}
            />
          </div>
        )}

        {/* Team Initials Badge if logo failed or absent and box has no logo */}
        {(!logoUrl || logoFailed) && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span
              className={`font-black ${dim.text} tracking-wider px-1 py-0.5 rounded-md bg-black/40 backdrop-blur-[2px] text-white border border-white/20 shadow-md transform group-hover:scale-105 transition-transform`}
            >
              {initials}
            </span>
          </div>
        )}

        {/* Diagonal Gloss Sheen Overlay covering the entire 3D block */}
        <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-br from-white/25 via-transparent to-transparent pointer-events-none transform -rotate-45" />
      </div>
    </div>
  );
};
