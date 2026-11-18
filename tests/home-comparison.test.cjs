const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'components/home.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'style.css'), 'utf8');

function renderComparison(weather, pace = 'balanced') {
  const trip = {
    id: 'prueba', name: 'Viaje de prueba', start: '2027-01-01', end: '2027-01-03',
    routeCities: ['Ciudad'], days: [{}, {}, {}], bases: [{}], work: 1,
    travelerCount: 1, profile: { weather, pace }
  };
  const window = { AtlasBudget: { planningEstimate: () => ({ low: 100, high: 200 }) } };
  vm.runInNewContext(source, { window });
  const ctx = {
    trips: [trip], photos: {}, main: {}, covers: {}, esc: s => String(s),
    range: () => '1–3 ene 2027', price: () => '$100–$200',
    img: () => '', readable: s => s, highlightWords: s => s,
    familyLabel: () => '', baseLabel: () => '',
    canRenderFullTrip: () => true
  };
  return window.AtlasHome(ctx).comparison();
}

test('la comparativa traduce climas codificados y ritmos', () => {
  const html = renderComparison('winter');
  assert.match(html, />Invernal<\/td>/);
  assert.match(html, />Equilibrado<\/td>/);
  assert.doesNotMatch(html, />winter<\/td>/);
});

test('el clima ausente tiene una etiqueta legible', () => {
  assert.match(renderComparison(undefined), />Por definir<\/td>/);
});

test('la cabecera conserva ocho columnas, sin fusionar Alojamientos y Ritmo', () => {
  const html = renderComparison('Variable');
  const head = html.match(/<thead>(.*?)<\/thead>/)?.[1] || '';
  assert.equal((head.match(/<th /g) || []).length, 8);
  assert.match(head, /<th scope="col">Alojamientos<\/th><th scope="col">Ritmo<\/th>/);
  assert.match(css, /comparison-table th:nth-child\(4\),\.home-comparison \.comparison-table th:nth-child\(5\)\{white-space:nowrap\}/);
  assert.match(css, /comparison-table\{width:100%;min-width:1160px;/);
});
