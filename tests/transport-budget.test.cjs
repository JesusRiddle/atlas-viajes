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
        ...trip.expenses.filter(e => !e.optional).map(e => e.cost)]
        .reduce((sum, cost) => sum + budget.convert(cost, trip.exchangeRates), 0);
    assert.equal(summary.knownTotalMXN, Math.round(expected * 100) / 100);
    assert.equal(summary.entries.length, trip.majorTransport.length + trip.expenses.filter(e => !e.optional).length);
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

test('vuelos Iberia: cuatro segmentos completos, escalas y tres tarifas', () => {
    const flight = trip.majorTransport.find(t => t.id === 'flight-international');
    const option = flight.options.find(o => o.id === 'A');
    const [outbound, returning] = option.journeys.map(model.journeySummary);
    assert.equal(outbound.durationMinutes, 905);
    assert.equal(returning.durationMinutes, 1005);
    assert.equal(outbound.layoverMinutes[0], 165);
    assert.equal(returning.layoverMinutes[0], 115);
    assert.deepEqual([...option.journeys.flatMap(j => j.segments.map(s => s.flightNumber))],
        ['IB312', 'IB803', 'IB1238', 'IB311']);
    assert.deepEqual([...option.fares.map(f => f.price.amount)], [20060, 23330, 26215]);
    assert.equal(option.fares[0].baggage.checked.pieces, 0);
    assert.equal(option.fares[1].baggage.checked.pieces, 1);
    assert.equal(option.fares[2].baggage.checked.pieces, 1);
    assert.equal(option.journeys[1].segments[0].arrivalTerminal, null);
});

test('cambio de tarifa de vuelo actualiza presupuesto sin sumar tarifas alternativas', () => {
    const flight = trip.majorTransport.find(t => t.id === 'flight-international');
    const initial = budget.currentSummary(trip).knownTotalMXN;
    selections.set(trip, flight.id, 'A', 'optimal');
    try {
        const next = budget.currentSummary(trip);
        assert.equal(next.knownTotalMXN - initial, 3270);
        assert.equal(next.entries.filter(e => e.id === flight.id).length, 1);
    } finally {
        selections.reset(trip.id);
    }
});

test('los días muestran el transporte vinculado y siguen el selector Frecciarossa/Italo', () => {
    vm.runInContext(fs.readFileSync('components/day-transport.js', 'utf8'), ctx, { filename: 'components/day-transport.js' });
    vm.runInContext(fs.readFileSync('components/day.js', 'utf8'), ctx, { filename: 'components/day.js' });
    const esc = value => String(value).replace(/&/g, '&amp;');
    const view = ctx.window.AtlasDay({ trips: [trip], esc, places: {}, photos: {} });
    const day4 = trip.days.find(day => day.n === 4);
    const original = JSON.stringify(trip);
    try {
        const before = view.transportSummary(trip, day4);
        assert.ok(before.includes('Frecciarossa 9613'));
        assert.ok(before.includes('08:30'));
        assert.ok(before.includes('22.9'));
        selections.set(trip, 'train-milano-bologna', 'B', 'smart');
        const after = view.transportSummary(trip, day4);
        assert.ok(after.includes('Italo'));
        assert.ok(after.includes('09:40'));
        assert.ok(after.includes('25.9'));
        assert.ok(!after.includes('Frecciarossa 9613'));
        assert.equal(JSON.stringify(trip), original);
    } finally {
        selections.reset(trip.id);
    }
});

test('Traslados principales muestra cronologías de ida y regreso con sus números de vuelo', () => {
    vm.runInContext(fs.readFileSync('components/major-transport.js', 'utf8'), ctx, { filename: 'components/major-transport.js' });
    const html = ctx.window.AtlasMajorTransport.render(trip);
    const flight = html.slice(html.indexOf('data-transport="flight-international"'), html.indexOf('</details>', html.indexOf('data-transport="flight-international"')));
    assert.ok(flight.includes('mt-flight-timeline'));
    for (const code of ['IB312', 'IB803', 'IB1238', 'IB311']) assert.ok(flight.includes(code), code);
    assert.ok(flight.includes('Escala en MAD'));
    assert.ok(flight.includes('10 h 05 min'));
    assert.ok(flight.includes('12 h 20 min'));
    assert.ok(flight.includes('Día 01'));
    assert.ok(flight.includes('Día 12'));
});

test('referencias diarias de vuelos muestran solo el sentido correcto', () => {
    const view = ctx.window.AtlasDay({ trips: [trip], esc: String, places: {}, photos: {} });
    const outbound = view.transportSummary(trip, trip.days[0]);
    const returning = view.transportSummary(trip, trip.days.at(-1));
    assert.ok(outbound.includes('MEX → MAD'));
    assert.ok(outbound.includes('MAD → MXP'));
    assert.ok(!outbound.includes('BLQ → MAD'));
    assert.ok(returning.includes('BLQ → MAD'));
    assert.ok(returning.includes('MAD → MEX'));
    assert.ok(!returning.includes('MEX → MAD'));
    assert.equal(budget.summary(trip).entries.filter(e => e.id === 'flight-international').length, 1);
});

test('los vuelos muestran +1/+2 solo al llegar en días locales posteriores a la salida inicial', () => {
    const copied = JSON.parse(JSON.stringify(trip));
    const flight = copied.majorTransport.find(t => t.id === 'flight-international');
    const outbound = flight.options[0].journeys[0].segments;
    outbound[0].arrival = '2026-11-27T17:10:00+01:00';
    outbound[1].departure = '2026-11-27T19:55:00+01:00';
    outbound[1].arrival = '2026-11-28T22:10:00+01:00';
    const html = ctx.window.AtlasDayTransport.render(copied, copied.days[0]);
    assert.match(html, /17:10<sup class="flight-day-offset"[^>]*>\+1<\/sup>/);
    assert.match(html, /22:10<sup class="flight-day-offset"[^>]*>\+2<\/sup>/);
    const usual = ctx.window.AtlasDayTransport.render(trip, trip.days[0]);
    assert.doesNotMatch(usual, /flight-day-offset/);
});

test('cinco excursiones muestran ambos tramos desde los datos estructurados', () => {
    const view = ctx.window.AtlasDay({ trips: [trip], esc: String, places: {}, photos: {} });
    for (const number of [5, 6, 8, 9, 10]) {
        const day = trip.days.find(x => x.n === number);
        const html = view.transportSummary(trip, day);
        const ref = day.transportRefs[0];
        const journey = trip.majorTransport.find(t => t.id === ref).options[0].journeys[0];
        for (const segment of journey.segments) {
            assert.ok(html.includes(segment.from + ' → ' + segment.to));
            assert.ok(html.includes(segment.departure.slice(11, 16)));
        }
    }
});

test('operadores y números de servicio sobreviven a la integración diaria', () => {
    const view = ctx.window.AtlasDay({ trips: [trip], esc: String, places: {}, photos: {} });
    const firenze = view.transportSummary(trip, trip.days.find(d => d.n === 9));
    assert.ok(firenze.includes('Frecciarossa 9505'));
    assert.ok(firenze.includes('Italo'));
    const ravenna = view.transportSummary(trip, trip.days.find(d => d.n === 5));
    assert.ok(ravenna.includes('Regionale 17543'));
    assert.ok(ravenna.includes('Regionale 17558'));
    const flight = view.transportSummary(trip, trip.days[0]);
    assert.ok(flight.includes('Precio ida y vuelta'));
});

test('trenes referenciados se asignan al día sin duplicar el subtotal global', () => {
    const result = budget.summary(trip);
    for (const day of trip.days.filter(d => d.transportRefs?.some(ref => ref.startsWith('train-')))) {
        const ref = day.transportRefs.find(id => id.startsWith('train-'));
        assert.equal(result.byDay[day.date].entries.filter(e => e.id === ref).length, 1);
    }
    assert.equal(result.byDay[trip.days[0].date].entries.some(e => e.id === 'flight-international'), false);
    assert.equal(result.byDay[trip.days.at(-1).date].entries.some(e => e.id === 'flight-international'), false);
    const allocated = Object.values(result.byDay).reduce((sum, day) => sum + day.totalMXN, 0);
    const flight = result.entries.find(e => e.id === 'flight-international');
    assert.equal(Math.round((allocated + flight.mxn) * 100) / 100, result.knownTotalMXN);
});

test('presupuesto diario responde al cambio de tren sin modificar los alojamientos', () => {
    const date = '2026-11-29';
    const original = budget.currentSummary(trip).byDay[date].totalMXN;
    const other = budget.currentSummary(trip).byDay['2026-11-30'].totalMXN;
    selections.set(trip, 'train-milano-bologna', 'B', 'smart');
    try {
        const changed = budget.currentSummary(trip);
        assert.equal(Math.round((changed.byDay[date].totalMXN - original) * 100) / 100,
            budget.convert({ amount: 3, currency: 'EUR' }, trip.exchangeRates));
        assert.equal(changed.byDay['2026-11-30'].totalMXN, other);
    } finally {
        selections.reset(trip.id);
    }
});

test('tarjeta diaria presenta partidas registradas, no inventa comidas ni asigna vuelos redondos', () => {
    vm.runInContext(fs.readFileSync('components/day-budget.js', 'utf8'), ctx, { filename: 'components/day-budget.js' });
    const view = ctx.window.AtlasDayBudget;
    const firenze = view.render(trip, trip.days.find(d => d.n === 9));
    assert.ok(firenze.includes('Firenze · Accademia'));
    assert.ok(firenze.includes('Bologna ↔ Firenze'));
    assert.ok(firenze.includes('Subtotal registrado de esta jornada'));
    const outbound = view.render(trip, trip.days[0]);
    assert.ok(outbound.includes('El vuelo se contabiliza en el presupuesto global'));
    assert.ok(!outbound.includes('20,060'));
});

test('días sin cotización no se presentan como gasto cero y las notas son contextuales', () => {
    const view = ctx.window.AtlasDayBudget;
    const free = view.render(trip, trip.days.find(d => d.n === 12));
    assert.ok(free.includes('Alimentación · día 12'));
    assert.ok(free.includes('Presupuesto diario incompleto'));
    const input = JSON.parse(JSON.stringify(trip));
    input.expenses.push({ id: 'food-sample', category: 'food', concept: 'Alimentación', date: '2026-11-30',
        cost: { amount: 350, currency: 'MXN' } });
    const updated = view.render(input, input.days.find(d => d.n === 5));
    assert.ok(updated.includes('Alimentación'));
    assert.ok(updated.includes('Alimentación · día 5 · estimado'));
    assert.ok(!updated.includes('verificar comidas'));
});

test('el desglose nuevo excluye opcionales y conserva exactamente las entradas de Firenze', () => {
    const results = budget.summary(trip);
    assert.equal(results.entries.some(x => x.id === 'firenze-corridoio'), false);
    assert.equal(results.entries.filter(x => x.id.startsWith('firenze-') && x.category === 'activities').length, 3);
    assert.equal(trip.expenses.filter(x => x.category === 'food' && !x.optional).length, trip.days.length);
    assert.equal(results.byDay['2026-12-07'].entries.some(x => x.id === 'bologna-marconi'), true);
});

test('el JSON carece de presupuestos históricos duplicados y etiqueta importes diarios', () => {
    assert.equal(Object.prototype.hasOwnProperty.call(trip, 'knownCosts'), false);
    const view = ctx.window.AtlasDayBudget;
    const day = view.render(trip, trip.days.find(d => d.n === 9));
    assert.ok(day.includes('Firenze · Accademia · estimado'));
    const first = view.render(trip, trip.days[0]);
    assert.ok(first.includes('Moxy Milano Malpensa Airport · 1 noche · cotizado'));
});

test('JSON modular sin resúmenes ferroviarios ni notas cambiarias heredadas', () => {
    for (const field of ['railSummary', 'railTotal', 'railExclusions', 'railCurrencyNote',
        'costExclusions', 'exchangeNote', 'stays', 'tips', 'boldCityNames', 'knownCosts']) {
        assert.equal(Object.prototype.hasOwnProperty.call(trip, field), false, field);
    }
    assert.equal(trip.ticketNotes.length > 0, true);
    assert.equal(trip.days.length, 12);
    assert.equal(trip.majorTransport.length, 7);
});

test('limpieza preserva las once noches y el presupuesto de referencia', () => {
    const dates = trip.days.slice(0, -1);
    assert.equal(dates.length, 11);
    for (const day of dates) {
        const hotel = trip.hotels.find(item => item.id === day.hotel);
        assert.ok(hotel, 'Hospedaje ausente en día ' + day.n);
        assert.ok(day.date >= hotel.checkIn && day.date < hotel.checkOut,
            'Fecha fuera de estancia en día ' + day.n);
    }
    assert.equal(trip.days.at(-1).hotel, undefined);
    assert.deepEqual([...budget.summary(trip).planningRangeMXN], [65000, 90000]);
    assert.equal(trip.exchangeRates.EUR, 20.6451);
    const snapshot = JSON.stringify(trip);
    budget.currentSummary(trip);
    assert.equal(JSON.stringify(trip), snapshot);
});

test('Iberia: terminal IB1238 pendiente y condiciones no presentadas como confirmadas', () => {
    const flight = trip.majorTransport.find(t => t.id === 'flight-international');
    const option = flight.options[0];
    const arrival = option.journeys[1].segments[0];
    assert.equal(arrival.arrivalTerminal, null);
    assert.ok(arrival.terminalNote.includes('no confirmada'));
    assert.ok(option.notes.includes('penalizaciones'));
    assert.ok(option.sources.some(source => source.includes('aena.es')));
    assert.equal(budget.summary(trip).entries.filter(e => e.id === flight.id).length, 1);
});
