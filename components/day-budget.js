// Desglose diario derivado exclusivamente de AtlasBudget.byDay.
window.AtlasDayBudget = (() => {
    'use strict';
    const esc = value => String(value ?? '').replace(/[&<>"']/g, char =>
        ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
    const pesos = value => '$' + Number(value).toLocaleString('es-MX', {
        minimumFractionDigits: 2, maximumFractionDigits: 2
    });
    const names = { transport: 'Traslado principal', lodging: 'Alojamiento', activities: 'Entradas y actividades',
        food: 'Alimentación', other: 'Otros gastos' };
    function render(trip, day) {
        if (!trip?.majorTransport?.length) return '';
        const budget = window.AtlasBudget.currentSummary(trip);
        const info = budget.byDay[day.date];
        if (!info) return '';
        const transports = new Map((trip.majorTransport || []).map(item => [item.id, item]));
        const expenses = new Map((trip.expenses || []).map(item => [item.id, item]));
        const lines = info.entries.map(entry => {
            const item = transports.get(entry.id) || expenses.get(entry.id);
            const category = transports.has(entry.id) ? 'transport' : (item?.category || 'other');
            const label = item?.concept || item?.title || names[category];
            return '<div class="day-budget-line"><span>' + esc(label) + '</span><strong>' +
                (entry.mxn === null ? 'Por cotizar' : pesos(entry.mxn)) + '</strong></div>';
        }).join('');
        return '<section class="day-budget" data-day-budget="' + esc(day.n) +
            '" aria-label="Presupuesto de la jornada"><div class="day-budget-heading"><div><h4>Gastos registrados del día</h4>' +
            '<small>Importes asignados a esta jornada</small></div><strong>' + pesos(info.totalMXN) +
            '</strong></div>' + (lines || '<p class="day-budget-empty">Todavía no hay partidas asignadas.</p>') +
            (info.partial ? '<p class="day-budget-pending">Hay partidas sin cotizar.</p>' : '') +
            '<p class="day-budget-disclaimer">Subtotal parcial: no incluye comidas, movilidad urbana ni otros gastos aún sin registrar.' +
            (day.transportRefs?.includes('flight-international') ? ' El vuelo redondo se contabiliza únicamente en el total del viaje.' : '') +
            '</p></section>';
    }
    function mount(root, trip) {
        if (!trip?.majorTransport?.length) return () => {};
        return window.AtlasSelections.subscribe(id => {
            if (id !== trip.id || !root.isConnected) return;
            for (const day of trip.days) {
                const node = root.querySelector('[data-day-budget="' + day.n + '"]');
                if (node) node.outerHTML = render(trip, day);
            }
        });
    }
    return { render, mount };
})();
