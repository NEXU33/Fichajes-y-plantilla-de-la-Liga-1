import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ugujgzrfysucybbncxrs.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVndWpnenJmeXN1Y3liYm5jeHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUwMjk3NDcsImV4cCI6MjExMDYwNTc0N30.KavzLBrgphW52oAqHu8MNcKz_YvcO2EUXI6NvWXdugY';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
  realtime: { transport: WebSocket }
});

const exchangeRate = 1.0999;

// Jugadores desvinculados que deben ser eliminados de la plantilla 2026 de Los Chankas
// y registrados en Salidas de Jugadores (transfers: transfer_type = 'OUT')
const chankasDepartures = [
  {
    name: 'Ayrthon Quintana',
    position: 'Lateral Izquierdo',
    nationality: 'Peruano',
    reason: 'Rescisión de contrato (Setiembre 2026)',
    announcedAt: '2026-09-28',
    otherClub: 'Agente Libre'
  },
  {
    name: 'Abel Casquete',
    position: 'Mediocentro Ofensivo',
    nationality: 'Ecuatoriano',
    reason: 'Traspaso oficial',
    announcedAt: '2026-01-15',
    otherClub: 'Alianza Universidad'
  },
  {
    name: 'José Manzaneda',
    position: 'Extremo Izquierdo',
    nationality: 'Peruano',
    reason: 'Traspaso oficial',
    announcedAt: '2026-01-10',
    otherClub: 'Cusco FC'
  },
  {
    name: 'Willian Mimbela',
    position: 'Mediocentro Ofensivo',
    nationality: 'Peruano',
    reason: 'Traspaso oficial',
    announcedAt: '2026-01-20',
    otherClub: 'CD Unión Comercio'
  },
  {
    name: 'Rudy Palomino',
    position: 'Mediocentro',
    nationality: 'Peruano',
    reason: 'Traspaso oficial',
    announcedAt: '2026-01-12',
    otherClub: 'Alianza Universidad'
  },
  {
    name: 'Ademar Robles',
    position: 'Mediocentro',
    nationality: 'Peruano',
    reason: 'Traspaso oficial',
    announcedAt: '2026-01-14',
    otherClub: 'Club Cienciano'
  }
];

// Jugadores verificados y activos de Los Chankas para la temporada vigente 2026
const verifiedChankasPlayers = [
  {
    name: 'Hairo Camacho',
    position: 'Portero',
    nationality: 'Peruano',
    number: 12,
    eur: 175000,
    matches: 18,
    birth: '1993-04-18',
    prev: [{ club: 'Santos FC', years: '2022-2023' }]
  },
  {
    name: 'Kevin Becerra',
    position: 'Defensa Central',
    nationality: 'Ecuatoriano',
    number: 3,
    eur: 350000,
    matches: 22,
    birth: '1996-01-24',
    prev: [{ club: '9 de Octubre', years: '2021-2023' }]
  },
  {
    name: 'Carlos Gamarra',
    position: 'Defensa Central',
    nationality: 'Peruano',
    number: 4,
    eur: 300000,
    matches: 20,
    birth: '1998-05-12',
    prev: [{ club: 'Carlos Stein', years: '2022-2023' }]
  },
  {
    name: 'José Luján',
    position: 'Defensa Central',
    nationality: 'Peruano',
    number: 5,
    eur: 300000,
    matches: 19,
    birth: '1997-03-25',
    prev: [{ club: 'FBC Melgar', years: '2022-2023' }, { club: 'Universidad San Martín', years: '2019-2021' }]
  },
  {
    name: 'Rotceh Aguilar',
    position: 'Lateral Derecho',
    nationality: 'Peruano',
    number: 17,
    eur: 275000,
    matches: 21,
    birth: '2001-06-12',
    prev: [{ club: 'Deportivo Municipal', years: '2020-2023' }]
  },
  {
    name: 'Cristian Velarde',
    position: 'Mediocentro',
    nationality: 'Peruano',
    number: 15,
    eur: 250000,
    matches: 23,
    birth: '1995-10-14',
    prev: [{ club: 'Unión Comercio', years: '2022-2023' }, { club: 'Alianza Lima', years: '2019-2020' }]
  },
  {
    name: 'Carlos López Vanegas',
    position: 'Extremo',
    nationality: 'Colombiano',
    number: 7,
    eur: 500000,
    matches: 25,
    birth: '1994-08-01',
    prev: [{ club: 'Alianza Atlético', years: '2022-2023' }, { club: 'Unión Huaral', years: '2020-2021' }]
  },
  {
    name: 'Mathías Carpio',
    position: 'Mediocampista',
    nationality: 'Peruano',
    number: 23,
    eur: 225000,
    matches: 17,
    birth: '2002-11-20',
    prev: [{ club: 'Cienciano', years: '2021-2023' }]
  },
  {
    name: 'Jordan Guivin',
    position: 'Mediocentro',
    nationality: 'Peruano',
    number: 8,
    eur: 400000,
    matches: 24,
    birth: '1998-02-23',
    prev: [{ club: 'Cusco FC', years: '2023-2024' }, { club: 'Universitario', years: '2022' }, { club: 'Celaya', years: '2021-2022' }]
  },
  {
    name: 'Ángel Ledesma',
    position: 'Delantero Centro',
    nationality: 'Ecuatoriano',
    number: 9,
    eur: 450000,
    matches: 22,
    birth: '1993-06-22',
    prev: [{ club: 'Manta FC', years: '2021-2023' }, { club: 'Delfín SC', years: '2020' }]
  }
];

async function main() {
  console.log('🚀 INICIANDO CORRECCIÓN EXHAUSTIVA DE PLANTILLA LOS CHANKAS (2026)...');

  const { data: team, error: teamErr } = await supabase
    .from('teams')
    .select('id, name, slug')
    .eq('slug', 'los-chankas')
    .single();

  if (teamErr) throw teamErr;
  console.log(`Club identificado: ${team.name} (${team.id})`);

  // 1. Identificar y eliminar los jugadores no vigentes de player_seasons de Los Chankas 2026
  console.log('\n--- 1. Eliminando futbolistas desvinculados de la plantilla 2026 ---');
  for (const dep of chankasDepartures) {
    // Buscar si existe el jugador
    const { data: pList } = await supabase
      .from('players')
      .select('id, full_name')
      .ilike('full_name', `%${dep.name}%`);

    if (pList && pList.length > 0) {
      for (const p of pList) {
        // Eliminar de player_seasons para Los Chankas 2026
        const { error: delErr } = await supabase
          .from('player_seasons')
          .delete()
          .eq('player_id', p.id)
          .eq('team_id', team.id)
          .eq('season_year', 2026);

        if (delErr) {
          console.error(`Error desvinculando ${p.full_name}:`, delErr.message);
        } else {
          console.log(`❌ ${p.full_name} eliminado de la plantilla 2026 de Los Chankas.`);
        }

        // Registrar en transfers como 'OUT' (Salidas de Jugadores) con su motivo oficial
        const { error: trErr } = await supabase
          .from('transfers')
          .upsert({
            player_id: p.id,
            team_id: team.id,
            season_year: 2026,
            transfer_type: 'OUT',
            departure_reason: dep.reason,
            other_club_name: dep.otherClub,
            source_type: 'Transfermarkt',
            announced_at: dep.announcedAt,
            contract_end_date: dep.announcedAt,
            is_confirmed: true
          }, { onConflict: 'player_id,team_id,season_year,transfer_type' });

        if (trErr) {
          // Intentar insertar si no hay conflicto compuesto
          await supabase.from('transfers').insert({
            player_id: p.id,
            team_id: team.id,
            season_year: 2026,
            transfer_type: 'OUT',
            departure_reason: dep.reason,
            other_club_name: dep.otherClub,
            source_type: 'Transfermarkt',
            announced_at: dep.announcedAt,
            contract_end_date: dep.announcedAt,
            is_confirmed: true
          });
        }
        console.log(`   ➡️ ${p.full_name} añadido a Salidas de Jugadores (Motivo: ${dep.reason})`);
      }
    } else {
      console.log(`Jugador no encontrado en BD: ${dep.name}`);
    }
  }

  // 2. Insertar los nuevos futbolistas confirmados y activos en Los Chankas
  console.log('\n--- 2. Incorporando futbolistas activos y verificados a la plantilla ---');
  for (const item of verifiedChankasPlayers) {
    let pId = null;
    const { data: exist } = await supabase
      .from('players')
      .select('id')
      .ilike('full_name', `%${item.name}%`)
      .maybeSingle();

    if (exist) {
      pId = exist.id;
    } else {
      const { data: newP, error: newPErr } = await supabase
        .from('players')
        .insert({
          full_name: item.name,
          primary_position: item.position,
          nationality: item.nationality,
          birth_date: item.birth
        })
        .select('id')
        .single();
      if (newPErr) {
        console.error(`Error creando jugador ${item.name}:`, newPErr.message);
        continue;
      }
      pId = newP.id;
    }

    // Insertar / actualizar player_seasons para 2026
    const usd = Math.round(item.eur * exchangeRate);
    const { data: existingPs } = await supabase
      .from('player_seasons')
      .select('id')
      .eq('player_id', pId)
      .eq('season_year', 2026)
      .maybeSingle();

    if (existingPs) {
      await supabase
        .from('player_seasons')
        .update({
          team_id: team.id,
          jersey_number: item.number,
          market_value_eur: item.eur,
          market_value_usd: usd,
          matches_played: item.matches,
          contract_start_date: '2026-01-01',
          contract_end_date: '2026-12-31'
        })
        .eq('id', existingPs.id);
      console.log(`✅ ${item.name} (#${item.number} | ${item.position} | ${item.nationality}) actualizado en Los Chankas 2026`);
    } else {
      const { error: insErr } = await supabase
        .from('player_seasons')
        .insert({
          player_id: pId,
          team_id: team.id,
          season_year: 2026,
          jersey_number: item.number,
          market_value_eur: item.eur,
          market_value_usd: usd,
          matches_played: item.matches,
          contract_start_date: '2026-01-01',
          contract_end_date: '2026-12-31'
        });
      if (insErr) {
        console.error(`Error insertando player_seasons para ${item.name}:`, insErr.message);
      } else {
        console.log(`✅ ${item.name} (#${item.number} | ${item.position} | ${item.nationality}) insertado en Los Chankas 2026`);
      }
    }

    // Clubes anteriores
    if (item.prev && item.prev.length > 0) {
      await supabase.from('player_previous_clubs').delete().eq('player_id', pId);
      for (let idx = 0; idx < item.prev.length; idx++) {
        await supabase.from('player_previous_clubs').insert({
          player_id: pId,
          club_name: item.prev[idx].club,
          years_period: item.prev[idx].years,
          order_index: idx + 1
        });
      }
    }
  }

  // 3. Verificar nómina final de Los Chankas
  console.log('\n--- 3. Verificando nómina final de Los Chankas en 2026 ---');
  const { data: finalSquad } = await supabase
    .from('player_seasons')
    .select('jersey_number, players(full_name, primary_position, nationality)')
    .eq('team_id', team.id)
    .eq('season_year', 2026);

  console.log(`Total futbolistas en nómina final de Los Chankas: ${finalSquad?.length || 0}`);
  (finalSquad || []).forEach((ps, i) => {
    console.log(`   ${i + 1}. #${ps.jersey_number || '-'} ${ps.players?.full_name} (${ps.players?.primary_position} - ${ps.players?.nationality})`);
  });

  // Actualizar squad_size en team_seasons
  await supabase
    .from('team_seasons')
    .update({ squad_size: finalSquad?.length || 25 })
    .eq('team_id', team.id)
    .eq('season_year', 2026);

  console.log('\n🎉 ¡CORRECCIÓN DE LOS CHANKAS FINALIZADA CON ÉXITO!');
  process.exit(0);
}

main().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
});
