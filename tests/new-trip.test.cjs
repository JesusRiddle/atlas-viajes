'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const vm = require('node:vm');

// Un único arnés de integración para el generador: los escenarios se aíslan
// en directorios temporales y nunca modifican los viajes del repositorio.
async function withSandbox(runScenario) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'atlas-new-trip-'));
  try {
    fs.mkdirSync(path.join(root, 'scripts'));
    fs.mkdirSync(path.join(root, 'docs'));
    fs.mkdirSync(path.join(root, 'data', 'trips'), { recursive: true });
    for (const [src, dest] of [
      ['scripts/new-trip.cjs', 'scripts/new-trip.cjs'],
      ['docs/trip-progress-template.md', 'docs/trip-progress-template.md'],
      ['data/trips/_template.json', 'data/trips/_template.json'],
      ['loader.js', 'loader.js']
    ]) fs.copyFileSync(src, path.join(root, dest));
    fs.writeFileSync(path.join(root, 'modules.js'), 'window.ATLAS_MODULES = [];\n');
    const run = (...args) => spawnSync(
      process.execPath, [path.join(root, 'scripts', 'new-trip.cjs'), ...args],
      { cwd: root, encoding: 'utf8' }
    );
    return await runScenario({ root, run, tripPath: id => path.join(root, 'data', 'trips', id + '.json') });
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

test('crear un viaje genera JSON, bitácora y registro sin sobrescribir originales', () => {
  return withSandbox(({ root, run, tripPath }) => {
    const original = { id: 'antiguo', name: 'Viejo', routeCities: ['Roma'],
      experiences: ['Visita'], start: '2026-10-01', costs: [['Hotel', 100, 200]] };
    fs.writeFileSync(tripPath('antiguo'), JSON.stringify(original));
    fs.writeFileSync(path.join(root, 'modules.js'),
      'window.ATLAS_MODULES = [{ "id": "antiguo", "file": "antiguo.json", "available": true }];');

    const result = run('nuevo', 'Nuevo');
    assert.equal(result.status, 0, result.stderr);
    assert.deepEqual(JSON.parse(fs.readFileSync(tripPath('nuevo'), 'utf8')),
      { id: 'nuevo', name: 'Nuevo', travelerCount: null, intro: null, introShort: null });

    const progress = fs.readFileSync(path.join(root, 'docs/trip-progress/nuevo.md'), 'utf8');
    assert.match(progress, /Nuevo/);
    assert.match(progress, /Etapa actual:\*\* 00/);
    assert.match(progress, /Etapa 01/);
    assert.match(progress, /data\/trips\/nuevo\.json/);

    const registry = fs.readFileSync(path.join(root, 'modules.js'), 'utf8');
    assert.match(registry, /"id": "nuevo"/);
    assert.match(registry, /"available": true/);
    assert.equal(run('copia', 'Copia', '--from', 'antiguo').status, 1);
    assert.equal(run('nuevo', 'Duplicado').status, 1);
    assert.equal(fs.readFileSync(tripPath('antiguo'), 'utf8'), JSON.stringify(original));
    assert.doesNotMatch(fs.readFileSync(path.join(root, 'modules.js'), 'utf8'), /"id": "copia"/);
    assert.equal(fs.readdirSync(path.join(root, 'docs/trip-progress')).length, 1);
  });
});

test('alta incremental conserva los datos y normaliza campos pendientes', async () => {
  await withSandbox(async ({ root, run, tripPath }) => {
    const created = run('viaje-prueba', 'Viaje de prueba');
    assert.equal(created.status, 0, created.stderr);
    const file = tripPath('viaje-prueba');
    const draft = JSON.parse(fs.readFileSync(file, 'utf8'));
    assert.deepEqual(draft,
      { id: 'viaje-prueba', name: 'Viaje de prueba', travelerCount: null, intro: null, introShort: null });
    assert.match(fs.readFileSync(path.join(root, 'modules.js'), 'utf8'), /"available": true/);

    const source = { ...draft,
      intro: 'Descripción completa de un viaje de prueba.',
      introShort: 'Resumen breve de portada.',
      routeCities: ['Destino de prueba'], days: [{ n: 1, title: 'Llegada' }],
      experiences: ['Paseo sin reserva'], costs: [['Transporte', null, null]],
      seasonality: { months: { '02': { status: 'recommended', description: 'Valoración de prueba' } } }
    };
    fs.writeFileSync(file, JSON.stringify(source, null, 2));
    const window = { ATLAS_MODULES: [{ id: 'viaje-prueba', file: 'viaje-prueba.json', available: true }] };
    const urls = {
      'data/places.json': {},
      'data/trips/_template.json': JSON.parse(fs.readFileSync(path.join(root, 'data/trips/_template.json'))),
      'data/trips/viaje-prueba.json': source
    };
    const fetch = async url => ({
      ok: Object.hasOwn(urls, url), status: Object.hasOwn(urls, url) ? 200 : 404,
      json: async () => urls[url]
    });
    vm.runInNewContext(fs.readFileSync(path.join(root, 'loader.js'), 'utf8'), { window, fetch });
    const normalized = (await window.ATLAS_READY).trips[0];
    assert.equal(normalized.days.length, 1);
    assert.equal(normalized.introShort, 'Resumen breve de portada.');
    assert.equal(normalized.intro, 'Descripción completa de un viaje de prueba.');
    assert.equal(normalized.costs[0][1], null);
    assert.equal(normalized.seasonality.months['01'].status, 'pending');
    assert.equal(normalized.seasonality.months['02'].status, 'recommended');
    assert.equal(normalized.hotels.length, 0);
    assert.equal(normalized.majorTransport.length, 0);
    assert.deepEqual(JSON.parse(fs.readFileSync(file, 'utf8')), source);
  });
});
