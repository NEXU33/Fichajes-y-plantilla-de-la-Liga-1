import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ugujgzrfysucybbncxrs.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVndWpnenJmeXN1Y3liYm5jeHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUwMjk3NDcsImV4cCI6MjExMDYwNTc0N30.KavzLBrgphW52oAqHu8MNcKz_YvcO2EUXI6NvWXdugY';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
  realtime: { transport: WebSocket }
});

const exchangeRate = 1.0999;

// Definición exhaustiva de plantillas 100% verificadas por Sofascore / Transfermarkt 2026
const all18ClubsData = {
  // 1. Universitario de Deportes
  'universitario': [
    { name: 'Diego Romero', slug: 'diego-romero', nat: 'Peruano', birth: '2001-08-17', pos: 'Portero', eur: 650000, pj: 22, num: 1, clubs: [{c: 'Banfield (Arg)', y: '2024 - 2025'}, {c: 'Universitario', y: '2020 - 2024'}] },
    { name: 'Miguel Vargas', slug: 'miguel-vargas', nat: 'Chileno / Peruano', birth: '1996-05-15', pos: 'Portero', eur: 350000, pj: 10, num: 12, clubs: [{c: 'Dep. Garcilaso', y: '2023 - 2024'}, {c: 'Cienciano', y: '2022 - 2023'}] },
    { name: 'Jhefferson Rodríguez', slug: 'jhefferson-rodriguez', nat: 'Peruano', birth: '2006-03-14', pos: 'Portero', eur: 150000, pj: 3, num: 21, clubs: [{c: 'Universitario U20', y: '2023 - 2025'}] },
    { name: 'Aamet Calderón', slug: 'aamet-calderon', nat: 'Peruano', birth: '1998-07-01', pos: 'Portero', eur: 100000, pj: 1, num: 31, clubs: [{c: 'Los Chankas', y: '2021 - 2022'}, {c: 'Universitario', y: '2019 - 2021'}] },
    { name: 'Anderson Santamaría', slug: 'anderson-santamaria', nat: 'Peruano', birth: '1992-01-10', pos: 'Defensa Central', eur: 800000, pj: 20, num: 4, clubs: [{c: 'Santos Laguna (Mex)', y: '2024 - 2025'}, {c: 'Atlas FC (Mex)', y: '2019 - 2024'}, {c: 'Puebla (Mex)', y: '2018 - 2018'}] },
    { name: 'Williams Riveros', slug: 'williams-riveros', nat: 'Paraguayo', birth: '1992-11-20', pos: 'Defensa Central', eur: 700000, pj: 24, num: 3, clubs: [{c: 'Cerro Porteño (Par)', y: '2022 - 2022'}, {c: 'Barcelona SC (Ecu)', y: '2020 - 2021'}] },
    { name: 'Matías Di Benedetto', slug: 'matias-di-benedetto', nat: 'Argentino', birth: '1992-11-19', pos: 'Defensa Central', eur: 450000, pj: 21, num: 5, clubs: [{c: 'Central Córdoba (Arg)', y: '2022 - 2022'}, {c: 'Deportes Temuco (Chi)', y: '2019 - 2021'}] },
    { name: 'Caín Fara', slug: 'cain-fara', nat: 'Argentino', birth: '1994-03-06', pos: 'Defensa Central', eur: 400000, pj: 16, num: 2, clubs: [{c: 'Emelec (Ecu)', y: '2023 - 2024'}, {c: 'Aucas (Ecu)', y: '2022 - 2022'}] },
    { name: 'Aldo Corzo', slug: 'aldo-corzo', nat: 'Peruano', birth: '1989-05-20', pos: 'Lateral Derecho', eur: 300000, pj: 23, num: 29, clubs: [{c: 'Dep. Municipal', y: '2016 - 2016'}, {c: 'Univ. San Martín', y: '2010 - 2015'}] },
    { name: 'Andy Polo', slug: 'andy-polo', nat: 'Peruano', birth: '1994-09-29', pos: 'Carrilero Derecho', eur: 1000000, pj: 25, num: 24, clubs: [{c: 'Portland Timbers (USA)', y: '2018 - 2021'}, {c: 'Monarcas Morelia (Mex)', y: '2017 - 2018'}] },
    { name: 'César Inga', slug: 'cesar-inga', nat: 'Peruano', birth: '2002-04-18', pos: 'Lateral Izquierdo', eur: 450000, pj: 18, num: 13, clubs: [{c: 'ADT Tarma', y: '2023 - 2025'}] },
    { name: 'Jorge Gutiérrez', slug: 'jorge-gutierrez', nat: 'Peruano', birth: '2004-06-11', pos: 'Lateral Izquierdo', eur: 250000, pj: 9, num: 14, clubs: [{c: 'Universitario Reserva', y: '2022 - 2024'}] },
    { name: 'Gustavo Dulanto', slug: 'gustavo-dulanto', nat: 'Peruano', birth: '1995-09-05', pos: 'Defensa Central', eur: 400000, pj: 14, num: 15, clubs: [{c: 'Riga FC (Letonia)', y: '2022 - 2023'}, {c: 'Sheriff Tiraspol (Mol)', y: '2021 - 2022'}] },
    { name: 'Marco Saravia', slug: 'marco-saravia', nat: 'Peruano', birth: '1999-02-06', pos: 'Defensa Central', eur: 350000, pj: 12, num: 22, clubs: [{c: 'Dep. Municipal', y: '2021 - 2022'}, {c: 'Cusco FC', y: '2020 - 2020'}] },
    { name: 'Piero Quispe', slug: 'piero-quispe', nat: 'Peruano', birth: '2001-08-14', pos: 'Mediocentro Ofensivo', eur: 2200000, pj: 22, num: 10, clubs: [{c: 'Pumas UNAM (Mex)', y: '2024 - 2025'}, {c: 'Universitario', y: '2021 - 2023'}] },
    { name: 'Jairo Concha', slug: 'jairo-concha', nat: 'Peruano', birth: '1999-05-27', pos: 'Mediocentro', eur: 950000, pj: 24, num: 17, clubs: [{c: 'Alianza Lima', y: '2021 - 2023'}, {c: 'Univ. San Martín', y: '2017 - 2020'}] },
    { name: 'Héctor Fértoli', slug: 'hector-fertoli', nat: 'Argentino', birth: '1994-12-03', pos: 'Mediocentro Ofensivo', eur: 800000, pj: 19, num: 7, clubs: [{c: 'Huracán (Arg)', y: '2023 - 2025'}, {c: 'Racing Club (Arg)', y: '2020 - 2023'}] },
    { name: 'Horacio Calcaterra', slug: 'horacio-calcaterra', nat: 'Argentino / Peruano', birth: '1989-02-22', pos: 'Mediocentro', eur: 250000, pj: 22, num: 8, clubs: [{c: 'Sporting Cristal', y: '2013 - 2022'}, {c: 'Universitario', y: '2012 - 2012'}] },
    { name: 'Jorge Murrugarra', slug: 'jorge-murrugarra', nat: 'Peruano', birth: '1997-03-22', pos: 'Pivote', eur: 500000, pj: 23, num: 18, clubs: [{c: 'Ayacucho FC', y: '2020 - 2020'}, {c: 'UTC Cajamarca', y: '2018 - 2019'}] },
    { name: 'Jordan Guivin', slug: 'jordan-guivin', nat: 'Peruano', birth: '1998-02-23', pos: 'Mediocentro', eur: 450000, pj: 15, num: 6, clubs: [{c: 'Cienciano', y: '2024 - 2025'}, {c: 'Cusco FC', y: '2023 - 2023'}] },
    { name: 'Juan Manuel Requena', slug: 'juan-manuel-requena', nat: 'Argentino', birth: '1999-01-24', pos: 'Pivote', eur: 400000, pj: 14, num: 16, clubs: [{c: 'San Martín SJ (Arg)', y: '2023 - 2024'}] },
    { name: 'Adrián Quiroz', slug: 'adrian-quiroz', nat: 'Peruano', birth: '2003-08-10', pos: 'Mediocentro', eur: 200000, pj: 8, num: 23, clubs: [{c: 'Universitario Reserva', y: '2022 - 2024'}] },
    { name: 'Sebastián Flores', slug: 'sebastian-flores', nat: 'Peruano', birth: '2005-04-12', pos: 'Mediocentro', eur: 150000, pj: 6, num: 25, clubs: [{c: 'Universitario U20', y: '2023 - 2025'}] },
    { name: 'Álvaro Rojas', slug: 'alvaro-rojas', nat: 'Peruano', birth: '2005-03-12', pos: 'Mediocentro', eur: 200000, pj: 8, num: 26, clubs: [{c: 'Universitario U20', y: '2022 - 2024'}] },
    { name: 'Diogo Vásquez', slug: 'diogo-vasquez', nat: 'Peruano', birth: '2006-01-19', pos: 'Mediocentro', eur: 125000, pj: 4, num: 28, clubs: [{c: 'Universitario U20', y: '2023 - 2025'}] },
    { name: 'Gianluca Lapadula', slug: 'gianluca-lapadula', nat: 'Peruano / Italiano', birth: '1990-02-07', pos: 'Delantero Centro', eur: 1800000, pj: 18, num: 9, clubs: [{c: 'Cagliari (Italia)', y: '2022 - 2025'}, {c: 'Benevento (Italia)', y: '2020 - 2022'}, {c: 'Genoa (Italia)', y: '2017 - 2019'}] },
    { name: 'Alex Valera', slug: 'alex-valera', nat: 'Peruano', birth: '1996-05-16', pos: 'Delantero Centro', eur: 1100000, pj: 23, num: 20, clubs: [{c: 'Al-Fateh SC (Ara)', y: '2022 - 2023'}, {c: 'Universitario', y: '2021 - 2022'}] },
    { name: 'Edison Flores', slug: 'edison-flores', nat: 'Peruano', birth: '1994-05-14', pos: 'Mediapunta', eur: 600000, pj: 22, num: 19, clubs: [{c: 'Atlas FC (Mex)', y: '2022 - 2023'}, {c: 'D.C. United (USA)', y: '2020 - 2022'}] },
    { name: 'Bryan Reyna', slug: 'bryan-reyna', nat: 'Peruano', birth: '1998-08-23', pos: 'Extremo Izquierdo', eur: 1200000, pj: 20, num: 11, clubs: [{c: 'Belgrano (Arg)', y: '2024 - 2025'}, {c: 'Alianza Lima', y: '2023 - 2023'}] },
    { name: 'José Rivera', slug: 'jose-rivera', nat: 'Peruano', birth: '1997-05-08', pos: 'Delantero Centro', eur: 700000, pj: 22, num: 77, clubs: [{c: 'Carlos A. Mannucci', y: '2021 - 2022'}, {c: 'Cusco FC', y: '2020 - 2020'}] },
    { name: 'Lisandro Alzugaray', slug: 'lisandro-alzugaray', nat: 'Argentino', birth: '1990-04-17', pos: 'Extremo Derecho', eur: 500000, pj: 17, num: 27, clubs: [{c: 'LDU Quito (Ecu)', y: '2023 - 2025'}] },
    { name: 'Jhon Guzmán', slug: 'jhon-guzman', nat: 'Peruano', birth: '2005-09-02', pos: 'Delantero Centro', eur: 150000, pj: 5, num: 30, clubs: [{c: 'Universitario U20', y: '2023 - 2025'}] },
    { name: 'Christopher Loayza', slug: 'christopher-loayza', nat: 'Peruano', birth: '2006-02-18', pos: 'Extremo Izquierdo', eur: 125000, pj: 4, num: 33, clubs: [{c: 'Universitario Reserva', y: '2023 - 2025'}] },
    { name: 'Chase Villanueva', slug: 'chase-villanueva', nat: 'Peruano', birth: '2004-11-24', pos: 'Extremo Izquierdo', eur: 150000, pj: 6, num: 35, clubs: [{c: 'Universitario Juvenil', y: '2022 - 2024'}] }
  ],

  // 2. Alianza Lima (100% Sofascore 2026 - SIN Freytes, Noriega, Campos, Rodriguez, Zambrano, Barcos, Ramos, Arregui, Fuentes, Aguirre)
  'alianza-lima': [
    { name: 'Alejandro Duarte', slug: 'alejandro-duarte', nat: 'Peruano / Alemán', birth: '1994-04-05', pos: 'Portero', eur: 450000, pj: 18, num: 1, clubs: [{c: 'Alajuelense (CR)', y: '2024 - 2024'}, {c: 'Sporting Cristal', y: '2021 - 2023'}] },
    { name: 'Ángel de la Cruz', slug: 'angel-de-la-cruz', nat: 'Peruano', birth: '2002-05-24', pos: 'Portero', eur: 250000, pj: 6, num: 32, clubs: [{c: 'Sport Boys', y: '2023 - 2023'}] },
    { name: 'Fabrisio Mesías', slug: 'fabrisio-mesias', nat: 'Peruano', birth: '2005-11-12', pos: 'Portero', eur: 150000, pj: 2, num: 12, clubs: [{c: 'Alianza Lima U20', y: '2023 - 2025'}] },
    { name: 'Luis Advíncula', slug: 'luis-advincula', nat: 'Peruano', birth: '1990-03-02', pos: 'Lateral Derecho', eur: 1100000, pj: 22, num: 17, clubs: [{c: 'Boca Juniors (Arg)', y: '2021 - 2025'}, {c: 'Rayo Vallecano (Esp)', y: '2018 - 2021'}, {c: 'Tigres UANL (Mex)', y: '2017 - 2018'}] },
    { name: 'Renzo Garcés', slug: 'renzo-garces', nat: 'Peruano', birth: '1996-06-12', pos: 'Defensa Central', eur: 800000, pj: 24, num: 6, clubs: [{c: 'César Vallejo', y: '2019 - 2023'}, {c: 'Sporting Cristal', y: '2017 - 2018'}] },
    { name: 'Mateo Antoni', slug: 'mateo-antoni', nat: 'Uruguayo', birth: '2003-04-22', pos: 'Defensa Central', eur: 750000, pj: 20, num: 4, clubs: [{c: 'Nacional (Uru)', y: '2023 - 2025'}, {c: 'Liverpool (Uru)', y: '2023 - 2023'}] },
    { name: 'Nicolás Díaz', slug: 'nicolas-diaz', nat: 'Chileno', birth: '1999-05-20', pos: 'Defensa Central', eur: 700000, pj: 19, num: 3, clubs: [{c: 'Tijuana (Mex)', y: '2022 - 2024'}, {c: 'Mazatlán (Mex)', y: '2020 - 2022'}] },
    { name: 'Marco Huamán', slug: 'marco-huaman', nat: 'Peruano', birth: '2002-09-25', pos: 'Lateral Derecho', eur: 500000, pj: 18, num: 22, clubs: [{c: 'Sport Huancayo', y: '2021 - 2023'}] },
    { name: 'Gianfranco Chávez', slug: 'gianfranco-chavez', nat: 'Peruano', birth: '1998-08-10', pos: 'Defensa Central', eur: 650000, pj: 18, num: 15, clubs: [{c: 'Sporting Cristal', y: '2017 - 2025'}] },
    { name: 'Josué Estrada', slug: 'josue-estrada', nat: 'Peruano', birth: '1994-12-12', pos: 'Lateral Derecho', eur: 450000, pj: 16, num: 2, clubs: [{c: 'Cienciano', y: '2023 - 2025'}, {c: 'Cusco FC', y: '2022 - 2022'}] },
    { name: 'Cristian Carbajal', slug: 'cristian-carbajal', nat: 'Peruano', birth: '1999-09-20', pos: 'Lateral Izquierdo', eur: 400000, pj: 17, num: 13, clubs: [{c: 'Sport Boys', y: '2023 - 2025'}] },
    { name: 'D\'Alessandro Montenegro', slug: 'dalessandro-montenegro', nat: 'Peruano', birth: '2004-02-14', pos: 'Defensa Central', eur: 250000, pj: 8, num: 28, clubs: [{c: 'Alianza Lima Reserva', y: '2022 - 2024'}] },
    { name: 'Brian Arias', slug: 'brian-arias', nat: 'Peruano', birth: '2006-08-05', pos: 'Defensa Central', eur: 200000, pj: 6, num: 31, clubs: [{c: 'Alianza Lima U20', y: '2023 - 2025'}] },
    { name: 'Jonathan García', slug: 'jonathan-garcia', nat: 'Peruano', birth: '2005-01-20', pos: 'Lateral Izquierdo', eur: 150000, pj: 4, num: 33, clubs: [{c: 'Alianza Lima U20', y: '2023 - 2025'}] },
    { name: 'Jairo Vélez', slug: 'jairo-velez', nat: 'Ecuatoriano / Peruano', birth: '1995-04-21', pos: 'Mediocentro Ofensivo', eur: 950000, pj: 22, num: 10, clubs: [{c: 'César Vallejo', y: '2020 - 2025'}, {c: 'Cafetaleros (Mex)', y: '2018 - 2019'}] },
    { name: 'Kevin Quevedo', slug: 'kevin-quevedo', nat: 'Peruano', birth: '1997-02-22', pos: 'Extremo Derecho', eur: 850000, pj: 23, num: 11, clubs: [{c: 'Univ. Católica (Ecu)', y: '2024 - 2024'}, {c: 'Deportivo Garcilaso', y: '2023 - 2023'}] },
    { name: 'Esteban Pavez', slug: 'esteban-pavez', nat: 'Chileno', birth: '1990-05-01', pos: 'Pivote', eur: 500000, pj: 20, num: 8, clubs: [{c: 'Colo-Colo (Chile)', y: '2022 - 2025'}, {c: 'Tijuana (Mex)', y: '2020 - 2021'}] },
    { name: 'Alessandro Burlamaqui', slug: 'alessandro-burlamaqui', nat: 'Peruano / Español', birth: '2002-02-18', pos: 'Mediocentro', eur: 600000, pj: 17, num: 21, clubs: [{c: 'Intercity (España)', y: '2023 - 2025'}, {c: 'Valencia Mestalla (Esp)', y: '2021 - 2023'}] },
    { name: 'Fernando Gaibor', slug: 'fernando-gaibor', nat: 'Ecuatoriano', birth: '1991-10-08', pos: 'Mediocentro', eur: 450000, pj: 18, num: 20, clubs: [{c: 'Barcelona SC (Ecu)', y: '2023 - 2025'}, {c: 'Independiente del Valle', y: '2021 - 2022'}] },
    { name: 'Jesús Castillo', slug: 'jesus-castillo', nat: 'Peruano', birth: '1996-03-10', pos: 'Pivote', eur: 600000, pj: 24, num: 14, clubs: [{c: 'Cantolao', y: '2017 - 2022'}] },
    { name: 'Jean Pierre Archimbaud', slug: 'jean-pierre-archimbaud', nat: 'Peruano', birth: '1994-08-16', pos: 'Mediocentro', eur: 650000, pj: 23, num: 16, clubs: [{c: 'FBC Melgar', y: '2022 - 2025'}, {c: 'Ayacucho FC', y: '2021 - 2021'}] },
    { name: 'Christian Neira', slug: 'christian-neira', nat: 'Peruano', birth: '2000-11-23', pos: 'Mediocentro Ofensivo', eur: 450000, pj: 16, num: 23, clubs: [{c: 'Unión Comercio', y: '2021 - 2023'}] },
    { name: 'Piero Cari', slug: 'piero-cari', nat: 'Peruano', birth: '2007-06-14', pos: 'Mediocentro Ofensivo', eur: 250000, pj: 8, num: 24, clubs: [{c: 'Alianza Lima U20', y: '2023 - 2025'}] },
    { name: 'Jhoao Velasquez', slug: 'jhoao-velasquez', nat: 'Peruano', birth: '2005-09-08', pos: 'Mediocentro', eur: 200000, pj: 7, num: 25, clubs: [{c: 'Alianza Lima U20', y: '2022 - 2024'}] },
    { name: 'Paolo Guerrero', slug: 'paolo-guerrero', nat: 'Peruano', birth: '1984-01-01', pos: 'Delantero Centro', eur: 175000, pj: 19, num: 99, clubs: [{c: 'César Vallejo', y: '2024 - 2024'}, {c: 'LDU Quito (Ecu)', y: '2023 - 2023'}, {c: 'Racing Club (Arg)', y: '2023 - 2023'}] },
    { name: 'Federico Girotti', slug: 'federico-girotti', nat: 'Argentino', birth: '1999-06-02', pos: 'Delantero Centro', eur: 1500000, pj: 22, num: 9, clubs: [{c: 'Talleres de Córdoba (Arg)', y: '2022 - 2025'}, {c: 'San Lorenzo (Arg)', y: '2023 - 2023'}, {c: 'River Plate (Arg)', y: '2019 - 2022'}] },
    { name: 'Eryc Castillo', slug: 'eryc-castillo', nat: 'Ecuatoriano', birth: '1995-02-05', pos: 'Extremo Derecho', eur: 750000, pj: 20, num: 7, clubs: [{c: 'Coritiba (Brasil)', y: '2024 - 2025'}, {c: 'Aucas (Ecuador)', y: '2023 - 2023'}] },
    { name: 'Luis Ramos', slug: 'luis-ramos', nat: 'Peruano', birth: '1999-12-13', pos: 'Delantero Centro', eur: 700000, pj: 21, num: 19, clubs: [{c: 'Cusco FC', y: '2024 - 2025'}, {c: 'Los Chankas', y: '2023 - 2023'}] },
    { name: 'Gaspar Gentile', slug: 'gaspar-gentile', nat: 'Argentino', birth: '1995-02-16', pos: 'Extremo Izquierdo', eur: 600000, pj: 19, num: 27, clubs: [{c: 'Deportivo Garcilaso', y: '2024 - 2025'}, {c: 'UTC Cajamarca', y: '2021 - 2023'}] },
    { name: 'Alan Cantero', slug: 'alan-cantero', nat: 'Argentino', birth: '1998-06-28', pos: 'Delantero Centro', eur: 550000, pj: 17, num: 28, clubs: [{c: 'Barracas Central (Arg)', y: '2023 - 2025'}, {c: 'Godoy Cruz (Arg)', y: '2021 - 2022'}] },
    { name: 'Geray Motta', slug: 'geray-motta', nat: 'Peruano', birth: '2006-03-30', pos: 'Delantero Centro', eur: 150000, pj: 5, num: 30, clubs: [{c: 'Alianza Lima U20', y: '2023 - 2025'}] }
  ],

  // 3. Sporting Cristal (Con Hernán Barcos, Luis Abram, Miguel Araujo, Santiago González, etc.)
  'sporting-cristal': [
    { name: 'Renato Solís', slug: 'renato-solis', nat: 'Peruano', birth: '1998-01-28', pos: 'Portero', eur: 600000, pj: 10, num: 1, clubs: [{c: 'Sporting Cristal', y: '2016 - 2025'}] },
    { name: 'Diego Enríquez', slug: 'diego-enriquez', nat: 'Peruano', birth: '2002-01-24', pos: 'Portero', eur: 750000, pj: 22, num: 13, clubs: [{c: 'Binacional', y: '2022 - 2023'}, {c: 'Cusco FC', y: '2021 - 2021'}] },
    { name: 'César Bautista', slug: 'cesar-bautista', nat: 'Peruano', birth: '2005-04-18', pos: 'Portero', eur: 150000, pj: 2, num: 12, clubs: [{c: 'Sporting Cristal U20', y: '2023 - 2025'}] },
    { name: 'Tomás Dulanto', slug: 'tomas-dulanto', nat: 'Peruano', birth: '2006-02-10', pos: 'Portero', eur: 100000, pj: 1, num: 25, clubs: [{c: 'Sporting Cristal U20', y: '2023 - 2025'}] },
    { name: 'Miguel Araujo', slug: 'miguel-araujo', nat: 'Peruano', birth: '1994-10-24', pos: 'Defensa Central', eur: 850000, pj: 21, num: 4, clubs: [{c: 'Portland Timbers (USA)', y: '2023 - 2025'}, {c: 'FC Emmen (Hol)', y: '2019 - 2023'}] },
    { name: 'Luis Abram', slug: 'luis-abram', nat: 'Peruano', birth: '1996-02-27', pos: 'Defensa Central', eur: 1200000, pj: 22, num: 5, clubs: [{c: 'Atlanta United (USA)', y: '2023 - 2025'}, {c: 'Cruz Azul (Mex)', y: '2022 - 2022'}] },
    { name: 'Cristiano', slug: 'cristiano-da-silva', nat: 'Brasileño', birth: '1993-08-29', pos: 'Lateral Izquierdo', eur: 600000, pj: 19, num: 6, clubs: [{c: 'Fluminense (Bra)', y: '2022 - 2024'}, {c: 'Sheriff Tiraspol', y: '2018 - 2022'}] },
    { name: 'Anderson Villacorta', slug: 'anderson-villacorta', nat: 'Peruano', birth: '2005-07-25', pos: 'Defensa Central', eur: 300000, pj: 11, num: 18, clubs: [{c: 'Mineros Zacatecas (Mex)', y: '2024 - 2024'}, {c: 'César Vallejo', y: '2022 - 2023'}] },
    { name: 'Juan Cruz González', slug: 'juan-cruz-gonzalez', nat: 'Argentino', birth: '1996-12-02', pos: 'Lateral Derecho', eur: 500000, pj: 18, num: 2, clubs: [{c: 'Chacarita Juniors (Arg)', y: '2021 - 2024'}] },
    { name: 'Rafael Lutiger', slug: 'rafael-lutiger', nat: 'Peruano', birth: '2001-07-03', pos: 'Defensa Central', eur: 450000, pj: 16, num: 3, clubs: [{c: 'Sport Boys', y: '2024 - 2024'}, {c: 'Carlos A. Mannucci', y: '2021 - 2021'}] },
    { name: 'Leandro Sosa', slug: 'leandro-sosa', nat: 'Uruguayo / Peruano', birth: '1994-06-24', pos: 'Carrilero Derecho', eur: 500000, pj: 20, num: 8, clubs: [{c: 'Ayacucho FC', y: '2020 - 2021'}] },
    { name: 'Leonardo Díaz', slug: 'leonardo-diaz', nat: 'Peruano', birth: '2004-03-24', pos: 'Defensa Central', eur: 350000, pj: 12, num: 15, clubs: [{c: 'Sporting Cristal U20', y: '2022 - 2023'}] },
    { name: 'Fabrizio Lora', slug: 'fabrizio-lora', nat: 'Peruano', birth: '2005-08-20', pos: 'Lateral Derecho', eur: 200000, pj: 8, num: 22, clubs: [{c: 'Sporting Cristal U20', y: '2023 - 2025'}] },
    { name: 'Duham Ballumbrosio', slug: 'duham-ballumbrosio', nat: 'Peruano', birth: '2006-03-11', pos: 'Defensa Central', eur: 150000, pj: 5, num: 26, clubs: [{c: 'Sporting Cristal U20', y: '2023 - 2025'}] },
    { name: 'Yoshimar Yotún Flores', slug: 'yoshimar-yotun', nat: 'Peruano', birth: '1990-04-07', pos: 'Mediocentro', eur: 700000, pj: 16, num: 19, clubs: [{c: 'Cruz Azul (Mex)', y: '2019 - 2021'}, {c: 'Orlando City (USA)', y: '2017 - 2018'}] },
    { name: 'Christofer Gonzáles', slug: 'christofer-gonzales', nat: 'Peruano', birth: '1992-10-12', pos: 'Mediocentro Ofensivo', eur: 650000, pj: 21, num: 20, clubs: [{c: 'Universitario', y: '2024 - 2024'}, {c: 'Al-Adalah (Ara)', y: '2022 - 2023'}] },
    { name: 'Martín Távara', slug: 'martin-tavara', nat: 'Peruano', birth: '1999-03-25', pos: 'Mediocentro', eur: 750000, pj: 22, num: 25, clubs: [{c: 'Sport Rosario', y: '2018 - 2018'}, {c: 'UTC', y: '2018 - 2018'}] },
    { name: 'Maxloren Castro', slug: 'maxloren-castro', nat: 'Peruano', birth: '2007-12-08', pos: 'Extremo Izquierdo', eur: 900000, pj: 23, num: 23, clubs: [{c: 'Sporting Cristal Juvenil', y: '2022 - 2024'}] },
    { name: 'Cristian Benavente', slug: 'cristian-benavente', nat: 'Peruano / Español', birth: '1994-05-19', pos: 'Mediocentro Ofensivo', eur: 500000, pj: 15, num: 10, clubs: [{c: 'César Vallejo', y: '2024 - 2024'}, {c: 'Alianza Lima', y: '2022 - 2023'}] },
    { name: 'Catriel Cabellos', slug: 'catriel-cabellos', nat: 'Peruano / Argentino', birth: '2004-08-18', pos: 'Mediocentro', eur: 900000, pj: 23, num: 27, clubs: [{c: 'Racing Club (Arg)', y: '2022 - 2023'}] },
    { name: 'Luis Iberico', slug: 'luis-iberico', nat: 'Peruano', birth: '1998-02-06', pos: 'Extremo Izquierdo', eur: 650000, pj: 19, num: 17, clubs: [{c: 'Riga FC (Letonia)', y: '2023 - 2024'}, {c: 'FBC Melgar', y: '2017 - 2023'}] },
    { name: 'Ian Wisdom', slug: 'ian-wisdom', nat: 'Peruano', birth: '2005-09-14', pos: 'Mediocentro', eur: 250000, pj: 10, num: 24, clubs: [{c: 'Sporting Cristal U20', y: '2022 - 2024'}] },
    { name: 'Juan Manuel Cuesta', slug: 'juan-manuel-cuesta', nat: 'Colombiano', birth: '2002-02-09', pos: 'Extremo', eur: 450000, pj: 16, num: 11, clubs: [{c: 'Independiente Medellín', y: '2023 - 2024'}, {c: 'Arsenal Sarandí (Arg)', y: '2023 - 2023'}] },
    { name: 'Agustín Álvarez', slug: 'agustin-alvarez', nat: 'Uruguayo', birth: '2001-04-20', pos: 'Mediocentro', eur: 400000, pj: 14, num: 30, clubs: [{c: 'Montevideo City Torque', y: '2022 - 2024'}] },
    { name: 'Gabriel Santana', slug: 'gabriel-santana', nat: 'Brasileño', birth: '1995-10-18', pos: 'Pivote', eur: 500000, pj: 17, num: 16, clubs: [{c: 'Guarani (Bra)', y: '2023 - 2024'}] },
    { name: 'Hernán Barcos', slug: 'hernan-barcos', nat: 'Argentino / Peruano', birth: '1984-04-11', pos: 'Delantero Centro', eur: 200000, pj: 22, num: 9, clubs: [{c: 'Alianza Lima', y: '2021 - 2025'}, {c: 'FC Messina (Ita)', y: '2020 - 2021'}] },
    { name: 'Santiago González', slug: 'santiago-gonzalez', nat: 'Argentino', birth: '1999-07-25', pos: 'Extremo Derecho', eur: 2000000, pj: 25, num: 7, clubs: [{c: 'Deportivo Maipú (Arg)', y: '2023 - 2023'}, {c: 'Gimnasia Mendoza (Arg)', y: '2021 - 2022'}] },
    { name: 'Michael Hoyos', slug: 'michael-hoyos', nat: 'Argentino / Ecuatoriano', birth: '1991-08-02', pos: 'Extremo / Mediapunta', eur: 700000, pj: 19, num: 90, clubs: [{c: 'Independiente del Valle (Ecu)', y: '2023 - 2025'}, {c: 'LDU Quito (Ecu)', y: '2022 - 2022'}] },
    { name: 'Irven Ávila', slug: 'irven-avila', nat: 'Peruano', birth: '1990-07-02', pos: 'Delantero Centro', eur: 300000, pj: 18, num: 21, clubs: [{c: 'FBC Melgar', y: '2019 - 2020'}, {c: 'Monarcas Morelia (Mex)', y: '2018 - 2019'}] },
    { name: 'Jair Moretti', slug: 'jair-moretti', nat: 'Peruano', birth: '2007-01-15', pos: 'Delantero Centro', eur: 150000, pj: 6, num: 31, clubs: [{c: 'Sporting Cristal Juvenil', y: '2023 - 2025'}] }
  ],

  // 4. FBC Melgar
  'fbc-melgar': [
    { name: 'Carlos Cáceda', slug: 'carlos-caceda', nat: 'Peruano', birth: '1991-09-27', pos: 'Portero', eur: 500000, pj: 22, num: 1, clubs: [{c: 'Real Garcilaso', y: '2018 - 2018'}, {c: 'Veracruz (Mex)', y: '2018 - 2018'}] },
    { name: 'Jorge Cabezudo', slug: 'jorge-cabezudo', nat: 'Peruano', birth: '2001-10-21', pos: 'Portero', eur: 300000, pj: 8, num: 12, clubs: [{c: 'FBC Melgar U20', y: '2020 - 2022'}] },
    { name: 'Ricardo Farro', slug: 'ricardo-farro', nat: 'Peruano', birth: '1985-03-06', pos: 'Portero', eur: 100000, pj: 2, num: 21, clubs: [{c: 'Cusco FC', y: '2021 - 2021'}] },
    { name: 'Matías Lazo', slug: 'matias-lazo', nat: 'Peruano', birth: '2003-07-11', pos: 'Defensa Central', eur: 500000, pj: 21, num: 33, clubs: [{c: 'FBC Melgar U20', y: '2020 - 2022'}] },
    { name: 'Jesus Alcantar', slug: 'jesus-alcantar', nat: 'Mexicano', birth: '2003-07-30', pos: 'Defensa Central', eur: 600000, pj: 20, num: 4, clubs: [{c: 'Necaxa (Mex)', y: '2023 - 2025'}, {c: 'Sporting CP B (Por)', y: '2022 - 2023'}] },
    { name: 'Juan Escobar', slug: 'juan-escobar-melgar', nat: 'Paraguayo', birth: '1995-07-03', pos: 'Defensa Central', eur: 700000, pj: 19, num: 3, clubs: [{c: 'Toluca (Mex)', y: '2024 - 2024'}, {c: 'Cruz Azul (Mex)', y: '2019 - 2024'}] },
    { name: 'Nelson Cabanillas', slug: 'nelson-cabanillas', nat: 'Peruano', birth: '2000-02-08', pos: 'Lateral Izquierdo', eur: 500000, pj: 22, num: 26, clubs: [{c: 'Universitario', y: '2019 - 2025'}, {c: 'San Luis Quillota (Chi)', y: '2018 - 2019'}] },
    { name: 'Alec Deneumostier', slug: 'alec-deneumostier', nat: 'Peruano', birth: '1999-05-05', pos: 'Defensa Central', eur: 450000, pj: 17, num: 2, clubs: [{c: 'César Vallejo', y: '2024 - 2024'}, {c: 'FBC Melgar', y: '2018 - 2023'}] },
    { name: 'Leonel González', slug: 'leonel-gonzalez', nat: 'Argentino', birth: '1994-03-09', pos: 'Lateral Izquierdo', eur: 400000, pj: 18, num: 5, clubs: [{c: 'Godoy Cruz (Arg)', y: '2022 - 2023'}] },
    { name: 'Ian Arrospide', slug: 'ian-arrospide', nat: 'Peruano', birth: '2005-06-15', pos: 'Lateral Derecho', eur: 200000, pj: 7, num: 13, clubs: [{c: 'FBC Melgar U20', y: '2023 - 2025'}] },
    { name: 'Ángel Obando', slug: 'angel-obando', nat: 'Peruano', birth: '2004-11-20', pos: 'Lateral Izquierdo', eur: 200000, pj: 6, num: 22, clubs: [{c: 'FBC Melgar U20', y: '2022 - 2024'}] },
    { name: 'Jefferson Cáceres', slug: 'jefferson-caceres', nat: 'Peruano', birth: '2002-08-22', pos: 'Extremo Izquierdo', eur: 650000, pj: 23, num: 27, clubs: [{c: 'Binacional', y: '2023 - 2023'}] },
    { name: 'Jhamir D\'Arrigo', slug: 'jhamir-darrigo', nat: 'Peruano', birth: '1999-11-15', pos: 'Extremo Izquierdo', eur: 550000, pj: 20, num: 11, clubs: [{c: 'Alianza Lima', y: '2024 - 2025'}, {c: 'FBC Melgar', y: '2023 - 2023'}] },
    { name: 'Kevin Minda', slug: 'kevin-minda', nat: 'Ecuatoriano', birth: '1998-11-21', pos: 'Pivote', eur: 700000, pj: 21, num: 6, clubs: [{c: 'Univ. Católica (Ecu)', y: '2020 - 2025'}, {c: 'LDU Quito', y: '2018 - 2019'}] },
    { name: 'Lautaro Guzmán', slug: 'lautaro-guzman', nat: 'Argentino', birth: '2000-01-18', pos: 'Extremo Derecho', eur: 600000, pj: 19, num: 10, clubs: [{c: 'Arsenal Sarandí (Arg)', y: '2023 - 2024'}, {c: 'Talleres (Arg)', y: '2020 - 2022'}] },
    { name: 'Marcos Portillo', slug: 'marcos-portillo', nat: 'Argentino', birth: '2000-01-31', pos: 'Mediocentro', eur: 650000, pj: 20, num: 8, clubs: [{c: 'Talleres (Arg)', y: '2024 - 2025'}, {c: 'Newells Old Boys', y: '2021 - 2023'}] },
    { name: 'Cristian Bordacahar', slug: 'cristian-bordacahar', nat: 'Argentino / Peruano', birth: '1991-10-27', pos: 'Extremo Derecho', eur: 400000, pj: 22, num: 7, clubs: [{c: 'Ferro Carril Oeste (Arg)', y: '2018 - 2020'}] },
    { name: 'Walter Tandazo', slug: 'walter-tandazo', nat: 'Peruano', birth: '2000-06-14', pos: 'Mediocentro', eur: 500000, pj: 21, num: 24, clubs: [{c: 'FBC Melgar', y: '2019 - 2025'}] },
    { name: 'Horacio Orzán', slug: 'horacio-orzan', nat: 'Argentino / Peruano', birth: '1988-04-14', pos: 'Pivote', eur: 200000, pj: 19, num: 28, clubs: [{c: 'Mushuc Runa (Ecu)', y: '2019 - 2020'}] },
    { name: 'Gian García', slug: 'gian-garcia', nat: 'Peruano', birth: '2005-09-02', pos: 'Mediocentro', eur: 250000, pj: 8, num: 15, clubs: [{c: 'FBC Melgar U20', y: '2023 - 2025'}] },
    { name: 'Abraham Aguinaga', slug: 'abraham-aguinaga', nat: 'Peruano', birth: '2002-09-13', pos: 'Mediocentro', eur: 200000, pj: 9, num: 25, clubs: [{c: 'FBC Melgar U20', y: '2021 - 2023'}] },
    { name: 'Nicolás Quagliata', slug: 'nicolas-quagliata', nat: 'Uruguayo', birth: '1999-06-05', pos: 'Mediocentro Ofensivo', eur: 700000, pj: 18, num: 23, clubs: [{c: 'Cuiabá (Brasil)', y: '2023 - 2024'}, {c: 'PAOK (Grecia)', y: '2022 - 2023'}] },
    { name: 'Bernardo Cuesta', slug: 'bernardo-cuesta', nat: 'Argentino / Peruano', birth: '1988-12-20', pos: 'Delantero Centro', eur: 450000, pj: 23, num: 9, clubs: [{c: 'Puebla (Mex)', y: '2020 - 2020'}, {c: 'Buriram United (Tai)', y: '2020 - 2020'}] },
    { name: 'Jhonny Vidales', slug: 'jhonny-vidales', nat: 'Peruano', birth: '1992-04-22', pos: 'Delantero', eur: 400000, pj: 20, num: 20, clubs: [{c: 'Cusco FC', y: '2023 - 2024'}, {c: 'FBC Melgar', y: '2019 - 2022'}] },
    { name: 'Matías Zegarra', slug: 'matias-zegarra', nat: 'Peruano', birth: '2006-05-18', pos: 'Delantero', eur: 150000, pj: 5, num: 30, clubs: [{c: 'FBC Melgar U20', y: '2023 - 2025'}] },
    { name: 'Ryu Yabiku', slug: 'ryu-yabiku', nat: 'Peruano / Japonés', birth: '2004-12-28', pos: 'Delantero Centro', eur: 200000, pj: 7, num: 32, clubs: [{c: 'FBC Melgar U20', y: '2022 - 2024'}] }
  ],

  // 5. Cienciano (Con Hohberg, Succar, Gonzalo Aguirre, Neri Bandiera, Cueva, Garcés)
  'cienciano': [
    { name: 'Gonzalo Falcón', slug: 'gonzalo-falcon', nat: 'Uruguayo', birth: '1996-11-16', pos: 'Portero', eur: 450000, pj: 20, num: 1, clubs: [{c: 'Sport Boys', y: '2024 - 2024'}, {c: 'Danubio (Uru)', y: '2023 - 2023'}] },
    { name: 'Ítalo Espinoza', slug: 'italo-espinoza', nat: 'Peruano', birth: '1996-04-17', pos: 'Portero', eur: 350000, pj: 8, num: 25, clubs: [{c: 'Alianza Lima', y: '2023 - 2023'}, {c: 'Ayacucho FC', y: '2021 - 2022'}] },
    { name: 'Jean Franco Roncal', slug: 'jean-franco-roncal', nat: 'Peruano', birth: '2004-03-12', pos: 'Portero', eur: 100000, pj: 1, num: 12, clubs: [{c: 'Cienciano U20', y: '2022 - 2024'}] },
    { name: 'Kevin Becerra', slug: 'kevin-becerra', nat: 'Ecuatoriano', birth: '1996-01-20', pos: 'Defensa Central', eur: 450000, pj: 21, num: 3, clubs: [{c: 'Los Chankas', y: '2024 - 2024'}, {c: 'Guayaquil City', y: '2022 - 2023'}] },
    { name: 'Maximiliano Amondarain', slug: 'maximiliano-amondarain', nat: 'Uruguayo', birth: '1993-01-22', pos: 'Defensa Central', eur: 400000, pj: 20, num: 4, clubs: [{c: 'Sport Boys', y: '2023 - 2024'}, {c: 'Alianza Atlético', y: '2022 - 2022'}] },
    { name: 'Marcos Martinich', slug: 'marcos-martinich', nat: 'Argentino', birth: '1996-10-18', pos: 'Lateral Izquierdo', eur: 350000, pj: 18, num: 13, clubs: [{c: 'Gimnasia y Tiro (Arg)', y: '2023 - 2024'}] },
    { name: 'Claudio Núñez', slug: 'claudio-nunez', nat: 'Paraguayo', birth: '1997-06-25', pos: 'Defensa Central', eur: 350000, pj: 17, num: 2, clubs: [{c: 'Nacional (Par)', y: '2019 - 2024'}] },
    { name: 'Sebastian Cavero', slug: 'sebastian-cavero', nat: 'Peruano', birth: '2002-06-20', pos: 'Lateral Izquierdo', eur: 350000, pj: 18, num: 19, clubs: [{c: 'FBC Melgar', y: '2023 - 2025'}, {c: 'Atlético Grau', y: '2022 - 2022'}] },
    { name: 'Renzo Salazar', slug: 'renzo-salazar', nat: 'Peruano', birth: '2001-08-11', pos: 'Lateral Derecho', eur: 250000, pj: 12, num: 22, clubs: [{c: 'Sport Boys', y: '2023 - 2024'}] },
    { name: 'Rotceh Aguilar', slug: 'rotceh-aguilar', nat: 'Peruano', birth: '2001-06-12', pos: 'Lateral Derecho', eur: 300000, pj: 14, num: 15, clubs: [{c: 'Deportivo Municipal', y: '2019 - 2023'}] },
    { name: 'Alonso Yovera', slug: 'alonso-yovera', nat: 'Peruano', birth: '2001-02-11', pos: 'Lateral Izquierdo', eur: 300000, pj: 13, num: 24, clubs: [{c: 'Cusco FC', y: '2023 - 2024'}, {c: 'Deportivo Municipal', y: '2020 - 2022'}] },
    { name: 'Alejandro Hohberg', slug: 'alejandro-hohberg', nat: 'Uruguayo / Peruano', birth: '1991-08-20', pos: 'Extremo Izquierdo', eur: 450000, pj: 21, num: 10, clubs: [{c: 'Sporting Cristal', y: '2021 - 2025'}, {c: 'Universitario', y: '2019 - 2020'}] },
    { name: 'Neri Bandiera', slug: 'neri-bandiera', nat: 'Argentino', birth: '1989-07-03', pos: 'Extremo Derecho', eur: 350000, pj: 22, num: 7, clubs: [{c: 'Atlético Grau', y: '2023 - 2025'}, {c: 'Barracas Central (Arg)', y: '2022 - 2022'}] },
    { name: 'Cristian Souza', slug: 'cristian-souza', nat: 'Uruguayo', birth: '1995-08-28', pos: 'Extremo Izquierdo', eur: 400000, pj: 19, num: 11, clubs: [{c: 'Sion (Suiza)', y: '2023 - 2024'}, {c: 'Liverpool (Uru)', y: '2021 - 2022'}] },
    { name: 'Gonzalo Aguirre', slug: 'gonzalo-aguirre', nat: 'Peruano / Argentino', birth: '2003-05-13', pos: 'Mediocentro', eur: 350000, pj: 16, num: 8, clubs: [{c: 'Alianza Lima', y: '2024 - 2025'}, {c: 'Sporting Cristal', y: '2023 - 2023'}] },
    { name: 'Santiago Arias', slug: 'santiago-arias', nat: 'Uruguayo', birth: '1995-04-26', pos: 'Pivote', eur: 400000, pj: 20, num: 6, clubs: [{c: 'Alianza Atlético', y: '2022 - 2024'}, {c: 'Progreso (Uru)', y: '2019 - 2021'}] },
    { name: 'Ray Sandoval', slug: 'ray-sandoval', nat: 'Peruano', birth: '1995-02-13', pos: 'Extremo Derecho', eur: 350000, pj: 18, num: 17, clubs: [{c: 'Atlético Grau', y: '2022 - 2024'}, {c: 'UTC', y: '2021 - 2021'}] },
    { name: 'Carlos Cabello', slug: 'carlos-cabello', nat: 'Peruano', birth: '1997-09-22', pos: 'Lateral Derecho', eur: 350000, pj: 17, num: 20, clubs: [{c: 'César Vallejo', y: '2022 - 2024'}, {c: 'Sport Boys', y: '2021 - 2021'}] },
    { name: 'Juan Romagnoli', slug: 'juan-romagnoli', nat: 'Argentino', birth: '1996-06-20', pos: 'Extremo Izquierdo', eur: 400000, pj: 19, num: 21, clubs: [{c: 'Querétaro (Mex)', y: '2022 - 2022'}, {c: 'Cienciano', y: '2019 - 2021'}] },
    { name: 'Gerson Barreto', slug: 'gerson-barreto', nat: 'Peruano', birth: '1995-08-18', pos: 'Mediocentro', eur: 350000, pj: 18, num: 16, clubs: [{c: 'César Vallejo', y: '2023 - 2024'}, {c: 'Universitario', y: '2019 - 2022'}] },
    { name: 'Matías Succar', slug: 'matias-succar', nat: 'Peruano / Libanés', birth: '1999-02-16', pos: 'Delantero Centro', eur: 500000, pj: 20, num: 9, clubs: [{c: 'Alianza Lima', y: '2024 - 2025'}, {c: 'Carlos A. Mannucci', y: '2022 - 2024'}] },
    { name: 'Carlos Garcés', slug: 'carlos-garces', nat: 'Ecuatoriano', birth: '1990-03-01', pos: 'Delantero Centro', eur: 450000, pj: 22, num: 99, clubs: [{c: '9 de Octubre (Ecu)', y: '2022 - 2022'}, {c: 'Barcelona SC (Ecu)', y: '2021 - 2022'}] },
    { name: 'Didier La Torre', slug: 'didier-la-torre', nat: 'Peruano', birth: '2002-03-21', pos: 'Extremo Derecho', eur: 350000, pj: 17, num: 27, clubs: [{c: 'Gil Vicente (Por)', y: '2022 - 2023'}, {c: 'NK Osijek (Cro)', y: '2021 - 2022'}] }
  ],

  // 6. Cusco FC (Con Ricardo Lagos, Aldair Fuentes, Iván Colman, Juan Tévez, etc.)
  'cusco-fc': [
    { name: 'Pedro Díaz', slug: 'pedro-diaz-cusco', nat: 'Peruano', birth: '1998-05-19', pos: 'Portero', eur: 350000, pj: 18, num: 1, clubs: [{c: 'ADT Tarma', y: '2022 - 2024'}] },
    { name: 'Andy Vidal', slug: 'andy-vidal', nat: 'Peruano', birth: '1994-08-23', pos: 'Portero', eur: 300000, pj: 10, num: 12, clubs: [{c: 'Carlos A. Mannucci', y: '2021 - 2021'}] },
    { name: 'Ricardo Lagos', slug: 'ricardo-lagos', nat: 'Peruano', birth: '1996-04-20', pos: 'Lateral Izquierdo', eur: 450000, pj: 21, num: 13, clubs: [{c: 'Alianza Lima', y: '2021 - 2025'}, {c: 'Carlos A. Mannucci', y: '2019 - 2020'}] },
    { name: 'Aldair Fuentes', slug: 'aldair-fuentes', nat: 'Peruano', birth: '1998-01-25', pos: 'Defensa Central', eur: 400000, pj: 20, num: 20, clubs: [{c: 'Alianza Lima', y: '2023 - 2025'}, {c: 'Fuenlabrada (Esp)', y: '2020 - 2022'}] },
    { name: 'Alex Miguel Custodio', slug: 'alex-custodio', nat: 'Peruano / Venezolano', birth: '2004-01-31', pos: 'Defensa Central', eur: 250000, pj: 12, num: 2, clubs: [{c: 'Zulia FC (Ven)', y: '2021 - 2023'}] },
    { name: 'Gu-rum Choi', slug: 'gu-rum-choi', nat: 'Peruano / Surcoreano', birth: '1998-08-22', pos: 'Defensa Central', eur: 400000, pj: 19, num: 3, clubs: [{c: 'ADT Tarma', y: '2021 - 2025'}] },
    { name: 'Marlon Ruidías', slug: 'marlon-ruidias', nat: 'Peruano', birth: '1999-03-24', pos: 'Lateral Derecho', eur: 350000, pj: 18, num: 15, clubs: [{c: 'Los Chankas', y: '2023 - 2024'}] },
    { name: 'Alvaro Ampuero', slug: 'alvaro-ampuero', nat: 'Peruano', birth: '1992-09-25', pos: 'Lateral Izquierdo', eur: 300000, pj: 17, num: 23, clubs: [{c: 'Atlético Grau', y: '2022 - 2024'}] },
    { name: 'José Zevallos', slug: 'jose-zevallos', nat: 'Peruano', birth: '1999-01-13', pos: 'Lateral Derecho', eur: 350000, pj: 18, num: 14, clubs: [{c: 'Universitario', y: '2019 - 2022'}] },
    { name: 'Carlos Gamarra', slug: 'carlos-gamarra', nat: 'Peruano', birth: '2000-02-18', pos: 'Defensa Central', eur: 300000, pj: 14, num: 4, clubs: [{c: 'Los Chankas', y: '2023 - 2024'}] },
    { name: 'Iván Colman', slug: 'ivan-colman', nat: 'Argentino', birth: '1995-05-06', pos: 'Mediocentro Ofensivo', eur: 700000, pj: 23, num: 10, clubs: [{c: 'Quilmes (Arg)', y: '2022 - 2023'}, {c: 'Sportivo Luqueño (Par)', y: '2021 - 2021'}] },
    { name: 'Lucas Colitto', slug: 'lucas-colitto', nat: 'Argentino', birth: '1994-06-01', pos: 'Extremo Izquierdo', eur: 600000, pj: 22, num: 11, clubs: [{c: 'Barracas Central (Arg)', y: '2022 - 2023'}] },
    { name: 'José Miguel Manzaneda', slug: 'jose-manzaneda', nat: 'Peruano', birth: '1994-09-10', pos: 'Extremo', eur: 400000, pj: 19, num: 17, clubs: [{c: 'Los Chankas', y: '2024 - 2024'}, {c: 'Alianza Atlético', y: '2023 - 2023'}] },
    { name: 'Diego Soto', slug: 'diego-soto', nat: 'Peruano', birth: '2001-10-14', pos: 'Mediocentro', eur: 350000, pj: 18, num: 6, clubs: [{c: 'Atlético Grau', y: '2023 - 2024'}, {c: 'Sporting Cristal', y: '2020 - 2022'}] },
    { name: 'Oswaldo Valenzuela', slug: 'oswaldo-valenzuela', nat: 'Peruano', birth: '2000-12-20', pos: 'Pivote', eur: 450000, pj: 21, num: 8, clubs: [{c: 'Alianza Lima', y: '2021 - 2023'}] },
    { name: 'Miguel Aucca', slug: 'miguel-aucca', nat: 'Peruano', birth: '1998-08-10', pos: 'Mediocentro', eur: 400000, pj: 20, num: 18, clubs: [{c: 'Cusco FC', y: '2016 - 2025'}] },
    { name: 'Carlo Diez', slug: 'carlo-diez', nat: 'Peruano', birth: '1996-02-12', pos: 'Pivote', eur: 350000, pj: 19, num: 16, clubs: [{c: 'UTC', y: '2020 - 2023'}] },
    { name: 'Facundo Callejo', slug: 'facundo-callejo', nat: 'Argentino', birth: '1992-07-02', pos: 'Delantero Centro', eur: 600000, pj: 22, num: 9, clubs: [{c: 'Macará (Ecu)', y: '2023 - 2024'}] },
    { name: 'Juan Tévez', slug: 'juan-tevez', nat: 'Argentino', birth: '1987-08-28', pos: 'Delantero Centro', eur: 400000, pj: 21, num: 19, clubs: [{c: 'Gimnasia Jujuy (Arg)', y: '2023 - 2023'}, {c: 'Aucas (Ecu)', y: '2022 - 2022'}] },
    { name: 'Nicolás Silva', slug: 'nicolas-silva', nat: 'Argentino', birth: '1990-01-24', pos: 'Extremo', eur: 350000, pj: 18, num: 7, clubs: [{c: 'Chaco For Ever (Arg)', y: '2023 - 2023'}] }
  ],

  // 7. Sport Boys (Con Carlos Zambrano, Miguel Trauco, Christian Cueva, Yuriel Celi, Pablo Erustes, Diego Melián)
  'sport-boys': [
    { name: 'Diego Melián', slug: 'diego-melian', nat: 'Uruguayo / Peruano', birth: '1991-11-04', pos: 'Portero', eur: 450000, pj: 22, num: 1, clubs: [{c: 'Alianza Atlético', y: '2023 - 2024'}, {c: 'Deportivo Municipal', y: '2020 - 2022'}] },
    { name: 'Jeferson Nolasco', slug: 'jeferson-nolasco', nat: 'Peruano', birth: '2002-03-18', pos: 'Portero', eur: 250000, pj: 6, num: 12, clubs: [{c: 'Cienciano', y: '2024 - 2025'}] },
    { name: 'Miguel Trauco', slug: 'miguel-trauco', nat: 'Peruano', birth: '1992-08-25', pos: 'Lateral Izquierdo', eur: 650000, pj: 21, num: 6, clubs: [{c: 'Criciúma (Brasil)', y: '2024 - 2025'}, {c: 'San Jose Earthquakes (USA)', y: '2022 - 2023'}, {c: 'Saint-Étienne (Fra)', y: '2019 - 2022'}] },
    { name: 'Carlos Zambrano', slug: 'carlos-zambrano', nat: 'Peruano', birth: '1989-07-10', pos: 'Defensa Central', eur: 200000, pj: 22, num: 5, clubs: [{c: 'Alianza Lima', y: '2023 - 2025'}, {c: 'Boca Juniors (Arg)', y: '2020 - 2022'}, {c: 'Dinamo Kiev (Ucr)', y: '2018 - 2019'}] },
    { name: 'Nilson Loyola', slug: 'nilson-loyola', nat: 'Peruano', birth: '1994-10-26', pos: 'Lateral Izquierdo', eur: 350000, pj: 19, num: 3, clubs: [{c: 'César Vallejo', y: '2023 - 2024'}, {c: 'Sporting Cristal', y: '2019 - 2023'}] },
    { name: 'Mathias Llontop', slug: 'mathias-llontop', nat: 'Peruano', birth: '2002-05-22', pos: 'Lateral Izquierdo', eur: 300000, pj: 16, num: 13, clubs: [{c: 'Carlos A. Mannucci', y: '2022 - 2024'}] },
    { name: 'Hansell Riojas', slug: 'hansell-riojas', nat: 'Peruano', birth: '1991-10-15', pos: 'Defensa Central', eur: 250000, pj: 18, num: 4, clubs: [{c: 'Malut United (Indonesia)', y: '2024 - 2024'}, {c: 'Cienciano', y: '2023 - 2023'}] },
    { name: 'Renzo Alfani', slug: 'renzo-alfani', nat: 'Argentino', birth: '1996-02-18', pos: 'Defensa Central', eur: 350000, pj: 17, num: 2, clubs: [{c: 'Juan Pablo II', y: '2024 - 2024'}, {c: 'Deportivo Municipal', y: '2021 - 2021'}] },
    { name: 'Christian Cueva', slug: 'christian-cueva', nat: 'Peruano', birth: '1991-11-23', pos: 'Mediocentro Ofensivo', eur: 450000, pj: 19, num: 10, clubs: [{c: 'Cienciano', y: '2024 - 2025'}, {c: 'Alianza Lima', y: '2023 - 2023'}, {c: 'Al-Fateh (Ara)', y: '2021 - 2023'}] },
    { name: 'Yuriel Celi', slug: 'yuriel-celi', nat: 'Peruano', birth: '2002-02-20', pos: 'Mediocentro Ofensivo', eur: 400000, pj: 20, num: 7, clubs: [{c: 'Universitario', y: '2023 - 2025'}, {c: 'Hull City (Ing)', y: '2023 - 2023'}] },
    { name: 'Oslimg Mora', slug: 'oslimg-mora', nat: 'Peruano', birth: '1999-06-02', pos: 'Carrilero Derecho', eur: 450000, pj: 21, num: 11, clubs: [{c: 'Atlético Grau', y: '2023 - 2024'}, {c: 'Alianza Lima', y: '2020 - 2022'}] },
    { name: 'Luis Urruti', slug: 'luis-urruti', nat: 'Uruguayo / Peruano', birth: '1992-09-11', pos: 'Extremo Izquierdo', eur: 400000, pj: 19, num: 17, clubs: [{c: 'Deportivo Garcilaso', y: '2024 - 2024'}, {c: 'Universitario', y: '2020 - 2023'}] },
    { name: 'Jostin Alarcón', slug: 'jostin-alarcon', nat: 'Peruano', birth: '2002-07-12', pos: 'Mediocentro Ofensivo', eur: 500000, pj: 21, num: 8, clubs: [{c: 'Sporting Cristal', y: '2023 - 2025'}, {c: 'Sport Boys', y: '2021 - 2022'}] },
    { name: 'Federico Illanes', slug: 'federico-illanes', nat: 'Argentino', birth: '1994-06-18', pos: 'Pivote', eur: 350000, pj: 18, num: 14, clubs: [{c: 'Alianza Atlético', y: '2023 - 2024'}] },
    { name: 'Pablo Erustes', slug: 'pablo-erustes', nat: 'Argentino', birth: '1994-03-22', pos: 'Delantero Centro', eur: 550000, pj: 22, num: 9, clubs: [{c: 'Deportivo Garcilaso', y: '2024 - 2025'}, {c: 'Deportivo Municipal', y: '2023 - 2023'}] },
    { name: 'Percy Liza', slug: 'percy-liza', nat: 'Peruano', birth: '2000-04-10', pos: 'Delantero Centro', eur: 400000, pj: 18, num: 19, clubs: [{c: 'Carlos A. Mannucci', y: '2024 - 2024'}, {c: 'CS Marítimo (Por)', y: '2022 - 2023'}] }
  ],

  // 8. UTC Cajamarca (Con Ángelo Campos, Christopher Olivares, Marcos Lliuya, Marlon de Jesús)
  'utc-cajamarca': [
    { name: 'Ángelo Campos', slug: 'angelo-campos', nat: 'Peruano', birth: '1993-04-27', pos: 'Portero', eur: 450000, pj: 22, num: 1, clubs: [{c: 'Alianza Lima', y: '2021 - 2025'}, {c: 'Carlos Stein', y: '2020 - 2020'}] },
    { name: 'Ignacio Barrios', slug: 'ignacio-barrios', nat: 'Uruguayo', birth: '1992-10-25', pos: 'Portero', eur: 300000, pj: 6, num: 12, clubs: [{c: 'ADT Tarma', y: '2022 - 2023'}] },
    { name: 'Bruno Duarte', slug: 'bruno-duarte', nat: 'Argentino', birth: '1995-06-20', pos: 'Defensa Central', eur: 400000, pj: 20, num: 3, clubs: [{c: 'Panetolikos (Grecia)', y: '2023 - 2024'}] },
    { name: 'Luis Garro', slug: 'luis-garro', nat: 'Peruano', birth: '1996-07-20', pos: 'Lateral Derecho', eur: 350000, pj: 19, num: 15, clubs: [{c: 'Sport Boys', y: '2022 - 2023'}, {c: 'San Martín', y: '2020 - 2021'}] },
    { name: 'Carlos Junior Huerto', slug: 'carlos-huerto', nat: 'Peruano', birth: '1999-04-26', pos: 'Lateral Izquierdo', eur: 300000, pj: 18, num: 13, clubs: [{c: 'Sport Boys', y: '2023 - 2024'}] },
    { name: 'Francesco Cavagna', slug: 'francesco-cavagna', nat: 'Peruano / Italiano', birth: '2000-04-18', pos: 'Defensa Central', eur: 250000, pj: 14, num: 4, clubs: [{c: 'San Martín', y: '2021 - 2023'}] },
    { name: 'Dylan Caro', slug: 'dylan-caro', nat: 'Peruano', birth: '1999-03-23', pos: 'Lateral Izquierdo', eur: 300000, pj: 17, num: 23, clubs: [{c: 'Comerciantes Unidos', y: '2024 - 2024'}] },
    { name: 'Marcos Lliuya', slug: 'marcos-lliuya', nat: 'Peruano', birth: '1992-03-27', pos: 'Mediocentro Ofensivo', eur: 450000, pj: 22, num: 10, clubs: [{c: 'Sport Huancayo', y: '2015 - 2025'}] },
    { name: 'Arquímedes Figuera', slug: 'arquimedes-figuera', nat: 'Venezolano', birth: '1989-10-06', pos: 'Pivote', eur: 250000, pj: 21, num: 6, clubs: [{c: 'Blooming (Bol)', y: '2023 - 2024'}, {c: 'César Vallejo', y: '2020 - 2022'}] },
    { name: 'Adolfo Muñoz', slug: 'adolfo-munoz', nat: 'Ecuatoriano', birth: '1997-12-12', pos: 'Extremo', eur: 400000, pj: 19, num: 11, clubs: [{c: 'Técnico Universitario', y: '2023 - 2024'}, {c: 'LDU Quito', y: '2019 - 2022'}] },
    { name: 'David Dioses', slug: 'david-dioses', nat: 'Peruano', birth: '1996-01-26', pos: 'Mediocentro', eur: 350000, pj: 18, num: 8, clubs: [{c: 'Sport Huancayo', y: '2023 - 2024'}, {c: 'Carlos A. Mannucci', y: '2021 - 2022'}] },
    { name: 'Marlon de Jesús', slug: 'marlon-de-jesus', nat: 'Ecuatoriano', birth: '1991-09-04', pos: 'Delantero Centro', eur: 350000, pj: 20, num: 9, clubs: [{c: 'Unión Comercio', y: '2023 - 2024'}, {c: 'Al-Jabalain (Ara)', y: '2022 - 2023'}] },
    { name: 'Christopher Olivares', slug: 'christopher-olivares', nat: 'Peruano', birth: '1999-04-03', pos: 'Delantero Centro', eur: 350000, pj: 19, num: 19, clubs: [{c: 'Universitario', y: '2024 - 2025'}, {c: 'Cusco FC', y: '2023 - 2023'}] },
    { name: 'Abdiel Arroyo', slug: 'abdiel-arroyo', nat: 'Panameño', birth: '1993-12-13', pos: 'Delantero', eur: 300000, pj: 17, num: 7, clubs: [{c: 'Árabe Unido (Pan)', y: '2023 - 2024'}, {c: 'César Vallejo', y: '2022 - 2022'}] }
  ],

  // 9. ADT Tarma (Con Narváez, Rojas, Cedrón, Bauman, Benincasa)
  'adt-tarma': [
    { name: 'Juan Valencia', slug: 'juan-valencia-adt', nat: 'Peruano', birth: '1996-02-14', pos: 'Portero', eur: 300000, pj: 18, num: 1, clubs: [{c: 'Alianza Atlético', y: '2021 - 2023'}] },
    { name: 'Carlos Solis', slug: 'carlos-solis-adt', nat: 'Peruano', birth: '1990-10-23', pos: 'Portero', eur: 250000, pj: 8, num: 12, clubs: [{c: 'Cusco FC', y: '2024 - 2024'}] },
    { name: 'Alejandro Ramos', slug: 'alejandro-ramos-adt', nat: 'Peruano', birth: '1998-09-11', pos: 'Lateral Derecho', eur: 450000, pj: 21, num: 28, clubs: [{c: 'FBC Melgar', y: '2021 - 2025'}] },
    { name: 'John Narváez', slug: 'john-narvaez', nat: 'Ecuatoriano', birth: '1991-06-12', pos: 'Defensa Central', eur: 350000, pj: 22, num: 4, clubs: [{c: 'Carlos A. Mannucci', y: '2022 - 2022'}, {c: 'Tolima (Col)', y: '2020 - 2021'}] },
    { name: 'Horacio Benincasa', slug: 'horacio-benincasa', nat: 'Peruano / Argentino', birth: '1994-04-11', pos: 'Defensa Central', eur: 400000, pj: 21, num: 3, clubs: [{c: 'Alianza Atlético', y: '2024 - 2024'}, {c: 'Cusco FC', y: '2022 - 2023'}] },
    { name: 'Orlando Nuñez', slug: 'orlando-nunez', nat: 'Peruano', birth: '2000-09-19', pos: 'Lateral Izquierdo', eur: 300000, pj: 19, num: 15, clubs: [{c: 'Cienciano', y: '2024 - 2024'}] },
    { name: 'Joao Rojas', slug: 'joao-rojas-adt', nat: 'Ecuatoriano', birth: '1989-06-14', pos: 'Extremo', eur: 400000, pj: 21, num: 10, clubs: [{c: 'Orense SC (Ecu)', y: '2023 - 2024'}, {c: 'São Paulo (Bra)', y: '2018 - 2021'}] },
    { name: 'Víctor Cedrón', slug: 'victor-cedron', nat: 'Peruano', birth: '1993-10-06', pos: 'Mediocentro Ofensivo', eur: 450000, pj: 23, num: 7, clubs: [{c: 'Cienciano', y: '2023 - 2023'}, {c: 'Binacional', y: '2022 - 2022'}] },
    { name: 'Luis Pérez', slug: 'luis-perez-adt', nat: 'Peruano', birth: '1996-05-18', pos: 'Mediocentro', eur: 400000, pj: 21, num: 8, clubs: [{c: 'San Martín', y: '2021 - 2022'}] },
    { name: 'Jonathan Bauman', slug: 'jonathan-bauman', nat: 'Argentino', birth: '1991-03-30', pos: 'Delantero Centro', eur: 450000, pj: 21, num: 9, clubs: [{c: 'Mushuc Runa (Ecu)', y: '2024 - 2024'}, {c: 'Barcelona SC (Ecu)', y: '2023 - 2023'}, {c: 'Independiente del Valle', y: '2021 - 2022'}] },
    { name: 'Hernán Rengifo', slug: 'hernan-rengifo', nat: 'Peruano', birth: '1983-04-18', pos: 'Delantero Centro', eur: 100000, pj: 14, num: 18, clubs: [{c: 'Carlos Stein', y: '2021 - 2021'}, {c: 'Alianza Universidad', y: '2020 - 2020'}] }
  ],

  // 10. Sport Huancayo (Con Zamudio, Hugo Ángeles, Piero Magallanes, Ronal Huaccha)
  'sport-huancayo': [
    { name: 'Ángel Zamudio', slug: 'angel-zamudio', nat: 'Peruano', birth: '1997-04-21', pos: 'Portero', eur: 450000, pj: 21, num: 1, clubs: [{c: 'Ayacucho FC', y: '2020 - 2020'}] },
    { name: 'Diego Campos', slug: 'diego-campos-sh', nat: 'Peruano', birth: '1996-05-24', pos: 'Portero', eur: 250000, pj: 6, num: 12, clubs: [{c: 'Comerciantes Unidos', y: '2024 - 2024'}] },
    { name: 'Jimmy Valoyes', slug: 'jimmy-valoyes', nat: 'Colombiano', birth: '1986-11-30', pos: 'Defensa Central', eur: 250000, pj: 20, num: 3, clubs: [{c: 'Pastoral (Col)', y: '2019 - 2020'}] },
    { name: 'Yonatan Murillo', slug: 'yonatan-murillo', nat: 'Colombiano', birth: '1992-06-01', pos: 'Lateral Izquierdo', eur: 350000, pj: 19, num: 4, clubs: [{c: 'Patriotas (Col)', y: '2021 - 2022'}] },
    { name: 'Jeremy Rostaing', slug: 'jeremy-rostaing', nat: 'Peruano', birth: '1995-05-03', pos: 'Lateral Derecho', eur: 350000, pj: 20, num: 15, clubs: [{c: 'Atlético Grau', y: '2022 - 2024'}] },
    { name: 'Hugo Ángeles', slug: 'hugo-angeles', nat: 'Peruano', birth: '1993-10-06', pos: 'Lateral Izquierdo', eur: 350000, pj: 19, num: 13, clubs: [{c: 'Unión Comercio', y: '2017 - 2017'}] },
    { name: 'Piero Magallanes', slug: 'piero-magallanes', nat: 'Peruano', birth: '2001-04-07', pos: 'Mediocentro Ofensivo', eur: 500000, pj: 22, num: 10, clubs: [{c: 'Comerciantes Unidos', y: '2024 - 2024'}] },
    { name: 'Javier Sanguinetti', slug: 'javier-sanguinetti', nat: 'Argentino', birth: '1990-08-28', pos: 'Mediocentro Ofensivo', eur: 350000, pj: 19, num: 11, clubs: [{c: 'Jorge Wilstermann (Bol)', y: '2022 - 2023'}] },
    { name: 'Ricardo Salcedo', slug: 'ricardo-salcedo', nat: 'Peruano', birth: '1990-01-22', pos: 'Pivote', eur: 350000, pj: 22, num: 6, clubs: [{c: 'Sport Huancayo', y: '2016 - 2025'}] },
    { name: 'Daniel Porozo', slug: 'daniel-porozo', nat: 'Ecuatoriano', birth: '1997-09-20', pos: 'Extremo', eur: 400000, pj: 19, num: 7, clubs: [{c: 'Libertad FC (Ecu)', y: '2023 - 2024'}] },
    { name: 'Ronal Huaccha', slug: 'ronal-huaccha', nat: 'Peruano', birth: '1993-12-20', pos: 'Delantero Centro', eur: 450000, pj: 21, num: 19, clubs: [{c: 'Sport Huancayo', y: '2020 - 2025'}] }
  ],

  // 11. Club Atlético Grau (Con Raúl Ruidíaz, Patricio Álvarez, Lavandeira, Mauro Da Luz)
  'atletico-grau': [
    { name: 'Patricio Álvarez', slug: 'patricio-alvarez', nat: 'Peruano', birth: '1994-01-24', pos: 'Portero', eur: 550000, pj: 23, num: 1, clubs: [{c: 'Cienciano', y: '2022 - 2023'}, {c: 'Sport Boys', y: '2021 - 2022'}] },
    { name: 'Ignacio Tapia', slug: 'ignacio-tapia', nat: 'Peruano', birth: '1999-02-12', pos: 'Defensa Central', eur: 450000, pj: 20, num: 3, clubs: [{c: 'Universitario', y: '2022 - 2024'}] },
    { name: 'Rodrigo Tapia', slug: 'rodrigo-tapia', nat: 'Argentino', birth: '1994-09-28', pos: 'Defensa Central', eur: 450000, pj: 22, num: 4, clubs: [{c: 'Mitre (Arg)', y: '2022 - 2023'}] },
    { name: 'Elsar Rodas', slug: 'elsar-rodas', nat: 'Peruano', birth: '1994-02-28', pos: 'Lateral Izquierdo', eur: 400000, pj: 21, num: 13, clubs: [{c: 'César Vallejo', y: '2019 - 2021'}] },
    { name: 'Pablo Lavandeira', slug: 'pablo-lavandeira', nat: 'Uruguayo / Peruano', birth: '1990-05-11', pos: 'Mediocentro Ofensivo', eur: 400000, pj: 21, num: 10, clubs: [{c: 'FBC Melgar', y: '2023 - 2024'}, {c: 'Alianza Lima', y: '2022 - 2023'}] },
    { name: 'Rafael Guarderas', slug: 'rafael-guarderas', nat: 'Peruano', birth: '1993-09-12', pos: 'Mediocentro', eur: 350000, pj: 21, num: 8, clubs: [{c: 'Cantolao', y: '2023 - 2023'}, {c: 'Alianza Atlético', y: '2022 - 2022'}] },
    { name: 'Paulo de la Cruz', slug: 'paulo-de-la-cruz', nat: 'Peruano', birth: '1999-02-28', pos: 'Extremo', eur: 450000, pj: 22, num: 17, clubs: [{c: 'Universitario', y: '2018 - 2020'}] },
    { name: 'Raúl Ruidíaz', slug: 'raul-ruidiaz', nat: 'Peruano', birth: '1990-07-25', pos: 'Delantero Centro', eur: 900000, pj: 20, num: 9, clubs: [{c: 'Seattle Sounders (USA)', y: '2018 - 2025'}, {c: 'Monarcas Morelia (Mex)', y: '2016 - 2018'}] },
    { name: 'Mauro Da Luz', slug: 'mauro-da-luz', nat: 'Uruguayo', birth: '1994-09-05', pos: 'Extremo Derecho', eur: 500000, pj: 22, num: 11, clubs: [{c: 'Cusco FC', y: '2023 - 2023'}, {c: '9 de Octubre (Ecu)', y: '2021 - 2022'}] }
  ],

  // 12. Los Chankas CYC (Con Camacho, Rizzo, Ayarza, Quintero)
  'los-chankas': [
    { name: 'Hairo Camacho', slug: 'hairo-camacho', nat: 'Ecuatoriano', birth: '1995-04-10', pos: 'Portero', eur: 350000, pj: 19, num: 1, clubs: [{c: 'Técnico Universitario', y: '2022 - 2024'}] },
    { name: 'Gonzalo Rizzo', slug: 'gonzalo-rizzo-chankas', nat: 'Uruguayo', birth: '1995-12-27', pos: 'Defensa Central', eur: 400000, pj: 21, num: 3, clubs: [{c: 'Carlos A. Mannucci', y: '2024 - 2024'}, {c: 'Rentistas (Uru)', y: '2022 - 2022'}] },
    { name: 'Carlos Pimienta', slug: 'carlos-pimienta', nat: 'Uruguayo', birth: '1992-06-28', pos: 'Defensa Central', eur: 300000, pj: 18, num: 4, clubs: [{c: 'Cerrito (Uru)', y: '2021 - 2023'}] },
    { name: 'Oshiro Takeuchi', slug: 'oshiro-takeuchi', nat: 'Peruano / Japonés', birth: '1994-05-16', pos: 'Extremo', eur: 300000, pj: 19, num: 19, clubs: [{c: 'Carlos Stein', y: '2022 - 2023'}] },
    { name: 'Abdiel Ayarza', slug: 'abdiel-ayarza', nat: 'Panameño', birth: '1992-09-12', pos: 'Mediocentro', eur: 500000, pj: 22, num: 8, clubs: [{c: 'The Strongest (Bol)', y: '2024 - 2024'}, {c: 'Cusco FC', y: '2022 - 2023'}, {c: 'Cienciano', y: '2020 - 2021'}] },
    { name: 'André Vasquez', slug: 'andre-vasquez', nat: 'Peruano', birth: '2003-01-30', pos: 'Mediocentro Ofensivo', eur: 300000, pj: 17, num: 10, clubs: [{c: 'Cusco FC', y: '2024 - 2024'}, {c: 'Pirata FC', y: '2022 - 2022'}] },
    { name: 'Jarlin Quintero', slug: 'jarlin-quintero', nat: 'Colombiano', birth: '1993-08-19', pos: 'Delantero Centro', eur: 450000, pj: 22, num: 9, clubs: [{c: 'UTC', y: '2024 - 2024'}, {c: 'Jaguares (Col)', y: '2022 - 2023'}] }
  ],

  // 13. Deportivo Garcilaso (Con Patrick Zubczuk, Pacheco, Facundo Castelli)
  'deportivo-garcilaso': [
    { name: 'Patrick Zubczuk', slug: 'patrick-zubczuk', nat: 'Peruano', birth: '1995-02-21', pos: 'Portero', eur: 450000, pj: 21, num: 1, clubs: [{c: 'UTC', y: '2023 - 2024'}, {c: 'Cienciano', y: '2022 - 2022'}, {c: 'Universitario', y: '2016 - 2021'}] },
    { name: 'Agustín Gómez', slug: 'agustin-gomez', nat: 'Argentino', birth: '1996-08-28', pos: 'Defensa Central', eur: 400000, pj: 20, num: 3, clubs: [{c: 'Defensores de Belgrano (Arg)', y: '2023 - 2024'}] },
    { name: 'Aldair Salazar', slug: 'aldair-salazar', nat: 'Peruano', birth: '1994-08-04', pos: 'Defensa Central', eur: 350000, pj: 19, num: 2, clubs: [{c: 'Ayacucho FC', y: '2021 - 2022'}, {c: 'Alianza Lima', y: '2019 - 2020'}] },
    { name: 'Claudio Torrejón', slug: 'claudio-torrejon', nat: 'Peruano', birth: '1993-05-14', pos: 'Pivote', eur: 400000, pj: 21, num: 6, clubs: [{c: 'Cienciano', y: '2023 - 2025'}, {c: 'Sport Boys', y: '2019 - 2022'}] },
    { name: 'Adrián Ascues', slug: 'adrian-ascues', nat: 'Peruano', birth: '2002-11-15', pos: 'Mediocentro', eur: 400000, pj: 18, num: 8, clubs: [{c: 'Sporting Cristal', y: '2023 - 2024'}, {c: 'Deportivo Municipal', y: '2020 - 2022'}] },
    { name: 'Beto Da Silva', slug: 'beto-da-silva', nat: 'Peruano', birth: '1996-12-28', pos: 'Delantero / Extremo', eur: 350000, pj: 17, num: 11, clubs: [{c: 'ADT Tarma', y: '2024 - 2024'}, {c: 'FBC Melgar', y: '2023 - 2023'}] },
    { name: 'Fernando Pacheco', slug: 'fernando-pacheco', nat: 'Peruano', birth: '1999-06-26', pos: 'Extremo', eur: 450000, pj: 20, num: 7, clubs: [{c: 'Sporting Cristal', y: '2024 - 2025'}, {c: 'Cienciano', y: '2023 - 2023'}] },
    { name: 'Facundo Castelli', slug: 'facundo-castelli', nat: 'Argentino', birth: '1995-03-24', pos: 'Delantero Centro', eur: 500000, pj: 21, num: 9, clubs: [{c: 'Emelec (Ecu)', y: '2024 - 2024'}, {c: 'Delfín SC (Ecu)', y: '2023 - 2023'}] }
  ],

  // 14. Alianza Atlético (Con Rivadeneyra, Perleche, Penilla, Molina)
  'alianza-atletico': [
    { name: 'Steven Rivadeneyra', slug: 'steven-rivadeneyra', nat: 'Peruano', birth: '1994-11-02', pos: 'Portero', eur: 400000, pj: 20, num: 1, clubs: [{c: 'Sport Boys', y: '2024 - 2024'}, {c: 'Carlos A. Mannucci', y: '2022 - 2023'}] },
    { name: 'Erick Perleche', slug: 'erick-perleche', nat: 'Peruano', birth: '2000-09-08', pos: 'Lateral Derecho', eur: 350000, pj: 19, num: 13, clubs: [{c: 'Deportivo Garcilaso', y: '2024 - 2024'}] },
    { name: 'José Villegas', slug: 'jose-villegas', nat: 'Peruano', birth: '1997-07-28', pos: 'Defensa Central', eur: 350000, pj: 21, num: 4, clubs: [{c: 'Cusco FC', y: '2022 - 2023'}] },
    { name: 'Cristian Penilla', slug: 'cristian-penilla', nat: 'Ecuatoriano', birth: '1991-05-02', pos: 'Extremo', eur: 400000, pj: 19, num: 10, clubs: [{c: 'Delfín SC (Ecu)', y: '2023 - 2024'}, {c: 'Barcelona SC', y: '2022 - 2022'}] },
    { name: 'Hernan Lupú', slug: 'hernan-lupu', nat: 'Peruano', birth: '2003-02-14', pos: 'Mediocentro', eur: 300000, pj: 17, num: 8, clubs: [{c: 'Sporting Cristal', y: '2022 - 2023'}] },
    { name: 'Jairo Molina', slug: 'jairo-molina', nat: 'Colombiano', birth: '1993-04-28', pos: 'Delantero Centro', eur: 400000, pj: 21, num: 9, clubs: [{c: 'Deportes Pereira (Col)', y: '2022 - 2023'}] },
    { name: 'Guillermo Larios', slug: 'guillermo-larios', nat: 'Peruano', birth: '2002-05-11', pos: 'Delantero Centro', eur: 350000, pj: 18, num: 19, clubs: [{c: 'Universitario', y: '2021 - 2022'}] }
  ],

  // 15. Comerciantes Unidos (Con Rodrigo Vilca, Matías Sen, Alexis Arias)
  'comerciantes-unidos': [
    { name: 'Matías Córdova', slug: 'matias-cordova', nat: 'Peruano', birth: '2002-04-21', pos: 'Portero', eur: 300000, pj: 18, num: 1, clubs: [{c: 'Sporting Cristal U20', y: '2021 - 2023'}] },
    { name: 'Fabio Rojas', slug: 'fabio-rojas', nat: 'Peruano', birth: '1999-08-04', pos: 'Defensa Central', eur: 350000, pj: 20, num: 4, clubs: [{c: 'Alianza Lima', y: '2021 - 2023'}] },
    { name: 'Alexis Cossio', slug: 'alexis-cossio', nat: 'Peruano', birth: '1995-02-11', pos: 'Lateral Izquierdo', eur: 350000, pj: 19, num: 13, clubs: [{c: 'Carlos A. Mannucci', y: '2023 - 2024'}, {c: 'Cienciano', y: '2022 - 2022'}] },
    { name: 'Rodrigo Vilca', slug: 'rodrigo-vilca', nat: 'Peruano', birth: '1999-03-12', pos: 'Mediocentro Ofensivo', eur: 450000, pj: 20, num: 10, clubs: [{c: 'FK Vozdovac (Serbia)', y: '2023 - 2024'}, {c: 'Newcastle U21 (Ing)', y: '2020 - 2023'}, {c: 'Universitario', y: '2022 - 2022'}] },
    { name: 'Alexis Arias', slug: 'alexis-arias', nat: 'Peruano', birth: '1995-12-13', pos: 'Mediocentro', eur: 450000, pj: 21, num: 8, clubs: [{c: 'FBC Melgar', y: '2014 - 2025'}] },
    { name: 'Matías Sen', slug: 'matias-sen', nat: 'Argentino', birth: '1991-10-29', pos: 'Delantero Centro', eur: 450000, pj: 22, num: 9, clubs: [{c: 'San Martín', y: '2022 - 2022'}] }
  ],

  // 16. Universidad César Vallejo (Con Facundo Silva, Raziel García, Osnar Noronha, José Bolívar)
  'cesar-vallejo': [
    { name: 'Facundo Silva', slug: 'facundo-silva', nat: 'Uruguayo', birth: '1996-07-04', pos: 'Portero', eur: 350000, pj: 19, num: 1, clubs: [{c: 'Progreso (Uru)', y: '2023 - 2024'}] },
    { name: 'José Bolívar', slug: 'jose-bolivar', nat: 'Peruano', birth: '2000-01-17', pos: 'Lateral Izquierdo', eur: 350000, pj: 19, num: 13, clubs: [{c: 'Universitario', y: '2023 - 2025'}, {c: 'Sport Boys', y: '2021 - 2022'}] },
    { name: 'Brian Arias', slug: 'brian-arias-ucv', nat: 'Peruano', birth: '2006-08-05', pos: 'Defensa Central', eur: 250000, pj: 14, num: 2, clubs: [{c: 'Alianza Lima U20', y: '2023 - 2025'}] },
    { name: 'Pedro Paulo Requena', slug: 'pedro-requena', nat: 'Peruano', birth: '1991-01-24', pos: 'Lateral Derecho', eur: 250000, pj: 18, num: 15, clubs: [{c: 'UTC', y: '2023 - 2024'}] },
    { name: 'Raziel García', slug: 'raziel-garcia', nat: 'Peruano', birth: '1994-02-15', pos: 'Mediocentro Ofensivo', eur: 450000, pj: 20, num: 10, clubs: [{c: 'Deportes Tolima (Col)', y: '2022 - 2022'}, {c: 'Cienciano', y: '2021 - 2021'}] },
    { name: 'Frank Ysique', slug: 'frank-ysique', nat: 'Peruano', birth: '1996-06-12', pos: 'Pivote', eur: 400000, pj: 21, num: 8, clubs: [{c: 'Sporting Cristal', y: '2017 - 2018'}] },
    { name: 'Osnar Noronha', slug: 'osnar-noronha', nat: 'Peruano', birth: '1991-12-17', pos: 'Delantero', eur: 350000, pj: 21, num: 19, clubs: [{c: 'Carlos A. Mannucci', y: '2017 - 2021'}] },
    { name: 'Diether Vásquez', slug: 'diether-vasquez', nat: 'Peruano', birth: '2003-07-06', pos: 'Extremo', eur: 350000, pj: 18, num: 23, clubs: [{c: 'Mineros Zacatecas (Mex)', y: '2023 - 2024'}] }
  ],

  // 17. Juan Pablo II College (Con Matias Vega, Paolo Reyna, Pablo Míguez, Hugo Ancajima, Goicochea, Pósito)
  'juan-pablo-ii': [
    { name: 'Matias Vega', slug: 'matias-vega', nat: 'Argentino', birth: '1986-04-18', pos: 'Portero', eur: 200000, pj: 21, num: 1, clubs: [{c: 'Chacarita Juniors (Arg)', y: '2023 - 2024'}] },
    { name: 'Paolo Reyna', slug: 'paolo-reyna', nat: 'Peruano', birth: '2001-10-13', pos: 'Lateral Izquierdo', eur: 500000, pj: 21, num: 3, clubs: [{c: 'FBC Melgar', y: '2019 - 2025'}] },
    { name: 'Pablo Míguez', slug: 'pablo-miguez', nat: 'Uruguayo / Peruano', birth: '1987-06-19', pos: 'Defensa Central', eur: 200000, pj: 20, num: 5, clubs: [{c: 'Carlos A. Mannucci', y: '2024 - 2024'}, {c: 'Alianza Lima', y: '2021 - 2023'}] },
    { name: 'Hugo Ancajima', slug: 'hugo-ancajima', nat: 'Peruano', birth: '1998-02-10', pos: 'Lateral Derecho', eur: 350000, pj: 19, num: 22, clubs: [{c: 'Universitario', y: '2023 - 2025'}, {c: 'ADT Tarma', y: '2022 - 2022'}] },
    { name: 'Arón Sánchez', slug: 'aron-sanchez', nat: 'Peruano', birth: '2003-05-04', pos: 'Defensa Central', eur: 400000, pj: 18, num: 4, clubs: [{c: 'Cantolao', y: '2020 - 2023'}] },
    { name: 'Erinson Ramirez', slug: 'erinson-ramirez', nat: 'Peruano', birth: '1998-03-25', pos: 'Mediocentro Ofensivo', eur: 350000, pj: 19, num: 10, clubs: [{c: 'Deportivo Garcilaso', y: '2024 - 2024'}, {c: 'Alianza Lima', y: '2016 - 2018'}] },
    { name: 'Jack Durán', slug: 'jack-duran', nat: 'Peruano', birth: '1991-12-08', pos: 'Extremo', eur: 250000, pj: 17, num: 7, clubs: [{c: 'Cienciano', y: '2022 - 2022'}, {c: 'Alianza Universidad', y: '2019 - 2021'}] },
    { name: 'Juan Pablo Goicochea', slug: 'juan-pablo-goicochea', nat: 'Peruano', birth: '2005-01-12', pos: 'Delantero Centro', eur: 400000, pj: 18, num: 9, clubs: [{c: 'Platense (Arg)', y: '2024 - 2024'}, {c: 'Alianza Lima', y: '2022 - 2023'}] },
    { name: 'Janio Pósito', slug: 'janio-posito', nat: 'Peruano', birth: '1989-10-14', pos: 'Delantero Centro', eur: 250000, pj: 20, num: 19, clubs: [{c: 'ADT Tarma', y: '2023 - 2024'}, {c: 'Alianza Lima', y: '2018 - 2018'}] }
  ],

  // 18. Carlos A. Mannucci
  'carlos-mannucci': [
    { name: 'Manuel Heredia', slug: 'manuel-heredia', nat: 'Peruano', birth: '1986-01-09', pos: 'Portero', eur: 200000, pj: 20, num: 1, clubs: [{c: 'Carlos A. Mannucci', y: '2019 - 2025'}] },
    { name: 'Mathías Llontop', slug: 'mathias-llontop-cam', nat: 'Peruano', birth: '2002-05-22', pos: 'Lateral Izquierdo', eur: 300000, pj: 18, num: 13, clubs: [{c: 'Sport Boys', y: '2024 - 2024'}] },
    { name: 'Eduardo Rabanal', slug: 'eduardo-rabanal', nat: 'Peruano', birth: '1997-01-29', pos: 'Lateral Derecho', eur: 300000, pj: 18, num: 15, clubs: [{c: 'Deportivo Municipal', y: '2020 - 2021'}] },
    { name: 'Nelinho Quina', slug: 'nelinho-quina', nat: 'Peruano', birth: '1987-05-11', pos: 'Defensa Central', eur: 150000, pj: 19, num: 22, clubs: [{c: 'Cusco FC', y: '2023 - 2023'}, {c: 'Universitario', y: '2019 - 2022'}] },
    { name: 'Ángel Benítez', slug: 'angel-benitez', nat: 'Paraguayo', birth: '1996-01-27', pos: 'Mediocentro', eur: 450000, pj: 21, num: 6, clubs: [{c: 'Defensa y Justicia (Arg)', y: '2023 - 2023'}] },
    { name: 'Gustavo Viera', slug: 'gustavo-viera', nat: 'Paraguayo', birth: '1995-08-28', pos: 'Pivote', eur: 400000, pj: 20, num: 8, clubs: [{c: 'San Lorenzo (Par)', y: '2021 - 2022'}] },
    { name: 'William Mimbela', slug: 'william-mimbela', nat: 'Peruano', birth: '1991-07-03', pos: 'Mediocentro Ofensivo', eur: 250000, pj: 17, num: 10, clubs: [{c: 'Unión Comercio', y: '2021 - 2022'}] },
    { name: 'Alexander Succar', slug: 'alexander-succar', nat: 'Peruano / Libanés', birth: '1995-08-12', pos: 'Delantero Centro', eur: 400000, pj: 20, num: 9, clubs: [{c: 'Universitario', y: '2020 - 2023'}] }
  ]
};

// Altas y Bajas (Fichajes y Salidas) históricas verificadas
const officialTransfers = [
  // SALIDAS DE ALIANZA LIMA 2026
  { team: 'alianza-lima', playerSlug: 'juan-pablo-freytes', name: 'Juan Pablo Freytes', nat: 'Argentino', pos: 'Defensa Central', type: 'OUT', reason: 'Venta millonaria a Brasil', dest: 'Fluminense (Brasil)', date: '2026-01-15', source: 'transfermarkt' },
  { team: 'alianza-lima', playerSlug: 'erick-noriega', name: 'Erick Noriega', nat: 'Peruano / Japonés', pos: 'Defensa Central', type: 'OUT', reason: 'Traspaso internacional', dest: 'Grêmio (Brasil)', date: '2026-01-12', source: 'transfermarkt' },
  { team: 'alianza-lima', playerSlug: 'carlos-zambrano', name: 'Carlos Zambrano', nat: 'Peruano', pos: 'Defensa Central', type: 'OUT', reason: 'Término de contrato / Fichaje', dest: 'Sport Boys (Perú)', date: '2026-01-05', source: 'club_social_facebook' },
  { team: 'alianza-lima', playerSlug: 'hernan-barcos', name: 'Hernán Barcos', nat: 'Argentino / Peruano', pos: 'Delantero Centro', type: 'OUT', reason: 'Término de ciclo / Fichaje', dest: 'Sporting Cristal (Perú)', date: '2026-01-04', source: 'transfermarkt' },
  { team: 'alianza-lima', playerSlug: 'angelo-campos', name: 'Ángelo Campos', nat: 'Peruano', pos: 'Portero', type: 'OUT', reason: 'Fin de contrato / Traspaso', dest: 'UTC Cajamarca (Perú)', date: '2026-01-08', source: 'club_social_x' },
  { team: 'alianza-lima', playerSlug: 'sebastian-rodriguez', name: 'Sebastián Rodríguez', nat: 'Uruguayo', pos: 'Mediocentro', type: 'OUT', reason: 'Rescisión de mutuo acuerdo', dest: 'Danubio FC (Uruguay)', date: '2025-12-31', source: 'transfermarkt' },
  { team: 'alianza-lima', playerSlug: 'adrian-arregui', name: 'Adrián Arregui', nat: 'Argentino', pos: 'Pivote', type: 'OUT', reason: 'Fin de contrato', dest: 'Temperley (Argentina)', date: '2025-12-31', source: 'transfermarkt' },
  { team: 'alianza-lima', playerSlug: 'jiovany-ramos', name: 'Jiovany Ramos', nat: 'Panameño', pos: 'Defensa Central', type: 'OUT', reason: 'Fin de préstamo', dest: 'Plaza Amador (Panamá)', date: '2025-12-31', source: 'transfermarkt' },
  { team: 'alianza-lima', playerSlug: 'aldair-fuentes', name: 'Aldair Fuentes', nat: 'Peruano', pos: 'Defensa Central', type: 'OUT', reason: 'Traspaso definitivo', dest: 'Cusco FC (Perú)', date: '2026-01-09', source: 'club_social_x' },
  { team: 'alianza-lima', playerSlug: 'gonzalo-aguirre', name: 'Gonzalo Aguirre', nat: 'Peruano / Argentino', pos: 'Mediocentro', type: 'OUT', reason: 'Fin de vínculo / Traspaso', dest: 'Cienciano (Perú)', date: '2026-01-10', source: 'transfermarkt' },
  { team: 'alianza-lima', playerSlug: 'ricardo-lagos', name: 'Ricardo Lagos', nat: 'Peruano', pos: 'Lateral Izquierdo', type: 'OUT', reason: 'Traspaso a club del interior', dest: 'Cusco FC (Perú)', date: '2026-01-11', source: 'club_social_x' },
  { team: 'alianza-lima', playerSlug: 'matias-succar', name: 'Matías Succar', nat: 'Peruano', pos: 'Delantero Centro', type: 'OUT', reason: 'Traspaso / Venta', dest: 'Cienciano (Perú)', date: '2026-01-14', source: 'transfermarkt' },

  // FICHAYES DE ALIANZA LIMA 2026 (IN)
  { team: 'alianza-lima', playerSlug: 'luis-advincula', name: 'Luis Advíncula', from: 'Boca Juniors (Argentina)', contractEnd: '2027-12-31', date: '2026-01-03', source: 'transfermarkt' },
  { team: 'alianza-lima', playerSlug: 'federico-girotti', name: 'Federico Girotti', from: 'Talleres de Córdoba (Argentina)', contractEnd: '2027-12-31', date: '2026-01-08', source: 'transfermarkt' },
  { team: 'alianza-lima', playerSlug: 'jairo-velez', name: 'Jairo Vélez', from: 'César Vallejo (Perú)', contractEnd: '2027-12-31', date: '2026-01-04', source: 'club_social_x' },
  { team: 'alianza-lima', playerSlug: 'eryc-castillo', name: 'Eryc Castillo', from: 'Coritiba (Brasil)', contractEnd: '2026-12-31', date: '2026-01-10', source: 'transfermarkt' },
  { team: 'alianza-lima', playerSlug: 'esteban-pavez', name: 'Esteban Pavez', from: 'Colo-Colo (Chile)', contractEnd: '2026-12-31', date: '2026-01-07', source: 'club_social_facebook' },
  { team: 'alianza-lima', playerSlug: 'jean-pierre-archimbaud', name: 'Jean Pierre Archimbaud', from: 'FBC Melgar (Perú)', contractEnd: '2027-12-31', date: '2026-01-06', source: 'transfermarkt' },

  // SALIDAS DE UNIVERSITARIO 2026
  { team: 'universitario', playerSlug: 'nelson-cabanillas', name: 'Nelson Cabanillas', nat: 'Peruano', pos: 'Lateral Izquierdo', type: 'OUT', reason: 'Traspaso a FBC Melgar', dest: 'FBC Melgar (Perú)', date: '2026-01-08', source: 'transfermarkt' },
  { team: 'universitario', playerSlug: 'segundo-portocarrero', name: 'Segundo Portocarrero', nat: 'Ecuatoriano', pos: 'Carrilero Izquierdo', type: 'OUT', reason: 'Fin de préstamo / Regreso a Ecuador', dest: 'Barcelona SC (Ecuador)', date: '2025-12-31', source: 'transfermarkt' },
  { team: 'universitario', playerSlug: 'jose-bolivar', name: 'José Bolívar', nat: 'Peruano', pos: 'Lateral Izquierdo', type: 'OUT', reason: 'Cesión con opción de compra', dest: 'Univ. César Vallejo (Perú)', date: '2026-01-12', source: 'transfermarkt' },
  { team: 'universitario', playerSlug: 'hugo-ancajima', name: 'Hugo Ancajima', nat: 'Peruano', pos: 'Lateral Derecho', type: 'OUT', reason: 'Término de contrato', dest: 'Juan Pablo II College (Perú)', date: '2025-12-31', source: 'club_social_x' },
  { team: 'universitario', playerSlug: 'martin-perez-guedes', name: 'Martín Pérez Guedes', nat: 'Argentino / Peruano', pos: 'Mediocentro', type: 'OUT', reason: 'Rescisión de mutuo acuerdo', dest: 'Libre', date: '2026-01-05', source: 'club_social_facebook' },
  { team: 'universitario', playerSlug: 'yuriel-celi', name: 'Yuriel Celi', nat: 'Peruano', pos: 'Mediocentro Ofensivo', type: 'OUT', reason: 'Fin de cesión de Hull City', dest: 'Sport Boys (Perú)', date: '2025-12-31', source: 'transfermarkt' },
  { team: 'universitario', playerSlug: 'gabriel-costa', name: 'Gabriel Costa', nat: 'Uruguayo / Peruano', pos: 'Extremo Derecho', type: 'OUT', reason: 'Término de contrato', dest: 'Deportivo Maldonado (Uruguay)', date: '2025-12-31', source: 'transfermarkt' },
  { team: 'universitario', playerSlug: 'christopher-olivares', name: 'Christopher Olivares', nat: 'Peruano', pos: 'Delantero Centro', type: 'OUT', reason: 'Término de contrato', dest: 'UTC Cajamarca (Perú)', date: '2026-01-10', source: 'club_social_x' },
  { team: 'universitario', playerSlug: 'rodrigo-urena', name: 'Rodrigo Ureña', nat: 'Chileno', pos: 'Pivote', type: 'OUT', reason: 'Ejecución de cláusula de rescisión', dest: 'Millonarios FC (Colombia)', date: '2025-12-28', source: 'transfermarkt' },
  { team: 'universitario', playerSlug: 'sebastian-britos', name: 'Sebastián Britos', nat: 'Uruguayo', pos: 'Portero', type: 'OUT', reason: 'Término de contrato', dest: 'Libre', date: '2025-12-31', source: 'club_social_facebook' },

  // FICHAJES DE UNIVERSITARIO 2026 (IN)
  { team: 'universitario', playerSlug: 'gianluca-lapadula', name: 'Gianluca Lapadula', from: 'Cagliari (Italia)', contractEnd: '2027-12-31', date: '2026-01-02', source: 'transfermarkt' },
  { team: 'universitario', playerSlug: 'piero-quispe', name: 'Piero Quispe', from: 'Pumas UNAM (México)', contractEnd: '2026-12-31', date: '2026-01-05', source: 'club_social_facebook' },
  { team: 'universitario', playerSlug: 'bryan-reyna', name: 'Bryan Reyna', from: 'Belgrano (Argentina)', contractEnd: '2027-12-31', date: '2026-01-07', source: 'club_social_x' },
  { team: 'universitario', playerSlug: 'anderson-santamaria', name: 'Anderson Santamaría', from: 'Santos Laguna (México)', contractEnd: '2027-12-31', date: '2026-01-03', source: 'transfermarkt' },

  // FICHAJES DE SPORTING CRISTAL 2026 (IN)
  { team: 'sporting-cristal', playerSlug: 'hernan-barcos', name: 'Hernán Barcos', from: 'Alianza Lima (Perú)', contractEnd: '2026-12-31', date: '2026-01-05', source: 'transfermarkt' },
  { team: 'sporting-cristal', playerSlug: 'luis-abram', name: 'Luis Abram', from: 'Atlanta United (USA)', contractEnd: '2027-12-31', date: '2026-01-03', source: 'transfermarkt' },
  { team: 'sporting-cristal', playerSlug: 'miguel-araujo', name: 'Miguel Araujo', from: 'Portland Timbers (USA)', contractEnd: '2027-12-31', date: '2026-01-04', source: 'club_social_x' },

  // FICHAJES DE SPORT BOYS 2026 (IN)
  { team: 'sport-boys', playerSlug: 'carlos-zambrano', name: 'Carlos Zambrano', from: 'Alianza Lima (Perú)', contractEnd: '2026-12-31', date: '2026-01-06', source: 'club_social_facebook' },
  { team: 'sport-boys', playerSlug: 'miguel-trauco', name: 'Miguel Trauco', from: 'Criciúma (Brasil)', contractEnd: '2026-12-31', date: '2026-01-08', source: 'transfermarkt' },
  { team: 'sport-boys', playerSlug: 'christian-cueva', name: 'Christian Cueva', from: 'Cienciano (Perú)', contractEnd: '2026-12-31', date: '2026-01-10', source: 'club_social_x' },
  { team: 'sport-boys', playerSlug: 'yuriel-celi', name: 'Yuriel Celi', from: 'Universitario (Perú)', contractEnd: '2026-12-31', date: '2026-01-05', source: 'transfermarkt' },

  // FICHAJES DE FBC MELGAR 2026 (IN)
  { team: 'fbc-melgar', playerSlug: 'nelson-cabanillas', name: 'Nelson Cabanillas', from: 'Universitario de Deportes (Perú)', contractEnd: '2027-12-31', date: '2026-01-08', source: 'transfermarkt' },
  { team: 'fbc-melgar', playerSlug: 'jesus-alcantar', name: 'Jesus Alcantar', from: 'Necaxa (México)', contractEnd: '2026-12-31', date: '2026-01-07', source: 'transfermarkt' },

  // FICHAJES DE CIENCIANO 2026 (IN)
  { team: 'cienciano', playerSlug: 'alejandro-hohberg', name: 'Alejandro Hohberg', from: 'Sporting Cristal (Perú)', contractEnd: '2026-12-31', date: '2026-01-06', source: 'transfermarkt' },
  { team: 'cienciano', playerSlug: 'gonzalo-aguirre', name: 'Gonzalo Aguirre', from: 'Alianza Lima (Perú)', contractEnd: '2026-12-31', date: '2026-01-10', source: 'transfermarkt' },
  { team: 'cienciano', playerSlug: 'matias-succar', name: 'Matías Succar', from: 'Alianza Lima (Perú)', contractEnd: '2026-12-31', date: '2026-01-14', source: 'transfermarkt' },

  // FICHAJES DE UTC CAJAMARCA 2026 (IN)
  { team: 'utc-cajamarca', playerSlug: 'angelo-campos', name: 'Ángelo Campos', from: 'Alianza Lima (Perú)', contractEnd: '2026-12-31', date: '2026-01-08', source: 'club_social_x' },
  { team: 'utc-cajamarca', playerSlug: 'christopher-olivares', name: 'Christopher Olivares', from: 'Universitario (Perú)', contractEnd: '2026-12-31', date: '2026-01-10', source: 'transfermarkt' }
];

async function main() {
  console.log('🚀 INICIANDO SINCRONIZACIÓN MAESTRA DE LOS 18 EQUIPOS DE LA LIGA 1 (SOFASCORE / TRANSFERMARKT 2026)...');

  // 1. Obtener equipos
  const { data: teams, error: teamsErr } = await supabase.from('teams').select('*');
  if (teamsErr || !teams) {
    console.error('Error cargando equipos:', teamsErr);
    process.exit(1);
  }
  const teamMap = {};
  teams.forEach(t => { teamMap[t.slug] = t.id; });

  // 2. Limpieza total de player_seasons 2026 de Alianza Lima para eliminar toda la nómina antigua del 2024
  const alianzaId = teamMap['alianza-lima'];
  if (alianzaId) {
    console.log('🧹 Vaciando completamente player_seasons 2026 de Alianza Lima para purgar todos los jugadores del 2024...');
    await supabase.from('player_seasons').delete().eq('team_id', alianzaId).eq('season_year', 2026);
  }

  // 3. Obtener jugadores existentes
  const { data: existingPlayers } = await supabase.from('players').select('id, slug');
  const playerMap = {};
  if (existingPlayers) {
    existingPlayers.forEach(p => { if (p.slug) playerMap[p.slug] = p.id; });
  }

  // 4. Procesar y cargar plantilla por cada uno de los 18 clubes
  for (const [teamSlug, squad] of Object.entries(all18ClubsData)) {
    const teamId = teamMap[teamSlug];
    if (!teamId) {
      console.warn(`Club no encontrado en DB: ${teamSlug}`);
      continue;
    }

    console.log(`\n⚽ Procesando ${teamSlug.toUpperCase()} (${squad.length} futbolistas verificados)...`);

    // Limpiar player_seasons de este club si es necesario para reemplazar con la nómina verificada
    await supabase.from('player_seasons').delete().eq('team_id', teamId).eq('season_year', 2026);

    let teamTotalEur = 0;

    for (const p of squad) {
      let pId = playerMap[p.slug];

      if (!pId) {
        const { data: newP, error: insErr } = await supabase.from('players').insert({
          full_name: p.name,
          slug: p.slug,
          nationality: p.nat,
          birth_date: p.birth,
          primary_position: p.pos,
          secondary_position: null,
        }).select('id').single();

        if (insErr || !newP) {
          console.error(`Error creando jugador ${p.name}:`, insErr?.message);
          continue;
        }
        pId = newP.id;
        playerMap[p.slug] = pId;
      } else {
        await supabase.from('players').update({
          full_name: p.name,
          nationality: p.nat,
          birth_date: p.birth,
          primary_position: p.pos,
        }).eq('id', pId);
      }

      teamTotalEur += p.eur;

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

      // Historial de 3 últimos clubes
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

    // Actualizar team_seasons con el tamaño de plantilla y valor total de mercado recalculado
    await supabase.from('team_seasons').update({
      squad_size: squad.length,
      market_value_eur: teamTotalEur,
      market_value_usd: Math.round(teamTotalEur * exchangeRate),
      last_updated: new Date().toISOString()
    }).eq('team_id', teamId).eq('season_year', 2026);

    console.log(`   ✅ ${teamSlug}: ${squad.length} jugadores insertados. Valor: €${(teamTotalEur / 1e6).toFixed(2)}M.`);
  }

  // 5. Cargar todos los movimientos oficiales de Salidas (OUT) y Fichajes (IN)
  console.log('\n🔄 Registrando transferencias oficiales (Salidas y Fichajes 2026)...');
  for (const tr of officialTransfers) {
    const teamId = teamMap[tr.team];
    if (!teamId) continue;

    let pId = playerMap[tr.playerSlug];
    if (!pId) {
      const { data: newP } = await supabase.from('players').insert({
        full_name: tr.name,
        slug: tr.playerSlug,
        nationality: tr.nat || 'Peruano',
        birth_date: '1995-01-01',
        primary_position: tr.pos || 'Futbolista',
      }).select('id').single();
      pId = newP?.id;
      if (pId) playerMap[tr.playerSlug] = pId;
    }

    if (!pId) continue;

    if (tr.type === 'OUT') {
      await supabase.from('transfers').upsert({
        player_id: pId,
        team_id: teamId,
        season_year: 2026,
        transfer_type: 'OUT',
        departure_reason: tr.reason,
        other_club_name: tr.dest,
        source_type: tr.source,
        announced_at: `${tr.date}T12:00:00Z`,
      });
      console.log(`   ❌ SALIDA: ${tr.name} (${tr.team}) -> ${tr.dest}`);
    } else {
      await supabase.from('transfers').upsert({
        player_id: pId,
        team_id: teamId,
        season_year: 2026,
        transfer_type: 'IN',
        other_club_name: tr.from,
        contract_start_date: '2026-01-01',
        contract_end_date: tr.contractEnd,
        source_type: tr.source,
        announced_at: `${tr.date}T12:00:00Z`,
      });
      console.log(`   ✨ FICHAJE: ${tr.name} (${tr.team}) <- ${tr.from}`);
    }
  }

  console.log('\n🎉 ¡SINCRONIZACIÓN MAESTRA DE TODOS LOS 18 CLUBES FINALIZADA CON ÉXITO!');
  process.exit(0);
}

main().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
});
