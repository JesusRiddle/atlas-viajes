// La guía de ejecución debe ser autónoma y rastreable para nuevos viajes.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const read = path => fs.readFileSync(path, 'utf8');

test('Atlas: plantilla de seguimiento incluye 14 etapas consecutivas y cuatro auditorías', () => {
  const progress = read('docs/trip-progress-template.md');
  for (let step = 0; step <= 13; step++) {
    const n = String(step).padStart(2, '0');
    assert.match(progress, new RegExp('\\*\\*' + n + ' · '), 'Etapa ' + n);
  }
  for (const name of ['Auditoría A', 'Auditoría B', 'Auditoría C', 'Auditoría D']) {
    assert.match(progress, new RegExp(name));
  }
  assert.match(progress, /Etapa actual/);
  assert.match(progress, /Siguiente acción autónoma/);
  assert.match(progress, /Próxima ejecución autónoma/);
  assert.match(progress, /Sin|sin.*segundo plano/i);
});

test('Atlas: guía, estándar, agente y checklist comparten el procedimiento', () => {
  const agent = read('AGENTS.md');
  const editorial = read('docs/trip-editorial-guide.md');
  const standard = read('docs/trip-master-standard.md');
  const checklist = read('docs/trip-production-checklist.md');
  const readme = read('README.md');
  for (const [name, content] of Object.entries({agent, editorial, standard, checklist, readme})) {
    assert.match(content, /trip-progress-template\.md/, name);
    assert.match(content, /refléjalo en el Atlas/i, name);
    assert.match(content, /00.{0,8}13/, name);
  }
  assert.match(agent, /sin solicitar.*adelante/i);
  assert.match(editorial, /### 4\. Experiencias/);
  assert.match(checklist, /Auditoría/);
});

test('Atlas: nueve secciones se llenan según dependencias, no en orden visual', () => {
  const template = read('docs/trip-progress-template.md');
  const editorial = read('docs/trip-editorial-guide.md');
  const agent = read('AGENTS.md');
  const operations = [
    ['02', 'Temporadas'], ['04', 'Mapa'], ['05', 'Experiencias'],
    ['06', 'Reservaciones importantes'], ['07', 'Movilidad y conexiones'],
    ['08', 'Dónde dormirás'], ['09', 'Día por día'],
    ['10', 'Panorama'], ['11', 'Presupuesto']
  ];
  const stepOrder = [...template.matchAll(/^- \[ \] \*\*(\d\d) · ([^\n]+)/gm)]
    .map(m => ({number: m[1], description: m[2]}));
  assert.deepEqual(stepOrder.map(x => x.number),
    Array.from({length:14}, (_,i)=>String(i).padStart(2,'0')));
  for (const [n, title] of operations) {
    assert.match(stepOrder[Number(n)].description, new RegExp(title), n + ': ' + title);
  }
  for (const file of [template, editorial, agent]) {
    assert.match(file, /orden visual|orden de navegación/i);
    assert.match(file, /Temporadas/);
    assert.match(file, /Presupuesto/);
  }
  const expectedGates = {A:'03',B:'08',C:'11',D:'13'};
  const gateRows = Object.fromEntries([...template.matchAll(/^\| ([A-D]) · [^|]+\| (0\d|1[0-3]) \|/gm)]
    .map(m => [m[1],m[2]]));
  assert.deepEqual(gateRows, expectedGates);
});
