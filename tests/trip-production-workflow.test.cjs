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
  assert.match(agent, /no.*pedir.*adelante/i);
  assert.match(editorial, /### 4\. Experiencias/);
  assert.match(checklist, /Auditoría/);
});
