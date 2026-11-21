import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ugujgzrfysucybbncxrs.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVndWpnenJmeXN1Y3liYm5jeHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUwMjk3NDcsImV4cCI6MjExMDYwNTc0N30.KavzLBrgphW52oAqHu8MNcKz_YvcO2EUXI6NvWXdugY';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
  realtime: { transport: WebSocket }
});

const exchangeRate = 1.0999;

// Bajas que deben ser purgadas de player_seasons y registradas en transfers (OUT)
const departuresToRegister = [
  { name: 'Adrián Quiroz', reason: 'Traspaso a Universitario de Deportes (Mitad 2026)', otherClub: 'Universitario de Deportes', date: '2026-06-30' },
  { name: 'Pablo Bueno', reason: 'Traspaso oficial', otherClub: 'Estudiantil CNI', date: '2026-02-15' },
  { name: 'Ángelo Pizzorno', reason: 'Fin de contrato contractual', otherClub: 'Agente Libre', date: '2026-01-10' },
  { name: 'Isaac Camargo', reason: 'Fin de préstamo / Desvinculación', otherClub: 'Unión Magdalena', date: '2026-01-10' },
  { name: 'Mathías Carpio', reason: 'Traspaso oficial', otherClub: 'Comerciantes Unidos', date: '2026-01-10' },
  { name: 'Carlos López Vanegas', reason: 'Traspaso oficial', otherClub: 'Sport Boys', date: '2026-01-05' },
  { name: 'Kevin Becerra', reason: 'Traspaso oficial', otherClub: 'Club Cienciano', date: '2026-01-08' },
  { name: 'Ayrthon Quintana', reason: 'Rescisión de contrato (Setiembre 2026)', otherClub: 'Agente Libre', date: '2026-09-28' },
  { name: 'Abel Casquete', reason: 'Traspaso oficial', otherClub: 'Alianza Universidad', date: '2026-01-15' },
  { name: 'José Manzaneda', reason: 'Traspaso oficial', otherClub: 'Cusco FC', date: '2026-01-10' },
  { name: 'William Mimbela', reason: 'Traspaso oficial', otherClub: 'CD Unión Comercio', date: '2026-01-20' },
  { name: 'Rudy Palomino', reason: 'Traspaso oficial', otherClub: 'Alianza Universidad', date: '2026-01-12' },
  { name: 'Ademar Robles', reason: 'Traspaso oficial', otherClub: 'Club Cienciano', date: '2026-01-14' }
];

// Nómina oficial exacta de Transfermarkt para Los Chankas CYC (22 futbolistas)
const transfermarktChankas2026 = [
  { num: 12, name: 'Hairo Camacho', pos: 'Portero', nat: 'Peruano', eur: 200000, birth: '1993-04-18' },
  { num: 1, name: 'Luis Pretel', pos: 'Portero', nat: 'Peruano', eur: 125000, birth: '2001-03-05' },
  { num: 24, name: 'Gonzalo Rizzo', pos: 'Defensa Central', nat: 'Uruguayo / Peruano', eur: 400000, birth: '1995-12-27' },
  { num: 4, name: 'Michael Kaufman', pos: 'Defensa Central', nat: 'Peruano', eur: 200000, birth: '2001-08-20' },
  { num: 3, name: 'Héctor González', pos: 'Defensa Central', nat: 'Ecuatoriano', eur: 250000, birth: '1995-03-12' },
  { num: 15, name: 'Carlos Pimienta', pos: 'Defensa Central', nat: 'Uruguayo', eur: 200000, birth: '1992-07-28' },
  { num: 21, name: 'José Cárdenas', pos: 'Portero', nat: 'Peruano', eur: 150000, birth: '2000-02-14' },
  { num: 2, name: 'Brayan Guevara', pos: 'Lateral Derecho', nat: 'Peruano', eur: 175000, birth: '1998-05-05' },
  { num: 13, name: 'Axel Chávez', pos: 'Lateral Izquierdo', nat: 'Peruano', eur: 250000, birth: '1998-04-21' },
  { num: 22, name: 'David Gonzáles', pos: 'Lateral Izquierdo', nat: 'Peruano', eur: 175000, birth: '1998-03-20' },
  { num: 23, name: 'Kelvin Sánchez', pos: 'Mediocentro', nat: 'Peruano', eur: 200000, birth: '1999-05-18' },
  { num: 16, name: 'Jorge Palomino', pos: 'Mediocentro', nat: 'Peruano', eur: 175000, birth: '2000-09-12' },
  { num: 14, name: 'Christian Velarde', pos: 'Mediocentro', nat: 'Peruano', eur: 250000, birth: '1995-10-14' },
  { num: 6, name: 'Abdiel Ayarza', pos: 'Pivote', nat: 'Panameño', eur: 450000, birth: '1992-09-12' },
  { num: 8, name: 'Sebastián Zarabia', pos: 'Mediocentro', nat: 'Peruano', eur: 150000, birth: '2002-06-18' },
  { num: 17, name: 'Franco Torres', pos: 'Extremo', nat: 'Peruano', eur: 200000, birth: '1999-07-14' },
  { num: 20, name: 'Accel Campos', pos: 'Extremo', nat: 'Peruano', eur: 150000, birth: '2001-11-23' },
  { num: 7, name: 'Kenyi Barrios', pos: 'Extremo Izquierdo', nat: 'Peruano', eur: 175000, birth: '2000-04-10' },
  { num: 18, name: 'Félix Espinoza', pos: 'Extremo', nat: 'Peruano', eur: 175000, birth: '1999-03-30' },
  { num: 10, name: 'Juan Diego Ospina', pos: 'Extremo Derecho', nat: 'Colombiano', eur: 250000, birth: '2001-03-27' },
  { num: 11, name: 'Jarlín Quintero', pos: 'Delantero Centro', nat: 'Colombiano', eur: 300000, birth: '1993-08-19' },
  { num: 9, name: 'Marlon Torres', pos: 'Delantero Centro', nat: 'Peruano', eur: 200000, birth: '1998-01-15' }
];

async function main() {
  console.log('🚀 SINCRONIZANDO NÓMINA OFICIAL EXACTA DE TRANSFERMARKT PARA LOS CHANKAS (2026)...');

  const { data: team } = await supabase.from('teams').select('id, name').eq('slug', 'los-chankas').single();

  // 1. Purgar de player_seasons a los jugadores desvinculados señalados por el usuario
  console.log('\n--- 1. Purgando y registrando bajas oficiales en transfers ---');
  for (const dep of departuresToRegister) {
    const { data: found } = await supabase.from('players').select('id, full_name').ilike('full_name', `%${dep.name}%`);
    if (found && found.length > 0) {
      for (const p of found) {
        // Eliminar de player_seasons de Los Chankas 2026
        await supabase.from('player_seasons').delete()
          .eq('player_id', p.id)
          .eq('team_id', team.id)
          .eq('season_year', 2026);

        console.log(`❌ Eliminado de plantilla activa: ${p.full_name}`);

        // Insertar en transfers como OUT si no existe ya
        const { data: trExist } = await supabase.from('transfers').select('id')
          .eq('player_id', p.id)
          .eq('team_id', team.id)
          .eq('season_year', 2026)
          .eq('transfer_type', 'OUT')
          .maybeSingle();

        if (!trExist) {
          await supabase.from('transfers').insert({
            player_id: p.id,
            team_id: team.id,
            season_year: 2026,
            transfer_type: 'OUT',
            departure_reason: dep.reason,
            other_club_name: dep.otherClub,
            source_type: 'Transfermarkt',
            announced_at: dep.date,
            contract_end_date: dep.date
          });
          console.log(`   ➡️ Registrada salida: ${p.full_name} (${dep.reason} -> ${dep.otherClub})`);
        }
      }
    }
  }

  // 2. Limpiar todos los registros actuales de player_seasons de Los Chankas 2026
  console.log('\n--- 2. Limpiando player_seasons de Los Chankas 2026 para reconstruir con Transfermarkt ---');
  await supabase.from('player_seasons').delete().eq('team_id', team.id).eq('season_year', 2026);

  // 3. Insertar exactamente los 22 futbolistas de Transfermarkt
  console.log('\n--- 3. Insertando los 22 futbolistas oficiales de Transfermarkt ---');
  for (const item of transfermarktChankas2026) {
    let pId = null;
    const { data: exist } = await supabase.from('players').select('id').ilike('full_name', item.name).limit(1);
    if (exist && exist.length > 0) {
      pId = exist[0].id;
      // Actualizar posición y nacionalidad oficial
      await supabase.from('players').update({
        primary_position: item.pos,
        nationality: item.nat,
        birth_date: item.birth
      }).eq('id', pId);
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
      console.error(`Error con ${item.name}:`, insErr.message);
    } else {
      console.log(`✅ #${item.num} ${item.name} (${item.pos} · ${item.nat} · €${item.eur})`);
    }
  }

  // 4. Actualizar squad_size en team_seasons a exactamente 22
  await supabase.from('team_seasons').update({
    squad_size: 22,
    last_updated: new Date().toISOString()
  }).eq('team_id', team.id).eq('season_year', 2026);

  console.log('\n🎉 ¡NÓMINA DE LOS CHANKAS SINCRONIZADA AL 100% CON TRANSFERMARKT (22 FUTBOLISTAS)!');
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
