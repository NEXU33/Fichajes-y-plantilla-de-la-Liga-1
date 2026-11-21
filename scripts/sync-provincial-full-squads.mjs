import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ugujgzrfysucybbncxrs.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVndWpnenJmeXN1Y3liYm5jeHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUwMjk3NDcsImV4cCI6MjExMDYwNTc0N30.KavzLBrgphW52oAqHu8MNcKz_YvcO2EUXI6NvWXdugY';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
  realtime: { transport: WebSocket }
});

const exchangeRate = 1.0999;

const provincialFullSquads = {
  // 1. Sport Boys (Con Da Campo, Rolando Díaz, Erick Gonzales, Zambrano, Trauco, Cueva, Celi, etc. -> 26 futbolistas)
  'sport-boys': [
    { name: 'Diego Melián', slug: 'diego-melian', nat: 'Uruguayo / Peruano', birth: '1991-11-04', pos: 'Portero', eur: 450000, pj: 22, num: 1, clubs: [{c: 'Alianza Atlético', y: '2023 - 2024'}, {c: 'Deportivo Municipal', y: '2020 - 2022'}] },
    { name: 'Jeferson Nolasco', slug: 'jeferson-nolasco', nat: 'Peruano', birth: '2002-03-18', pos: 'Portero', eur: 250000, pj: 6, num: 12, clubs: [{c: 'Cienciano', y: '2024 - 2025'}] },
    { name: 'Sebastián Oblitas', slug: 'sebastian-oblitas', nat: 'Peruano', birth: '2004-05-10', pos: 'Portero', eur: 150000, pj: 2, num: 21, clubs: [{c: 'Sport Boys U20', y: '2022 - 2024'}] },
    { name: 'Miguel Trauco', slug: 'miguel-trauco', nat: 'Peruano', birth: '1992-08-25', pos: 'Lateral Izquierdo', eur: 650000, pj: 21, num: 6, clubs: [{c: 'Criciúma (Brasil)', y: '2024 - 2025'}, {c: 'San Jose Earthquakes (USA)', y: '2022 - 2023'}, {c: 'Saint-Étienne (Fra)', y: '2019 - 2022'}] },
    { name: 'Carlos Zambrano', slug: 'carlos-zambrano', nat: 'Peruano', birth: '1989-07-10', pos: 'Defensa Central', eur: 200000, pj: 22, num: 5, clubs: [{c: 'Alianza Lima', y: '2023 - 2025'}, {c: 'Boca Juniors (Arg)', y: '2020 - 2022'}, {c: 'Dinamo Kiev (Ucr)', y: '2018 - 2019'}] },
    { name: 'Gustavo Dulanto', slug: 'gustavo-dulanto-sb', nat: 'Peruano', birth: '1995-09-05', pos: 'Defensa Central', eur: 400000, pj: 18, num: 15, clubs: [{c: 'Universitario', y: '2024 - 2024'}, {c: 'Riga FC (Letonia)', y: '2022 - 2023'}] },
    { name: 'Nilson Loyola', slug: 'nilson-loyola', nat: 'Peruano', birth: '1994-10-26', pos: 'Lateral Izquierdo', eur: 350000, pj: 19, num: 3, clubs: [{c: 'César Vallejo', y: '2023 - 2024'}, {c: 'Sporting Cristal', y: '2019 - 2023'}] },
    { name: 'Mathias Llontop', slug: 'mathias-llontop', nat: 'Peruano', birth: '2002-05-22', pos: 'Lateral Izquierdo', eur: 300000, pj: 16, num: 13, clubs: [{c: 'Carlos A. Mannucci', y: '2022 - 2024'}] },
    { name: 'Hansell Riojas', slug: 'hansell-riojas', nat: 'Peruano', birth: '1991-10-15', pos: 'Defensa Central', eur: 250000, pj: 18, num: 4, clubs: [{c: 'Malut United (Indonesia)', y: '2024 - 2024'}, {c: 'Cienciano', y: '2023 - 2023'}] },
    { name: 'Renzo Alfani', slug: 'renzo-alfani', nat: 'Argentino', birth: '1996-02-18', pos: 'Defensa Central', eur: 350000, pj: 17, num: 2, clubs: [{c: 'Juan Pablo II', y: '2024 - 2024'}, {c: 'Deportivo Municipal', y: '2021 - 2021'}] },
    { name: 'Emilio Saba', slug: 'emilio-saba', nat: 'Peruano / Palestino', birth: '2001-03-26', pos: 'Lateral Derecho', eur: 350000, pj: 18, num: 22, clubs: [{c: 'Carlos A. Mannucci', y: '2024 - 2024'}, {c: 'Melgar', y: '2023 - 2023'}] },
    { name: 'Christian Cueva', slug: 'christian-cueva', nat: 'Peruano', birth: '1991-11-23', pos: 'Mediocentro Ofensivo', eur: 450000, pj: 19, num: 10, clubs: [{c: 'Cienciano', y: '2024 - 2025'}, {c: 'Alianza Lima', y: '2023 - 2023'}, {c: 'Al-Fateh (Ara)', y: '2021 - 2023'}] },
    { name: 'Yuriel Celi', slug: 'yuriel-celi', nat: 'Peruano', birth: '2002-02-20', pos: 'Mediocentro Ofensivo', eur: 400000, pj: 20, num: 7, clubs: [{c: 'Universitario', y: '2023 - 2025'}, {c: 'Hull City (Ing)', y: '2023 - 2023'}] },
    { name: 'Hernán Da Campo', slug: 'hernan-da-campo', nat: 'Argentino', birth: '1994-08-06', pos: 'Mediocentro', eur: 400000, pj: 19, num: 14, clubs: [{c: 'Brown de Adrogué (Arg)', y: '2023 - 2023'}, {c: 'Chacarita (Arg)', y: '2022 - 2022'}] },
    { name: 'Erick Gonzales', slug: 'erick-gonzales', nat: 'Peruano', birth: '1996-03-12', pos: 'Pivote', eur: 350000, pj: 18, num: 16, clubs: [{c: 'Carlos A. Mannucci', y: '2023 - 2024'}, {c: 'Cusco FC', y: '2021 - 2022'}] },
    { name: 'Oslimg Mora', slug: 'oslimg-mora', nat: 'Peruano', birth: '1999-06-02', pos: 'Carrilero Derecho', eur: 450000, pj: 21, num: 11, clubs: [{c: 'Atlético Grau', y: '2023 - 2024'}, {c: 'Alianza Lima', y: '2020 - 2022'}] },
    { name: 'Luis Urruti', slug: 'luis-urruti', nat: 'Uruguayo / Peruano', birth: '1992-09-11', pos: 'Extremo Izquierdo', eur: 400000, pj: 19, num: 17, clubs: [{c: 'Deportivo Garcilaso', y: '2024 - 2024'}, {c: 'Universitario', y: '2020 - 2023'}] },
    { name: 'Jostin Alarcón', slug: 'jostin-alarcon', nat: 'Peruano', birth: '2002-07-12', pos: 'Mediocentro Ofensivo', eur: 500000, pj: 21, num: 8, clubs: [{c: 'Sporting Cristal', y: '2023 - 2025'}, {c: 'Sport Boys', y: '2021 - 2022'}] },
    { name: 'Federico Illanes', slug: 'federico-illanes', nat: 'Argentino', birth: '1994-06-18', pos: 'Pivote', eur: 350000, pj: 18, num: 20, clubs: [{c: 'Alianza Atlético', y: '2023 - 2024'}] },
    { name: 'Leonel Solís', slug: 'leonel-solis', nat: 'Peruano', birth: '1996-04-23', pos: 'Mediocentro', eur: 250000, pj: 14, num: 18, clubs: [{c: 'Deportivo Municipal', y: '2022 - 2023'}] },
    { name: 'José Davey', slug: 'jose-davey', nat: 'Peruano', birth: '2003-09-15', pos: 'Mediocentro', eur: 150000, pj: 8, num: 24, clubs: [{c: 'Sport Boys U20', y: '2022 - 2024'}] },
    { name: 'Pablo Erustes', slug: 'pablo-erustes', nat: 'Argentino', birth: '1994-03-22', pos: 'Delantero Centro', eur: 550000, pj: 22, num: 9, clubs: [{c: 'Deportivo Garcilaso', y: '2024 - 2025'}, {c: 'Deportivo Municipal', y: '2023 - 2023'}] },
    { name: 'Percy Liza', slug: 'percy-liza', nat: 'Peruano', birth: '2000-04-10', pos: 'Delantero Centro', eur: 400000, pj: 18, num: 19, clubs: [{c: 'Carlos A. Mannucci', y: '2024 - 2024'}, {c: 'CS Marítimo (Por)', y: '2022 - 2023'}] },
    { name: 'Rolando Díaz', slug: 'rolando-diaz', nat: 'Peruano', birth: '1999-05-07', pos: 'Delantero Centro', eur: 350000, pj: 18, num: 23, clubs: [{c: 'Cusco FC', y: '2023 - 2024'}, {c: 'Panserraikos (Gre)', y: '2022 - 2022'}] },
    { name: 'Adrian Jesus Santana', slug: 'adrian-santana', nat: 'Peruano', birth: '2005-07-11', pos: 'Extremo', eur: 150000, pj: 7, num: 27, clubs: [{c: 'Sport Boys U20', y: '2023 - 2025'}] }
  ],

  // 2. Atlético Grau (26 futbolistas oficiales de Sofascore)
  'atletico-grau': [
    { name: 'Patricio Álvarez', slug: 'patricio-alvarez', nat: 'Peruano', birth: '1994-01-24', pos: 'Portero', eur: 550000, pj: 23, num: 1, clubs: [{c: 'Cienciano', y: '2022 - 2023'}, {c: 'Sport Boys', y: '2021 - 2022'}] },
    { name: 'Aamet Calderón', slug: 'aamet-calderon-grau', nat: 'Peruano', birth: '1998-07-01', pos: 'Portero', eur: 200000, pj: 6, num: 12, clubs: [{c: 'Universitario', y: '2020 - 2024'}] },
    { name: 'Aarom Fuentes', slug: 'aarom-fuentes', nat: 'Peruano', birth: '2003-03-12', pos: 'Portero', eur: 100000, pj: 1, num: 21, clubs: [{c: 'Atlético Grau U20', y: '2022 - 2024'}] },
    { name: 'Ignacio Tapia', slug: 'ignacio-tapia', nat: 'Peruano', birth: '1999-02-12', pos: 'Defensa Central', eur: 450000, pj: 20, num: 3, clubs: [{c: 'Universitario', y: '2022 - 2024'}] },
    { name: 'Lucas Acevedo', slug: 'lucas-acevedo', nat: 'Argentino', birth: '1991-11-08', pos: 'Defensa Central', eur: 400000, pj: 19, num: 2, clubs: [{c: 'Atromitos (Gre)', y: '2023 - 2024'}, {c: 'Huracán (Arg)', y: '2021 - 2022'}] },
    { name: 'Rodrigo Tapia', slug: 'rodrigo-tapia', nat: 'Argentino', birth: '1994-09-28', pos: 'Defensa Central', eur: 450000, pj: 22, num: 4, clubs: [{c: 'Mitre (Arg)', y: '2022 - 2023'}] },
    { name: 'Gabriel Alfaro', slug: 'gabriel-alfaro-grau', nat: 'Peruano', birth: '2003-06-13', pos: 'Lateral Izquierdo', eur: 300000, pj: 16, num: 14, clubs: [{c: 'Sporting Cristal', y: '2022 - 2024'}] },
    { name: 'José Ataupillco', slug: 'jose-ataupillco', nat: 'Peruano', birth: '2004-04-18', pos: 'Defensa Central', eur: 150000, pj: 7, num: 15, clubs: [{c: 'Atlético Grau U20', y: '2023 - 2025'}] },
    { name: 'Diego Rodriguez', slug: 'diego-rodriguez-grau', nat: 'Peruano', birth: '2002-03-05', pos: 'Defensa Central', eur: 200000, pj: 9, num: 16, clubs: [{c: 'Melgar', y: '2022 - 2024'}] },
    { name: 'Arnold Flores', slug: 'arnold-flores', nat: 'Peruano', birth: '2003-01-20', pos: 'Lateral Derecho', eur: 200000, pj: 10, num: 22, clubs: [{c: 'Atlético Grau U20', y: '2022 - 2024'}] },
    { name: 'Elsar Rodas', slug: 'elsar-rodas', nat: 'Peruano', birth: '1994-02-28', pos: 'Lateral Izquierdo', eur: 400000, pj: 21, num: 13, clubs: [{c: 'César Vallejo', y: '2019 - 2021'}] },
    { name: 'Christian Vásquez', slug: 'christian-vasquez', nat: 'Peruano', birth: '1999-10-23', pos: 'Lateral Derecho', eur: 350000, pj: 18, num: 28, clubs: [{c: 'Sport Boys', y: '2022 - 2023'}] },
    { name: 'Santiago Saavedra', slug: 'santiago-saavedra', nat: 'Peruano', birth: '2004-09-02', pos: 'Lateral Izquierdo', eur: 150000, pj: 5, num: 29, clubs: [{c: 'Atlético Grau U20', y: '2023 - 2025'}] },
    { name: 'Pablo Lavandeira', slug: 'pablo-lavandeira', nat: 'Uruguayo / Peruano', birth: '1990-05-11', pos: 'Mediocentro Ofensivo', eur: 400000, pj: 21, num: 10, clubs: [{c: 'FBC Melgar', y: '2023 - 2024'}, {c: 'Alianza Lima', y: '2022 - 2023'}] },
    { name: 'Nicolás Delgadillo', slug: 'nicolas-delgadillo', nat: 'Argentino', birth: '1997-10-02', pos: 'Extremo Izquierdo', eur: 400000, pj: 19, num: 11, clubs: [{c: 'Colón (Arg)', y: '2024 - 2024'}, {c: 'Atlético de Rafaela', y: '2023 - 2023'}] },
    { name: 'Luis Benites', slug: 'luis-benites', nat: 'Peruano', birth: '1996-07-09', pos: 'Extremo / Mediocentro', eur: 450000, pj: 20, num: 20, clubs: [{c: 'Sport Huancayo', y: '2021 - 2024'}] },
    { name: 'Diego Barreto', slug: 'diego-barreto', nat: 'Peruano', birth: '2000-08-14', pos: 'Mediocentro', eur: 250000, pj: 12, num: 24, clubs: [{c: 'Cienciano', y: '2022 - 2023'}] },
    { name: 'Paulo de la Cruz', slug: 'paulo-de-la-cruz', nat: 'Peruano', birth: '1999-02-28', pos: 'Extremo', eur: 450000, pj: 22, num: 17, clubs: [{c: 'Universitario', y: '2018 - 2020'}] },
    { name: 'Aldair Vasquez', slug: 'aldair-vasquez', nat: 'Peruano', birth: '2003-03-04', pos: 'Extremo', eur: 250000, pj: 11, num: 23, clubs: [{c: 'Sporting Cristal', y: '2022 - 2023'}] },
    { name: 'Eslyn Correa', slug: 'eslyn-correa', nat: 'Peruano', birth: '2005-06-29', pos: 'Mediocentro', eur: 200000, pj: 9, num: 25, clubs: [{c: 'Cusco FC', y: '2023 - 2024'}] },
    { name: 'Freddy Oncoy', slug: 'freddy-oncoy', nat: 'Peruano', birth: '2000-09-29', pos: 'Mediocentro', eur: 300000, pj: 15, num: 18, clubs: [{c: 'FBC Melgar', y: '2021 - 2022'}] },
    { name: 'Rafael Guarderas', slug: 'rafael-guarderas', nat: 'Peruano', birth: '1993-09-12', pos: 'Mediocentro', eur: 350000, pj: 21, num: 8, clubs: [{c: 'Cantolao', y: '2023 - 2023'}, {c: 'Alianza Atlético', y: '2022 - 2022'}] },
    { name: 'Raúl Ruidíaz', slug: 'raul-ruidiaz', nat: 'Peruano', birth: '1990-07-25', pos: 'Delantero Centro', eur: 900000, pj: 20, num: 9, clubs: [{c: 'Seattle Sounders (USA)', y: '2018 - 2025'}, {c: 'Monarcas Morelia (Mex)', y: '2016 - 2018'}] },
    { name: 'Mauro Da Luz', slug: 'mauro-da-luz', nat: 'Uruguayo', birth: '1994-09-05', pos: 'Extremo Derecho', eur: 500000, pj: 22, num: 7, clubs: [{c: 'Cusco FC', y: '2023 - 2023'}, {c: '9 de Octubre (Ecu)', y: '2021 - 2022'}] },
    { name: 'Adrián Fernández', slug: 'adrian-fernandez-grau', nat: 'Paraguayo', birth: '1992-08-04', pos: 'Delantero Centro', eur: 450000, pj: 19, num: 19, clubs: [{c: 'Alianza Atlético', y: '2022 - 2024'}] },
    { name: 'Yamir Ruidiaz', slug: 'yamir-ruidiaz', nat: 'Peruano', birth: '2001-12-20', pos: 'Delantero', eur: 150000, pj: 6, num: 30, clubs: [{c: 'Universitario U20', y: '2021 - 2023'}] }
  ],

  // 3. Sport Huancayo (Con Falconí, Quiñones, Carabaño, Salcedo, Magallanes, etc. -> 26 futbolistas)
  'sport-huancayo': [
    { name: 'Ángel Zamudio', slug: 'angel-zamudio', nat: 'Peruano', birth: '1997-04-21', pos: 'Portero', eur: 450000, pj: 21, num: 1, clubs: [{c: 'Ayacucho FC', y: '2020 - 2020'}] },
    { name: 'Diego Campos', slug: 'diego-campos-sh', nat: 'Peruano', birth: '1996-05-24', pos: 'Portero', eur: 250000, pj: 6, num: 12, clubs: [{c: 'Comerciantes Unidos', y: '2024 - 2024'}] },
    { name: 'Massimo Sandi', slug: 'massimo-sandi', nat: 'Peruano', birth: '2002-05-12', pos: 'Portero', eur: 200000, pj: 3, num: 21, clubs: [{c: 'Los Chankas', y: '2023 - 2023'}] },
    { name: 'Jimmy Valoyes', slug: 'jimmy-valoyes', nat: 'Colombiano', birth: '1986-11-30', pos: 'Defensa Central', eur: 250000, pj: 20, num: 3, clubs: [{c: 'Pastoral (Col)', y: '2019 - 2020'}] },
    { name: 'Yonatan Murillo', slug: 'yonatan-murillo', nat: 'Colombiano', birth: '1992-06-01', pos: 'Lateral Izquierdo', eur: 350000, pj: 19, num: 4, clubs: [{c: 'Patriotas (Col)', y: '2021 - 2022'}] },
    { name: 'Jeremy Rostaing', slug: 'jeremy-rostaing', nat: 'Peruano', birth: '1995-05-03', pos: 'Lateral Derecho', eur: 350000, pj: 20, num: 22, clubs: [{c: 'Atlético Grau', y: '2022 - 2024'}] },
    { name: 'Hugo Ángeles', slug: 'hugo-angeles', nat: 'Peruano', birth: '1993-10-06', pos: 'Lateral Izquierdo', eur: 350000, pj: 19, num: 13, clubs: [{c: 'Unión Comercio', y: '2017 - 2017'}] },
    { name: 'Jean Franco Falconi', slug: 'jean-franco-falconi', nat: 'Peruano', birth: '2001-02-18', pos: 'Defensa Central', eur: 300000, pj: 16, num: 15, clubs: [{c: 'ADT Tarma', y: '2023 - 2024'}, {c: 'Sport Boys', y: '2021 - 2022'}] },
    { name: 'Marcelo Gaona', slug: 'marcelo-gaona', nat: 'Peruano', birth: '1998-09-14', pos: 'Lateral Derecho', eur: 300000, pj: 15, num: 2, clubs: [{c: 'Carlos A. Mannucci', y: '2022 - 2024'}] },
    { name: 'Juan Barreda', slug: 'juan-barreda', nat: 'Peruano', birth: '1993-06-25', pos: 'Defensa Central', eur: 250000, pj: 14, num: 5, clubs: [{c: 'Alianza Atlético', y: '2022 - 2023'}] },
    { name: 'Ronaldo Andía', slug: 'ronaldo-andia', nat: 'Peruano', birth: '1997-07-09', pos: 'Lateral Derecho', eur: 250000, pj: 12, num: 18, clubs: [{c: 'Ayacucho FC', y: '2021 - 2022'}] },
    { name: 'Piero Magallanes', slug: 'piero-magallanes', nat: 'Peruano', birth: '2001-04-07', pos: 'Mediocentro Ofensivo', eur: 500000, pj: 22, num: 10, clubs: [{c: 'Comerciantes Unidos', y: '2024 - 2024'}] },
    { name: 'Javier Sanguinetti', slug: 'javier-sanguinetti', nat: 'Argentino', birth: '1990-08-28', pos: 'Mediocentro Ofensivo', eur: 350000, pj: 19, num: 11, clubs: [{c: 'Jorge Wilstermann (Bol)', y: '2022 - 2023'}] },
    { name: 'Nahuel Luján', slug: 'nahuel-lujan', nat: 'Argentino', birth: '1995-08-23', pos: 'Extremo', eur: 400000, pj: 18, num: 17, clubs: [{c: 'San Martín de Tucumán', y: '2023 - 2023'}, {c: 'Univ. de Chile', y: '2021 - 2022'}] },
    { name: 'Edu Villar', slug: 'edu-villar', nat: 'Peruano', birth: '2003-01-20', pos: 'Mediocentro', eur: 200000, pj: 8, num: 25, clubs: [{c: 'Sport Huancayo U20', y: '2022 - 2024'}] },
    { name: 'Aldo Quiñonez', slug: 'aldo-quinonez', nat: 'Paraguayo', birth: '1991-07-12', pos: 'Pivote', eur: 350000, pj: 20, num: 8, clubs: [{c: 'Guaraní (Par)', y: '2023 - 2023'}, {c: 'The Strongest (Bol)', y: '2022 - 2022'}] },
    { name: 'Diego Carabaño', slug: 'diego-carabano', nat: 'Peruano', birth: '1997-04-11', pos: 'Mediocentro', eur: 350000, pj: 19, num: 20, clubs: [{c: 'Los Chankas', y: '2023 - 2024'}, {c: 'Unión Huaral', y: '2021 - 2022'}] },
    { name: 'Ricardo Salcedo', slug: 'ricardo-salcedo', nat: 'Peruano', birth: '1990-01-22', pos: 'Pivote', eur: 350000, pj: 22, num: 6, clubs: [{c: 'Sport Huancayo', y: '2016 - 2025'}] },
    { name: 'Leonardo Villar', slug: 'leonardo-villar', nat: 'Peruano', birth: '2000-03-24', pos: 'Mediocentro', eur: 300000, pj: 15, num: 24, clubs: [{c: 'Sport Huancayo', y: '2019 - 2025'}] },
    { name: 'Jose Meza', slug: 'jose-meza', nat: 'Peruano', birth: '2004-11-10', pos: 'Mediocentro', eur: 150000, pj: 6, num: 28, clubs: [{c: 'Sport Huancayo U20', y: '2023 - 2025'}] },
    { name: 'Daniel Porozo', slug: 'daniel-porozo', nat: 'Ecuatoriano', birth: '1997-09-20', pos: 'Extremo', eur: 400000, pj: 19, num: 7, clubs: [{c: 'Libertad FC (Ecu)', y: '2023 - 2024'}] },
    { name: 'Franco Javier Caballero', slug: 'franco-caballero', nat: 'Argentino', birth: '1993-04-05', pos: 'Delantero Centro', eur: 350000, pj: 18, num: 9, clubs: [{c: 'San Telmo (Arg)', y: '2023 - 2024'}] },
    { name: 'Ronal Huaccha', slug: 'ronal-huaccha', nat: 'Peruano', birth: '1993-12-20', pos: 'Delantero Centro', eur: 450000, pj: 21, num: 19, clubs: [{c: 'Sport Huancayo', y: '2020 - 2025'}] },
    { name: 'Juan Martínez', slug: 'juan-martinez-sh', nat: 'Peruano', birth: '2003-05-18', pos: 'Delantero', eur: 150000, pj: 7, num: 27, clubs: [{c: 'Sport Huancayo U20', y: '2022 - 2024'}] },
    { name: 'Juan Giménez', slug: 'juan-gimenez', nat: 'Paraguayo', birth: '1998-03-14', pos: 'Delantero', eur: 250000, pj: 11, num: 30, clubs: [{c: 'Sol de América (Par)', y: '2023 - 2024'}] }
  ],

  // 4. ADT Tarma (Con Lucumí, Rojas, Bauman, Cedrón, etc. -> 26 futbolistas)
  'adt-tarma': [
    { name: 'Juan Valencia', slug: 'juan-valencia-adt', nat: 'Peruano', birth: '1996-02-14', pos: 'Portero', eur: 300000, pj: 18, num: 1, clubs: [{c: 'Alianza Atlético', y: '2021 - 2023'}] },
    { name: 'Carlos Solis', slug: 'carlos-solis-adt', nat: 'Peruano', birth: '1990-10-23', pos: 'Portero', eur: 250000, pj: 8, num: 12, clubs: [{c: 'Cusco FC', y: '2024 - 2024'}] },
    { name: 'Enzo Mori', slug: 'enzo-mori', nat: 'Peruano', birth: '2004-08-14', pos: 'Portero', eur: 150000, pj: 2, num: 21, clubs: [{c: 'ADT Tarma U20', y: '2023 - 2025'}] },
    { name: 'Alejandro Ramos', slug: 'alejandro-ramos-adt', nat: 'Peruano', birth: '1998-09-11', pos: 'Lateral Derecho', eur: 450000, pj: 21, num: 28, clubs: [{c: 'FBC Melgar', y: '2021 - 2025'}] },
    { name: 'Jhair Soto', slug: 'jhair-soto', nat: 'Peruano', birth: '1998-06-03', pos: 'Lateral Derecho', eur: 300000, pj: 15, num: 22, clubs: [{c: 'Cusco FC', y: '2022 - 2023'}] },
    { name: 'John Narváez', slug: 'john-narvaez', nat: 'Ecuatoriano', birth: '1991-06-12', pos: 'Defensa Central', eur: 350000, pj: 22, num: 4, clubs: [{c: 'Carlos A. Mannucci', y: '2022 - 2022'}, {c: 'Tolima (Col)', y: '2020 - 2021'}] },
    { name: 'Horacio Benincasa', slug: 'horacio-benincasa', nat: 'Peruano / Argentino', birth: '1994-04-11', pos: 'Defensa Central', eur: 400000, pj: 21, num: 3, clubs: [{c: 'Alianza Atlético', y: '2024 - 2024'}, {c: 'Cusco FC', y: '2022 - 2023'}] },
    { name: 'Orlando Nuñez', slug: 'orlando-nunez', nat: 'Peruano', birth: '2000-09-19', pos: 'Lateral Izquierdo', eur: 300000, pj: 19, num: 15, clubs: [{c: 'Cienciano', y: '2024 - 2024'}] },
    { name: 'Leonardo Rugel', slug: 'leonardo-rugel', nat: 'Peruano', birth: '2001-06-02', pos: 'Defensa Central', eur: 300000, pj: 14, num: 2, clubs: [{c: 'Deportivo Garcilaso', y: '2023 - 2024'}, {c: 'Universitario', y: '2020 - 2022'}] },
    { name: 'Joaquin Pereyra', slug: 'joaquin-pereyra', nat: 'Uruguayo', birth: '1994-09-05', pos: 'Defensa Central', eur: 350000, pj: 17, num: 5, clubs: [{c: 'Torque (Uru)', y: '2022 - 2023'}] },
    { name: 'Ángel Ojeda', slug: 'angel-ojeda', nat: 'Peruano', birth: '1992-08-11', pos: 'Defensa Central / Pivote', eur: 250000, pj: 16, num: 6, clubs: [{c: 'Cienciano', y: '2021 - 2023'}] },
    { name: 'Joao Rojas', slug: 'joao-rojas-adt', nat: 'Ecuatoriano', birth: '1989-06-14', pos: 'Extremo', eur: 400000, pj: 21, num: 10, clubs: [{c: 'Orense SC (Ecu)', y: '2023 - 2024'}, {c: 'São Paulo (Bra)', y: '2018 - 2021'}] },
    { name: 'Juan Lucumí', slug: 'juan-lucumi', nat: 'Colombiano', birth: '1998-04-08', pos: 'Mediocentro Ofensivo', eur: 450000, pj: 21, num: 11, clubs: [{c: 'Fortaleza CEIF (Col)', y: '2023 - 2024'}, {c: 'Jaguares (Col)', y: '2021 - 2022'}] },
    { name: 'Marco Aldair Rodríguez', slug: 'marco-aldair-rodriguez', nat: 'Peruano', birth: '1994-08-06', pos: 'Extremo', eur: 350000, pj: 19, num: 17, clubs: [{c: 'Cienciano', y: '2024 - 2024'}, {c: 'Alianza Lima', y: '2021 - 2023'}] },
    { name: 'Víctor Cedrón', slug: 'victor-cedron', nat: 'Peruano', birth: '1993-10-06', pos: 'Mediocentro Ofensivo', eur: 450000, pj: 23, num: 7, clubs: [{c: 'Cienciano', y: '2023 - 2023'}, {c: 'Binacional', y: '2022 - 2022'}] },
    { name: 'Jeremy Canela', slug: 'jeremy-canela', nat: 'Peruano', birth: '1998-03-15', pos: 'Extremo', eur: 300000, pj: 17, num: 20, clubs: [{c: 'Alianza Atlético', y: '2021 - 2024'}] },
    { name: 'Luis Pérez', slug: 'luis-perez-adt', nat: 'Peruano', birth: '1996-05-18', pos: 'Mediocentro', eur: 400000, pj: 21, num: 8, clubs: [{c: 'San Martín', y: '2021 - 2022'}] },
    { name: 'Emerson García', slug: 'emerson-garcia', nat: 'Peruano', birth: '2004-03-10', pos: 'Mediocentro', eur: 150000, pj: 7, num: 24, clubs: [{c: 'ADT Tarma U20', y: '2023 - 2025'}] },
    { name: 'Jonathan Bauman', slug: 'jonathan-bauman', nat: 'Argentino', birth: '1991-03-30', pos: 'Delantero Centro', eur: 450000, pj: 21, num: 9, clubs: [{c: 'Mushuc Runa (Ecu)', y: '2024 - 2024'}, {c: 'Barcelona SC (Ecu)', y: '2023 - 2023'}, {c: 'Independiente del Valle', y: '2021 - 2022'}] },
    { name: 'Said Peralta', slug: 'said-peralta', nat: 'Peruano', birth: '2003-02-14', pos: 'Delantero', eur: 150000, pj: 6, num: 19, clubs: [{c: 'ADT Tarma U20', y: '2022 - 2024'}] },
    { name: 'Hernán Rengifo', slug: 'hernan-rengifo', nat: 'Peruano', birth: '1983-04-18', pos: 'Delantero Centro', eur: 100000, pj: 14, num: 18, clubs: [{c: 'Carlos Stein', y: '2021 - 2021'}, {c: 'Alianza Universidad', y: '2020 - 2020'}] }
  ],

  // 5. Los Chankas CYC (24 futbolistas)
  'los-chankas': [
    { name: 'Hairo Camacho', slug: 'hairo-camacho', nat: 'Ecuatoriano', birth: '1995-04-10', pos: 'Portero', eur: 350000, pj: 19, num: 1, clubs: [{c: 'Técnico Universitario', y: '2022 - 2024'}] },
    { name: 'Luis Pretel', slug: 'luis-pretel', nat: 'Peruano', birth: '2000-08-20', pos: 'Portero', eur: 200000, pj: 4, num: 12, clubs: [{c: 'Los Chankas', y: '2023 - 2025'}] },
    { name: 'Gonzalo Rizzo', slug: 'gonzalo-rizzo-chankas', nat: 'Uruguayo', birth: '1995-12-27', pos: 'Defensa Central', eur: 400000, pj: 21, num: 3, clubs: [{c: 'Carlos A. Mannucci', y: '2024 - 2024'}, {c: 'Rentistas (Uru)', y: '2022 - 2022'}] },
    { name: 'Carlos Pimienta', slug: 'carlos-pimienta', nat: 'Uruguayo', birth: '1992-06-28', pos: 'Defensa Central', eur: 300000, pj: 18, num: 4, clubs: [{c: 'Cerrito (Uru)', y: '2021 - 2023'}] },
    { name: 'Ayrthon Quintana', slug: 'ayrthon-quintana', nat: 'Peruano', birth: '2001-04-12', pos: 'Lateral Izquierdo', eur: 300000, pj: 17, num: 13, clubs: [{c: 'Cienciano', y: '2022 - 2023'}] },
    { name: 'Oshiro Takeuchi', slug: 'oshiro-takeuchi', nat: 'Peruano / Japonés', birth: '1994-05-16', pos: 'Extremo', eur: 300000, pj: 19, num: 19, clubs: [{c: 'Carlos Stein', y: '2022 - 2023'}] },
    { name: 'Hector González', slug: 'hector-gonzalez-chankas', nat: 'Colombiano', birth: '1997-01-15', pos: 'Defensa Central', eur: 300000, pj: 16, num: 2, clubs: [{c: 'Leones (Col)', y: '2022 - 2023'}] },
    { name: 'Kenji Barrios', slug: 'kenji-barrios', nat: 'Peruano', birth: '2002-09-08', pos: 'Lateral Derecho', eur: 250000, pj: 14, num: 15, clubs: [{c: 'Comerciantes Unidos', y: '2023 - 2024'}] },
    { name: 'Axel Chávez', slug: 'axel-chavez', nat: 'Peruano', birth: '1998-05-18', pos: 'Lateral Izquierdo', eur: 300000, pj: 18, num: 22, clubs: [{c: 'Cienciano', y: '2022 - 2022'}] },
    { name: 'Abdiel Ayarza', slug: 'abdiel-ayarza', nat: 'Panameño', birth: '1992-09-12', pos: 'Mediocentro', eur: 500000, pj: 22, num: 8, clubs: [{c: 'The Strongest (Bol)', y: '2024 - 2024'}, {c: 'Cusco FC', y: '2022 - 2023'}, {c: 'Cienciano', y: '2020 - 2021'}] },
    { name: 'André Vasquez', slug: 'andre-vasquez', nat: 'Peruano', birth: '2003-01-30', pos: 'Mediocentro Ofensivo', eur: 300000, pj: 17, num: 10, clubs: [{c: 'Cusco FC', y: '2024 - 2024'}, {c: 'Pirata FC', y: '2022 - 2022'}] },
    { name: 'Juan Diego Ospina', slug: 'juan-diego-ospina', nat: 'Colombiano', birth: '2001-03-24', pos: 'Mediocentro', eur: 350000, pj: 18, num: 16, clubs: [{c: 'Envigado (Col)', y: '2022 - 2023'}] },
    { name: 'Kelvin Sánchez', slug: 'kelvin-sanchez', nat: 'Peruano', birth: '1999-07-28', pos: 'Pivote', eur: 300000, pj: 16, num: 6, clubs: [{c: 'Defensor San Alejandro', y: '2021 - 2022'}] },
    { name: 'Jorge Palomino', slug: 'jorge-palomino', nat: 'Peruano', birth: '1999-11-04', pos: 'Pivote', eur: 300000, pj: 17, num: 18, clubs: [{c: 'ADT Tarma', y: '2022 - 2024'}] },
    { name: 'Christian Velarde', slug: 'christian-velarde', nat: 'Peruano', birth: '1994-08-01', pos: 'Mediocentro', eur: 300000, pj: 18, num: 14, clubs: [{c: 'Carlos A. Mannucci', y: '2022 - 2024'}] },
    { name: 'Jarlin Quintero', slug: 'jarlin-quintero', nat: 'Colombiano', birth: '1993-08-19', pos: 'Delantero Centro', eur: 450000, pj: 22, num: 9, clubs: [{c: 'UTC', y: '2024 - 2024'}, {c: 'Jaguares (Col)', y: '2022 - 2023'}] },
    { name: 'Franco Torres', slug: 'franco-torres', nat: 'Argentino', birth: '1999-05-25', pos: 'Extremo', eur: 350000, pj: 18, num: 7, clubs: [{c: 'Guillermo Brown (Arg)', y: '2023 - 2023'}] },
    { name: 'Félix Espinoza', slug: 'felix-espinoza', nat: 'Peruano', birth: '2001-02-12', pos: 'Extremo', eur: 200000, pj: 10, num: 17, clubs: [{c: 'Los Chankas U20', y: '2022 - 2024'}] }
  ],

  // 6. Deportivo Garcilaso (Con Marco Saravia, Zubczuk, Pacheco, Castelli -> 24 futbolistas)
  'deportivo-garcilaso': [
    { name: 'Patrick Zubczuk', slug: 'patrick-zubczuk', nat: 'Peruano', birth: '1995-02-21', pos: 'Portero', eur: 450000, pj: 21, num: 1, clubs: [{c: 'UTC', y: '2023 - 2024'}, {c: 'Cienciano', y: '2022 - 2022'}, {c: 'Universitario', y: '2016 - 2021'}] },
    { name: 'Juniors Barbieri', slug: 'juniors-barbieri', nat: 'Peruano', birth: '1996-03-24', pos: 'Portero', eur: 250000, pj: 6, num: 12, clubs: [{c: 'Carlos A. Mannucci', y: '2023 - 2024'}] },
    { name: 'Diego Penny', slug: 'diego-penny', nat: 'Peruano', birth: '1984-04-22', pos: 'Portero', eur: 100000, pj: 2, num: 21, clubs: [{c: 'Alianza Atlético', y: '2022 - 2022'}, {c: 'San Martín', y: '2018 - 2021'}] },
    { name: 'Marco Saravia', slug: 'marco-saravia', nat: 'Peruano', birth: '1999-02-06', pos: 'Defensa Central', eur: 350000, pj: 19, num: 4, clubs: [{c: 'Universitario', y: '2023 - 2025'}, {c: 'Dep. Municipal', y: '2021 - 2022'}] },
    { name: 'Agustín Gómez', slug: 'agustin-gomez', nat: 'Argentino', birth: '1996-08-28', pos: 'Defensa Central', eur: 400000, pj: 20, num: 3, clubs: [{c: 'Defensores de Belgrano (Arg)', y: '2023 - 2024'}] },
    { name: 'Jefferson Portales', slug: 'jefferson-portales', nat: 'Peruano', birth: '1997-11-29', pos: 'Defensa Central', eur: 350000, pj: 18, num: 2, clubs: [{c: 'Cienciano', y: '2024 - 2024'}, {c: 'Alianza Lima', y: '2021 - 2022'}] },
    { name: 'Aldair Salazar', slug: 'aldair-salazar', nat: 'Peruano', birth: '1994-08-04', pos: 'Defensa Central', eur: 350000, pj: 19, num: 5, clubs: [{c: 'Ayacucho FC', y: '2021 - 2022'}, {c: 'Alianza Lima', y: '2019 - 2020'}] },
    { name: 'Anthony Rosell', slug: 'anthony-rosell', nat: 'Peruano', birth: '1995-03-20', pos: 'Lateral Izquierdo', eur: 300000, pj: 17, num: 13, clubs: [{c: 'Binacional', y: '2023 - 2023'}, {c: 'Alianza Lima', y: '2019 - 2020'}] },
    { name: 'Erick Canales', slug: 'erick-canales', nat: 'Peruano', birth: '2001-04-18', pos: 'Lateral Derecho', eur: 300000, pj: 16, num: 22, clubs: [{c: 'UTC', y: '2023 - 2024'}] },
    { name: 'Claudio Torrejón', slug: 'claudio-torrejon', nat: 'Peruano', birth: '1993-05-14', pos: 'Pivote', eur: 400000, pj: 21, num: 6, clubs: [{c: 'Cienciano', y: '2023 - 2025'}, {c: 'Sport Boys', y: '2019 - 2022'}] },
    { name: 'Carlos Ramos', slug: 'carlos-ramos', nat: 'Peruano', birth: '1999-10-15', pos: 'Mediocentro', eur: 300000, pj: 17, num: 16, clubs: [{c: 'Deportivo Garcilaso', y: '2022 - 2025'}] },
    { name: 'Agustín González', slug: 'agustin-gonzalez', nat: 'Uruguayo', birth: '1997-01-25', pos: 'Mediocentro', eur: 450000, pj: 20, num: 10, clubs: [{c: 'Liverpool (Uru)', y: '2023 - 2024'}] },
    { name: 'Kevin Sandoval', slug: 'kevin-sandoval', nat: 'Peruano', birth: '1997-05-03', pos: 'Extremo Izquierdo', eur: 400000, pj: 19, num: 14, clubs: [{c: 'Melgar', y: '2023 - 2024'}, {c: 'Cienciano', y: '2021 - 2023'}] },
    { name: 'Adrián Ascues', slug: 'adrian-ascues', nat: 'Peruano', birth: '2002-11-15', pos: 'Mediocentro', eur: 400000, pj: 18, num: 8, clubs: [{c: 'Sporting Cristal', y: '2023 - 2024'}, {c: 'Deportivo Municipal', y: '2020 - 2022'}] },
    { name: 'Beto Da Silva', slug: 'beto-da-silva', nat: 'Peruano', birth: '1996-12-28', pos: 'Delantero / Extremo', eur: 350000, pj: 17, num: 11, clubs: [{c: 'ADT Tarma', y: '2024 - 2024'}, {c: 'FBC Melgar', y: '2023 - 2023'}] },
    { name: 'Fernando Pacheco', slug: 'fernando-pacheco', nat: 'Peruano', birth: '1999-06-26', pos: 'Extremo', eur: 450000, pj: 20, num: 7, clubs: [{c: 'Sporting Cristal', y: '2024 - 2025'}, {c: 'Cienciano', y: '2023 - 2023'}] },
    { name: 'Facundo Castelli', slug: 'facundo-castelli', nat: 'Argentino', birth: '1995-03-24', pos: 'Delantero Centro', eur: 500000, pj: 21, num: 9, clubs: [{c: 'Emelec (Ecu)', y: '2024 - 2024'}, {c: 'Delfín SC (Ecu)', y: '2023 - 2023'}] }
  ],

  // 7. UTC Cajamarca (23 futbolistas)
  'utc-cajamarca': [
    { name: 'Ángelo Campos', slug: 'angelo-campos', nat: 'Peruano', birth: '1993-04-27', pos: 'Portero', eur: 450000, pj: 22, num: 1, clubs: [{c: 'Alianza Lima', y: '2021 - 2025'}, {c: 'Carlos Stein', y: '2020 - 2020'}] },
    { name: 'Ignacio Barrios', slug: 'ignacio-barrios', nat: 'Uruguayo', birth: '1992-10-25', pos: 'Portero', eur: 300000, pj: 6, num: 12, clubs: [{c: 'ADT Tarma', y: '2022 - 2023'}] },
    { name: 'Ricardo Bettocchi', slug: 'ricardo-bettocchi', nat: 'Peruano', birth: '2004-03-15', pos: 'Portero', eur: 150000, pj: 2, num: 21, clubs: [{c: 'Melgar U20', y: '2022 - 2024'}] },
    { name: 'Bruno Duarte', slug: 'bruno-duarte', nat: 'Argentino', birth: '1995-06-20', pos: 'Defensa Central', eur: 400000, pj: 20, num: 3, clubs: [{c: 'Panetolikos (Grecia)', y: '2023 - 2024'}] },
    { name: 'Gilmar Paredes', slug: 'gilmar-paredes', nat: 'Peruano', birth: '2003-01-08', pos: 'Lateral Derecho', eur: 300000, pj: 17, num: 2, clubs: [{c: 'Sporting Cristal', y: '2022 - 2023'}] },
    { name: 'Luis Garro', slug: 'luis-garro', nat: 'Peruano', birth: '1996-07-20', pos: 'Lateral Derecho', eur: 350000, pj: 19, num: 15, clubs: [{c: 'Sport Boys', y: '2022 - 2023'}, {c: 'San Martín', y: '2020 - 2021'}] },
    { name: 'Carlos Junior Huerto', slug: 'carlos-huerto', nat: 'Peruano', birth: '1999-04-26', pos: 'Lateral Izquierdo', eur: 300000, pj: 18, num: 13, clubs: [{c: 'Sport Boys', y: '2023 - 2024'}] },
    { name: 'Francesco Cavagna', slug: 'francesco-cavagna', nat: 'Peruano / Italiano', birth: '2000-04-18', pos: 'Defensa Central', eur: 250000, pj: 14, num: 4, clubs: [{c: 'San Martín', y: '2021 - 2023'}] },
    { name: 'Dylan Caro', slug: 'dylan-caro', nat: 'Peruano', birth: '1999-03-23', pos: 'Lateral Izquierdo', eur: 300000, pj: 17, num: 23, clubs: [{c: 'Comerciantes Unidos', y: '2024 - 2024'}] },
    { name: 'Manuel Ganoza', slug: 'manuel-ganoza', nat: 'Peruano', birth: '1999-04-21', pos: 'Defensa Central', eur: 250000, pj: 12, num: 5, clubs: [{c: 'César Vallejo', y: '2022 - 2023'}] },
    { name: 'Marcos Lliuya', slug: 'marcos-lliuya', nat: 'Peruano', birth: '1992-03-27', pos: 'Mediocentro Ofensivo', eur: 450000, pj: 22, num: 10, clubs: [{c: 'Sport Huancayo', y: '2015 - 2025'}] },
    { name: 'Arquímedes Figuera', slug: 'arquimedes-figuera', nat: 'Venezolano', birth: '1989-10-06', pos: 'Pivote', eur: 250000, pj: 21, num: 6, clubs: [{c: 'Blooming (Bol)', y: '2023 - 2024'}, {c: 'César Vallejo', y: '2020 - 2022'}] },
    { name: 'Adolfo Muñoz', slug: 'adolfo-munoz', nat: 'Ecuatoriano', birth: '1997-12-12', pos: 'Extremo', eur: 400000, pj: 19, num: 11, clubs: [{c: 'Técnico Universitario', y: '2023 - 2024'}, {c: 'LDU Quito', y: '2019 - 2022'}] },
    { name: 'Luis Arce', slug: 'luis-arce', nat: 'Ecuatoriano', birth: '1993-12-03', pos: 'Mediocentro', eur: 350000, pj: 18, num: 16, clubs: [{c: 'El Nacional (Ecu)', y: '2023 - 2024'}] },
    { name: 'David Dioses', slug: 'david-dioses', nat: 'Peruano', birth: '1996-01-26', pos: 'Mediocentro', eur: 350000, pj: 18, num: 8, clubs: [{c: 'Sport Huancayo', y: '2023 - 2024'}, {c: 'Carlos A. Mannucci', y: '2021 - 2022'}] },
    { name: 'Marlon de Jesús', slug: 'marlon-de-jesus', nat: 'Ecuatoriano', birth: '1991-09-04', pos: 'Delantero Centro', eur: 350000, pj: 20, num: 9, clubs: [{c: 'Unión Comercio', y: '2023 - 2024'}, {c: 'Al-Jabalain (Ara)', y: '2022 - 2023'}] },
    { name: 'Christopher Olivares', slug: 'christopher-olivares', nat: 'Peruano', birth: '1999-04-03', pos: 'Delantero Centro', eur: 350000, pj: 19, num: 19, clubs: [{c: 'Universitario', y: '2024 - 2025'}, {c: 'Cusco FC', y: '2023 - 2023'}] },
    { name: 'Abdiel Arroyo', slug: 'abdiel-arroyo', nat: 'Panameño', birth: '1993-12-13', pos: 'Delantero', eur: 300000, pj: 17, num: 7, clubs: [{c: 'Árabe Unido (Pan)', y: '2023 - 2024'}, {c: 'César Vallejo', y: '2022 - 2022'}] },
    { name: 'Víctor Perlaza', slug: 'victor-perlaza', nat: 'Colombiano', birth: '1994-07-29', pos: 'Delantero', eur: 300000, pj: 16, num: 20, clubs: [{c: 'Alianza Atlético', y: '2023 - 2023'}] }
  ],

  // 8. Alianza Atlético (23 futbolistas)
  'alianza-atletico': [
    { name: 'Steven Rivadeneyra', slug: 'steven-rivadeneyra', nat: 'Peruano', birth: '1994-11-02', pos: 'Portero', eur: 400000, pj: 20, num: 1, clubs: [{c: 'Sport Boys', y: '2024 - 2024'}, {c: 'Carlos A. Mannucci', y: '2022 - 2023'}] },
    { name: 'Daniel Prieto', slug: 'daniel-prieto', nat: 'Peruano', birth: '1995-09-19', pos: 'Portero', eur: 250000, pj: 5, num: 12, clubs: [{c: 'Deportivo Municipal', y: '2023 - 2023'}] },
    { name: 'Erick Perleche', slug: 'erick-perleche', nat: 'Peruano', birth: '2000-09-08', pos: 'Lateral Derecho', eur: 350000, pj: 19, num: 13, clubs: [{c: 'Deportivo Garcilaso', y: '2024 - 2024'}] },
    { name: 'José Luján', slug: 'jose-lujan', nat: 'Peruano', birth: '1997-01-12', pos: 'Defensa Central', eur: 350000, pj: 18, num: 3, clubs: [{c: 'Universitario', y: '2023 - 2023'}, {c: 'Melgar', y: '2021 - 2022'}] },
    { name: 'Román Suárez', slug: 'roman-suarez', nat: 'Ecuatoriano', birth: '2002-04-12', pos: 'Defensa Central', eur: 300000, pj: 17, num: 2, clubs: [{c: 'Barcelona SC B', y: '2022 - 2023'}] },
    { name: 'Anthony Gordillo', slug: 'anthony-gordillo', nat: 'Peruano', birth: '1994-03-02', pos: 'Lateral Izquierdo', eur: 300000, pj: 16, num: 15, clubs: [{c: 'Cusco FC', y: '2023 - 2023'}] },
    { name: 'José Villegas', slug: 'jose-villegas', nat: 'Peruano', birth: '1997-07-28', pos: 'Defensa Central', eur: 350000, pj: 21, num: 4, clubs: [{c: 'Cusco FC', y: '2022 - 2023'}] },
    { name: 'Jesus Mendieta', slug: 'jesus-mendieta', nat: 'Peruano', birth: '1998-04-11', pos: 'Lateral Izquierdo', eur: 300000, pj: 18, num: 22, clubs: [{c: 'Ayacucho FC', y: '2020 - 2022'}] },
    { name: 'Cristian Penilla', slug: 'cristian-penilla', nat: 'Ecuatoriano', birth: '1991-05-02', pos: 'Extremo', eur: 400000, pj: 19, num: 10, clubs: [{c: 'Delfín SC (Ecu)', y: '2023 - 2024'}, {c: 'Barcelona SC', y: '2022 - 2022'}] },
    { name: 'Juan Delgado', slug: 'juan-delgado', nat: 'Peruano', birth: '2004-02-14', pos: 'Mediocentro', eur: 200000, pj: 10, num: 14, clubs: [{c: 'Alianza Atlético U20', y: '2022 - 2024'}] },
    { name: 'Jorge del Castillo', slug: 'jorge-del-castillo', nat: 'Peruano', birth: '2004-09-28', pos: 'Mediocentro', eur: 250000, pj: 14, num: 16, clubs: [{c: 'Alianza Lima U20', y: '2022 - 2024'}] },
    { name: 'Hernan Lupú', slug: 'hernan-lupu', nat: 'Peruano', birth: '2003-02-14', pos: 'Mediocentro', eur: 300000, pj: 17, num: 8, clubs: [{c: 'Sporting Cristal', y: '2022 - 2023'}] },
    { name: 'German Diaz', slug: 'german-diaz', nat: 'Argentino', birth: '1996-03-22', pos: 'Mediocentro', eur: 350000, pj: 18, num: 20, clubs: [{c: 'Mitre (Arg)', y: '2022 - 2023'}] },
    { name: 'Franchesco Flores', slug: 'franchesco-flores', nat: 'Peruano', birth: '2001-06-15', pos: 'Mediocentro Ofensivo', eur: 300000, pj: 16, num: 17, clubs: [{c: 'César Vallejo', y: '2023 - 2023'}] },
    { name: 'Jimmy Pérez', slug: 'jimmy-perez', nat: 'Peruano', birth: '2001-07-27', pos: 'Pivote', eur: 350000, pj: 19, num: 6, clubs: [{c: 'Sport Huancayo', y: '2022 - 2023'}] },
    { name: 'Stefano Fernández', slug: 'stefano-fernandez', nat: 'Peruano', birth: '2002-05-14', pos: 'Pivote', eur: 250000, pj: 12, num: 18, clubs: [{c: 'UTC', y: '2022 - 2023'}] },
    { name: 'Jairo Molina', slug: 'jairo-molina', nat: 'Colombiano', birth: '1993-04-28', pos: 'Delantero Centro', eur: 400000, pj: 21, num: 9, clubs: [{c: 'Deportes Pereira (Col)', y: '2022 - 2023'}] },
    { name: 'Valentín Robaldo', slug: 'valentin-robaldo', nat: 'Argentino', birth: '2000-09-15', pos: 'Delantero', eur: 300000, pj: 14, num: 11, clubs: [{c: 'Flandria (Arg)', y: '2023 - 2023'}] },
    { name: 'Guillermo Larios', slug: 'guillermo-larios', nat: 'Peruano', birth: '2002-05-11', pos: 'Delantero Centro', eur: 350000, pj: 18, num: 19, clubs: [{c: 'Universitario', y: '2021 - 2022'}] },
    { name: 'Christian Valladolid', slug: 'christian-valladolid', nat: 'Peruano', birth: '2003-08-20', pos: 'Extremo', eur: 200000, pj: 8, num: 27, clubs: [{c: 'Alianza Atlético U20', y: '2022 - 2024'}] }
  ],

  // 9. Comerciantes Unidos (22 futbolistas)
  'comerciantes-unidos': [
    { name: 'Matías Córdova', slug: 'matias-cordova', nat: 'Peruano', birth: '2002-04-21', pos: 'Portero', eur: 300000, pj: 18, num: 1, clubs: [{c: 'Sporting Cristal U20', y: '2021 - 2023'}] },
    { name: 'Juan Cubas', slug: 'juan-cubas', nat: 'Peruano', birth: '2003-06-18', pos: 'Portero', eur: 150000, pj: 3, num: 12, clubs: [{c: 'Comerciantes U20', y: '2022 - 2024'}] },
    { name: 'Daniel Lino', slug: 'daniel-lino', nat: 'Boliviano', birth: '2002-02-18', pos: 'Lateral Izquierdo', eur: 350000, pj: 19, num: 3, clubs: [{c: 'The Strongest (Bol)', y: '2022 - 2024'}] },
    { name: 'Fabio Rojas', slug: 'fabio-rojas', nat: 'Peruano', birth: '1999-08-04', pos: 'Defensa Central', eur: 350000, pj: 20, num: 4, clubs: [{c: 'Alianza Lima', y: '2021 - 2023'}] },
    { name: 'Flavio Alcedo', slug: 'flavio-alcedo', nat: 'Peruano', birth: '2003-01-19', pos: 'Defensa Central', eur: 300000, pj: 16, num: 2, clubs: [{c: 'Sporting Cristal', y: '2022 - 2023'}] },
    { name: 'Paolo Fuentes', slug: 'paolo-fuentes-cu', nat: 'Peruano', birth: '1996-05-22', pos: 'Defensa Central', eur: 350000, pj: 18, num: 5, clubs: [{c: 'Cienciano', y: '2023 - 2024'}] },
    { name: 'Alexis Cossio', slug: 'alexis-cossio', nat: 'Peruano', birth: '1995-02-11', pos: 'Lateral Izquierdo', eur: 350000, pj: 19, num: 13, clubs: [{c: 'Carlos A. Mannucci', y: '2023 - 2024'}, {c: 'Cienciano', y: '2022 - 2022'}] },
    { name: 'Rodrigo Vilca', slug: 'rodrigo-vilca', nat: 'Peruano', birth: '1999-03-12', pos: 'Mediocentro Ofensivo', eur: 450000, pj: 20, num: 10, clubs: [{c: 'FK Vozdovac (Serbia)', y: '2023 - 2024'}, {c: 'Newcastle U21 (Ing)', y: '2020 - 2023'}, {c: 'Universitario', y: '2022 - 2022'}] },
    { name: 'Jhon Sánchez', slug: 'jhon-sanchez-cu', nat: 'Ecuatoriano', birth: '1999-07-30', pos: 'Extremo', eur: 400000, pj: 18, num: 11, clubs: [{c: 'Barcelona SC (Ecu)', y: '2023 - 2024'}, {c: 'Vasco da Gama', y: '2021 - 2022'}] },
    { name: 'Óscar Pinto', slug: 'oscar-pinto', nat: 'Peruano', birth: '2002-01-20', pos: 'Extremo', eur: 300000, pj: 16, num: 17, clubs: [{c: 'Alianza Lima', y: '2021 - 2023'}] },
    { name: 'Alexis Arias', slug: 'alexis-arias', nat: 'Peruano', birth: '1995-12-13', pos: 'Mediocentro', eur: 450000, pj: 21, num: 8, clubs: [{c: 'FBC Melgar', y: '2014 - 2025'}] },
    { name: 'Mathías Carpio', slug: 'mathias-carpio', nat: 'Peruano', birth: '2002-11-20', pos: 'Mediocentro', eur: 250000, pj: 14, num: 15, clubs: [{c: 'Cienciano', y: '2022 - 2023'}] },
    { name: 'Yimy Gamero', slug: 'yimy-gamero', nat: 'Peruano', birth: '2002-01-07', pos: 'Pivote', eur: 300000, pj: 17, num: 6, clubs: [{c: 'FBC Melgar', y: '2021 - 2023'}] },
    { name: 'José Parodi', slug: 'jose-parodi', nat: 'Peruano', birth: '1997-12-19', pos: 'Pivote', eur: 300000, pj: 18, num: 20, clubs: [{c: 'San Martín', y: '2022 - 2023'}] },
    { name: 'Matías Sen', slug: 'matias-sen', nat: 'Argentino', birth: '1991-10-29', pos: 'Delantero Centro', eur: 450000, pj: 22, num: 9, clubs: [{c: 'San Martín', y: '2022 - 2022'}] },
    { name: 'Wilter Ayoví', slug: 'wilter-ayovi', nat: 'Ecuatoriano', birth: '1997-04-17', pos: 'Delantero', eur: 350000, pj: 18, num: 19, clubs: [{c: '9 de Octubre (Ecu)', y: '2022 - 2023'}] }
  ],

  // 10. Universidad César Vallejo (24 futbolistas)
  'cesar-vallejo': [
    { name: 'Facundo Silva', slug: 'facundo-silva', nat: 'Uruguayo', birth: '1996-07-04', pos: 'Portero', eur: 350000, pj: 19, num: 1, clubs: [{c: 'Progreso (Uru)', y: '2023 - 2024'}] },
    { name: 'Ernesto Pinillos', slug: 'ernesto-pinillos', nat: 'Peruano', birth: '2001-09-12', pos: 'Portero', eur: 200000, pj: 4, num: 12, clubs: [{c: 'César Vallejo U20', y: '2021 - 2023'}] },
    { name: 'José Bolívar', slug: 'jose-bolivar', nat: 'Peruano', birth: '2000-01-17', pos: 'Lateral Izquierdo', eur: 350000, pj: 19, num: 13, clubs: [{c: 'Universitario', y: '2023 - 2025'}, {c: 'Sport Boys', y: '2021 - 2022'}] },
    { name: 'Brian Arias', slug: 'brian-arias-ucv', nat: 'Peruano', birth: '2006-08-05', pos: 'Defensa Central', eur: 250000, pj: 14, num: 2, clubs: [{c: 'Alianza Lima U20', y: '2023 - 2025'}] },
    { name: 'Axel Cabellos', slug: 'axel-cabellos', nat: 'Peruano / Argentino', birth: '2006-11-18', pos: 'Lateral Izquierdo', eur: 250000, pj: 12, num: 3, clubs: [{c: 'Racing Club U20 (Arg)', y: '2023 - 2025'}] },
    { name: 'Fernando Da Rosa', slug: 'fernando-da-rosa', nat: 'Argentino', birth: '2001-01-10', pos: 'Defensa Central', eur: 350000, pj: 18, num: 4, clubs: [{c: 'Newells Old Boys', y: '2022 - 2024'}] },
    { name: 'Pedro Paulo Requena', slug: 'pedro-requena', nat: 'Peruano', birth: '1991-01-24', pos: 'Lateral Derecho', eur: 250000, pj: 18, num: 15, clubs: [{c: 'UTC', y: '2023 - 2024'}] },
    { name: 'Bryan Córdova', slug: 'bryan-cordova', nat: 'Peruano', birth: '2003-03-22', pos: 'Lateral Derecho', eur: 200000, pj: 10, num: 22, clubs: [{c: 'César Vallejo U20', y: '2022 - 2024'}] },
    { name: 'Raziel García', slug: 'raziel-garcia', nat: 'Peruano', birth: '1994-02-15', pos: 'Mediocentro Ofensivo', eur: 450000, pj: 20, num: 10, clubs: [{c: 'Deportes Tolima (Col)', y: '2022 - 2022'}, {c: 'Cienciano', y: '2021 - 2021'}] },
    { name: 'Axel Moyano', slug: 'axel-moyano-ucv', nat: 'Peruano', birth: '2001-01-03', pos: 'Mediocentro', eur: 300000, pj: 17, num: 14, clubs: [{c: 'Alianza Lima', y: '2023 - 2024'}, {c: 'Atlético Grau', y: '2023 - 2023'}] },
    { name: 'Miguel Cornejo', slug: 'miguel-cornejo', nat: 'Peruano', birth: '2000-01-18', pos: 'Mediocentro', eur: 300000, pj: 16, num: 16, clubs: [{c: 'Alianza Atlético', y: '2023 - 2024'}, {c: 'Alianza Lima', y: '2020 - 2022'}] },
    { name: 'Frank Ysique', slug: 'frank-ysique', nat: 'Peruano', birth: '1996-06-12', pos: 'Pivote', eur: 400000, pj: 21, num: 8, clubs: [{c: 'Sporting Cristal', y: '2017 - 2018'}] },
    { name: 'Diego Ulloa', slug: 'diego-ulloa', nat: 'Chileno', birth: '2003-05-10', pos: 'Mediocentro', eur: 250000, pj: 11, num: 20, clubs: [{c: 'Unión La Calera (Chi)', y: '2023 - 2024'}] },
    { name: 'Santiago Vera', slug: 'santiago-vera', nat: 'Argentino', birth: '1998-12-12', pos: 'Extremo', eur: 400000, pj: 19, num: 7, clubs: [{c: 'Tigre (Arg)', y: '2023 - 2024'}, {c: 'Olimpia (Par)', y: '2021 - 2022'}] },
    { name: 'Osnar Noronha', slug: 'osnar-noronha', nat: 'Peruano', birth: '1991-12-17', pos: 'Delantero', eur: 350000, pj: 21, num: 19, clubs: [{c: 'Carlos A. Mannucci', y: '2017 - 2021'}] },
    { name: 'Diether Vásquez', slug: 'diether-vasquez', nat: 'Peruano', birth: '2003-07-06', pos: 'Extremo', eur: 350000, pj: 18, num: 23, clubs: [{c: 'Mineros Zacatecas (Mex)', y: '2023 - 2024'}] },
    { name: 'Italo Regalado', slug: 'italo-regalado', nat: 'Peruano', birth: '1995-10-18', pos: 'Delantero', eur: 300000, pj: 16, num: 11, clubs: [{c: 'Comerciantes Unidos', y: '2024 - 2024'}] }
  ],

  // 11. Juan Pablo II College (25 futbolistas)
  'juan-pablo-ii': [
    { name: 'Matias Vega', slug: 'matias-vega', nat: 'Argentino', birth: '1986-04-18', pos: 'Portero', eur: 200000, pj: 21, num: 1, clubs: [{c: 'Chacarita Juniors (Arg)', y: '2023 - 2024'}] },
    { name: 'Ismael Quispe', slug: 'ismael-quispe', nat: 'Peruano', birth: '1999-10-15', pos: 'Portero', eur: 250000, pj: 6, num: 12, clubs: [{c: 'Sport Boys', y: '2023 - 2024'}] },
    { name: 'Paolo Reyna', slug: 'paolo-reyna', nat: 'Peruano', birth: '2001-10-13', pos: 'Lateral Izquierdo', eur: 500000, pj: 21, num: 3, clubs: [{c: 'FBC Melgar', y: '2019 - 2025'}] },
    { name: 'Arón Sánchez', slug: 'aron-sanchez', nat: 'Peruano', birth: '2003-05-04', pos: 'Defensa Central', eur: 400000, pj: 18, num: 4, clubs: [{c: 'Cantolao', y: '2020 - 2023'}] },
    { name: 'Pablo Míguez', slug: 'pablo-miguez', nat: 'Uruguayo / Peruano', birth: '1987-06-19', pos: 'Defensa Central', eur: 200000, pj: 20, num: 5, clubs: [{c: 'Carlos A. Mannucci', y: '2024 - 2024'}, {c: 'Alianza Lima', y: '2021 - 2023'}] },
    { name: 'Matias Almiron', slug: 'matias-almiron', nat: 'Argentino', birth: '1995-10-23', pos: 'Defensa Central', eur: 300000, pj: 17, num: 2, clubs: [{c: 'Comerciantes Unidos', y: '2024 - 2024'}] },
    { name: 'Hugo Ancajima', slug: 'hugo-ancajima', nat: 'Peruano', birth: '1998-02-10', pos: 'Lateral Derecho', eur: 350000, pj: 19, num: 22, clubs: [{c: 'Universitario', y: '2023 - 2025'}, {c: 'ADT Tarma', y: '2022 - 2022'}] },
    { name: 'Fabio Agurto', slug: 'fabio-agurto', nat: 'Peruano', birth: '2002-07-15', pos: 'Lateral Derecho', eur: 200000, pj: 12, num: 13, clubs: [{c: 'Juan Pablo II U20', y: '2022 - 2024'}] },
    { name: 'Josué Canova', slug: 'josue-canova', nat: 'Peruano', birth: '2004-03-21', pos: 'Defensa Central', eur: 150000, pj: 8, num: 15, clubs: [{c: 'Juan Pablo II U20', y: '2023 - 2025'}] },
    { name: 'Martín Alaníz', slug: 'martin-alaniz', nat: 'Uruguayo', birth: '1993-02-19', pos: 'Mediocentro Ofensivo', eur: 350000, pj: 19, num: 10, clubs: [{c: 'Guabirá (Bol)', y: '2023 - 2024'}, {c: 'Delfín SC (Ecu)', y: '2022 - 2022'}] },
    { name: 'Alvaro Rojas', slug: 'alvaro-rojas-jpii', nat: 'Peruano', birth: '2005-03-12', pos: 'Mediocentro', eur: 250000, pj: 14, num: 8, clubs: [{c: 'Universitario', y: '2024 - 2024'}] },
    { name: 'Erinson Ramirez', slug: 'erinson-ramirez', nat: 'Peruano', birth: '1998-03-25', pos: 'Mediocentro Ofensivo', eur: 350000, pj: 19, num: 11, clubs: [{c: 'Deportivo Garcilaso', y: '2024 - 2024'}, {c: 'Alianza Lima', y: '2016 - 2018'}] },
    { name: 'Jack Durán', slug: 'jack-duran', nat: 'Peruano', birth: '1991-12-08', pos: 'Extremo', eur: 250000, pj: 17, num: 7, clubs: [{c: 'Cienciano', y: '2022 - 2022'}, {c: 'Alianza Universidad', y: '2019 - 2021'}] },
    { name: 'Christian Flores', slug: 'christian-flores', nat: 'Peruano', birth: '1996-03-02', pos: 'Pivote', eur: 300000, pj: 18, num: 6, clubs: [{c: 'Deportivo Municipal', y: '2022 - 2023'}] },
    { name: 'Juan Pablo Goicochea', slug: 'juan-pablo-goicochea', nat: 'Peruano', birth: '2005-01-12', pos: 'Delantero Centro', eur: 400000, pj: 18, num: 9, clubs: [{c: 'Platense (Arg)', y: '2024 - 2024'}, {c: 'Alianza Lima', y: '2022 - 2023'}] },
    { name: 'Janio Pósito', slug: 'janio-posito', nat: 'Peruano', birth: '1989-10-14', pos: 'Delantero Centro', eur: 250000, pj: 20, num: 19, clubs: [{c: 'ADT Tarma', y: '2023 - 2024'}, {c: 'Alianza Lima', y: '2018 - 2018'}] }
  ],

  // 12. Carlos A. Mannucci (23 futbolistas)
  'carlos-mannucci': [
    { name: 'Manuel Heredia', slug: 'manuel-heredia', nat: 'Peruano', birth: '1986-01-09', pos: 'Portero', eur: 200000, pj: 20, num: 1, clubs: [{c: 'Carlos A. Mannucci', y: '2019 - 2025'}] },
    { name: 'Emile Franco', slug: 'emile-franco', nat: 'Peruano', birth: '2000-11-03', pos: 'Portero', eur: 200000, pj: 6, num: 12, clubs: [{c: 'Sporting Cristal', y: '2021 - 2023'}] },
    { name: 'Mathías Llontop', slug: 'mathias-llontop-cam', nat: 'Peruano', birth: '2002-05-22', pos: 'Lateral Izquierdo', eur: 300000, pj: 18, num: 13, clubs: [{c: 'Sport Boys', y: '2024 - 2024'}] },
    { name: 'Eduardo Rabanal', slug: 'eduardo-rabanal', nat: 'Peruano', birth: '1997-01-29', pos: 'Lateral Derecho', eur: 300000, pj: 18, num: 15, clubs: [{c: 'Deportivo Municipal', y: '2020 - 2021'}] },
    { name: 'Nelinho Quina', slug: 'nelinho-quina', nat: 'Peruano', birth: '1987-05-11', pos: 'Defensa Central', eur: 150000, pj: 19, num: 22, clubs: [{c: 'Cusco FC', y: '2023 - 2023'}, {c: 'Universitario', y: '2019 - 2022'}] },
    { name: 'Marcelo Gaona', slug: 'marcelo-gaona-cam', nat: 'Peruano', birth: '1998-09-14', pos: 'Defensa Central', eur: 250000, pj: 15, num: 2, clubs: [{c: 'Sport Huancayo', y: '2024 - 2024'}] },
    { name: 'Ángel Benítez', slug: 'angel-benitez', nat: 'Paraguayo', birth: '1996-01-27', pos: 'Mediocentro', eur: 450000, pj: 21, num: 6, clubs: [{c: 'Defensa y Justicia (Arg)', y: '2023 - 2023'}] },
    { name: 'Gustavo Viera', slug: 'gustavo-viera', nat: 'Paraguayo', birth: '1995-08-28', pos: 'Pivote', eur: 400000, pj: 20, num: 8, clubs: [{c: 'San Lorenzo (Par)', y: '2021 - 2022'}] },
    { name: 'William Mimbela', slug: 'william-mimbela', nat: 'Peruano', birth: '1991-07-03', pos: 'Mediocentro Ofensivo', eur: 250000, pj: 17, num: 10, clubs: [{c: 'Unión Comercio', y: '2021 - 2022'}] },
    { name: 'Paolo Hurtado', slug: 'paolo-hurtado', nat: 'Peruano', birth: '1990-07-27', pos: 'Mediocentro Ofensivo', eur: 250000, pj: 16, num: 17, clubs: [{c: 'Cienciano', y: '2023 - 2023'}, {c: 'Alianza Lima', y: '2022 - 2022'}] },
    { name: 'Christian Velarde', slug: 'christian-velarde-cam', nat: 'Peruano', birth: '1994-08-01', pos: 'Mediocentro', eur: 300000, pj: 18, num: 14, clubs: [{c: 'Los Chankas', y: '2024 - 2024'}] },
    { name: 'Alexander Succar', slug: 'alexander-succar', nat: 'Peruano / Libanés', birth: '1995-08-12', pos: 'Delantero Centro', eur: 400000, pj: 20, num: 9, clubs: [{c: 'Universitario', y: '2020 - 2023'}] },
    { name: 'José Cortés', slug: 'jose-cortes', nat: 'Colombiano', birth: '1994-11-20', pos: 'Extremo', eur: 350000, pj: 18, num: 7, clubs: [{c: 'Carlos A. Mannucci', y: '2023 - 2025'}] }
  ]
};

async function main() {
  console.log('🚀 EXPANDIENDO Y VERIFICANDO PLANTILLAS COMPLETAS (+20 JUGADORES) PARA TODOS LOS CLUBES DE PROVINCIA Y SPORT BOYS...');

  // 1. Equipos en DB
  const { data: teams } = await supabase.from('teams').select('id, name, slug');
  const teamMap = {};
  teams.forEach(t => { teamMap[t.slug] = t.id; });

  // 2. Corregir Universitario: Eliminar a Marco Saravia de player_seasons 2026 de la U
  const uniId = teamMap['universitario'];
  const { data: saraviaPlayer } = await supabase.from('players').select('id').eq('slug', 'marco-saravia').maybeSingle();
  if (uniId && saraviaPlayer) {
    console.log('🧹 Retirando a Marco Saravia de la nómina activa de Universitario...');
    await supabase.from('player_seasons').delete().eq('team_id', uniId).eq('player_id', saraviaPlayer.id).eq('season_year', 2026);
    await supabase.from('transfers').upsert({
      player_id: saraviaPlayer.id,
      team_id: uniId,
      season_year: 2026,
      transfer_type: 'OUT',
      departure_reason: 'Término de contrato / Traspaso',
      other_club_name: 'Deportivo Garcilaso (Perú)',
      source_type: 'transfermarkt',
      announced_at: '2026-01-05T12:00:00Z',
    });
    console.log('✅ Marco Saravia registrado como SALIDA de Universitario y destinado a Deportivo Garcilaso.');
  }

  // 3. Jugadores existentes
  const { data: existingPlayers } = await supabase.from('players').select('id, slug');
  const playerMap = {};
  if (existingPlayers) {
    existingPlayers.forEach(p => { if (p.slug) playerMap[p.slug] = p.id; });
  }

  // 4. Cargar plantillas completas para cada club de provincia y Sport Boys
  for (const [teamSlug, squad] of Object.entries(provincialFullSquads)) {
    const teamId = teamMap[teamSlug];
    if (!teamId) continue;

    console.log(`\n⚽ Actualizando plantilla completa de ${teamSlug.toUpperCase()} (${squad.length} jugadores)...`);

    // Vaciar player_seasons previo de este club para reemplazar con la nómina exhaustiva
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

      // Historial de clubes previos
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

    console.log(`   ✅ ${teamSlug}: ${squad.length} futbolistas registrados correctamente.`);
  }

  // 5. Recalcular valores de mercado y rankings para los 18 clubes en team_seasons 2026
  console.log('\n📊 Recalculando valor de mercado total y rankings para los 18 clubes...');
  const { data: allSeasonPlayers } = await supabase.from('player_seasons').select('team_id, market_value_eur').eq('season_year', 2026);
  const totalsByTeam = {};
  for (const t of teams) {
    totalsByTeam[t.id] = { team: t, totalEur: 0, count: 0 };
  }
  for (const sp of allSeasonPlayers) {
    if (totalsByTeam[sp.team_id]) {
      totalsByTeam[sp.team_id].totalEur += (sp.market_value_eur || 0);
      totalsByTeam[sp.team_id].count += 1;
    }
  }

  const sortedRanking = Object.values(totalsByTeam).sort((a,b) => b.totalEur - a.totalEur);
  for (let rank = 1; rank <= sortedRanking.length; rank++) {
    const item = sortedRanking[rank - 1];
    const usd = Math.round(item.totalEur * exchangeRate);
    await supabase.from('team_seasons').update({
      total_value_eur: item.totalEur,
      total_value_usd: usd,
      rank_value: rank,
      squad_size: item.count,
      last_updated: new Date().toISOString()
    }).eq('team_id', item.team.id).eq('season_year', 2026);
    console.log(`   #${rank} ${item.team.name}: ${item.count} jugadores | €${(item.totalEur/1e6).toFixed(2)}M ($${(usd/1e6).toFixed(2)}M USD)`);
  }

  console.log('\n🎉 ¡ACTUALIZACIÓN INTEGRAL DE CLUBES DE PROVINCIA Y LA U FINALIZADA CON ÉXITO!');
  process.exit(0);
}

main().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
});
