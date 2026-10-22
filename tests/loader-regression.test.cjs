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
    assert.equal(atlas.trips[0].routeHighlights, emilia.routeHighlights);
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

test('plantilla universal: identidad mínima, estados pendientes y meses completos', async () => {
    const template = JSON.parse(fs.readFileSync('data/trips/_template.json', 'utf8'));
    const window = { ATLAS_MODULES: [{ id: 'japon', file: 'japon.json', available: true }] };
    let source = { id: 'japon', name: 'Japón', seasonality: { months: { '02': { status: 'recommended', description: 'Cerezos tempranos' } } } };
    const fetch = async url => ({ ok: true, json: async () => url === 'data/places.json' ? {} :
        url === 'data/trips/_template.json' ? template : source });
    const run = async () => {
        vm.runInNewContext(fs.readFileSync('loader.js', 'utf8'), { window, fetch });
        return window.ATLAS_READY;
    };
    const data = await run();
    const trip = data.trips[0];
    assert.equal(trip.seasonality.months['02'].status, 'recommended');
    assert.equal(trip.seasonality.months['02'].description, 'Cerezos tempranos');
    assert.equal(trip.seasonality.months['01'].status, 'pending');
    assert.equal(Object.keys(trip.seasonality.months).length, 12);
    assert.equal(trip.work, null);
    assert.equal(trip.bases.length, 0);
    assert.equal(trip.status, 'draft');
    source = { ...source, seasonality: { months: { '02': { status: 'invalid' } } } };
    await assert.rejects(run(), /Temporada 02 inválida/);
});

test('un viaje mínimo comparte encabezado, navegación y nueve anclas del modelo maestro', () => {
    const raw = JSON.parse(fs.readFileSync('data/trips/_template.json', 'utf8'));
    const trip = { ...raw, id: 'japon', name: 'Japón' };
    const main = { innerHTML: '', classList: { toggle() {} } };
    const window = {
        AtlasGallery: { init() {} },
        AtlasMajorTransport: { mount: () => () => {} },
        AtlasBudgetTable: { mount: () => () => {} },
        AtlasDayBudget: { mount: () => () => {} },
        AtlasTravel: { initMap() {}, mapSection: () => '<section id="mapa"></section>' },
    };
    const document = { querySelector: () => null };
    vm.runInNewContext(fs.readFileSync('components/trip.js', 'utf8'), { window, document });
    const ctx = {
        trips: [trip], main, covers: {}, esc: String, sums: () => [0, 0],
        canRenderFullTrip: () => false, seasonality: () => '<section id="temporadas"></section>',
        mountTransport: () => () => {}, experiencePanel: () => '<article id="experiencias"></article>',
        reservationPlanning: () => '<article id="reservas"></article>',
        stayParagraphs: () => '<div class="hotel-grid"></div>', home() {}
    };
    const view = window.AtlasTrip(ctx);
    assert.doesNotThrow(() => view.tripPage('japon'));
    assert.match(main.innerHTML, /class="triphero"/);
    assert.match(main.innerHTML, /Duración por definir/);
    assert.match(main.innerHTML, /Días laborales por definir/);
    assert.doesNotMatch(main.innerHTML, /Invalid Date|undefined|NaN|0 días naturales/);
    for (const id of ['plan','mapa','temporadas','experiencias','reservas','traslados','alojamientos','dias','costes']) {
        assert.ok(main.innerHTML.includes('id="' + id + '"'), id + ' sin sección');
        assert.ok(main.innerHTML.includes('#viaje/japon/' + id), id + ' sin navegación');
    }
    assert.doesNotMatch(main.innerHTML, /draft-trip-section|draft-hero/);
});

test('Panorama incremental utiliza los contenedores maestros sin inventar presupuesto', () => {
    const template = JSON.parse(fs.readFileSync('data/trips/_template.json', 'utf8'));
    const sample = { ...template, id: 'japon', name: 'Japón', intro: 'Una ruta por Japón' };
    const main = { innerHTML: '', classList: { toggle() {} } };
    const window = {
        AtlasGallery: { init() {} },
        AtlasMajorTransport: { mount: () => () => {} },
        AtlasBudgetTable: { mount: () => () => {} },
        AtlasDayBudget: { mount: () => () => {} },
        AtlasTravel: { initMap() {}, mapSection: () => '<section id="mapa"></section>' }
    };
    const document = { querySelector: () => null };
    vm.runInNewContext(fs.readFileSync('components/trip.js', 'utf8'), { window, document });
    const ctx = {
        trips: [sample], main, covers: {}, esc: String,
        sums: () => [0, 0], canRenderFullTrip: () => false,
        highlightWords: text => text, mountTransport: () => () => {},
        seasonality: () => '<section id="temporadas"></section>',
        experiencePanel: () => '<article id="experiencias"></article>',
        reservationPlanning: () => '<article id="reservas"></article>',
        stayParagraphs: () => '<div class="hotel-grid"></div>', home() {}
    };
    window.AtlasTrip(ctx).tripPage('japon');
    const html = main.innerHTML;
    assert.match(html, /class="overview overview-editorial"/);
    assert.match(html, /Una ruta por Japón/);
    assert.match(html, /class="overview-side"/);
    assert.match(html, /class="overview-climate-card"/);
    assert.match(html, /class="budget-teaser"/);
    assert.match(html, /class="overview-stays overview-stays-inline"/);
    assert.doesNotMatch(html, /\$0|NaN|undefined|Invalid Date/);
    assert.doesNotMatch(html, /draft-trip-panel/);
});

test('Temporadas renderiza los doce meses con pendientes y valores conocidos', () => {
    const window = {};
    vm.runInNewContext(fs.readFileSync('components/seasonality.js', 'utf8'), { window });
    const months = JSON.parse(fs.readFileSync('data/trips/_template.json', 'utf8')).seasonality.months;
    months['03'] = { status: 'recommended', description: 'Clima templado' };
    const html = window.AtlasSeasonality({ esc: String }).seasonality({ seasonality: { months } });
    assert.equal((html.match(/class="season-month season-/g) || []).length, 12);
    assert.match(html, /Clima templado/);
    assert.match(html, /season-recommended/);
    assert.match(html, /season-pending/);
    assert.match(html, /id="temporadas"/);
});

test('Experiencias vacías o parciales mantienen el panel maestro sin inventar destinos', () => {
    const window = {};
    vm.runInNewContext(fs.readFileSync('components/sections.js', 'utf8'), { window });
    const factory = window.AtlasSections({ trips: [], stays: {}, esc: String });
    const empty = factory.experiencePanel({ id: 'japon', experiences: [], profile: {} });
    assert.match(empty, /id="experiencias"/);
    assert.match(empty, /class="panel experience-panel"/);
    assert.match(empty, /Por definir/);
    assert.doesNotMatch(empty, /Arte extraordinario/);
    const partial = factory.experiencePanel({ id: 'japon', experiences: [
        { city: 'Tokio', description: 'Explorar Asakusa' }
    ], profile: {} });
    assert.match(partial, /Tokio/);
    assert.match(partial, /Explorar Asakusa/);
    assert.doesNotMatch(partial, /Por definir/);
});

test('reservaciones y alojamientos admiten registros vacíos y parciales', () => {
    const window = {};
    vm.runInNewContext(fs.readFileSync('components/sections.js', 'utf8'), { window });
    const trip = { id: 'japon', name: 'Japón', hotels: [], stays: [], reservations: [], planningDetails: null };
    const sections = window.AtlasSections({ trips: [trip], stays: { japon: [] }, esc: String });
    assert.match(sections.reservationPlanning(trip), /class="panel reservation-panel"/);
    assert.match(sections.reservationPlanning(trip), /Por definir/);
    assert.match(sections.stayParagraphs('japon'), /class="hotel-card"/);
    assert.match(sections.stayParagraphs('japon'), /Por definir/);
    trip.reservations = [['Prioritarias', [{ title: 'Museo', description: 'Entrada sin confirmar' }]]];
    assert.match(sections.reservationPlanning(trip), /Entrada sin confirmar/);
    trip.hotels = [{ city: 'Tokio', name: 'Hotel por elegir', checkIn: '2026-11-01' }];
    const hotels = sections.stayParagraphs('japon');
    assert.match(hotels, /Hotel por elegir/);
    assert.doesNotMatch(hotels, /undefined|Invalid Date/);
});

test('la composición mínima presenta reservaciones, traslados y hoteles con sus anclas maestras', () => {
    const raw = JSON.parse(fs.readFileSync('data/trips/_template.json', 'utf8'));
    const trip = { ...raw, id: 'japon', name: 'Japón' };
    const main = { innerHTML: '', classList: { toggle() {} } };
    const window = {
        AtlasGallery: { init() {} },
        AtlasMajorTransport: { mount: () => () => {} },
        AtlasBudgetTable: { mount: () => () => {} },
        AtlasDayBudget: { mount: () => () => {} },
        AtlasTravel: { initMap() {}, mapSection: () => '<section id="mapa"></section>' }
    };
    const document = { querySelector: () => null };
    vm.runInNewContext(fs.readFileSync('components/trip.js', 'utf8'), { window, document });
    const sections = (() => {
        const w = {};
        vm.runInNewContext(fs.readFileSync('components/sections.js', 'utf8'), { window: w });
        return w.AtlasSections({ trips: [trip], stays: { japon: [] }, esc: String });
    })();
    const ctx = {
        trips: [trip], main, covers: {}, esc: String, sums: () => [0,0],
        canRenderFullTrip: () => false, mountTransport: () => () => {},
        seasonality: () => '<section id="temporadas"></section>',
        experiencePanel: () => '<article id="experiencias"></article>',
        reservationPlanning: sections.reservationPlanning,
        stayParagraphs: sections.stayParagraphs, home() {}
    };
    window.AtlasTrip(ctx).tripPage('japon');
    for (const id of ['reservas','traslados','alojamientos']) {
        assert.match(main.innerHTML, new RegExp('id="' + id + '"'));
    }
    assert.match(main.innerHTML, /Por definir/);
    assert.doesNotMatch(main.innerHTML, /confirma los vuelos para estas fechas/);
});

test('el mapa no ofrece botones de localidad sin coordenadas válidas', () => {
    const source = fs.readFileSync('travel-ui.js', 'utf8');
    assert.match(source, /positioned\.map\(p=>/);
    assert.match(source, /positioned\.length \? `<div id="trip-map"/);
    assert.match(source, /Coordenadas por definir/);
    assert.match(source, /Array\.isArray\(p\.coords\)/);
});

test('Día por día y Presupuesto muestran pendientes sin totales ficticios', () => {
    const raw = JSON.parse(fs.readFileSync('data/trips/_template.json','utf8'));
    const trip = { ...raw, id: 'japon', name: 'Japón', days: [
        { n: 1, title: 'Tokio: llegada', base: 'Tokio' },
        { n: 2, title: 'Kioto: explorar' }
    ], costs: [['Tren', null, null]] };
    const main = { innerHTML: '', classList: { toggle() {} } };
    const window = { AtlasGallery: { init() {} },
        AtlasMajorTransport: { mount: () => () => {} },
        AtlasBudgetTable: { mount: () => () => {} },
        AtlasDayBudget: { mount: () => () => {} },
        AtlasTravel: { mapSection: () => '<section id="mapa"></section>', initMap() {} } };
    const document = { querySelector: () => null };
    vm.runInNewContext(fs.readFileSync('components/trip.js','utf8'), {window,document});
    const ctx = { trips:[trip], main, covers:{}, esc:String, sums:() => [0,0],
        canRenderFullTrip: () => false, mountTransport: () => () => {},
        seasonality: () => '<section id="temporadas"></section>',
        experiencePanel: () => '<article id="experiencias"></article>',
        reservationPlanning: () => '<article id="reservas"></article>',
        stayParagraphs: () => '<div class="hotel-grid"></div>',
        home() {} };
    window.AtlasTrip(ctx).tripPage('japon');
    assert.match(main.innerHTML, /id="dias"/);
    assert.match(main.innerHTML, /Tokio: llegada/);
    assert.match(main.innerHTML, /Fecha por definir/);
    assert.match(main.innerHTML, /id="costes"/);
    assert.match(main.innerHTML, /Tren/);
    assert.match(main.innerHTML, /Por cotizar/);
    assert.doesNotMatch(main.innerHTML, /0\.00|\$0|NaN|undefined|Invalid Date|Total completo/);
    assert.doesNotMatch(main.innerHTML, /id="expand"|id="print"/);
});

test('el alta mínima queda oculta hasta activar el módulo y conserva los 17 viajes', async () => {
    const catalog = loadCatalog();
    const sample = catalog.find(item => item.id === 'nuevo-viaje');
    assert.ok(sample);
    assert.equal(sample.available, false);
    assert.equal(catalog.filter(item => item.available).length, 17);
    assert.equal(sample.file, 'nuevo-viaje.json');
    const minimal = JSON.parse(fs.readFileSync('data/trips/nuevo-viaje.json', 'utf8'));
    assert.deepEqual(minimal, { id: 'nuevo-viaje', name: 'Nuevo destino' });

    const template = JSON.parse(fs.readFileSync('data/trips/_template.json', 'utf8'));
    const modules = [{ ...sample, available: true }];
    const window = { ATLAS_MODULES: modules };
    const sources = {
        'data/places.json': {},
        'data/trips/_template.json': template,
        'data/trips/nuevo-viaje.json': minimal
    };
    const fetch = async url => ({ ok: Object.hasOwn(sources, url), status: 404,
        json: async () => sources[url] });
    vm.runInNewContext(fs.readFileSync('loader.js', 'utf8'), { window, fetch });
    const atlas = await window.ATLAS_READY;
    assert.equal(atlas.trips.length, 1);
    assert.equal(atlas.trips[0].id, 'nuevo-viaje');
    assert.equal(atlas.trips[0].status, 'draft');
    assert.equal(atlas.trips[0].days.length, 0);
    assert.equal(atlas.trips[0].mapPoints.length, 0);
    assert.equal(atlas.trips[0].seasonality.months['01'].status, 'pending');
});

test('migración piloto preserva contenido sin copiar fechas ni precios heredados', async () => {
    const catalog = loadCatalog();
    assert.equal(catalog.filter(m => m.available).length, 17);
    const module = catalog.find(m => m.id === 'espana-portugal-renovado');
    assert.ok(module);
    assert.equal(module.available, false);
    const source = JSON.parse(fs.readFileSync('data/trips/espana-portugal.json','utf8'));
    const migrated = JSON.parse(fs.readFileSync('data/trips/espana-portugal-renovado.json','utf8'));
    assert.equal(migrated.name, source.name);
    assert.deepEqual(migrated.routeCities, source.routeCities);
    assert.deepEqual(migrated.experiences, source.experiences);
    for (const field of ['intro','start','end','work','costs','expenses','majorTransport','days','reservations','budgetRange','hotels','stays','seasonality']) {
        assert.equal(Object.hasOwn(migrated, field), false, field + ' should not be copied without review');
    }
    const template = JSON.parse(fs.readFileSync('data/trips/_template.json','utf8'));
    const window = { ATLAS_MODULES: [{ ...module, available: true }] };
    const sources = {
        'data/places.json': {},
        'data/trips/_template.json': template,
        'data/trips/espana-portugal-renovado.json': migrated
    };
    const fetch = async url => ({ ok: Object.hasOwn(sources, url), status: 404,
        json: async () => sources[url] });
    vm.runInNewContext(fs.readFileSync('loader.js','utf8'), { window, fetch });
    const trip = (await window.ATLAS_READY).trips[0];
    assert.equal(trip.start, null);
    assert.equal(trip.end, null);
    assert.equal(trip.days.length, 0);
    assert.equal(trip.expenses.length, 0);
    assert.equal(trip.seasonality.months['01'].status, 'pending');
});

test('paso 15: template universal preserva información parcial, cero y falso sin mutar origen', async () => {
    const template = JSON.parse(fs.readFileSync('data/trips/_template.json', 'utf8'));
    const original = {
        id: 'prueba-universal', name: 'Prueba universal', status: 'draft',
        start: '2027-02-03', end: null, work: 0, budgetPreliminary: false,
        profile: { pace: 0, solo: false },
        routeCities: ['Tokio'], experiences: ['Un paseo de prueba'],
        days: [{ n: 1, title: 'Llegada', base: 'Tokio' }],
        costs: [['Transporte', null, null]],
        seasonality: { months: { '02': { status: 'recommended', description: 'Temporada elegida' } } }
    };
    const snapshot = JSON.stringify(original);
    const window = { ATLAS_MODULES: [{ id: original.id, file: original.id + '.json', available: true }] };
    const fetch = async url => ({ ok: true, json: async () =>
        url === 'data/places.json' ? {} : url === 'data/trips/_template.json' ? template : original });
    vm.runInNewContext(fs.readFileSync('loader.js','utf8'), { window, fetch });
    const trip = (await window.ATLAS_READY).trips[0];
    assert.equal(JSON.stringify(original), snapshot, 'la carga no debe modificar los datos fuente');
    assert.equal(trip.status, 'draft');
    assert.equal(trip.start, '2027-02-03');
    assert.equal(trip.end, null);
    assert.equal(trip.work, 0);
    assert.equal(trip.budgetPreliminary, false);
    assert.equal(trip.profile.pace, 0);
    assert.equal(trip.profile.solo, false);
    assert.equal(trip.profile.weather, null);
    assert.equal(trip.days.length, 1);
    assert.equal(trip.costs[0][1], null);
    assert.equal(Object.keys(trip.seasonality.months).length, 12);
    assert.equal(trip.seasonality.months['02'].status, 'recommended');
    assert.equal(trip.seasonality.months['01'].status, 'pending');
    assert.equal(trip.majorTransport.length, 0);
    assert.equal(trip.expenses.length, 0);
});

test('paso 15: un viaje nuevo completo no pierde datos estructurados al cargar', async () => {
    const template = JSON.parse(fs.readFileSync('data/trips/_template.json', 'utf8'));
    const complete = JSON.parse(fs.readFileSync('data/trips/emilia-romana.json', 'utf8'));
    const window = { ATLAS_MODULES: [{ id: complete.id, file: complete.id + '.json', available: true }] };
    const fetch = async url => ({ ok: true, json: async () =>
        url === 'data/places.json' ? {} : url === 'data/trips/_template.json' ? template : complete });
    vm.runInNewContext(fs.readFileSync('loader.js','utf8'), { window, fetch });
    const trip = (await window.ATLAS_READY).trips[0];
    for (const field of ['days','hotels','mapPoints','majorTransport','expenses','routeCities','experiences']) {
        assert.deepEqual(trip[field], complete[field], 'No cambiar ' + field);
    }
    assert.equal(trip.id, complete.id);
    assert.equal(trip.name, complete.name);
});
