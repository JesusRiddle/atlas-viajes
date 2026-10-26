const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('existen instrucciones editoriales y están enlazadas desde README y AGENTS', () => {
  const guide = fs.readFileSync('docs/trip-editorial-guide.md', 'utf8');
  const agents = fs.readFileSync('AGENTS.md', 'utf8');
  const readme = fs.readFileSync('README.md', 'utf8');
  for (const heading of ['Panorama del viaje', 'Mapa', 'Temporadas', 'Experiencias',
    'Reservaciones', 'Traslados', 'Dónde dormir', 'Día por día', 'Presupuesto']) {
    assert.ok(guide.includes(heading), 'Falta sección editorial: ' + heading);
  }
  assert.match(agents, /trip-editorial-guide\.md/);
  assert.match(readme, /trip-editorial-guide\.md/);
  assert.match(guide, /introHighlights/);
  assert.match(guide, /No incluir en `intro`/);
});

test('el viaje Italia 2027 mantiene introducción turística con resaltados existentes', () => {
  const trip = JSON.parse(fs.readFileSync(path.join('data/trips','italia-norte-2027.json'), 'utf8'));
  assert.equal(trip.status, 'draft');
  assert.ok(Array.isArray(trip.introHighlights));
  assert.ok(trip.introHighlights.length > 0);
  for (const name of trip.introHighlights) {
    assert.ok(trip.intro.includes(name), 'Resaltado ausente en intro: ' + name);
  }
  assert.doesNotMatch(trip.intro, /reservar primero|aún sin comprar|entrada nominativa|servicios no modificables/i);
});
