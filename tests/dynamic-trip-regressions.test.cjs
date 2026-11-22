'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { validate, photos } = require('../scripts/editorial-relations.cjs');

const window = {};
vm.runInNewContext(fs.readFileSync('modules.js', 'utf8'), { window });
const modules = window.ATLAS_MODULES.filter(m => m.available && m.homeGroup !== 'ideas');
const trips = modules.map(m => JSON.parse(fs.readFileSync('data/trips/' + m.file, 'utf8')));
const catalog = JSON.parse(fs.readFileSync('data/places.json', 'utf8'));
const msDay = 86400000;

// Un transporte puede integrarse en una partida o en un grupo de transportes.
// Resolver hasta el gasto evita ciclos y referencias indirectas huérfanas.
function budgetCoverage(trip, transport) {
  const expenses = new Set((trip.expenses || []).map(e => e.id));
  const items = new Map((trip.majorTransport || []).map(t => [t.id, t]));
  const visited = new Set([transport.id]);
  let ref = transport.budgetIncludedIn;
  while (ref) {
    if (expenses.has(ref)) return true;
    if (visited.has(ref) || !items.has(ref)) return false;
    visited.add(ref);
    const parent = items.get(ref);
    if (!parent.budgetIncludedIn) {
      // El agrupador puede presupuestarse directamente desde su tarifa elegida,
      // aunque no tenga una partida expenses: Cinque Terre, por ejemplo.
      // La tarifa puede seguir pendiente (price: null); su existencia estructural
      // basta para demostrar cobertura sin inventar un importe.
      return (parent.options || []).some(option =>
        Array.isArray(option.fares) && option.fares.length > 0);
    }
    ref = parent.budgetIncludedIn;
  }
  return false;
}


test('contratos de viaje completos para todos los destinos actuales, sin snapshots de agenda', () => {
  assert.ok(trips.length);
  for (const trip of trips) {
    assert.deepEqual(validate(trip, { mode: 'complete' }), [], trip.id);
    assert.deepEqual(photos(trip, catalog, { complete: true }), [], trip.id);
    const allocated = new Set(trip.days.map(d => d.hotel).filter(Boolean));
    for (const hotel of trip.hotels.filter(h => allocated.has(h.id))) {
      const days = trip.days.filter(d => d.hotel === hotel.id);
      const declared = (Date.parse(hotel.checkOut) - Date.parse(hotel.checkIn)) / msDay;
      assert.equal(days.length, declared, trip.id + ': estancia incompleta: ' + hotel.id);
    }
    const ids = new Set(trip.majorTransport.map(t => t.id));
    for (const day of trip.days) for (const ref of day.transportRefs || [])
      assert.ok(ids.has(ref), trip.id + ': transporte huérfano ' + ref);
    for (const item of trip.expenses) if (item.hotelId)
      assert.ok(trip.hotels.some(h => h.id === item.hotelId), trip.id + ': gasto de hotel huérfano');
  }
});

test('viajes de ida y vuelta, tarifas y agrupaciones admiten cambios sin duplicar referencias', () => {
  for (const trip of trips) {
    for (const item of trip.majorTransport) {
      if (!item.budgetIncludedIn) continue;
      assert.ok(budgetCoverage(trip, item),
        trip.id + ': transporte sin cobertura presupuestaria final: ' + item.id);
    }
    // No se exige una cantidad de vuelos, trenes, hoteles ni actividades.
    // Un nuevo transporte es válido si sus referencias y cobertura presupuestaria son coherentes.
  }
});

test('agrupaciones presupuestarias indirectas no aceptan ciclos ni referencias huérfanas', () => {
  const t = { expenses: [{ id: 'presupuesto-ferrocarril' }],
    majorTransport: [
      { id: 'abono', budgetIncludedIn: 'presupuesto-ferrocarril' },
      { id: 'tramo-local', budgetIncludedIn: 'abono' }
    ] };
  assert.equal(budgetCoverage(t, t.majorTransport[1]), true);
  const direct = structuredClone(t);
  direct.expenses = [];
  direct.majorTransport[0].budgetIncludedIn = undefined;
  direct.majorTransport[0].options = [{ fares: [{ price: { amount: 35, currency: 'EUR' } }] }];
  assert.equal(budgetCoverage(direct, direct.majorTransport[1]), true,
    'Un agrupador con tarifa directa no necesita partida adicional');
  direct.majorTransport[0].options[0].fares[0].price = null;
  assert.equal(budgetCoverage(direct, direct.majorTransport[1]), true,
    'Un presupuesto pendiente debe conservar su cobertura sin inventar un precio');
  direct.majorTransport[0].options = [];
  assert.equal(budgetCoverage(direct, direct.majorTransport[1]), false,
    'Sin tarifa directa ni partida el enlace queda huérfano');
  t.majorTransport[0].budgetIncludedIn = 'tramo-local';
  assert.equal(budgetCoverage(t, t.majorTransport[1]), false);
  t.majorTransport[0].budgetIncludedIn = 'partida-inexistente';
  assert.equal(budgetCoverage(t, t.majorTransport[1]), false);
});

test('cuando un viaje declara totales diarios, concilia exactamente con sus gastos', () => {
  for (const trip of trips) {
    if (!trip.days.length || !trip.days.every(d => Number.isFinite(d.spend))) continue;
    if (!trip.expenses.every(e => Number.isFinite(e.cost?.amount))) continue;
    for (const day of trip.days) {
      const expected = trip.expenses.filter(e => e.date === day.date)
        .reduce((sum, e) => sum + e.cost.amount, 0);
      assert.ok(Math.abs(day.spend - expected) < 0.01,
        trip.id + ': total diario desajustado: ' + day.date);
    }
    const daily = trip.days.reduce((sum, d) => sum + d.spend, 0);
    const expenses = trip.expenses.reduce((sum, e) => sum + e.cost.amount, 0);
    assert.ok(Math.abs(daily - expenses) < 0.01,
      trip.id + ': total global distinto de la suma de jornadas');
  }
});

test('cada opción de transporte conserva conexiones contiguas sin depender del operador', () => {
  for (const trip of trips) for (const transport of trip.majorTransport) {
    for (const option of transport.options || []) for (const journey of option.journeys || []) {
      assert.ok(Array.isArray(journey.segments) && journey.segments.length > 0,
        trip.id + ': trayecto sin segmentos: ' + transport.id);
      for (let i = 1; i < journey.segments.length; i++) {
        assert.equal(journey.segments[i - 1].to, journey.segments[i].from,
          trip.id + ': conexión inconexa: ' + transport.id);
      }
    }
  }
});

test('portadas y actividades actuales tienen fotografía y descripción, sin fijar la cantidad', () => {
  for (const trip of trips) {
    const active = new Set([trip.cover, ...(trip.coverSlides || []),
      ...trip.days.flatMap(d => [...(d.places || []), ...(d.optionalPlaces || [])])].filter(Boolean));
    for (const key of active) {
      const src = catalog[key]?.photo?.src;
      assert.ok(src, trip.id + ': referencia fotográfica faltante: ' + key);
      if (/^https?:\/\//.test(src)) {
        assert.ok(src.startsWith('https://'),
          trip.id + ': las fotos externas deben cargarse por HTTPS: ' + key);
      } else {
        assert.ok(!src.startsWith('/') && !src.includes('..'),
          trip.id + ': ruta local de foto fuera del repositorio: ' + key);
        assert.ok(fs.existsSync(src) && fs.statSync(src).size > 100,
          trip.id + ': archivo fotográfico local inexistente o vacío: ' + src);
      }
    }
    for (const day of trip.days) for (const id of day.places || []) {
      assert.ok(trip.placeDescriptions?.[id]?.trim(),
        trip.id + ': falta descripción de actividad actual: ' + id);
    }
  }
});

test('la plantilla no impone número de viajeros ni una selección de hotel', () => {
  const template = JSON.parse(fs.readFileSync('data/trips/_template.json', 'utf8'));
  assert.equal(template.travelerCount, null);
  assert.deepEqual(template.days, []);
  assert.deepEqual(template.hotels, []);
  assert.deepEqual(validate(template, { mode: 'incremental' }), []);
});
