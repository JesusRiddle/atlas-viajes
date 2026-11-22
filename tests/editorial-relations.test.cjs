'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { validate, photos } = require('../scripts/editorial-relations.cjs');

const makeTrip = () => ({
  id: 'ejemplo',
  start: '2027-05-01', end: '2027-05-03',
  hotels: [{ id: 'hotel-a', checkIn: '2027-05-01', checkOut: '2027-05-03',
    mapsUrl: 'https://maps.google.com/a', links: [{ label: 'Reserva', url: 'https://example.com/a' }] }],
  days: [
    { n: 1, date: '2027-05-01', hotel: 'hotel-a', transportRefs: ['train-a'] },
    { n: 2, date: '2027-05-02', hotel: 'hotel-a' },
    { n: 3, date: '2027-05-03', places: ['opcional'] }
  ],
  majorTransport: [{ id: 'train-a' }],
  expenses: [{ id: 'hotel-cost', category: 'lodging', hotelId: 'hotel-a',
    cost: { amount: 150, currency: 'EUR' }, date: '2027-05-01' }],
  reservations: [['Prioridad alta', [{ title: 'Museo', links: [
    { label: 'Oficial', url: 'https://example.com/museo' }] }]]]
});
const complaints = t => validate(t, { complete: true });
const hasError = (errors, part) => errors.some(x => x.path.includes(part));

test('viaje cambiante válido: añadir visitas, renombrar hotel, cambiar tarifa o prolongar estancia', () => {
  const t = makeTrip();
  assert.deepEqual(complaints(t), []);
  t.days[1].places = ['museo', 'plaza', 'mercado'];
  t.hotels[0].name = 'Otro alojamiento';
  t.expenses[0].cost.amount = 999.75;
  assert.deepEqual(complaints(t), []);
  t.end = '2027-05-04';
  t.hotels[0].checkOut = '2027-05-04';
  t.days.push({ n: 4, date: '2027-05-04' });
  assert.deepEqual(complaints(t), []);
});

test('fechas: rechaza calendario imposible, días omitidos, fin incongruente y noches fuera del hotel', () => {
  const t = makeTrip();
  t.days[1].date = '2027-05-04';
  assert.ok(hasError(complaints(t), 'days[1].date'));
  t.days[1].date = '2027-05-02';
  t.days[1].hotel = 'hotel-inexistente';
  assert.ok(hasError(complaints(t), 'days[1].hotel'));
  t.days[1].hotel = 'hotel-a';
  t.hotels[0].checkOut = '2027-05-02';
  assert.ok(hasError(complaints(t), 'days[1].hotel'));
  t.hotels[0].checkOut = '2027-05-03';
  t.start = '2027-05-02';
  assert.ok(hasError(complaints(t), 'days[0].date'));
  t.start = '2027-05-01';
  t.hotels[0].checkIn = '2027-02-29';
  assert.ok(hasError(complaints(t), 'hotels[0]'));
});

test('referencias: detecta hoteles, transportes y partidas huérfanas o repetidas', () => {
  const t = makeTrip();
  t.days[0].transportRefs.push('vuelo-borrado');
  assert.ok(hasError(complaints(t), 'transportRefs'));
  t.days[0].transportRefs.pop();
  t.expenses[0].hotelId = 'desconocido';
  assert.ok(hasError(complaints(t), 'hotelId'));
  t.expenses[0].hotelId = 'hotel-a';
  t.expenses.push({ ...t.expenses[0] });
  assert.ok(hasError(complaints(t), 'expenses[1].id'));
  t.expenses.pop();
  t.hotels.push({ ...t.hotels[0] });
  assert.ok(hasError(complaints(t), 'hotels[1].id'));
});

test('monedas, cantidades, enlaces y reservas inválidas provocan error; pendientes siguen permitidos', () => {
  const t = makeTrip();
  t.expenses[0].cost.amount = -1;
  assert.ok(hasError(complaints(t), 'cost.amount'));
  t.expenses[0].cost.amount = null;
  assert.deepEqual(complaints(t), [], 'Un importe pendiente no equivale a cero');
  t.expenses[0].cost.amount = 50;
  t.expenses[0].cost.currency = 'ZZZ';
  assert.ok(hasError(complaints(t), 'cost.currency'));
  t.expenses[0].cost.currency = 'EUR';
  t.hotels[0].mapsUrl = 'sin-url';
  assert.ok(hasError(complaints(t), 'mapsUrl'));
  t.hotels[0].mapsUrl = 'https://maps.google.com/a';
  t.reservations[0][1][0].links[0].url = 'javascript:alert(1)';
  assert.ok(hasError(complaints(t), 'reservations[0]'));
});

test('borradores mínimos admiten omisiones, pero no colecciones de tipo incorrecto', () => {
  assert.deepEqual(validate({ id: 'idea' }), []);
  assert.ok(hasError(validate({ days: {} }), 'days'));
  assert.ok(hasError(validate({ reservations: 'pendientes' }), 'reservations'));
});

test('fotografías: permite agregar o quitar actividades, rechaza referencias inexistentes', () => {
  const t = makeTrip();
  const catalog = { foto1: { photo: { src: 'photos/foto1.jpg' } },
    foto2: { photo: { src: 'photos/foto2.jpg' } },
    opcional: { photo: { src: 'photos/opcional.jpg' } } };
  t.cover = 'foto1';
  t.coverSlides = ['foto1', 'foto2'];
  t.placeDescriptions = { foto1: 'Detalle turístico', foto2: 'Otra descripción turística', opcional: 'Actividad opcional con descripción turística' };
  t.days[0].places = ['foto1', 'foto2'];
  assert.deepEqual(photos(t, catalog), []);
  t.days[0].places = ['foto2']; // quitar una actividad es válido
  assert.deepEqual(photos(t, catalog), []);
  t.days[0].places.push('desconocida');
  assert.ok(hasError(photos(t, catalog), 'days[0].places[1]'));
  t.days[0].places.pop();
  t.cover = 'inexistente';
  assert.ok(hasError(photos(t, catalog), 'cover'));
  t.cover = 'foto1';
  t.coverSlides = ['foto1', 'imagen-no-registrada'];
  assert.ok(hasError(photos(t, catalog), 'coverSlides[1]'));
  t.coverSlides = ['foto1'];
  delete t.placeDescriptions.foto2;
  assert.ok(hasError(photos(t, catalog), 'days[0].places[0]'));
});

test('mutaciones de calendario detectan saltos, ausencia de jornadas y huecos de hotel', () => {
  const day = makeTrip();
  day.days[1].n = 8;
  assert.ok(hasError(complaints(day), 'days[1].n'));
  day.days[1].n = 2;
  day.days[1].hotel = null;
  assert.ok(hasError(complaints(day), 'days[1].hotel'));
  day.days[1].hotel = 'hotel-a';
  day.days = [];
  assert.ok(hasError(complaints(day), 'days'));
  assert.deepEqual(validate({ id: 'idea', days: [] }), [],
    'Un viaje incremental puede tener jornadas por definir');
});

test('mapa: latitud, longitud, orden y duplicaciones se validan sin exigir ruta fija', () => {
  const t = makeTrip();
  t.mapPoints = [
    { name: 'Inicio', coords: [19.43, -99.13], order: 2 },
    { name: 'Destino', coords: [45.46, 9.19], order: 1 }
  ];
  assert.deepEqual(complaints(t), [], 'El array no tiene que estar ordenado físicamente');
  t.mapPoints[0].coords[0] = 999;
  assert.ok(hasError(complaints(t), 'mapPoints[0].coords'));
  t.mapPoints[0].coords[0] = 19.43;
  t.mapPoints[1].order = 2;
  assert.ok(hasError(complaints(t), 'mapPoints[1].order'));
  t.mapPoints[1].order = 3;
  assert.ok(hasError(complaints(t), 'mapPoints'));
  t.mapPoints[1].order = 1;
  t.mapPoints.push({ name: 'Otra parada', coords: [35.6, 139.7], order: 3 });
  assert.deepEqual(complaints(t), [], 'Agregar una parada coherente debe ser válido');
});

test('personas, reservas y gastos: validación estricta sin confundir pendientes', () => {
  const t = makeTrip();
  t.travelerCount = -2;
  assert.ok(hasError(complaints(t), 'travelerCount'));
  t.travelerCount = 2;
  t.reservations[0][0] = '';
  assert.ok(hasError(complaints(t), 'reservations[0]'));
  t.reservations[0][0] = 'Prioridad alta';
  t.reservations[0][1][0].status = 'confirmed';
  assert.deepEqual(complaints(t), []);
  t.reservations[0][1][0].status = 'free';
  assert.ok(hasError(complaints(t), '.status'));
  t.reservations[0][1][0].status = 'pending';
  t.expenses[0].status = 'maybe';
  assert.ok(hasError(complaints(t), 'expenses[0].status'));
  t.expenses[0].status = 'estimated';
  assert.deepEqual(complaints(t), []);
});

test('divisas: gasto extranjero requiere tasa positiva y respaldo fechado, sin fijar un tipo de cambio', () => {
  const t = makeTrip();
  t.exchangeRates = { EUR: 20.5 };
  t.exchangeRateSnapshot = {
    date: '2027-04-20', sources: { EUR: 'https://example.com/fx' }
  };
  assert.deepEqual(complaints(t), []);
  t.exchangeRates.EUR = 0;
  assert.ok(hasError(complaints(t), 'exchangeRates.EUR'));
  t.exchangeRates.EUR = 20.5;
  t.exchangeRateSnapshot.sources.EUR = '';
  assert.ok(hasError(complaints(t), 'exchangeRateSnapshot.EUR'));
  t.exchangeRateSnapshot.sources.EUR = 'https://example.com/fx';
  t.exchangeRateSnapshot.date = '2027-02-29';
  assert.ok(hasError(complaints(t), 'exchangeRateSnapshot.EUR'));
  t.exchangeRateSnapshot.date = '2027-04-20';
  t.expenses[0].cost.amount = null;
  delete t.exchangeRates.EUR;
  assert.deepEqual(complaints(t), [], 'Sin precio conocido no se inventa conversión');
  t.expenses[0].cost.amount = 0;
  assert.ok(hasError(complaints(t), 'exchangeRates.EUR'),
    'Cero conocido también es un importe definido');
});

test('los viajes no se rechazan por compartir fechas con otros viajes', () => {
  const a = makeTrip();
  const b = structuredClone(a);
  b.id = 'otro-viaje';
  assert.deepEqual(complaints(a), []);
  assert.deepEqual(complaints(b), []);
});

test('integridad dinámica de los nueve viajes principales, sin snapshots de fechas ni importes', () => {
  const window = {};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../modules.js'), 'utf8'), { window });
  const main = window.ATLAS_MODULES.filter(item => item.available && item.homeGroup !== 'ideas');
  assert.ok(main.length);
  const photoCatalog = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/places.json'), 'utf8'));
  for (const { file, id } of main) {
    const trip = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/trips', file), 'utf8'));
    assert.deepEqual(complaints(trip), [], id + ': relaciones editoriales inconsistentes');
    assert.deepEqual(photos(trip, photoCatalog), [], id + ': fotografías referenciadas inválidas');
  }
});
