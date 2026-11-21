export type KitPatternType =
  | 'stripes'          // Vertical stripes (Alianza Lima, Comerciantes, JPII, FC Cajamarca, Moquegua)
  | 'sash'             // Diagonal sash (Sporting Cristal, Alianza Atlético)
  | 'halves'           // Half & half vertical split (FBC Melgar)
  | 'hoops'            // Horizontal chest hoops / band (ADT Tarma)
  | 'shoulder_panels'  // Contrast shoulder / side blocks (Sport Huancayo, Deportivo Garcilaso)
  | 'solid_trim';      // Solid torso with distinct collar/cuff colored borders (Universitario, Cienciano, Cusco FC, Grau, Boys, Chankas, UTC)

export interface TeamKitConfig {
  clubKey: string;
  displayName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor?: string;
  pattern: KitPatternType;
  collarColor: string;
  cuffColor: string;
  shortsColor: string;
  gkJerseyColor: string;
  gkCollarColor: string;
  gkCuffColor: string;
  gkShortsColor: string;
  gkGlovesColor: string;
}

/**
 * Official 2026 Local kit specifications calibrated directly from Football Kit Archive.
 * Faithfully preserves:
 * - Two-color torso patterns (stripes, sashes, halves, hoops, side blocks)
 * - Distinct colored borders on sleeves and collars
 * - ZERO commercial logos, crests, brand badges or sponsor letters
 */
export const LIGA1_KITS_2026: Record<string, TeamKitConfig> = {
  'universitario': {
    clubKey: 'universitario',
    displayName: 'Universitario de Deportes',
    primaryColor: '#F3EBD8',    // Crema marfil tradicional 2026 Local
    secondaryColor: '#781D2D',  // Guinda / Claret en cuello y puños
    accentColor: '#781D2D',
    pattern: 'solid_trim',
    collarColor: '#781D2D',     // Borde de cuello Guinda oficial
    cuffColor: '#781D2D',       // Borde de mangas Guinda oficial
    shortsColor: '#F3EBD8',     // Short Crema
    gkJerseyColor: '#00A86B',   // Verde Esmeralda
    gkCollarColor: '#006B43',
    gkCuffColor: '#006B43',
    gkShortsColor: '#008554',
    gkGlovesColor: '#FF2A2A',
  },

  'alianza lima': {
    clubKey: 'alianza lima',
    displayName: 'Alianza Lima',
    primaryColor: '#001B44',    // Azul Marina Blanquiazul
    secondaryColor: '#FFFFFF',  // Bastones verticales Blancos
    accentColor: '#D11218',
    pattern: 'stripes',
    collarColor: '#001B44',     // Cuello Marina con ribete blanco
    cuffColor: '#FFFFFF',       // Puños de mangas Blancos
    shortsColor: '#FFFFFF',     // Short Blanco
    gkJerseyColor: '#FF5722',   // Naranja vibrante
    gkCollarColor: '#C43000',
    gkCuffColor: '#C43000',
    gkShortsColor: '#E64A19',
    gkGlovesColor: '#FFEB3B',
  },

  'sporting cristal': {
    clubKey: 'sporting cristal',
    displayName: 'Sporting Cristal',
    primaryColor: '#62A8E5',    // Celeste cielo clásico
    secondaryColor: '#FFFFFF',  // Banda diagonal Blanca cruzando el pecho
    accentColor: '#FFFFFF',
    pattern: 'sash',
    collarColor: '#FFFFFF',     // Cuello Blanco
    cuffColor: '#FFFFFF',       // Puños de mangas Blancos
    shortsColor: '#FFFFFF',     // Short Blanco
    gkJerseyColor: '#7B1FA2',   // Púrpura Real
    gkCollarColor: '#4A148C',
    gkCuffColor: '#4A148C',
    gkShortsColor: '#51136B',
    gkGlovesColor: '#00E5FF',
  },

  'fbc melgar': {
    clubKey: 'fbc melgar',
    displayName: 'FBC Melgar',
    primaryColor: '#D2232A',    // Rojo carmesí rojinegro
    secondaryColor: '#111111',  // Negro carbón mitad vertical
    accentColor: '#FFFFFF',
    pattern: 'halves',
    collarColor: '#111111',     // Cuello Negro
    cuffColor: '#111111',       // Puños Negros
    shortsColor: '#111111',     // Short Negro
    gkJerseyColor: '#00E5FF',   // Cian Neón
    gkCollarColor: '#0097A7',
    gkCuffColor: '#0097A7',
    gkShortsColor: '#00B4D8',
    gkGlovesColor: '#FF1744',
  },

  'cienciano': {
    clubKey: 'cienciano',
    displayName: 'Cienciano',
    primaryColor: '#C8102E',    // Rojo imperial cusqueño
    secondaryColor: '#D4AF37',  // Ribetes y vivos en Dorado inca
    accentColor: '#FFFFFF',
    pattern: 'solid_trim',
    collarColor: '#D4AF37',     // Cuello Dorado inca con detalle blanco
    cuffColor: '#D4AF37',       // Puños Dorados
    shortsColor: '#FFFFFF',     // Short Blanco
    gkJerseyColor: '#00897B',   // Turquesa profundo
    gkCollarColor: '#004D40',
    gkCuffColor: '#004D40',
    gkShortsColor: '#00695C',
    gkGlovesColor: '#FFD600',
  },

  'cusco fc': {
    clubKey: 'cusco fc',
    displayName: 'Cusco FC',
    primaryColor: '#C5A059',    // Dorado lítica inca
    secondaryColor: '#111111',  // Cuello y mangas en Negro
    accentColor: '#111111',
    pattern: 'shoulder_panels', // Torso dorado con hombros/mangas negras
    collarColor: '#111111',     // Cuello Negro
    cuffColor: '#111111',       // Puños de mangas Negros
    shortsColor: '#1A1A1A',     // Short Negro
    gkJerseyColor: '#E91E63',   // Magenta Intenso
    gkCollarColor: '#AD1457',
    gkCuffColor: '#AD1457',
    gkShortsColor: '#C2185B',
    gkGlovesColor: '#00E676',
  },

  'adt tarma': {
    clubKey: 'adt tarma',
    displayName: 'ADT Tarma',
    primaryColor: '#5BC2E7',    // Celeste cielo tarmeño
    secondaryColor: '#FFFFFF',  // Franjas horizontales blancas
    accentColor: '#0B1B3D',
    pattern: 'hoops',
    collarColor: '#0B1B3D',     // Cuello Marina de Tarma
    cuffColor: '#FFFFFF',       // Puños Blancos con vivo marina
    shortsColor: '#FFFFFF',     // Short Blanco
    gkJerseyColor: '#D50000',   // Carmesí Vivo
    gkCollarColor: '#8E0000',
    gkCuffColor: '#8E0000',
    gkShortsColor: '#9B0000',
    gkGlovesColor: '#00B0FF',
  },

  'atlético grau': {
    clubKey: 'atlético grau',
    displayName: 'Atlético Grau',
    primaryColor: '#FFFFFF',    // Blanco puro heroico
    secondaryColor: '#E30613',  // Ribetes en Rojo y Dorado
    accentColor: '#DAA520',
    pattern: 'solid_trim',
    collarColor: '#E30613',     // Cuello Rojo con ribete oro
    cuffColor: '#E30613',       // Puños Rojos con ribete oro
    shortsColor: '#FFFFFF',     // Short Blanco
    gkJerseyColor: '#2979FF',   // Azul Eléctrico
    gkCollarColor: '#1565C0',
    gkCuffColor: '#1565C0',
    gkShortsColor: '#1565C0',
    gkGlovesColor: '#FF3D00',
  },

  'deportivo garcilaso': {
    clubKey: 'deportivo garcilaso',
    displayName: 'Deportivo Garcilaso',
    primaryColor: '#75AADB',    // Celeste claro Rico Garci
    secondaryColor: '#0A1C3E',  // Laterales y vivos en Azul Marina
    accentColor: '#FFFFFF',
    pattern: 'shoulder_panels', // Paneles laterales y hombros en marina
    collarColor: '#0A1C3E',     // Cuello Azul Marina
    cuffColor: '#0A1C3E',       // Puños Azul Marina
    shortsColor: '#FFFFFF',     // Short Blanco
    gkJerseyColor: '#D50000',   // Rojo Carmesí
    gkCollarColor: '#8E0000',
    gkCuffColor: '#8E0000',
    gkShortsColor: '#B71C1C',
    gkGlovesColor: '#76FF03',
  },

  'comerciantes unidos': {
    clubKey: 'comerciantes unidos',
    displayName: 'Comerciantes Unidos',
    primaryColor: '#582C83',    // Morado cutervino
    secondaryColor: '#FFD700',  // Rayas / bastones Amarillo dorado
    accentColor: '#FFD700',
    pattern: 'stripes',
    collarColor: '#FFD700',     // Cuello Dorado
    cuffColor: '#FFD700',       // Puños Dorados
    shortsColor: '#582C83',     // Short Morado
    gkJerseyColor: '#00C853',   // Verde Neón
    gkCollarColor: '#007E33',
    gkCuffColor: '#007E33',
    gkShortsColor: '#009624',
    gkGlovesColor: '#FFAB00',
  },

  'alianza atlético': {
    clubKey: 'alianza atlético',
    displayName: 'Alianza Atlético',
    primaryColor: '#144FB5',    // Azul Rey Vendaval
    secondaryColor: '#FFFFFF',  // Banda diagonal Blanca en el pecho
    accentColor: '#FFFFFF',
    pattern: 'sash',
    collarColor: '#FFFFFF',     // Cuello Blanco
    cuffColor: '#FFFFFF',       // Puños Blancos
    shortsColor: '#144FB5',     // Short Azul Rey
    gkJerseyColor: '#FF6E40',   // Naranja Fluorescente
    gkCollarColor: '#D84315',
    gkCuffColor: '#D84315',
    gkShortsColor: '#D84315',
    gkGlovesColor: '#2979FF',
  },

  'sport boys': {
    clubKey: 'sport boys',
    displayName: 'Sport Boys',
    primaryColor: '#F77398',    // Rosado porteño tradicional
    secondaryColor: '#111111',  // Cuello y puños en Negro
    accentColor: '#111111',
    pattern: 'solid_trim',
    collarColor: '#111111',     // Cuello Negro porteño
    cuffColor: '#111111',       // Puños Negros porteños
    shortsColor: '#1A1A1A',     // Short Negro
    gkJerseyColor: '#00E5FF',   // Cian Neón
    gkCollarColor: '#0097A7',
    gkCuffColor: '#0097A7',
    gkShortsColor: '#0097A7',
    gkGlovesColor: '#FF4081',
  },

  'sport huancayo': {
    clubKey: 'sport huancayo',
    displayName: 'Sport Huancayo',
    primaryColor: '#D11218',    // Rojo escarlata Matador
    secondaryColor: '#FFFFFF',  // Paneles de hombros y cuello en Blanco
    accentColor: '#00A859',     // Ribete verde
    pattern: 'shoulder_panels',
    collarColor: '#FFFFFF',     // Cuello Blanco
    cuffColor: '#FFFFFF',       // Puños Blancos con ribete verde
    shortsColor: '#D11218',     // Short Rojo
    gkJerseyColor: '#00E676',   // Verde Neón
    gkCollarColor: '#00A34A',
    gkCuffColor: '#00A34A',
    gkShortsColor: '#00C853',
    gkGlovesColor: '#FFD600',
  },

  'juan pablo ii college': {
    clubKey: 'juan pablo ii college',
    displayName: 'Juan Pablo II College',
    primaryColor: '#FAC400',    // Amarillo canario
    secondaryColor: '#FFFFFF',  // Rayas verticales Blancas
    accentColor: '#4E2E1E',     // Marrón en cuello y puños
    pattern: 'stripes',
    collarColor: '#4E2E1E',     // Cuello Marrón polo
    cuffColor: '#4E2E1E',       // Puños Marrones
    shortsColor: '#4E2E1E',     // Short Marrón
    gkJerseyColor: '#1A237E',   // Azul Marino
    gkCollarColor: '#0D1752',
    gkCuffColor: '#0D1752',
    gkShortsColor: '#0D47A1',
    gkGlovesColor: '#FF1744',
  },

  'fc cajamarca': {
    clubKey: 'fc cajamarca',
    displayName: 'FC Cajamarca',
    primaryColor: '#0B4EA2',    // Azul Real
    secondaryColor: '#FCD116',  // Rayas verticales Amarillo intenso
    accentColor: '#FCD116',
    pattern: 'stripes',
    collarColor: '#FCD116',     // Cuello Amarillo
    cuffColor: '#FCD116',       // Puños Amarillos
    shortsColor: '#0B4EA2',     // Short Azul
    gkJerseyColor: '#FF3D00',   // Naranja Alta Visibilidad
    gkCollarColor: '#BA2D00',
    gkCuffColor: '#BA2D00',
    gkShortsColor: '#DD2C00',
    gkGlovesColor: '#00E5FF',
  },

  'los chankas cyc': {
    clubKey: 'los chankas cyc',
    displayName: 'Los Chankas CYC',
    primaryColor: '#5B1E31',    // Granate / Claret andino
    secondaryColor: '#FF7A00',  // Ribetes en Naranja andino brillante
    accentColor: '#00D2D3',
    pattern: 'solid_trim',
    collarColor: '#FF7A00',     // Cuello Naranja andino
    cuffColor: '#FF7A00',       // Puños Naranja andino
    shortsColor: '#5B1E31',     // Short Granate
    gkJerseyColor: '#64DD17',   // Verde Lima Neón
    gkCollarColor: '#3B8B0B',
    gkCuffColor: '#3B8B0B',
    gkShortsColor: '#43A047',
    gkGlovesColor: '#FF3D00',
  },

  'utc cajamarca': {
    clubKey: 'utc cajamarca',
    displayName: 'UTC Cajamarca',
    primaryColor: '#EEDFC8',    // Crema marfil Gavilán Norteño
    secondaryColor: '#9A1B2F',  // Cuello y puños en Granate
    accentColor: '#111111',     // Ribete negro
    pattern: 'solid_trim',
    collarColor: '#9A1B2F',     // Cuello Granate
    cuffColor: '#9A1B2F',       // Puños Granate
    shortsColor: '#EEDFC8',     // Short Crema
    gkJerseyColor: '#00E676',   // Verde Neón
    gkCollarColor: '#00A34A',
    gkCuffColor: '#00A34A',
    gkShortsColor: '#00C853',
    gkGlovesColor: '#FF6D00',
  },

  'deportivo moquegua': {
    clubKey: 'deportivo moquegua',
    displayName: 'Deportivo Moquegua',
    primaryColor: '#C86428',    // Cobre metalizado (cuprífero)
    secondaryColor: '#0D1B2A',  // Rayas y vivos en Azul Marina
    accentColor: '#0D1B2A',
    pattern: 'stripes',
    collarColor: '#0D1B2A',     // Cuello Azul Marina
    cuffColor: '#0D1B2A',       // Puños Azul Marina
    shortsColor: '#0D1B2A',     // Short Azul Marina
    gkJerseyColor: '#00E5FF',   // Cian Neón
    gkCollarColor: '#00838F',
    gkCuffColor: '#00838F',
    gkShortsColor: '#0097A7',
    gkGlovesColor: '#D50000',
  },
};

function normalizeText(str: string): string {
  return (str || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Resolves the complete kit configuration for any team name or slug.
 */
export function getTeamKitConfig(teamName: string = ''): TeamKitConfig {
  const norm = normalizeText(teamName);
  const keys = Object.keys(LIGA1_KITS_2026);

  const matchedKey = keys.find((k) => norm.includes(normalizeText(k)) || normalizeText(k).includes(norm));

  if (matchedKey && LIGA1_KITS_2026[matchedKey]) {
    return LIGA1_KITS_2026[matchedKey];
  }

  // Generic fallback if not matched
  return {
    clubKey: 'generic',
    displayName: teamName || 'Club',
    primaryColor: '#C8102E',
    secondaryColor: '#FFFFFF',
    pattern: 'solid_trim',
    collarColor: '#FFFFFF',
    cuffColor: '#FFFFFF',
    shortsColor: '#FFFFFF',
    gkJerseyColor: '#00A86B',
    gkCollarColor: '#006B43',
    gkCuffColor: '#006B43',
    gkShortsColor: '#008554',
    gkGlovesColor: '#FF2A2A',
  };
}
