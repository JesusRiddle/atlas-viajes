'use strict';
// Pruebas metamórficas: valores turísticos arbitrarios, contratos editoriales estables.
// Nunca modificar archivos data/trips: todas las mutaciones suceden en memoria.
const test = require('node:test');
const assert = require('node:assert/strict');
const { validate, photos } = require('../scripts/editorial-relations.cjs');

const catalog = {
  museo: { photo: { src: 'photos/museo.jpg' } },
  plaza: { photo: { src: 'photos/plaza.jpg' } },
  parque: { photo: { src: 'photos/parque.jpg' } }
};
function original() {
  return {
    id: 'fixture-cambiante',
    start: '2027-06-01', end: '2027-06-04',
    travelerCount: 1,
    hotels: [
      { id: 'alojamiento-a', name: 'Alojamiento inicial', checkIn: '2027-06-01',
        checkOut: '2027-06-04', mapsUrl: 'https://maps.example.org/a',
        links: [{ label: 'Reserva', url: 'https://booking.example.org/a' }] }
    ],
    majorTransport: [{ id: 'tren-a', options: [{ fares: [{ price: null }] }] }],
    expenses: [{ id: 'gasto-a', hotelId: 'alojamiento-a', status: 'estimated',
      date: '2027-06-01', cost: { amount: 200, currency: 'MXN' } }],
    reservations: [['Importantes', [{ title: 'Visita guiada', status: 'pending' }]]],
    cover: 'museo', coverSlides: ['museo'],
    placeDescriptions: { museo: 'Museo de la ciudad', plaza: 'Plaza central',
      parque: 'Parque urbano' },
    days: [
      { n: 1, date: '2027-06-01', hotel: 'alojamiento-a', transportRefs: ['tren-a'],
        places: ['museo'] },
      { n: 2, date: '2027-06-02', hotel: 'alojamiento-a', places: ['plaza'] },
      { n: 3, date: '2027-06-03', hotel: 'alojamiento-a', places: ['parque'] },
      { n: 4, date: '2027-06-04' }
    ]
  };
}
function check(trip) {
  return [...validate(trip, { mode: 'complete' }), ...photos(trip, catalog, { complete: true })];
}
function passes(trip, description) {
  assert.deepEqual(check(trip), [], description);
}
function fails(trip, field, description) {
  const errors = check(trip);
  assert.ok(errors.some(e => e.path.includes(field)),
    description + ': esperaba error en ' + field + ', obtuvo ' + JSON.stringify(errors));
}

test('control: fixture editorial válido sin dependencia del destino real', () => {
  passes(original(), 'El fixture de partida debe ser válido');
});

test('mutaciones legítimas combinadas: cambios de fechas, estancia, vuelo, actividad y gasto', () => {
  const t = original();
  // Desplazamiento coherente de TODO el calendario y alojamiento.
  t.start = '2027-07-10'; t.end = '2027-07-13';
  t.hotels[0].checkIn = '2027-07-10'; t.hotels[0].checkOut = '2027-07-13';
  t.days.forEach((day, i) => {
    day.date = '2027-07-' + String(10 + i).padStart(2, '0');
  });
  t.expenses[0].date = t.start;
  // Cambiar el proveedor y renombrar el alojamiento no debe romper el contrato.
  t.hotels[0].name = 'Alojamiento sustituto';
  t.hotels[0].links[0].url = 'https://booking.example.org/alternativa';
  t.majorTransport[0].id = 'vuelo-nuevo';
  t.days[0].transportRefs = ['vuelo-nuevo'];
  t.days[0].places.push('parque');
  t.days[1].places = []; // Eliminar una visita es legítimo.
  t.expenses[0].cost.amount = 841.25;
  t.reservations[0][1][0].status = 'quoted';
  passes(t, 'Mutación compleja pero coherente');
  // Añadir una noche válida implica modificar calendario y asignación.
  t.end = '2027-07-14'; t.hotels[0].checkOut = '2027-07-14';
  t.days[3].hotel = 'alojamiento-a';
  t.days.push({ n: 5, date: '2027-07-14' });
  passes(t, 'Extensión coherente del viaje');
  // Cambiar cantidad de viajeros tampoco obliga a modificar fixtures.
  t.travelerCount = 3;
  passes(t, 'Viaje válido para tres personas');
});

const mutations = [
    ['days[1].date', t => { t.days[1].date = '2027-06-09'; }],
    ['days[1].n', t => { t.days[1].n = 99; }],
    ['days[0].hotel', t => { t.days[0].hotel = 'hotel-borrado'; }],
    ['days[1].hotel', t => { delete t.days[1].hotel; }],
    ['days[0].transportRefs', t => { t.days[0].transportRefs = ['vuelo-borrado']; }],
    ['days[1].hotel', t => { t.hotels[0].checkOut = '2027-06-02'; }],
    ['hotels[0].mapsUrl', t => { t.hotels[0].mapsUrl = 'javascript:alert(1)'; }],
    ['hotels[1].id', t => { t.hotels.push({ ...t.hotels[0] }); }],
    ['expenses[0].hotelId', t => { t.expenses[0].hotelId = 'hotel-ajeno'; }],
    ['expenses[0].cost.amount', t => { t.expenses[0].cost.amount = -1; }],
    ['expenses[0].cost.currency', t => { t.expenses[0].cost.currency = 'ZZZ'; }],
    ['expenses[0].status', t => { t.expenses[0].status = 'inventado'; }],
    ['reservations[1]', t => { t.reservations.push([...t.reservations[0]]); }],
    ['days[0].places[1]', t => { t.days[0].places.push('foto-faltante'); }],
    ['days[1].places[0]', t => { delete t.placeDescriptions.plaza; }]
  ];
for (const [field, mutate] of mutations) {
  test('rechaza mutación adversarial: ' + field, () => {
    const t = original();
    mutate(t);
    fails(t, field, 'Mutación adversarial ' + field);
  });
}

test('mutaciones financieras: precio pendiente distinto de cero y divisas con fuente', () => {
  const t = original();
  t.expenses[0].cost.amount = null;
  passes(t, 'Un precio pendiente no se inventa');
  t.expenses[0].cost.amount = 0;
  passes(t, 'Cero definido es válido');
  t.expenses[0].cost = { amount: 42, currency: 'EUR' };
  fails(t, 'exchangeRates.EUR', 'Falta tasa para gasto extranjero');
  t.exchangeRates = { EUR: 20.1 };
  fails(t, 'exchangeRateSnapshot.EUR', 'Falta fuente y fecha');
  t.exchangeRateSnapshot = { date: '2027-05-20',
    sources: { EUR: 'https://example.org/tipo-cambio' } };
  passes(t, 'Gasto extranjero documentado correctamente');
  t.expenses[0].cost.amount = null;
  delete t.exchangeRates;
  delete t.exchangeRateSnapshot;
  passes(t, 'Importe extranjero pendiente sin tasa simulada');
});

test('mutaciones parciales: se permite editar borradores, no cerrar sin jornadas', () => {
  const draft = { id: 'nueva-idea', days: [], hotels: [], majorTransport: [] };
  assert.deepEqual(validate(draft, { mode: 'incremental' }), []);
  const closed = { ...draft, start: '2027-06-01', end: '2027-06-04', travelerCount: 2 };
  fails(closed, 'days', 'El cierre necesita jornadas');
});


test('mutaciones sobre los nueve viajes vivos en memoria, sin sobrescribir JSON', () => {
  const fs = require('node:fs');
  const vm = require('node:vm');
  const window = {};
  vm.runInNewContext(fs.readFileSync('modules.js', 'utf8'), { window });
  const modules = window.ATLAS_MODULES.filter(m => m.available && m.homeGroup !== 'ideas');
  const realCatalog = JSON.parse(fs.readFileSync('data/places.json', 'utf8'));
  assert.ok(modules.length > 0);
  for (const module of modules) {
    const trip = JSON.parse(fs.readFileSync('data/trips/' + module.file, 'utf8'));
    const changed = structuredClone(trip);
    // Transformaciones inocuas independientes de números, fechas y proveedores.
    for (const hotel of changed.hotels || []) if (typeof hotel.name === 'string')
      hotel.name += ' (alternativa editorial)';
    for (const day of changed.days || []) if (Array.isArray(day.optionalPlaces))
      day.optionalPlaces = day.optionalPlaces.slice(0, Math.max(0, day.optionalPlaces.length - 1));
    const known = (changed.expenses || []).find(x => Number.isFinite(x.cost?.amount) && x.cost.amount > 0);
    if (known) known.cost.amount += 1;
    assert.deepEqual(validate(changed, { mode: 'complete' }), [],
      module.file + ': cambio legítimo rechazado');
    assert.deepEqual(photos(changed, realCatalog, { complete: true }), [],
      module.file + ': foto incoherente tras cambio legítimo');
    if (changed.days?.length) {
      const broken = structuredClone(changed);
      broken.days[0].transportRefs = [...(broken.days[0].transportRefs || []), '__ausente__'];
      failsRealTransport(broken, module.file);
    }
  }
});
function failsRealTransport(trip, file) {
  assert.ok(validate(trip, { mode: 'complete' }).some(e =>
    e.path.includes('days[0].transportRefs')), file + ': referencia inválida no detectada');
}
