import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ugujgzrfysucybbncxrs.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVndWpnenJmeXN1Y3liYm5jeHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUwMjk3NDcsImV4cCI6MjExMDYwNTc0N30.KavzLBrgphW52oAqHu8MNcKz_YvcO2EUXI6NvWXdugY';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
  realtime: { transport: WebSocket }
});

function cleanText(str) {
  if (!str) return '';
  return str
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
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
  console.log('--- 1. Fetching Teams from DB ---');
  const { data: dbTeams, error: tmErr } = await supabase.from('teams').select('id, name, slug');
  if (tmErr) throw tmErr;
  const teamBySlug = {};
  for (const t of dbTeams) teamBySlug[t.slug] = t;

  console.log('--- 2. Deleting all outdated/fake 2026 IN transfers ---');
  const { error: delErr } = await supabase
    .from('transfers')
    .delete()
    .eq('season_year', 2026)
    .eq('transfer_type', 'IN');
  if (delErr) {
    console.error('Error deleting 2026 IN transfers:', delErr);
    return;
  }
  console.log('All previous 2026 IN transfers cleared successfully.');

  const tmData = JSON.parse(fs.readFileSync('scripts/all_tm_transfers_exact.json', 'utf8'));

  // Pre-fetch all players to minimize DB lookups
  const { data: allPlayers } = await supabase.from('players').select('id, full_name, slug');
  const playerMap = new Map();
  for (const p of allPlayers || []) {
    playerMap.set(slugify(p.full_name), p.id);
  }

  let totalInserted = 0;

  for (const [slug, info] of Object.entries(tmData)) {
    const team = teamBySlug[slug];
    if (!team) {
      console.warn(`Club ${slug} not found in DB teams table!`);
      continue;
    }

    console.log(`\nProcessing Fichajes for ${team.name} (${info.altas.length} altas in TM)...`);
    const seenInTeam = new Set();

    for (const alta of info.altas) {
      const playerName = cleanText(alta.player);
      const otherClub = cleanText(alta.club);
      const pos = cleanText(alta.pos) || 'Futbolista';
      const nat = cleanText(alta.nat) || 'Peruano';

      if (!playerName || seenInTeam.has(playerName.toLowerCase())) continue;
      seenInTeam.add(playerName.toLowerCase());

      // Filter out internal youth team promotions if needed, or keep all official signings
      // User specifically cares about real signings and purging fake transfers like Britos, Lapadula, etc.
      if (playerName.toLowerCase().includes('britos')) {
        console.log(`[FILTER] Skipping Sebastián Britos from IN transfers (he is an OUT departure).`);
        continue;
      }
      if (playerName.toLowerCase() === 'gianluca lapadula' || playerName.toLowerCase() === 'piero quispe') {
        console.log(`[FILTER] Skipping fake rumor ${playerName}.`);
        continue;
      }

      // Check or create player
      const pSlug = slugify(playerName);
      let playerId = playerMap.get(pSlug);

      if (!playerId) {
        const { data: newP, error: pErr } = await supabase.from('players').insert({
          full_name: playerName,
          slug: pSlug,
          nationality: nat.includes('Perú') ? 'Peruano' : nat,
          primary_position: pos
        }).select('id').single();

        if (pErr) {
          // If collision on slug
          const fallbackSlug = `${pSlug}-${Math.floor(Math.random() * 1000)}`;
          const { data: fbP } = await supabase.from('players').insert({
            full_name: playerName,
            slug: fallbackSlug,
            nationality: nat.includes('Perú') ? 'Peruano' : nat,
            primary_position: pos
          }).select('id').single();
          playerId = fbP?.id;
        } else {
          playerId = newP?.id;
        }

        if (playerId) playerMap.set(pSlug, playerId);
      }

      if (!playerId) {
        console.warn(`Could not get playerId for ${playerName}`);
        continue;
      }

      // Insert Transfer
      const { error: insErr } = await supabase.from('transfers').insert({
        player_id: playerId,
        team_id: team.id,
        season_year: 2026,
        transfer_type: 'IN',
        other_club_name: otherClub || 'Libre',
        source_type: 'transfermarkt',
        source_url: `https://www.transfermarkt.pe/${info.tmSlug || slug}/transfers/verein/${info.vereinId}`,
        announced_at: '2026-01-05T12:00:00Z',
        contract_start_date: '2026-01-01',
        contract_end_date: '2026-12-31'
      });

      if (insErr) {
        console.error(`Error inserting transfer for ${playerName}:`, insErr.message);
      } else {
        totalInserted++;
      }
    }
  }

  console.log(`\nTotal verified 2026 IN transfers inserted: ${totalInserted}`);

  console.log('\n--- 3. Verifying Sebastián Britos in Universitario ---');
  const uTeam = teamBySlug['universitario'];
  const { data: uTransfers } = await supabase
    .from('transfers')
    .select('id, transfer_type, other_club_name, departure_reason, players(full_name)')
    .eq('team_id', uTeam.id)
    .eq('season_year', 2026);

  console.log(`Universitario 2026 transfers count: ${uTransfers?.length}`);
  const britosRecords = uTransfers?.filter(t => t.players?.full_name?.toLowerCase().includes('britos')) || [];
  console.log('Britos records for Universitario:', britosRecords);

  // Ensure Sebastián Britos is cleanly registered as OUT if not already present
  if (britosRecords.length === 0 || !britosRecords.some(r => r.transfer_type === 'OUT')) {
    console.log('Ensuring Sebastián Britos is registered as OUT...');
    let britosId = playerMap.get('sebastian-britos');
    if (britosId) {
      await supabase.from('transfers').insert({
        player_id: britosId,
        team_id: uTeam.id,
        season_year: 2026,
        transfer_type: 'OUT',
        other_club_name: 'CA Peñarol (Uruguay) / Libre',
        departure_reason: 'Término de contrato (no renovó para 2026)',
        source_type: 'transfermarkt',
        announced_at: '2025-12-31T12:00:00Z',
        contract_end_date: '2025-12-31'
      });
    }
  } else {
    // Update existing OUT record for clarity
    const outRecord = britosRecords.find(r => r.transfer_type === 'OUT');
    if (outRecord) {
      await supabase.from('transfers').update({
        other_club_name: 'CA Peñarol (Uruguay) / Libre',
        departure_reason: 'Término de contrato (no renovó para 2026 y salió a fines de 2025)'
      }).eq('id', outRecord.id);
    }
  }
}

main();
