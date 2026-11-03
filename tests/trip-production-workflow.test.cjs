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
    assert.ok(file.includes('orden visual') || file.includes('orden de navegación') || file.includes('orden para **construir**'), 'distinguir orden interno y visual');
    assert.match(file, /Temporadas/);
    assert.match(file, /Presupuesto/);
  }
  for (const [letter, stage] of Object.entries({A:'03',B:'08',C:'11',D:'13'})) {
    const gate = template.split(/\r?\n/).find(line => line.startsWith('| ' + letter + ' ·'));
    assert.ok(gate, 'falta auditoría ' + letter);
    assert.ok(gate.includes(stage), 'la auditoría ' + letter + ' debe cerrar en etapa ' + stage);
  }
});

test('Generador crea JSON y bitácora independientes y rechaza duplicados', () => {
  const os = require('node:os');
  const path = require('node:path');
  const cp = require('node:child_process');
  const sandbox = fs.mkdtempSync(path.join(os.tmpdir(), 'atlas-new-trip-'));
  try {
    fs.mkdirSync(path.join(sandbox, 'scripts'));
    fs.mkdirSync(path.join(sandbox, 'docs'));
    fs.mkdirSync(path.join(sandbox, 'data', 'trips'), {recursive:true});
    fs.copyFileSync('scripts/new-trip.cjs', path.join(sandbox, 'scripts', 'new-trip.cjs'));
    fs.copyFileSync('docs/trip-progress-template.md', path.join(sandbox, 'docs', 'trip-progress-template.md'));
    const catalog = 'window.ATLAS_MODULES = [\n  {"id":"ejemplo-existente","file":"ejemplo-existente.json","available":true}\n];\n';
    fs.writeFileSync(path.join(sandbox, 'modules.js'), catalog);
    const result = cp.spawnSync(process.execPath,
      [path.join(sandbox, 'scripts', 'new-trip.cjs'), 'destino-prueba-2028', 'Nuevo destino'],
      {encoding:'utf8'});
    assert.equal(result.status, 0, result.stderr);
    const created = JSON.parse(fs.readFileSync(path.join(sandbox,'data/trips/destino-prueba-2028.json'),'utf8'));
    assert.equal(created.travelerCount, null);
    assert.equal(created.status, 'draft');
    const progress = fs.readFileSync(path.join(sandbox,'docs/trip-progress/destino-prueba-2028.md'),'utf8');
    assert.match(progress, /Nuevo destino/);
    assert.match(progress, /Etapa actual:\*\* 00/);
    assert.match(progress, /Etapa 01/);
    assert.match(progress, /data\/trips\/destino-prueba-2028\.json/);
    const registered = fs.readFileSync(path.join(sandbox, 'modules.js'),'utf8');
    assert.match(registered, /destino-prueba-2028/);
    assert.match(registered, /"available": false/);
    const duplicate = cp.spawnSync(process.execPath,
      [path.join(sandbox,'scripts','new-trip.cjs'), 'destino-prueba-2028','Repetido'],
      {encoding:'utf8'});
    assert.notEqual(duplicate.status, 0);
    assert.equal(fs.readdirSync(path.join(sandbox,'docs/trip-progress')).length,1);
  } finally {
    fs.rmSync(sandbox, {recursive:true,force:true});
  }
});
