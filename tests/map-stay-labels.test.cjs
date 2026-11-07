'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'travel-ui.js'), 'utf8');
const start = source.indexOf('function mapSection(t){');
const end = source.indexOf('function clearMap(){', start);
assert.ok(start >= 0 && end > start, 'Debe existir el renderizador de mapa');
const sandbox = { window: {}, esc: value => String(value) };
vm.runInNewContext(source.slice(start, end) + '\nthis.renderMap = mapSection;', sandbox);
const renderMap = sandbox.renderMap;

test('Colombia: todos los puntos de alojamiento resuelven sus noches', () => {
  const trip = JSON.parse(fs.readFileSync(path.join(root, 'data/trips/colombia-2027.json'), 'utf8'));
  const nights = new Map(trip.bases);
  for (const point of trip.mapPoints.filter(point => point.base)) {
    assert.ok(nights.has(point.stayName || point.name), point.name + ' no tiene vínculo con bases');
    assert.ok(nights.get(point.stayName || point.name) > 0, point.name + ' debe tener noches positivas');
  }
  const html = renderMap(trip);
  for (const [city, count] of trip.bases) {
    assert.ok(html.includes(count + (count === 1 ? ' noche' : ' noches')), city + ' sin noches');
  }
  assert.doesNotMatch(html, /<small[^>]*>Base<\/small>|Base para dormir/);
  assert.match(html, /Parque Tayrona · referencia regional/);
  assert.match(html, /Cartagena de Indias/);
});

test('El mapa no convierte una estancia desconocida en Base ni en Excursión', () => {
  const trip = { id: 'test', name: 'Prueba', bases: [], mapPoints: [
    { name: 'Pernocta pendiente', coords: [1, 2], base: true, order: 1 },
    { name: 'Visita', coords: [3, 4], base: false, order: 2 }
  ] };
  const html = renderMap(trip);
  assert.match(html, /Noches por definir/);
  assert.match(html, /Excursión/);
  assert.doesNotMatch(html, /Base para dormir/);
});
