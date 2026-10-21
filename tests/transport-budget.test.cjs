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
    // Vuelos + todos los trenes + los tres hoteles + entradas de Firenze.
    // El importe no debe permanecer anclado a la etapa en que solo había vuelos.
    const expected = [...trip.majorTransport.map(t => budget.selectedTransportPrice(t)),
        ...trip.expenses.map(e => e.cost)]
        .reduce((sum, cost) => sum + budget.convert(cost, trip.exchangeRates), 0);
    assert.equal(summary.knownTotalMXN, Math.round(expected * 100) / 100);
    assert.equal(summary.entries.length, trip.majorTransport.length + trip.expenses.length);
    assert.equal(summary.pending.length, 0);
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

test('cambiar Frecciarossa por Italo modifica solo el tren seleccionado y el total', () => {
    const id = 'train-milano-bologna';
    const baseline = budget.summary(trip);
    const before = JSON.stringify(trip);
    selections.set(trip, id, 'B', 'smart');
    try {
        const current = budget.currentSummary(trip);
        const beforeEntry = baseline.entries.find(e => e.id === id);
        const afterEntry = current.entries.find(e => e.id === id);
        assert.equal(beforeEntry.cost.amount, 22.9);
        assert.equal(afterEntry.cost.amount, 25.9);
        assert.equal(afterEntry.mxn - beforeEntry.mxn,
            budget.convert({ amount: 25.9, currency: 'EUR' }, trip.exchangeRates) -
            budget.convert({ amount: 22.9, currency: 'EUR' }, trip.exchangeRates));
        assert.equal(Math.round((current.knownTotalMXN - baseline.knownTotalMXN) * 100) / 100,
            Math.round((afterEntry.mxn - beforeEntry.mxn) * 100) / 100);
        assert.deepEqual(current.entries.filter(e => e.id !== id), baseline.entries.filter(e => e.id !== id));
        assert.equal(JSON.stringify(trip), before);
    } finally {
        selections.reset(trip.id);
    }
});

test('pesos pagados prevalecen sobre divisas y el tipo de cambio de referencia', () => {
    assert.equal(budget.convert({ amount: 100, currency: 'EUR' }, { EUR: 20 }, 1750), 1750);
    assert.equal(budget.convert({ amount: 13881, currency: 'MXN' }, {}), 13881);
    assert.equal(budget.convert({ amount: 100, currency: 'EUR' }, { EUR: 0 }), null);
    assert.equal(budget.convert({ amount: 100, currency: 'USD' }, { USD: 18.42 }), 1842);
});

test('los alojamientos se cuentan una sola vez y se distribuyen por sus noches', () => {
    const result = budget.summary(trip);
    for (const item of trip.expenses.filter(e => e.category === 'lodging')) {
        const entry = result.entries.find(e => e.id === item.id);
        const allocations = Object.values(result.byDay).flatMap(d =>
            d.entries.filter(e => e.id === item.id));
        assert.equal(allocations.length, item.nights);
        assert.equal(Math.round(allocations.reduce((sum, e) => sum + e.mxn, 0) * 100) / 100, entry.mxn);
    }
});

test('las cotizaciones incompletas no se interpretan como costos cero', () => {
    const sample = {
        id: 'pending', exchangeRates: {},
        days: [{ n: 1, date: '2026-11-26' }],
        expenses: [{ id: 'pending-eur', category: 'activities',
            date: '2026-11-26', cost: { amount: 10, currency: 'EUR' } }]
    };
    const result = budget.summary(sample);
    assert.equal(result.knownTotalMXN, 0);
    assert.equal(result.partial, true);
    assert.equal(result.byDay['2026-11-26'].partial, true);
    assert.deepEqual([...result.pending], ['pending-eur']);
});

test('el rango preliminar no se suma al subtotal conocido', () => {
    const result = budget.summary(trip);
    assert.equal(result.planningRangeMXN[0], 65000);
    assert.equal(result.planningRangeMXN[1], 90000);
    assert.ok(result.knownTotalMXN < result.planningRangeMXN[0]);
});
