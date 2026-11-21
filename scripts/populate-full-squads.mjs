import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ugujgzrfysucybbncxrs.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVndWpnenJmeXN1Y3liYm5jeHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUwMjk3NDcsImV4cCI6MjExMDYwNTc0N30.KavzLBrgphW52oAqHu8MNcKz_YvcO2EUXI6NvWXdugY';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
  realtime: { transport: WebSocket }
});

async function main() {
  console.log('🚀 Iniciando carga robusta de plantillas completas (+24 futbolistas por club)...');

  // 1. Obtener equipos
  const { data: teams } = await supabase.from('teams').select('*');
  const teamMap = {};
  teams.forEach(t => teamMap[t.slug] = t.id);

  // 2. Corregir Universitario: Asegurar que Britos y Ureña no estén en player_seasons 2026
  console.log('🧹 Limpiando a Sebastián Britos y Rodrigo Ureña de la nómina activa de Universitario 2026...');
  const { data: wrongPlayers } = await supabase
    .from('players')
    .select('id, slug')
    .in('slug', ['sebastian-britos', 'rodrigo-urena']);

  if (wrongPlayers && wrongPlayers.length > 0) {
    const wrongIds = wrongPlayers.map(p => p.id);
    await supabase
      .from('player_seasons')
      .delete()
      .in('player_id', wrongIds)
      .eq('season_year', 2026);

    const uniId = teamMap['universitario'];
    for (const wp of wrongPlayers) {
      await supabase.from('transfers').upsert({
        player_id: wp.id,
        team_id: uniId,
        season_year: 2026,
        transfer_type: 'OUT',
        departure_reason: wp.slug === 'rodrigo-urena' ? 'Rescisión de cláusula / Traspaso' : 'Término de contrato',
        other_club_name: wp.slug === 'rodrigo-urena' ? 'Millonarios FC (Colombia)' : 'Libre',
        source_type: 'transfermarkt',
        announced_at: '2025-12-30T12:00:00Z',
      });
    }
    console.log('✅ Britos y Ureña registrados correctamente como Salidas (OUT) de Universitario.');
  }

  // 3. Mapeo de jugadores existentes
  const { data: existingPlayers } = await supabase.from('players').select('id, slug');
  const playerMap = {};
  if (existingPlayers) {
    for (const ep of existingPlayers) {
      if (ep.slug) playerMap[ep.slug] = ep.id;
    }
  }

  // 4. Plantillas de 24+ jugadores por club
  const squads = {
    'universitario': [
      { name: 'Diego Romero', slug: 'diego-romero', nat: 'Peruano', birth: '2001-08-17', pos: 'Portero', sec: null, eur: 500000, pj: 17, num: 1, clubs: [{c: 'Banfield (Arg)', y: '2024 - 2025'}, {c: 'Universitario', y: '2020 - 2024'}] },
      { name: 'Miguel Vargas', slug: 'miguel-vargas', nat: 'Chileno / Peruano', birth: '1996-05-15', pos: 'Portero', sec: null, eur: 350000, pj: 12, num: 12, clubs: [{c: 'Dep. Garcilaso', y: '2023 - 2024'}, {c: 'Cienciano', y: '2022 - 2023'}] },
      { name: 'Aamet Calderón', slug: 'aamet-calderon', nat: 'Peruano', birth: '1998-07-01', pos: 'Portero', sec: null, eur: 150000, pj: 2, num: 21, clubs: [{c: 'Los Chankas', y: '2021 - 2022'}, {c: 'Universitario', y: '2019 - 2021'}] },
      { name: 'Aldo Corzo', slug: 'aldo-corzo', nat: 'Peruano', birth: '1989-05-20', pos: 'Defensa Central', sec: 'Lateral Derecho', eur: 350000, pj: 16, num: 29, clubs: [{c: 'Dep. Municipal', y: '2016 - 2016'}, {c: 'Univ. San Martín', y: '2010 - 2015'}, {c: 'Alianza Lima', y: '2008 - 2009'}] },
      { name: 'Williams Riveros', slug: 'williams-riveros', nat: 'Paraguayo', birth: '1992-11-20', pos: 'Defensa Central', sec: null, eur: 700000, pj: 16, num: 3, clubs: [{c: 'Cerro Porteño (Par)', y: '2022 - 2022'}, {c: 'Barcelona SC (Ecu)', y: '2020 - 2021'}, {c: 'Delfín SC (Ecu)', y: '2018 - 2019'}] },
      { name: 'Matías Di Benedetto', slug: 'matias-di-benedetto', nat: 'Argentino', birth: '1992-11-19', pos: 'Defensa Central', sec: 'Lateral Izquierdo', eur: 450000, pj: 15, num: 5, clubs: [{c: 'Central Córdoba (Arg)', y: '2022 - 2022'}, {c: 'Deportes Temuco (Chi)', y: '2019 - 2021'}, {c: 'Gimnasia Jujuy (Arg)', y: '2018 - 2019'}] },
      { name: 'Gustavo Dulanto', slug: 'gustavo-dulanto', nat: 'Peruano', birth: '1995-09-05', pos: 'Defensa Central', sec: null, eur: 400000, pj: 12, num: 2, clubs: [{c: 'Riga FC (Letonia)', y: '2022 - 2023'}, {c: 'Sheriff Tiraspol (Mol)', y: '2021 - 2022'}, {c: 'Boavista (Por)', y: '2019 - 2020'}] },
      { name: 'Marco Saravia', slug: 'marco-saravia', nat: 'Peruano', birth: '1999-02-06', pos: 'Defensa Central', sec: null, eur: 350000, pj: 10, num: 14, clubs: [{c: 'Dep. Municipal', y: '2021 - 2022'}, {c: 'Cusco FC', y: '2020 - 2020'}, {c: 'Unión Huaral', y: '2019 - 2019'}] },
      { name: 'Andy Polo', slug: 'andy-polo', nat: 'Peruano', birth: '1994-09-29', pos: 'Carrilero Derecho', sec: 'Extremo Derecho', eur: 1000000, pj: 17, num: 24, clubs: [{c: 'Portland Timbers (USA)', y: '2018 - 2021'}, {c: 'Monarcas Morelia (Mex)', y: '2017 - 2018'}, {c: 'Millonarios (Col)', y: '2014 - 2015'}] },
      { name: 'Segundo Portocarrero', slug: 'segundo-portocarrero', nat: 'Ecuatoriano', birth: '1996-10-15', pos: 'Carrilero Izquierdo', sec: 'Extremo Izquierdo', eur: 500000, pj: 16, num: 27, clubs: [{c: 'Barcelona SC (Ecu)', y: '2023 - 2023'}, {c: 'Orense SC (Ecu)', y: '2022 - 2022'}, {c: 'Macará (Ecu)', y: '2021 - 2021'}] },
      { name: 'Nelson Cabanillas', slug: 'nelson-cabanillas', nat: 'Peruano', birth: '2000-02-08', pos: 'Lateral Izquierdo', sec: 'Interior Izquierdo', eur: 450000, pj: 14, num: 26, clubs: [{c: 'Universitario', y: '2019 - 2025'}, {c: 'San Luis Quillota (Chi)', y: '2018 - 2019'}] },
      { name: 'Hugo Ancajima', slug: 'hugo-ancajima', nat: 'Peruano', birth: '1998-02-10', pos: 'Lateral Derecho', sec: 'Extremo Derecho', eur: 300000, pj: 9, num: 22, clubs: [{c: 'ADT Tarma', y: '2022 - 2022'}, {c: 'Pirata FC', y: '2021 - 2021'}] },
      { name: 'José Bolívar', slug: 'jose-bolivar', nat: 'Peruano', birth: '2000-01-17', pos: 'Lateral Izquierdo', sec: null, eur: 350000, pj: 8, num: 13, clubs: [{c: 'César Vallejo', y: '2024 - 2024'}, {c: 'Sport Boys', y: '2021 - 2022'}, {c: 'Univ. San Martín', y: '2017 - 2020'}] },
      { name: 'Martín Pérez Guedes', slug: 'martin-perez-guedes', nat: 'Argentino / Peruano', birth: '1991-08-18', pos: 'Mediocentro', sec: 'Interior', eur: 500000, pj: 17, num: 16, clubs: [{c: 'FBC Melgar', y: '2022 - 2022'}, {c: 'Univ. San Martín', y: '2021 - 2021'}, {c: 'Defensores Belgrano (Arg)', y: '2019 - 2020'}] },
      { name: 'Horacio Calcaterra', slug: 'horacio-calcaterra', nat: 'Argentino / Peruano', birth: '1989-02-22', pos: 'Mediocentro', sec: 'Mediapunta', eur: 250000, pj: 16, num: 10, clubs: [{c: 'Sporting Cristal', y: '2013 - 2022'}, {c: 'Universitario', y: '2012 - 2012'}, {c: 'Unión Comercio', y: '2011 - 2011'}] },
      { name: 'Jairo Concha', slug: 'jairo-concha', nat: 'Peruano', birth: '1999-05-27', pos: 'Mediocentro Ofensivo', sec: 'Mediocentro', eur: 900000, pj: 16, num: 17, clubs: [{c: 'Alianza Lima', y: '2021 - 2023'}, {c: 'Univ. San Martín', y: '2017 - 2020'}] },
      { name: 'Jorge Murrugarra', slug: 'jorge-murrugarra', nat: 'Peruano', birth: '1997-03-22', pos: 'Pivote', sec: 'Mediocentro', eur: 450000, pj: 15, num: 18, clubs: [{c: 'Ayacucho FC', y: '2020 - 2020'}, {c: 'UTC Cajamarca', y: '2018 - 2019'}] },
      { name: 'Yuriel Celi', slug: 'yuriel-celi', nat: 'Peruano', birth: '2002-02-20', pos: 'Mediocentro Ofensivo', sec: 'Extremo', eur: 400000, pj: 11, num: 7, clubs: [{c: 'Hull City (Inglaterra)', y: '2023 - 2023'}, {c: 'Carlos A. Mannucci', y: '2022 - 2022'}, {c: 'Academia Cantolao', y: '2019 - 2021'}] },
      { name: 'Álvaro Rojas', slug: 'alvaro-rojas', nat: 'Peruano', birth: '2005-03-12', pos: 'Mediocentro', sec: null, eur: 200000, pj: 6, num: 25, clubs: [{c: 'Universitario U20', y: '2022 - 2024'}] },
      { name: 'Alex Valera', slug: 'alex-valera', nat: 'Peruano', birth: '1996-05-16', pos: 'Delantero Centro', sec: null, eur: 950000, pj: 17, num: 20, clubs: [{c: 'Al-Fateh SC (Ara)', y: '2022 - 2023'}, {c: 'Universitario', y: '2021 - 2022'}, {c: 'Deportivo Llacuabamba', y: '2020 - 2020'}] },
      { name: 'Edison Flores', slug: 'edison-flores', nat: 'Peruano', birth: '1994-05-14', pos: 'Delantero Centro', sec: 'Mediapunta', eur: 500000, pj: 16, num: 19, clubs: [{c: 'Atlas FC (Mex)', y: '2022 - 2023'}, {c: 'D.C. United (USA)', y: '2020 - 2022'}, {c: 'Monarcas Morelia (Mex)', y: '2018 - 2020'}] },
      { name: 'José Rivera', slug: 'jose-rivera', nat: 'Peruano', birth: '1997-05-08', pos: 'Delantero Centro', sec: 'Extremo Izquierdo', eur: 650000, pj: 15, num: 11, clubs: [{c: 'Carlos A. Mannucci', y: '2021 - 2022'}, {c: 'Cusco FC', y: '2020 - 2020'}, {c: 'Unión Comercio', y: '2016 - 2019'}] },
      { name: 'Christopher Olivares', slug: 'christopher-olivares', nat: 'Peruano', birth: '1999-04-03', pos: 'Delantero Centro', sec: 'Extremo', eur: 350000, pj: 10, num: 9, clubs: [{c: 'Cusco FC', y: '2023 - 2023'}, {c: 'Dep. Municipal', y: '2023 - 2023'}, {c: 'Sporting Cristal', y: '2017 - 2022'}] },
      { name: 'Gabriel Costa', slug: 'gabriel-costa', nat: 'Uruguayo / Peruano', birth: '1990-04-02', pos: 'Extremo Derecho', sec: 'Mediapunta', eur: 350000, pj: 11, num: 8, clubs: [{c: 'Alianza Lima', y: '2023 - 2024'}, {c: 'Colo-Colo (Chile)', y: '2019 - 2022'}, {c: 'Sporting Cristal', y: '2016 - 2018'}] },
      { name: 'Chase Villanueva', slug: 'chase-villanueva', nat: 'Peruano', birth: '2004-11-24', pos: 'Extremo Izquierdo', sec: null, eur: 150000, pj: 4, num: 30, clubs: [{c: 'Universitario Juvenil', y: '2022 - 2024'}] }
    ],

    'sporting-cristal': [
      { name: 'Renato Solís', slug: 'renato-solis', nat: 'Peruano', birth: '1998-01-28', pos: 'Portero', sec: null, eur: 600000, pj: 16, num: 1, clubs: [{c: 'Sporting Cristal', y: '2016 - 2025'}] },
      { name: 'Alejandro Duarte', slug: 'alejandro-duarte', nat: 'Peruano / Alemán', birth: '1994-04-05', pos: 'Portero', sec: null, eur: 400000, pj: 10, num: 12, clubs: [{c: 'Alajuelense (Costa Rica)', y: '2024 - 2024'}, {c: 'Sporting Cristal', y: '2021 - 2023'}, {c: 'Sportivo Luqueño (Par)', y: '2020 - 2020'}] },
      { name: 'Diego Enríquez', slug: 'diego-enriquez', nat: 'Peruano', birth: '2002-01-24', pos: 'Portero', sec: null, eur: 500000, pj: 15, num: 13, clubs: [{c: 'Binacional', y: '2022 - 2023'}, {c: 'Cusco FC', y: '2021 - 2021'}, {c: 'Cienciano', y: '2020 - 2020'}] },
      { name: 'Jhilmar Lora', slug: 'jhilmar-lora', nat: 'Peruano', birth: '2000-10-24', pos: 'Lateral Derecho', sec: null, eur: 1000000, pj: 16, num: 2, clubs: [{c: 'Sporting Cristal', y: '2019 - 2025'}] },
      { name: 'Gianfranco Chávez', slug: 'gianfranco-chavez', nat: 'Peruano', birth: '1998-08-10', pos: 'Defensa Central', sec: null, eur: 650000, pj: 16, num: 4, clubs: [{c: 'Coopsol', y: '2017 - 2017'}, {c: 'Sporting Cristal', y: '2017 - 2025'}] },
      { name: 'Rafael Lutiger', slug: 'rafael-lutiger', nat: 'Peruano', birth: '2001-07-03', pos: 'Defensa Central', sec: 'Lateral Izquierdo', eur: 450000, pj: 12, num: 3, clubs: [{c: 'Sport Boys', y: '2024 - 2024'}, {c: 'Carlos A. Mannucci', y: '2021 - 2021'}] },
      { name: 'Leonardo Díaz', slug: 'leonardo-diaz', nat: 'Peruano', birth: '2004-03-24', pos: 'Defensa Central', sec: null, eur: 300000, pj: 9, num: 15, clubs: [{c: 'Sporting Cristal U20', y: '2022 - 2023'}] },
      { name: 'Nicolás Pasquini', slug: 'nicolas-pasquini', nat: 'Argentino', birth: '1991-01-02', pos: 'Lateral Izquierdo', sec: 'Interior Izquierdo', eur: 400000, pj: 16, num: 26, clubs: [{c: 'Talleres de Córdoba (Arg)', y: '2023 - 2023'}, {c: 'Lanús (Arg)', y: '2012 - 2022'}, {c: 'Estudiantes La Plata (Arg)', y: '2020 - 2021'}] },
      { name: 'Gabriel Alfaro', slug: 'gabriel-alfaro', nat: 'Peruano', birth: '2003-06-13', pos: 'Lateral Izquierdo', sec: null, eur: 300000, pj: 8, num: 16, clubs: [{c: 'Sporting Cristal U20', y: '2022 - 2023'}] },
      { name: 'Franco Medina', slug: 'franco-medina', nat: 'Peruano', birth: '1999-07-18', pos: 'Lateral Derecho', sec: null, eur: 350000, pj: 10, num: 22, clubs: [{c: 'Cienciano', y: '2023 - 2023'}, {c: 'Dep. Municipal', y: '2021 - 2022'}, {c: 'Alianza Lima', y: '2020 - 2020'}] },
      { name: 'Gustavo Cazonatti', slug: 'gustavo-cazonatti', nat: 'Brasileño', birth: '1996-07-02', pos: 'Pivote', sec: 'Mediocentro', eur: 900000, pj: 16, num: 5, clubs: [{c: 'Chapecoense (Bra)', y: '2023 - 2023'}, {c: 'Criciúma (Bra)', y: '2022 - 2022'}, {c: 'Tombense (Bra)', y: '2021 - 2022'}] },
      { name: 'Martín Távara', slug: 'martin-tavara', nat: 'Peruano', birth: '1999-03-25', pos: 'Mediocentro', sec: 'Pivote', eur: 750000, pj: 16, num: 25, clubs: [{c: 'Sport Rosario', y: '2018 - 2018'}, {c: 'UTC Cajamarca', y: '2018 - 2018'}, {c: 'Sporting Cristal', y: '2016 - 2025'}] },
      { name: 'Yoshimar Yotún Flores', slug: 'yoshimar-yotun', nat: 'Peruano', birth: '1990-04-07', pos: 'Mediocentro', sec: 'Pivote', eur: 700000, pj: 8, num: 19, clubs: [{c: 'Cruz Azul (Mex)', y: '2019 - 2021'}, {c: 'Orlando City (USA)', y: '2017 - 2018'}, {c: 'Malmö FF (Suecia)', y: '2015 - 2017'}] },
      { name: 'Christofer Gonzáles', slug: 'christofer-gonzales', nat: 'Peruano', birth: '1992-10-12', pos: 'Mediocentro Ofensivo', sec: 'Extremo Izquierdo', eur: 650000, pj: 14, num: 10, clubs: [{c: 'Universitario', y: '2024 - 2024'}, {c: 'Al-Adalah (Arabia)', y: '2022 - 2023'}, {c: 'Sporting Cristal', y: '2019 - 2022'}] },
      { name: 'Jesús Pretell', slug: 'jesus-pretell', nat: 'Peruano', birth: '1999-03-26', pos: 'Pivote', sec: null, eur: 450000, pj: 13, num: 6, clubs: [{c: 'FBC Melgar', y: '2020 - 2020'}, {c: 'Univ. San Martín', y: '2018 - 2018'}] },
      { name: 'Leandro Sosa', slug: 'leandro-sosa', nat: 'Uruguayo / Peruano', birth: '1994-06-24', pos: 'Extremo Derecho', sec: 'Lateral Derecho', eur: 500000, pj: 15, num: 8, clubs: [{c: 'Ayacucho FC', y: '2020 - 2021'}, {c: 'Progreso (Uru)', y: '2019 - 2019'}, {c: 'Olimpia (Hon)', y: '2018 - 2019'}] },
      { name: 'Ian Wisdom', slug: 'ian-wisdom', nat: 'Peruano', birth: '2005-09-14', pos: 'Mediocentro', sec: null, eur: 250000, pj: 7, num: 24, clubs: [{c: 'Sporting Cristal U20', y: '2022 - 2024'}] },
      { name: 'Jostin Alarcón', slug: 'jostin-alarcon', nat: 'Peruano', birth: '2002-07-12', pos: 'Mediocentro Ofensivo', sec: 'Extremo Izquierdo', eur: 500000, pj: 14, num: 17, clubs: [{c: 'Sport Boys', y: '2021 - 2022'}] },
      { name: 'Santiago González', slug: 'santiago-gonzalez', nat: 'Argentino', birth: '1999-07-25', pos: 'Extremo Derecho', sec: 'Extremo Izquierdo', eur: 1800000, pj: 17, num: 7, clubs: [{c: 'Deportivo Maipú (Arg)', y: '2023 - 2023'}, {c: 'Gimnasia Mendoza (Arg)', y: '2021 - 2022'}, {c: 'San Lorenzo (Arg)', y: '2018 - 2020'}] },
      { name: 'Fernando Pacheco', slug: 'fernando-pacheco', nat: 'Peruano', birth: '1999-06-26', pos: 'Extremo Izquierdo', sec: 'Extremo Derecho', eur: 450000, pj: 12, num: 21, clubs: [{c: 'Cienciano', y: '2023 - 2023'}, {c: 'Dep. Municipal', y: '2023 - 2023'}, {c: 'Fluminense (Bra)', y: '2020 - 2021'}] },
      { name: 'Alejandro Hohberg', slug: 'alejandro-hohberg', nat: 'Uruguayo / Peruano', birth: '1991-08-20', pos: 'Extremo Izquierdo', sec: 'Mediapunta', eur: 400000, pj: 13, num: 20, clubs: [{c: 'Universitario', y: '2019 - 2020'}, {c: 'Alianza Lima', y: '2017 - 2018'}, {c: 'César Vallejo', y: '2016 - 2016'}] },
      { name: 'Martín Cauteruccio', slug: 'martin-cauteruccio', nat: 'Uruguayo', birth: '1987-04-14', pos: 'Delantero Centro', sec: null, eur: 400000, pj: 16, num: 9, clubs: [{c: 'Independiente (Arg)', y: '2023 - 2023'}, {c: 'Aldosivi (Arg)', y: '2021 - 2022'}, {c: 'Estudiantes LP (Arg)', y: '2020 - 2021'}] },
      { name: 'Irven Ávila', slug: 'irven-avila', nat: 'Peruano', birth: '1990-07-02', pos: 'Delantero Centro', sec: 'Extremo Derecho', eur: 350000, pj: 14, num: 11, clubs: [{c: 'FBC Melgar', y: '2019 - 2020'}, {c: 'Monarcas Morelia (Mex)', y: '2018 - 2019'}, {c: 'LDU Quito (Ecu)', y: '2016 - 2016'}] },
      { name: 'Diego Otoya', slug: 'diego-otoya', nat: 'Peruano / USA', birth: '2004-09-13', pos: 'Delantero Centro', sec: null, eur: 200000, pj: 8, num: 18, clubs: [{c: 'San Jose Earthquakes (USA)', y: '2022 - 2022'}] },
      { name: 'Maxloren Castro', slug: 'maxloren-castro', nat: 'Peruano', birth: '2007-12-08', pos: 'Extremo Izquierdo', sec: 'Extremo Derecho', eur: 700000, pj: 15, num: 23, clubs: [{c: 'Sporting Cristal Juvenil', y: '2022 - 2024'}] }
    ],

    'alianza-lima': [
      { name: 'Ángelo Campos', slug: 'angelo-campos', nat: 'Peruano', birth: '1993-04-27', pos: 'Portero', sec: null, eur: 600000, pj: 16, num: 1, clubs: [{c: 'Carlos Stein', y: '2020 - 2020'}, {c: 'FBC Melgar', y: '2019 - 2019'}, {c: 'Alianza Lima', y: '2017 - 2018'}] },
      { name: 'Franco Saravia', slug: 'franco-saravia', nat: 'Peruano', birth: '1999-06-02', pos: 'Portero', sec: null, eur: 400000, pj: 8, num: 12, clubs: [{c: 'Unión Huaral', y: '2020 - 2021'}] },
      { name: 'Ángel de la Cruz', slug: 'angel-de-la-cruz', nat: 'Peruano', birth: '2002-05-24', pos: 'Portero', sec: null, eur: 250000, pj: 4, num: 32, clubs: [{c: 'Sport Boys', y: '2023 - 2023'}] },
      { name: 'Carlos Zambrano', slug: 'carlos-zambrano', nat: 'Peruano', birth: '1989-07-10', pos: 'Defensa Central', sec: null, eur: 450000, pj: 16, num: 5, clubs: [{c: 'Boca Juniors (Arg)', y: '2020 - 2022'}, {c: 'Dinamo Kiev (Ucr)', y: '2018 - 2019'}, {c: 'PAOK Salónica (Gre)', y: '2017 - 2018'}] },
      { name: 'Erick Noriega', slug: 'erick-noriega', nat: 'Peruano / Japonés', birth: '2001-10-22', pos: 'Defensa Central', sec: 'Pivote', eur: 900000, pj: 17, num: 2, clubs: [{c: 'Comerciantes Unidos', y: '2024 - 2024'}, {c: 'Univ. San Martín', y: '2023 - 2023'}, {c: 'FC Machida Zelvia (Jap)', y: '2020 - 2021'}] },
      { name: 'Renzo Garcés', slug: 'renzo-garces', nat: 'Peruano', birth: '1996-06-12', pos: 'Defensa Central', sec: null, eur: 700000, pj: 16, num: 6, clubs: [{c: 'César Vallejo', y: '2019 - 2023'}, {c: 'Sporting Cristal', y: '2017 - 2018'}, {c: 'Univ. San Martín', y: '2014 - 2016'}] },
      { name: 'Juan Pablo Freytes', slug: 'juan-pablo-freytes', nat: 'Argentino', birth: '2000-01-11', pos: 'Lateral Izquierdo', sec: 'Defensa Central', eur: 1000000, pj: 17, num: 29, clubs: [{c: 'Unión La Calera (Chi)', y: '2023 - 2023'}, {c: 'Independiente Rivadavia (Arg)', y: '2021 - 2022'}, {c: 'Newells Old Boys (Arg)', y: '2019 - 2021'}] },
      { name: 'Jiovany Ramos', slug: 'jiovany-ramos', nat: 'Panameño', birth: '1997-01-26', pos: 'Defensa Central', sec: null, eur: 450000, pj: 13, num: 3, clubs: [{c: 'Dep. Táchira (Ven)', y: '2023 - 2023'}, {c: 'Atlético Venezuela', y: '2021 - 2022'}, {c: 'Independiente La Chorrera (Pan)', y: '2017 - 2020'}] },
      { name: 'Marco Huamán', slug: 'marco-huaman', nat: 'Peruano', birth: '2002-09-25', pos: 'Lateral Derecho', sec: null, eur: 450000, pj: 13, num: 22, clubs: [{c: 'Sport Huancayo', y: '2021 - 2023'}] },
      { name: 'Ricardo Lagos', slug: 'ricardo-lagos', nat: 'Peruano', birth: '1996-04-20', pos: 'Lateral Izquierdo', sec: null, eur: 400000, pj: 12, num: 13, clubs: [{c: 'Carlos A. Mannucci', y: '2019 - 2020'}, {c: 'Univ. César Vallejo', y: '2017 - 2018'}] },
      { name: 'Aldair Fuentes', slug: 'aldair-fuentes', nat: 'Peruano', birth: '1998-01-25', pos: 'Defensa Central', sec: 'Pivote', eur: 400000, pj: 12, num: 20, clubs: [{c: 'César Vallejo', y: '2023 - 2023'}, {c: 'Fuenlabrada (Esp)', y: '2020 - 2022'}, {c: 'Alianza Lima', y: '2017 - 2020'}] },
      { name: 'Sebastián Rodríguez', slug: 'sebastian-rodriguez', nat: 'Uruguayo', birth: '1992-08-16', pos: 'Mediocentro', sec: 'Pivote', eur: 1200000, pj: 17, num: 10, clubs: [{c: 'Peñarol (Uru)', y: '2023 - 2023'}, {c: 'Emelec (Ecu)', y: '2020 - 2022'}, {c: 'Veracruz (Mex)', y: '2019 - 2019'}] },
      { name: 'Adrián Arregui', slug: 'adrian-arregui', nat: 'Argentino', birth: '1992-08-12', pos: 'Pivote', sec: null, eur: 550000, pj: 14, num: 7, clubs: [{c: 'Temperley (Arg)', y: '2023 - 2023'}, {c: 'Independiente Medellín (Col)', y: '2021 - 2022'}, {c: 'Huracán (Arg)', y: '2020 - 2021'}] },
      { name: 'Catriel Cabellos', slug: 'catriel-cabellos', nat: 'Peruano / Argentino', birth: '2004-08-18', pos: 'Mediocentro', sec: 'Interior', eur: 850000, pj: 16, num: 27, clubs: [{c: 'Racing Club (Arg)', y: '2022 - 2023'}] },
      { name: 'Jesús Castillo', slug: 'jesus-castillo', nat: 'Peruano', birth: '1996-03-10', pos: 'Pivote', sec: 'Mediocentro', eur: 500000, pj: 15, num: 14, clubs: [{c: 'Cantolao', y: '2017 - 2022'}] },
      { name: 'Gonzalo Aguirre', slug: 'gonzalo-aguirre', nat: 'Peruano / Argentino', birth: '2003-05-13', pos: 'Mediocentro', sec: null, eur: 350000, pj: 7, num: 8, clubs: [{c: 'Sporting Cristal', y: '2023 - 2023'}, {c: 'Nueva Chicago (Arg)', y: '2022 - 2023'}] },
      { name: 'Axel Moyano', slug: 'axel-moyano', nat: 'Peruano', birth: '2001-01-03', pos: 'Mediocentro', sec: null, eur: 300000, pj: 8, num: 15, clubs: [{c: 'Atlético Grau', y: '2023 - 2023'}, {c: 'Univ. San Martín', y: '2022 - 2022'}] },
      { name: 'Kevin Quevedo', slug: 'kevin-quevedo', nat: 'Peruano', birth: '1997-02-22', pos: 'Extremo Derecho', sec: 'Extremo Izquierdo', eur: 750000, pj: 15, num: 11, clubs: [{c: 'Univ. Católica (Ecu)', y: '2024 - 2024'}, {c: 'Deportivo Garcilaso', y: '2023 - 2023'}, {c: 'FBC Melgar', y: '2021 - 2022'}] },
      { name: 'Franco Zanelatto', slug: 'franco-zanelatto', nat: 'Paraguayo / Peruano', birth: '2000-05-09', pos: 'Extremo Izquierdo', sec: 'Extremo Derecho', eur: 600000, pj: 14, num: 17, clubs: [{c: 'Alianza Atlético', y: '2022 - 2022'}, {c: 'Univ. San Martín', y: '2019 - 2021'}] },
      { name: "Jhamir D'Arrigo", slug: 'jhamir-darrigo', nat: 'Peruano', birth: '1999-11-15', pos: 'Extremo Izquierdo', sec: null, eur: 500000, pj: 12, num: 23, clubs: [{c: 'FBC Melgar', y: '2023 - 2023'}, {c: 'Cantolao', y: '2020 - 2022'}] },
      { name: 'Paolo Guerrero', slug: 'paolo-guerrero', nat: 'Peruano', birth: '1984-01-01', pos: 'Delantero Centro', sec: null, eur: 175000, pj: 15, num: 99, clubs: [{c: 'César Vallejo', y: '2024 - 2024'}, {c: 'LDU Quito (Ecu)', y: '2023 - 2023'}, {c: 'Racing Club (Arg)', y: '2023 - 2023'}] },
      { name: 'Hernán Barcos', slug: 'hernan-barcos', nat: 'Argentino / Peruano', birth: '1984-04-11', pos: 'Delantero Centro', sec: null, eur: 200000, pj: 16, num: 9, clubs: [{c: 'FC Messina (Ita)', y: '2020 - 2021'}, {c: 'Bashundhara (Ban)', y: '2020 - 2020'}, {c: 'Atlético Nacional (Col)', y: '2019 - 2019'}] },
      { name: 'Pablo Sabbag', slug: 'pablo-sabbag', nat: 'Sirio / Colombiano', birth: '1997-06-11', pos: 'Delantero Centro', sec: null, eur: 800000, pj: 11, num: 19, clubs: [{c: 'La Equidad (Col)', y: '2022 - 2022'}, {c: "Newell's Old Boys (Arg)", y: '2021 - 2021'}, {c: 'Estudiantes LP (Arg)', y: '2021 - 2021'}] },
      { name: 'Matías Succar', slug: 'matias-succar', nat: 'Peruano / Libanés', birth: '1999-02-16', pos: 'Delantero Centro', sec: null, eur: 500000, pj: 13, num: 26, clubs: [{c: 'Carlos A. Mannucci', y: '2022 - 2024'}, {c: 'Teplice (Rep. Checa)', y: '2021 - 2022'}, {c: 'LASK (Austria)', y: '2021 - 2021'}] },
      { name: 'Cecilio Waterman', slug: 'cecilio-waterman', nat: 'Panameño', birth: '1991-04-13', pos: 'Delantero Centro', sec: 'Extremo', eur: 500000, pj: 10, num: 30, clubs: [{c: 'Cobresal (Chile)', y: '2022 - 2023'}, {c: 'Everton (Chile)', y: '2021 - 2021'}, {c: 'Univ. de Concepción (Chi)', y: '2020 - 2020'}] }
    ]
  };

  const exchangeRate = 1.0999;

  for (const [teamSlug, playersList] of Object.entries(squads)) {
    const teamId = teamMap[teamSlug];
    if (!teamId) continue;

    console.log(`\n⚽ Cargando plantilla de ${teamSlug.toUpperCase()} (${playersList.length} futbolistas)...`);

    for (const p of playersList) {
      let pId = playerMap[p.slug];

      if (!pId) {
        // Insertar nuevo jugador
        const { data: newP, error: insertErr } = await supabase
          .from('players')
          .insert({
            full_name: p.name,
            slug: p.slug,
            nationality: p.nat,
            birth_date: p.birth,
            primary_position: p.pos,
            secondary_position: p.sec,
          })
          .select('id')
          .single();

        if (insertErr || !newP) {
          console.error(`Error insertando ${p.name}:`, insertErr?.message);
          continue;
        }
        pId = newP.id;
        playerMap[p.slug] = pId;
      } else {
        // Actualizar datos del jugador existente
        await supabase
          .from('players')
          .update({
            full_name: p.name,
            nationality: p.nat,
            birth_date: p.birth,
            primary_position: p.pos,
            secondary_position: p.sec,
          })
          .eq('id', pId);
      }

      // Upsert en player_seasons 2026
      await supabase.from('player_seasons').upsert({
        player_id: pId,
        team_id: teamId,
        season_year: 2026,
        market_value_eur: p.eur,
        market_value_usd: Math.round(p.eur * exchangeRate),
        matches_played: p.pj,
        jersey_number: p.num,
        contract_start_date: '2026-01-01',
        contract_end_date: '2026-12-31',
        last_updated: new Date().toISOString(),
      }, { onConflict: 'player_id,season_year' });

      // Clubes previos
      if (p.clubs && p.clubs.length > 0) {
        for (let i = 0; i < p.clubs.length; i++) {
          const club = p.clubs[i];
          // Delete existing for this index to avoid conflict
          await supabase
            .from('player_previous_clubs')
            .delete()
            .eq('player_id', pId)
            .eq('order_index', i + 1);

          await supabase.from('player_previous_clubs').insert({
            player_id: pId,
            club_name: club.c,
            years: club.y,
            order_index: i + 1,
          });
        }
      }
    }

    // Actualizar squad_size en team_seasons
    await supabase
      .from('team_seasons')
      .update({ squad_size: playersList.length, last_updated: new Date().toISOString() })
      .eq('team_id', teamId)
      .eq('season_year', 2026);

    console.log(`✅ ${teamSlug}: ${playersList.length} futbolistas registrados correctamente.`);
  }

  console.log('\n🎉 Plantillas oficiales de +24 jugadores cargadas con éxito.');
  process.exit(0);
}

main().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
});
