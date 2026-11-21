import { PLAYER_SKIN_DATABASE, type VerifiedPlayerSkin } from '../data/playerSkinTones';

export type SkinToneCategory = 'white' | 'mestizo' | 'moreno';
export type HairStyle = 'crew_cut' | 'undercut' | 'short_fade' | 'afro_crop' | 'buzz_cut' | 'medium_sweep';
export type FacialHair = 'clean' | 'full_beard' | 'stubble' | 'goatee' | 'mustache';

export interface PlayerAppearance {
  skinColor: string;
  skinCategory: SkinToneCategory;
  hairStyle: HairStyle;
  hairColor: string;
  facialHair: FacialHair;
  facialHairColor: string;
  isGoalkeeper: boolean;
  gkJerseyColor: string;
  gkShortsColor: string;
  gkGlovesColor: string;
  photoUrl?: string | null;
}

// Authentic skin tone color palettes (high-end Three.js PBR calibrated)
export const SKIN_TONES: Record<SkinToneCategory, string[]> = {
  white: ['#F5D0B5', '#EFC4A4', '#FAD8C0', '#E5BA98'],
  mestizo: ['#C68A57', '#B87B4A', '#BF8050', '#D19868', '#AC7040'],
  moreno: ['#5A3825', '#452617', '#6E452C', '#784D34', '#3D2012'],
};

// Distinct Goalkeeper kit colors per team (to contrast with primary outfield kit)
export const TEAM_GK_KITS: Record<string, { jersey: string; shorts: string; gloves: string }> = {
  'universitario': { jersey: '#00A86B', shorts: '#008554', gloves: '#FF2A2A' }, // Neon Emerald Green vs Cream
  'alianza lima': { jersey: '#FF5722', shorts: '#E64A19', gloves: '#FFEB3B' },  // Vibrant Orange vs Navy/White
  'sporting cristal': { jersey: '#7B1FA2', shorts: '#51136B', gloves: '#00E5FF' }, // Royal Purple vs Sky Blue
  'fbc melgar': { jersey: '#00E5FF', shorts: '#00B4D8', gloves: '#FF1744' },    // Neon Cyan vs Red/Black
  'cienciano': { jersey: '#00897B', shorts: '#00695C', gloves: '#FFD600' },      // Deep Turquoise vs Red
  'cusco fc': { jersey: '#E91E63', shorts: '#C2185B', gloves: '#00E676' },       // Hot Magenta vs Black/Gold
  'adt tarma': { jersey: '#D50000', shorts: '#9B0000', gloves: '#00B0FF' },      // Bright Crimson vs Sky Blue
  'atlético grau': { jersey: '#2979FF', shorts: '#1565C0', gloves: '#FF3D00' },  // Electric Blue vs White
  'comerciantes unidos': { jersey: '#00C853', shorts: '#009624', gloves: '#FFAB00' }, // Neon Green vs Purple
  'deportivo garcilaso': { jersey: '#D50000', shorts: '#B71C1C', gloves: '#76FF03' }, // Crimson Red vs Sky Blue
  'alianza atlético': { jersey: '#FF6E40', shorts: '#D84315', gloves: '#2979FF' }, // Fluorescent Orange vs Royal Blue
  'sport boys': { jersey: '#00E5FF', shorts: '#0097A7', gloves: '#FF4081' },     // Neon Cyan vs Pink
  'sport huancayo': { jersey: '#00E676', shorts: '#00C853', gloves: '#FFD600' }, // Neon Green vs Escarlata
  'juan pablo ii college': { jersey: '#1A237E', shorts: '#0D47A1', gloves: '#FF1744' }, // Navy Blue vs Yellow
  'fc cajamarca': { jersey: '#FF3D00', shorts: '#DD2C00', gloves: '#00E5FF' },   // High-Vis Orange vs Blue
  'los chankas cyc': { jersey: '#64DD17', shorts: '#43A047', gloves: '#FF3D00' },// Neon Lime Green vs Granate
  'utc cajamarca': { jersey: '#00E676', shorts: '#00C853', gloves: '#FF6D00' },  // Neon Green vs Crema Gavilán
  'deportivo moquegua': { jersey: '#00E5FF', shorts: '#0097A7', gloves: '#D50000' }, // Cyan vs Cobre/Marina
};

function normalizeText(str: string): string {
  return (str || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Returns comprehensive visual attributes (skin tone, hair cut, beard, goalkeeper kit)
 * for any player based on real official photographs (Transfermarkt / BeSoccer),
 * ground-truth verification, position, name, team, and nationality.
 */
export function getPlayerAppearance(
  playerName: string = '',
  position: string = '',
  teamName: string = '',
  nationality: string = 'Perú',
  playerId?: string,
  playerSlug?: string
): PlayerAppearance {
  const normName = normalizeText(playerName);
  const normPos = normalizeText(position);
  const normTeam = normalizeText(teamName);
  const normNat = normalizeText(nationality);

  const isGoalkeeper =
    normPos.includes('portero') ||
    normPos.includes('arquero') ||
    normPos.includes('guardameta') ||
    normPos === 'gk';

  // Get matching Goalkeeper kit colors for the club
  const teamKey = Object.keys(TEAM_GK_KITS).find((k) => normTeam.includes(normalizeText(k))) || 'universitario';
  const gkKit = TEAM_GK_KITS[teamKey] || {
    jersey: '#00A86B',
    shorts: '#008554',
    gloves: '#FF2A2A',
  };

  // 1. Check verified skin database by playerId, playerSlug, exact name, or partial name
  let match: VerifiedPlayerSkin | undefined;
  if (playerId && PLAYER_SKIN_DATABASE[playerId]) {
    match = PLAYER_SKIN_DATABASE[playerId];
  } else if (playerSlug && PLAYER_SKIN_DATABASE[playerSlug]) {
    match = PLAYER_SKIN_DATABASE[playerSlug];
  } else if (PLAYER_SKIN_DATABASE[normName]) {
    match = PLAYER_SKIN_DATABASE[normName];
  } else {
    // Try matching by word tokens (e.g. "Hernán Barcos" in "Barcos", "Paolo Guerrero")
    const dbKeys = Object.keys(PLAYER_SKIN_DATABASE);
    const foundKey = dbKeys.find((k) => {
      const nk = normalizeText(k);
      return nk === normName || (normName.length > 5 && nk.includes(normName)) || (nk.length > 5 && normName.includes(nk));
    });
    if (foundKey) {
      match = PLAYER_SKIN_DATABASE[foundKey];
    }
  }

  let skinCategory: SkinToneCategory;
  let skinColor: string;
  let hairStyle: HairStyle;
  let hairColor: string;
  let facialHair: FacialHair;

  if (match) {
    skinCategory = match.skinCategory;
    skinColor = match.skinColor;
    hairStyle = match.hairStyle;
    hairColor = match.hairColor || '#1A1A1A';
    facialHair = match.facialHair || 'clean';
  } else {
    // Deterministic fallback based on nationality
    const isEuroLatam =
      normNat.includes('urugua') ||
      normNat.includes('argent') ||
      normNat.includes('espan') ||
      normNat.includes('italia') ||
      normNat.includes('chile');

    const isAfroLatam =
      normNat.includes('colomb') || normNat.includes('ecuador');

    if (isEuroLatam) {
      skinCategory = 'white';
      skinColor = '#F5D0B5';
      hairStyle = 'undercut';
      facialHair = 'stubble';
    } else if (isAfroLatam) {
      skinCategory = 'moreno';
      skinColor = '#5A3825';
      hairStyle = 'short_fade';
      facialHair = 'clean';
    } else {
      skinCategory = 'mestizo';
      skinColor = '#C68A57';
      hairStyle = 'crew_cut';
      facialHair = 'clean';
    }
    hairColor = '#1A1A1A';
  }

  const facialHairColor = hairColor;

  return {
    skinColor,
    skinCategory,
    hairStyle,
    hairColor,
    facialHair,
    facialHairColor,
    isGoalkeeper,
    gkJerseyColor: gkKit.jersey,
    gkShortsColor: gkKit.shorts,
    gkGlovesColor: gkKit.gloves,
    photoUrl: match?.photoUrl || null,
  };
}
