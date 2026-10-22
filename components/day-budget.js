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
            const concept = item?.concept || item?.title || names[category];
            const status = item?.status === 'estimated' ? 'estimado' : item?.status === 'quoted' ? 'cotizado' : '';
            return '<div class="day-budget-line"><span class="day-budget-concept">' + esc(concept) +
                (status ? '<small class="day-budget-status"> · ' + esc(status) + '</small>' : '') +
                '</span><strong>' + (entry.mxn === null ? 'Por cotizar' : pesos(entry.mxn)) + '</strong></div>';
        }).join('');
        const hasAmounts = info.entries.some(entry => entry.mxn !== null);
        const registered = new Set((trip.expenses || []).filter(item =>
            info.entries.some(entry => entry.id === item.id)).map(item => item.category));
        const pendingCategories = [
            !registered.has('food') ? 'comidas' : null,
            !registered.has('localTransport') ? 'movilidad urbana' : null,
            'otros gastos que aún no estén registrados'
        ].filter(Boolean).join(', ');
        const flightOutside = (day.transportRefs || []).some(id => {
            const transport = transports.get(id);
            return transport?.type === 'flight' && !info.entries.some(entry => entry.id === id);
        });
        return '<details class="day-budget atlas-day-fold" open data-day-budget="' + esc(day.n) +
            '" aria-label="Presupuesto de la jornada"><summary class="day-budget-heading"><span class="day-budget-symbol" aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="15" rx="2"/><path d="M3 10h18M7 15h4"/></svg></span><div class="day-budget-title"><h4>Gastos registrados del día</h4>' +
            '</div><strong>' +
            (hasAmounts ? pesos(info.totalMXN) : 'Sin partidas cotizadas') +
            '</strong></summary>' + '<div class="day-budget-rows atlas-info-rows">' + (lines || '<p class="day-budget-empty">Todavía no hay partidas asignadas.</p>') + '</div>' +
            (info.partial ? '<p class="day-budget-pending">Hay partidas sin cotizar.</p>' : '') +
            '<p class="day-budget-disclaimer">Presupuesto diario incompleto: pendiente de registrar o verificar ' +
            esc(pendingCategories) + '.' +
            (flightOutside ? ' El vuelo se contabiliza en el presupuesto global, no en este día.' : '') +
            '</p></details>';
    }
    function mount(root, trip) {
        if (!trip?.majorTransport?.length) return () => {};
        return window.AtlasSelections.subscribe(id => {
            if (id !== trip.id || !root.isConnected) return;
            for (const day of trip.days) {
                const node = root.querySelector('[data-day-budget="' + day.n + '"]');
                if (node) { const expanded = node.open; node.outerHTML = render(trip, day); const replacement = root.querySelector('[data-day-budget="' + day.n + '"]'); if (replacement) replacement.open = expanded; }
            }
        });
    }
    return { render, mount };
})();
