// Cálculo financiero de datos estructurados; independiente del DOM y del formato visual.
window.AtlasBudget = (() => {
    'use strict';
    // El cálculo permanece independiente de la interfaz y de la persistencia.
    const validMoney = x => x && typeof x === 'object' && Number.isFinite(x.amount) &&
        x.amount >= 0 && typeof x.currency === 'string' && /^[A-Z]{3}$/.test(x.currency);
    const round = amount => Math.round((amount + Number.EPSILON) * 100) / 100;

    function convert(cost, rates = {}, paidMXN = null) {
        if (paidMXN !== null && paidMXN !== undefined) {
            return Number.isFinite(paidMXN) && paidMXN >= 0 ? round(paidMXN) : null;
        }
        if (!validMoney(cost)) return null;
        if (cost.currency === 'MXN') return round(cost.amount);
        const rate = rates[cost.currency];
        return Number.isFinite(rate) && rate > 0 ? round(cost.amount * rate) : null;
    }

    function selectedTransportPrice(transport, selection = {}) {
        const optionId = selection.option || transport.selectedOption;
        const option = transport.options?.find(o => o.id === optionId);
        const fareId = selection.fare || option?.selectedFare;
        const fare = option?.fares?.find(f => f.id === fareId);
        return fare?.price || null;
    }

    function transportComparison(transport, rates = {}) {
        return (transport.options || []).flatMap(option => (option.fares || []).map(fare => ({
            option: option.id, fare: fare.id, name: fare.name,
            cost: fare.price || null, mxn: convert(fare.price, rates)
        })));
    }

    function nightsByDate(start, nights) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(start) || !Number.isInteger(nights) || nights < 1) return [];
        const startUTC = Date.parse(start + 'T00:00:00Z');
        if (!Number.isFinite(startUTC)) return [];
        return Array.from({ length: nights }, (_, index) =>
            new Date(startUTC + index * 86400000).toISOString().slice(0, 10));
    }

    // Los gastos que abarcan varios días se reparten, sin alterar su costo total.
    // Los transportes con varios días (por ejemplo un vuelo redondo) quedan en
    // el total del viaje y no se reparten automáticamente entre jornadas.
    function expenseDates(item) {
        if (Array.isArray(item.dates)) return [...new Set(item.dates)];
        if (item.category === 'lodging' && item.date && item.nights) return nightsByDate(item.date, item.nights);
        return item.date ? [item.date] : [];
    }

    function summary(trip, overrides = {}) {
        const rates = trip.exchangeRates || {};
        const entries = [];
        const issues = [];
        const seen = new Set();
        const register = (id, category, cost, dates, paidMXN = null) => {
            if (!id || seen.has(id)) { issues.push('ID económico ausente o duplicado: ' + id); return; }
            seen.add(id);
            const mxn = convert(cost, rates, paidMXN);
            if (mxn === null) issues.push('Precio o tipo de cambio pendiente: ' + id);
            entries.push({ id, category, cost: cost || null, mxn, dates });
        };
        for (const item of trip.majorTransport || []) {
            const selection = overrides[item.id] || {};
            const cost = selectedTransportPrice(item, selection);
            const day = Number.isInteger(item.day) ? trip.days?.find(d => d.n === item.day) : null;
            // No repartir billetes redondos de avión entre la ida y el regreso.
            const dates = day ? [day.date] : [];
            register(item.id, 'transport', cost, dates, item.paidMXN);
        }
        for (const item of trip.expenses || []) {
            if (item.includedInTransport) continue;
            register(item.id, item.category || 'other', item.cost, expenseDates(item), item.paidMXN);
        }
        const byDay = Object.fromEntries((trip.days || []).map(d => [d.date, { date: d.date, totalMXN: 0, entries: [], partial: false }]));
        const byCategory = {};
        for (const entry of entries) {
            const category = byCategory[entry.category] ||= { totalMXN: 0, count: 0, pending: 0 };
            category.count++;
            if (entry.mxn === null) category.pending++;
            else category.totalMXN = round(category.totalMXN + entry.mxn);
            if (!entry.dates.length) continue;
            const assignedDates = entry.dates.filter(date => byDay[date]);
            if (assignedDates.length !== entry.dates.length) issues.push('Fecha fuera del itinerario: ' + entry.id);
            // Céntimos asignados al último día para conservar exactamente el total.
            if (entry.mxn === null) {
                for (const date of assignedDates) {
                    byDay[date].partial = true;
                    byDay[date].entries.push({ id: entry.id, mxn: null });
                }
            } else if (assignedDates.length === entry.dates.length) {
                const cents = Math.round(entry.mxn * 100);
                const base = Math.floor(cents / assignedDates.length);
                assignedDates.forEach((date, i) => {
                    const allocated = (base + (i === assignedDates.length - 1 ? cents - base * assignedDates.length : 0)) / 100;
                    byDay[date].totalMXN = round(byDay[date].totalMXN + allocated);
                    byDay[date].entries.push({ id: entry.id, mxn: allocated });
                });
            }
        }
        const knownTotalMXN = round(entries.reduce((sum, e) => sum + (e.mxn ?? 0), 0));
        const pending = entries.filter(e => e.mxn === null).map(e => e.id);
        // Las partidas heredadas aún no migradas no pueden darse por contabilizadas.
        const coveredHotels = new Set((trip.expenses || []).map(item => item.hotelId).filter(Boolean));
        const migrationPending = (trip.hotels || []).some(hotel => !coveredHotels.has(hotel.id)) ||
            Boolean(trip.knownCosts?.length && !(trip.expenses || []).length);
        return {
            knownTotalMXN, partial: pending.length > 0 || issues.length > 0 || migrationPending || trip.budgetPreliminary === true,
            migrationPending, pending, issues, byCategory, byDay, entries,
            // El rango de planeación es independiente; no se suma a las partidas.
            planningRangeMXN: trip.budgetRange || (trip.budgetPreliminary && trip.costs?.length === 1
                ? trip.costs[0].slice(1, 3) : null)
        };
    }

    // Recalcula con las selecciones temporales; sin mutar el JSON original.
    function currentSummary(trip) {
        return summary(trip, window.AtlasSelections?.get(trip.id) || {});
    }

    return { convert, selectedTransportPrice, transportComparison, nightsByDate, expenseDates, summary, currentSummary };
})();
