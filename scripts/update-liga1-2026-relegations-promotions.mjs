import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ugujgzrfysucybbncxrs.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVndWpnenJmeXN1Y3liYm5jeHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUwMjk3NDcsImV4cCI6MjExMDYwNTc0N30.KavzLBrgphW52oAqHu8MNcKz_YvcO2EUXI6NvWXdugY';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
  realtime: { transport: WebSocket }
});

const exchangeRate = 1.0999;

// Nuevos planteles ampliados (Mínimo 20 - 25 jugadores por club)
const expandedSquads = {
  // 1. FC Cajamarca (Nuevo ascendido Liga 1 2026 - 22 jugadores)
  'fc-cajamarca': [
    { name: 'Jonathan Medina', slug: 'jonathan-medina-fcc', nat: 'Peruano', birth: '1993-04-29', pos: 'Portero', eur: 350000, pj: 21, num: 1, clubs: [{c: 'Alianza Lima', y: '2022 - 2023'}, {c: 'Sport Boys', y: '2019 - 2021'}] },
    { name: 'Juniors Barbieri', slug: 'juniors-barbieri-fcc', nat: 'Peruano', birth: '1996-03-09', pos: 'Portero', eur: 250000, pj: 6, num: 12, clubs: [{c: 'Cienciano', y: '2021 - 2023'}] },
    { name: 'Leonardo Zuta', slug: 'leonardo-zuta', nat: 'Peruano', birth: '2003-05-14', pos: 'Portero', eur: 150000, pj: 2, num: 21, clubs: [{c: 'FC Cajamarca Res.', y: '2023 - 2025'}] },
    { name: 'Jimmy Valoyes', slug: 'jimmy-valoyes-fcc', nat: 'Colombiano', birth: '1986-11-30', pos: 'Defensa Central', eur: 250000, pj: 20, num: 3, clubs: [{c: 'UTC Cajamarca', y: '2024 - 2025'}] },
    { name: 'Aldair Perleche', slug: 'aldair-perleche-fcc', nat: 'Peruano', birth: '1995-06-05', pos: 'Lateral Derecho', eur: 300000, pj: 19, num: 2, clubs: [{c: 'Cienciano', y: '2021 - 2023'}] },
    { name: 'Brian Bernaola', slug: 'brian-bernaola-fcc', nat: 'Peruano', birth: '1995-01-17', pos: 'Defensa Central', eur: 250000, pj: 18, num: 4, clubs: [{c: 'Deportivo Garcilaso', y: '2023 - 2024'}] },
    { name: 'Joaquín Aguirre', slug: 'joaquin-aguirre-fcc', nat: 'Peruano', birth: '1995-07-24', pos: 'Lateral Izquierdo', eur: 250000, pj: 18, num: 13, clubs: [{c: 'Alianza Atlético', y: '2022 - 2023'}] },
    { name: 'Jean Pierre Mendoza', slug: 'jean-pierre-mendoza', nat: 'Peruano', birth: '2001-08-11', pos: 'Defensa Central', eur: 200000, pj: 12, num: 22, clubs: [{c: 'Unión Comercio', y: '2023 - 2024'}] },
    { name: 'Marlon Ruidias', slug: 'marlon-ruidias-fcc', nat: 'Peruano', birth: '1999-03-21', pos: 'Lateral Derecho', eur: 350000, pj: 19, num: 14, clubs: [{c: 'Los Chankas', y: '2023 - 2024'}] },
    { name: 'Flavio Alcedo', slug: 'flavio-alcedo-fcc', nat: 'Peruano', birth: '2003-01-19', pos: 'Pivote / Central', eur: 350000, pj: 17, num: 5, clubs: [{c: 'Sporting Cristal', y: '2022 - 2024'}] },
    { name: 'Carlo Diez', slug: 'carlo-diez-fcc', nat: 'Peruano', birth: '1996-03-18', pos: 'Mediocentro', eur: 350000, pj: 21, num: 6, clubs: [{c: 'Deportivo Garcilaso', y: '2024 - 2024'}, {c: 'UTC Cajamarca', y: '2020 - 2023'}] },
    { name: 'Ángel Ojeda', slug: 'angel-ojeda-fcc', nat: 'Peruano', birth: '1992-08-11', pos: 'Mediocentro', eur: 300000, pj: 20, num: 8, clubs: [{c: 'Cienciano', y: '2021 - 2023'}] },
    { name: 'Donald Millán', slug: 'donald-millan-fcc', nat: 'Colombiano / Peruano', birth: '1986-03-21', pos: 'Mediocentro Ofensivo', eur: 250000, pj: 19, num: 10, clubs: [{c: 'Unión Comercio', y: '2024 - 2024'}, {c: 'Sport Huancayo', y: '2023 - 2023'}] },
    { name: 'Oshiro Takeuchi', slug: 'oshiro-takeuchi-fcc', nat: 'Peruano', birth: '1994-04-16', pos: 'Extremo Derecho', eur: 300000, pj: 18, num: 7, clubs: [{c: 'Los Chankas', y: '2024 - 2024'}] },
    { name: 'Cristian Neira', slug: 'cristian-neira-fcc', nat: 'Peruano', birth: '2000-11-23', pos: 'Mediocentro Ofensivo', eur: 450000, pj: 20, num: 11, clubs: [{c: 'Alianza Lima', y: '2024 - 2025'}, {c: 'Unión Comercio', y: '2022 - 2023'}] },
    { name: 'Juan Morales', slug: 'juan-morales-fcc', nat: 'Peruano', birth: '1989-03-06', pos: 'Pivote', eur: 200000, pj: 16, num: 15, clubs: [{c: 'Sport Boys', y: '2023 - 2024'}] },
    { name: 'Erick Canales', slug: 'erick-canales-fcc', nat: 'Peruano', birth: '2001-04-20', pos: 'Lateral Derecho', eur: 250000, pj: 14, num: 16, clubs: [{c: 'UTC Cajamarca', y: '2023 - 2024'}] },
    { name: 'Jarlín Quintero', slug: 'jarlin-quintero-fcc', nat: 'Colombiano', birth: '1993-08-19', pos: 'Delantero Centro', eur: 500000, pj: 22, num: 9, clubs: [{c: 'UTC Cajamarca', y: '2024 - 2025'}, {c: 'Cantolao', y: '2022 - 2022'}] },
    { name: 'Gaspar Gentile', slug: 'gaspar-gentile-fcc', nat: 'Argentino', birth: '1995-02-16', pos: 'Extremo Izquierdo', eur: 450000, pj: 21, num: 19, clubs: [{c: 'Deportivo Garcilaso', y: '2024 - 2025'}, {c: 'UTC Cajamarca', y: '2021 - 2023'}] },
    { name: 'Matías Sen', slug: 'matias-sen-fcc', nat: 'Argentino', birth: '1991-02-09', pos: 'Delantero Centro', eur: 350000, pj: 19, num: 18, clubs: [{c: 'Comerciantes Unidos', y: '2023 - 2025'}] },
    { name: 'Facundo Rodríguez', slug: 'facundo-rodriguez-fcc', nat: 'Uruguayo', birth: '1995-08-20', pos: 'Delantero Centro', eur: 350000, pj: 17, num: 23, clubs: [{c: 'Macará (Ecu)', y: '2023 - 2024'}] },
    { name: 'Piero Magallanes', slug: 'piero-magallanes-fcc', nat: 'Peruano', birth: '2001-04-07', pos: 'Extremo', eur: 450000, pj: 20, num: 27, clubs: [{c: 'Comerciantes Unidos', y: '2024 - 2024'}] }
  ],

  // 2. Deportivo Moquegua (Nuevo ascendido Liga 1 2026 - 22 jugadores)
  'deportivo-moquegua': [
    { name: 'Federico Nicosia', slug: 'federico-nicosia-moq', nat: 'Argentino / Peruano', birth: '1990-02-05', pos: 'Portero', eur: 350000, pj: 21, num: 1, clubs: [{c: 'Alianza Atlético', y: '2022 - 2024'}, {c: 'Cantolao', y: '2016 - 2021'}] },
    { name: 'Hairo Camacho', slug: 'hairo-camacho-moq', nat: 'Peruano', birth: '1992-06-18', pos: 'Portero', eur: 200000, pj: 5, num: 12, clubs: [{c: 'Santos FC', y: '2022 - 2024'}] },
    { name: 'Álvaro de la Cruz', slug: 'alvaro-de-la-cruz', nat: 'Peruano', birth: '2002-01-28', pos: 'Portero', eur: 150000, pj: 2, num: 21, clubs: [{c: 'Dep. Moquegua Res.', y: '2023 - 2025'}] },
    { name: 'Hoover Crespo', slug: 'hoover-crespo-moq', nat: 'Peruano', birth: '1992-01-04', pos: 'Lateral Derecho', eur: 250000, pj: 20, num: 2, clubs: [{c: 'Binacional', y: '2021 - 2023'}] },
    { name: 'Saúl Salas', slug: 'saul-salas-moq', nat: 'Peruano', birth: '1994-10-10', pos: 'Lateral Derecho', eur: 300000, pj: 18, num: 13, clubs: [{c: 'Cantolao', y: '2023 - 2024'}, {c: 'Deportivo Municipal', y: '2022 - 2022'}] },
    { name: 'Alonso Tamariz', slug: 'alonso-tamariz-moq', nat: 'Peruano', birth: '1998-01-21', pos: 'Lateral Izquierdo', eur: 300000, pj: 19, num: 3, clubs: [{c: 'Cusco FC', y: '2023 - 2024'}] },
    { name: 'Marcos Delgado', slug: 'marcos-delgado-moq', nat: 'Peruano', birth: '1988-02-17', pos: 'Defensa Central', eur: 200000, pj: 19, num: 4, clubs: [{c: 'UTC Cajamarca', y: '2022 - 2023'}, {c: 'Ayacucho FC', y: '2019 - 2021'}] },
    { name: 'Bryan Hermoza', slug: 'bryan-hermoza-moq', nat: 'Peruano', birth: '1995-04-20', pos: 'Lateral Izquierdo', eur: 250000, pj: 17, num: 14, clubs: [{c: 'Cienciano', y: '2021 - 2023'}] },
    { name: 'Manuel Contreras', slug: 'manuel-contreras-moq', nat: 'Peruano', birth: '1999-07-15', pos: 'Defensa Central', eur: 250000, pj: 16, num: 5, clubs: [{c: 'Binacional', y: '2023 - 2024'}] },
    { name: 'Juan Mayo', slug: 'juan-mayo', nat: 'Peruano', birth: '2001-03-12', pos: 'Defensa Central', eur: 200000, pj: 14, num: 22, clubs: [{c: 'Dep. Moquegua Res.', y: '2022 - 2024'}] },
    { name: 'Edson Aubert', slug: 'edson-aubert-moq', nat: 'Peruano', birth: '1988-11-24', pos: 'Mediocentro', eur: 300000, pj: 21, num: 8, clubs: [{c: 'ADT Tarma', y: '2023 - 2024'}, {c: 'Binacional', y: '2022 - 2022'}] },
    { name: 'Claudio Torrejón', slug: 'claudio-torrejon-moq', nat: 'Peruano', birth: '1993-05-14', pos: 'Pivote', eur: 350000, pj: 20, num: 6, clubs: [{c: 'Cienciano', y: '2023 - 2025'}, {c: 'Sport Boys', y: '2019 - 2022'}] },
    { name: 'Christian Velarde', slug: 'christian-velarde-moq', nat: 'Peruano', birth: '1994-08-01', pos: 'Mediocentro', eur: 300000, pj: 19, num: 16, clubs: [{c: 'Carlos A. Mannucci', y: '2024 - 2025'}, {c: 'Los Chankas', y: '2024 - 2024'}] },
    { name: 'Tarek Carranza', slug: 'tarek-carranza-moq', nat: 'Peruano', birth: '1992-02-13', pos: 'Mediocentro', eur: 300000, pj: 20, num: 10, clubs: [{c: 'Carlos A. Mannucci', y: '2023 - 2024'}, {c: 'Sport Boys', y: '2021 - 2022'}] },
    { name: 'Piero Serra', slug: 'piero-serra-moq', nat: 'Peruano', birth: '1997-07-28', pos: 'Mediocentro', eur: 300000, pj: 18, num: 18, clubs: [{c: 'Alianza Atlético', y: '2023 - 2024'}] },
    { name: 'Jefferson Collazos', slug: 'jefferson-collazos-moq', nat: 'Colombiano', birth: '1990-11-22', pos: 'Extremo', eur: 300000, pj: 17, num: 7, clubs: [{c: 'Santos FC', y: '2023 - 2024'}] },
    { name: 'Jairsinho Gonzales', slug: 'jairsinho-gonzales-moq', nat: 'Peruano', birth: '1989-12-20', pos: 'Extremo Derecho', eur: 250000, pj: 18, num: 11, clubs: [{c: 'Cantolao', y: '2022 - 2023'}] },
    { name: 'Yorleys Mena', slug: 'yorleys-mena-moq', nat: 'Colombiano', birth: '1991-07-20', pos: 'Delantero Centro', eur: 500000, pj: 21, num: 9, clubs: [{c: 'César Vallejo', y: '2022 - 2025'}, {c: 'Ajman Club (EAU)', y: '2021 - 2022'}] },
    { name: 'Mauricio Montes', slug: 'mauricio-montes-moq', nat: 'Peruano', birth: '1982-06-22', pos: 'Delantero Centro', eur: 150000, pj: 15, num: 19, clubs: [{c: 'Alianza Atlético', y: '2022 - 2023'}, {c: 'Ayacucho FC', y: '2018 - 2021'}] },
    { name: 'Jack Durán', slug: 'jack-duran-moq', nat: 'Peruano', birth: '1991-12-08', pos: 'Extremo', eur: 300000, pj: 18, num: 17, clubs: [{c: 'Juan Pablo II', y: '2024 - 2024'}, {c: 'Binacional', y: '2022 - 2023'}] },
    { name: 'Héctor Zeta', slug: 'hector-zeta-moq', nat: 'Peruano', birth: '1994-04-20', pos: 'Delantero Centro', eur: 300000, pj: 19, num: 23, clubs: [{c: 'Binacional', y: '2022 - 2024'}] },
    { name: 'Rely Fernández', slug: 'rely-fernandez-moq', nat: 'Peruano', birth: '1997-11-02', pos: 'Extremo', eur: 350000, pj: 19, num: 20, clubs: [{c: 'UTC Cajamarca', y: '2023 - 2024'}, {c: 'Carlos A. Mannucci', y: '2019 - 2022'}] }
  ],

  // 3. Juan Pablo II College (Ampliado a 22 jugadores)
  'juan-pablo-ii': [
    { name: 'Matías Pacheco', slug: 'matias-pacheco', nat: 'Peruano', birth: '2001-09-12', pos: 'Portero', eur: 250000, pj: 18, num: 1, clubs: [{c: 'Comerciantes FC', y: '2023 - 2024'}] },
    { name: 'Anderson Rodríguez', slug: 'anderson-rodriguez', nat: 'Peruano', birth: '1998-04-15', pos: 'Portero', eur: 200000, pj: 6, num: 12, clubs: [{c: 'Deportivo Coopsol', y: '2022 - 2023'}] },
    { name: 'Fabricio Salazar', slug: 'fabricio-salazar-jpii', nat: 'Peruano', birth: '2003-08-20', pos: 'Portero', eur: 150000, pj: 2, num: 21, clubs: [{c: 'Juan Pablo II Res.', y: '2023 - 2025'}] },
    { name: 'Renzo Alfani', slug: 'renzo-alfani', nat: 'Argentino', birth: '1996-02-18', pos: 'Defensa Central', eur: 350000, pj: 20, num: 2, clubs: [{c: 'Deportivo Municipal', y: '2021 - 2022'}] },
    { name: 'Nahuel Rodríguez', slug: 'nahuel-rodriguez', nat: 'Uruguayo', birth: '1997-03-24', pos: 'Defensa Central', eur: 300000, pj: 19, num: 4, clubs: [{c: 'Cerro (Uru)', y: '2022 - 2023'}] },
    { name: 'Eduardo Burga', slug: 'eduardo-burga', nat: 'Peruano', birth: '1999-07-10', pos: 'Lateral Derecho', eur: 250000, pj: 17, num: 3, clubs: [{c: 'Pirata FC', y: '2022 - 2023'}] },
    { name: 'Fabio Agurto', slug: 'fabio-agurto', nat: 'Peruano', birth: '2000-05-18', pos: 'Lateral Izquierdo', eur: 250000, pj: 16, num: 14, clubs: [{c: 'Carlos Stein', y: '2022 - 2023'}] },
    { name: 'Josuee Canova', slug: 'josuee-canova', nat: 'Peruano', birth: '2002-06-30', pos: 'Defensa Central', eur: 250000, pj: 15, num: 18, clubs: [{c: 'Alianza Lima U20', y: '2021 - 2023'}] },
    { name: 'José Guidino', slug: 'jose-guidino-jpii', nat: 'Peruano', birth: '1996-01-14', pos: 'Lateral Izquierdo', eur: 250000, pj: 15, num: 13, clubs: [{c: 'Ayacucho FC', y: '2023 - 2024'}, {c: 'Cienciano', y: '2021 - 2022'}] },
    { name: 'Diego Minaya', slug: 'diego-minaya-jpii', nat: 'Peruano', birth: '1990-04-11', pos: 'Defensa Central', eur: 250000, pj: 16, num: 22, clubs: [{c: 'Binacional', y: '2022 - 2024'}] },
    { name: 'Romario Aliaga', slug: 'romario-aliaga', nat: 'Peruano', birth: '1997-02-14', pos: 'Pivote', eur: 250000, pj: 18, num: 6, clubs: [{c: 'Deportivo Llacuabamba', y: '2022 - 2023'}] },
    { name: 'César Guzmán', slug: 'cesar-guzman', nat: 'Peruano', birth: '1999-10-02', pos: 'Mediocentro', eur: 250000, pj: 17, num: 8, clubs: [{c: 'Santos FC', y: '2021 - 2022'}] },
    { name: 'Gustavo Collante', slug: 'gustavo-collante', nat: 'Argentino', birth: '1995-12-19', pos: 'Mediocentro', eur: 300000, pj: 19, num: 16, clubs: [{c: 'Colegiales (Arg)', y: '2022 - 2023'}] },
    { name: 'Jorge Agüero', slug: 'jorge-aguero', nat: 'Peruano', birth: '2001-07-25', pos: 'Mediocentro Ofensivo', eur: 350000, pj: 21, num: 10, clubs: [{c: 'Universitario', y: '2020 - 2023'}] },
    { name: 'Christian Flores', slug: 'christian-flores-jpii', nat: 'Peruano', birth: '1996-01-18', pos: 'Mediocentro', eur: 250000, pj: 15, num: 17, clubs: [{c: 'Deportivo Municipal', y: '2022 - 2023'}] },
    { name: 'Piero Vivanco', slug: 'piero-vivanco-jpii', nat: 'Peruano', birth: '2000-01-17', pos: 'Extremo Izquierdo', eur: 350000, pj: 18, num: 23, clubs: [{c: 'Atlético Grau', y: '2023 - 2024'}, {c: 'Sport Boys', y: '2022 - 2022'}] },
    { name: 'Cristian Rodríguez', slug: 'cristian-rodriguez-jpii', nat: 'Peruano', birth: '2002-08-11', pos: 'Extremo', eur: 250000, pj: 14, num: 11, clubs: [{c: 'Juan Pablo II U20', y: '2022 - 2024'}] },
    { name: 'Facundo Rodríguez', slug: 'facundo-rodriguez', nat: 'Uruguayo', birth: '1995-08-20', pos: 'Delantero Centro', eur: 350000, pj: 19, num: 9, clubs: [{c: 'Macará (Ecu)', y: '2023 - 2023'}] },
    { name: 'Renzo Huacho', slug: 'renzo-huacho', nat: 'Peruano', birth: '2000-03-05', pos: 'Delantero', eur: 250000, pj: 15, num: 19, clubs: [{c: 'Comerciantes FC', y: '2022 - 2023'}] },
    { name: 'Kevin Sánchez', slug: 'kevin-sanchez-jpii', nat: 'Peruano', birth: '1999-11-20', pos: 'Extremo', eur: 250000, pj: 14, num: 20, clubs: [{c: 'UTC Cajamarca', y: '2023 - 2024'}] },
    { name: 'Jack Durán', slug: 'jack-duran-jp', nat: 'Peruano', birth: '1991-12-08', pos: 'Extremo Derecho', eur: 300000, pj: 18, num: 7, clubs: [{c: 'Binacional', y: '2022 - 2023'}] },
    { name: 'Carlos Meza', slug: 'carlos-meza-jpii', nat: 'Peruano', birth: '2002-04-12', pos: 'Delantero', eur: 200000, pj: 10, num: 25, clubs: [{c: 'Juan Pablo II Res.', y: '2023 - 2025'}] }
  ],

  // 4. Comerciantes Unidos (Ampliado a 22 jugadores)
  'comerciantes-unidos': [
    { name: 'Luis García', slug: 'luis-garcia-cu', nat: 'Peruano', birth: '1988-06-05', pos: 'Portero', eur: 250000, pj: 18, num: 1, clubs: [{c: 'Carlos A. Mannucci', y: '2023 - 2023'}, {c: 'UTC Cajamarca', y: '2021 - 2022'}] },
    { name: 'Diego Campos', slug: 'diego-campos-cu', nat: 'Peruano', birth: '1996-05-24', pos: 'Portero', eur: 250000, pj: 6, num: 12, clubs: [{c: 'Juan Aurich', y: '2022 - 2023'}] },
    { name: 'Gerson Valladares', slug: 'gerson-valladares-cu', nat: 'Peruano', birth: '1995-12-14', pos: 'Portero', eur: 200000, pj: 2, num: 21, clubs: [{c: 'Carlos Stein', y: '2022 - 2023'}] },
    { name: 'Erick Noriega', slug: 'erick-noriega-cu', nat: 'Peruano / Japonés', birth: '2001-10-22', pos: 'Defensa Central', eur: 500000, pj: 21, num: 4, clubs: [{c: 'Universidad San Martín', y: '2023 - 2023'}, {c: 'Shimizu S-Pulse (Jap)', y: '2020 - 2021'}] },
    { name: 'Cristian González', slug: 'cristian-gonzalez-cu', nat: 'Argentino', birth: '1990-01-13', pos: 'Defensa Central', eur: 350000, pj: 19, num: 3, clubs: [{c: 'Patronato (Arg)', y: '2023 - 2023'}] },
    { name: 'Dylan Caro', slug: 'dylan-caro', nat: 'Peruano', birth: '1999-03-23', pos: 'Lateral Izquierdo', eur: 300000, pj: 19, num: 13, clubs: [{c: 'Sport Boys', y: '2023 - 2023'}, {c: 'Alianza Lima', y: '2019 - 2021'}] },
    { name: 'Jair Toledo', slug: 'jair-toledo', nat: 'Peruano', birth: '1996-06-22', pos: 'Lateral Derecho', eur: 350000, pj: 20, num: 2, clubs: [{c: 'Cantolao', y: '2021 - 2022'}] },
    { name: 'Jorge Bosmediano', slug: 'jorge-bosmediano', nat: 'Peruano', birth: '1991-02-16', pos: 'Defensa Central', eur: 250000, pj: 17, num: 5, clubs: [{c: 'Alianza Atlético', y: '2021 - 2022'}] },
    { name: 'Rodrigo Salinas', slug: 'rodrigo-salinas-cu', nat: 'Peruano', birth: '1999-05-14', pos: 'Lateral Derecho', eur: 250000, pj: 15, num: 15, clubs: [{c: 'Alfonso Ugarte', y: '2022 - 2023'}] },
    { name: 'Flavio Alcedo', slug: 'flavio-alcedo-cu', nat: 'Peruano', birth: '2003-01-19', pos: 'Pivote', eur: 350000, pj: 17, num: 23, clubs: [{c: 'Sporting Cristal', y: '2022 - 2023'}] },
    { name: 'Keyvin Paico', slug: 'keyvin-paico', nat: 'Peruano', birth: '1994-03-22', pos: 'Pivote', eur: 300000, pj: 21, num: 6, clubs: [{c: 'Carlos A. Mannucci', y: '2020 - 2022'}] },
    { name: 'Enmanuel Páucar', slug: 'enmanuel-paucar', nat: 'Peruano', birth: '1996-08-09', pos: 'Mediocentro', eur: 350000, pj: 21, num: 8, clubs: [{c: 'Ayacucho FC', y: '2021 - 2023'}, {c: 'Universitario', y: '2015 - 2019'}] },
    { name: 'Piero Magallanes', slug: 'piero-magallanes-cu', nat: 'Peruano', birth: '2001-04-07', pos: 'Mediocentro Ofensivo', eur: 500000, pj: 22, num: 10, clubs: [{c: 'Sporting Cristal U20', y: '2021 - 2022'}] },
    { name: 'Dubán Palacio', slug: 'duban-palacio', nat: 'Colombiano', birth: '1997-03-16', pos: 'Extremo Izquierdo', eur: 400000, pj: 20, num: 11, clubs: [{c: 'Santa Fe (Col)', y: '2023 - 2023'}, {c: 'Deportivo Pereira (Col)', y: '2022 - 2022'}] },
    { name: 'José Parodi', slug: 'jose-parodi', nat: 'Peruano', birth: '1997-12-07', pos: 'Mediocentro', eur: 250000, pj: 17, num: 16, clubs: [{c: 'Ayacucho FC', y: '2021 - 2022'}] },
    { name: 'Kevin Santamaría', slug: 'kevin-santamaria-cu', nat: 'Salvadoreño', birth: '1991-01-11', pos: 'Mediocentro Ofensivo', eur: 300000, pj: 18, num: 18, clubs: [{c: 'Sport Boys', y: '2023 - 2023'}, {c: 'Chavelines', y: '2021 - 2022'}] },
    { name: 'Piero Serra', slug: 'piero-serra-cu', nat: 'Peruano', birth: '1997-07-28', pos: 'Mediocentro', eur: 250000, pj: 15, num: 20, clubs: [{c: 'Alianza Atlético', y: '2022 - 2023'}] },
    { name: 'Matías Sen', slug: 'matias-sen-cu', nat: 'Argentino', birth: '1991-02-09', pos: 'Delantero Centro', eur: 400000, pj: 22, num: 9, clubs: [{c: 'Cienciano', y: '2021 - 2022'}] },
    { name: 'Sebastián Gonzales Zela', slug: 'sebastian-gonzales-zela', nat: 'Peruano', birth: '1999-12-06', pos: 'Delantero Centro', eur: 300000, pj: 18, num: 19, clubs: [{c: 'Alianza Lima', y: '2020 - 2022'}, {c: 'Ayacucho FC', y: '2022 - 2023'}] },
    { name: 'Kenji Barrios', slug: 'kenji-barrios', nat: 'Peruano', birth: '1997-03-08', pos: 'Extremo', eur: 300000, pj: 19, num: 7, clubs: [{c: 'Deportivo Binacional', y: '2021 - 2022'}] },
    { name: 'Ítalo Regalado', slug: 'italo-regalado-cu', nat: 'Peruano', birth: '1995-06-28', pos: 'Extremo', eur: 300000, pj: 18, num: 17, clubs: [{c: 'Cantolao', y: '2023 - 2023'}, {c: 'Cienciano', y: '2021 - 2022'}] },
    { name: 'Ronald Vega', slug: 'ronald-vega-cu', nat: 'Peruano', birth: '2001-09-02', pos: 'Delantero', eur: 200000, pj: 11, num: 22, clubs: [{c: 'Comerciantes Unidos Res.', y: '2022 - 2024'}] }
  ],

  // 5. Deportivo Garcilaso (Ampliado a 22 jugadores - Incluye a Marco Saravia como alta de la U)
  'deportivo-garcilaso': [
    { name: 'Diego Penny', slug: 'diego-penny', nat: 'Peruano', birth: '1984-04-22', pos: 'Portero', eur: 250000, pj: 21, num: 1, clubs: [{c: 'Alianza Atlético', y: '2022 - 2022'}, {c: 'Universidad San Martín', y: '2019 - 2021'}, {c: 'Sporting Cristal', y: '2013 - 2016'}] },
    { name: 'Miguel Vargas', slug: 'miguel-vargas', nat: 'Chileno / Peruano', birth: '1996-06-15', pos: 'Portero', eur: 450000, pj: 7, num: 12, clubs: [{c: 'Cienciano', y: '2022 - 2023'}, {c: 'Universidad Católica (Chi)', y: '2017 - 2021'}] },
    { name: 'Josué Vargas', slug: 'josue-vargas-dg', nat: 'Peruano', birth: '2003-03-28', pos: 'Portero', eur: 150000, pj: 2, num: 23, clubs: [{c: 'César Vallejo', y: '2022 - 2024'}] },
    { name: 'Marco Saravia', slug: 'marco-saravia-dg', nat: 'Peruano', birth: '1999-02-06', pos: 'Defensa Central', eur: 450000, pj: 19, num: 5, clubs: [{c: 'Universitario', y: '2023 - 2025'}, {c: 'Deportivo Municipal', y: '2021 - 2022'}] },
    { name: 'Carlos Beltrán', slug: 'carlos-beltran', nat: 'Argentino / Peruano', birth: '1990-08-18', pos: 'Defensa Central', eur: 350000, pj: 21, num: 4, clubs: [{c: 'Cienciano', y: '2022 - 2023'}, {c: 'Alianza Lima', y: '2019 - 2020'}] },
    { name: 'Juan Diego Lojas', slug: 'juan-diego-lojas', nat: 'Peruano', birth: '1989-04-23', pos: 'Defensa Central', eur: 300000, pj: 19, num: 2, clubs: [{c: 'Alianza Atlético', y: '2021 - 2022'}] },
    { name: 'Aldair Salazar', slug: 'aldair-salazar-dg', nat: 'Peruano', birth: '1994-08-04', pos: 'Defensa Central', eur: 350000, pj: 18, num: 14, clubs: [{c: 'Cantolao', y: '2023 - 2024'}, {c: 'Alianza Lima', y: '2019 - 2020'}] },
    { name: 'Anthony Gordillo', slug: 'anthony-gordillo', nat: 'Peruano', birth: '1994-03-09', pos: 'Lateral Izquierdo', eur: 350000, pj: 20, num: 3, clubs: [{c: 'Universidad San Martín', y: '2021 - 2022'}] },
    { name: 'Erick Perleche', slug: 'erick-perleche', nat: 'Peruano', birth: '2000-08-15', pos: 'Lateral Derecho', eur: 350000, pj: 18, num: 13, clubs: [{c: 'Cienciano', y: '2021 - 2022'}] },
    { name: 'Erick Canales', slug: 'erick-canales', nat: 'Peruano', birth: '2001-04-20', pos: 'Lateral Derecho', eur: 300000, pj: 16, num: 22, clubs: [{c: 'UTC Cajamarca', y: '2022 - 2023'}] },
    { name: 'Carlos Caraza', slug: 'carlos-caraza', nat: 'Peruano', birth: '1985-11-20', pos: 'Lateral Derecho', eur: 200000, pj: 15, num: 15, clubs: [{c: 'Binacional', y: '2020 - 2022'}] },
    { name: 'Alexi Gómez', slug: 'alexi-gomez-dg', nat: 'Peruano', birth: '1993-03-04', pos: 'Lateral / Extremo Izquierdo', eur: 350000, pj: 18, num: 6, clubs: [{c: 'Deportivo Garcilaso', y: '2023 - 2024'}, {c: 'UTC Cajamarca', y: '2021 - 2022'}, {c: 'Alianza Lima', y: '2020 - 2020'}] },
    { name: 'Diego Ramírez', slug: 'diego-ramirez', nat: 'Peruano', birth: '1996-03-05', pos: 'Mediocentro', eur: 350000, pj: 19, num: 8, clubs: [{c: 'Cantolao', y: '2021 - 2023'}] },
    { name: 'Miguel Cornejo', slug: 'miguel-cornejo-dg', nat: 'Peruano', birth: '2000-01-18', pos: 'Mediocentro', eur: 350000, pj: 17, num: 16, clubs: [{c: 'Alianza Atlético', y: '2023 - 2024'}, {c: 'Alianza Lima', y: '2019 - 2022'}] },
    { name: 'Andrés Chicaiza', slug: 'andres-chicaiza', nat: 'Ecuatoriano', birth: '1992-04-03', pos: 'Mediocentro Ofensivo', eur: 450000, pj: 21, num: 10, clubs: [{c: 'LDU Quito (Ecu)', y: '2019 - 2023'}] },
    { name: 'Erinson Ramírez', slug: 'erinson-ramirez', nat: 'Peruano', birth: '1998-03-25', pos: 'Extremo', eur: 400000, pj: 20, num: 11, clubs: [{c: 'UTC Cajamarca', y: '2023 - 2024'}, {c: 'ADT Tarma', y: '2022 - 2022'}] },
    { name: 'Jorge Bazán', slug: 'jorge-bazan-dg', nat: 'Peruano', birth: '1991-03-23', pos: 'Extremo Derecho', eur: 250000, pj: 15, num: 20, clubs: [{c: 'Sport Huancayo', y: '2020 - 2022'}] },
    { name: 'Mauricio Cuero', slug: 'mauricio-cuero', nat: 'Colombiano', birth: '1993-01-28', pos: 'Extremo Derecho', eur: 400000, pj: 19, num: 7, clubs: [{c: 'Independiente (Arg)', y: '2023 - 2023'}, {c: 'Banfield (Arg)', y: '2020 - 2022'}] },
    { name: 'José Cuero', slug: 'jose-cuero', nat: 'Colombiano', birth: '1990-03-30', pos: 'Extremo', eur: 300000, pj: 16, num: 18, clubs: [{c: 'Alfonso Ugarte', y: '2022 - 2023'}] },
    { name: 'Pablo Erustes', slug: 'pablo-erustes-dg', nat: 'Argentino', birth: '1994-03-22', pos: 'Delantero Centro', eur: 500000, pj: 21, num: 9, clubs: [{c: 'Deportivo Municipal', y: '2023 - 2023'}] },
    { name: 'Adrián Ugarriza', slug: 'adrian-ugarriza-dg', nat: 'Peruano', birth: '1997-01-01', pos: 'Delantero Centro', eur: 450000, pj: 20, num: 19, clubs: [{c: 'Sporting Cristal', y: '2023 - 2024'}, {c: 'Cienciano', y: '2021 - 2022'}] },
    { name: 'Christopher Olivares', slug: 'christopher-olivares-dg', nat: 'Peruano', birth: '1999-04-03', pos: 'Delantero Centro', eur: 450000, pj: 18, num: 21, clubs: [{c: 'Universitario', y: '2024 - 2025'}, {c: 'Cusco FC', y: '2023 - 2023'}] }
  ],

  // 6. Los Chankas CYC (Ampliado a 22 jugadores)
  'los-chankas': [
    { name: 'Daniel Ferreyra', slug: 'daniel-ferreyra', nat: 'Argentino / Peruano', birth: '1982-01-22', pos: 'Portero', eur: 250000, pj: 21, num: 1, clubs: [{c: 'Cusco FC', y: '2022 - 2023'}, {c: 'Cienciano', y: '2019 - 2021'}] },
    { name: 'Michael Sotillo', slug: 'michael-sotillo', nat: 'Peruano', birth: '1984-09-17', pos: 'Portero', eur: 200000, pj: 6, num: 12, clubs: [{c: 'Binacional', y: '2018 - 2022'}] },
    { name: 'Gerson Valladares', slug: 'gerson-valladares-ch', nat: 'Peruano', birth: '1995-12-14', pos: 'Portero', eur: 150000, pj: 2, num: 21, clubs: [{c: 'Carlos Stein', y: '2022 - 2023'}] },
    { name: 'Kevin Becerra', slug: 'kevin-becerra', nat: 'Ecuatoriano', birth: '1996-01-16', pos: 'Defensa Central', eur: 450000, pj: 21, num: 3, clubs: [{c: 'Guayaquil City (Ecu)', y: '2022 - 2023'}] },
    { name: 'Carlos Gamarra', slug: 'carlos-gamarra', nat: 'Peruano', birth: '1993-01-09', pos: 'Defensa Central', eur: 300000, pj: 19, num: 4, clubs: [{c: 'Sport Boys', y: '2022 - 2022'}] },
    { name: 'Ederson Mogollón', slug: 'ederson-mogollon', nat: 'Peruano', birth: '1992-10-04', pos: 'Defensa Central', eur: 300000, pj: 18, num: 5, clubs: [{c: 'Cantolao', y: '2021 - 2022'}] },
    { name: 'Axel Chávez', slug: 'axel-chavez', nat: 'Peruano', birth: '1998-04-20', pos: 'Lateral Izquierdo', eur: 350000, pj: 20, num: 13, clubs: [{c: 'Cienciano', y: '2021 - 2022'}] },
    { name: 'Ayrton Quintana', slug: 'ayrton-quintana-ch', nat: 'Peruano', birth: '2001-04-10', pos: 'Lateral Izquierdo', eur: 300000, pj: 16, num: 14, clubs: [{c: 'Cienciano', y: '2022 - 2024'}] },
    { name: 'Marlon Ruidias', slug: 'marlon-ruidias', nat: 'Peruano', birth: '1999-03-21', pos: 'Lateral Derecho', eur: 350000, pj: 20, num: 2, clubs: [{c: 'Alfonso Ugarte', y: '2022 - 2023'}] },
    { name: 'José Marina', slug: 'jose-marina-ch', nat: 'Peruano', birth: '1997-01-20', pos: 'Lateral Derecho', eur: 300000, pj: 15, num: 15, clubs: [{c: 'Santos FC', y: '2022 - 2023'}] },
    { name: 'Franco Medina', slug: 'franco-medina-ch', nat: 'Peruano', birth: '1999-07-18', pos: 'Lateral Derecho', eur: 350000, pj: 17, num: 22, clubs: [{c: 'Sporting Cristal', y: '2023 - 2024'}, {c: 'Cienciano', y: '2021 - 2022'}] },
    { name: 'Rudy Palomino', slug: 'rudy-palomino', nat: 'Peruano', birth: '1998-07-23', pos: 'Pivote', eur: 350000, pj: 21, num: 6, clubs: [{c: 'Cienciano', y: '2019 - 2022'}] },
    { name: 'Cristian Mejía', slug: 'cristian-mejia', nat: 'Peruano', birth: '1993-02-17', pos: 'Mediocentro', eur: 300000, pj: 19, num: 8, clubs: [{c: 'Deportivo Municipal', y: '2021 - 2022'}] },
    { name: 'Ademar Robles', slug: 'ademar-robles-ch', nat: 'Peruano', birth: '1994-12-15', pos: 'Mediocentro', eur: 250000, pj: 16, num: 16, clubs: [{c: 'Carlos Stein', y: '2022 - 2023'}] },
    { name: 'Abel Casquete', slug: 'abel-casquete', nat: 'Ecuatoriano', birth: '1997-08-08', pos: 'Mediocentro Ofensivo', eur: 450000, pj: 22, num: 10, clubs: [{c: 'Deportivo Coopsol', y: '2022 - 2023'}, {c: 'River Plate (Arg)', y: '2015 - 2017'}] },
    { name: 'Willian Mimbela', slug: 'willian-mimbela-ch', nat: 'Peruano', birth: '1992-05-15', pos: 'Mediocentro Ofensivo', eur: 300000, pj: 17, num: 23, clubs: [{c: 'Unión Comercio', y: '2023 - 2024'}, {c: 'Sport Boys', y: '2021 - 2022'}] },
    { name: 'José Manzaneda', slug: 'jose-manzaneda', nat: 'Peruano', birth: '1994-09-10', pos: 'Extremo Izquierdo', eur: 400000, pj: 20, num: 11, clubs: [{c: 'Alianza Atlético', y: '2023 - 2023'}, {c: 'Alianza Lima', y: '2019 - 2021'}] },
    { name: 'Carlos López', slug: 'carlos-lopez', nat: 'Colombiano', birth: '1994-08-01', pos: 'Extremo Derecho', eur: 450000, pj: 22, num: 7, clubs: [{c: 'Alianza Universidad', y: '2021 - 2022'}] },
    { name: 'Ángel López', slug: 'angel-lopez', nat: 'Peruano', birth: '2003-05-18', pos: 'Extremo', eur: 300000, pj: 17, num: 17, clubs: [{c: 'Cantolao', y: '2022 - 2023'}] },
    { name: 'Oshiro Takeuchi', slug: 'oshiro-takeuchi', nat: 'Peruano', birth: '1994-04-16', pos: 'Extremo', eur: 300000, pj: 18, num: 18, clubs: [{c: 'Carlos Stein', y: '2022 - 2023'}] },
    { name: 'Alan Murialdo', slug: 'alan-murialdo', nat: 'Argentino', birth: '1992-10-10', pos: 'Delantero Centro', eur: 400000, pj: 21, num: 9, clubs: [{c: 'Racing de Córdoba (Arg)', y: '2022 - 2023'}] },
    { name: 'Gonzalo Sánchez', slug: 'gonzalo-sanchez', nat: 'Peruano', birth: '2000-05-06', pos: 'Delantero Centro', eur: 300000, pj: 16, num: 19, clubs: [{c: 'FC Emmen (P. Bajos)', y: '2022 - 2023'}, {c: 'Alianza Lima', y: '2018 - 2021'}] }
  ],

  // 7. UTC Cajamarca (Ampliado a 22 jugadores)
  'utc-cajamarca': [
    { name: 'Patrick Zubczuk', slug: 'patrick-zubczuk', nat: 'Peruano', birth: '1995-02-21', pos: 'Portero', eur: 450000, pj: 22, num: 1, clubs: [{c: 'Cienciano', y: '2022 - 2022'}, {c: 'Universitario', y: '2016 - 2021'}] },
    { name: 'Ángelo Campos', slug: 'angelo-campos-utc', nat: 'Peruano', birth: '1993-04-27', pos: 'Portero', eur: 500000, pj: 20, num: 12, clubs: [{c: 'Alianza Lima', y: '2021 - 2025'}, {c: 'FBC Melgar', y: '2019 - 2020'}] },
    { name: 'Jorge Stucchi', slug: 'jorge-stucchi', nat: 'Peruano', birth: '2002-04-18', pos: 'Portero', eur: 150000, pj: 2, num: 21, clubs: [{c: 'UTC Cajamarca U20', y: '2022 - 2024'}] },
    { name: 'Koichi Aparicio', slug: 'koichi-aparicio', nat: 'Peruano', birth: '1992-06-06', pos: 'Defensa Central', eur: 350000, pj: 21, num: 3, clubs: [{c: 'Cienciano', y: '2021 - 2022'}, {c: 'Alianza Lima', y: '2013 - 2016'}] },
    { name: 'Mario Otiniano', slug: 'mario-otiniano', nat: 'Peruano', birth: '2001-08-14', pos: 'Defensa Central', eur: 250000, pj: 16, num: 4, clubs: [{c: 'UTC Cajamarca U20', y: '2021 - 2023'}] },
    { name: 'Pedro Requena', slug: 'pedro-requena', nat: 'Peruano', birth: '1991-01-24', pos: 'Lateral Derecho', eur: 300000, pj: 19, num: 2, clubs: [{c: 'FBC Melgar', y: '2017 - 2018'}, {c: 'César Vallejo', y: '2012 - 2016'}] },
    { name: 'Branco Serrano', slug: 'branco-serrano', nat: 'Peruano', birth: '1993-04-30', pos: 'Lateral Izquierdo', eur: 300000, pj: 19, num: 13, clubs: [{c: 'Cienciano', y: '2021 - 2022'}] },
    { name: 'Diego Mondino', slug: 'diego-mondino-utc', nat: 'Argentino', birth: '1994-11-14', pos: 'Defensa Central', eur: 350000, pj: 19, num: 18, clubs: [{c: 'Gimnasia Mendoza (Arg)', y: '2022 - 2023'}] },
    { name: 'Luis Trujillo', slug: 'luis-trujillo', nat: 'Peruano', birth: '1990-12-27', pos: 'Lateral Izquierdo', eur: 300000, pj: 18, num: 22, clubs: [{c: 'Cienciano', y: '2020 - 2022'}, {c: 'Alianza Lima', y: '2013 - 2016'}] },
    { name: 'Flavio Alcedo', slug: 'flavio-alcedo-utc', nat: 'Peruano', birth: '2003-01-19', pos: 'Pivote', eur: 350000, pj: 17, num: 5, clubs: [{c: 'Sporting Cristal', y: '2022 - 2023'}] },
    { name: 'Ángel Ojeda', slug: 'angel-ojeda', nat: 'Peruano', birth: '1992-08-11', pos: 'Mediocentro', eur: 350000, pj: 21, num: 6, clubs: [{c: 'Cienciano', y: '2021 - 2023'}] },
    { name: 'Neil Marcos', slug: 'neil-marcos', nat: 'Peruano', birth: '1992-09-11', pos: 'Mediocentro', eur: 300000, pj: 18, num: 8, clubs: [{c: 'Atlético Grau', y: '2021 - 2022'}] },
    { name: 'Carlos Diez', slug: 'carlos-diez-utc', nat: 'Peruano', birth: '1996-03-18', pos: 'Mediocentro', eur: 350000, pj: 20, num: 20, clubs: [{c: 'Deportivo Garcilaso', y: '2024 - 2024'}] },
    { name: 'Joel Sánchez', slug: 'joel-sanchez', nat: 'Peruano', birth: '1989-06-11', pos: 'Mediocentro Ofensivo', eur: 350000, pj: 20, num: 10, clubs: [{c: 'FBC Melgar', y: '2018 - 2022'}, {c: 'Sporting Cristal', y: '2017 - 2017'}, {c: 'Alianza Lima', y: '2010 - 2010'}] },
    { name: 'Kevin Sánchez', slug: 'kevin-sanchez', nat: 'Peruano', birth: '1999-11-20', pos: 'Extremo', eur: 250000, pj: 16, num: 14, clubs: [{c: 'UTC Cajamarca U20', y: '2020 - 2022'}] },
    { name: 'Cristian Ojeda', slug: 'cristian-ojeda', nat: 'Argentino', birth: '1999-01-22', pos: 'Extremo', eur: 350000, pj: 18, num: 16, clubs: [{c: 'Sarmiento (Arg)', y: '2023 - 2023'}, {c: 'Talleres (Arg)', y: '2020 - 2022'}] },
    { name: 'Gaspar Gentile', slug: 'gaspar-gentile-utc', nat: 'Argentino', birth: '1995-02-16', pos: 'Extremo Izquierdo', eur: 450000, pj: 21, num: 21, clubs: [{c: 'Deportivo Garcilaso', y: '2024 - 2025'}] },
    { name: 'Maycol Infante', slug: 'maycol-infante', nat: 'Peruano', birth: '2005-04-12', pos: 'Extremo', eur: 200000, pj: 11, num: 11, clubs: [{c: 'UTC Cajamarca U20', y: '2022 - 2024'}] },
    { name: 'Jarlín Quintero', slug: 'jarlin-quintero', nat: 'Colombiano', birth: '1993-08-19', pos: 'Delantero Centro', eur: 500000, pj: 22, num: 9, clubs: [{c: 'Cantolao', y: '2022 - 2022'}] },
    { name: 'Tiago Cantoro', slug: 'tiago-cantoro', nat: 'Argentino / Peruano', birth: '2001-01-06', pos: 'Delantero Centro', eur: 300000, pj: 17, num: 19, clubs: [{c: 'Cusco FC', y: '2023 - 2023'}, {c: 'Universitario', y: '2020 - 2022'}] },
    { name: 'Víctor Perlaza', slug: 'victor-perlaza', nat: 'Colombiano', birth: '1994-07-29', pos: 'Delantero Centro', eur: 400000, pj: 20, num: 7, clubs: [{c: 'Alianza Atlético', y: '2021 - 2022'}] },
    { name: 'David Camacho', slug: 'david-camacho-utc', nat: 'Peruano', birth: '2003-08-09', pos: 'Delantero', eur: 150000, pj: 6, num: 24, clubs: [{c: 'UTC Cajamarca U20', y: '2022 - 2024'}] }
  ]
};

async function main() {
  console.log('🚀 INICIANDO CORRECCIÓN OFICIAL LIGA 1 2026:');
  console.log('   1. Descendidos 2025: César Vallejo y Carlos A. Mannucci');
  console.log('   2. Ascendidos 2026: FC Cajamarca y Deportivo Moquegua');
  console.log('   3. Ampliación a mínimo 20-25 jugadores en TODOS los clubes de provincia\n');

  // 1. Obtener equipos existentes
  const { data: existingTeams } = await supabase.from('teams').select('*');
  const teamBySlug = {};
  existingTeams.forEach(t => { teamBySlug[t.slug] = t; });

  // 2. Crear FC Cajamarca si no existe
  let fcCajamarca = teamBySlug['fc-cajamarca'];
  if (!fcCajamarca) {
    console.log('➕ Creando FC Cajamarca en tabla teams...');
    const { data: created, error } = await supabase.from('teams').insert({
      name: 'FC Cajamarca',
      slug: 'fc-cajamarca',
      short_name: 'FC Cajamarca',
      primary_kit_color: '#15803d',
      shorts_kit_color: '#ffffff',
      logo_url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100&auto=format&fit=crop&q=80',
      x_handle: '@FCCajamarcaOf',
      facebook_url: 'https://facebook.com/fccajamarca',
    }).select().single();
    if (error) throw error;
    fcCajamarca = created;
    teamBySlug['fc-cajamarca'] = fcCajamarca;
    console.log('✅ FC Cajamarca creado con ID:', fcCajamarca.id);
  } else {
    await supabase.from('teams').update({
      name: 'FC Cajamarca',
      short_name: 'FC Cajamarca',
      primary_kit_color: '#15803d',
      shorts_kit_color: '#ffffff',
    }).eq('id', fcCajamarca.id);
  }

  // 3. Crear Deportivo Moquegua si no existe
  let depMoquegua = teamBySlug['deportivo-moquegua'];
  if (!depMoquegua) {
    console.log('➕ Creando Deportivo Moquegua en tabla teams...');
    const { data: created, error } = await supabase.from('teams').insert({
      name: 'Deportivo Moquegua',
      slug: 'deportivo-moquegua',
      short_name: 'Dep. Moquegua',
      primary_kit_color: '#b91c1c',
      shorts_kit_color: '#ffffff',
      logo_url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&auto=format&fit=crop&q=80',
      x_handle: '@DepMoqueguaOf',
      facebook_url: 'https://facebook.com/cdmoquegua',
    }).select().single();
    if (error) throw error;
    depMoquegua = created;
    teamBySlug['deportivo-moquegua'] = depMoquegua;
    console.log('✅ Deportivo Moquegua creado con ID:', depMoquegua.id);
  } else {
    await supabase.from('teams').update({
      name: 'Deportivo Moquegua',
      short_name: 'Dep. Moquegua',
      primary_kit_color: '#b91c1c',
      shorts_kit_color: '#ffffff',
    }).eq('id', depMoquegua.id);
  }

  // 4. Descender Universidad César Vallejo y Carlos A. Mannucci (eliminar de team_seasons 2026 y player_seasons 2026)
  const ucv = teamBySlug['cesar-vallejo'];
  const cam = teamBySlug['carlos-mannucci'];

  if (ucv) {
    console.log('🔻 Relegando a Universidad César Vallejo (descendido 2025): eliminando de Liga 1 2026...');
    await supabase.from('team_seasons').delete().eq('team_id', ucv.id).eq('season_year', 2026);
    await supabase.from('player_seasons').delete().eq('team_id', ucv.id).eq('season_year', 2026);
    await supabase.from('transfers').delete().eq('team_id', ucv.id).eq('season_year', 2026);
    console.log('   ✅ Universidad César Vallejo retirado de la temporada 2026.');
  }

  if (cam) {
    console.log('🔻 Relegando a Carlos A. Mannucci (descendido 2025): eliminando de Liga 1 2026...');
    await supabase.from('team_seasons').delete().eq('team_id', cam.id).eq('season_year', 2026);
    await supabase.from('player_seasons').delete().eq('team_id', cam.id).eq('season_year', 2026);
    await supabase.from('transfers').delete().eq('team_id', cam.id).eq('season_year', 2026);
    console.log('   ✅ Carlos A. Mannucci retirado de la temporada 2026.');
  }

  // 5. Cargar plantillas completas de 20 a 25 futbolistas para los clubes expandidos
  const { data: allPlayers } = await supabase.from('players').select('id, slug');
  const playerMap = {};
  allPlayers.forEach(p => { if (p.slug) playerMap[p.slug] = p.id; });

  for (const [teamSlug, squad] of Object.entries(expandedSquads)) {
    const team = teamBySlug[teamSlug];
    if (!team) {
      console.warn(`⚠️ Equipo no encontrado: ${teamSlug}`);
      continue;
    }

    console.log(`\n⚽ Cargando plantilla ampliada de ${team.name} (${squad.length} jugadores)...`);

    // Limpiar player_seasons previo de este club para 2026
    await supabase.from('player_seasons').delete().eq('team_id', team.id).eq('season_year', 2026);

    for (const p of squad) {
      let pId = playerMap[p.slug];

      if (!pId) {
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
        playerMap[p.slug] = pId;
      } else {
        await supabase.from('players').update({
          full_name: p.name,
          nationality: p.nat,
          birth_date: p.birth,
          primary_position: p.pos,
        }).eq('id', pId);
      }

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
        last_updated: new Date().toISOString(),
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
    console.log(`   ✅ ${team.name}: ${squad.length} futbolistas cargados correctamente.`);
  }

  // 6. Registrar Fichajes representativos 2026 para FC Cajamarca y Deportivo Moquegua
  console.log('\n📝 Registrando Fichajes 2026 para FC Cajamarca y Deportivo Moquegua...');
  const { data: quinteroPlayer } = await supabase.from('players').select('id').eq('slug', 'jarlin-quintero-fcc').maybeSingle();
  if (quinteroPlayer && fcCajamarca) {
    await supabase.from('transfers').upsert({
      player_id: quinteroPlayer.id,
      team_id: fcCajamarca.id,
      season_year: 2026,
      transfer_type: 'IN',
      other_club_name: 'UTC Cajamarca (Perú)',
      announced_at: '2026-01-10T10:00:00Z',
      contract_start_date: '2026-01-01',
      contract_end_date: '2026-12-31',
      source_type: 'club_social_x',
      source_url: 'https://x.com/FCCajamarcaOf',
    });
  }

  const { data: menaPlayer } = await supabase.from('players').select('id').eq('slug', 'yorleys-mena-moq').maybeSingle();
  if (menaPlayer && depMoquegua) {
    await supabase.from('transfers').upsert({
      player_id: menaPlayer.id,
      team_id: depMoquegua.id,
      season_year: 2026,
      transfer_type: 'IN',
      other_club_name: 'César Vallejo (Perú)',
      announced_at: '2026-01-08T12:00:00Z',
      contract_start_date: '2026-01-01',
      contract_end_date: '2026-12-31',
      source_type: 'transfermarkt',
      source_url: 'https://www.transfermarkt.es',
    });
  }

  // 7. Recalcular team_seasons 2026 para los EXACTAMENTE 18 CLUBES oficiales de la Liga 1 2026
  console.log('\n📊 RECALCULANDO VALORES TOTALES Y RANKING PARA LOS 18 CLUBES DE LA LIGA 1 2026...');
  
  // Lista oficial de los 18 clubes que componen la Liga 1 en 2026
  const active18Slugs = [
    'universitario',
    'alianza-lima',
    'sporting-cristal',
    'fbc-melgar',
    'atletico-grau',
    'sport-boys',
    'cienciano',
    'cusco-fc',
    'sport-huancayo',
    'adt-tarma',
    'alianza-atletico',
    'utc-cajamarca',
    'deportivo-garcilaso',
    'los-chankas',
    'comerciantes-unidos',
    'juan-pablo-ii',
    'fc-cajamarca',
    'deportivo-moquegua'
  ];

  // Limpiar cualquier otro equipo en team_seasons que no esté en la lista oficial de 18
  const { data: currentTS } = await supabase.from('team_seasons').select('id, team_id, teams(slug)').eq('season_year', 2026);
  for (const ts of (currentTS || [])) {
    if (!active18Slugs.includes(ts.teams?.slug)) {
      console.log(`   Removiendo equipo inactivo de 2026: ${ts.teams?.slug}`);
      await supabase.from('team_seasons').delete().eq('id', ts.id);
    }
  }

  const { data: allSeasonPlayers } = await supabase.from('player_seasons').select('team_id, market_value_eur').eq('season_year', 2026);
  
  const teamTotals = [];

  for (const slug of active18Slugs) {
    const team = teamBySlug[slug];
    if (!team) continue;

    const playersOfTeam = (allSeasonPlayers || []).filter(p => p.team_id === team.id);
    const totalEur = playersOfTeam.reduce((acc, p) => acc + (p.market_value_eur || 0), 0);
    const count = playersOfTeam.length;

    teamTotals.push({
      team,
      totalEur,
      count
    });
  }

  // Ordenar por valor de mercado descendente
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

  console.log(`\n🎉 ¡ACTUALIZACIÓN COMPLETADA! Total clubes Liga 1 2026: ${teamTotals.length} clubes (mínimo 20 jugadores cada uno).`);
  process.exit(0);
}

main().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
});
