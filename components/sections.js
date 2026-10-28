window.AtlasSections = function (ctx) {
    'use strict';
    const { trips, stays, esc, price, range, readable, railLinks } = ctx;
    const baseLabel = n => n + ' ' + (n === 1 ? 'base' : 'bases') + ' para dormir';
    function familyLabel(t) {
        const f = t.family;
        return f ? `<p class="family-label">${esc(f.label)}<span>${esc(f.note)}</span></p>` : '';
    }
    const legacyExperienceTripIds = new Set(['espana-portugal', 'espana', 'munich', 'munich-viena', 'portugal', 'suiza', 'suiza-italia', 'grecia', 'sicilia', 'washington', 'turquia', 'nueva-orleans', 'vegas', 'marruecos', 'san-antonio', 'puglia-matera']);
    function experiencePanel(t) {
        const experiences = (t.experiences || []).map((item, index) => {
            const isObject = item && typeof item === 'object';
            const city = isObject ? item.city : '';
            const description = isObject ? item.description : item;
            return `<li class="experience-card">
                <div class="experience-card-meta">${city ? `<span>${esc(city)}</span>` : '<span>Experiencia destacada</span>'}<small>${String(index + 1).padStart(2, '0')}</small></div>
                <p>${esc(description || '')}</p>
            </li>`;
        }).join('');
        const note = t.profile?.why ? `<div class="experience-note">
            <div class="experience-note-heading"><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 17V5h16v12M2 17h20M7 21h10M8 9h8M8 13h5"/></svg><strong>Un viaje con pocas maletas</strong></div>
            <p>${esc(t.profile.why)}</p>
        </div>` : '';
        return `<article class="panel experience-panel" id="experiencias">
            <div class="experience-kicker"><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3ZM19 17l.7 2.3L22 20l-2.3.7L19 23l-.7-2.3L16 20l2.3-.7L19 17Z"/></svg><span>Lo que hace especial este viaje</span></div>
            <h3>Experiencias para recordar.</h3>
            <p class="experience-intro">${t.id === "emilia-romana" ? "Arte extraordinario, ciudades históricas y experiencias que dan identidad al recorrido." : "Descubre las experiencias que darán identidad a este viaje."}</p>
            <ul class="experience-list${!legacyExperienceTripIds.has(t.id) ? ' experience-column-order' : ''}" style="${!legacyExperienceTripIds.has(t.id) ? '--experience-rows:' + Math.ceil((t.experiences || []).length / 2) : ''}">${experiences || '<li class="experience-card"><p class="draft-pending">Por definir</p></li>'}</ul>
            ${note}
        </article>`;
    }
    function reservationPlanning(t) {
        const p = t.planningDetails || {};
        const groups = (t.reservations || []).map((group, groupIndex) => {
            const [title, items] = Array.isArray(group) ? group : [group?.title, group?.items];
            const safeItems = Array.isArray(items) ? items : [];
            return `
            <section class="reservation-group ${groupIndex === 0 ? 'reservation-priority-very-high' : groupIndex === 1 ? 'reservation-priority-high' : ''}">
                <div class="reservation-group-heading">
                    <h4>${esc(title)}</h4>
                    <span class="reservation-count" aria-label="${safeItems.length} reservas">${safeItems.length}</span>
                </div>
                <ol class="reservation-list">${safeItems.map((item, index) => {
                    const structured = item && typeof item === 'object' && !Array.isArray(item);
                    const label = structured ? item.title : '';
                    const description = structured ? item.description : item;
                    return `<li class="reservation-item">
                        <span class="reservation-number" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>
                        <div class="reservation-item-copy">
                            ${label ? `<strong>${esc(label)}</strong>` : ''}
                            <p>${esc(description || '')}</p>
                            ${structured && item.links?.length ? `<div class="entity-links">${item.links.map(link => `<a href="${esc(link.url)}" target="_blank" rel="noopener noreferrer">${esc(link.label)}</a>`).join('')}</div>` : ''}
                        </div>
                    </li>`;
                }).join('')}</ol>
            </section>`;
        }).join('');
        return `<article class="panel reservation-panel" id="reservas">
            <div class="reservation-kicker"><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18m-13 5 3 3 5-5"/></svg><span>Antes de viajar</span></div>
            <h3>${esc(p.reservationTitle || 'Reservaciones importantes')}</h3>
            ${p.reservationNote ? `<p class="reservation-intro">${esc(p.reservationNote)}</p>` : ''}
            <div class="reservation-groups">${groups || '<p class="draft-pending">Por definir</p>'}</div>
        </article>`;
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

    // Iconos SVG locales: no requieren dependencias ni peticiones externas.
    function hotelIcon(name) {
        const paths = {
            location: '<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
            rate: '<rect x="2" y="5" width="20" height="15" rx="2"/><path d="M2 9h20"/><path d="M16 15h2"/>',
            conditions: '<circle cx="12" cy="12" r="10"/><path d="M12 11v6"/><path d="M12 7h.01"/>',
            link: '<path d="M14 3h7v7"/><path d="M10 14 21 3"/><path d="M21 13v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h7"/>'
        };
        return `<svg class="hotel-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths[name]}</svg>`;
    }

    function hotelCard(h) {
        const dates = h.checkIn || h.checkOut
            ? `<div class="hotel-dates">
                <div><small>CHECK-IN</small><strong>${hotelDate(h.checkIn) || 'Por definir'}</strong></div>
                <div><small>CHECK-OUT</small><strong>${hotelDate(h.checkOut) || 'Por definir'}</strong></div>
              </div>`
            : '';
        return `<article class="hotel-card">
            <h4>${esc(h.city || 'Por definir')} · <em>${h.mapsUrl ? `<a class="hotel-name-map" href="${esc(h.mapsUrl)}" target="_blank" rel="noopener noreferrer" aria-label="Abrir ${esc(h.name)} en Google Maps">${esc(h.name || 'Por definir')}</a>` : esc(h.name || 'Por definir')}</em></h4>
            ${h.address ? `<p class="hotel-address hotel-icon-line">${hotelIcon('location')}<span>${esc(h.address)}</span></p>` : ''}
            ${dates}
            ${h.rate ? `<p class="hotel-rate hotel-icon-line">${hotelIcon('rate')}<span>${esc(h.rate)}</span></p>` : ''}
            ${h.rateConditions ? `<p class="hotel-rate-conditions hotel-icon-line">${hotelIcon('conditions')}<span>${esc(h.rateConditions)}</span></p>` : ''}
            ${h.status ? `<p class="hotel-status"><strong>Estado:</strong> ${esc(h.status)}</p>` : ''}
            ${h.notes ? `<p class="hotel-notes"><strong>Nota:</strong> ${esc(h.notes)}</p>` : ''}
            ${(h.links?.length ? h.links : h.url ? [{label:h.linkLabel || 'Ver alojamiento',url:h.url}] : []).length ? `<div class="entity-links hotel-entity-links">${(h.links?.length ? h.links : [{label:h.linkLabel || 'Ver alojamiento',url:h.url}]).map(link => `<a href="${esc(link.url)}" target="_blank" rel="noopener noreferrer">${hotelIcon('link')}<span>${esc(link.label)}</span></a>`).join('')}${h.mapsUrl ? `<a href="${esc(h.mapsUrl)}" target="_blank" rel="noopener noreferrer">${hotelIcon('location')}<span>Google Maps</span></a>` : ''}</div>` : ''}
        </article>`;
    }

    function suggestedStayCard([city, description, url, linkLabel]) {
        return `<article class="hotel-card hotel-card-suggested">
            <h4>${esc(city)}</h4>
            <p class="hotel-description">${esc(description)}</p>
            ${url ? `<a class="hotel-link hotel-icon-line" href="${esc(url)}" target="_blank" rel="noopener">${hotelIcon('link')}<span>${esc(linkLabel || 'Ver alojamiento')}</span></a>` : ''}
        </article>`;
    }

    function stayParagraphs(id) {
        const trip = trips.find(t => t.id === id);
        const hotels = trip?.hotels || [];
        const suggested = stays[id] || [];
        return `<div class="stay-list hotel-grid">
            ${hotels.map(hotelCard).join('')}
            ${suggested.map(suggestedStayCard).join('')}
            ${!hotels.length && !suggested.length ? '<article class="hotel-card"><p class="draft-pending">Por definir</p></article>' : ''}
        </div>`;
    }
    function knownCostPanel(t) {
        if (!t.knownCosts?.length) return ''; return `<article class="panel rail-summary" style="margin-top:20px"><h3>Partidas conocidas · referencia parcial</h3><div class="scrolltable"><table><thead><tr><th>Concepto</th><th>Importe de referencia</th></tr></thead><tbody>${t.knownCosts.map(([label, value]) => `<tr><td>${esc(label)}</td><td>${esc(value)}</td></tr>`).join('')}</tbody></table></div><p class="tiny">${esc(t.costExclusions)}</p><p class="tiny">${esc(t.exchangeNote)}</p></article>`;
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
        railPlanning,
        variants,
        railAppendix,
        optionsSection
    };
};
