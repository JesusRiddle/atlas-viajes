// Presentación y actualización de los traslados referenciados desde cada jornada.
// Los horarios, alternativas y precios provienen de majorTransport; no se almacenan aquí.
window.AtlasDayTransport = (() => {
    'use strict';
    const esc = value => String(value ?? '').replace(/[&<>"']/g, char =>
        ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
    function transportSummary(t, d) {
        if (!d.transportRefs?.length) return '';
        const selections = window.AtlasSelections.get(t.id);
        return '<section class="day-transport" data-day-transport="' + esc(d.n) + '">' +
            '<h4>Traslados vinculados</h4>' + d.transportRefs.map(id => {
                const item = t.majorTransport?.find(x => x.id === id);
                if (!item) return '';
                const current = selections[id] || {};
                const option = item.options.find(x => x.id === (current.option || item.selectedOption)) || item.options[0];
                const fare = option.fares.find(x => x.id === (current.fare || option.selectedFare)) || option.fares[0];
                const journeys = option.journeys.filter(j => j.direction === 'roundtrip' ||
                    j.segments.some(seg => seg.departure?.startsWith(d.date)));
                const routes = journeys.map(j => {
                    const hour = date => date ? date.slice(11, 16) : '';
                    return j.segments.map(seg =>
                        '<div class="day-transport-route">' + esc(seg.from + ' → ' + seg.to) +
                        (hour(seg.departure) ? ' · ' + esc(hour(seg.departure)) : '') +
                        (hour(seg.arrival) ? '–' + esc(hour(seg.arrival)) : '') + '</div>'
                    ).join('');
                }).join('');
                const price = window.AtlasBudget.selectedTransportPrice(item, current);
                const mxn = window.AtlasBudget.convert(price, t.exchangeRates || {});
                const amount = price && Number.isFinite(price.amount)
                    ? (price.currency === 'EUR' ? '€' : '$') + price.amount.toLocaleString('es-MX', { maximumFractionDigits: 2 }) +
                        (price.currency === 'MXN' ? ' MXN' : '') : 'Por cotizar';
                return '<div class="day-transport-item"><div class="day-transport-head"><strong>' + esc(item.title) +
                    '</strong><span>' + esc(amount) + (mxn != null && price.currency !== 'MXN' ? ' · ≈ $' +
                    mxn.toLocaleString('es-MX', { maximumFractionDigits: 2 }) + ' MXN' : '') +
                    '</span></div>' + routes + '<small>' + esc(option.provider || '') + ' · ' +
                    esc(fare.name || fare.id) + '</small></div>';
            }).join('') + '<p>Referencia del traslado completo, ya contabilizada en el presupuesto.</p></section>';
    }
    function mountTransport(root, trip) {
        if (!trip.majorTransport?.length) return () => {};
        return window.AtlasSelections.subscribe(id => {
            if (id !== trip.id || !root.isConnected) return;
            for (const d of trip.days.filter(day => day.transportRefs?.length)) {
                const node = root.querySelector('[data-day-transport="' + d.n + '"]');
                if (node) node.outerHTML = transportSummary(trip, d);
            }
        });
    }
    return { render: transportSummary, mount: mountTransport };
})();
