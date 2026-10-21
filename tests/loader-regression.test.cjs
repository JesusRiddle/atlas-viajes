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

test('el loader permite stays ausente pero rechaza stays con tipo incorrecto', async () => {
    const modules = [{ id: 'emilia-romana', file: 'emilia-romana.json', available: true }];
    const trip = JSON.parse(fs.readFileSync('data/trips/emilia-romana.json', 'utf8'));
    const mock = data => ({ ok: true, json: async () => data });
    async function run(value) {
        const window = { ATLAS_MODULES: modules };
        const fetch = async url => mock(url === 'data/places.json' ? {} : value);
        vm.runInNewContext(fs.readFileSync('loader.js', 'utf8'), { window, fetch });
        return window.ATLAS_READY;
    }
    await assert.doesNotReject(run(trip));
    await assert.rejects(run({ ...trip, stays: 'inválido' }), /Contenido incompleto/);
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
