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

// Parse BeSoccer HTML
function parseBeSoccerHtml(html) {
  const parts = html.split('<div class="panel-head"');
  const clubsData = [];

  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    const clubTitleMatch = part.match(/<h3 class="panel-title[^"]*">([\s\S]*?)<\/h3>/i);
    if (!clubTitleMatch) continue;
    const clubName = clubTitleMatch[1].replace(/<[^>]+>/g, '').trim();

    const altaIdx = part.indexOf('<div class="table-head">Alta</div>');
    const bajaIdx = part.indexOf('<div class="table-head">Baja</div>');

    let altaPart = '';
    let bajaPart = '';

    if (altaIdx !== -1 && bajaIdx !== -1) {
      altaPart = part.substring(altaIdx, bajaIdx);
      bajaPart = part.substring(bajaIdx);
    } else if (altaIdx !== -1) {
      altaPart = part.substring(altaIdx);
    } else if (bajaIdx !== -1) {
      bajaPart = part.substring(bajaIdx);
    }

    function parseSigns(sectionHtml) {
      const signs = [];
      const liMatches = sectionHtml.split('<li class="sign-list">');
      for (let j = 1; j < liMatches.length; j++) {
        const li = liMatches[j].split('</li>')[0];
        const linkMatch = li.match(/href="([^"]+)"/i);
        const url = linkMatch ? linkMatch[1] : '';
        const nameMatch = li.match(/<p class="pl-name[^"]*">([\s\S]*?)<\/p>/i);
        const name = nameMatch ? nameMatch[1].replace(/<[^>]+>/g, '').trim() : '';
        const dateMatch = li.match(/<p class="date[^"]*">([\s\S]*?)<\/p>/i);
        const date = dateMatch ? dateMatch[1].replace(/<[^>]+>/g, '').trim() : '';
        const imgMatch = li.match(/<div class="row-img player">\s*<img[^>]*src="([^"]+)"/i);
        const photo = imgMatch ? imgMatch[1] : '';
        
        const shieldMatch = li.match(/<div class="row-img shield">\s*<img[^>]*alt="([^"]*)"[^>]*src="([^"]+)"/i);
        const otherClubName = shieldMatch ? shieldMatch[1] : '';
        const otherClubShield = shieldMatch ? shieldMatch[2] : '';

        const transferTypeMatch = li.match(/<div class="data-transfer[^"]*">([\s\S]*?)<\/div>/i);
        const transferInfo = transferTypeMatch ? transferTypeMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';

        // Strict 2026 filter
        if (name && date.includes('2026')) {
          signs.push({
            name,
            date,
            url,
            photo,
            otherClubName,
            otherClubShield,
            transferInfo
          });
        }
      }
      return signs;
    }

    const altas = parseSigns(altaPart);
    const bajas = parseSigns(bajaPart);

    clubsData.push({
      clubName,
      altas,
      bajas
    });
  }

  return clubsData;
}

async function main() {
  console.log('--- 1. Fetching Teams & Players from Supabase ---');
  const { data: dbTeams, error: teamsErr } = await supabase.from('teams').select('id, name, slug');
  if (teamsErr) throw teamsErr;
  const teamBySlug = new Map(dbTeams.map(t => [t.slug, t]));

  const { data: dbPlayers, error: playersErr } = await supabase.from('players').select('id, full_name, slug, primary_position, nationality, photo_url');
  if (playersErr) throw playersErr;

  const playerByNorm = new Map();
  const playerMap = new Map();
  for (const p of dbPlayers) {
    playerByNorm.set(normalize(p.full_name), p);
    playerMap.set(p.slug, p);
  }

  // Load Transfermarkt dictionary for rich position & nationality lookup
  const tmDict = new Map();
  if (fs.existsSync('scripts/all_tm_transfers_exact.json')) {
    const tmData = JSON.parse(fs.readFileSync('scripts/all_tm_transfers_exact.json', 'utf8'));
    for (const [slug, info] of Object.entries(tmData)) {
      for (const a of info.altas || []) {
        if (a.player) {
          tmDict.set(normalize(a.player), {
            fullName: a.player,
            pos: a.pos,
            nat: a.nat
          });
        }
      }
    }
  }

  // Read latest BeSoccer HTML
  const htmlPath = fs.existsSync('scripts/besoccer_clausura_peru_latest.html') 
    ? 'scripts/besoccer_clausura_peru_latest.html' 
    : 'scripts/besoccer_clausura_peru.html';
  console.log(`Reading HTML from: ${htmlPath}`);
  const html = fs.readFileSync(htmlPath, 'utf8');

  const clubsData = parseBeSoccerHtml(html);
  console.log(`Parsed ${clubsData.length} clubs from BeSoccer.`);

  // Helper to resolve player
  async function resolvePlayer(item) {
    const nameClean = cleanText(item.name);
    const norm = normalize(nameClean);

    // 1. Direct match in DB
    if (playerByNorm.has(norm)) {
      const p = playerByNorm.get(norm);
      if (item.photo && !p.photo_url) {
        await supabase.from('players').update({ photo_url: item.photo }).eq('id', p.id);
        p.photo_url = item.photo;
      }
      return p;
    }

    // 2. URL slug match in DB
    if (item.url) {
      const urlSlug = item.url.replace(/^.*\/jugador\//, '').replace(/-[0-9]+$/, '').replace(/-/g, ' ');
      if (playerByNorm.has(normalize(urlSlug))) {
        return playerByNorm.get(normalize(urlSlug));
      }
    }

    // 3. Match in TM dictionary
    const tmMatch = tmDict.get(norm) || (item.url ? tmDict.get(normalize(item.url.replace(/^.*\/jugador\//, '').replace(/-[0-9]+$/, ''))) : null);

    // 4. Initial + Last name match in DB
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

    // 5. Construct best display name
    let bestName = nameClean;
    if (tmMatch?.fullName) {
      bestName = tmMatch.fullName;
    } else if (item.url) {
      const slugParts = item.url.replace(/^.*\/jugador\//, '').replace(/-[0-9]+$/, '').split('-');
      if (slugParts.length >= 2 && slugParts[0].length > 2 && slugParts.every(p => !p.match(/^[0-9]+$/))) {
        bestName = slugParts.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      }
    }

    let pSlug = slugify(bestName);
    if (playerMap.has(pSlug)) {
      pSlug = `${pSlug}-${Math.floor(Math.random() * 10000)}`;
    }

    const pos = tmMatch?.pos || 'Futbolista';
    const nat = tmMatch?.nat ? (tmMatch.nat.includes('Perú') ? 'Peruano' : tmMatch.nat) : 'Peruano';

    const newPlayerData = {
      full_name: bestName,
      slug: pSlug,
      primary_position: pos,
      nationality: nat,
      photo_url: item.photo || null
    };

    const { data: created, error: createErr } = await supabase
      .from('players')
      .insert(newPlayerData)
      .select('id, full_name, slug, primary_position, nationality, photo_url')
      .single();

    if (createErr) {
      console.error(`Error creating player ${bestName}:`, createErr.message);
      return null;
    }

    playerByNorm.set(norm, created);
    playerByNorm.set(normalize(bestName), created);
    playerMap.set(pSlug, created);
    dbPlayers.push(created);
    return created;
  }

  // Build transfers list
  const transfersToInsert = [];
  let totalAltas = 0;
  let totalBajas = 0;

  for (const club of clubsData) {
    const dbSlug = BESOCCER_TO_DB_SLUG[club.clubName];
    const team = teamBySlug.get(dbSlug);
    if (!team) {
      console.warn(`Club ${club.clubName} not found in DB!`);
      continue;
    }

    console.log(`Processing ${club.clubName} (${team.name}): ${club.altas.length} altas, ${club.bajas.length} bajas...`);

    // Altas (IN)
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
      totalAltas++;
    }

    // Bajas (OUT)
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
      totalBajas++;
    }
  }

  // Ensure Sebastián Britos is in Universitario OUT
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
    totalBajas++;
  }

  console.log(`\n=== TOTAL 2026 TRANSFERS TO INSERT: ${transfersToInsert.length} (${totalAltas} Altas, ${totalBajas} Bajas) ===`);

  // Clear previous 2026 transfers
  console.log('Clearing existing 2026 transfers...');
  await supabase.from('transfers').delete().eq('season_year', 2026);

  // Insert in batches of 50
  const BATCH_SIZE = 50;
  let inserted = 0;
  for (let i = 0; i < transfersToInsert.length; i += BATCH_SIZE) {
    const chunk = transfersToInsert.slice(i, i + BATCH_SIZE);
    const { error: insErr } = await supabase.from('transfers').insert(chunk);
    if (insErr) {
      console.error(`Error inserting chunk ${i}:`, insErr.message);
    } else {
      inserted += chunk.length;
    }
  }

  console.log(`Successfully synced ${inserted} BeSoccer 2026 transfers into Supabase!`);
}

main();
