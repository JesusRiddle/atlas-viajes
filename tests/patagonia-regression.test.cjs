// Regression del calendario y presupuesto de Patagonia Argentina 2027.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const trip = JSON.parse(fs.readFileSync('data/trips/patagonia-argentina-2027.json', 'utf8'));
const utc = s => Date.parse(s + 'T00:00:00Z');
const daysBetween = (a, b) => (utc(b) - utc(a)) / 86400000;

test('Patagonia: todas las imágenes y hoteles referenciados existen', () => {
  const photos = JSON.parse(fs.readFileSync('data/places.json', 'utf8'));
  assert.ok(photos[trip.cover]?.photo?.src, 'Portada sin referencia fotográfica');
  for (const day of trip.days) {
    for (const id of day.places || []) {
      assert.ok(photos[id]?.photo?.src, day.date + ' referencia imagen inexistente: ' + id);
      assert.match(photos[id].photo.src, /^https:\/\//);
    }
  }
  for (const stay of trip.hotels) {
    assert.ok(stay.mapsUrl?.startsWith('https://www.google.com/maps/'));
    assert.ok(stay.links?.some(link => link.url.startsWith('https://')));
  }
});

test('Patagonia: los gastos por día coinciden con el presupuesto sin duplicarlo', () => {
  const expensesTotal = trip.expenses.reduce((sum, x) => sum + x.cost.amount, 0);
  const dailyTotal = trip.days.reduce((sum, x) => sum + x.spend, 0);
  assert.equal(expensesTotal, 144948);
  assert.equal(dailyTotal, expensesTotal);
  assert.ok(trip.days.every(x => Number.isFinite(x.spend) && x.spend >= 0));
  for (const day of trip.days) {
    const assigned = trip.expenses.filter(x => x.date === day.date)
      .reduce((sum, x) => sum + x.cost.amount, 0);
    assert.equal(day.spend, assigned, 'Desglose diario incompatible: ' + day.date);
  }
  assert.equal(trip.expenses.filter(x => x.id.startsWith('food-day-')).length, 15);
  assert.equal(trip.expenses.filter(x => x.id.startsWith('food-day-'))
    .reduce((sum, x) => sum + x.cost.amount, 0), 15000);
  assert.ok(!trip.expenses.some(x => x.id === 'food'));
});

test('Patagonia: los cuatro transportes renderizan y no duplican presupuesto', () => {
  for (const transport of trip.majorTransport) {
    assert.ok(transport.budgetIncludedIn);
    assert.ok(trip.expenses.some(e => e.id === transport.budgetIncludedIn));
    assert.ok(transport.options.length);
    assert.ok(transport.options.every(o => o.journeys?.length && o.fares?.length && o.selectedFare));
    assert.ok(transport.options.every(o => o.journeys.every(j => j.segments?.length)));
  }
  assert.equal(trip.days.reduce((sum,d) => sum + d.spend,0),
    trip.expenses.reduce((sum,e) => sum + e.cost.amount,0));
});

test('Patagonia: escenario por persona y alojamientos vinculados con el ledger', () => {
  assert.equal(trip.budgetPreliminary.low, 137948);
  assert.equal(trip.budgetPreliminary.high, 151948);
  assert.equal(trip.budgetPreliminary.referenceFlightMXN, 24398);
  assert.equal(trip.budgetPreliminary.low / trip.travelerCount, 68974);
  assert.equal(trip.budgetPreliminary.high / trip.travelerCount, 75974);
  for (const hotel of trip.hotels) assert.ok(trip.expenses.some(e => e.hotelId === hotel.id));
  for (const transport of trip.majorTransport) {
    const expense = trip.expenses.find(e => e.id === transport.budgetIncludedIn);
    assert.ok(expense, 'Cobertura de transporte faltante: ' + transport.id);
  }
});

test('Patagonia: tipo de cambio fechado y escenarios de autobús sin doble conteo', () => {
  assert.equal(trip.exchangeRates.ARS, 0.012);
  assert.equal(trip.exchangeRateSnapshot.date, '2026-11-02');
  const buses = trip.majorTransport.filter(x => x.type === 'bus');
  assert.equal(buses.length, 2);
  for (const bus of buses) {
    assert.equal(bus.options.length, 2);
    assert.ok(bus.options.every(o => o.fares[0]?.price?.currency === 'MXN'));
    assert.ok(bus.options[1].fares[0].price.amount > bus.options[0].fares[0].price.amount);
    assert.equal(trip.expenses.find(e => e.id === bus.budgetIncludedIn).cost.amount,
      bus.options[0].fares[0].price.amount);
  }
  assert.equal(trip.days.reduce((sum,d)=>sum+d.spend,0),
    trip.expenses.reduce((sum,e)=>sum+e.cost.amount,0));
});

test('El estándar presupuestario declara viajeros para los cuatro viajes nuevos', () => {
  const root = 'data/trips/';
  const template = JSON.parse(fs.readFileSync(root + '_template.json', 'utf8'));
  assert.equal(template.travelerCount, null, 'No asumir viaje individual en un borrador');
  const expectations = {
    'espana-portugal-2027': 1,
    'italia-norte-2027': 1,
    'japon-2027': 1,
    'patagonia-argentina-2027': 2
  };
  for (const [id, expected] of Object.entries(expectations)) {
    const item = JSON.parse(fs.readFileSync(root + id + '.json', 'utf8'));
    assert.equal(item.travelerCount, expected, id);
    assert.ok(Number.isInteger(item.travelerCount) && item.travelerCount > 0);
  }
});
