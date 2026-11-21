import fs from 'fs';

const players = JSON.parse(fs.readFileSync('scripts/active_players_2026.json', 'utf8'));
const skins = JSON.parse(fs.readFileSync('scripts/players_skin_analyzed.json', 'utf8'));

const testNames = [
  'Paolo Guerrero', 'Hernán Barcos', 'Sebastián Britos', 'Bernardo Cuesta',
  'Bryan Reyna', 'Andy Polo', 'Kevin Becerra', 'Kevin Quevedo',
  'Ángelo Campos', 'Carlos Cáceda', 'Diego Romero', 'Gonzalo Falcón',
  'Santiago González', 'Gustavo Cazonatti', 'Martín Cauteruccio', 'Horacio Calcaterra',
  'Edison Flores', 'Christian Cueva', 'Carlos Zambrano', 'Piero Quispe',
  'Alex Valera', 'Jairo Concha', 'José Rivera', 'Josué Estrada',
  'Catriel Cabellos', 'Claudio Núñez', 'Víctor Cedrón', 'Luis Ramos',
  'Alan Cantero', 'Williams Riveros', 'Aldo Corzo', 'Jhilmar Lora'
];

for (const name of testNames) {
  const p = players.find(x => x.name.toLowerCase() === name.toLowerCase() || x.name.toLowerCase().includes(name.toLowerCase()));
  if (p) {
    const s = skins[p.id];
    console.log(`${p.name.padEnd(25)} | Found: ${s ? 'YES' : 'NO '} | Cat: ${s?.category || 'N/A'} | Lum: ${s?.luminance} | Hex: ${s?.hex}`);
  } else {
    console.log(`${name.padEnd(25)} | NOT IN ACTIVE PLAYERS`);
  }
}
