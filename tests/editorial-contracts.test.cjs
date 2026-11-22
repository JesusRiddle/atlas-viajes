'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const rules = require('../scripts/editorial-contracts.cjs');

const monthMap = value => Object.fromEntries(rules.MONTHS.map(key => [key, value(key)]));
const pending = () => ({ months: monthMap(() => ({ status: 'pending', description: null })) });

test('temperatura explícita: máxima izquierda, mínima derecha y negativos correctos', () => {
  for (const [source, max, min] of [
    ['Máx. 5 °C · Mín. −3 °C', 5, -3],
    ['Máx. −1 °C · Mín. −12 °C', -1, -12],
    ['Máx. 0 °C · Mín. 0 °C', 0, 0],
    ['Máx. 18,5 °C · Mín. 11,2 °C', 18.5, 11.2]
  ]) assert.deepEqual(rules.temperature(source), { kind: 'explicit', max, min, errors: [] });
  assert.match(rules.temperature('Máx. −3 °C · Mín. 5 °C').errors.join(' '), /máxima/);
  assert.match(rules.temperature('Máx. -1 °C · Mín. -3 °C').errors.join(' '), /Unicode/);
  assert.equal(rules.temperature('5 a −3 °C').kind, 'legacy-interval');
  assert.match(rules.temperature('5 a −3 °C').errors.join(' '), /menor a mayor/);
  assert.equal(rules.temperature('5–3 °C').kind, 'invalid');
  assert.equal(rules.temperature('111 a 2 °C').kind, 'invalid',
    'No aceptar un fragmento numérico dentro de otro valor');
  assert.deepEqual(rules.temperature('Máx. 5 °C · Mín. −3 °C.'),
    { kind: 'explicit', max: 5, min: -3, errors: [] });
  assert.match(rules.temperature('Máx. 5 °C Mín. −3 °C').errors.join(' '), /malformado/);
  assert.match(rules.temperature('Máx. 5 °C · Mín. −3 °C10').errors.join(' '), /malformado/);
});

test('intervalos históricos conservan significado sin inventar mínimos nocturnos', () => {
  assert.deepEqual(rules.temperature('Máximas orientativas: −3 a 5 °C (dos regiones).'),
    { kind: 'legacy-interval', low: -3, high: 5, errors: [] });
  assert.match(rules.temperature('−3 a 5 °C', { allowLegacy: false }).errors.join(' '), /exige/);
  assert.equal(rules.temperature(null).kind, 'missing');
});

test('doce meses: pendientes legítimos y evaluados con intervalos válidos', () => {
  const data = pending();
  assert.deepEqual(rules.seasons(data), []);
  data.months['01'] = { status: 'recommended', description: 'Máx. 5 °C · Mín. −3 °C' };
  assert.deepEqual(rules.seasons(data), []);
  data.months['02'] = { status: 'avoid', description: '5–3 °C' };
  assert.match(rules.seasons(data)[0].path, /02/);
  data.months['02'].status = 'unknown';
  assert.match(rules.seasons(data)[0].message, /inválido/);
  delete data.months['12'];
  assert.ok(rules.seasons(data).some(error => /doce meses/.test(error.message)));
});

test('indicadores de Panorama: orden, moneda ISO y borrador incremental', () => {
  const valid = [
    { id: 'style', title: 'Estilo de viaje', text: 'Caminatas moderadas', badge: 'Moderado', tone: 'green' },
    { id: 'language', title: 'Idioma y moneda', text: 'Efectivo y tarjetas', badge: 'Italiano · EUR', tone: 'green' },
    { id: 'entry', title: 'Documentación y consejos prácticos', text: 'Verificar requisitos', badge: 'Revisar', tone: 'orange' }
  ];
  assert.deepEqual(rules.indicators(valid, { complete: true }), []);
  assert.deepEqual(rules.indicators([], { complete: false }), []);
  assert.ok(rules.indicators([], { complete: true }).length > 0);
  assert.ok(rules.indicators([{...valid[0]}, {...valid[2]}, {...valid[1]}]).length > 0);
  assert.ok(rules.indicators(valid.map(x => x.id === 'language' ? {...x, badge: 'Viaje sencillo'} : x))
    .some(error => /badge/.test(error.path)));
  assert.ok(rules.indicators(valid.map(x => x.id === 'language' ? {...x, badge: 'Inventado · ZZZ'} : x))
    .some(error => /badge/.test(error.path)));
  assert.ok(rules.indicators(valid.map(x => x.id === 'entry' ? {...x, badge: ''} : x))
    .some(error => /badge/.test(error.path)));
  assert.deepEqual(rules.indicators(valid.map(x => x.id === 'language' ?
    {...x, badge: 'Alemán · CHF; italiano · EUR'} : x)), []);
});

test('un nuevo viaje parcial no exige secciones ya completadas', () => {
  assert.deepEqual(rules.trip({ id: 'nuevo-viaje', name: 'Borrador' }), []);
  assert.ok(rules.trip({ id: 'nuevo-viaje', practicalIndicators: '' }).length > 0,
    'Una colección incorrecta no debe tratarse como pendiente');
  assert.ok(rules.trip({ id: 'nuevo-viaje', name: 'Borrador' }, { complete: true }).length > 0);
});

test('nueve secciones maestras en el orden establecido', () => {
  assert.deepEqual(rules.sections(rules.SECTIONS), []);
  assert.ok(rules.sections(rules.SECTIONS.slice(1)).length);
  assert.ok(rules.sections([...rules.SECTIONS].reverse()).length);
});

test('Temporadas presenta rangos sin atribuir mínimas nocturnas inexistentes', () => {
  const window = {};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../components/seasonality.js'), 'utf8'), { window });
  const data = pending();
  data.months['01'] = { status: 'recommended', description: 'Máximas diurnas orientativas: −3 a 5 °C entre regiones.' };
  data.months['02'] = { status: 'conditional', description: '5 a 12 °C. Temperaturas variables.' };
  data.months['03'] = { status: 'recommended', description: 'Máx. 5 °C · Mín. −3 °C. Días fríos.' };
  const html = window.AtlasSeasonality({ esc: String }).seasonality({ seasonality: data });
  const displayed = [...html.matchAll(/class="season-temperature">([^<]+)</g)].map(m => m[1]);
  assert.equal(displayed.length, 12);
  assert.deepEqual(displayed.slice(0, 4), [
    'Máximas: −3 a 5 °C', 'Intervalo: 5 a 12 °C',
    'Máx. 5 °C · Mín. −3 °C', '—'
  ]);
  assert.ok(!displayed[0].includes('Mín.'), 'No inventar mínimas nocturnas');
  assert.match(html, /Máximas diurnas orientativas: −3 a 5 °C entre regiones\./,
    'El texto original conserva la explicación geográfica');
  assert.match(html, /Temperaturas variables/);
  assert.match(html, /Días fríos/);
});

test('contratos se aplican a los nueve viajes principales sin exigir datos de ideas históricas', () => {
  const window = {};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../modules.js'), 'utf8'), { window });
  const modules = window.ATLAS_MODULES.filter(module => module.available && module.homeGroup !== 'ideas');
  assert.ok(modules.length > 0);
  const seasonWindow = {};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../components/seasonality.js'), 'utf8'),
    { window: seasonWindow });
  for (const module of modules) {
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/trips', module.file), 'utf8'));
    const errors = rules.trip(data, { complete: Array.isArray(data.practicalIndicators) &&
      data.practicalIndicators.length > 0 });
    assert.deepEqual(errors, [], module.id + ': ' + JSON.stringify(errors));
    if (data.seasonality?.months) {
      const html = seasonWindow.AtlasSeasonality({ esc: String }).seasonality(data);
      const shown = [...html.matchAll(/class="season-temperature">([^<]+)</g)].map(match => match[1]);
      assert.equal(shown.length, 12, module.id + ': doce tarjetas de temporada');
      rules.MONTHS.forEach((key, index) => {
        const month = data.seasonality.months[key];
        const expected = rules.temperature(month?.description);
        if (!month || month.status === 'pending') assert.equal(shown[index], '—', module.id + ': ' + key);
        else {
          assert.notEqual(shown[index], '—', module.id + ': ' + key + ' sin temperatura');
          if (expected.kind === 'explicit')
            assert.equal(shown[index], month.description.match(/Máx\\.\\s*[−-]?\\d+(?:[.,]\\d+)?\\s*°C\\s*·\\s*Mín\\.\\s*[−-]?\\d+(?:[.,]\\d+)?\\s*°C/u)[0]);
          else assert.match(shown[index], /^(Máximas|Intervalo): /, module.id + ': ' + key);
        }
      });
    }
  }
});
