window.AtlasDay = function (ctx) {
    'use strict';
    const { trips, places, photos, esc, money, long, readable, railBlock, formatDayTitle } = ctx;
    const img = (key, cls = '', eager = false, deferred = false, decorative = false) => `<img ${deferred ? 'data-src' : 'src'}="${esc(photos[key].src)}" alt="${decorative ? '' : esc(places[key].name)}" class="${cls}" ${eager ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
    function caption(key, optional = false) { const p = places[key], a = photos[key], trip = trips.find(t => t.id === location.hash.split('/')[1]); return `<figcaption>${optional ? '<span class="photo-option">Opción del día</span>' : ''}<strong>${esc(p.name)}</strong><p>${esc(trip?.placeDescriptions?.[key] || '')}</p><div class="credit">Foto: ${esc(a.attribution)} · <a href="${esc(a.source)}" target="_blank" rel="noopener">${esc(a.license)}</a></div></figcaption>`; }
    function figure(key, optional = false, deferred = false) { return `<figure><button type="button" class="photo-open" aria-label="Ampliar foto: ${esc(places[key].name)}">${img(key, '', false, deferred)}<span class="photo-zoom" aria-hidden="true">Ampliar ↗</span></button>${caption(key, optional)}</figure>`; }
    function hotelForDay(t, d) {
        if (!d.hotel) return null;
        return t.hotels?.[d.hotel] || null;
    }
    function nightHotel(t, d) {
        const hotel = hotelForDay(t, d);
        return hotel ? `<p class="night-hotel"><strong>Hospedaje:</strong> ${esc(hotel.name)} · ${esc(hotel.city)}</p>` : '';
    }
    function hotelCheckIn(t, d) {
        const hotel = hotelForDay(t, d);
        if (!hotel) return '';
        const index = t.days.findIndex(day => day.hotel === d.hotel);
        if (index !== t.days.indexOf(d)) return '';
        return `<div class="daynote hotel-checkin"><strong>🏨 Hotel · llegada / check-in</strong><p><strong>${esc(hotel.name)}</strong>${hotel.status ? ' · ' + esc(hotel.status) : ''}</p>${hotel.address ? `<p><strong>Dirección:</strong> ${esc(hotel.address)}</p>` : ''}${hotel.rate ? `<p><strong>Tarifa revisada:</strong> ${esc(hotel.rate)}</p>` : ''}${hotel.notes ? `<p>${esc(hotel.notes)}</p>` : ''}${hotel.url ? `<p><a href="${esc(hotel.url)}" target="_blank" rel="noopener">${esc(hotel.linkLabel || 'Ver alojamiento')}</a></p>` : ''}</div>`;
    }
    function day(d) { const t = trips.find(x => x.days.includes(d)); return `<details class="day" id="dia-${d.n}" open><summary><span class="daynum">${String(d.n).padStart(2, '0')}</span><div><h3>${formatDayTitle(d)}</h3><span class="day-date">Día ${d.n} · ${long(d.date)}</span>${t ? nightHotel(t,d) : ''}${d.headerPlaces ? `<span class="day-places">${d.headerPlaces.map(esc).join(' • ')}</span>` : d.places.length ? `<span class="day-places">${d.places.map(key => esc(places[key].name) + ((d.optionalPlaces || []).includes(key) ? ' <span class="summary-optional">(opcional)</span>' : '')).join(' • ')}</span>` : ''}</div></summary><div class="daycontent">${d.places.length ? `<div class="gallery ${d.places.length === 1 ? 'single' : ''}">${d.places.map(key => figure(key, (d.optionalPlaces || []).includes(key), false)).join('')}</div>${d.optionalPlaces?.length ? '<p class="gallery-explanation">Las fotografías marcadas «Opción del día» muestran alternativas o visitas opcionales. El programa explica cuáles elegir según tus intereses, el tiempo y tu energía.</p>' : ''}` : ''}<div class="schedule"><div><label>Mañana</label><p>${readable(d.am)}</p></div><div><label>Tarde</label><p>${readable(d.pm)}</p></div><div><label>Noche</label><p>${readable(d.night)}</p></div></div><div class="mobility"><div><strong>Cómo te mueves</strong><p>${readable(d.mobility)}</p></div><div class="dailycost"><strong>Gasto estimado del día</strong>${d.spend === null ? 'Por cotizar<small>Sin importe diario confirmado.<br>Rango global en el presupuesto.</small>' : `${money(d.spend)} MXN<small>Comidas, visitas y movilidad.<br>Ya contemplado en el presupuesto total.</small>`}</div></div>${railBlock(d)}${t ? hotelCheckIn(t,d) : ''}${d.note ? `<div class="daynote">${String(d.note).split('\n').map(readable).join('<br>')}${d.noteLinks ? `<p class="day-links">${d.noteLinks.map(link => `<a href="${esc(link.url)}" target="_blank" rel="noopener">${esc(link.label)}</a>`).join(' · ')}</p>` : ''}${d.noteLink ? `<p><a href="${esc(d.noteLink.url)}" target="_blank" rel="noopener">${readable(d.noteLink.label)}</a></p>` : ''}</div>` : ''}</div></details>`; }
    return { img, caption, figure, day, hotelForDay };
};
