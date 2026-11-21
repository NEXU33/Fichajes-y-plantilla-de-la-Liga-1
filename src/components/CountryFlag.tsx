import React from 'react';

interface CountryFlagProps {
  nationality?: string;
  showText?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const EMOJI_FLAGS: Record<string, string> = {
  pe: '🇵🇪',
  ar: '🇦🇷',
  uy: '🇺🇾',
  co: '🇨🇴',
  ec: '🇪🇨',
  py: '🇵🇾',
  cl: '🇨🇱',
  br: '🇧🇷',
  ve: '🇻🇪',
  pa: '🇵🇦',
  bo: '🇧🇴',
  mx: '🇲🇽',
  sv: '🇸🇻',
  it: '🇮🇹',
  pt: '🇵🇹',
  es: '🇪🇸',
  de: '🇩🇪',
  cn: '🇨🇳',
  jp: '🇯🇵',
  kr: '🇰🇷',
  lb: '🇱🇧',
  ps: '🇵🇸',
  sy: '🇸🇾',
  us: '🇺🇸',
};

const COUNTRY_NAMES: Record<string, string> = {
  pe: 'Perú',
  ar: 'Argentina',
  uy: 'Uruguay',
  co: 'Colombia',
  ec: 'Ecuador',
  py: 'Paraguay',
  cl: 'Chile',
  br: 'Brasil',
  ve: 'Venezuela',
  pa: 'Panamá',
  bo: 'Bolivia',
  mx: 'México',
  sv: 'El Salvador',
  it: 'Italia',
  pt: 'Portugal',
  es: 'España',
  de: 'Alemania',
  cn: 'China',
  jp: 'Japón',
  kr: 'Corea del Sur',
  lb: 'Líbano',
  ps: 'Palestina',
  sy: 'Siria',
  us: 'Estados Unidos',
};

const normalizeNationality = (part: string): string => {
  const p = part.trim().toLowerCase();
  if (p.includes('peru')) return 'pe';
  if (p.includes('argentin')) return 'ar';
  if (p.includes('urugua')) return 'uy';
  if (p.includes('colombia')) return 'co';
  if (p.includes('ecuador') || p.includes('ecuatorian')) return 'ec';
  if (p.includes('paragua')) return 'py';
  if (p.includes('chilen') || p.includes('chile')) return 'cl';
  if (p.includes('brasil')) return 'br';
  if (p.includes('venezol')) return 've';
  if (p.includes('panam')) return 'pa';
  if (p.includes('bolivia')) return 'bo';
  if (p.includes('mexic')) return 'mx';
  if (p.includes('salvador')) return 'sv';
  if (p.includes('italia')) return 'it';
  if (p.includes('portugu')) return 'pt';
  if (p.includes('españ')) return 'es';
  if (p.includes('alem')) return 'de';
  if (p.includes('chin')) return 'cn';
  if (p.includes('japon')) return 'jp';
  if (p.includes('surcorea') || p.includes('corea')) return 'kr';
  if (p.includes('liban')) return 'lb';
  if (p.includes('palestin')) return 'ps';
  if (p.includes('siri')) return 'sy';
  if (p.includes('usa') || p.includes('estados unidos')) return 'us';
  return 'pe';
};

// SVG visual render for flags
const FlagSVG: React.FC<{ code: string; width: number; height: number }> = ({ code, width, height }) => {
  switch (code) {
    case 'pe': // Perú (Rojo - Blanco - Rojo)
      return (
        <svg width={width} height={height} viewBox="0 0 30 20" className="rounded-sm overflow-hidden shadow-sm inline-block shrink-0">
          <rect width="10" height="20" fill="#dc2626" />
          <rect x="10" width="10" height="20" fill="#ffffff" />
          <rect x="20" width="10" height="20" fill="#dc2626" />
        </svg>
      );
    case 'ar': // Argentina (Celeste - Blanco - Celeste con sol)
      return (
        <svg width={width} height={height} viewBox="0 0 30 20" className="rounded-sm overflow-hidden shadow-sm inline-block shrink-0">
          <rect width="30" height="6.6" fill="#7dd3fc" />
          <rect y="6.6" width="30" height="6.8" fill="#ffffff" />
          <rect y="13.4" width="30" height="6.6" fill="#7dd3fc" />
          <circle cx="15" cy="10" r="2.2" fill="#f59e0b" />
        </svg>
      );
    case 'uy': // Uruguay (Franjas blancas y azules con sol en cantón)
      return (
        <svg width={width} height={height} viewBox="0 0 30 20" className="rounded-sm overflow-hidden shadow-sm inline-block shrink-0">
          <rect width="30" height="20" fill="#ffffff" />
          <rect y="2.2" width="30" height="2.2" fill="#2563eb" />
          <rect y="6.6" width="30" height="2.2" fill="#2563eb" />
          <rect y="11.1" width="30" height="2.2" fill="#2563eb" />
          <rect y="15.5" width="30" height="2.2" fill="#2563eb" />
          <rect width="12" height="10" fill="#ffffff" />
          <circle cx="6" cy="5" r="2.2" fill="#f59e0b" />
        </svg>
      );
    case 'co': // Colombia (Amarillo 50%, Azul 25%, Rojo 25%)
      return (
        <svg width={width} height={height} viewBox="0 0 30 20" className="rounded-sm overflow-hidden shadow-sm inline-block shrink-0">
          <rect width="30" height="10" fill="#facc15" />
          <rect y="10" width="30" height="5" fill="#1d4ed8" />
          <rect y="15" width="30" height="5" fill="#dc2626" />
        </svg>
      );
    case 'ec': // Ecuador (Amarillo 50%, Azul 25%, Rojo 25% con escudo)
      return (
        <svg width={width} height={height} viewBox="0 0 30 20" className="rounded-sm overflow-hidden shadow-sm inline-block shrink-0">
          <rect width="30" height="10" fill="#facc15" />
          <rect y="10" width="30" height="5" fill="#1d4ed8" />
          <rect y="15" width="30" height="5" fill="#dc2626" />
          <ellipse cx="15" cy="10" rx="2" ry="2.5" fill="#b45309" opacity="0.8" />
        </svg>
      );
    case 'py': // Paraguay (Rojo - Blanco - Azul)
      return (
        <svg width={width} height={height} viewBox="0 0 30 20" className="rounded-sm overflow-hidden shadow-sm inline-block shrink-0">
          <rect width="30" height="6.6" fill="#dc2626" />
          <rect y="6.6" width="30" height="6.8" fill="#ffffff" />
          <rect y="13.4" width="30" height="6.6" fill="#1d4ed8" />
          <circle cx="15" cy="10" r="1.5" fill="#15803d" />
        </svg>
      );
    case 'cl': // Chile (Blanco y Rojo con cantón azul y estrella)
      return (
        <svg width={width} height={height} viewBox="0 0 30 20" className="rounded-sm overflow-hidden shadow-sm inline-block shrink-0">
          <rect width="30" height="10" fill="#ffffff" />
          <rect y="10" width="30" height="10" fill="#dc2626" />
          <rect width="10" height="10" fill="#1d4ed8" />
          <polygon points="5,2 6,5 9,5 6.5,7 7.5,9.5 5,8 2.5,9.5 3.5,7 1,5 4,5" fill="#ffffff" />
        </svg>
      );
    case 'br': // Brasil (Verde con rombo amarillo y círculo azul)
      return (
        <svg width={width} height={height} viewBox="0 0 30 20" className="rounded-sm overflow-hidden shadow-sm inline-block shrink-0">
          <rect width="30" height="20" fill="#16a34a" />
          <polygon points="15,2 27,10 15,18 3,10" fill="#facc15" />
          <circle cx="15" cy="10" r="4" fill="#1e3a8a" />
        </svg>
      );
    case 've': // Venezuela (Amarillo, Azul, Rojo con arco de estrellas)
      return (
        <svg width={width} height={height} viewBox="0 0 30 20" className="rounded-sm overflow-hidden shadow-sm inline-block shrink-0">
          <rect width="30" height="6.6" fill="#facc15" />
          <rect y="6.6" width="30" height="6.8" fill="#1d4ed8" />
          <rect y="13.4" width="30" height="6.6" fill="#dc2626" />
          <circle cx="13" cy="9.5" r="0.8" fill="#ffffff" />
          <circle cx="15" cy="8.8" r="0.8" fill="#ffffff" />
          <circle cx="17" cy="9.5" r="0.8" fill="#ffffff" />
        </svg>
      );
    case 'pa': // Panamá (Cuarteles blanco/azul/rojo con estrellas)
      return (
        <svg width={width} height={height} viewBox="0 0 30 20" className="rounded-sm overflow-hidden shadow-sm inline-block shrink-0">
          <rect width="15" height="10" fill="#ffffff" />
          <rect x="15" width="15" height="10" fill="#dc2626" />
          <rect y="10" width="15" height="10" fill="#1d4ed8" />
          <rect x="15" y="10" width="15" height="10" fill="#ffffff" />
          <polygon points="7.5,3 8.5,5.5 11,5.5 9,7 9.8,9.5 7.5,8 5.2,9.5 6,7 4,5.5 6.5,5.5" fill="#1d4ed8" />
          <polygon points="22.5,13 23.5,15.5 26,15.5 24,17 24.8,19.5 22.5,18 20.2,19.5 21,17 19,15.5 21.5,15.5" fill="#dc2626" />
        </svg>
      );
    case 'bo': // Bolivia (Rojo, Amarillo, Verde)
      return (
        <svg width={width} height={height} viewBox="0 0 30 20" className="rounded-sm overflow-hidden shadow-sm inline-block shrink-0">
          <rect width="30" height="6.6" fill="#dc2626" />
          <rect y="6.6" width="30" height="6.8" fill="#facc15" />
          <rect y="13.4" width="30" height="6.6" fill="#15803d" />
        </svg>
      );
    case 'mx': // México (Verde, Blanco con escudo, Rojo)
      return (
        <svg width={width} height={height} viewBox="0 0 30 20" className="rounded-sm overflow-hidden shadow-sm inline-block shrink-0">
          <rect width="10" height="20" fill="#15803d" />
          <rect x="10" width="10" height="20" fill="#ffffff" />
          <rect x="20" width="10" height="20" fill="#dc2626" />
          <circle cx="15" cy="10" r="1.5" fill="#854d0e" />
        </svg>
      );
    case 'sv': // El Salvador (Azul, Blanco, Azul)
      return (
        <svg width={width} height={height} viewBox="0 0 30 20" className="rounded-sm overflow-hidden shadow-sm inline-block shrink-0">
          <rect width="30" height="6.6" fill="#1d4ed8" />
          <rect y="6.6" width="30" height="6.8" fill="#ffffff" />
          <rect y="13.4" width="30" height="6.6" fill="#1d4ed8" />
        </svg>
      );
    case 'it': // Italia (Verde, Blanco, Rojo)
      return (
        <svg width={width} height={height} viewBox="0 0 30 20" className="rounded-sm overflow-hidden shadow-sm inline-block shrink-0">
          <rect width="10" height="20" fill="#16a34a" />
          <rect x="10" width="10" height="20" fill="#ffffff" />
          <rect x="20" width="10" height="20" fill="#dc2626" />
        </svg>
      );
    case 'es': // España (Rojo, Amarillo doble, Rojo)
      return (
        <svg width={width} height={height} viewBox="0 0 30 20" className="rounded-sm overflow-hidden shadow-sm inline-block shrink-0">
          <rect width="30" height="5" fill="#dc2626" />
          <rect y="5" width="30" height="10" fill="#facc15" />
          <rect y="15" width="30" height="5" fill="#dc2626" />
        </svg>
      );
    case 'pt': // Portugal (Verde y Rojo)
      return (
        <svg width={width} height={height} viewBox="0 0 30 20" className="rounded-sm overflow-hidden shadow-sm inline-block shrink-0">
          <rect width="12" height="20" fill="#15803d" />
          <rect x="12" width="18" height="20" fill="#dc2626" />
          <circle cx="12" cy="10" r="2.5" fill="#facc15" />
        </svg>
      );
    case 'de': // Alemania (Negro, Rojo, Amarillo)
      return (
        <svg width={width} height={height} viewBox="0 0 30 20" className="rounded-sm overflow-hidden shadow-sm inline-block shrink-0">
          <rect width="30" height="6.6" fill="#0f172a" />
          <rect y="6.6" width="30" height="6.8" fill="#dc2626" />
          <rect y="13.4" width="30" height="6.6" fill="#facc15" />
        </svg>
      );
    case 'us': // USA (Franjas y cantón azul)
      return (
        <svg width={width} height={height} viewBox="0 0 30 20" className="rounded-sm overflow-hidden shadow-sm inline-block shrink-0">
          <rect width="30" height="20" fill="#ffffff" />
          <rect y="0" width="30" height="2" fill="#dc2626" />
          <rect y="4" width="30" height="2" fill="#dc2626" />
          <rect y="8" width="30" height="2" fill="#dc2626" />
          <rect y="12" width="30" height="2" fill="#dc2626" />
          <rect y="16" width="30" height="2" fill="#dc2626" />
          <rect width="13" height="10" fill="#1d4ed8" />
        </svg>
      );
    default: // Default Perú
      return (
        <svg width={width} height={height} viewBox="0 0 30 20" className="rounded-sm overflow-hidden shadow-sm inline-block shrink-0">
          <rect width="10" height="20" fill="#dc2626" />
          <rect x="10" width="10" height="20" fill="#ffffff" />
          <rect x="20" width="10" height="20" fill="#dc2626" />
        </svg>
      );
  }
};

export const CountryFlag: React.FC<CountryFlagProps> = ({
  nationality = 'Peruano',
  showText = true,
  className = '',
  size = 'md',
}) => {
  const parts = nationality.split('/').map((s) => s.trim());
  const codes = parts.map(normalizeNationality);

  const dimensions = {
    sm: { w: 16, h: 11, text: 'text-xs' },
    md: { w: 20, h: 14, text: 'text-xs' },
    lg: { w: 26, h: 18, text: 'text-sm' },
  }[size];

  return (
    <span className={`inline-flex items-center gap-1.5 align-middle ${className}`} title={nationality}>
      <span className="inline-flex items-center gap-1">
        {codes.map((code, idx) => (
          <span
            key={idx}
            className="inline-flex items-center rounded-sm overflow-hidden border border-white/20 shadow-sm"
            title={`${COUNTRY_NAMES[code] || nationality} ${EMOJI_FLAGS[code] || ''}`}
          >
            <FlagSVG code={code} width={dimensions.w} height={dimensions.h} />
          </span>
        ))}
      </span>
      {showText && <span className={`${dimensions.text} font-medium text-slate-300`}>{nationality}</span>}
    </span>
  );
};
