// Regression del calendario y presupuesto de Patagonia Argentina 2027.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const trip = JSON.parse(fs.readFileSync('data/trips/patagonia-argentina-2027.json', 'utf8'));
const utc = s => Date.parse(s + 'T00:00:00Z');
const daysBetween = (a, b) => (utc(b) - utc(a)) / 86400000;

test('Patagonia: 15 días correlativos y 14 noches sin solapamientos', () => {
  assert.equal(trip.start, '2027-11-04');
  assert.equal(trip.end, '2027-11-18');
  assert.equal(trip.days.length, 15);
  assert.equal(daysBetween(trip.start, trip.end), 14);
  trip.days.forEach((day, index) => {
    assert.equal(day.n, index + 1);
    assert.equal(utc(day.date), utc(trip.start) + index * 86400000);
  });
  assert.equal(trip.bases.reduce((sum, stay) => sum + stay[1], 0), 14);
  assert.equal(trip.hotels.reduce((sum, hotel) => sum + daysBetween(hotel.checkIn, hotel.checkOut), 0), 14);
  for (const day of trip.days.slice(0, -1)) {
    assert.ok(day.hotel, 'Falta hotel para ' + day.date);
    const hotel = trip.hotels.find(h => h.id === day.hotel);
    assert.ok(hotel, 'Hotel inexistente para ' + day.date);
    assert.ok(utc(hotel.checkIn) <= utc(day.date) && utc(day.date) < utc(hotel.checkOut), 'Hotel desfasado el ' + day.date);
  }
});

test('Patagonia: costos estimados coherentes y referencias históricas explícitas', () => {
  assert.equal(trip.status, 'draft');
  assert.equal(trip.budgetPreliminary, true);
  assert.equal(trip.expenses.reduce((sum, x) => sum + x.cost.amount, 0), 144648);
  assert.equal(trip.expenses.find(x => x.id === 'flight-international').cost.amount, 24398);
  assert.equal(trip.expenses.find(x => x.id === 'flight-domestic').cost.amount, 23250);
  assert.ok(trip.budgetRange[0] <= 144648 && 144648 <= trip.budgetRange[1]);
  for (const flight of trip.majorTransport.filter(x => x.type === 'flight')) {
    assert.equal(flight.selectedOption, null);
    assert.match(flight.notes, /2026/);
    assert.match(flight.notes, /NO CONFIRMADO 2027/);
  }
});

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
