import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ugujgzrfysucybbncxrs.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVndWpnenJmeXN1Y3liYm5jeHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUwMjk3NDcsImV4cCI6MjExMDYwNTc0N30.KavzLBrgphW52oAqHu8MNcKz_YvcO2EUXI6NvWXdugY';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
  realtime: { transport: WebSocket }
});

const BESOCCER_TO_DB_SLUG = {
  'ADT de Tarma': 'adt-tarma',
  'Alianza Atlético': 'alianza-atletico',
  'Alianza Lima': 'alianza-lima',
  'Atlético Grau': 'atletico-grau',
  'Cienciano': 'cienciano',
  'Comerciantes Unidos': 'comerciantes-unidos',
  'Cusco FC': 'cusco-fc',
  'Deportivo Garcilaso': 'deportivo-garcilaso',
  'Deportivo Moquegua': 'deportivo-moquegua',
  'FBC Melgar': 'fbc-melgar',
  'FC Cajamarca': 'fc-cajamarca',
  'Juan Pablo II College': 'juan-pablo-ii',
  'Los Chankas': 'los-chankas',
  'Sport Boys Association': 'sport-boys',
  'Sport Huancayo': 'sport-huancayo',
  'Sporting Cristal': 'sporting-cristal',
  'UTC Cajamarca': 'utc-cajamarca',
  'Universitario Deportes': 'universitario'
};

const SPANISH_MONTHS = {
  ENE: '01', FEB: '02', MAR: '03', ABR: '04',
  MAY: '05', JUN: '06', JUL: '07', AGO: '08',
  SEP: '09', OCT: '10', NOV: '11', DIC: '12'
};

function parseBesoccerDate(str) {
  if (!str) return '2026-07-01T12:00:00Z';
  const parts = str.trim().split(/\s+/);
  if (parts.length === 3) {
    const day = parts[0].padStart(2, '0');
    const month = SPANISH_MONTHS[parts[1].toUpperCase()] || '07';
    const year = parts[2];
    return `${year}-${month}-${day}T12:00:00Z`;
  }
  return '2026-07-01T12:00:00Z';
}

function cleanText(s) {
  return (s || '')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .trim();
}

function normalize(s) {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

function slugify(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function main() {
  console.log('=== SYNCING BE SOCCER TRANSFERS (CLAUSURA 2026) ===');
  
  // 1. Fetch DB teams
  const { data: dbTeams, error: teamsErr } = await supabase.from('teams').select('id, name, slug');
  if (teamsErr) throw teamsErr;
  const teamBySlug = new Map(dbTeams.map(t => [t.slug, t]));

  // 2. Fetch all DB players
  const { data: dbPlayers, error: playersErr } = await supabase.from('players').select('id, full_name, slug, primary_position, nationality, photo_url');
  if (playersErr) throw playersErr;

  const playerByNorm = new Map();
  const playerMap = new Map();
  for (const p of dbPlayers) {
    playerByNorm.set(normalize(p.full_name), p);
    playerMap.set(p.slug, p);
  }

  // 3. Read parsed BeSoccer transfers
  const besoccerData = JSON.parse(fs.readFileSync('scripts/besoccer_transfers_parsed.json', 'utf8'));

  // Helper to find or create player
  async function resolvePlayer(item) {
    const nameClean = cleanText(item.name);
    const norm = normalize(nameClean);

    // 1. Direct match
    if (playerByNorm.has(norm)) {
      return playerByNorm.get(norm);
    }

    // 2. URL slug match
    if (item.url) {
      const urlSlug = item.url.replace(/^.*\/jugador\//, '').replace(/-[0-9]+$/, '').replace(/-/g, ' ');
      if (playerByNorm.has(normalize(urlSlug))) {
        return playerByNorm.get(normalize(urlSlug));
      }
    }

    // 3. Initial + Last name match
    const parts = nameClean.split(/\s+/);
    if (parts.length >= 2 && parts[0].length <= 2) {
      const initial = parts[0][0].toLowerCase();
      const lastName = parts.slice(1).join(' ').toLowerCase();

      const candidates = dbPlayers.filter(p => {
        const pNorm = p.full_name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const pParts = pNorm.split(/\s+/);
        const pInitial = pParts[0][0];
        const pLastName = pParts.slice(1).join(' ');
        return pInitial === initial && (pLastName.includes(lastName) || pNorm.endsWith(lastName));
      });

      if (candidates.length === 1) {
        return candidates[0];
      }
    }

    // 4. Create new player in DB
    let displayName = nameClean;
    // If name is like "L. Pretel" and URL is "luis-pretel-3258624", we can use "Luis Pretel"
    if (item.url) {
      const slugParts = item.url.replace(/^.*\/jugador\//, '').replace(/-[0-9]+$/, '').split('-');
      if (slugParts.length >= 2 && slugParts[0].length > 2 && slugParts.every(p => !p.match(/^[0-9]+$/))) {
        displayName = slugParts.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      }
    }

    let pSlug = slugify(displayName);
    if (playerMap.has(pSlug)) {
      pSlug = `${pSlug}-${Math.floor(Math.random() * 10000)}`;
    }

    const newPlayerData = {
      full_name: displayName,
      slug: pSlug,
      primary_position: 'Futbolista',
      nationality: 'Peruano',
      photo_url: item.photo || null
    };

    const { data: created, error: createErr } = await supabase
      .from('players')
      .insert(newPlayerData)
      .select('id, full_name, slug, primary_position, nationality, photo_url')
      .single();

    if (createErr) {
      console.error(`Error creating player ${displayName}:`, createErr.message);
      // Fallback: try finding again or return null
      return null;
    }

    playerByNorm.set(norm, created);
    playerByNorm.set(normalize(displayName), created);
    playerMap.set(pSlug, created);
    dbPlayers.push(created);
    return created;
  }

  // 4. Prepare transfers rows
  const transfersToInsert = [];
  let altasCount = 0;
  let bajasCount = 0;

  for (const club of besoccerData) {
    const dbSlug = BESOCCER_TO_DB_SLUG[club.clubName];
    const team = teamBySlug.get(dbSlug);
    if (!team) {
      console.warn(`Club ${club.clubName} not found in DB teams!`);
      continue;
    }

    // Process Altas (IN)
    for (const alta of club.altas) {
      const player = await resolvePlayer(alta);
      if (!player) continue;

      const announced = parseBesoccerDate(alta.date);
      const startDate = announced.split('T')[0];

      transfersToInsert.push({
        team_id: team.id,
        player_id: player.id,
        season_year: 2026,
        transfer_type: 'IN',
        other_club_name: cleanText(alta.otherClubName) || 'Agente Libre',
        departure_reason: cleanText(alta.transferInfo) || 'Incorporación',
        source_type: 'besoccer',
        source_url: alta.url || 'https://es.besoccer.com/competicion/fichajes/clausura_peru',
        announced_at: announced,
        contract_start_date: startDate,
        contract_end_date: '2026-12-31'
      });
      altasCount++;
    }

    // Process Bajas (OUT)
    for (const baja of club.bajas) {
      const player = await resolvePlayer(baja);
      if (!player) continue;

      const announced = parseBesoccerDate(baja.date);

      transfersToInsert.push({
        team_id: team.id,
        player_id: player.id,
        season_year: 2026,
        transfer_type: 'OUT',
        other_club_name: cleanText(baja.otherClubName) || 'Agente Libre',
        departure_reason: cleanText(baja.transferInfo) || 'Término de contrato',
        source_type: 'besoccer',
        source_url: baja.url || 'https://es.besoccer.com/competicion/fichajes/clausura_peru',
        announced_at: announced,
        contract_start_date: '2025-01-01',
        contract_end_date: '2026-12-31'
      });
      bajasCount++;
    }
  }

  // Preserve Sebastián Britos in Universitario OUT
  const uTeam = teamBySlug.get('universitario');
  const britosPlayer = dbPlayers.find(p => p.full_name.toLowerCase().includes('britos'));
  if (uTeam && britosPlayer) {
    transfersToInsert.push({
      team_id: uTeam.id,
      player_id: britosPlayer.id,
      season_year: 2026,
      transfer_type: 'OUT',
      other_club_name: 'CA Peñarol (Uruguay) / Libre',
      departure_reason: 'Término de contrato (no renovó para 2026 y salió a fines de 2025)',
      source_type: 'besoccer',
      source_url: 'https://es.besoccer.com/competicion/fichajes/clausura_peru',
      announced_at: '2025-12-31T12:00:00Z',
      contract_start_date: '2024-01-01',
      contract_end_date: '2025-12-31'
    });
    bajasCount++;
  }

  console.log(`\nReady to insert ${transfersToInsert.length} total transfers (${altasCount} IN, ${bajasCount} OUT)`);

  // 5. Clear previous 2026 transfers
  console.log('Clearing old 2026 transfers in DB...');
  const { error: delErr } = await supabase.from('transfers').delete().eq('season_year', 2026);
  if (delErr) {
    console.error('Error deleting 2026 transfers:', delErr.message);
    return;
  }
  console.log('Old 2026 transfers deleted successfully.');

  // 6. Bulk insert in batches of 50
  const BATCH_SIZE = 50;
  let inserted = 0;
  for (let i = 0; i < transfersToInsert.length; i += BATCH_SIZE) {
    const chunk = transfersToInsert.slice(i, i + BATCH_SIZE);
    const { error: insErr } = await supabase.from('transfers').insert(chunk);
    if (insErr) {
      console.error(`Error inserting chunk ${i} - ${i + BATCH_SIZE}:`, insErr.message);
    } else {
      inserted += chunk.length;
    }
  }

  console.log(`\nSuccessfully inserted ${inserted} / ${transfersToInsert.length} transfers in Supabase!`);
}

main();
