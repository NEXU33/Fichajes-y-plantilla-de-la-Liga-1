import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ugujgzrfysucybbncxrs.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVndWpnenJmeXN1Y3liYm5jeHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUwMjk3NDcsImV4cCI6MjExMDYwNTc0N30.KavzLBrgphW52oAqHu8MNcKz_YvcO2EUXI6NvWXdugY';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
  realtime: { transport: WebSocket }
});

const exchangeRate = 1.0999;
const todayStr = '2026-11-19';

// 1. Jugadores no pertenecientes al plantel 2026 que deben ser depurados
const playersToPurge = [
  { name: 'Mathías Carpio', reason: 'Traspaso a Comerciantes Unidos', otherClub: 'Comerciantes Unidos', date: '2026-01-10' },
  { name: 'Carlos López Vanegas', reason: 'Traspaso a Sport Boys', otherClub: 'Sport Boys', date: '2026-01-05' },
  { name: 'Carlos López', reason: 'Traspaso a Sport Boys', otherClub: 'Sport Boys', date: '2026-01-05' },
  { name: 'Kevin Becerra', reason: 'Traspaso a Cienciano', otherClub: 'Club Cienciano', date: '2026-01-08' },
  { name: 'Ayrthon Quintana', reason: 'Rescisión de contrato (Setiembre 2026)', otherClub: 'Agente Libre', date: '2026-09-28' },
  { name: 'Abel Casquete', reason: 'Traspaso a Alianza Universidad', otherClub: 'Alianza Universidad', date: '2026-01-15' },
  { name: 'José Manzaneda', reason: 'Traspaso a Cusco FC', otherClub: 'Cusco FC', date: '2026-01-10' },
  { name: 'William Mimbela', reason: 'Traspaso a CD Unión Comercio', otherClub: 'CD Unión Comercio', date: '2026-01-20' },
  { name: 'Rudy Palomino', reason: 'Traspaso a Alianza Universidad', otherClub: 'Alianza Universidad', date: '2026-01-12' },
  { name: 'Ademar Robles', reason: 'Traspaso a Cienciano', otherClub: 'Club Cienciano', date: '2026-01-14' }
];

// 2. Nómina oficial estricta de Los Chankas CYC 2026
const chankasOfficial2026Roster = [
  // Arqueros
  { name: 'Franco Saravia', pos: 'Portero', nat: 'Peruano', num: 1, eur: 450000, birth: '1999-06-02', prev: [{ club: 'Alianza Lima', years: '2021-2024' }] },
  { name: 'Hairo Camacho', pos: 'Portero', nat: 'Peruano', num: 12, eur: 175000, birth: '1993-04-18', prev: [{ club: 'FC San Marcos', years: '2023-2024' }] },
  { name: 'Anthony Sánchez', pos: 'Portero', nat: 'Peruano', num: 21, eur: 100000, birth: '2000-08-15', prev: [{ club: 'Sport Huancayo', years: '2021-2023' }] },

  // Defensas
  { name: 'Gonzalo Rizzo', pos: 'Defensa Central', nat: 'Uruguayo / Peruano', num: 24, eur: 400000, birth: '1995-12-27', prev: [{ club: 'Rentistas', years: '2022-2023' }, { club: 'Cusco FC', years: '2020-2021' }] },
  { name: 'Ángelo Pizzorno', pos: 'Defensa Central', nat: 'Uruguayo', num: 2, eur: 350000, birth: '1991-10-21', prev: [{ club: 'Alianza Atlético', years: '2022-2024' }] },
  { name: 'Franz Schmidt', pos: 'Defensa Central', nat: 'Peruano', num: 4, eur: 300000, birth: '2000-05-03', prev: [{ club: 'Cusco FC', years: '2023-2024' }, { club: 'Alianza Lima', years: '2019-2021' }] },
  { name: 'Ederson Mogollón', pos: 'Defensa Central', nat: 'Peruano', num: 5, eur: 250000, birth: '1992-10-04', prev: [{ club: 'Cantolao', years: '2021-2023' }] },
  { name: 'Héctor González', pos: 'Defensa Central', nat: 'Argentino', num: 3, eur: 250000, birth: '1995-03-12', prev: [{ club: 'Villa Dálmine', years: '2022-2023' }] },
  { name: 'Santiago Torres', pos: 'Lateral Derecho', nat: 'Argentino / Peruano', num: 17, eur: 200000, birth: '2001-09-10', prev: [{ club: 'C. Alvarado', years: '2022-2024' }] },
  { name: 'Carlos Pimienta', pos: 'Lateral', nat: 'Uruguayo', num: 15, eur: 200000, birth: '1992-07-28', prev: [{ club: 'Inter de Barinas', years: '2023-2024' }] },
  { name: 'David Gonzáles', pos: 'Lateral Izquierdo', nat: 'Peruano', num: 13, eur: 175000, birth: '1998-03-20', prev: [{ club: 'Santos FC', years: '2023-2024' }] },

  // Mediocampistas
  { name: 'Jordan Guivin', pos: 'Mediocentro', nat: 'Peruano', num: 8, eur: 450000, birth: '1998-02-23', prev: [{ club: 'Cienciano', years: '2024' }, { club: 'Cusco FC', years: '2023' }, { club: 'Universitario', years: '2022' }] },
  { name: 'Abdiel Ayarza', pos: 'Pivote', nat: 'Panameño', num: 6, eur: 500000, birth: '1992-09-12', prev: [{ club: 'The Strongest', years: '2024' }, { club: 'Cusco FC', years: '2022-2023' }, { club: 'Cienciano', years: '2020-2021' }] },
  { name: 'Christian Velarde', pos: 'Mediocentro', nat: 'Peruano', num: 14, eur: 250000, birth: '1995-10-14', prev: [{ club: 'Carlos Mannucci', years: '2024' }, { club: 'Unión Comercio', years: '2022-2023' }] },
  { name: 'Leonardo Mifflin', pos: 'Pivote', nat: 'Peruano', num: 20, eur: 225000, birth: '2000-01-04', prev: [{ club: 'Cienciano', years: '2023-2024' }, { club: 'FBC Melgar', years: '2019-2022' }] },
  { name: 'Adrián Quiroz', pos: 'Mediocentro', nat: 'Peruano', num: 16, eur: 150000, birth: '1999-11-08', prev: [{ club: 'Comerciantes FC', years: '2023-2024' }] },
  { name: 'José Zurita', pos: 'Mediocentro', nat: 'Peruano', num: 22, eur: 125000, birth: '2001-04-16', prev: [{ club: 'Juventus Huamachuco', years: '2023-2024' }] },
  { name: 'Oshiro Takeuchi', pos: 'Extremo', nat: 'Peruano', num: 19, eur: 250000, birth: '1994-06-25', prev: [{ club: 'Carlos Stein', years: '2022-2023' }] },
  { name: 'Flavio Fernández', pos: 'Extremo', nat: 'Peruano', num: 18, eur: 175000, birth: '2001-02-14', prev: [{ club: 'Pirata FC', years: '2023-2024' }] },

  // Delanteros
  { name: 'Pablo Bueno', pos: 'Delantero Centro', nat: 'Argentino', num: 9, eur: 400000, birth: '1990-02-23', prev: [{ club: 'Sport Boys', years: '2024' }, { club: 'Alianza Petrolera', years: '2021-2023' }] },
  { name: 'Isaac Camargo', pos: 'Delantero Centro', nat: 'Colombiano', num: 11, eur: 350000, birth: '1999-10-28', prev: [{ club: 'Alianza Petrolera', years: '2023-2024' }, { club: 'Unión Magdalena', years: '2021-2022' }] },
  { name: 'Kevin Sánchez', pos: 'Delantero Centro', nat: 'Peruano', num: 23, eur: 150000, birth: '1999-05-18', prev: [{ club: 'Deportivo Llacuabamba', years: '2023-2024' }] },
  { name: 'Gonzalo Sánchez', pos: 'Delantero Centro', nat: 'Peruano', num: 27, eur: 175000, birth: '2000-05-06', prev: [{ club: 'Alianza Lima', years: '2019-2021' }, { club: 'FC Emmen', years: '2021-2022' }] },
  { name: 'Jarlín Quintero', pos: 'Delantero Centro', nat: 'Colombiano', num: 29, eur: 300000, birth: '1993-08-19', prev: [{ club: 'UTC', years: '2023-2024' }, { club: 'Academia Cantolao', years: '2020-2022' }] }
];

async function main() {
  console.log('🚀 INICIANDO SINCRONIZACIÓN ESTRICTA Y DEPURACIÓN DE LOS CHANKAS (2026)...');

  const { data: team } = await supabase.from('teams').select('id, name').eq('slug', 'los-chankas').single();
  console.log(`Club: ${team.name} (${team.id})`);

  // 1. Depurar jugadores no vigentes
  console.log('\n--- 1. Depurando jugadores no vigentes de player_seasons ---');
  for (const p of playersToPurge) {
    const { data: foundPlayers } = await supabase.from('players').select('id, full_name').ilike('full_name', `%${p.name}%`);
    if (foundPlayers && foundPlayers.length > 0) {
      for (const pl of foundPlayers) {
        // Eliminar de player_seasons 2026
        const { error: delErr } = await supabase.from('player_seasons').delete()
          .eq('player_id', pl.id)
          .eq('team_id', team.id)
          .eq('season_year', 2026);

        if (!delErr) {
          console.log(`❌ Depurado de plantilla 2026: ${pl.full_name}`);
        }

        // Registrar en transfers como OUT
        const { error: insTrErr } = await supabase.from('transfers').insert({
          player_id: pl.id,
          team_id: team.id,
          season_year: 2026,
          transfer_type: 'OUT',
          departure_reason: p.reason,
          other_club_name: p.otherClub,
          source_type: 'Transfermarkt',
          announced_at: p.date,
          contract_end_date: p.date
        });

        if (!insTrErr) {
          console.log(`   ➡️ Registrada Salida: ${pl.full_name} (${p.reason} -> ${p.otherClub})`);
        }
      }
    }
  }

  // 2. Insertar / Actualizar nómina oficial de 24 futbolistas verificados
  console.log('\n--- 2. Insertando/Actualizando nómina oficial verificada 2026 ---');
  for (const item of chankasOfficial2026Roster) {
    let playerId = null;
    const { data: existingPlayer } = await supabase.from('players').select('id').ilike('full_name', `%${item.name}%`).maybeSingle();
    if (existingPlayer) {
      playerId = existingPlayer.id;
    } else {
      const { data: newPlayer, error: pErr } = await supabase.from('players').insert({
        full_name: item.name,
        primary_position: item.pos,
        nationality: item.nat,
        birth_date: item.birth
      }).select('id').single();
      if (pErr) {
        console.error(`Error creando jugador ${item.name}:`, pErr.message);
        continue;
      }
      playerId = newPlayer.id;
    }

    const usd = Math.round(item.eur * exchangeRate);
    const { data: existingPs } = await supabase.from('player_seasons').select('id')
      .eq('player_id', playerId)
      .eq('team_id', team.id)
      .eq('season_year', 2026)
      .maybeSingle();

    if (existingPs) {
      await supabase.from('player_seasons').update({
        jersey_number: item.num,
        market_value_eur: item.eur,
        market_value_usd: usd,
        matches_played: 18,
        contract_start_date: '2026-01-01',
        contract_end_date: '2026-12-31',
        last_updated: new Date().toISOString()
      }).eq('id', existingPs.id);
      console.log(`✅ Actualizado: #${item.num} ${item.name} (${item.pos} - ${item.nat})`);
    } else {
      const { error: insErr } = await supabase.from('player_seasons').insert({
        player_id: playerId,
        team_id: team.id,
        season_year: 2026,
        jersey_number: item.num,
        market_value_eur: item.eur,
        market_value_usd: usd,
        matches_played: 18,
        contract_start_date: '2026-01-01',
        contract_end_date: '2026-12-31',
        last_updated: new Date().toISOString()
      });
      if (insErr) {
        console.error(`Error insertando ${item.name}:`, insErr.message);
      } else {
        console.log(`✅ Insertado: #${item.num} ${item.name} (${item.pos} - ${item.nat})`);
      }
    }

    // Historial clubes
    if (item.prev && item.prev.length > 0) {
      await supabase.from('player_previous_clubs').delete().eq('player_id', playerId);
      for (let idx = 0; idx < item.prev.length; idx++) {
        await supabase.from('player_previous_clubs').insert({
          player_id: playerId,
          club_name: item.prev[idx].club,
          years_period: item.prev[idx].years,
          order_index: idx + 1
        });
      }
    }
  }

  // 3. Verificar nómina final activa de Los Chankas
  console.log('\n--- 3. Verificando nómina estricta final activa ---');
  const { data: finalRoster } = await supabase.from('player_seasons')
    .select('jersey_number, players(full_name, primary_position, nationality)')
    .eq('team_id', team.id)
    .eq('season_year', 2026)
    .order('jersey_number', { ascending: true });

  console.log(`Plantilla Final Activa: ${finalRoster?.length || 0} futbolistas`);
  finalRoster?.forEach((p, idx) => {
    console.log(`   ${idx + 1}. #${p.jersey_number || '-'} ${p.players?.full_name} (${p.players?.primary_position} · ${p.players?.nationality})`);
  });

  // 4. Actualizar squad_size en team_seasons
  await supabase.from('team_seasons').update({
    squad_size: finalRoster?.length || 24,
    last_updated: new Date().toISOString()
  }).eq('team_id', team.id).eq('season_year', 2026);

  console.log('\n🎉 ¡DEPURACIÓN Y ACTUALIZACIÓN DIARIA DE LOS CHANKAS COMPLETADA!');
  process.exit(0);
}

main().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
});
