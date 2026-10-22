// Presentación y actualización de los traslados referenciados desde cada jornada.
// Los horarios, alternativas y precios provienen de majorTransport; no se almacenan aquí.
window.AtlasDayTransport = (() => {
    'use strict';
    const esc = value => String(value ?? '').replace(/[&<>"']/g, char =>
        ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
    function transportSummary(t, d) {
        if (!d.transportRefs?.length) return '';
        const selections = window.AtlasSelections.get(t.id);
        return '<div class="day-transport" data-day-transport="' + esc(d.n) + '">' + d.transportRefs.map(id => {
                const item = t.majorTransport?.find(x => x.id === id);
                if (!item) return '';
                const current = selections[id] || {};
                const option = item.options.find(x => x.id === (current.option || item.selectedOption)) || item.options[0];
                const fare = option.fares.find(x => x.id === (current.fare || option.selectedFare)) || option.fares[0];
                const journeys = option.journeys.filter(j => j.direction === 'roundtrip' ||
                    j.segments.some(seg => seg.departure?.startsWith(d.date)));
                const hour = date => date ? date.slice(11, 16) : '—';
                const elapsed = (a, b) => {
                    const ms = Date.parse(b) - Date.parse(a);
                    if (!Number.isFinite(ms) || ms < 0) return null;
                    const minutes = Math.round(ms / 60000);
                    return Math.floor(minutes / 60) + ' h ' + String(minutes % 60).padStart(2, '0') + ' min';
                };
                // Comparar fechas calendario locales, no horas UTC: los husos horarios no cuentan como días extra.
                const arrivalOffset = (origin, arrival) => {
                    const start = origin?.slice(0, 10);
                    const end = arrival?.slice(0, 10);
                    if (!/^\d{4}-\d{2}-\d{2}$/.test(start || '') || !/^\d{4}-\d{2}-\d{2}$/.test(end || '')) return 0;
                    const days = Math.round((Date.parse(end + 'T00:00:00Z') - Date.parse(start + 'T00:00:00Z')) / 86400000);
                    return Number.isFinite(days) ? Math.max(0, days) : 0;
                };
                const flightTimeline = journey => {
                    const segments = journey.segments || [];
                    if (!segments.length) return '';
                    const originDate = segments[0].departure;
                    const rows = segments.map((seg, i) => {
                        const previous = segments[i - 1];
                        const layover = previous && elapsed(previous.arrival, seg.departure);
                        const stop = previous ? '<div class="flight-layover">Escala en ' + esc(seg.from) + (layover ? ' · ' + esc(layover) : ' · duración por confirmar') + '</div>' : '';
                        return stop + '<div class="flight-leg" aria-label="' + esc(seg.from + ' → ' + seg.to) + '"><span class="flight-route-label" hidden>' + esc(seg.from + ' → ' + seg.to) + '</span><div class="flight-endpoint"><strong>' + esc(hour(seg.departure)) + '</strong><span>' + esc(seg.from) + '</span></div>' +
                            '<div class="flight-leg-middle"><div class="flight-line"><span class="flight-line-duration">' + esc(elapsed(seg.departure, seg.arrival) || 'Duración pendiente') + '</span></div></div>' +
                            '<div class="flight-endpoint flight-endpoint-arrival"><strong>' + esc(hour(seg.arrival)) + (arrivalOffset(originDate, seg.arrival) ? '<sup class="flight-day-offset" aria-label="' + arrivalOffset(originDate, seg.arrival) + ' días después">+' + arrivalOffset(originDate, seg.arrival) + '</sup>' : '') + '</strong><span>' + esc(seg.to) + '</span></div></div>';
                    }).join('');
                    const total = elapsed(segments[0].departure, segments[segments.length - 1].arrival);
                    const stops = segments.length - 1;
                    return '<div class="flight-timeline" aria-label="Itinerario aéreo">' + rows +
                        '<div class="flight-summary"><span><strong>Duración total</strong> ' + esc(total || 'Por confirmar') + '</span><span><strong>Escalas</strong> ' + stops + '</span><span><strong>Llegada</strong> ' + esc(hour(segments[segments.length - 1].arrival)) + '</span></div></div>';
                };
                const routes = item.type === 'flight' ? journeys.map(flightTimeline).join('') : journeys.map(j =>
                    j.segments.map(seg => '<div class="day-transport-route">' + esc(seg.from + ' → ' + seg.to) +
                        (hour(seg.departure) !== '—' ? ' · ' + esc(hour(seg.departure)) : '') +
                        (hour(seg.arrival) !== '—' ? '–' + esc(hour(seg.arrival)) : '') +
                        (seg.service ? ' · ' + esc(seg.service) : '') + '</div>').join('')
                ).join('');
                const price = window.AtlasBudget.selectedTransportPrice(item, current);
                const mxn = window.AtlasBudget.convert(price, t.exchangeRates || {});
                const amount = price && Number.isFinite(price.amount)
                    ? (price.currency === 'EUR' ? '€' : '$') + price.amount.toLocaleString('es-MX', { maximumFractionDigits: 2 }) +
                        (price.currency === 'MXN' ? ' MXN' : '') : 'Por cotizar';
                const icons = { flight: '✈', train: '🚆', bus: '🚌', ferry: '⛴' };
                return '<div class="day-transport-item"><div class="day-transport-head"><strong><span class="day-transport-kind" aria-hidden="true">' + (icons[item.type] || '➜') + '</span>' + esc(item.title) +
                    '</strong><span>' + esc(amount) + (mxn != null && price.currency !== 'MXN' ? ' · ≈ $' +
                    mxn.toLocaleString('es-MX', { maximumFractionDigits: 2 }) + ' MXN' : '') +
                    '</span></div>' + (item.type === 'flight' ? '<small class="flight-fare">' + (option.provider ? esc(option.provider) + ' · ' : '') + esc(fare.name || fare.id) + ' · Precio ida y vuelta</small>' : '') + (routes || '<div class="day-transport-route">Horario pendiente de confirmar</div>') +
                    (item.type === 'flight' ? '' : '<small>' + (option.provider ? esc(option.provider) + ' · ' : '') +
                    esc(fare.name || fare.id) + '</small>') + '</div>';
            }).join('') + '</div>';
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
