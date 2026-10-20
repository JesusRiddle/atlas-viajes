window.AtlasSections = function (ctx) {
    'use strict';
    const { trips, stays, esc, price, range, readable, railLinks } = ctx;
    const baseLabel = n => n + ' ' + (n === 1 ? 'base' : 'bases') + ' para dormir';
    function familyLabel(t) {
        const f = t.family;
        return f ? `<p class="family-label">${esc(f.label)}<span>${esc(f.note)}</span></p>` : '';
    }
    function experiencePanel(t) {
        return `<article class="panel experience-panel"><h3>Así se siente este viaje</h3><ul class="experience-list">${t.experiences.map(x => `<li>${esc(x)}</li>`).join('')}</ul><p class="tiny">${esc(t.profile.why)}</p></article>`;
    }
    function reservationPlanning(t) {
        if (!t.planningDetails) return '';
        const p = t.planningDetails;
        return `<article class="panel" style="margin-top:20px"><h3>${esc(p.reservationTitle || 'Reservas críticas')}</h3><p class="tiny">${esc(p.reservationNote)}</p><div class="factgrid">${t.reservations.map(([title, items]) => `<div><h4>${esc(title)}</h4><ol class="tips">${items.map(item => `<li>${esc(item)}</li>`).join('')}</ol></div>`).join('')}</div></article><details class="panel" style="margin-top:20px"><summary><strong>${esc(p.toursTitle || 'Tours locales que aportan valor')}</strong></summary><p>${esc(p.tourIntro)}</p><div class="stay-list">${t.tours.map(([city, note]) => `<p><strong>${esc(city)}</strong><span>${esc(note)}</span></p>`).join('')}</div><p class="tiny">${esc(p.tourNote)}</p></details>`;
    }
    const dateFormatter = new Intl.DateTimeFormat('es-MX', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC'
    });

    function hotelDate(value) {
        if (!value) return '';
        const date = new Date(`${value}T12:00:00Z`);
        return Number.isNaN(date.getTime()) ? esc(value) : esc(dateFormatter.format(date));
    }

    function hotelCard(h) {
        const dates = h.checkIn || h.checkOut
            ? `<div class="hotel-dates">
                <div><small>CHECK-IN</small><strong>${hotelDate(h.checkIn) || 'Por definir'}</strong></div>
                <div><small>CHECK-OUT</small><strong>${hotelDate(h.checkOut) || 'Por definir'}</strong></div>
              </div>`
            : '';
        return `<article class="hotel-card">
            <h4>${esc(h.city)} · <em>${esc(h.name)}</em></h4>
            ${h.address ? `<p class="hotel-address">${esc(h.address)}</p>` : ''}
            ${dates}
            ${h.rate ? `<p class="hotel-rate">${esc(h.rate)}</p>` : ''}
            ${h.status ? `<p class="hotel-status"><strong>Estado:</strong> ${esc(h.status)}</p>` : ''}
            ${h.notes ? `<p class="hotel-notes"><strong>Nota:</strong> ${esc(h.notes)}</p>` : ''}
            ${h.url ? `<a class="hotel-link" href="${esc(h.url)}" target="_blank" rel="noopener">${esc(h.linkLabel || 'Ver alojamiento')}</a>` : ''}
        </article>`;
    }

    function suggestedStayCard([city, description, url, linkLabel]) {
        return `<article class="hotel-card hotel-card-suggested">
            <h4>${esc(city)}</h4>
            <p class="hotel-description">${esc(description)}</p>
            ${url ? `<a class="hotel-link" href="${esc(url)}" target="_blank" rel="noopener">${esc(linkLabel || 'Ver alojamiento')}</a>` : ''}
        </article>`;
    }

    function stayParagraphs(id) {
        const trip = trips.find(t => t.id === id);
        const hotels = Object.values(trip?.hotels || {});
        const suggested = stays[id] || [];
        return `<div class="stay-list hotel-grid">
            ${hotels.map(hotelCard).join('')}
            ${suggested.map(suggestedStayCard).join('')}
        </div>`;
    }
    function knownCostPanel(t) {
        if (!t.knownCosts?.length) return ''; return `<article class="panel rail-summary" style="margin-top:20px"><h3>Partidas conocidas · referencia parcial</h3><div class="scrolltable"><table><thead><tr><th>Concepto</th><th>Importe de referencia</th></tr></thead><tbody>${t.knownCosts.map(([label, value]) => `<tr><td>${esc(label)}</td><td>${esc(value)}</td></tr>`).join('')}</tbody></table></div><p class="tiny">${esc(t.costExclusions)}</p><p class="tiny">${esc(t.exchangeNote)}</p></article>`;
    }
    function railBlock(d) {
        if (!d.rail) return '';
        const r = d.rail; return `<div class="rail-compact" aria-label="Logística ferroviaria"><h4>Trenes y llegada</h4><ul>${r.legs.map(([label, text]) => `<li${label.startsWith('Plan B') ? ' class="rail-plan-b"' : ''}><strong>${label.startsWith('Plan B') ? 'Plan B' + esc(label.slice(6)) : '🚆 ' + esc(label)}</strong> · ${r.linkRailOperators ? railLinks(text) : esc(text)}</li>`).join('')}<li>🎟️ ${r.linkRailOperators ? railLinks(r.ticket) : esc(r.ticket)}</li>${r.arrival.map(text => `<li>📍 ${esc(text)}</li>`).join('')}</ul><p><strong>Referencia ferroviaria: ${esc(r.total)}</strong></p></div>`;
    }
    function railPlanning(t) {
        if (!t.railSummary) return ''; return `<article class="panel rail-summary" style="margin-top:20px"><h3>Trenes · referencia cotizada</h3><p>${t.railSummary.map(([route, cost]) => `${esc(route)}: <strong>${esc(cost)}</strong>`).join(' · ')}</p><p><strong>Total ferroviario actual de referencia: ${esc(t.railTotal)} / persona.</strong> ${esc(t.railExclusions || 'No incluye transporte urbano ni traslados adicionales.')} ${esc(t.railCurrencyNote || 'Sin conversión fija a MXN.')}</p><p class="tiny">Horarios y precios observados por el viajero para las fechas exactas, no billetes comprados. Pueden cambiar hasta la compra. Los Plan B no se suman al total.</p><h4>🎟️ Billetes y flexibilidad</h4><ul class="rail-ticket-notes">${t.ticketNotes.map(([label, text]) => `<li><strong>${esc(label)}:</strong> ${esc(text)}</li>`).join('')}</ul></article>`;
    }
    function variants(t) {
        const related = t.comparison?.group
            ? trips.filter(x => x.comparison?.group === t.comparison.group)
            : [];
        if (related.length < 2) return '';
        const fields = [
            ['Fechas', x => range(x)],
            ['Noches y bases', x => x.bases.map(([name, n]) => esc(name) + ' ' + n).join(' · ')],
            ['Experiencia central', x => esc(x.comparison.experience)],
            ['Trenes', x => esc(x.comparison.trains)],
            ['Condiciones', x => esc(x.comparison.conditions)],
            ['Aeropuertos', x => esc(x.comparison.airports)],
            ['Presupuesto por persona', x => price(x) + ' MXN'],
            ['Vacaciones', x => esc(x.comparison.vacation)]
        ];
        return `<section class="section wrap"><p class="eyebrow orange">Comparar alternativas</p><h2>${esc(t.comparison.title)}</h2><p class="lead">${esc(t.comparison.intro)}</p><div class="scrolltable"><table><thead><tr><th>Para decidir</th>${related.map(x=>`<th>${esc(x.name)}</th>`).join('')}</tr></thead><tbody>${fields.map(([label,fn])=>`<tr><td>${label}</td>${related.map(x=>`<td>${fn(x)}</td>`).join('')}</tr>`).join('')}</tbody></table></div><div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:22px">${related.map(x=>`<a class="button secondary" href="#viaje/${x.id}">Ver ${esc(x.name)}</a>`).join('')}</div></section>`;
    }
    function railAppendix(t) {
        const x=t.railAppendix;
        if (!x) return '';
        return `<section class="section wrap"><h3>${esc(x.title)}</h3><div class="scrolltable"><table><thead><tr>${x.headers.map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${x.rows.map(row=>`<tr>${row.map(v=>`<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div><h3 style="margin-top:30px">${esc(x.priceTitle)}</h3><div class="factgrid">${x.prices.map(([h,v])=>`<article><h3>${esc(h)}</h3><p>${esc(v)}</p></article>`).join('')}</div><p class="tiny">${esc(x.note)}</p></section>`;
    }
    function optionsSection(t) {
        const o=t.optionalSection;
        if (!o?.rows?.length) return '';
        return `<section class="section wrap" aria-label="${esc(o.title)}"><p class="eyebrow orange">${esc(o.eyebrow || 'Opciones adicionales')}</p><h2>${esc(o.title)}</h2><p>${esc(o.intro || '')}</p><div class="scrolltable"><table><thead><tr>${o.columns.map(col=>`<th>${esc(col)}</th>`).join('')}</tr></thead><tbody>${o.rows.map(row=>`<tr>${row.map(cell=>`<td>${readable(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>${o.note ? `<p class="tiny">${esc(o.note)}</p>` : ''}</section>`;
    }
    return {
        baseLabel,
        familyLabel,
        experiencePanel,
        reservationPlanning,
        stayParagraphs,
        knownCostPanel,
        railBlock,
        railPlanning,
        variants,
        railAppendix,
        optionsSection
    };
};
