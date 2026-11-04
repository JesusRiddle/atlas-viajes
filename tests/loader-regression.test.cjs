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
        assert.ok(trip.cover || trip.status === 'draft', module.id + ' sin portada');
        assert.ok(trip.stays == null || Array.isArray(trip.stays), module.id + ' con stays inválido');
    }
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
    assert.equal(catalog.length, 20);
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

test('Suiza nevada se publica primero y España + Portugal conserva su contenido completo', async () => {
    const catalog = loadCatalog();
    assert.equal(catalog[0].id, 'suiza-nevada-2027');
    assert.equal(catalog[0].available, true);
    assert.deepEqual(Array.from(catalog.slice(0, 5), item => item.id), [
        'suiza-nevada-2027',
        'italia-norte-2027',
        'espana-portugal-2027',
        'japon-2027',
        'patagonia-argentina-2027'
    ], 'El orden de portada sigue las fechas de viaje 2027');
    const migrated = JSON.parse(fs.readFileSync('data/trips/espana-portugal-2027.json', 'utf8'));
    assert.equal(migrated.id, 'espana-portugal-2027');
    assert.equal(migrated.days.length, 20);
    assert.equal(migrated.hotels.length, 5);
    // Incluye lugares opcionales añadidos durante la auditoría editorial.
    assert.equal(migrated.days.reduce((n, day) => n + day.places.length, 0), 51);
    assert.ok(migrated.cover);
    assert.equal(migrated.budgetRange[0], 76000);
    assert.equal(migrated.budgetRange[1], 125000);
    const template = JSON.parse(fs.readFileSync('data/trips/_template.json', 'utf8'));
    const window = { ATLAS_MODULES: [catalog[2]] };
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

test('Panorama editorial de los cinco viajes desarrollados: exactamente tres indicadores y clima independiente', () => {
    const ids = ['suiza-nevada-2027', 'espana-portugal-2027', 'italia-norte-2027',
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

test('Suiza nevada: contratos editoriales de temporadas, días y fotografías', () => {
    const trip = JSON.parse(fs.readFileSync('data/trips/suiza-nevada-2027.json', 'utf8'));
    const months = Object.values(trip.seasonality.months);
    assert.equal(months.length, 12, 'Deben existir doce meses');
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
    assert.equal(catalog[0].id, 'suiza-nevada-2027');
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
