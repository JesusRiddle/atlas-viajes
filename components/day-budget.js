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
    const icons = {
        train: '<rect x="5" y="3" width="14" height="16" rx="3"/><path d="M5 10h14M8 15h2m4 0h2M8 21l2-2m6 2-2-2"/>',
        plane: '<path d="M22 16v-2l-8-5V3.5a2 2 0 0 0-4 0V9l-8 5v2l8-2.5V19l-2 1.5V22l4-1 4 1v-1.5L14 19v-5.5L22 16Z"/>',
        bus: '<rect x="4" y="3" width="16" height="16" rx="2"/><path d="M4 10h16M7 15h2m6 0h2M7 19v2m10-2v2"/>',
        lodging: '<rect x="3" y="10" width="18" height="9" rx="1"/><path d="M3 15h18M5 10V6h7v4M3 19v2m18-2v2"/>',
        activities: '<path d="M3 21h18M5 21V10l7-6 7 6v11M9 21v-7h6v7"/>',
        food: '<path d="M4 3v8m3-8v8m-6-8v5a5 5 0 0 0 10 0V3M6 13v8M17 21V3c-5 3-5 10 0 11h3"/>',
        localTransport: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 11h18M7 15h2m6 0h2"/>',
        other: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'
    };
    function categoryIcon(category, transportType) {
        const key = category === 'transport'
            ? ({ train:'train', flight:'plane', bus:'bus' }[transportType] || 'localTransport')
            : (icons[category] ? category : 'other');
        const labels = { train:'Tren', plane:'Vuelo', bus:'Autobús', lodging:'Hospedaje',
            activities:'Atracción', food:'Alimentación', localTransport:'Transporte local', other:'Otros gastos' };
        return '<span class="day-budget-category-icon" role="img" aria-label="' + labels[key] + '">' +
            '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
            icons[key] + '</svg></span>';
    }
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
            return '<div class="day-budget-line">' + categoryIcon(category, item?.type) +
                '<span class="day-budget-concept">' + esc(concept) +
                (status ? '<small class="day-budget-status">' + esc(status) + '</small>' : '') +
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
