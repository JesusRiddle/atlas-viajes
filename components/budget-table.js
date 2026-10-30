// Presentación del presupuesto estructurado. Sin importes hardcodeados ni datos duplicados.
window.AtlasBudgetTable = (() => {
    'use strict';
    const budget = window.AtlasBudget;
    const selections = window.AtlasSelections;
    const esc = value => String(value ?? '').replace(/[&<>"']/g, char =>
        ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
    const decimal = value => new Intl.NumberFormat('es-MX', {
        minimumFractionDigits: 2, maximumFractionDigits: 2
    }).format(value);
    const pesos = value => '$' + decimal(value);
    const original = cost => {
        if (!cost || !Number.isFinite(cost.amount) || cost.currency === 'MXN') return '';
        return (cost.currency === 'EUR' ? '€' : cost.currency === 'USD' ? 'US$' : cost.currency + ' ') +
            decimal(cost.amount);
    };
    const groups = [
        ['flight', 'Vuelos internacionales y nacionales'],
        ['lodging', 'Alojamientos'],
        ['intercity_transport', 'Transporte terrestre · interurbano'],
        ['local_transport', 'Transporte terrestre · urbano'],
        ['admission', 'Entradas y actividades'],
        ['activities', 'Otras actividades'],
        ['food', 'Alimentación'],
        ['taxes', 'Impuestos'],
        ['contingency', 'Contingencia'],
        ['other', 'Otros gastos']
    ];
    function rows(trip) {
        const result = budget.currentSummary(trip);
        const transports = new Map((trip.majorTransport || []).map(t => [t.id, t]));
        const expenses = new Map((trip.expenses || []).map(e => [e.id, e]));
        const grouped = new Map(groups.map(([key]) => [key, []]));
        for (const entry of result.entries) {
            const transport = transports.get(entry.id);
            // Los traslados por tierra están presupuestados en expenses. No duplicar sus rutas.
            if (transport && transport.type !== 'flight') continue;
            const category = transport ? 'flight' : (expenses.get(entry.id)?.category || 'other');
            if (!grouped.has(category)) grouped.set(category, []);
            grouped.get(category).push({
                ...entry, label: (transport?.title || expenses.get(entry.id)?.concept || entry.id) +
                    (expenses.get(entry.id)?.status === 'estimated' ? ' · estimado' :
                    expenses.get(entry.id)?.status === 'quoted' ? ' · cotizado' : '')
            });
        }
        const referenceFlight = trip.majorTransport?.find(t => t.id === 'flight-international');
        const flightSelection = selections.get(trip.id)?.['flight-international'] || {};
        const flightOption = referenceFlight?.options?.find(o => o.id === (flightSelection.option || referenceFlight.selectedOption)) ||
            referenceFlight?.options?.[0];
        const referenceFare = flightOption?.fares?.find(f => f.id === (flightSelection.fare || flightOption.selectedFare));
        const referenceFlightMXN = budget.convert(referenceFare?.price, trip.exchangeRates || {});
        const markup = [];
        for (const [key, title] of groups) {
            const items = grouped.get(key) || [];
            // Mantener las partidas aún sin cotizar dentro de su categoría.
            const pendingLabel = key === 'food' ? 'Pendiente de desglose' :
                key === 'other' ? 'Pendiente de desglose' : null;
            if (!items.length && !pendingLabel) continue;
            markup.push('<tr class="budget-category"><th colspan="3" scope="rowgroup"><button type="button" class="budget-toggle" data-budget-toggle="' + esc(key) + '" aria-expanded="true" aria-label="Contraer ' + esc(title) + '"><span class="budget-chevron" aria-hidden="true"></span>' + esc(title) + '</button></th></tr>');
            if (!items.length) {
                markup.push('<tr class="budget-item budget-pending" data-budget-group="' + esc(key) + '"><td>' + esc(pendingLabel) +
                    '</td><td></td><td class="budget-amount">Por cotizar</td></tr>');
                markup.push('<tr class="budget-subtotal"><td>Subtotal</td><td></td><td class="budget-amount">$0.00 + pendientes</td></tr>');
                continue;
            }
            for (const item of items) {
                const isReferenceFlight = item.id === referenceFlight?.id && item.mxn === null;
                const displayCost = isReferenceFlight && referenceFlightMXN !== null ? referenceFare.price : item.cost;
                const displayMXN = isReferenceFlight && referenceFlightMXN !== null ? referenceFlightMXN : item.mxn;
                markup.push('<tr class="budget-item" data-budget-group="' + esc(key) + '"><td>' + esc(item.label) + '</td><td class="budget-amount">' +
                    esc(original(displayCost)) + '</td><td class="budget-amount">' +
                    (displayMXN === null ? 'Por estimar' : pesos(displayMXN) + (isReferenceFlight ? ' · referencia' : '')) + '</td></tr>');
            }
            const subtotal = items.reduce((sum, item) => sum + (item.mxn ?? 0), 0);
            markup.push('<tr class="budget-subtotal"><td>' + (key === 'flight' ? 'Referencia de vuelo · no incluida en subtotal terrestre' : 'Subtotal') +
                '</td><td></td><td class="budget-amount">' +
                (key === 'flight' && referenceFlightMXN !== null ? pesos(referenceFlightMXN) :
                    pesos(subtotal) + (items.some(x => x.mxn === null) ? ' + pendientes' : '')) + '</td></tr>');
        }
        const optional = (trip.expenses || []).filter(item => item.optional);
        if (optional.length) {
            markup.push('<tr class="budget-category"><th colspan="3" scope="rowgroup"><button type="button" class="budget-toggle" data-budget-toggle="optional" aria-expanded="true" aria-label="Contraer opcionales"><span class="budget-chevron" aria-hidden="true"></span>Opcionales · no incluidos en subtotal</button></th></tr>');
            optional.forEach(item => {
                const mxn = budget.convert(item.cost, trip.exchangeRates || {}, item.paidMXN);
                markup.push('<tr class="budget-item budget-optional" data-budget-group="optional"><td>' + esc(item.concept) +
                    '</td><td class="budget-amount">' + esc(original(item.cost)) +
                    '</td><td class="budget-amount">' + (mxn === null ? 'Por cotizar' : pesos(mxn)) + '</td></tr>');
            });
            const optionalSubtotal = optional.reduce((sum, item) => sum + (budget.convert(item.cost, trip.exchangeRates || {}, item.paidMXN) ?? 0), 0);
            markup.push('<tr class="budget-subtotal"><td>Subtotal opcional · no incluido</td><td></td><td class="budget-amount">' + pesos(optionalSubtotal) + '</td></tr>');
        }
        markup.push('<tr class="totalrow"><td>Subtotal terrestre estimado · sin vuelo</td><td></td><td class="budget-amount">' +
            pesos(result.knownTotalMXN) + '</td></tr>');
        if (referenceFlightMXN !== null) markup.push('<tr class="totalrow"><td>Estimación global · terrestre + vuelo de referencia (sin duplicar trenes)</td><td></td><td class="budget-amount">' +
            pesos(result.knownTotalMXN + referenceFlightMXN) + '</td></tr>');
        return {
            html: markup.join(''),
            note: 'Todos los importes son estimaciones de planeación. Los vuelos se presentan como referencia y se agregan una sola vez al total global; el transporte interurbano y urbano ya incluye los trenes, autobuses y demás traslados terrestres previstos.',
            result
        };
    }
    function render(trip) {
        if (!trip.majorTransport?.length && !trip.expenses?.length) return '';
        const data = rows(trip);
        const range = data.result.planningRangeMXN;
        const planning = budget.planningEstimate?.(trip);
        return '<div class="budget-ledger" id="budget-ledger">' +
            '<div class="scrolltable"><table><thead><tr><th>Concepto</th><th>Moneda original</th><th>MXN</th></tr></thead>' +
            '<tbody data-budget-rows>' + data.html + '</tbody></table></div>' +
            '<p class="tiny" data-budget-note>' + esc(data.note) + '</p>' +
            (planning ? '<p class="budget-range" data-budget-planning><strong>Proyección global de planeación:</strong> ' + pesos(planning.low) + '–' + pesos(planning.high) + ' MXN · vuelo de referencia ' + esc(planning.flightOption) + ' (' + esc(planning.scenario === 'kix' ? 'regreso KIX' : 'regreso Tokio') + '), sin reservar. Incluye gastos terrestres y vuelo ilustrativo; no sumar nuevamente al total global.</p>' : '') +
            (range ? '<p class="budget-range"><strong>Rango estimado para planear:</strong> ' +
                pesos(range[0]) + '–' + pesos(range[1]) + ' MXN</p>' : '') +
            '</div>';
    }
    function mount(root, trip) {
        const host = root.querySelector('#budget-ledger');
        if (!host) return () => {};
        const collapsed = new Set();
        const applyCollapsed = () => {
            host.querySelectorAll('[data-budget-toggle]').forEach(button => {
                const key = button.dataset.budgetToggle;
                const isCollapsed = collapsed.has(key);
                button.setAttribute('aria-expanded', String(!isCollapsed));
                button.setAttribute('aria-label', (isCollapsed ? 'Expandir ' : 'Contraer ') + button.textContent.trim());
            });
            host.querySelectorAll('[data-budget-group]').forEach(row => {
                row.hidden = collapsed.has(row.dataset.budgetGroup);
            });
        };
        const onClick = event => {
            const button = event.target.closest('[data-budget-toggle]');
            if (!button || !host.contains(button)) return;
            const key = button.dataset.budgetToggle;
            if (collapsed.has(key)) collapsed.delete(key);
            else collapsed.add(key);
            applyCollapsed();
        };
        host.addEventListener('click', onClick);
        const refresh = () => {
            if (!host.isConnected) return;
            const next = rows(trip);
            host.querySelector('[data-budget-rows]').innerHTML = next.html;
            host.querySelector('[data-budget-note]').textContent = next.note;
            const projection = host.querySelector('[data-budget-planning]');
            const updated = budget.planningEstimate?.(trip);
            if (projection && updated) projection.innerHTML = '<strong>Proyección global de planeación:</strong> ' + pesos(updated.low) + '–' + pesos(updated.high) + ' MXN · vuelo de referencia ' + esc(updated.flightOption) + ' (' + esc(updated.scenario === 'kix' ? 'regreso KIX' : 'regreso Tokio') + '), sin reservar. Incluye gastos terrestres y vuelo ilustrativo; no sumar al subtotal registrado.';
            applyCollapsed();
        };
        const unsubscribe = selections.subscribe(tripId => { if (tripId === trip.id) refresh(); });
        return () => { host.removeEventListener('click', onClick); unsubscribe(); };
    }
    return { render, mount };
})();
