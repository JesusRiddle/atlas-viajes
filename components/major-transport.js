// Vista editorial de grandes traslados. Consume datos y selecciones; no los persiste.
window.AtlasMajorTransport = (() => {
    'use strict';
    const model = window.AtlasTransportModel;
    const budget = window.AtlasBudget;
    const selections = window.AtlasSelections;
    const esc = value => String(value ?? '').replace(/[&<>"']/g, char =>
        ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
    const number = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 2 });
    const formatMoney = cost => {
        if (!cost || !Number.isFinite(cost.amount)) return 'Por cotizar';
        const amount = cost.amount.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        return cost.currency === 'EUR' ? '€' + amount :
            cost.currency === 'MXN' ? String.fromCharCode(36) + number.format(cost.amount) + ' MXN' :
            amount + ' ' + cost.currency;
    };
    const journeyDate = (journey, trip) => {
        const departure = journey.segments?.[0]?.departure;
        const day = departure?.slice(0, 10) ||
            (journey.direction === 'outbound' ? trip.start : journey.direction === 'return' ? trip.end : null);
        if (!day) return '';
        const parsed = new Date(day + 'T12:00:00Z');
        return ' · ' + new Intl.DateTimeFormat('es-MX', {
            day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'
        }).format(parsed);
    };
    const minutes = value => Number.isFinite(value) ? Math.floor(value / 60) + ' h ' +
        String(value % 60).padStart(2, '0') + ' min' : 'Por confirmar';
    const clock = value => typeof value === 'string' && value.includes('T')
        ? value.split('T')[1].slice(0, 5) : '—';
    function baggageLabel(baggage) {
        if (!baggage || Object.values(baggage).every(v => v == null)) return 'Equipaje por confirmar';
        const names = [['personalItem', 'Personal'], ['cabin', 'Mano'], ['checked', 'Documentado']];
        return names.map(([key, label]) => {
            const item = baggage[key];
            if (item == null) return null;
            if (item.pieces === 0) return label + ': no incluido';
            return label + ': ' + (item.pieces == null ? '?' : item.pieces + ' pieza(s)') +
                (item.weightKg != null ? ' · ' + item.weightKg + ' kg' : '');
        }).filter(Boolean).join(' · ') || 'Equipaje por confirmar';
    }
    function journeyLabel(journey) {
        const summary = model.journeySummary(journey);
        const first = journey.segments[0], last = journey.segments.at(-1);
        const roundtrip = journey.direction === 'roundtrip';
        if (roundtrip) {
            return '<div class="mt-journey"><strong>Ida y vuelta · ' +
                journey.segments.length + ' trayectos</strong><span>Horarios cotizados · sujetos a confirmación</span></div>';
        }
        const direction = journey.direction === 'return' ? 'Regreso' :
            journey.direction === 'outbound' ? 'Ida' : 'Trayecto';
        return '<div class="mt-journey"><strong>' + esc(direction) + ': ' + esc(summary.from) +
            ' → ' + esc(summary.to) + '</strong><span>' +
            esc(clock(first?.departure)) + ' – ' + esc(clock(last?.arrival)) +
            ' · ' + minutes(summary.durationMinutes) + ' · ' + summary.stops +
            (summary.stops === 1 ? ' escala' : ' escalas') +
            (summary.connectionPoints.length ? ' (' + esc(summary.connectionPoints.join(', ')) + ')' : '') +
            '</span></div>';
    }
        const airportNames = {
        MEX: 'Ciudad de México',
        MAD: 'Madrid-Barajas',
        MXP: 'Milano Malpensa',
        BLQ: 'Bologna Marconi'
    };
    const airportLabel = code => {
        const name = airportNames[code];
        if (!name) return esc(code);
        const city = code === 'MEX' ? 'Ciudad de México' :
            code === 'MAD' ? 'Madrid' : code === 'MXP' ? 'Milano' : code === 'BLQ' ? 'Bologna' : '';
        const highlighted = city && name.startsWith(city)
            ? '<strong>' + esc(city) + '</strong>' + esc(name.slice(city.length))
            : esc(name);
        return esc(code) + ' (' + highlighted + ')';
    };
    function segmentDetails(journey, isFlight = false) {
        const segments = journey.segments || [];
        return segments.map((seg, i) => {
            const connection = i && segments[i - 1].arrival && seg.departure
                ? '<p class="mt-connection">' + (journey.direction === 'roundtrip' && !isFlight ? 'Tiempo en destino: ' : 'Escala: ') +
                    minutes(model.durationMinutes(segments[i - 1].arrival, seg.departure)) + '</p>' : '';
            const route = isFlight ? airportLabel(seg.from) + ' → ' + airportLabel(seg.to)
                : '<strong>' + esc(seg.from) + '</strong> → <strong>' + esc(seg.to) + '</strong>';
            const duration = esc(clock(seg.departure)) + ' – ' + esc(clock(seg.arrival)) +
                ' · ' + minutes(model.durationMinutes(seg.departure, seg.arrival));
            const details = isFlight
                ? '<span class="mt-flight-meta">' +
                    (seg.operator ? '<strong>' + esc(seg.operator) + '</strong>' : '') +
                    (seg.flightNumber ? '<span>' + esc(seg.flightNumber) + '</span>' : '') +
                    '<span>' + duration + '</span></span>'
                : '<span class="mt-train-meta">' +
                    (seg.operator ? '<strong>' + esc(seg.operator) + '</strong>' : '') +
                    (seg.flightNumber ? '<span>' + esc(seg.flightNumber) + '</span>' : '') +
                    '<span>' + duration + '</span></span>';
            return connection + '<div class="mt-segment' + (isFlight ? ' mt-flight-segment' : '') +
                '"><span class="mt-segment-route">' + route + '</span>' + details + '</div>';
        }).join('');
    }
    // Reutiliza las clases de la cronología diaria para una presentación coherente.
    // La fecha local del primer segmento es la referencia para +1, +2, etc.
    function flightJourneyTimeline(journey) {
        const segments = journey.segments || [];
        if (!segments.length) return '';
        const origin = segments[0].departure?.slice(0, 10);
        const offset = arrival => {
            const target = arrival?.slice(0, 10);
            if (!/^\d{4}-\d{2}-\d{2}$/.test(origin || '') || !/^\d{4}-\d{2}-\d{2}$/.test(target || '')) return 0;
            return Math.max(0, Math.round((Date.parse(target + 'T00:00:00Z') - Date.parse(origin + 'T00:00:00Z')) / 86400000));
        };
        const parts = segments.map((segment, index) => {
            const previous = segments[index - 1];
            const wait = previous ? model.durationMinutes(previous.arrival, segment.departure) : null;
            const connection = previous ? '<div class="flight-layover">Escala en ' + esc(segment.from) +
                ' · ' + minutes(wait) + '</div>' : '';
            const nextDay = offset(segment.arrival);
            const badge = nextDay ? '<sup class="flight-day-offset" aria-label="' + nextDay + ' días después">+' + nextDay + '</sup>' : '';
            return connection + '<div class="flight-leg" aria-label="' + esc(segment.from + ' → ' + segment.to) + '">' +
                '<div class="flight-endpoint"><strong>' + esc(clock(segment.departure)) + '</strong><span>' + esc(segment.from) + '</span><small class="mt-airport-name">' + esc(airportNames[segment.from] || segment.from) + '</small></div>' +
                '<div class="flight-leg-middle"><div class="flight-line"><span class="flight-line-duration">' +
                esc(minutes(model.durationMinutes(segment.departure, segment.arrival))) +
                (segment.flightNumber ? ' <span class="mt-flight-number">· ' + esc(segment.flightNumber) + '</span>' : '') +
                '</span></div></div>' +
                '<div class="flight-endpoint flight-endpoint-arrival"><strong>' + esc(clock(segment.arrival)) + badge +
                '</strong><span>' + esc(segment.to) + '</span><small class="mt-airport-name">' + esc(airportNames[segment.to] || segment.to) + '</small></div></div>';
        }).join('');
        return '<div class="flight-timeline mt-flight-timeline">' + parts + '</div>';
    }
    function trainJourneyTimeline(journey) {
        const segments = journey.segments || [];
        if (!segments.length) return '';
        const roundtrip = journey.direction === 'roundtrip';
        const rows = segments.map((segment, index) => {
            const direction = roundtrip ? (index === 0 ? 'Ida' : index === segments.length - 1 ? 'Regreso' : 'Trayecto ' + (index + 1)) : '';
            const label = direction ? '<div class="mt-train-direction">' + esc(direction) + '</div>' : '';
            return label + '<div class="flight-leg mt-train-leg" aria-label="' + esc(segment.from + ' → ' + segment.to) + '">' +
                '<div class="flight-endpoint"><strong>' + esc(clock(segment.departure)) + '</strong><span class="mt-station-name">' + esc(segment.from) + '</span></div>' +
                '<div class="flight-leg-middle"><div class="flight-line"><span class="flight-line-duration">' +
                esc(minutes(model.durationMinutes(segment.departure, segment.arrival))) +
                (segment.service ? ' <span class="mt-flight-number">· ' + esc(segment.service) + '</span>' : '') +
                '</span></div></div>' +
                '<div class="flight-endpoint flight-endpoint-arrival"><strong>' + esc(clock(segment.arrival)) +
                '</strong><span class="mt-station-name">' + esc(segment.to) + '</span></div></div>';
        }).join('');
        return '<div class="flight-timeline mt-train-timeline">' + rows + '</div>';
    }
    function transportKind(type) {
        const shapes = {
            flight: '<path d="M22 16v-2l-8-5V3.5a2 2 0 0 0-4 0V9l-8 5v2l8-2.5V19l-2 1.5V22l4-1 4 1v-1.5L14 19v-5.5L22 16Z"/>',
            train: '<rect x="5" y="3" width="14" height="15" rx="3"/><path d="M5 10h14M8 14h2m4 0h2M8 21l2-3m6 3-2-3"/>',
            bus: '<rect x="4" y="3" width="16" height="16" rx="2"/><path d="M4 10h16M7 15h2m6 0h2M7 19v2m10-2v2"/>',
            ferry: '<path d="M3 16 6 9h12l3 7-9 5-9-5ZM9 9V5h6v4M2 22c2-1 3-1 5 0s3 1 5 0 3-1 5 0 3 1 5 0"/>',
            default: '<path d="M3 17h18M5 17l3-7h8l3 7M8 10V7h8v3"/><circle cx="8" cy="19" r="1"/><circle cx="16" cy="19" r="1"/>'
        };
        const labels = { flight: 'Vuelo', train: 'Tren', bus: 'Bus', ferry: 'Ferry' };
        const svg = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
            (shapes[type] || shapes.default) + '</svg>';
        return '<span class="mt-kind-inner">' + svg + '<span>' + (labels[type] || 'Traslado') + '</span></span>';
    }
    function card(trip, transport, current) {
        const selection = current[transport.id] || {};
        const optionId = selection.option || transport.selectedOption;
        const option = transport.options.find(o => o.id === optionId) || transport.options[0];
        const fareId = selection.fare || option.selectedFare;
        const fare = option.fares.find(f => f.id === fareId) || option.fares[0];
        const price = budget.selectedTransportPrice(transport, { option: option.id, fare: fare.id });
        const converted = budget.convert(price, trip.exchangeRates || {});

        const summary = option.journeys.map(journeyLabel).join('');
        const options = transport.options.map(o => '<option value="' + esc(o.id) + '"' +
            (o.id === option.id ? ' selected' : '') + '>Opción ' + esc(o.id) +
            (o.provider ? ' · ' + esc(o.provider) : '') + '</option>').join('');
        const fares = option.fares.map(f => '<option value="' + esc(f.id) + '"' +
            (f.id === fare.id ? ' selected' : '') + '>' + esc(f.name || f.id) +
            ' · ' + esc(formatMoney(f.price)) + '</option>').join('');
        const detail = option.journeys.map(j => {
            const departureDate = j.segments?.[0]?.departure?.slice(0, 10);
            const startDate = trip.start?.slice(0, 10);
            const dateNumber = date => Date.parse(date + 'T00:00:00Z');
            const index = departureDate && startDate
                ? Math.round((dateNumber(departureDate) - dateNumber(startDate)) / 86400000) + 1 : transport.day;
            const dayLabel = Number.isFinite(index) && index > 0 ? 'Día ' + String(index).padStart(2, '0') + ' · ' : '';
            const direction = j.direction === 'outbound' ? 'Ida' : j.direction === 'return' ? 'Regreso' : '';
            return '<div class="mt-legs">' +
                '<h4 class="mt-leg-heading' + ((transport.type === 'flight' || transport.type === 'train') ? ' mt-flight-heading' : '') + '"><span class="mt-flight-heading-title">' + esc(dayLabel) +
                (direction ? esc(direction) + esc(journeyDate(j, trip)) :
                    esc(journeyDate(j, trip).replace(/^ · /, ''))) + '</span>' +
                ((transport.type === 'flight' || transport.type === 'train') && j.segments?.length ? (() => {
                    const info = model.journeySummary(j);
                    return '<span class="mt-flight-heading-stats"><span><b>Duración total</b> ' + esc(minutes(info.durationMinutes)) +
                        '</span><span><b>Escalas</b> ' + info.stops + '</span><span><b>Llegada</b> ' +
                        esc(clock(j.segments[j.segments.length - 1].arrival)) + '</span></span>';
                })() : '') + '</h4>' +
                (transport.type === 'flight' ? flightJourneyTimeline(j) : transport.type === 'train' ? trainJourneyTimeline(j) : segmentDetails(j, false)) + '</div>';
        }).join('');
        return '<details class="mt-card" data-transport="' + esc(transport.id) + '">' +
            '<summary><span class="mt-kind">' + transportKind(transport.previewType || transport.type) + '</span>' +
            '<span class="mt-route"><strong>' + esc(transport.title) + '</strong><small>' +
            (transport.type === 'train' ? (transport.day ? 'Día ' + transport.day : '') : esc(option.provider || '') + (transport.day ? ' · Día ' + transport.day : '')) + '</small></span>' +
            '<span class="mt-inline">' + summary + '</span>' +
            '<span class="mt-price"><strong>' + esc(formatMoney(price)) + '</strong><small>' +
            (converted === null ? 'MXN pendiente de conversión' :
                '≈ $' + number.format(converted) + ' MXN') + '</small></span>' +
            '<span class="mt-chevron" aria-hidden="true">⌄</span></summary>' +
            '<div class="mt-details"><div class="mt-selectors">' +
            '<label>Alternativa<select data-field="option" aria-label="Alternativa para ' +
            esc(transport.title) + '">' + options + '</select></label>' +
            '<label>Tarifa<select data-field="fare" aria-label="Tarifa para ' +
            esc(transport.title) + '">' + fares + '</select></label></div>' +
            (transport.type === 'flight' ? '<p class="mt-baggage">' +
                esc(baggageLabel(fare.baggage)) + '</p>' : '') +
            '<div class="mt-leg-list' + ((transport.type === 'flight' || transport.type === 'train') ? ' mt-flight-list' : '') + '">' + detail + '</div>' +
            '<div class="mt-terms"><span><strong>Cambios:</strong> ' + esc(fare.changes || 'Por confirmar') +
            '</span><span><strong>Reembolsos:</strong> ' + esc(fare.refunds || 'Por confirmar') +
            '</span></div>' +
            (option.notes ? '<p class="mt-note">' + esc(option.notes) + '</p>' : '') +
            (transport.links?.length ? '<div class="entity-links">' + transport.links.map(link => '<a href="' + esc(link.url) + '" target="_blank" rel="noopener noreferrer">' + esc(link.label) + '</a>').join('') + '</div>' : '') +
            '</div></details>';
    }
    function render(trip) {
        if (!trip.majorTransport?.length) return '';
        const current = selections.get(trip.id);
        return '<section class="major-transport" id="traslados" aria-label="Traslados principales">' +
            '<div class="mt-heading"><span class="mt-kicker mt-kicker-icon"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="3" width="14" height="15" rx="3"/><path d="M5 10h14M8 14h2m4 0h2M8 21l2-3m6 3-2-3"/></svg> Movilidad y conexiones</span>' +
            '<h2>Traslados principales.</h2><p>Compara las alternativas, tarifas y condiciones de tus vuelos y trenes.</p></div>' +
            '<div class="mt-list">' + trip.majorTransport.map(item => card(trip, item, current)).join('') + '</div>' +
            '<p class="mt-footnote">Cotizaciones de referencia, no reservas confirmadas. Las elecciones son temporales y no modifican el itinerario guardado.</p>' +
            (trip.ticketNotes?.length ? '<details class="mt-tickets"><summary>Billetes y flexibilidad</summary>' +
                '<ul>' + trip.ticketNotes.map(([name, note]) => '<li><strong>' + esc(name) +
                ':</strong> ' + esc(note) + '</li>').join('') + '</ul></details>' : '') +
            '</section>';
    }
    function mount(root, trip) {
        let host = root.querySelector('#traslados');
        if (!host) return () => {};
        function refresh() {
            if (!host.isConnected) return;
            const active = document.activeElement;
            const focusedCard = active?.closest?.('.mt-card');
            const focusedId = focusedCard?.dataset.transport;
            const focusedField = active?.dataset?.field;
            const previous = [...host.querySelectorAll('.mt-card[open]')].map(x => x.dataset.transport);
            const frame = document.createElement('div');
            frame.innerHTML = render(trip);
            const next = frame.firstElementChild;
            for (const id of previous) {
                const element = [...next.querySelectorAll('.mt-card')].find(x => x.dataset.transport === id);
                if (element) element.open = true;
            }
            const ticket = host.querySelector('.mt-tickets');
            if (ticket?.open) next.querySelector('.mt-tickets').open = true;
            host.removeEventListener('change', change);
            host.replaceWith(next);
            host = next;
            host.addEventListener('change', change);
            if (focusedId && focusedField) {
                const matchingCard = [...next.querySelectorAll('.mt-card')].find(item => item.dataset.transport === focusedId);
                matchingCard?.querySelector('select[data-field="' + focusedField + '"]')?.focus({ preventScroll: true });
            }
        }
        const change = e => {
            const select = e.target.closest('select[data-field]');
            if (!select) return;
            const item = select.closest('.mt-card');
            const transport = trip.majorTransport.find(t => t.id === item?.dataset.transport);
            if (!transport) return;
            const current = selections.get(trip.id)[transport.id] || {};
            const optionId = select.dataset.field === 'option' ? select.value : (current.option || transport.selectedOption);
            const option = transport.options.find(o => o.id === optionId);
            const fareId = select.dataset.field === 'fare' ? select.value : option.selectedFare;
            selections.set(trip, transport.id, optionId, fareId);
        };
        host.addEventListener('change', change);
        const unsubscribe = selections.subscribe(tripId => { if (tripId === trip.id && root.isConnected) refresh(); });
        return () => { host.removeEventListener('change', change); unsubscribe(); };
    }
    return { render, mount };
})();
