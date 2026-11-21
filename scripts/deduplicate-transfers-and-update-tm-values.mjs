import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ugujgzrfysucybbncxrs.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVndWpnenJmeXN1Y3liYm5jeHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUwMjk3NDcsImV4cCI6MjExMDYwNTc0N30.KavzLBrgphW52oAqHu8MNcKz_YvcO2EUXI6NvWXdugY';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
  realtime: { transport: WebSocket }
});

const exchangeRate = 1.0999;

// Valores de mercado totales oficiales extraídos de Transfermarkt (Liga 1 2026)
const transfermarktTeamValues = [
  { slug: 'universitario', name: 'Universitario de Deportes', eur: 14430000 },
  { slug: 'alianza-lima', name: 'Alianza Lima', eur: 13630000 },
  { slug: 'sporting-cristal', name: 'Sporting Cristal', eur: 13280000 },
  { slug: 'fbc-melgar', name: 'FBC Melgar', eur: 10210000 },
  { slug: 'cusco-fc', name: 'Cusco FC', eur: 8570000 },
  { slug: 'cienciano', name: 'Cienciano', eur: 7130000 },
  { slug: 'comerciantes-unidos', name: 'Comerciantes Unidos', eur: 6700000 },
  { slug: 'sport-boys', name: 'Sport Boys', eur: 6500000 },
  { slug: 'deportivo-garcilaso', name: 'Deportivo Garcilaso', eur: 6450000 },
  { slug: 'alianza-atletico', name: 'Alianza Atlético', eur: 6280000 },
  { slug: 'sport-huancayo', name: 'Sport Huancayo', eur: 5930000 },
  { slug: 'juan-pablo-ii', name: 'Juan Pablo II College', eur: 5400000 },
  { slug: 'adt-tarma', name: 'ADT Tarma', eur: 5260000 },
  { slug: 'atletico-grau', name: 'Atlético Grau', eur: 5230000 },
  { slug: 'fc-cajamarca', name: 'FC Cajamarca', eur: 4930000 },
  { slug: 'utc-cajamarca', name: 'UTC Cajamarca', eur: 4650000 },
  { slug: 'los-chankas', name: 'Los Chankas CYC', eur: 4600000 },
  { slug: 'deportivo-moquegua', name: 'Deportivo Moquegua', eur: 4380000 }
];

async function main() {
  console.log('🚀 1. ELIMINANDO DUPLICADOS EN TRANSFERS (SALIDAS Y FICHAJES)...');

  // Obtener todos los transfers de 2026
  const { data: allTransfers, error: trErr } = await supabase
    .from('transfers')
    .select('id, team_id, player_id, transfer_type, announced_at, created_at')
    .eq('season_year', 2026);

  if (trErr) throw trErr;

  const groups = {};
  for (const t of allTransfers) {
    const key = `${t.team_id}_${t.player_id}_${t.transfer_type}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(t);
  }

  const idsToDelete = [];
  for (const [key, list] of Object.entries(groups)) {
    if (list.length > 1) {
      // Ordenar por fecha más reciente primero y conservar solo el primero
      list.sort((a, b) => new Date(b.announced_at || b.created_at) - new Date(a.announced_at || a.created_at));
      const [keep, ...duplicates] = list;
      for (const d of duplicates) {
        idsToDelete.push(d.id);
      }
    }
  }

  console.log(`🔍 Duplicados detectados: ${idsToDelete.length} registros repetidos.`);

  if (idsToDelete.length > 0) {
    for (let i = 0; i < idsToDelete.length; i += 20) {
      const chunk = idsToDelete.slice(i, i + 20);
      const { error: delErr } = await supabase.from('transfers').delete().in('id', chunk);
      if (delErr) {
        console.error('Error eliminando lote de duplicados:', delErr.message);
      }
    }
    console.log(`✅ ${idsToDelete.length} registros duplicados eliminados exitosamente.`);
  } else {
    console.log('✅ No se encontraron registros duplicados.');
  }

  console.log('\n🚀 2. ACTUALIZANDO VALORES OFICIALES DE TRANSFERMARKT EN EQUIPOS MÁS VALIOSOS (2026)...');
  const { data: teams } = await supabase.from('teams').select('id, slug, name');
  const teamBySlug = {};
  teams.forEach(t => { teamBySlug[t.slug] = t; });

  // Obtener tamaño de plantilla actual en player_seasons para cada club
  const { data: psList } = await supabase.from('player_seasons').select('team_id').eq('season_year', 2026);
  const countByTeam = {};
  (psList || []).forEach(p => {
    countByTeam[p.team_id] = (countByTeam[p.team_id] || 0) + 1;
  });

  for (let rank = 1; rank <= transfermarktTeamValues.length; rank++) {
    const item = transfermarktTeamValues[rank - 1];
    const team = teamBySlug[item.slug];
    if (!team) {
      console.warn(`Equipo no encontrado: ${item.slug}`);
      continue;
    }

    const usd = Math.round(item.eur * exchangeRate);
    const squadSize = countByTeam[team.id] || 22;

    const { error: tsErr } = await supabase.from('team_seasons').upsert({
      team_id: team.id,
      season_year: 2026,
      total_value_eur: item.eur,
      total_value_usd: usd,
      rank_value: rank,
      squad_size: squadSize,
      last_updated: new Date().toISOString()
    }, { onConflict: 'team_id,season_year' });

    if (tsErr) {
      console.error(`Error actualizando ${item.name}:`, tsErr.message);
    } else {
      console.log(`   #${rank} ${item.name}: €${(item.eur / 1e6).toFixed(2)}M ($${(usd / 1e6).toFixed(2)}M USD) | Plantel: ${squadSize} jugadores`);
    }
  }

  console.log('\n🎉 ¡DEDUPLICACIÓN Y ACTUALIZACIÓN TRANSFERMARKT FINALIZADAS CON ÉXITO!');
  process.exit(0);
}

main().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
});
