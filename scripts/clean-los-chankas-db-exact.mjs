import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ugujgzrfysucybbncxrs.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVndWpnenJmeXN1Y3liYm5jeHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUwMjk3NDcsImV4cCI6MjExMDYwNTc0N30.KavzLBrgphW52oAqHu8MNcKz_YvcO2EUXI6NvWXdugY';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
  realtime: { transport: WebSocket }
});

const exchangeRate = 1.0999;

// Exact 24 official active players for Los Chankas CYC 2026
const exact24Players = [
  { name: 'Franco Saravia', pos: 'Portero', nat: 'Peruano', num: 1, eur: 450000, birth: '1999-06-02' },
  { name: 'Hairo Camacho', pos: 'Portero', nat: 'Peruano', num: 12, eur: 175000, birth: '1993-04-18' },
  { name: 'Anthony Sánchez', pos: 'Portero', nat: 'Peruano', num: 21, eur: 100000, birth: '2000-08-15' },
  { name: 'Gonzalo Rizzo', pos: 'Defensa Central', nat: 'Uruguayo / Peruano', num: 24, eur: 400000, birth: '1995-12-27' },
  { name: 'Ángelo Pizzorno', pos: 'Defensa Central', nat: 'Uruguayo', num: 2, eur: 350000, birth: '1991-10-21' },
  { name: 'Franz Schmidt', pos: 'Defensa Central', nat: 'Peruano', num: 4, eur: 300000, birth: '2000-05-03' },
  { name: 'Ederson Mogollón', pos: 'Defensa Central', nat: 'Peruano', num: 5, eur: 250000, birth: '1992-10-04' },
  { name: 'Héctor González', pos: 'Defensa Central', nat: 'Argentino', num: 3, eur: 250000, birth: '1995-03-12' },
  { name: 'Santiago Torres', pos: 'Lateral Derecho', nat: 'Argentino / Peruano', num: 17, eur: 200000, birth: '2001-09-10' },
  { name: 'Carlos Pimienta', pos: 'Lateral', nat: 'Uruguayo', num: 15, eur: 200000, birth: '1992-07-28' },
  { name: 'David Gonzáles', pos: 'Lateral Izquierdo', nat: 'Peruano', num: 13, eur: 175000, birth: '1998-03-20' },
  { name: 'Jordan Guivin', pos: 'Mediocentro', nat: 'Peruano', num: 8, eur: 450000, birth: '1998-02-23' },
  { name: 'Abdiel Ayarza', pos: 'Pivote', nat: 'Panameño', num: 6, eur: 500000, birth: '1992-09-12' },
  { name: 'Christian Velarde', pos: 'Mediocentro', nat: 'Peruano', num: 14, eur: 250000, birth: '1995-10-14' },
  { name: 'Leonardo Mifflin', pos: 'Pivote', nat: 'Peruano', num: 20, eur: 225000, birth: '2000-01-04' },
  { name: 'Adrián Quiroz', pos: 'Mediocentro', nat: 'Peruano', num: 16, eur: 150000, birth: '1999-11-08' },
  { name: 'José Zurita', pos: 'Mediocentro', nat: 'Peruano', num: 22, eur: 125000, birth: '2001-04-16' },
  { name: 'Oshiro Takeuchi', pos: 'Extremo', nat: 'Peruano', num: 19, eur: 250000, birth: '1994-06-25' },
  { name: 'Flavio Fernández', pos: 'Extremo', nat: 'Peruano', num: 18, eur: 175000, birth: '2001-02-14' },
  { name: 'Pablo Bueno', pos: 'Delantero Centro', nat: 'Argentino', num: 9, eur: 400000, birth: '1990-02-23' },
  { name: 'Isaac Camargo', pos: 'Delantero Centro', nat: 'Colombiano', num: 11, eur: 350000, birth: '1999-10-28' },
  { name: 'Kevin Sánchez', pos: 'Delantero Centro', nat: 'Peruano', num: 23, eur: 150000, birth: '1999-05-18' },
  { name: 'Gonzalo Sánchez', pos: 'Delantero Centro', nat: 'Peruano', num: 27, eur: 175000, birth: '2000-05-06' },
  { name: 'Jarlín Quintero', pos: 'Delantero Centro', nat: 'Colombiano', num: 29, eur: 300000, birth: '1993-08-19' }
];

async function main() {
  console.log('🧹 LIMPIANDO Y CONSOLIDANDO NÓMINA OFICIAL DE LOS CHANKAS (2026)...');

  const { data: team } = await supabase.from('teams').select('id, name').eq('slug', 'los-chankas').single();

  // 1. Eliminar TODA la tabla player_seasons de Los Chankas para 2026
  console.log('1. Purgando registros previos de player_seasons para Los Chankas 2026...');
  const { error: delAllErr } = await supabase.from('player_seasons')
    .delete()
    .eq('team_id', team.id)
    .eq('season_year', 2026);

  if (delAllErr) console.error('Error al purgar:', delAllErr.message);

  // 2. Insertar exactamente los 24 jugadores únicos y verificados
  console.log('\n2. Insertando los 24 jugadores únicos con contratos vigentes 2026...');
  for (const item of exact24Players) {
    let pId = null;
    const { data: exist } = await supabase.from('players').select('id').ilike('full_name', item.name).limit(1);
    if (exist && exist.length > 0) {
      pId = exist[0].id;
    } else {
      const { data: created } = await supabase.from('players').insert({
        full_name: item.name,
        primary_position: item.pos,
        nationality: item.nat,
        birth_date: item.birth
      }).select('id').single();
      pId = created.id;
    }

    const usd = Math.round(item.eur * exchangeRate);
    const { error: insErr } = await supabase.from('player_seasons').upsert({
      player_id: pId,
      team_id: team.id,
      season_year: 2026,
      jersey_number: item.num,
      market_value_eur: item.eur,
      market_value_usd: usd,
      matches_played: 18,
      contract_start_date: '2026-01-01',
      contract_end_date: '2026-12-31',
      last_updated: new Date().toISOString()
    }, { onConflict: 'player_id,season_year' });

    if (insErr) {
      console.error(`Error insertando ${item.name}:`, insErr.message);
    } else {
      console.log(`✅ #${item.num} ${item.name} (${item.pos} · ${item.nat})`);
    }
  }

  // 3. Actualizar squad_size en team_seasons
  await supabase.from('team_seasons').update({
    squad_size: 24,
    last_updated: new Date().toISOString()
  }).eq('team_id', team.id).eq('season_year', 2026);

  console.log('\n🎉 ¡NÓMINA DE LOS CHANKAS CONSOLIDADA EN EXACTAMENTE 24 FUTBOLISTAS!');
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
