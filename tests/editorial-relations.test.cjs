'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { validate } = require('../scripts/editorial-relations.cjs');

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

test('integridad dinámica de los nueve viajes principales, sin snapshots de fechas ni importes', () => {
  const window = {};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../modules.js'), 'utf8'), { window });
  const main = window.ATLAS_MODULES.filter(item => item.available && item.homeGroup !== 'ideas');
  assert.ok(main.length);
  for (const { file, id } of main) {
    const trip = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/trips', file), 'utf8'));
    assert.deepEqual(complaints(trip), [], id + ': relaciones editoriales inconsistentes');
  }
});
