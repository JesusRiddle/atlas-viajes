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
        assert.ok(trip.cover === null || (typeof trip.cover === 'string' && trip.cover.length > 0), module.id + ' con portada inválida');
        assert.ok(trip.stays == null || Array.isArray(trip.stays), module.id + ' con stays inválido');
    }
});

test('Suiza verde mantiene fechas, ruta y estados sin afirmar compras', () => {
    const catalog = loadCatalog();
    const module = catalog.find(item => item.id === 'suiza-verde-2027');
    assert.ok(module && module.available, 'Suiza verde registrada en el catálogo');
    const trip = JSON.parse(fs.readFileSync('data/trips/suiza-verde-2027.json', 'utf8'));
    assert.equal(trip.status, null, 'El Atlas ya no emplea estado draft público');
    assert.equal(trip.cover, 'swissgreen-oeschinensee-cover');
    assert.equal(trip.travelerCount, 1);
    assert.equal(trip.days.length, 16);
    assert.equal(trip.bases.reduce((sum, item) => sum + item[1], 0), 14);
    assert.equal(trip.expenses.length, 35, 'El presupuesto integral contiene partidas estimadas, no compras');
    assert.ok(trip.expenses.every(e => e.status === 'estimated'));
    assert.ok(trip.experiences.some(item => /Titlis/i.test(JSON.stringify(item))));
    assert.ok(trip.experiences.some(item => /Heidi/i.test(JSON.stringify(item))));
    assert.ok(catalog.indexOf(module) > catalog.findIndex(item => item.id === 'suiza-nevada-2027'), 'El borrador de septiembre no desplaza la ruta de enero');
});

test('coexisten viajes con hoteles estructurados y viajes heredados con stays', () => {
    const catalog = loadCatalog().filter(module => module.available);
    const trips = catalog.map(module => JSON.parse(fs.readFileSync('data/trips/' + module.file, 'utf8')));
    const italia = trips.find(t => t.id === 'italia-norte-2027');
    assert.ok(italia);
    assert.equal(Object.prototype.hasOwnProperty.call(italia, 'stays'), false);
    assert.equal(italia.hotels.length, 3);
    assert.ok(trips.some(t => Array.isArray(t.stays) && t.stays.length));
    const stays = Object.fromEntries(trips.map(t => [t.id, Array.isArray(t.stays) ? t.stays : []]));
    assert.deepEqual(stays['italia-norte-2027'], []);
    assert.equal(stays['espana-portugal'], undefined, 'El viaje antiguo ya no debe figurar en el catálogo');
});

test('el loader normaliza un viaje mínimo sin alterar Italia Norte 2027', async () => {
    const template = JSON.parse(fs.readFileSync('data/trips/_template.json', 'utf8'));
    const italia = JSON.parse(fs.readFileSync('data/trips/italia-norte-2027.json', 'utf8'));
    const modules = [
        { id: 'italia-norte-2027', file: 'italia-norte-2027.json', available: true },
        { id: 'japon', file: 'japon.json', available: true }
    ];
    const sources = {
        'data/places.json': {},
        'data/trips/_template.json': template,
        'data/trips/italia-norte-2027.json': italia,
        'data/trips/japon.json': { id: 'japon', name: 'Japón' }
    };
    const window = { ATLAS_MODULES: modules };
    const fetch = async url => ({ ok: Object.hasOwn(sources, url), status: 404,
        json: async () => sources[url] });
    vm.runInNewContext(fs.readFileSync('loader.js', 'utf8'), { window, fetch });
    const atlas = await window.ATLAS_READY;
    const japan = atlas.trips.find(t => t.id === 'japon');
    assert.equal(japan.status, null);
    assert.equal(japan.start, null);
    assert.equal(japan.work, null);
    assert.equal(japan.days.length, 0);
    assert.equal(japan.mapPoints.length, 0);
    assert.equal(japan.seasonality, null);
    assert.equal(atlas.trips[0].id, italia.id);
    assert.equal(atlas.trips[0].majorTransport.length, italia.majorTransport.length);
    assert.equal(atlas.trips[0].days.length, italia.days.length);
    assert.deepEqual(Array.from(atlas.trips[0].routeHighlights || []), Array.from(italia.routeHighlights || []));
});

test('el loader permite stays ausente y rechaza colecciones de tipo incorrecto', async () => {
    const template = JSON.parse(fs.readFileSync('data/trips/_template.json', 'utf8'));
    const trip = JSON.parse(fs.readFileSync('data/trips/italia-norte-2027.json', 'utf8'));
    const modules = [{ id: 'italia-norte-2027', file: 'italia-norte-2027.json', available: true }];
    async function run(value) {
        const window = { ATLAS_MODULES: modules };
        const data = {
            'data/places.json': {},
            'data/trips/_template.json': template,
            'data/trips/italia-norte-2027.json': value
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
    assert.equal(trip.status, null);
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
    assert.match(main.innerHTML, /class="triphero triphero-split"/);
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

test('el alta mínima es visible de inmediato y conserva los viajes históricos', async () => {
    const catalog = loadCatalog();
    assert.equal(catalog.length, 23);
    assert.ok(catalog.some(item => item.id === 'orlando-2026' && item.available));
    assert.ok(catalog.every(item => item.available));
    assert.equal(catalog.filter(item => item.homeGroup === 'ideas').length, 15);
    assert.ok(catalog.some(item => item.id === 'italia-norte-2027' && item.available));
    const template = JSON.parse(fs.readFileSync('data/trips/_template.json', 'utf8'));
    const minimal = { id: 'nuevo-destino', name: 'Nuevo destino' };
    const sample = { id: 'nuevo-destino', file: 'nuevo-destino.json', available: true };
    const window = { ATLAS_MODULES: [sample] };
    const sources = {
        'data/places.json': {},
        'data/trips/_template.json': template,
        'data/trips/nuevo-destino.json': minimal
    };
    const fetch = async url => ({ ok: Object.hasOwn(sources,url),status:404,json: async()=>sources[url] });
    vm.runInNewContext(fs.readFileSync('loader.js','utf8'), {window,fetch});
    const atlas = await window.ATLAS_READY;
    assert.equal(atlas.trips.length,1);
    assert.equal(atlas.trips[0].homeGroup,'main');
    assert.equal(atlas.trips[0].status,null);
    assert.equal(atlas.trips[0].days.length,0);
    assert.equal(atlas.trips[0].mapPoints.length,0);
    assert.equal(atlas.trips[0].seasonality,null);
});

test('Colombia y Suiza siguen el orden cronológico y España + Portugal conserva su contenido completo', async () => {
    const catalog = loadCatalog();
    assert.equal(catalog[0].id, 'orlando-2026');
    assert.equal(catalog[0].available, true);
    assert.deepEqual(Array.from(catalog.filter(item => item.homeGroup !== 'ideas').slice(0, 8), item => item.id), [
        'orlando-2026',
        'colombia-2027',
        'suiza-nevada-2027',
        'italia-norte-2027',
        'espana-portugal-2027',
        'suiza-verde-2027',
        'japon-2027',
        'patagonia-argentina-2027'
    ], 'Los viajes principales conservan el orden cronológico con Orlando 2026 antes de 2027');
    const migrated = JSON.parse(fs.readFileSync('data/trips/espana-portugal-2027.json', 'utf8'));
    assert.equal(migrated.id, 'espana-portugal-2027');
    assert.equal(migrated.days.length, 20);
    assert.equal(migrated.hotels.length, 5);
    // Incluye lugares opcionales añadidos durante la auditoría editorial.
    assert.ok(migrated.days.reduce((n, day) => n + day.places.length, 0) >= 53,
        'Las visitas originales deben mantenerse al añadir la visita al Prado y Retiro');
    const madridDay = migrated.days.find(day => day.date === '2027-05-15');
    assert.match(madridDay.title, /Prado.*Retiro/);
    assert.ok(madridDay.places.includes('prado'));
    assert.ok(madridDay.places.includes('retiro'));
    assert.ok(!madridDay.places.includes('sp27-san-isidro'),
        'San Isidro no debe figurar como visita elegida');
    const lisbonDay = migrated.days.find(day => day.date === '2027-05-26');
    const templarPlaces = ['sp27-castelo-almourol', 'sp27-convento-cristo'];
    const placeCatalog = JSON.parse(fs.readFileSync('data/places.json', 'utf8'));
    for (const key of templarPlaces) {
        assert.ok(lisbonDay.places.includes(key), key + ' debe aparecer en la galería del día');
        assert.ok(lisbonDay.optionalPlaces.includes(key), key + ' no debe ser visita obligatoria');
        assert.match(placeCatalog[key]?.photo?.src || '', /^https:\/\/upload\.wikimedia\.org\//);
        assert.ok(placeCatalog[key].photo.source, key + ' debe acreditar la fuente');
        assert.ok(placeCatalog[key].photo.license, key + ' debe indicar licencia');
    }
    assert.match(lisbonDay.note, /sustituye por completo la jornada Alfama/);
    assert.ok(migrated.reservations.some(group => group[1].some(item => /Almourol, Tomar/.test(item.title))));
    assert.ok(migrated.cover);
    assert.deepEqual(migrated.budgetRange,
        [78312.24, 120312.24], 'Rango revisado con vuelos internacionales cotizados');
    const expenseTotal = migrated.expenses.reduce((sum, item) => sum + (item.cost?.amount || 0), 0);
    assert.ok(Math.abs(expenseTotal - 94812.24) < 0.01,
        'Presupuesto central: vuelo internacional contado una sola vez');
    const template = JSON.parse(fs.readFileSync('data/trips/_template.json', 'utf8'));
    const window = { ATLAS_MODULES: [catalog.find(item => item.id === 'espana-portugal-2027')] };
    const sources = {
        'data/places.json': JSON.parse(fs.readFileSync('data/places.json', 'utf8')),
        'data/trips/_template.json': template,
        'data/trips/espana-portugal-2027.json': migrated
    };
    const fetch = async url => ({ ok: Object.hasOwn(sources, url), status: 404,
        json: async () => sources[url] });
    vm.runInNewContext(fs.readFileSync('loader.js', 'utf8'), { window, fetch });
    const trip = (await window.ATLAS_READY).trips[0];
    assert.equal(trip.days.length, 20);
    assert.equal(trip.hotels.length, 5);
    assert.equal(trip.days[0].date, '2027-05-08');
    assert.equal(trip.days[19].date, '2027-05-27');
});

test('Panorama editorial de los seis viajes desarrollados: tres indicadores y clima independiente', () => {
    const ids = ['suiza-nevada-2027', 'suiza-verde-2027', 'espana-portugal-2027', 'italia-norte-2027',
        'japon-2027', 'patagonia-argentina-2027'];
    const expectedTitles = ['Estilo de viaje', 'Idioma y moneda', 'Documentación y consejos prácticos'];
    for (const id of ids) {
        const trip = JSON.parse(fs.readFileSync('data/trips/' + id + '.json', 'utf8'));
        const indicators = trip.practicalIndicators;
        assert.deepEqual(indicators.map(item => item.id), ['style', 'language', 'entry'],
            id + ': IDs exactos y sin indicador weather');
        assert.deepEqual(indicators.map(item => item.title), expectedTitles,
            id + ': títulos oficiales de Panorama');
        assert.equal(typeof trip.climate, 'string', id + ': clima por separado');
        assert.ok(trip.climate.length > 200, id + ': tarjeta climática con información suficiente');
    }
    const swiss = JSON.parse(fs.readFileSync('data/trips/suiza-nevada-2027.json', 'utf8'));
    assert.equal(swiss.climate.trim().split(/\n\s*\n/).length, 3);
    assert.match(swiss.climate, /\*Qué llevar:\*/);
    assert.match(swiss.climate, /\*Horas de luz:\*/);
    assert.doesNotMatch(swiss.practicalIndicators.map(item => item.title).join(' '),
        /Clima y luz|Documentación y electricidad/);
});

test('Los seis viajes nuevos muestran intervalos térmicos sin guiones ambiguos', () => {
    const ids = ['suiza-nevada-2027', 'suiza-verde-2027', 'italia-norte-2027', 'espana-portugal-2027',
        'japon-2027', 'patagonia-argentina-2027'];
    const validRange = /[−]?\d{1,2} a [−]?\d{1,2} °C/;
    const legacyRange = /[−-]?\d{1,2}\s*[–—-]\s*[−-]?\d{1,2}\s*°\s*C/;
    const seasonWindow = { AtlasSeasonality: null };
    vm.runInNewContext(fs.readFileSync('components/seasonality.js', 'utf8'), { window: seasonWindow });
    for (const id of ids) {
        const trip = JSON.parse(fs.readFileSync('data/trips/' + id + '.json', 'utf8'));
        const months = Object.values(trip.seasonality.months);
        assert.equal(months.length, 12, id + ': doce meses');
        assert.ok(months.every(month => validRange.test(month.description)), id + ': todos los rangos usan «a»');
        assert.ok(months.every(month => !legacyRange.test(month.description)), id + ': sin rangos con guiones');
        assert.ok(!legacyRange.test(trip.climate), id + ': clima sin rangos ambiguos');
        const rendered = seasonWindow.AtlasSeasonality({ esc: String }).seasonality(trip);
        const shown = [...rendered.matchAll(/class="season-temperature">([^<]+)</g)].map(match => match[1]);
        assert.equal(shown.length, 12, id + ': doce temperaturas visibles');
        assert.ok(shown.every(value => /^[−]?\d{1,2} a [−]?\d{1,2} °C$/.test(value)),
            id + ': mostrar «−3 a 5 °C», sin separador de guion');
    }
});

test('Suiza nevada: contratos editoriales de temporadas, días y fotografías', () => {
    const trip = JSON.parse(fs.readFileSync('data/trips/suiza-nevada-2027.json', 'utf8'));
    const months = Object.values(trip.seasonality.months);
    assert.equal(months.length, 12, 'Deben existir doce meses');
    assert.ok(months.every(month => /[−-]?\d+ a [−-]?\d+ °C/.test(month.description)),
        'Cada mes debe expresar el rango como −3 a 5 °C, sin guion ambiguo');
    const seasonWindow = { AtlasSeasonality: null };
    vm.runInNewContext(fs.readFileSync('components/seasonality.js', 'utf8'), { window: seasonWindow });
    const rendered = seasonWindow.AtlasSeasonality({ esc: String }).seasonality(trip);
    const shown = [...rendered.matchAll(/class="season-temperature">([^<]+)</g)].map(match => match[1]);
    assert.equal(shown.length, 12, 'Renderizar temperatura en las doce tarjetas');
    assert.ok(shown.every(value => /^[−-]?\d+ a [−-]?\d+ °C$/.test(value)),
        'Las doce tarjetas deben mostrar exactamente MIN a MAX °C');
    assert.equal(shown[0], '−3 a 5 °C', 'Enero muestra formato inequívoco');
    assert.equal(shown[11], '−2 a 5 °C', 'Diciembre muestra formato inequívoco');
    assert.deepEqual(['01', '02'].map(month => trip.seasonality.months[month].status),
        ['recommended', 'recommended'], 'Enero y febrero son preferidos para Suiza nevada');
    assert.deepEqual(['03', '04', '12'].map(month => trip.seasonality.months[month].status),
        ['conditional', 'conditional', 'conditional'], 'Marzo, abril y diciembre son condicionales');
    assert.ok(['05', '06', '07', '08', '09', '10', '11'].every(month =>
        trip.seasonality.months[month].status === 'avoid'),
        'Meses de Suiza verde no se recomiendan para la experiencia nevada');
    assert.ok(trip.days.every(day => day.headerPlaces?.length > 0),
        'Cada jornada debe tener lugares descriptivos en su cabecera');
    for (const day of trip.days) {
        for (const field of ['mobility', 'note']) {
            assert.ok(day[field].split('\n').every(line => /^• \*[^*]+:\*/.test(line)),
                'Día ' + day.n + ': ' + field + ' necesita títulos destacados de la guía');
        }
        for (const key of day.places || []) {
            const caption = trip.placeDescriptions?.[key];
            assert.ok(caption && caption.split(/\s+/).length >= 15 && caption.split(/\s+/).length <= 30,
                'Foto ' + key + ' debe llevar un pie turístico de 15–30 palabras');
        }
    }
    assert.equal(trip.expenses.reduce((sum, item) => sum + item.cost.amount, 0), 81981);
    const summit = trip.days.find(day => day.n === 6);
    assert.deepEqual(summit.places, ['swiss27-jungfraujoch-february', 'swiss27-maennlichen-winter'],
        'Día 6 debe mostrar los dos miradores reales de las alternativas invernales');
    assert.deepEqual(summit.optionalPlaces, summit.places,
        'Ambos miradores son alternativas, no actividades obligatorias simultáneas');
    assert.ok(trip.railSummary.some(item => item[0].includes('Half Fare Card')),
        'Comparativa incluye descuento turístico');
    assert.ok(trip.railSummary.some(item => item[0].includes('Swiss Travel Pass')),
        'Comparativa incluye Swiss Travel Pass como escenario distinto');
    assert.ok(trip.railSummary.some(item => item[1].includes('CHF 63')),
        'Suplemento Top Ticket 2026/27 debe estar separado del pase Jungfrau');
    assert.equal(trip.mapPoints.length, 11, 'La ruta incluye miradores y Lindt');
    assert.deepEqual(trip.mapPoints.map(item => item.order), [1,2,3,4,5,6,7,8,9,10,11]);
    const meals = trip.expenses.filter(item => item.category === 'food');
    assert.equal(meals.reduce((sum, item) => sum + item.cost.amount, 0), 9000,
        'Presupuesto de comidas conservado sin duplicación');
    assert.ok(meals.length >= 10, 'Las comidas se distribuyen por jornadas');
    assert.ok(meals.every(item => trip.days.some(day => day.date === item.date)));
});

test('Suiza nevada: diez noches, fotografías válidas y presupuesto individual sin duplicación', () => {
    const trip = JSON.parse(fs.readFileSync('data/trips/suiza-nevada-2027.json', 'utf8'));
    const places = JSON.parse(fs.readFileSync('data/places.json', 'utf8'));
    const catalog = loadCatalog();
    assert.ok(catalog.some(item => item.id === 'suiza-nevada-2027'));
    assert.equal(trip.travelerCount, 1);
    assert.equal(trip.days.length, 12);
    assert.equal(trip.bases.reduce((sum, item) => sum + item[1], 0), 10);
    assert.equal(trip.hotels.length, 4);
    const swissPhotos = Object.entries(places).filter(([id]) => id.startsWith('swiss27-'));
    assert.equal(swissPhotos.length, 12, 'Once fotos locales y Lindt desde Wikimedia');
    const expectedLocalFiles = {
        'swiss27-grindelwald-winter': 'grindelwald-invierno.jpg',
        'swiss27-wengen-winter': 'wengen-invierno.jpg',
        'swiss27-murren-winter': 'murren-invierno.jpg',
        'swiss27-lauterbrunnen-winter': 'lauterbrunnen-invierno.jpg',
        'swiss27-zermatt-winter': 'zermatt-invierno.jpg',
        'swiss27-gornergrat-winter': 'gornergrat-invierno.jpg',
        'swiss27-jungfraujoch-february': 'jungfraujoch-invierno.jpg',
        'swiss27-maennlichen-winter': 'mannlichen-invierno.jpg',
        'swiss27-lucerne-winter': 'lucerna-invierno.jpg',
        'swiss27-first-cliff-walk': 'first-cliff-walk-invierno.jpg',
        'swiss27-zurich-winter': 'zurich-invierno.jpg'
    };
    for (const [key, filename] of Object.entries(expectedLocalFiles)) {
        const photo = places[key].photo;
        assert.equal(photo.src, 'assets/images/trips/suiza-nevada-2027/' + filename);
        assert.ok(!photo.source && !photo.attribution && !photo.license,
            'Sin atribuir falsamente una foto aportada por el usuario a la anterior');
        const bytes = fs.readFileSync(photo.src);
        assert.ok(bytes.length > 1000 && bytes[0] === 0xff && bytes[1] === 0xd8,
            'Fotografía local válida JPEG: ' + filename);
    }
    assert.ok(places['swiss27-lindt'].photo.src.startsWith('https://commons.wikimedia.org/wiki/Special:FilePath/'),
        'Lindt conserva la foto externa original');
    assert.equal(trip.cover, 'swiss27-grindelwald-winter',
        'Portada y día por día usan la fotografía local de Grindelwald');
    assert.ok(trip.days.some(day => day.places.includes('swiss27-lucerne-winter')));
    assert.ok(trip.days.some(day => day.places.includes('swiss27-first-cliff-walk')));
    assert.ok(trip.days.some(day => day.places.includes('swiss27-zurich-winter')));
    assert.ok(!trip.days.some(day => day.places.includes('first-cliff-walk') ||
        day.places.includes('lucerne') || day.places.includes('zurich') ||
        day.places.includes('gornergrat')), 'No sustituir fotos comunes usadas por otros viajes');
    assert.equal(trip.majorTransport.length, 7);
    const zvv = trip.majorTransport.find(t => t.id === 'zurich-kilchberg-zvv');
    assert.ok(zvv, 'Debe existir el trayecto Zúrich-Kilchberg del 1 febrero');
    assert.equal(zvv.day, 11);
    assert.equal(zvv.budgetIncludedIn, 'rail-budget',
        'El costo ZVV ya está incluido en el presupuesto ferroviario');
    assert.deepEqual(zvv.options[0].fares.map(f => f.price.amount), [14.8, 7.4, 14.8, 7.4],
        'Cada tarifa de ZVV debe representar ida y vuelta, no un sencillo incompleto');
    assert.deepEqual(zvv.options[0].fares.map(f => f.id),
        ['24h-full','24h-half','two-singles-full','two-singles-half'],
        'Alternativas completas: pase 24 horas o dos sencillos por ambos sentidos');
    assert.ok(zvv.options[0].fares.every(f => /24 h|ida y vuelta/.test(f.name)),
        'Ningún sencillo puede seleccionarse como el costo de un viaje redondo');
    assert.ok(trip.days[10].transportRefs.includes(zvv.id));
    const airport = trip.majorTransport.find(t => t.id === 'airport-return');
    assert.equal(airport.budgetIncludedIn, 'rail-budget');
    assert.deepEqual(airport.options[0].fares.map(f => f.price.amount), [7.4, 3.7],
        'Aeropuerto Zürich zona 121, tres zonas y solo un sentido para 2027');
    assert.equal(airport.options[0].journeys.length, 1);
    assert.equal(trip.expenses.find(e => e.id === 'rail-budget').cost.amount, 10000,
        'Ambas tarifas ZVV se incluyen en el fondo ferroviario original');
    assert.ok(trip.railSummary.some(row => row[0].includes('aeropuerto') &&
        row[1].includes('CHF 7.40')), 'Movilidad debe explicar tarifa ZVV de regreso al aeropuerto');
    assert.ok(trip.railSummary.some(row => row[0].startsWith('Punto de equilibrio') &&
        row[1].includes('CHF 62.10') && row[1].includes('CHF 175.80')),
        'Ahorro de Half Fare considera Gornergrat y ambos trayectos ZVV sin duplicar descuentos');

    assert.ok(trip.railSummary.some(row => row[0].includes('Zúrich–Kilchberg') && row[1].includes('CHF 14.80')));

    const flight = trip.majorTransport.find(item => item.id === 'flight-international');
    assert.ok(flight, 'Suiza debe conservar la ficha aérea');
    for (const option of flight.options) {
        assert.equal(option.journeys.length, 2);
        assert.ok(option.journeys.every(journey => journey.segments.length === 2),
            'Los vuelos con escala deben representar dos segmentos y no una conexión como vuelo directo');
        assert.ok(option.journeys.every(journey =>
            journey.segments[0].to === journey.segments[1].from),
            'Los aeropuertos de conexión deben coincidir');
        assert.ok(option.journeys.every(journey => journey.segments[0].arrival === null &&
            journey.segments[1].departure === null),
            'Horarios de conexiones desconocidos deben mantenerse null');
    }
    assert.ok(trip.railSummary.some(row => row[0].includes('Saver Day Pass')),
        'La comparación debe incluir billete diario de ahorro');
    assert.ok(trip.railSummary.some(row => row[1].includes('CHF 326')),
        'La decisión de dos pases debe mostrar su impacto en fondo ferroviario');

    assert.equal(trip.experiences.length, 7);
    assert.ok(trip.hotels.every(h => h.mapsUrl && h.links?.[0]?.url), 'Cada alojamiento necesita Maps y enlace oficial');
    assert.equal(trip.hotels.find(h => h.id === 'zurich-fred').address, 'Konradstrasse 11, 8005 Zürich, Suiza');
    assert.ok(trip.days.filter(day => [2, 3, 7, 10, 12].includes(day.n)).every(day =>
        day.transportRefs?.length && day.mobilityLinks?.length), 'Traslados principales requieren refs y mapa');
    assert.ok(trip.cover && places[trip.cover]?.photo?.src);
    assert.ok(trip.days.every(day => (day.places || []).every(key => places[key]?.photo?.src)));
    assert.equal(trip.expenses.reduce((sum, item) => sum + item.cost.amount, 0), 81981);
    assert.equal(trip.start, '2027-01-22');
    assert.equal(trip.end, '2027-02-02');
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
    const complete = JSON.parse(fs.readFileSync('data/trips/italia-norte-2027.json', 'utf8'));
    const window = { ATLAS_MODULES: [{ id: complete.id, file: complete.id + '.json', available: true }] };
    const fetch = async url => ({ ok: true, json: async () =>
        url === 'data/places.json' ? {} : url === 'data/trips/_template.json' ? template : complete });
    vm.runInNewContext(fs.readFileSync('loader.js','utf8'), { window, fetch });
    const trip = (await window.ATLAS_READY).trips[0];
    for (const field of ['days','hotels','mapPoints','majorTransport','expenses','routeCities','experiences']) {
        assert.equal(JSON.stringify(trip[field]), JSON.stringify(complete[field]), 'No cambiar ' + field);
    }
    assert.equal(trip.id, complete.id);
    assert.equal(trip.name, complete.name);
});

test('portadas de viajes planificados requieren subtítulo editorial específico', () => {
    const catalog = loadCatalog();
    for (const module of catalog.filter(m => m.available && ['espana-portugal-2027', 'italia-norte-2027', 'japon-2027'].includes(m.id))) {
        const trip = JSON.parse(fs.readFileSync('data/trips/' + module.file, 'utf8'));
        const subtitle = trip.heroEyebrow || trip.tag;
        assert.equal(typeof subtitle, 'string', module.id + ': falta subtítulo editorial');
        assert.ok(subtitle.trim().length >= 20, module.id + ': subtítulo demasiado genérico');
        assert.doesNotMatch(subtitle, /^(en planeaci[oó]n|por definir|\d+ d[ií]as|dos pa[ií]ses)/i, module.id);
    }
});

test('pie Fuentes y reservas solo se agrega en viajes heredados', () => {
    const code = fs.readFileSync('components/trip.js', 'utf8');
    assert.match(code, /legacyAdviceTripIds\.has\(t\.id\) \? parts\.fuentes\(\) : ''/);
    assert.doesNotMatch(code, /\.join\(''\) \+ parts\.fuentes\(\)/);
});


test('transportes de viajes nuevos validan tarifas y no bloquean la vista si falta una', () => {
    const trip = JSON.parse(fs.readFileSync('data/trips/suiza-nevada-2027.json', 'utf8'));
    const window = {};
    vm.runInNewContext(fs.readFileSync('components/transport-model.js', 'utf8'), { window });
    const errors = Array.from(window.AtlasTransportModel.validateTrip(trip));
    assert.deepEqual(errors, [], 'Contrato de transporte inválido: ' + errors.join('; '));
    const invalid = JSON.parse(JSON.stringify(trip));
    delete invalid.majorTransport[1].options[0].fares;
    assert.match(Array.from(window.AtlasTransportModel.validateTrip(invalid)).join('; '), /Opción sin tarifas/);

    window.AtlasBudget = {
        selectedTransportPrice: () => null,
        convert: () => null
    };
    window.AtlasSelections = { get: () => ({}) };
    vm.runInNewContext(fs.readFileSync('components/major-transport.js', 'utf8'), { window });
    assert.doesNotThrow(() => window.AtlasMajorTransport.render(trip));
    assert.doesNotThrow(() => window.AtlasMajorTransport.render(invalid),
        'La vista no debe fallar cuando una tarifa aún no existe');
    assert.match(window.AtlasMajorTransport.render(invalid), /Tarifa por cotizar/);
});


test('Suiza verde: Panorama sin undefined, clima de montaña y luz comprobados', () => {
    const trip = JSON.parse(fs.readFileSync('data/trips/suiza-verde-2027.json', 'utf8'));
    const indicators = trip.practicalIndicators;
    assert.deepEqual(indicators.map(x => x.id), ['style', 'language', 'entry']);
    assert.deepEqual(indicators.map(x => x.title),
        ['Estilo de viaje', 'Idioma y moneda', 'Documentación y consejos prácticos']);
    for (const indicator of indicators) {
        assert.equal(typeof indicator.text, 'string');
        assert.ok(indicator.text.trim().length >= 50, indicator.id + ': texto vacío o insuficiente');
        assert.ok(['green', 'orange'].includes(indicator.tone));
        assert.equal(typeof indicator.badge, 'string');
        assert.ok(indicator.badge.trim());
        assert.doesNotMatch(JSON.stringify(indicator), /undefined|null/);
        assert.equal(Object.hasOwn(indicator, 'description'), false, 'No usar description en lugar de text');
        assert.equal(Object.hasOwn(indicator, 'type'), false, 'No usar type en lugar de id');
    }
    assert.match(indicators[1].badge, /· CHF$/);
    assert.match(indicators[2].text, /adaptador|toma J/i);
    assert.equal(trip.work, 10);
    assert.equal(trip.heroLodgingSummary, '14 noches, 5 alojamientos');
    const paragraphs = trip.climate.trim().split(/\n\s*\n/);
    assert.equal(paragraphs.length, 3);
    assert.match(paragraphs[0], /mínimas nocturnas/i);
    assert.match(paragraphs[0], /máximas diurnas/i);
    assert.match(paragraphs[0], /Grindelwald.*Zermatt/i);
    assert.match(paragraphs[0], /Titlis.*Jungfraujoch.*Gornergrat/i);
    assert.match(paragraphs[1], /^\*Qué llevar:\*/);
    assert.match(paragraphs[2], /^\*Horas de luz:\*/);
    assert.match(paragraphs[2], /05:2[89]|05:30/);
    assert.match(paragraphs[2], /21:2[2-6]/);
    assert.match(paragraphs[2], /CEST.*UTC\+2/);
    assert.doesNotMatch(trip.climate, /\d+\s*[–—-]\s*\d+\s*°C/);
});


test('Suiza Verde: 16 jornadas y fichas de movilidad visibles sin horarios inventados', () => {
    const trip = JSON.parse(fs.readFileSync('data/trips/suiza-verde-2027.json', 'utf8'));
    const hotelIds = new Map(trip.hotels.map(h => [h.id, h]));
    const transportIds = new Set(trip.majorTransport.map(t => t.id));
    assert.equal(trip.days.length, 16);
    assert.equal(trip.days.filter(d => d.hotel).length, 14);
    trip.days.forEach((day, i) => {
        assert.equal(day.n, i + 1);
        const expected = new Date(Date.UTC(2027, 5, 12 + i)).toISOString().slice(0, 10);
        assert.equal(day.date, expected, 'Fecha del día ' + day.n);
        for (const field of ['am', 'pm', 'night', 'mobility', 'note']) {
            assert.ok(day[field] && day[field].length > 25, 'Día ' + day.n + ': ' + field);
        }
        assert.match(day.mobility, /• \*[^*]+:\*/, 'Formato editorial movilidad del día ' + day.n);
        assert.match(day.note, /• \*[^*]+:\*/, 'Formato editorial tips del día ' + day.n);
        if (day.hotel) {
            const hotel = hotelIds.get(day.hotel);
            assert.ok(hotel, 'Hotel inexistente ' + day.hotel);
            assert.ok(hotel.checkIn <= day.date && hotel.checkOut > day.date,
                'Día ' + day.n + ': hotel fuera del rango de noches');
        }
        for (const ref of day.transportRefs || [])
            assert.ok(transportIds.has(ref), 'Día ' + day.n + ': transporte desconocido ' + ref);
    });
    const route = trip.majorTransport.find(x => x.id === 'jungfraujoch');
    assert.equal(route.options.length, 2, 'Jungfraujoch: regreso directo y regreso por Wengen');
    const viaWengen = route.options.find(x => x.id === 'B');
    assert.ok(viaWengen.journeys.find(x => x.direction === 'return').segments.some(s => s.to === 'Wengen'));
    const window = {
        AtlasSelections: { get: () => ({}) },
        AtlasBudget: { selectedTransportPrice: () => null, convert: () => null }
    };
    vm.runInNewContext(fs.readFileSync('components/day-transport.js', 'utf8'), { window });
    const day4 = window.AtlasDayTransport.render(trip, trip.days[3]);
    assert.match(day4, /Zürich HB/);
    assert.match(day4, /Maienfeld/);
    assert.match(day4, /Luzern/);
    assert.doesNotMatch(day4, /Horario pendiente de confirmar<\/div>/,
        'Las rutas sin horas deben mostrar nombres reales de estaciones');
    const day10 = window.AtlasDayTransport.render(trip, trip.days[9]);
    assert.match(day10, /Eigergletscher/);
    assert.doesNotMatch(day10, /Zweilütschinen/, 'Ruta A no pasa por Wengen');
    window.AtlasSelections.get = () => ({ jungfraujoch: { option: 'B' } });
    assert.match(window.AtlasDayTransport.render(trip, trip.days[9]), /Zweilütschinen/);
    const day2 = window.AtlasDayTransport.render(trip, trip.days[1]);
    assert.match(day2, /17:25/, 'La llegada aérea +1 día debe aparecer en la jornada correcta');
    assert.doesNotMatch(day2, /GVA/, 'No mezclar vuelo de regreso con llegada');
});


test('Suiza Verde: Panorama definitivo congruente, sin totales ficticios', () => {
    const trip = JSON.parse(fs.readFileSync('data/trips/suiza-verde-2027.json', 'utf8'));
    const count = str => str.trim().split(/\s+/).length;
    assert.ok(count(trip.intro) >= 70 && count(trip.intro) <= 130);
    assert.ok(count(trip.introShort) >= 30 && count(trip.introShort) <= 45);
    assert.ok(trip.introHighlights.every(highlight => trip.intro.includes(highlight)),
        'Los términos resaltados deben existir literalmente en la narrativa');
    assert.doesNotMatch(trip.intro, /\b(no comprad[oa]|por cotizar|reservar|MXN|Economy Light|presupuesto)\b/i);
    assert.equal(trip.bases.length, 5);
    assert.equal(trip.bases.reduce((n, stay) => n + stay[1], 0), 14);
    assert.match(trip.profile.paceWhy, /Cinco alojamientos/);
    assert.match(trip.budgetNote, /Subtotal verificable|subtotal/i);
    assert.match(trip.budgetNote, /no se puede presentar este subtotal como inversión total/i);
    assert.equal(trip.budgetRange, null);
    assert.equal(trip.budgetPreliminary.useBudgetRange, true);
    assert.equal(trip.expenses.length, 35);
    assert.deepEqual(trip.practicalIndicators.map(x => x.id), ['style', 'language', 'entry']);
    assert.match(trip.practicalIndicators[2].text, /EES/);
    assert.match(trip.practicalIndicators[2].text, /ETIAS/);
    assert.match(trip.practicalIndicators[2].text, /Frankfurt/);
    assert.equal(trip.practicalIndicators[2].tone, 'orange');
    assert.equal(trip.climate.trim().split(/\n\s*\n/).length, 3);
    const renderer = fs.readFileSync('components/trip.js', 'utf8');
    assert.match(renderer, /flightOnlySubtotal/);
    assert.match(renderer, /Vuelo cotizado · subtotal parcial/);
    assert.match(renderer, /solo vuelo, sin alojamientos, trenes, entradas ni comidas/);
});


test('Suiza Verde: presupuesto integral concilia sin duplicar vuelos ni pases', () => {
    const trip = JSON.parse(fs.readFileSync('data/trips/suiza-verde-2027.json', 'utf8'));
    const window = { AtlasSelections: { get: () => ({}) } };
    vm.runInNewContext(fs.readFileSync('components/budget.js', 'utf8'), { window });
    const summary = window.AtlasBudget.summary(trip);
    const flight = trip.majorTransport.filter(t => t.type === 'flight');
    assert.equal(flight.length, 1);
    const fare = flight[0].options[0].fares[0];
    assert.equal(fare.price.amount, 23300.14);
    assert.ok(trip.majorTransport.filter(t => t.type !== 'flight').every(t =>
        trip.expenses.some(e => e.id === t.budgetIncludedIn)));
    assert.equal(trip.expenses.filter(e => e.category === 'lodging').reduce((s,e) => s + e.nights, 0), 14);
    assert.equal(trip.expenses.filter(e => e.category === 'food').length, 16);
    assert.equal(trip.expenses.filter(e => e.category === 'food').reduce((s,e) => s + e.cost.amount, 0), 855);
    assert.equal(new Set(trip.expenses.map(e => e.id)).size, trip.expenses.length);
    assert.ok(trip.expenses.every(e => e.status === 'estimated' && e.cost.currency === 'CHF'));
    assert.equal(trip.exchangeRateSnapshot.date, '2026-11-16');
    assert.equal(trip.exchangeRates.CHF, 22.12);
    assert.equal(summary.knownTotalMXN, 138213.54);
    assert.equal(summary.entries.filter(e => e.id === 'international-flight').length, 1);
    assert.equal(summary.entries.filter(e => e.id === 'rail-provision').length, 1);
    assert.equal(summary.entries.filter(e => e.id.startsWith('activity-')).length, 9);
    assert.equal(trip.expenses.filter(e => e.id.startsWith('activity-')).reduce((sum,e) => sum + e.cost.amount, 0), 410);
    assert.deepEqual(trip.expenses.find(e => e.id === 'rail-provision').dates, []);
    assert.deepEqual(trip.budgetRange, [118000, 157000]);
    assert.equal(trip.budgetPreliminary.useBudgetRange, true);
    assert.equal(trip.budgetPreliminary.referenceFlightMXN, 23300.14);
    assert.ok(summary.knownTotalMXN > trip.budgetRange[0] &&
        summary.knownTotalMXN < trip.budgetRange[1]);
    for (const [date, details] of Object.entries(summary.byDay)) {
        assert.equal(new Set(details.entries.map(e=>e.id)).size, details.entries.length, date + ': duplicados');
    }
    assert.ok(!trip.expenses.some(e => e.concept.includes('Glacier Express') || e.concept.includes('Bernina Express')));
});


test('Suiza Verde: fotografías estivales, portada, galerías y créditos completos', () => {
    const trip = JSON.parse(fs.readFileSync('data/trips/suiza-verde-2027.json', 'utf8'));
    const places = JSON.parse(fs.readFileSync('data/places.json', 'utf8'));
    assert.equal(trip.cover, 'swissgreen-oeschinensee-cover');
    assert.equal(trip.coverSlides.length, 6);
    assert.equal(trip.days.length, 16);
    assert.equal(trip.days.filter(d => d.places.length).length, 13);
    assert.deepEqual(trip.days[0].places, []);
    assert.deepEqual(trip.days[15].places, []);
    const ids = new Set([trip.cover, ...(trip.coverSlides || []), ...trip.days.flatMap(d => d.places || [])]);
    const winter = /(winter|invierno|nevado)/i;
    for (const id of ids) {
        assert.ok(places[id]?.photo?.src, 'Fotografía sin fuente: ' + id);
        assert.ok(!winter.test(id) && !winter.test(places[id].name),
            'Foto de invierno no permitida en Suiza Verde: ' + id);
        const photo = places[id].photo;
        assert.ok(photo.source && photo.license && photo.attribution,
            'Créditos incompletos de ' + id);
        const desc = trip.placeDescriptions?.[id];
        assert.equal(typeof desc, 'string', 'Pie de foto faltante: ' + id);
        const words = desc.trim().split(/\s+/).length;
        assert.ok(words >= 15 && words <= 30,
            'Pie de foto fuera de 15–30 palabras: ' + id + ', ' + words);
    }
    assert.equal(new Set(trip.coverSlides).size, trip.coverSlides.length);
    assert.ok(trip.days[9].optionalPlaces.includes('wengen'),
        'Wengen debe seguir marcado como opción meteorológica y ferroviaria');
    assert.ok(trip.days[7].places.includes('swissgreen-bachalpsee'));
    assert.ok(trip.days[8].places.includes('swissgreen-brienz'));
    assert.ok(trip.days[12].places.includes('swissgreen-riffelsee'));
});
