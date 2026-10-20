window.AtlasDay = function (ctx) {
    'use strict';
    const { trips, places, photos, esc, money, long, readable, railBlock, formatDayTitle } = ctx;
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

        return `<aside class="hotel-checkin" aria-label="Información de llegada al alojamiento">
            <div class="hotel-checkin-heading">
                <span class="hotel-checkin-symbol" aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 18v-7m18 7v-7M3 15h18M5 15V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v7M5 11h14"/></svg></span>
                <div>
                    <h4>Llegada al alojamiento</h4>
                    ${hotel.status ? `<small>${esc(hotel.status)}</small>` : ''}
                </div>
            </div>
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
                ${hotel.url ? `<p class="hotel-checkin-link"><a href="${esc(hotel.url)}" target="_blank" rel="noopener noreferrer">${esc(hotel.linkLabel || 'Ver alojamiento')}</a></p>` : ''}
            </div>
        </aside>`;
    }
    function day(d) { const t = trips.find(x => x.days.includes(d)); return `<details class="day" id="dia-${d.n}" open><summary><span class="daynum">${String(d.n).padStart(2, '0')}</span><div><h3>${formatDayTitle(d)}</h3><span class="day-date">Día ${d.n} · ${long(d.date)}</span>${t ? nightHotel(t,d) : ''}${d.headerPlaces ? `<span class="day-places">${d.headerPlaces.map(esc).join(' • ')}</span>` : d.places.length ? `<span class="day-places">${d.places.map(key => esc(places[key].name) + ((d.optionalPlaces || []).includes(key) ? ' <span class="summary-optional">(opcional)</span>' : '')).join(' • ')}</span>` : ''}</div></summary><div class="daycontent">${d.places.length ? `<div class="gallery ${d.places.length === 1 ? 'single' : ''}">${d.places.map(key => figure(key, (d.optionalPlaces || []).includes(key), false)).join('')}</div>${d.optionalPlaces?.length ? '<p class="gallery-explanation">Las fotografías marcadas «Opción del día» muestran alternativas o visitas opcionales. El programa explica cuáles elegir según tus intereses, el tiempo y tu energía.</p>' : ''}` : ''}<div class="schedule"><div><label>Mañana</label><p>${readable(d.am)}</p></div><div><label>Tarde</label><p>${readable(d.pm)}</p></div><div><label>Noche</label><p>${readable(d.night)}</p></div></div><div class="dailycost dailycost-standalone"><strong>Gasto estimado del día</strong><span>${d.spend == null ? 'Por cotizar' : `${money(d.spend)} MXN`}</span><small>${d.spend == null ? 'Sin importe diario confirmado. Rango global en el presupuesto.' : 'Comidas, visitas y movilidad. Ya contemplado en el presupuesto total.'}</small></div>${railBlock(d)}${t ? hotelCheckIn(t,d) : ''}${typeof d.mobility === 'string' && d.mobility.trim() ? `<section class="mobility mobility-card"><h4><span class="mobility-icon" aria-hidden="true">↗</span>Cómo te mueves</h4><div class="mobility-copy">${d.mobility.trim().split(/\\n+/).map(line => `<p>${readable(line)}</p>`).join('')}</div></section>` : ''}${d.note ? `<div class="daynote">${String(d.note).split('\n').map(readable).join('<br>')}${d.noteLinks ? `<p class="day-links">${d.noteLinks.map(link => `<a href="${esc(link.url)}" target="_blank" rel="noopener">${esc(link.label)}</a>`).join(' · ')}</p>` : ''}${d.noteLink ? `<p><a href="${esc(d.noteLink.url)}" target="_blank" rel="noopener">${readable(d.noteLink.label)}</a></p>` : ''}</div>` : ''}</div></details>`; }
    return { img, caption, figure, day, hotelForDay };
};
