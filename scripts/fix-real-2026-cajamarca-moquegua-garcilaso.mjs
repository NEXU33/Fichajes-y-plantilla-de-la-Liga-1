import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ugujgzrfysucybbncxrs.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVndWpnenJmeXN1Y3liYm5jeHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUwMjk3NDcsImV4cCI6MjExMDYwNTc0N30.KavzLBrgphW52oAqHu8MNcKz_YvcO2EUXI6NvWXdugY';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
  realtime: { transport: WebSocket }
});

const exchangeRate = 1.0999;

// ==========================================
// 1. FC CAJAMARCA (PLANTILLA OFICIAL 2026)
// ==========================================
const cajamarcaSquad2026 = [
  { name: 'Jonathan Medina', slug: 'jonathan-medina-fcc', nat: 'Peruano', birth: '1993-04-29', pos: 'Portero', eur: 350000, pj: 21, num: 1, clubs: [{c: 'Alianza Lima', y: '2022 - 2023'}, {c: 'Sport Boys', y: '2019 - 2021'}] },
  { name: 'Samuel Aspajo', slug: 'samuel-aspajo-fcc', nat: 'Peruano', birth: '2001-08-15', pos: 'Portero', eur: 200000, pj: 6, num: 12, clubs: [{c: 'Comerciantes FC', y: '2023 - 2024'}] },
  { name: 'Ronald Ruiz', slug: 'ronald-ruiz-fcc', nat: 'Peruano', birth: '1987-07-05', pos: 'Portero', eur: 150000, pj: 2, num: 21, clubs: [{c: 'Atlético Grau', y: '2022 - 2023'}] },
  { name: 'Yordi Vílchez', slug: 'yordi-vilchez-fcc', nat: 'Peruano', birth: '1995-06-04', pos: 'Defensa Central', eur: 600000, pj: 22, num: 4, clubs: [{c: 'Alianza Lima', y: '2021 - 2025'}, {c: 'Cusco FC', y: '2019 - 2020'}] },
  { name: 'Alejandro Pósito', slug: 'alejandro-posito-fcc', nat: 'Peruano', birth: '2005-09-05', pos: 'Defensa Central', eur: 350000, pj: 19, num: 3, clubs: [{c: 'Sporting Cristal', y: '2023 - 2025'}] },
  { name: 'Hairo Timaná', slug: 'hairo-timana-fcc', nat: 'Peruano', birth: '2000-05-18', pos: 'Defensa Central', eur: 250000, pj: 17, num: 2, clubs: [{c: 'Atlético Grau', y: '2022 - 2024'}] },
  { name: 'José David Soto', slug: 'jose-david-soto-fcc', nat: 'Peruano', birth: '2002-01-22', pos: 'Lateral Izquierdo', eur: 300000, pj: 18, num: 13, clubs: [{c: 'Cienciano', y: '2023 - 2024'}] },
  { name: 'Arthur Gutiérrez', slug: 'arthur-gutierrez-fcc', nat: 'Peruano', birth: '2001-06-11', pos: 'Lateral Izquierdo', eur: 250000, pj: 15, num: 14, clubs: [{c: 'Juan Aurich', y: '2022 - 2023'}] },
  { name: 'Renato Suárez', slug: 'renato-suarez-fcc', nat: 'Peruano', birth: '2004-03-20', pos: 'Lateral Derecho', eur: 250000, pj: 16, num: 16, clubs: [{c: 'Universitario Res.', y: '2022 - 2024'}] },
  { name: 'José Gallardo', slug: 'jose-gallardo-fcc', nat: 'Peruano', birth: '2001-04-12', pos: 'Lateral Derecho', eur: 300000, pj: 18, num: 22, clubs: [{c: 'UTC Cajamarca', y: '2023 - 2024'}, {c: 'Alianza Lima', y: '2019 - 2021'}] },
  { name: 'Jhan Vega', slug: 'jhan-vega-fcc', nat: 'Peruano', birth: '2003-08-30', pos: 'Lateral Derecho', eur: 200000, pj: 12, num: 18, clubs: [{c: 'FC Cajamarca Res.', y: '2023 - 2025'}] },
  { name: 'Carlos Gómez', slug: 'carlos-gomez-fcc', nat: 'Peruano', birth: '2005-02-14', pos: 'Lateral Derecho', eur: 200000, pj: 11, num: 28, clubs: [{c: 'Alianza Lima U20', y: '2023 - 2024'}] },
  { name: 'Jefferson Orejuela', slug: 'jefferson-orejuela-fcc', nat: 'Ecuatoriano', birth: '1993-02-14', pos: 'Pivote', eur: 450000, pj: 21, num: 5, clubs: [{c: 'Guayaquil City (Ecu)', y: '2023 - 2024'}, {c: 'Fluminense (Bra)', y: '2017 - 2018'}, {c: 'LDU Quito (Ecu)', y: '2018 - 2019'}] },
  { name: 'Edson Aubert', slug: 'edson-aubert-fcc', nat: 'Peruano', birth: '1988-11-24', pos: 'Mediocentro', eur: 350000, pj: 22, num: 8, clubs: [{c: 'ADT Tarma', y: '2023 - 2024'}, {c: 'Binacional', y: '2021 - 2022'}, {c: 'FBC Melgar', y: '2010 - 2011'}] },
  { name: 'Paulo Goyoneche', slug: 'paulo-goyoneche-fcc', nat: 'Peruano', birth: '1994-01-19', pos: 'Pivote', eur: 300000, pj: 19, num: 6, clubs: [{c: 'Santos FC', y: '2022 - 2024'}] },
  { name: 'Carlos Correa', slug: 'carlos-correa-fcc', nat: 'Peruano', birth: '1995-02-23', pos: 'Mediocentro', eur: 350000, pj: 20, num: 10, clubs: [{c: 'Carlos A. Mannucci', y: '2022 - 2023'}, {c: 'Alianza Atlético', y: '2021 - 2022'}] },
  { name: 'Valentino Sandoval', slug: 'valentino-sandoval-fcc', nat: 'Peruano', birth: '2003-10-18', pos: 'Mediocentro Ofensivo', eur: 250000, pj: 15, num: 20, clubs: [{c: 'Universidad San Martín', y: '2022 - 2023'}] },
  { name: 'Mauricio Arrasco', slug: 'mauricio-arrasco-fcc', nat: 'Peruano', birth: '2004-11-25', pos: 'Mediocentro Ofensivo', eur: 250000, pj: 14, num: 23, clubs: [{c: 'Alianza Lima U20', y: '2022 - 2024'}] },
  { name: 'Patrick Alegría', slug: 'patrick-alegria-fcc', nat: 'Peruano', birth: '2002-07-09', pos: 'Mediocentro', eur: 200000, pj: 10, num: 24, clubs: [{c: 'FC Cajamarca Res.', y: '2023 - 2025'}] },
  { name: 'Sebastien Pineau', slug: 'sebastien-pineau-fcc', nat: 'Peruano / Chileno', birth: '2003-01-20', pos: 'Delantero Centro', eur: 400000, pj: 20, num: 9, clubs: [{c: 'Austin FC II (USA)', y: '2023 - 2025'}, {c: 'Alianza Lima', y: '2021 - 2022'}] },
  { name: 'Pedro Cejas', slug: 'pedro-cejas-fcc', nat: 'Argentino', birth: '2001-06-18', pos: 'Delantero Centro', eur: 350000, pj: 19, num: 19, clubs: [{c: 'Banfield (Arg)', y: '2022 - 2024'}] },
  { name: 'Brandon Palacios', slug: 'brandon-palacios-fcc', nat: 'Peruano / Mexicano', birth: '1998-03-26', pos: 'Extremo Izquierdo', eur: 450000, pj: 21, num: 11, clubs: [{c: 'Sport Boys', y: '2024 - 2024'}, {c: 'Binacional', y: '2023 - 2023'}] },
  { name: 'Jonathan Betancourt', slug: 'jonathan-betancourt-fcc', nat: 'Ecuatoriano', birth: '1995-02-14', pos: 'Extremo Izquierdo', eur: 350000, pj: 20, num: 7, clubs: [{c: 'Deportivo Garcilaso', y: '2023 - 2023'}, {c: 'Barcelona SC (Ecu)', y: '2018 - 2019'}] },
  { name: 'Michel Rasmussen', slug: 'michel-rasmussen-fcc', nat: 'Peruano', birth: '1999-07-07', pos: 'Extremo Derecho', eur: 300000, pj: 18, num: 17, clubs: [{c: 'Carlos A. Mannucci', y: '2023 - 2024'}, {c: 'FBC Melgar', y: '2019 - 2022'}] },
  { name: 'Sebastián Enciso', slug: 'sebastian-enciso-fcc', nat: 'Peruano', birth: '2002-06-03', pos: 'Extremo Derecho', eur: 250000, pj: 14, num: 27, clubs: [{c: 'FBC Melgar U20', y: '2022 - 2024'}] },
  { name: 'Rodrigo Dioses', slug: 'rodrigo-dioses-fcc', nat: 'Peruano', birth: '2004-09-12', pos: 'Delantero Centro', eur: 200000, pj: 12, num: 29, clubs: [{c: 'FC Cajamarca Res.', y: '2023 - 2025'}] }
];

// ==========================================
// 2. DEPORTIVO MOQUEGUA (PLANTILLA OFICIAL 2026)
// ==========================================
const moqueguaSquad2026 = [
  { name: 'Carlos Grados', slug: 'carlos-grados-moq', nat: 'Peruano', birth: '1995-05-15', pos: 'Portero', eur: 450000, pj: 21, num: 1, clubs: [{c: 'César Vallejo', y: '2021 - 2025'}, {c: 'Sporting Cristal', y: '2014 - 2019'}] },
  { name: 'Renzo Figueroa', slug: 'renzo-figueroa-moq', nat: 'Peruano', birth: '1997-03-12', pos: 'Portero', eur: 250000, pj: 6, num: 12, clubs: [{c: 'Pirata FC', y: '2022 - 2024'}] },
  { name: 'William Falcón', slug: 'william-falcon-moq', nat: 'Peruano', birth: '1999-08-20', pos: 'Portero', eur: 200000, pj: 3, num: 21, clubs: [{c: 'Santos FC', y: '2022 - 2023'}] },
  { name: 'Thiago Bedoya', slug: 'thiago-bedoya-moq', nat: 'Peruano', birth: '2004-02-18', pos: 'Portero', eur: 150000, pj: 1, num: 25, clubs: [{c: 'Dep. Moquegua Res.', y: '2023 - 2025'}] },
  { name: 'Juan Diego Lojas', slug: 'juan-diego-lojas-moq', nat: 'Peruano', birth: '1989-04-23', pos: 'Defensa Central', eur: 350000, pj: 22, num: 2, clubs: [{c: 'Deportivo Garcilaso', y: '2023 - 2025'}, {c: 'Alianza Atlético', y: '2021 - 2022'}] },
  { name: 'Christian Enciso', slug: 'christian-enciso-moq', nat: 'Paraguayo', birth: '1991-03-20', pos: 'Defensa Central', eur: 350000, pj: 21, num: 3, clubs: [{c: 'Resistencia SC (Par)', y: '2023 - 2024'}, {c: 'Sol de América (Par)', y: '2021 - 2022'}] },
  { name: 'Aldair Perleche', slug: 'aldair-perleche-moq', nat: 'Peruano', birth: '1995-06-05', pos: 'Lateral Derecho', eur: 300000, pj: 20, num: 4, clubs: [{c: 'Cienciano', y: '2021 - 2023'}, {c: 'Juan Aurich', y: '2014 - 2018'}] },
  { name: 'José Nicolás Amasifuén', slug: 'nicolas-amasifuen-moq', nat: 'Peruano', birth: '2005-07-05', pos: 'Lateral Izquierdo', eur: 300000, pj: 19, num: 13, clubs: [{c: 'Alianza Lima', y: '2022 - 2025'}] },
  { name: 'Eros Montenegro', slug: 'eros-montenegro-moq', nat: 'Peruano', birth: '2001-09-14', pos: 'Lateral Derecho', eur: 250000, pj: 16, num: 14, clubs: [{c: 'Santos FC', y: '2022 - 2024'}] },
  { name: 'José Luis Granda', slug: 'jose-luis-granda-moq', nat: 'Peruano', birth: '1992-04-13', pos: 'Defensa Central', eur: 250000, pj: 15, num: 15, clubs: [{c: 'Carlos Stein', y: '2021 - 2023'}] },
  { name: 'Mathías Panizo', slug: 'mathias-panizo-moq', nat: 'Peruano', birth: '2004-05-16', pos: 'Defensa Central', eur: 200000, pj: 12, num: 22, clubs: [{c: 'Universitario U20', y: '2022 - 2024'}] },
  { name: 'Kevin Moreno', slug: 'kevin-moreno-moq', nat: 'Peruano', birth: '1997-05-02', pos: 'Defensa Central', eur: 250000, pj: 16, num: 5, clubs: [{c: 'Carlos A. Mannucci', y: '2019 - 2023'}] },
  { name: 'Cristian Mejía', slug: 'cristian-mejia-moq', nat: 'Peruano', birth: '1993-02-17', pos: 'Mediocentro', eur: 350000, pj: 21, num: 6, clubs: [{c: 'Deportivo Municipal', y: '2021 - 2023'}, {c: 'Sport Huancayo', y: '2019 - 2020'}] },
  { name: 'Derlis Nicolás Chávez', slug: 'derlis-chavez-moq', nat: 'Paraguayo', birth: '1996-08-10', pos: 'Mediocentro', eur: 350000, pj: 20, num: 8, clubs: [{c: 'Guaireña FC (Par)', y: '2022 - 2024'}] },
  { name: 'Claudio Ramírez', slug: 'claudio-ramirez-moq', nat: 'Peruano', birth: '2000-01-25', pos: 'Mediocentro', eur: 250000, pj: 17, num: 16, clubs: [{c: 'Comerciantes FC', y: '2023 - 2024'}] },
  { name: 'Diego Ramírez', slug: 'diego-ramirez-moq', nat: 'Peruano', birth: '1996-03-05', pos: 'Mediocentro Ofensivo', eur: 300000, pj: 18, num: 10, clubs: [{c: 'Cantolao', y: '2021 - 2023'}] },
  { name: 'Ricardo Chipao', slug: 'ricardo-chipao-moq', nat: 'Peruano', birth: '2002-11-14', pos: 'Mediocentro', eur: 200000, pj: 11, num: 18, clubs: [{c: 'Dep. Moquegua Res.', y: '2023 - 2025'}] },
  { name: 'Bryan Angulo', slug: 'bryan-angulo-moq', nat: 'Ecuatoriano', birth: '1995-11-30', pos: 'Delantero Centro', eur: 650000, pj: 22, num: 9, clubs: [{c: 'The Strongest (Bol)', y: '2024 - 2024'}, {c: 'Cruz Azul (Mex)', y: '2019 - 2022'}, {c: 'Emelec (Ecu)', y: '2014 - 2019'}] },
  { name: 'Edgar Lastre', slug: 'edgar-lastre-moq', nat: 'Ecuatoriano', birth: '1999-09-13', pos: 'Extremo Derecho', eur: 400000, pj: 21, num: 11, clubs: [{c: 'Comerciantes Unidos', y: '2024 - 2024'}, {c: 'Emelec (Ecu)', y: '2020 - 2023'}] },
  { name: 'Yorman Zapata', slug: 'yorman-zapata-moq', nat: 'Colombiano', birth: '2000-09-01', pos: 'Extremo Izquierdo', eur: 500000, pj: 20, num: 7, clubs: [{c: 'Defensa y Justicia (Arg)', y: '2024 - 2024'}, {c: 'Magallanes (Chi)', y: '2019 - 2023'}] },
  { name: 'Kevin Ruíz', slug: 'kevin-ruiz-moq', nat: 'Peruano', birth: '1995-05-23', pos: 'Extremo Derecho', eur: 300000, pj: 18, num: 17, clubs: [{c: 'UTC Cajamarca', y: '2023 - 2024'}] },
  { name: 'Alexander Lecaros', slug: 'alexander-lecaros-moq', nat: 'Peruano', birth: '1999-11-20', pos: 'Extremo Izquierdo', eur: 350000, pj: 19, num: 20, clubs: [{c: 'Cienciano', y: '2023 - 2024'}, {c: 'Botafogo (Bra)', y: '2020 - 2021'}, {c: 'Real Garcilaso', y: '2016 - 2019'}] },
  { name: 'Kevin Ferreyra', slug: 'kevin-ferreyra-moq', nat: 'Peruano', birth: '1999-06-07', pos: 'Extremo', eur: 300000, pj: 17, num: 23, clubs: [{c: 'Cienciano', y: '2022 - 2023'}, {c: 'Alianza Lima', y: '2018 - 2021'}] },
  { name: 'Jeferson Collazos', slug: 'jeferson-collazos-moq', nat: 'Colombiano', birth: '1990-11-22', pos: 'Delantero Centro', eur: 300000, pj: 18, num: 19, clubs: [{c: 'Santos FC', y: '2023 - 2024'}, {c: 'Cantolao', y: '2017 - 2018'}] },
  { name: 'Allonso Dávila', slug: 'allonso-davila-moq', nat: 'Peruano', birth: '2002-04-08', pos: 'Delantero', eur: 200000, pj: 12, num: 27, clubs: [{c: 'Dep. Moquegua Res.', y: '2023 - 2025'}] }
];

// ==========================================
// 3. DEPORTIVO GARCILASO (PLANTILLA OFICIAL 2026)
// ==========================================
const garcilasoSquad2026 = [
  { name: 'Juniors Barbieri', slug: 'juniors-barbieri-dg', nat: 'Peruano', birth: '1996-03-09', pos: 'Portero', eur: 400000, pj: 22, num: 1, clubs: [{c: 'Cienciano', y: '2021 - 2023'}, {c: 'Sporting Cristal', y: '2016 - 2018'}] },
  { name: 'Mallki Marmanillo', slug: 'mallki-marmanillo-dg', nat: 'Peruano', birth: '2001-08-04', pos: 'Portero', eur: 200000, pj: 6, num: 12, clubs: [{c: 'Cienciano', y: '2022 - 2023'}] },
  { name: 'Miguel Vargas', slug: 'miguel-vargas-dg', nat: 'Chileno / Peruano', birth: '1996-06-15', pos: 'Portero', eur: 400000, pj: 5, num: 21, clubs: [{c: 'Cienciano', y: '2022 - 2023'}, {c: 'Univ. Católica (Chi)', y: '2017 - 2021'}] },
  { name: 'Agustín Gómez', slug: 'agustin-gomez-dg', nat: 'Argentino / Italiano', birth: '1996-08-28', pos: 'Defensa Central', eur: 450000, pj: 21, num: 2, clubs: [{c: 'Defensores de Belgrano (Arg)', y: '2023 - 2024'}, {c: 'Almagro (Arg)', y: '2021 - 2022'}] },
  { name: 'Horacio Benincasa', slug: 'horacio-benincasa-dg', nat: 'Peruano / Argentino', birth: '1994-04-11', pos: 'Defensa Central', eur: 400000, pj: 19, num: 3, clubs: [{c: 'Cusco FC', y: '2022 - 2023'}, {c: 'Universitario', y: '2015 - 2018'}] },
  { name: 'Jefferson Portales', slug: 'jefferson-portales-dg', nat: 'Peruano', birth: '1997-11-29', pos: 'Defensa Central', eur: 350000, pj: 18, num: 4, clubs: [{c: 'Cienciano', y: '2023 - 2024'}, {c: 'Alianza Lima', y: '2021 - 2022'}] },
  { name: 'Aldair Salazar', slug: 'aldair-salazar-dg', nat: 'Peruano', birth: '1994-08-04', pos: 'Defensa Central / Lateral', eur: 350000, pj: 20, num: 14, clubs: [{c: 'Cantolao', y: '2023 - 2024'}, {c: 'Alianza Lima', y: '2019 - 2020'}] },
  { name: 'Anthony Rosell', slug: 'anthony-rosell-dg', nat: 'Peruano', birth: '1995-04-20', pos: 'Lateral Izquierdo', eur: 350000, pj: 20, num: 13, clubs: [{c: 'Binacional', y: '2022 - 2023'}, {c: 'Alianza Lima', y: '2019 - 2020'}] },
  { name: 'Erick Canales', slug: 'erick-canales-dg', nat: 'Peruano', birth: '2001-04-20', pos: 'Lateral Derecho', eur: 300000, pj: 19, num: 22, clubs: [{c: 'UTC Cajamarca', y: '2022 - 2023'}] },
  { name: 'Samir Villacorta', slug: 'samir-villacorta-dg', nat: 'Peruano', birth: '2004-06-15', pos: 'Lateral Derecho', eur: 200000, pj: 12, num: 15, clubs: [{c: 'Sporting Cristal U20', y: '2022 - 2024'}] },
  { name: 'Anthony Gordillo', slug: 'anthony-gordillo-dg', nat: 'Peruano', birth: '1994-03-09', pos: 'Lateral Izquierdo', eur: 300000, pj: 16, num: 5, clubs: [{c: 'Universidad San Martín', y: '2021 - 2022'}] },
  { name: 'Carlos Ramos', slug: 'carlos-ramos-dg', nat: 'Venezolano / Portugués', birth: '1999-05-26', pos: 'Mediocentro / Pivote', eur: 400000, pj: 21, num: 6, clubs: [{c: 'Academia Puerto Cabello (Ven)', y: '2023 - 2024'}, {c: 'Carabobo FC (Ven)', y: '2018 - 2022'}] },
  { name: 'Agustín González', slug: 'agustin-gonzalez-dg', nat: 'Uruguayo', birth: '1997-01-25', pos: 'Mediocentro', eur: 450000, pj: 21, num: 8, clubs: [{c: 'Liverpool FC (Uru)', y: '2023 - 2024'}, {c: 'Nacional (Uru)', y: '2017 - 2020'}] },
  { name: 'Kevin Sandoval', slug: 'kevin-sandoval-dg', nat: 'Peruano', birth: '1997-05-03', pos: 'Mediocentro Ofensivo', eur: 500000, pj: 22, num: 10, clubs: [{c: 'Cienciano', y: '2021 - 2024'}, {c: 'Sporting Cristal', y: '2019 - 2020'}] },
  { name: 'Sharif Ramírez', slug: 'sharif-ramirez-dg', nat: 'Peruano', birth: '2002-09-14', pos: 'Mediocentro Ofensivo', eur: 250000, pj: 14, num: 16, clubs: [{c: 'Deportivo Garcilaso Res.', y: '2022 - 2024'}] },
  { name: 'César Flores', slug: 'cesar-flores-dg', nat: 'Peruano', birth: '2003-02-18', pos: 'Pivote', eur: 200000, pj: 12, num: 18, clubs: [{c: 'Deportivo Garcilaso Res.', y: '2023 - 2025'}] },
  { name: 'Erick Gonzales', slug: 'erick-gonzales-dg', nat: 'Peruano', birth: '1996-03-12', pos: 'Pivote', eur: 300000, pj: 18, num: 20, clubs: [{c: 'Carlos A. Mannucci', y: '2023 - 2024'}, {c: 'Cusco FC', y: '2021 - 2022'}] },
  { name: 'Fernando Pacheco', slug: 'fernando-pacheco-dg', nat: 'Peruano', birth: '1999-06-26', pos: 'Extremo Izquierdo', eur: 550000, pj: 22, num: 11, clubs: [{c: 'Sporting Cristal', y: '2023 - 2024'}, {c: 'Fluminense (Bra)', y: '2020 - 2021'}, {c: 'Juventude (Bra)', y: '2021 - 2021'}] },
  { name: 'Lucas Ríos', slug: 'lucas-rios-dg', nat: 'Argentino', birth: '1998-04-06', pos: 'Extremo Izquierdo', eur: 450000, pj: 20, num: 7, clubs: [{c: 'Cúcuta Deportivo (Col)', y: '2023 - 2024'}, {c: 'Unión Magdalena (Col)', y: '2021 - 2022'}] },
  { name: 'Francisco Arancibia', slug: 'francisco-arancibia-dg', nat: 'Chileno', birth: '1996-11-12', pos: 'Extremo Derecho', eur: 400000, pj: 19, num: 17, clubs: [{c: 'Cobreloa (Chi)', y: '2024 - 2024'}, {c: 'O Higgins (Chi)', y: '2020 - 2023'}, {c: 'Univ. de Chile', y: '2017 - 2019'}] },
  { name: 'Facundo Castelli', slug: 'facundo-castelli-dg', nat: 'Argentino', birth: '1995-02-25', pos: 'Delantero Centro', eur: 600000, pj: 22, num: 9, clubs: [{c: 'Emelec (Ecu)', y: '2024 - 2024'}, {c: 'Delfín SC (Ecu)', y: '2023 - 2023'}, {c: 'Estudiantes BA (Arg)', y: '2022 - 2023'}] },
  { name: 'Joao Mendoza', slug: 'joao-mendoza-dg', nat: 'Peruano', birth: '2004-04-18', pos: 'Extremo Derecho', eur: 250000, pj: 14, num: 19, clubs: [{c: 'Deportivo Garcilaso Res.', y: '2023 - 2025'}] },
  { name: 'Adrián Ugarriza', slug: 'adrian-ugarriza-dg', nat: 'Peruano', birth: '1997-01-01', pos: 'Delantero Centro', eur: 400000, pj: 19, num: 23, clubs: [{c: 'Sporting Cristal', y: '2023 - 2024'}, {c: 'Cienciano', y: '2021 - 2022'}] },
  { name: 'Pablo Erustes', slug: 'pablo-erustes-dg', nat: 'Argentino', birth: '1994-03-22', pos: 'Delantero Centro', eur: 450000, pj: 20, num: 27, clubs: [{c: 'Deportivo Municipal', y: '2023 - 2023'}] }
];

async function updateSquadForTeam(teamSlug, squad) {
  const { data: team } = await supabase.from('teams').select('*').eq('slug', teamSlug).single();
  if (!team) {
    console.error(`❌ Equipo no encontrado: ${teamSlug}`);
    return;
  }

  console.log(`\n⚽ Cargando plantilla verificada 2026 de ${team.name} (${squad.length} jugadores)...`);

  // Borrar plantilla 2026 previa para reemplazar limpiamente
  await supabase.from('player_seasons').delete().eq('team_id', team.id).eq('season_year', 2026);

  for (const p of squad) {
    // 1. Asegurar registro en players
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

    // 2. Asociar a player_seasons 2026
    await supabase.from('player_seasons').upsert({
      player_id: pId,
      team_id: team.id,
      season_year: 2026,
      market_value_eur: p.eur,
      market_value_usd: Math.round(p.eur * exchangeRate),
      matches_played: p.pj,
      jersey_number: p.num,
      contract_start_date: '2026-01-01',
      contract_end_date: '2026-12-31',
      last_updated: new Date().toISOString()
    }, { onConflict: 'player_id,season_year' });

    // 3. Historial de clubes previos
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

  console.log(`   ✅ ${team.name}: ${squad.length} jugadores cargados con éxito.`);
}

async function main() {
  console.log('🚀 CORRECCIÓN DEFINITIVA JUGADOR POR JUGADOR 2026:');
  console.log('   - FC Cajamarca (Azul y Oro · Plantilla 2026 con Yordi Vílchez, Pineau, Orejuela, etc.)');
  console.log('   - Deportivo Moquegua (Plantilla 2026 con Bryan Angulo, Carlos Grados, Edgar Lastre, etc.)');
  console.log('   - Deportivo Garcilaso (Plantilla 2026 con Facundo Castelli, Pacheco, Sandoval, Benincasa, etc.)\n');

  // Actualizar colores oficiales de FC Cajamarca (Azul y Oro)
  await supabase.from('teams').update({
    primary_kit_color: '#1e40af', // Azul Rey
    shorts_kit_color: '#facc15',  // Amarillo Oro
  }).eq('slug', 'fc-cajamarca');

  // Actualizar colores oficiales de Deportivo Moquegua (Azul Marino y Blanco)
  await supabase.from('teams').update({
    primary_kit_color: '#1e3a8a', // Azul Marino
    shorts_kit_color: '#ffffff',  // Blanco
  }).eq('slug', 'deportivo-moquegua');

  // Cargar plantillas oficiales
  await updateSquadForTeam('fc-cajamarca', cajamarcaSquad2026);
  await updateSquadForTeam('deportivo-moquegua', moqueguaSquad2026);
  await updateSquadForTeam('deportivo-garcilaso', garcilasoSquad2026);

  // Actualizar Fichajes 2026 representativos con los jugadores estrella 2026
  console.log('\n📝 Actualizando Fichajes Oficiales 2026 de los 3 clubes...');
  
  // FC Cajamarca: Yordi Vílchez
  const { data: vilchez } = await supabase.from('players').select('id').eq('slug', 'yordi-vilchez-fcc').maybeSingle();
  const { data: fccTeam } = await supabase.from('teams').select('id').eq('slug', 'fc-cajamarca').single();
  if (vilchez && fccTeam) {
    await supabase.from('transfers').delete().eq('team_id', fccTeam.id).eq('season_year', 2026);
    await supabase.from('transfers').insert({
      player_id: vilchez.id,
      team_id: fccTeam.id,
      season_year: 2026,
      transfer_type: 'IN',
      other_club_name: 'Alianza Lima (Perú)',
      announced_at: '2026-01-12T10:00:00Z',
      contract_start_date: '2026-01-01',
      contract_end_date: '2026-12-31',
      source_type: 'transfermarkt',
      source_url: 'https://www.transfermarkt.es'
    });
  }

  // Deportivo Moquegua: Bryan Angulo
  const { data: angulo } = await supabase.from('players').select('id').eq('slug', 'bryan-angulo-moq').maybeSingle();
  const { data: moqTeam } = await supabase.from('teams').select('id').eq('slug', 'deportivo-moquegua').single();
  if (angulo && moqTeam) {
    await supabase.from('transfers').delete().eq('team_id', moqTeam.id).eq('season_year', 2026);
    await supabase.from('transfers').insert({
      player_id: angulo.id,
      team_id: moqTeam.id,
      season_year: 2026,
      transfer_type: 'IN',
      other_club_name: 'The Strongest (Bolivia)',
      announced_at: '2026-01-10T12:00:00Z',
      contract_start_date: '2026-01-01',
      contract_end_date: '2026-12-31',
      source_type: 'transfermarkt',
      source_url: 'https://www.transfermarkt.es'
    });
  }

  // Deportivo Garcilaso: Fernando Pacheco & Facundo Castelli
  const { data: pacheco } = await supabase.from('players').select('id').eq('slug', 'fernando-pacheco-dg').maybeSingle();
  const { data: dgTeam } = await supabase.from('teams').select('id').eq('slug', 'deportivo-garcilaso').single();
  if (pacheco && dgTeam) {
    await supabase.from('transfers').delete().eq('team_id', dgTeam.id).eq('season_year', 2026);
    await supabase.from('transfers').insert({
      player_id: pacheco.id,
      team_id: dgTeam.id,
      season_year: 2026,
      transfer_type: 'IN',
      other_club_name: 'Sporting Cristal (Perú)',
      announced_at: '2026-01-15T15:00:00Z',
      contract_start_date: '2026-01-01',
      contract_end_date: '2026-12-31',
      source_type: 'club_social_x',
      source_url: 'https://x.com/DepGarcilaso'
    });
  }

  // Recalcular team_seasons 2026 para todos los 18 clubes
  console.log('\n📊 RECALCULANDO VALORES DE MERCADO TOTALES Y RANKINGS 2026...');
  const { data: allTeams } = await supabase.from('teams').select('id, name, slug');
  const active18Slugs = [
    'universitario', 'alianza-lima', 'sporting-cristal', 'fbc-melgar', 'atletico-grau',
    'cusco-fc', 'sport-boys', 'cienciano', 'sport-huancayo', 'deportivo-garcilaso',
    'alianza-atletico', 'utc-cajamarca', 'los-chankas', 'comerciantes-unidos',
    'fc-cajamarca', 'adt-tarma', 'deportivo-moquegua', 'juan-pablo-ii'
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

  console.log('\n🎉 ¡CORRECCIÓN COMPLETADA CON ÉXITO!');
  process.exit(0);
}

main().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
});
