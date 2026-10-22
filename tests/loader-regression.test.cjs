// Pruebas de regresión de carga de viajes y convivencia de esquemas.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function loadCatalog() {
    const window = {};
    vm.runInNewContext(fs.readFileSync('modules.js', 'utf8'), { window });
    return window.ATLAS_MODULES;
}

test('todos los viajes activos conservan estructura y archivos JSON válidos', () => {
    const catalog = loadCatalog().filter(module => module.available);
    assert.ok(catalog.length > 0);
    const seen = new Set();
    for (const module of catalog) {
        assert.ok(!seen.has(module.id), 'ID repetido: ' + module.id);
        seen.add(module.id);
        assert.equal(module.file, module.id + '.json');
        const trip = JSON.parse(fs.readFileSync('data/trips/' + module.file, 'utf8'));
        assert.equal(trip.id, module.id);
        assert.ok(Array.isArray(trip.days), module.id + ' sin días');
        assert.ok(Array.isArray(trip.mapPoints), module.id + ' sin mapa');
        assert.ok(trip.cover, module.id + ' sin portada');
        assert.ok(trip.stays == null || Array.isArray(trip.stays), module.id + ' con stays inválido');
    }
});

test('coexisten viajes con hoteles estructurados y viajes heredados con stays', () => {
    const catalog = loadCatalog().filter(module => module.available);
    const trips = catalog.map(module => JSON.parse(fs.readFileSync('data/trips/' + module.file, 'utf8')));
    const emilia = trips.find(t => t.id === 'emilia-romana');
    assert.ok(emilia);
    assert.equal(Object.prototype.hasOwnProperty.call(emilia, 'stays'), false);
    assert.equal(emilia.hotels.length, 3);
    assert.ok(trips.some(t => Array.isArray(t.stays) && t.stays.length));
    const stays = Object.fromEntries(trips.map(t => [t.id, Array.isArray(t.stays) ? t.stays : []]));
    assert.deepEqual(stays['emilia-romana'], []);
    assert.ok(stays['espana-portugal'].length > 0);
});

test('el loader normaliza un viaje mínimo sin alterar Emilia-Romagna', async () => {
    const template = JSON.parse(fs.readFileSync('data/trips/_template.json', 'utf8'));
    const emilia = JSON.parse(fs.readFileSync('data/trips/emilia-romana.json', 'utf8'));
    const modules = [
        { id: 'emilia-romana', file: 'emilia-romana.json', available: true },
        { id: 'japon', file: 'japon.json', available: true }
    ];
    const sources = {
        'data/places.json': {},
        'data/trips/_template.json': template,
        'data/trips/emilia-romana.json': emilia,
        'data/trips/japon.json': { id: 'japon', name: 'Japón' }
    };
    const window = { ATLAS_MODULES: modules };
    const fetch = async url => ({ ok: Object.hasOwn(sources, url), status: 404,
        json: async () => sources[url] });
    vm.runInNewContext(fs.readFileSync('loader.js', 'utf8'), { window, fetch });
    const atlas = await window.ATLAS_READY;
    const japan = atlas.trips.find(t => t.id === 'japon');
    assert.equal(japan.status, 'draft');
    assert.equal(japan.start, null);
    assert.equal(japan.work, null);
    assert.equal(japan.days.length, 0);
    assert.equal(japan.mapPoints.length, 0);
    assert.equal(japan.seasonality.months['01'].status, 'pending');
    assert.equal(atlas.trips[0].id, emilia.id);
    assert.equal(atlas.trips[0].majorTransport.length, emilia.majorTransport.length);
    assert.equal(atlas.trips[0].days.length, emilia.days.length);
    assert.deepEqual(Array.from(atlas.trips[0].routeHighlights), emilia.routeHighlights);
});

test('el loader permite stays ausente y rechaza colecciones de tipo incorrecto', async () => {
    const template = JSON.parse(fs.readFileSync('data/trips/_template.json', 'utf8'));
    const trip = JSON.parse(fs.readFileSync('data/trips/emilia-romana.json', 'utf8'));
    const modules = [{ id: 'emilia-romana', file: 'emilia-romana.json', available: true }];
    async function run(value) {
        const window = { ATLAS_MODULES: modules };
        const data = {
            'data/places.json': {},
            'data/trips/_template.json': template,
            'data/trips/emilia-romana.json': value
        };
        const fetch = async url => ({ ok: Object.hasOwn(data, url),
            status: 404, json: async () => data[url] });
        vm.runInNewContext(fs.readFileSync('loader.js', 'utf8'), { window, fetch });
        return window.ATLAS_READY;
    }
    await assert.doesNotReject(run(trip));
    await assert.rejects(run({ ...trip, stays: 'inválido' }), /Campo stays inválido/);
    await assert.rejects(run({ ...trip, days: 'inválido' }), /Campo days inválido/);
    await assert.rejects(run({ ...trip, id: 'otro' }), /Identidad inválida/);
});

test('la limpieza de la vista de viaje es segura y repetible al navegar', () => {
    const window = {};
    vm.runInNewContext(fs.readFileSync('components/trip.js', 'utf8'), { window });
    const trip = window.AtlasTrip({});
    assert.equal(typeof trip.cleanup, 'function');
    assert.doesNotThrow(() => { trip.cleanup(); trip.cleanup(); });
    const source = fs.readFileSync('components/trip.js', 'utf8');
    assert.ok(source.includes('cleanup();'));
    assert.ok(source.includes('mountView(t);'));
});
