// Ejecutar desde la raíz: node --test tests/transport-budget.test.cjs
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ctx = vm.createContext({ window: {} });
for (const file of ['components/transport-model.js', 'components/selections.js', 'components/budget.js']) {
    vm.runInContext(fs.readFileSync(file, 'utf8'), ctx, { filename: file });
}
const model = ctx.window.AtlasTransportModel;
const selections = ctx.window.AtlasSelections;
const budget = ctx.window.AtlasBudget;
const trip = JSON.parse(fs.readFileSync('data/trips/emilia-romana.json', 'utf8'));

test('JSON de Emilia-Romagna sin referencias de transporte inválidas', () => {
    assert.deepEqual([...model.validateTrip(trip)], []);
});

test('zona horaria, escala y duración completas', () => {
    const journey = { segments: [
        { from: 'MEX', to: 'MAD', departure: '2026-11-26T00:05:00-06:00', arrival: '2026-11-26T15:00:00+01:00' },
        { from: 'MAD', to: 'MXP', departure: '2026-11-26T17:45:00+01:00', arrival: '2026-11-26T22:10:00+01:00' }
    ] };
    const result = model.journeySummary(journey);
    assert.equal(result.durationMinutes, 905);
    assert.equal(result.layoverMinutes[0], 165);
    assert.equal(result.stops, 1);
    assert.deepEqual([...model.validateJourney(journey)], []);
});

test('fecha sin zona horaria y conexión negativa se rechazan', () => {
    const journey = { segments: [
        { from: 'MEX', to: 'MAD', departure: '2026-11-26T00:05', arrival: '2026-11-26T17:00:00+01:00' },
        { from: 'MAD', to: 'MXP', departure: '2026-11-26T16:00:00+01:00', arrival: '2026-11-26T22:10:00+01:00' }
    ] };
    assert.ok(model.validateJourney(journey).some(x => x.includes('sin zona horaria')));
    assert.ok(model.validateJourney(journey).some(x => x.includes('escala negativa')));
});

test('equipaje desconocido se permite pero datos imposibles no', () => {
    assert.equal(model.validateBaggage({ personalItem: null, cabin: null, checked: null }).length, 0);
    assert.ok(model.validateBaggage({ checked: { pieces: -1, weightKg: 23 } }).length > 0);
});

test('seleccionar alternativa recalcula sin mutar el JSON', () => {
    const before = JSON.stringify(trip.majorTransport);
    const id = 'train-milano-bologna';
    const rail = trip.majorTransport.find(x => x.id === id);
    assert.equal(budget.selectedTransportPrice(rail).amount, 22.90);
    const original = budget.summary(trip).entries.find(x => x.id === id);
    selections.set(trip, id, 'B', 'smart');
    const selected = budget.currentSummary(trip).entries.find(x => x.id === id);
    assert.equal(budget.selectedTransportPrice(rail, selections.get(trip.id)[id]).amount, 25.90);
    assert.equal(selected.cost.amount - original.cost.amount, 3);
    assert.equal(JSON.stringify(trip.majorTransport), before);
    selections.reset(trip.id);
});

test('solo se suma una tarifa por transporte, no las alternativas', () => {
    const summary = budget.summary(trip);
    const trains = summary.entries.filter(x => x.id.startsWith('train-'));
    assert.equal(trains.length, 6);
    assert.equal(trains.reduce((sum, x) => sum + x.cost.amount, 0).toFixed(2), '103.70');
    assert.ok(summary.partial);
    assert.equal(summary.knownTotalMXN, 18754);
});

test('sin tipo de cambio EUR no se inventa una conversión', () => {
    assert.equal(budget.convert({ amount: 22.90, currency: 'EUR' }, {}), null);
    assert.equal(budget.convert({ amount: 22.90, currency: 'EUR' }, { EUR: 20 }), 458);
});

test('no duplica vuelos redondos referenciados en días 1 y 12', () => {
    assert.equal(trip.days.filter(x => x.transportRefs?.includes('flight-international')).length, 2);
    assert.equal(budget.summary(trip).entries.filter(x => x.id === 'flight-international').length, 1);
});

test('distribución hotelera por noche preserva el importe', () => {
    const sample = {
        id: 'sample', days: [
            { n: 1, date: '2026-11-26' }, { n: 2, date: '2026-11-27' },
            { n: 3, date: '2026-11-28' }
        ],
        expenses: [{ id: 'stay', category: 'lodging', date: '2026-11-26',
            nights: 3, cost: { amount: 100, currency: 'MXN' } }]
    };
    const result = budget.summary(sample);
    assert.equal(result.knownTotalMXN, 100);
    assert.equal(Object.values(result.byDay).reduce((n, x) => n + x.totalMXN, 0), 100);
});
