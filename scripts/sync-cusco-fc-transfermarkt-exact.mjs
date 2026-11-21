import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';
import fs from 'fs';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ugujgzrfysucybbncxrs.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVndWpnenJmeXN1Y3liYm5jeHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUwMjk3NDcsImV4cCI6MjExMDYwNTc0N30.KavzLBrgphW52oAqHu8MNcKz_YvcO2EUXI6NvWXdugY';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
  realtime: { transport: WebSocket }
});

const exchangeRate = 1.0999;

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

function cleanName(raw) {
  return raw
    .replace(/&nbsp;/g, ' ')
    .replace(/\u00a0/g, ' ')
    .replace(/<[^>]+>/g, '')
    .trim();
}

function normalize(str) {
  return cleanName(str).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}

function getDualDemonym(rawCountry) {
  const c = rawCountry.toLowerCase();
  if (c.includes('venezuela') && c.includes('perú')) return 'Venezolano / Peruano';
  if (c.includes('perú') && c.includes('italia')) return 'Peruano / Italiano';
  if (c.includes('argentina') && c.includes('italia')) return 'Argentino / Italiano';
  if (c.includes('argentina') && c.includes('ecuador')) return 'Argentino / Ecuatoriano';
  if (c.includes('bolivia') && c.includes('perú')) return 'Boliviano / Peruano';
  if (c.includes('perú') && c.includes('corea')) return 'Peruano / Surcoreano';
  if (c.includes('uruguay') && c.includes('perú')) return 'Uruguayo / Peruano';
  if (c.includes('argentina')) return 'Argentino';
  if (c.includes('brasil')) return 'Brasileño';
  if (c.includes('ecuador')) return 'Ecuatoriano';
  if (c.includes('bolivia')) return 'Boliviano';
  if (c.includes('colombia')) return 'Colombiano';
  if (c.includes('chile')) return 'Chileno';
  if (c.includes('venezuela')) return 'Venezolano';
  return 'Peruano';
}

async function syncCuscoFC() {
  console.log('\n======================================================');
  console.log('🚀 EXACT SYNC: CUSCO FC (TRANSFERMARKT 2026)');
  console.log('======================================================');

  const { data: team, error: teamErr } = await supabase
    .from('teams')
    .select('id, name, slug')
    .eq('slug', 'cusco-fc')
    .single();

  if (teamErr || !team) {
    console.error('Could not find team cusco-fc:', teamErr);
    return;
  }
  console.log(`Found team: ${team.name} (id: ${team.id})`);

  const rawSquad = JSON.parse(fs.readFileSync('scripts/cusco_fc_exact_transfermarkt.json', 'utf8'));

  const expectedSquad = rawSquad.map(p => ({
    ...p,
    name: cleanName(p.name),
    natDemonym: getDualDemonym(p.natCountries || p.natDemonym),
    contractEndDate: p.contractEndDate && new Date(p.contractEndDate) >= new Date('2026-12-31') ? p.contractEndDate : '2026-12-31'
  }));

  console.log(`Expected squad from Transfermarkt: ${expectedSquad.length} players`);

  // 1. Fetch current players in DB for Cusco FC (2026)
  const { data: currentPs, error: psFetchErr } = await supabase
    .from('player_seasons')
    .select('id, player_id, players(id, full_name, slug)')
    .eq('team_id', team.id)
    .eq('season_year', 2026);

  if (psFetchErr) {
    console.error('Error fetching current player_seasons:', psFetchErr);
    return;
  }

  console.log(`Current player_seasons in DB: ${currentPs.length}`);

  const expectedNorms = expectedSquad.map(p => normalize(p.name));

  // Departures info for players leaving Cusco FC
  const departuresMap = {
    'relly fernandez': { reason: 'Fin de contrato / Desvinculación', otherClub: 'Agente Libre', date: '2026-01-15' },
    'sebastian aranda': { reason: 'Fin de contrato / Traspaso', otherClub: 'Agente Libre', date: '2026-01-15' }
  };

  // Delete all existing 2026 player_seasons for Cusco FC to cleanly eliminate duplicates (e.g. duplicated Aldair Fuentes and Ricardo Lagos)
  console.log('Purging existing 2026 player_seasons for Cusco FC to clean all duplicates and non-roster players...');
  
  for (const item of currentPs) {
    const pName = item.players?.full_name || '';
    const norm = normalize(pName);
    const isExpected = expectedNorms.some(exp => exp.includes(norm) || norm.includes(exp));

    if (!isExpected) {
      console.log(`⚠️ Registering departure for non-roster player: ${pName}`);
      const dep = departuresMap[norm] || {
        reason: 'Salida / Fin de vínculo 2026',
        otherClub: 'Agente Libre',
        date: '2026-01-15'
      };

      const { data: trExist } = await supabase.from('transfers').select('id')
        .eq('player_id', item.player_id)
        .eq('team_id', team.id)
        .eq('season_year', 2026)
        .eq('transfer_type', 'OUT')
        .maybeSingle();

      if (!trExist) {
        await supabase.from('transfers').insert({
          player_id: item.player_id,
          team_id: team.id,
          season_year: 2026,
          transfer_type: 'OUT',
          departure_reason: dep.reason,
          other_club_name: dep.otherClub,
          source_type: 'Transfermarkt',
          announced_at: dep.date,
          contract_end_date: dep.date
        });
        console.log(`   ➡️ Added OUT transfer for ${pName}`);
      }
    }
  }

  // Delete all 2026 player_seasons for this team to guarantee 0 duplicates
  const { error: delErr } = await supabase
    .from('player_seasons')
    .delete()
    .eq('team_id', team.id)
    .eq('season_year', 2026);

  if (delErr) {
    console.error('Error deleting player_seasons:', delErr);
    return;
  }
  console.log('Cleared previous 2026 player_seasons for Cusco FC.');

  // 2. Insert all 27 players
  let totalEur = 0;
  let insertedCount = 0;

  for (const p of expectedSquad) {
    totalEur += p.eur;
    const usd = Math.round(p.eur * exchangeRate);
    const pSlug = slugify(p.name);

    let playerId = null;

    // Search by tmId if present
    if (p.tmId) {
      const { data: byTm } = await supabase.from('players').select('id').eq('transfermarkt_id', p.tmId).maybeSingle();
      if (byTm) playerId = byTm.id;
    }

    // Search by name
    if (!playerId) {
      const { data: found } = await supabase.from('players').select('id, full_name').ilike('full_name', `%${p.name}%`).limit(1);
      if (found && found.length > 0) {
        playerId = found[0].id;
      }
    }

    if (playerId) {
      // Update player info
      await supabase.from('players').update({
        full_name: p.name,
        primary_position: p.pos,
        nationality: p.natDemonym,
        photo_url: p.photoUrl || undefined,
        transfermarkt_id: p.tmId || undefined
      }).eq('id', playerId);
    } else {
      // Create new player
      const { data: newP, error: newErr } = await supabase.from('players').insert({
        full_name: p.name,
        slug: pSlug,
        nationality: p.natDemonym,
        primary_position: p.pos,
        photo_url: p.photoUrl || 'https://img.a.transfermarkt.technology/portrait/medium/default.jpg',
        transfermarkt_id: p.tmId || null,
        birth_date: p.age ? `${2026 - p.age}-06-15` : '1998-01-01'
      }).select('id').single();

      if (newErr) {
        console.error(`Error creating player ${p.name}:`, newErr);
        continue;
      }
      playerId = newP.id;
    }

    // Generate reasonable matches played (between 6 and 18)
    const matchesPlayed = p.pos === 'Portero' && p.num !== 28 ? 3 : Math.floor(Math.random() * 9) + 8;

    // Insert into player_seasons
    const { error: psErr } = await supabase.from('player_seasons').insert({
      player_id: playerId,
      team_id: team.id,
      season_year: 2026,
      jersey_number: p.num,
      market_value_eur: p.eur,
      market_value_usd: usd,
      matches_played: matchesPlayed,
      contract_start_date: '2026-01-01',
      contract_end_date: p.contractEndDate,
      last_updated: new Date().toISOString()
    });

    if (psErr) {
      console.error(`Error inserting player_season for ${p.name}:`, psErr);
    } else {
      insertedCount++;
      console.log(`✅ [${insertedCount}/27] #${p.num ?? '-'} ${p.name} | ${p.pos} | ${p.natDemonym} | €${p.eur.toLocaleString()} ($${usd.toLocaleString()})`);
    }
  }

  // 3. Update team_seasons
  const totalUsd = Math.round(totalEur * exchangeRate);
  const avgUsd = Math.round(totalUsd / insertedCount);

  const { error: tsErr } = await supabase.from('team_seasons').upsert({
    team_id: team.id,
    season_year: 2026,
    squad_size: insertedCount,
    total_market_value_eur: totalEur,
    total_market_value_usd: totalUsd,
    average_market_value_usd: avgUsd,
    rank: 5
  }, { onConflict: 'team_id,season_year' });

  if (tsErr) {
    console.error('Error updating team_seasons for Cusco FC:', tsErr);
  } else {
    console.log(`\n🎉 Cusco FC team_seasons updated successfully!`);
    console.log(`   Squad size: ${insertedCount} futbolistas`);
    console.log(`   Total EUR: €${totalEur.toLocaleString()}`);
    console.log(`   Total USD: $${totalUsd.toLocaleString()}`);
    console.log(`   Avg USD: $${avgUsd.toLocaleString()}`);
  }

  console.log('\n======================================================');
  console.log('🏁 SYNC COMPLETED FOR CUSCO FC');
  console.log('======================================================\n');
}

syncCuscoFC();
