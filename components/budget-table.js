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
        ['flight', 'Vuelos internacionales'],
        ['train', 'Trenes principales'],
        ['lodging', 'Hospedaje'],
        ['activities', 'Entradas y actividades'],
        ['food', 'Alimentación'],
        ['other', 'Otros gastos']
    ];
    function rows(trip) {
        const result = budget.currentSummary(trip);
        const transports = new Map((trip.majorTransport || []).map(t => [t.id, t]));
        const expenses = new Map((trip.expenses || []).map(e => [e.id, e]));
        const grouped = new Map(groups.map(([key]) => [key, []]));
        for (const entry of result.entries) {
            const transport = transports.get(entry.id);
            const category = transport ? (transport.type === 'flight' ? 'flight' : 'train') :
                (expenses.get(entry.id)?.category || 'other');
            if (!grouped.has(category)) grouped.set(category, []);
            grouped.get(category).push({
                ...entry, label: transport?.title || expenses.get(entry.id)?.concept || entry.id
            });
        }
        const markup = [];
        for (const [key, title] of groups) {
            const items = grouped.get(key) || [];
            // Mantener las partidas aún sin cotizar dentro de su categoría.
            const pendingLabel = key === 'food' ? 'Alimentación pendiente de desglose' :
                key === 'other' ? 'Transporte urbano y otros gastos' : null;
            if (!items.length && !pendingLabel) continue;
            markup.push('<tr class="budget-category"><th colspan="3" scope="rowgroup">' + esc(title) + '</th></tr>');
            if (!items.length) {
                markup.push('<tr class="budget-pending"><td>' + esc(pendingLabel) +
                    '</td><td></td><td class="budget-amount">Por cotizar</td></tr>');
                continue;
            }
            for (const item of items) {
                markup.push('<tr><td>' + esc(item.label) + '</td><td class="budget-amount">' +
                    esc(original(item.cost)) + '</td><td class="budget-amount">' +
                    (item.mxn === null ? 'Por cotizar / convertir' : pesos(item.mxn)) + '</td></tr>');
            }
            const subtotal = items.reduce((sum, item) => sum + (item.mxn ?? 0), 0);
            markup.push('<tr class="budget-subtotal"><td>Subtotal · ' + esc(title) +
                '</td><td></td><td class="budget-amount">' + pesos(subtotal) +
                (items.some(x => x.mxn === null) ? ' + pendientes' : '') + '</td></tr>');
        }
        markup.push('<tr class="totalrow"><td>Subtotal conocido · parcial</td><td></td><td class="budget-amount">' +
            pesos(result.knownTotalMXN) + '</td></tr>');
        return {
            html: markup.join(''),
            note: 'Los importes en MXN usan el tipo de cambio de referencia del viaje. ' +
                'No incluye gastos pendientes de cotizar ni constituye el costo total.',
            result
        };
    }
    function render(trip) {
        if (!trip.majorTransport?.length && !trip.expenses?.length) return '';
        const data = rows(trip);
        const range = data.result.planningRangeMXN;
        return '<div class="budget-ledger" id="budget-ledger">' +
            '<div class="scrolltable"><table><thead><tr><th>Concepto</th><th>Moneda original</th><th>MXN</th></tr></thead>' +
            '<tbody data-budget-rows>' + data.html + '</tbody></table></div>' +
            '<p class="tiny" data-budget-note>' + esc(data.note) + '</p>' +
            (range ? '<p class="budget-range"><strong>Rango estimado para planear:</strong> ' +
                pesos(range[0]) + '–' + pesos(range[1]) + ' MXN</p>' : '') +
            '</div>';
    }
    function mount(root, trip) {
        const host = root.querySelector('#budget-ledger');
        if (!host) return () => {};
        const refresh = () => {
            if (!host.isConnected) return;
            const next = rows(trip);
            host.querySelector('[data-budget-rows]').innerHTML = next.html;
            host.querySelector('[data-budget-note]').textContent = next.note;
        };
        const unsubscribe = selections.subscribe(tripId => { if (tripId === trip.id) refresh(); });
        return unsubscribe;
    }
    return { render, mount };
})();
