import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ugujgzrfysucybbncxrs.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVndWpnenJmeXN1Y3liYm5jeHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUwMjk3NDcsImV4cCI6MjExMDYwNTc0N30.KavzLBrgphW52oAqHu8MNcKz_YvcO2EUXI6NvWXdugY';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
  realtime: { transport: WebSocket }
});

const exchangeRate = 1.0999;

const chankasSquad2026 = [
  { name: 'Luis Pretel', slug: 'luis-pretel-ch', nat: 'Peruano', birth: '1995-04-12', pos: 'Portero', eur: 300000, pj: 21, num: 1, clubs: [{c: 'Santos FC', y: '2022 - 2024'}] },
  { name: 'José Cárdenas', slug: 'jose-cardenas-ch', nat: 'Peruano', birth: '1998-02-18', pos: 'Portero', eur: 250000, pj: 6, num: 12, clubs: [{c: 'Deportivo Coopsol', y: '2022 - 2023'}] },
  { name: 'Michael Sotillo', slug: 'michael-sotillo-ch', nat: 'Peruano', birth: '1984-09-17', pos: 'Portero', eur: 200000, pj: 2, num: 21, clubs: [{c: 'Binacional', y: '2018 - 2022'}] },
  { name: 'Gonzalo Rizzo', slug: 'gonzalo-rizzo-ch', nat: 'Uruguayo / Peruano', birth: '1995-12-27', pos: 'Defensa Central', eur: 450000, pj: 22, num: 24, clubs: [{c: 'Carlos A. Mannucci', y: '2024 - 2024'}, {c: 'ADT Tarma', y: '2023 - 2023'}, {c: 'Cusco FC', y: '2021 - 2022'}] },
  { name: 'Ayrthon Quintana', slug: 'ayrthon-quintana-ch', nat: 'Peruano', birth: '2001-04-10', pos: 'Lateral Izquierdo', eur: 375000, pj: 21, num: 31, clubs: [{c: 'Cienciano', y: '2022 - 2024'}] },
  { name: 'Michael Kaufman', slug: 'michael-kaufman-ch', nat: 'Peruano', birth: '2001-07-28', pos: 'Defensa Central', eur: 300000, pj: 18, num: 4, clubs: [{c: 'Los Chankas U20', y: '2022 - 2024'}] },
  { name: 'Héctor González', slug: 'hector-gonzalez-ch', nat: 'Ecuatoriano', birth: '1993-05-14', pos: 'Defensa Central', eur: 350000, pj: 19, num: 3, clubs: [{c: 'Guayaquil City (Ecu)', y: '2022 - 2024'}] },
  { name: 'Ederson Mogollón', slug: 'ederson-mogollon-ch', nat: 'Peruano', birth: '1992-10-04', pos: 'Defensa Central', eur: 300000, pj: 17, num: 5, clubs: [{c: 'Cantolao', y: '2021 - 2022'}] },
  { name: 'Axel Chávez', slug: 'axel-chavez-ch', nat: 'Peruano', birth: '1998-04-20', pos: 'Lateral Izquierdo', eur: 350000, pj: 19, num: 13, clubs: [{c: 'Cienciano', y: '2021 - 2022'}] },
  { name: 'Marlon Ruidias', slug: 'marlon-ruidias-ch', nat: 'Peruano', birth: '1999-03-21', pos: 'Lateral Derecho', eur: 350000, pj: 20, num: 2, clubs: [{c: 'Alfonso Ugarte', y: '2022 - 2023'}] },
  { name: 'José Marina', slug: 'jose-marina-chankas', nat: 'Peruano', birth: '1997-01-20', pos: 'Lateral Derecho', eur: 300000, pj: 16, num: 15, clubs: [{c: 'Santos FC', y: '2022 - 2023'}] },
  { name: 'Franco Medina', slug: 'franco-medina-chankas', nat: 'Peruano', birth: '1999-07-18', pos: 'Lateral Derecho', eur: 350000, pj: 18, num: 22, clubs: [{c: 'Sporting Cristal', y: '2023 - 2024'}, {c: 'Cienciano', y: '2021 - 2022'}] },
  { name: 'Abdiel Ayarza', slug: 'abdiel-ayarza-ch', nat: 'Panameño', birth: '1992-09-12', pos: 'Pivote', eur: 600000, pj: 22, num: 6, clubs: [{c: 'The Strongest (Bol)', y: '2024 - 2024'}, {c: 'Cusco FC', y: '2022 - 2023'}, {c: 'Cienciano', y: '2020 - 2021'}] },
  { name: 'Rudy Palomino', slug: 'rudy-palomino-ch', nat: 'Peruano', birth: '1998-07-23', pos: 'Mediocentro', eur: 350000, pj: 20, num: 8, clubs: [{c: 'Cienciano', y: '2019 - 2022'}] },
  { name: 'Cristian Mejía', slug: 'cristian-mejia-ch', nat: 'Peruano', birth: '1993-02-17', pos: 'Mediocentro', eur: 300000, pj: 18, num: 16, clubs: [{c: 'Deportivo Municipal', y: '2021 - 2022'}] },
  { name: 'Ademar Robles', slug: 'ademar-robles-ch', nat: 'Peruano', birth: '1994-12-15', pos: 'Mediocentro', eur: 250000, pj: 15, num: 14, clubs: [{c: 'Carlos Stein', y: '2022 - 2023'}] },
  { name: 'Abel Casquete', slug: 'abel-casquete-ch', nat: 'Ecuatoriano', birth: '1997-08-08', pos: 'Mediocentro Ofensivo', eur: 450000, pj: 21, num: 10, clubs: [{c: 'Deportivo Coopsol', y: '2022 - 2023'}, {c: 'River Plate (Arg)', y: '2015 - 2017'}] },
  { name: 'Willian Mimbela', slug: 'willian-mimbela-ch', nat: 'Peruano', birth: '1992-05-15', pos: 'Mediocentro Ofensivo', eur: 300000, pj: 17, num: 23, clubs: [{c: 'Unión Comercio', y: '2023 - 2024'}, {c: 'Sport Boys', y: '2021 - 2022'}] },
  { name: 'Jarlín Quintero', slug: 'jarlin-quintero-ch', nat: 'Colombiano', birth: '1993-08-19', pos: 'Delantero Centro', eur: 500000, pj: 22, num: 11, clubs: [{c: 'UTC Cajamarca', y: '2024 - 2025'}, {c: 'Cantolao', y: '2022 - 2022'}] },
  { name: 'Juan Ospina', slug: 'juan-ospina-ch', nat: 'Colombiano', birth: '1998-06-25', pos: 'Extremo Derecho', eur: 400000, pj: 20, num: 18, clubs: [{c: 'Leones FC (Col)', y: '2022 - 2024'}] },
  { name: 'Kenyi Barrios', slug: 'kenyi-barrios-ch', nat: 'Peruano', birth: '1997-03-08', pos: 'Extremo Izquierdo', eur: 300000, pj: 19, num: 7, clubs: [{c: 'Ayacucho FC', y: '2023 - 2024'}, {c: 'Binacional', y: '2021 - 2022'}] },
  { name: 'José Manzaneda', slug: 'jose-manzaneda-ch', nat: 'Peruano', birth: '1994-09-10', pos: 'Extremo Izquierdo', eur: 400000, pj: 20, num: 17, clubs: [{c: 'Alianza Atlético', y: '2023 - 2023'}, {c: 'Alianza Lima', y: '2019 - 2021'}] },
  { name: 'Ángel López', slug: 'angel-lopez-ch', nat: 'Peruano', birth: '2003-05-18', pos: 'Extremo', eur: 300000, pj: 16, num: 20, clubs: [{c: 'Cantolao', y: '2022 - 2023'}] },
  { name: 'Oshiro Takeuchi', slug: 'oshiro-takeuchi-ch', nat: 'Peruano', birth: '1994-04-16', pos: 'Extremo', eur: 300000, pj: 17, num: 19, clubs: [{c: 'Carlos Stein', y: '2022 - 2023'}] },
  { name: 'Gonzalo Sánchez', slug: 'gonzalo-sanchez-ch', nat: 'Peruano', birth: '2000-05-06', pos: 'Delantero Centro', eur: 300000, pj: 16, num: 9, clubs: [{c: 'FC Emmen (P. Bajos)', y: '2022 - 2023'}, {c: 'Alianza Lima', y: '2018 - 2021'}] }
];

async function main() {
  console.log('🚀 INICIANDO CORRECCIÓN OFICIAL DE LA PLANTILLA 2026 DE LOS CHANKAS CYC...');

  const { data: chankasTeam } = await supabase.from('teams').select('*').eq('slug', 'los-chankas').single();
  if (!chankasTeam) {
    throw new Error('No se encontró el equipo Los Chankas en la tabla teams');
  }

  // 1. Limpiar player_seasons previo de Los Chankas para 2026
  await supabase.from('player_seasons').delete().eq('team_id', chankasTeam.id).eq('season_year', 2026);

  // 2. Insertar los 25 futbolistas verificados de 2026
  for (const p of chankasSquad2026) {
    let pId = null;
    const { data: existingP } = await supabase.from('players').select('id').eq('slug', p.slug).maybeSingle();
    if (existingP) {
      pId = existingP.id;
      await supabase.from('players').update({
        full_name: p.name,
        nationality: p.nat,
        birth_date: p.birth,
        primary_position: p.pos,
      }).eq('id', pId);
    } else {
      const { data: newP, error: pErr } = await supabase.from('players').insert({
        full_name: p.name,
        slug: p.slug,
        nationality: p.nat,
        birth_date: p.birth,
        primary_position: p.pos,
      }).select('id').single();

      if (pErr || !newP) {
        console.error(`Error creando jugador ${p.name}:`, pErr?.message);
        continue;
      }
      pId = newP.id;
    }

    await supabase.from('player_seasons').upsert({
      player_id: pId,
      team_id: chankasTeam.id,
      season_year: 2026,
      market_value_eur: p.eur,
      market_value_usd: Math.round(p.eur * exchangeRate),
      matches_played: p.pj,
      jersey_number: p.num,
      contract_start_date: '2026-01-01',
      contract_end_date: '2026-12-31',
      last_updated: new Date().toISOString()
    }, { onConflict: 'player_id,season_year' });

    if (p.clubs && p.clubs.length > 0) {
      for (let i = 0; i < p.clubs.length; i++) {
        await supabase.from('player_previous_clubs').delete().eq('player_id', pId).eq('order_index', i + 1);
        await supabase.from('player_previous_clubs').insert({
          player_id: pId,
          club_name: p.clubs[i].c,
          years: p.clubs[i].y,
          order_index: i + 1,
        });
      }
    }
  }

  console.log(`✅ Los Chankas CYC: ${chankasSquad2026.length} futbolistas registrados correctamente.`);

  // 3. Registrar Salidas oficiales de Los Chankas 2026
  console.log('📝 Registrando Salidas oficiales de Los Chankas (Daniel Ferreyra, Alan Murialdo, Carlos López)...');
  
  // Buscar jugadores para salidas
  const { data: ferreyra } = await supabase.from('players').select('id').eq('slug', 'daniel-ferreyra').maybeSingle();
  if (ferreyra) {
    await supabase.from('transfers').upsert({
      player_id: ferreyra.id,
      team_id: chankasTeam.id,
      season_year: 2026,
      transfer_type: 'OUT',
      departure_reason: 'Retiro profesional / Asume Gerencia Deportiva',
      other_club_name: 'Retirado (Perú)',
      announced_at: '2026-01-02T10:00:00Z',
      source_type: 'transfermarkt',
      source_url: 'https://www.transfermarkt.es'
    });
  }

  const { data: murialdo } = await supabase.from('players').select('id').eq('slug', 'alan-murialdo').maybeSingle();
  if (murialdo) {
    await supabase.from('transfers').upsert({
      player_id: murialdo.id,
      team_id: chankasTeam.id,
      season_year: 2026,
      transfer_type: 'OUT',
      departure_reason: 'Término de contrato',
      other_club_name: 'Racing de Córdoba (Argentina)',
      announced_at: '2026-01-04T12:00:00Z',
      source_type: 'transfermarkt',
      source_url: 'https://www.transfermarkt.es'
    });
  }

  const { data: carlitosLopez } = await supabase.from('players').select('id').eq('slug', 'carlos-lopez').maybeSingle();
  if (carlitosLopez) {
    await supabase.from('transfers').upsert({
      player_id: carlitosLopez.id,
      team_id: chankasTeam.id,
      season_year: 2026,
      transfer_type: 'OUT',
      departure_reason: 'Traspaso / Fin de contrato',
      other_club_name: 'Universidad San Martín (Perú)',
      announced_at: '2026-01-05T14:00:00Z',
      source_type: 'transfermarkt',
      source_url: 'https://www.transfermarkt.es'
    });
  }

  // 4. Registrar Fichaje estrella 2026: Abdiel Ayarza y Gonzalo Rizzo
  const { data: ayarza } = await supabase.from('players').select('id').eq('slug', 'abdiel-ayarza-ch').maybeSingle();
  if (ayarza) {
    await supabase.from('transfers').upsert({
      player_id: ayarza.id,
      team_id: chankasTeam.id,
      season_year: 2026,
      transfer_type: 'IN',
      other_club_name: 'The Strongest (Bolivia)',
      announced_at: '2026-01-08T10:00:00Z',
      contract_start_date: '2026-01-01',
      contract_end_date: '2026-12-31',
      source_type: 'club_social_x',
      source_url: 'https://x.com/LosChankasCYC'
    });
  }

  // 5. Recalcular rankings y valores de mercado para los 18 clubes
  console.log('📊 Recalculando valores y ranking de la Liga 1 2026...');
  const { data: allTeams } = await supabase.from('teams').select('id, name, slug');
  const active18Slugs = [
    'universitario', 'alianza-lima', 'sporting-cristal', 'fbc-melgar', 'atletico-grau',
    'deportivo-garcilaso', 'cusco-fc', 'sport-boys', 'cienciano', 'sport-huancayo',
    'fc-cajamarca', 'deportivo-moquegua', 'alianza-atletico', 'utc-cajamarca',
    'los-chankas', 'comerciantes-unidos', 'adt-tarma', 'juan-pablo-ii'
  ];

  const { data: allSeasonPlayers } = await supabase.from('player_seasons').select('team_id, market_value_eur').eq('season_year', 2026);
  const teamTotals = [];

  for (const slug of active18Slugs) {
    const team = allTeams.find(t => t.slug === slug);
    if (!team) continue;

    const playersOfTeam = (allSeasonPlayers || []).filter(p => p.team_id === team.id);
    const totalEur = playersOfTeam.reduce((acc, p) => acc + (p.market_value_eur || 0), 0);
    const count = playersOfTeam.length;

    teamTotals.push({ team, totalEur, count });
  }

  teamTotals.sort((a, b) => b.totalEur - a.totalEur);

  for (let rank = 1; rank <= teamTotals.length; rank++) {
    const item = teamTotals[rank - 1];
    const usd = Math.round(item.totalEur * exchangeRate);

    await supabase.from('team_seasons').upsert({
      team_id: item.team.id,
      season_year: 2026,
      total_value_eur: item.totalEur,
      total_value_usd: usd,
      rank_value: rank,
      squad_size: item.count,
      last_updated: new Date().toISOString()
    }, { onConflict: 'team_id,season_year' });

    console.log(`   #${rank} ${item.team.name}: ${item.count} jugadores | €${(item.totalEur / 1e6).toFixed(2)}M ($${(usd / 1e6).toFixed(2)}M USD)`);
  }

  console.log('\n🎉 ¡CORRECCIÓN DE LOS CHANKAS FINALIZADA CON ÉXITO!');
  process.exit(0);
}

main().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
});
