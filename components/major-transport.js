// Vista editorial de grandes traslados. Consume datos y selecciones; no los persiste.
window.AtlasMajorTransport = (() => {
    'use strict';
    const model = window.AtlasTransportModel;
    const budget = window.AtlasBudget;
    const selections = window.AtlasSelections;
    const esc = value => String(value ?? '').replace(/[&<>"']/g, char =>
        ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
    const number = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 2 });
    const formatMoney = cost => cost && Number.isFinite(cost.amount)
        ? number.format(cost.amount) + ' ' + cost.currency : 'Por cotizar';
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
        const s = model.journeySummary(journey);
        const first = journey.segments[0], last = journey.segments.at(-1);
        const direction = journey.direction === 'return' ? 'Regreso' :
            journey.direction === 'outbound' ? 'Ida' : journey.direction === 'roundtrip' ? 'Ida y vuelta' : 'Trayecto';
        const roundtrip = journey.direction === 'roundtrip';
        return '<div class="mt-journey"><strong>' + esc(direction) + ': ' + esc(s.from) +
            (roundtrip ? ' ↔ ' : ' → ') + esc(roundtrip ? journey.segments[0]?.to : s.to) +
            '</strong><span>' + (roundtrip ? journey.segments.length + ' trayectos · horarios por confirmar'
                : esc(clock(first?.departure)) + ' – ' + esc(clock(last?.arrival)) +
                  ' · ' + minutes(s.durationMinutes) + ' · ' + s.stops +
                  (s.stops === 1 ? ' escala' : ' escalas') +
                  (s.connectionPoints.length ? ' (' + esc(s.connectionPoints.join(', ')) + ')' : '')) +
            '</span></div>';
    }
    function segmentDetails(journey) {
        const segments = journey.segments || [];
        return segments.map((seg, i) => {
            const connection = i && segments[i - 1].arrival && seg.departure
                ? '<p class="mt-connection">Escala: ' +
                    minutes(model.durationMinutes(segments[i - 1].arrival, seg.departure)) + '</p>' : '';
            return connection + '<div class="mt-segment"><span>' + esc(seg.from) + ' → ' + esc(seg.to) +
                '</span><small>' + esc(clock(seg.departure)) + ' – ' + esc(clock(seg.arrival)) +
                ' · ' + minutes(model.durationMinutes(seg.departure, seg.arrival)) +
                (seg.operator ? ' · ' + esc(seg.operator) : '') +
                (seg.flightNumber ? ' · ' + esc(seg.flightNumber) : '') + '</small></div>';
        }).join('');
    }
    function card(trip, transport, current) {
        const selection = current[transport.id] || {};
        const optionId = selection.option || transport.selectedOption;
        const option = transport.options.find(o => o.id === optionId) || transport.options[0];
        const fareId = selection.fare || option.selectedFare;
        const fare = option.fares.find(f => f.id === fareId) || option.fares[0];
        const price = budget.selectedTransportPrice(transport, { option: option.id, fare: fare.id });
        const converted = budget.convert(price, trip.exchangeRates || {});
        const label = transport.type === 'flight' ? 'Vuelo' : transport.type === 'train' ? 'Tren' : 'Traslado';
        const summary = option.journeys.map(journeyLabel).join('');
        const options = transport.options.map(o => '<option value="' + esc(o.id) + '"' +
            (o.id === option.id ? ' selected' : '') + '>Opción ' + esc(o.id) +
            (o.provider ? ' · ' + esc(o.provider) : '') + '</option>').join('');
        const fares = option.fares.map(f => '<option value="' + esc(f.id) + '"' +
            (f.id === fare.id ? ' selected' : '') + '>' + esc(f.name || f.id) +
            ' · ' + esc(formatMoney(f.price)) + '</option>').join('');
        const detail = option.journeys.map(j => '<div class="mt-legs">' + segmentDetails(j) + '</div>').join('');
        return '<details class="mt-card" data-transport="' + esc(transport.id) + '">' +
            '<summary><span class="mt-kind">' + esc(label) + '</span>' +
            '<span class="mt-route"><strong>' + esc(transport.title) + '</strong><small>' +
            esc(option.provider || '') + (transport.day ? ' · Día ' + transport.day : '') + '</small></span>' +
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
            '<p class="mt-baggage">' + esc(transport.type === 'flight' ? baggageLabel(fare.baggage) :
            'Condiciones de billete sujetas a la tarifa elegida') + '</p>' +
            '<div class="mt-leg-list">' + detail + '</div>' +
            '<div class="mt-terms"><span><strong>Cambios:</strong> ' + esc(fare.changes || 'Por confirmar') +
            '</span><span><strong>Reembolsos:</strong> ' + esc(fare.refunds || 'Por confirmar') +
            '</span></div>' +
            (option.notes ? '<p class="mt-note">' + esc(option.notes) + '</p>' : '') +
            '</div></details>';
    }
    function render(trip) {
        if (!trip.majorTransport?.length) return '';
        const current = selections.get(trip.id);
        return '<section class="major-transport" id="traslados" aria-label="Traslados principales">' +
            '<div class="mt-heading"><span class="mt-kicker">Movilidad y conexiones</span>' +
            '<h2>Traslados principales.</h2><p>Compara las alternativas, tarifas y condiciones de tus vuelos y trenes.</p></div>' +
            '<div class="mt-list">' + trip.majorTransport.map(item => card(trip, item, current)).join('') + '</div>' +
            '<p class="mt-footnote">Cotizaciones de referencia, no reservas confirmadas. Las elecciones son temporales y no modifican el itinerario guardado.</p>' +
            '<p class="mt-total" aria-live="polite"></p>' +
            (trip.ticketNotes?.length ? '<details class="mt-tickets"><summary>Billetes y flexibilidad</summary>' +
                '<ul>' + trip.ticketNotes.map(([name, note]) => '<li><strong>' + esc(name) +
                ':</strong> ' + esc(note) + '</li>').join('') + '</ul></details>' : '') +
            '</section>';
    }
    function mount(root, trip) {
        const host = root.querySelector('#traslados');
        if (!host) return () => {};
        function refresh() {
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
            host.replaceWith(next);
            updateTotal(next);
        }
        function updateTotal(element) {
            const result = budget.currentSummary(trip);
            const node = element.querySelector('.mt-total');
            node.textContent = 'Subtotal estructurado conocido: $' + number.format(result.knownTotalMXN) +
                ' MXN · ' + (result.partial ? 'Presupuesto parcial; faltan partidas o conversiones.' : 'Partidas completas.');
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
        root.addEventListener('change', change);
        const unsubscribe = selections.subscribe(tripId => { if (tripId === trip.id && root.isConnected) refresh(); });
        updateTotal(host);
        return () => { root.removeEventListener('change', change); unsubscribe(); };
    }
    return { render, mount };
})();
