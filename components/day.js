window.AtlasDay = function (ctx) {
    'use strict';
    const { trips, places, photos, esc, money, long, readable, formatDayTitle } = ctx;
    const img = (key, cls = '', eager = false, deferred = false, decorative = false) => `<img ${deferred ? 'data-src' : 'src'}="${esc(photos[key].src)}" alt="${decorative ? '' : esc(places[key].name)}" class="${cls}" ${eager ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
    function caption(key, optional = false) { const p = places[key], a = photos[key], trip = trips.find(t => t.id === location.hash.split('/')[1]); return `<figcaption>${optional ? '<span class="photo-option">Opción del día</span>' : ''}<strong>${esc(p.name)}</strong><p>${esc(trip?.placeDescriptions?.[key] || '')}</p><div class="credit">Foto: ${esc(a.attribution)} · <a href="${esc(a.source)}" target="_blank" rel="noopener">${esc(a.license)}</a></div></figcaption>`; }
    function figure(key, optional = false, deferred = false) { return `<figure><button type="button" class="photo-open" aria-label="Ampliar foto: ${esc(places[key].name)}">${img(key, '', false, deferred)}<span class="photo-zoom" aria-hidden="true">Ampliar ↗</span></button>${caption(key, optional)}</figure>`; }
    function hotelForDay(t, d) {
        if (!d.hotel) return null;
        return t.hotels?.find(hotel => hotel.id === d.hotel) || null;
    }
    function nightHotel(t, d) {
        const hotel = hotelForDay(t, d);
        return hotel ? `<p class="night-hotel"><strong>Hospedaje:</strong> ${esc(hotel.name)} · ${esc(hotel.city)}</p>` : '';
    }
    function hotelCheckIn(t, d) {
        const hotel = hotelForDay(t, d);
        if (!hotel) return '';

        // Mostrar la ficha únicamente el primer día asignado al alojamiento.
        const firstDay = t.days.findIndex(day => day.hotel === d.hotel);
        if (firstDay !== t.days.indexOf(d)) return '';

        const formatter = new Intl.DateTimeFormat('es-MX', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            timeZone: 'UTC'
        });
        const parseDate = value => {
            if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return null;
            const date = new Date(value + 'T12:00:00Z');
            return Number.isNaN(date.getTime()) ? null : date;
        };
        const checkIn = parseDate(hotel.checkIn || d.date);
        const checkOut = parseDate(hotel.checkOut);
        const formatDate = (date, raw) => date ? esc(formatter.format(date)) : esc(raw || 'Por definir');
        const nights = checkIn && checkOut
            ? Math.round((checkOut.getTime() - checkIn.getTime()) / 86400000)
            : null;
        const duration = nights > 0
            ? `${nights} ${nights === 1 ? 'noche' : 'noches'}`
            : 'Por definir';

        return `<details class="hotel-checkin atlas-day-fold" aria-label="Información de llegada al alojamiento" open>
            <summary class="hotel-checkin-heading">
                <span class="hotel-checkin-symbol" aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 18v-7m18 7v-7M3 15h18M5 15V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v7M5 11h14"/></svg></span>
                <div>
                    <h4>Llegada al alojamiento</h4>
                    ${hotel.status ? `<small>${esc(hotel.status)}</small>` : ''}
                </div>
            </summary>
            <div class="hotel-checkin-body">
                <div class="hotel-checkin-main">
                    <div class="hotel-checkin-details">
                <p class="hotel-checkin-name"><strong>${hotel.mapsUrl
                    ? `<a href="${esc(hotel.mapsUrl)}" target="_blank" rel="noopener noreferrer">${esc(hotel.name)}</a>`
                    : esc(hotel.name)}</strong></p>
                ${hotel.address ? `<p class="hotel-checkin-address"><span aria-hidden="true"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg></span><span>${esc(hotel.address)}</span></p>` : ''}
                    </div>
                <div class="hotel-checkin-dates">
                    <div><small>CHECK-IN</small><strong>${formatDate(checkIn, hotel.checkIn || d.date)}</strong></div>
                    <div><small>CHECK-OUT</small><strong>${formatDate(checkOut, hotel.checkOut)}</strong></div>
                    <div><small>DURACIÓN</small><strong>${duration}</strong></div>
                </div>
                </div>
                ${hotel.notes ? `<p class="hotel-checkin-notes"><strong>Nota:</strong> ${esc(hotel.notes)}</p>` : ''}
                ${(hotel.links?.length ? hotel.links : hotel.url ? [{url:hotel.url,label:hotel.linkLabel || 'Ver alojamiento'}] : []).length ? `<div class="entity-links hotel-checkin-link">${(hotel.links?.length ? hotel.links : [{url:hotel.url,label:hotel.linkLabel || 'Ver alojamiento'}]).map(link => `<a href="${esc(link.url)}" target="_blank" rel="noopener noreferrer">${esc(link.label)}</a>`).join('')}</div>` : ''}
            </div>
        </details>`;
    }
    function logisticsNotice(d) {
        const note = typeof d.note === 'string'
            ? d.note.trim().replace(/^(?:[-•]\s*)?(?:aviso logístico)\s*:\s*/i, '').trim()
            : '';
        const links = [
            ...(Array.isArray(d.noteLinks) ? d.noteLinks : []),
            ...(d.noteLink ? [d.noteLink] : [])
        ].filter(link => link && link.url && link.label);
        if (!note && !links.length) return '';

        const icon = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>';
        const linkIcon = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.1 0l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1"/><path d="M14 11a5 5 0 0 0-7.1 0l-2 2a5 5 0 0 0 7.1 7.1l1.1-1.1"/></svg>';
        return `<details class="logistics-notice atlas-day-fold" aria-label="Aviso logístico" open>
            <summary class="logistics-heading"><span class="logistics-symbol">${icon}</span><h4>Aviso logístico</h4></summary>
            ${note ? `<div class="logistics-copy">${note.split('\n').map(line => `<p>${readable(line)}</p>`).join('')}</div>` : ''}
            ${links.length ? `<div class="logistics-links"><div class="logistics-links-heading">${linkIcon}<strong>Enlaces útiles</strong></div><div class="logistics-link-list">${links.map(link => `<a href="${esc(link.url)}" target="_blank" rel="noopener noreferrer">${readable(link.label)}</a>`).join('')}</div></div>` : ''}
        </details>`;
    }

    function scheduleText(value) {
        return String(value || '').split(/\n+/).filter(line => line.trim()).map(line => `<p>${readable(line)}</p>`).join('');
    }
    function legacyDailySpend(d) {
        return '<details class="dailycost dailycost-standalone atlas-day-fold" open><summary class="dailycost-label">' +
            '<span class="dailycost-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="14" rx="2"/><path d="M3 10h18M6 6V4a1 1 0 0 1 1-1h11"/><path d="M16 15h2"/></svg></span>' +
            '<div><strong>Gasto estimado del día</strong><small>Comidas, visitas y movilidad</small></div></div>' +
            '<div class="dailycost-value"><strong>' + (d.spend == null ? 'Por cotizar' : money(d.spend) + ' MXN') +
            '</strong><small>' + (d.spend == null ? 'Contemplado en el rango global' : 'Incluido en el presupuesto total') +
            '</small></div></summary></details>';
    }
    function compactDayDate(value) {
        const date = new Date(String(value) + 'T12:00:00Z');
        if (Number.isNaN(date.getTime())) return String(value || '');
        const weekdays = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
        const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
        return weekdays[date.getUTCDay()] + ', ' + date.getUTCDate() + ' ' + months[date.getUTCMonth()];
    }
    function day(d) { const t = trips.find(x => x.days.includes(d)); return `<details class="day" id="dia-${d.n}" open><summary><div class="day-rail"><span class="daynum"><span class="daynum-label">Día</span><span class="daynum-value">${String(d.n).padStart(2, '0')}</span></span><span class="day-badge-date">${esc(compactDayDate(d.date))}</span></div><div class="day-main"><h3>${formatDayTitle(d)}</h3>${t ? nightHotel(t,d) : ''}${d.headerPlaces ? `<span class="day-places">${d.headerPlaces.map(esc).join(' • ')}</span>` : d.places.length ? `<span class="day-places">${d.places.map(key => esc(places[key].name) + ((d.optionalPlaces || []).includes(key) ? ' <span class="summary-optional">(opcional)</span>' : '')).join(' • ')}</span>` : ''}</div></summary><div class="daycontent">${d.places.length ? `<div class="gallery ${d.places.length === 1 ? 'single' : ''}">${d.places.map(key => figure(key, (d.optionalPlaces || []).includes(key), false)).join('')}</div>${d.optionalPlaces?.length ? '<p class="gallery-explanation">Las fotografías marcadas «Opción del día» muestran alternativas o visitas opcionales. El programa explica cuáles elegir según tus intereses, el tiempo y tu energía.</p>' : ''}` : ''}<div class="schedule"><div><label>Mañana</label>${scheduleText(d.am)}</div><div><label>Tarde</label>${scheduleText(d.pm)}</div><div><label>Noche</label>${scheduleText(d.night)}</div></div>${t ? hotelCheckIn(t,d) : ''}${(t && d.transportRefs?.length) || (typeof d.mobility === 'string' && d.mobility.trim()) || d.mobilityLinks?.length ? `<details class="mobility mobility-card atlas-day-fold" open><summary><h4><span class="mobility-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="17" r="2"/><path d="M8 17h8a3 3 0 0 0 3-3V7M15 11l4-4 4 4M4 7h8"/></svg></span>Cómo trasladarte</h4></summary>${t ? window.AtlasDayTransport.render(t,d) : ''}${typeof d.mobility === 'string' && d.mobility.trim() ? `<div class="mobility-copy">${d.mobility.trim().split(/\n+/).map(line => `<p class="mobility-step">${readable(line.replace(/^\s*[-•]\s*/, ''))}</p>`).join('')}</div>` : ''}${d.mobilityLinks?.length ? `<div class="entity-links">${d.mobilityLinks.filter(link => link?.url && link?.label).map(link => `<a href="${esc(link.url)}" target="_blank" rel="noopener noreferrer">${esc(link.label)}</a>`).join('')}</div>` : ''}</details>` : ''}${logisticsNotice(d)}${t?.majorTransport?.length ? window.AtlasDayBudget.render(t,d) : legacyDailySpend(d)}</div></details>`; }
    return { img, caption, figure, day, hotelForDay, transportSummary: window.AtlasDayTransport.render, mountTransport: window.AtlasDayTransport.mount };
};
