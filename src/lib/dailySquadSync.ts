import { supabase, type PlayerSeason } from './supabase';

export interface SquadFilterStats {
  totalFetched: number;
  activeVerified: number;
  purgedDepartures: number;
  purgedExpired: number;
  lastDailyUpdate: string;
}

/**
 * Filtro estricto en código para la pestaña Plantillas & Jugadores:
 * 1. Solo jugadores de la temporada actual vigente (season_year === currentYear).
 * 2. Solo contratos activos al día vigente (contract_end_date >= today).
 * 3. Depuración automática de jugadores con transferencias 'OUT' (Salidas/Bajas confirmadas).
 * 4. Deduplicación por nombre completo del futbolista.
 */
export async function getStrictActiveSquad(
  teamId: string,
  currentYear: number
): Promise<{ players: PlayerSeason[]; stats: SquadFilterStats }> {
  const todayStr = new Date().toISOString().split('T')[0]; // Ej: '2026-11-19'

  // 1. Obtener todas las salidas confirmadas del club para el año actual
  const { data: departures } = await supabase
    .from('transfers')
    .select('player_id, departure_reason, other_club_name, players(full_name)')
    .eq('team_id', teamId)
    .eq('season_year', currentYear)
    .eq('transfer_type', 'OUT');

  const departedIds = new Set<string>();
  const departedNames = new Set<string>();

  (departures || []).forEach((d) => {
    if (d.player_id) departedIds.add(d.player_id);
    const pName = (d as unknown as { players?: { full_name?: string } })?.players?.full_name;
    if (pName) {
      departedNames.add(normalizeName(pName));
    }
  });

  // 2. Obtener nómina de player_seasons para el club y año en curso
  const { data: rawSquad, error } = await supabase
    .from('player_seasons')
    .select('*, players(*)')
    .eq('team_id', teamId)
    .eq('season_year', currentYear);

  if (error || !rawSquad) {
    console.error('Error fetching squad:', error);
    return {
      players: [],
      stats: {
        totalFetched: 0,
        activeVerified: 0,
        purgedDepartures: 0,
        purgedExpired: 0,
        lastDailyUpdate: todayStr,
      },
    };
  }

  let purgedDepartures = 0;
  let purgedExpired = 0;
  const seenPlayerNames = new Set<string>();
  const verifiedActiveList: PlayerSeason[] = [];

  for (const item of rawSquad as PlayerSeason[]) {
    const player = item.players;
    if (!player) continue;

    const normName = normalizeName(player.full_name || '');

    // Filtro A: Salidas de Jugadores (bajas confirmadas en transfers OUT)
    if (departedIds.has(player.id) || departedNames.has(normName)) {
      purgedDepartures++;
      continue;
    }

    // Filtro B: Contrato expirado antes de la fecha vigente de hoy
    if (item.contract_end_date && item.contract_end_date < todayStr) {
      purgedExpired++;
      continue;
    }

    // Filtro C: Temporada vigente estricta
    if (item.season_year !== currentYear) {
      continue;
    }

    // Filtro D: Deduplicación (1 ficha por futbolista único)
    if (seenPlayerNames.has(normName)) {
      continue;
    }

    seenPlayerNames.add(normName);
    verifiedActiveList.push(item);
  }

  // Ordenar por número de camiseta o nombre
  verifiedActiveList.sort((a, b) => (a.jersey_number || 99) - (b.jersey_number || 99));

  return {
    players: verifiedActiveList,
    stats: {
      totalFetched: rawSquad.length,
      activeVerified: verifiedActiveList.length,
      purgedDepartures,
      purgedExpired,
      lastDailyUpdate: todayStr,
    },
  };
}

/**
 * Normaliza nombres para comparación insensible a mayúsculas, espacios y acentos.
 */
function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Formateador de la fecha actual en español
 */
export function getFormattedToday(): string {
  const now = new Date();
  return new Intl.DateTimeFormat('es-PE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(now);
}
