window.AtlasTrip = function (ctx) {
    'use strict';
    const {
        trips, main, covers, esc, money, range, short, sums, price, img,
        readable, highlightWords, baseLabel, experiencePanel, reservationPlanning,
        railPlanning, factParagraphs, stayParagraphs, day, hotelForDay, mountTransport, variants,
        railAppendix, optionsSection, seasonality, knownCostPanel, home,
        loadGallery, printGuide
    } = ctx;
    // Cada vista registra sus suscripciones y las libera al navegar.
    let disposeView = [];
    function cleanup() {
        for (const dispose of disposeView.splice(0).reverse()) dispose();
    }
    function mountView(trip) {
        disposeView = [
            window.AtlasMajorTransport.mount(main, trip),
            window.AtlasBudgetTable.mount(main, trip),
            mountTransport(main, trip),
            window.AtlasDayBudget.mount(main, trip)
        ].filter(dispose => typeof dispose === 'function');
    }
    // SVG decorativos integrados, sin dependencias externas.
    function overviewIcon(name) {
        const paths = {
            compass: '<circle cx="12" cy="12" r="9"/><path d="m16.2 7.8-2.7 5.7-5.7 2.7 2.7-5.7z"/>',
            pin: '<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
            bed: '<path d="M3 18v-8m0 6h18m0 2v-8M3 10V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3M3 12h18"/>',
            sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/>',
            practical: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h4"/><path d="m14 16 2 2 4-4"/>',
            wallet: '<rect x="3" y="5" width="18" height="15" rx="2"/><path d="M3 9h18m-6 5h3"/>',
            arrow: '<path d="M5 19 19 5M9 5h10v10"/>'
        };
        return `<svg class="overview-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths[name]}</svg>`;
    }
    // Una sola vista de consejos; cambia únicamente su ubicación para Emilia-Romagna.
    function adviceCards(t) {
        const compact = t.id === 'emilia-romana';
        const title = compact
            ? '<div class="advice-heading"><span class="eyebrow orange">Consejos para este viaje</span></div>'
            : '';
        const climate = compact ? factParagraphs(t.climate) :
            '<p class="profile-summary"><strong>Dependencia del clima: ' + esc(t.profile.weather) +
            '.</strong> ' + readable(t.profile.weatherWhy) + '</p>' + factParagraphs(t.climate);
        const solo = compact ? factParagraphs(t.solo) :
            '<p class="profile-summary"><strong>Viajando solo: ' + esc(t.profile.solo) +
            '.</strong> ' + readable(t.profile.soloWhy) + '</p>' + factParagraphs(t.solo);
        return (compact ? '<section class="overview-advice" aria-label="Consejos para este viaje">' + title : '') +
            '<div class="factgrid' + (compact ? ' factgrid-compact' : '') + '">' +
            (!compact ? '<article><h3><span class="section-icon" aria-hidden="true">✈</span>Salida y llegada · vuelos</h3><div class="fact-copy">' +
                factParagraphs(t.flight) + '</div></article>' +
                '<article><h3><span class="section-icon" aria-hidden="true">↔</span>Entre ciudades</h3><div class="fact-copy">' +
                factParagraphs(t.local) + '</div></article>' : '') +
            '<article><h3>' + overviewIcon('sun') + ' Clima y luz</h3><div class="fact-copy">' +
            climate + '</div></article>' +
            '<article><h3><span class="section-icon" aria-hidden="true">◎</span>' +
            (compact ? 'Ritmo y consejos prácticos' : 'Ritmo y viajar solo') +
            '</h3><div class="fact-copy">' +
            solo + '</div></article></div>' + (compact ? '</section>' : '');
    }
    function climateCard(t) {
        return '<article class="overview-climate-card"><h3>' + overviewIcon('sun') + ' Clima y luz</h3>' +
            '<div class="fact-copy">' + factParagraphs(t.climate) + '</div></article>';
    }
    function practicalAdvice(t) {
        const icons = {
            solo: '<circle cx="12" cy="8" r="4"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/>',
            pace: '<path d="m3 17 5-5 4 4 5-8 4 3"/><path d="M3 21h18"/>',
            language: '<path d="m5 8 6 6m-7 0 7-7M3 5h11M9 3v2m4 16 5-11 5 11m-8-4h6"/>',
            currency: '<rect x="2" y="5" width="20" height="15" rx="2"/><path d="M2 9h20M6 15h4"/>'
        };
        // Presentación experimental: etiquetas de lectura rápida para este itinerario.
        const indicators = Array.isArray(t.practicalIndicators) ? t.practicalIndicators : null;
        const badges = t.id === 'emilia-romana' ? {
            solo: { label: 'Muy recomendable', tone: 'green', prefix: 'Muy recomendable. ' },
            pace: { label: 'Moderado–activo', tone: 'orange', prefix: 'Moderado–activo. ' },
            language: { label: 'Fácil', tone: 'green', prefix: '' },
            currency: { label: 'Tarjetas aceptadas', tone: 'green', prefix: '' }
        } : {};
        const badgeMarkup = item => {
            const info = badges[item.id];
            if (!info) return '';
            const palette = info.tone === 'orange'
                ? 'color:#965015;background:#fff1db;border:1px solid #ebcd9c;'
                : 'color:#236145;background:#e8f5ee;border:1px solid #bddac9;';
            return '<span style="display:inline-block;padding:2px 8px;border-radius:999px;font-size:11px;font-weight:700;line-height:1.6;margin-right:5px;white-space:nowrap;' +
                palette + '">' + esc(info.label) + '</span>';
        };
        const description = item => {
            const prefix = badges[item.id]?.prefix;
            return prefix && item.text.startsWith(prefix) ? item.text.slice(prefix.length) : item.text;
        };
        const content = indicators
            ? indicators.map(item => '<div class="practical-indicator">' +
                '<span class="practical-indicator-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' +
                (icons[item.id] || icons.solo) + '</svg></span>' +
                '<div><strong>' + esc(item.title) + '</strong><p>' + badgeMarkup(item) + esc(description(item)) + '</p></div></div>').join('')
            : t.solo.split(/\n\s*\n/).filter(Boolean).map(part => '<div class="practical-item">' +
                readable(part) + '</div>').join('');
        return '<section class="overview-practical" aria-label="Ritmo y consejos prácticos">' +

            '<div class="overview-practical-grid' + (indicators ? ' practical-indicators' : '') + '">' +
            content + '</div></section>';
    }
    function overviewStays(t, inline = false) {
        const nights = t.bases.reduce((sum, base) => sum + Number(base[1] || 0), 0);
        const caption = inline
            ? nights + ' noches · ' + t.bases.length + (t.bases.length === 1 ? ' estancia' : ' estancias')
            : t.bases.length + (t.bases.length === 1 ? ' estancia' : ' estancias');
        return '<div class="overview-stays' + (inline ? ' overview-stays-inline' : '') + '">' +
            '<div class="overview-stays-heading"><h3 class="overview-subheading">' +
            overviewIcon('bed') + (inline ? ' Dónde dormirás' : ' Tus alojamientos') +
            '</h3><span>' + caption + '</span></div>' +
            '<div class="baseroute" style="--stay-columns:' + Math.min(Math.max(t.bases.length, 1), 4) + '">' + t.bases.map((x, i) =>
                '<div class="basepill"><span class="basepill-number">' + String(i + 1).padStart(2, '0') +
                '</span>' + overviewIcon('bed') + '<strong>' + esc(x[0]) + '</strong><small>' +
                x[1] + ' ' + (x[1] === 1 ? 'noche' : 'noches') + '</small></div>'
            ).join('') + '</div></div>';
    }
    function tripPage(id) {
        cleanup();
        const t = trips.find(x => x.id === id);
        if (!t) {
            home();
            return;
        }
        main.classList.toggle('trip-espana-portugal', t.layoutClass === 'trip-espana-portugal');
        document.title = t.name + ' · Atlas de Viajes';
        const [low, high] = sums(t);
        const rank = trips.indexOf(t) + 1;
        main.innerHTML = [
            `<section class="triphero">${img(covers[id], '', true)}<div class="wrap">`,
            `<a class="breadcrumb" href="#"><span aria-hidden="true">←</span> Regresar</a>`,
            `<p class="eyebrow hero-eyebrow">Viaje #${rank}: ${esc(t.heroEyebrow || t.tag)}</p>`,
            `<h1>${esc(t.name)}</h1>`,
            `<div class="hero-meta">`,
            `<span>${range(t)}</span>`,
            `<span>${t.days.length} días naturales</span>`,
            `<span>${t.work} días laborales</span>`,
            `<span>${esc(t.heroLodgingSummary || baseLabel(t.bases.length))}</span>`,
            `</div>`,
            `</div>`,
            `</section>`,
            `<nav class="subnav" aria-label="Secciones del viaje">`,
            `<div>`,
            `<a href="#viaje/${id}/plan">Panorama</a>`,
            `<a href="#viaje/${id}/mapa">Mapa</a>`,
            `${t.experiences?.length ? `<a href="#viaje/${id}/experiencias">Experiencias</a>` : ''}`,
            `${t.planningDetails && t.reservations?.length ? `<a href="#viaje/${id}/reservas">Reservaciones</a>` : ''}`,
            `${t.majorTransport?.length ? `<a href="#viaje/${id}/traslados">Traslados</a>` : ''}`,
            `<a href="#viaje/${id}/alojamientos">Dónde dormir</a>`,
            `${t.seasonality ? `<a href="#viaje/${id}/temporadas">Temporadas</a>` : ''}`,
            `<a href="#viaje/${id}/dias">Día por día</a>`,
            `<a href="#viaje/${id}/costes">Presupuesto</a>`,
            `${t.sources?.length ? `<a href="#viaje/${id}/fuentes">Fuentes</a>` : ''}`,
            `</div>`,
            `<select aria-label="Cambiar destino" id="dest-select">${trips.map(x => `<option value="${x.id}" ${x.id === id ? 'selected' : ''}>${x.flag} ${esc(x.name)}</option>`).join('')}</select>`,
            `</nav>`,
            `<section class="wrap" id="plan">`,
            `<div class="overview overview-editorial">`,
            `<div class="overview-intro">`,
            `<div class="overview-kicker">${overviewIcon('compass')}<span>Panorama del viaje</span></div>`,
            `<h2 class="overview-heading">La esencia de tu recorrido.</h2>`,
            `<p class="lead">${highlightWords(t.intro, t.introHighlights)}</p>`,
            `${t.id === 'emilia-romana' ? practicalAdvice(t) : ''}`,
            `${t.id === 'emilia-romana' ? '' : `<div class="overview-route-block"><h3 class="overview-subheading">${overviewIcon('pin')} Ciudades del recorrido</h3><div class="trip-route" aria-label="Ciudades del recorrido">${t.routeCities.map(city => `<span class="trip-route-city">${esc(city)}</span>`).join('')}</div></div>`}`,
            `${t.id === 'emilia-romana' ? overviewStays(t, true) : ''} `,
            `</div>`,
            `${t.id === 'emilia-romana' ? '' : overviewStays(t)}`,
            `${t.id === 'emilia-romana' ? '<div class="overview-side">' : ''}`,
            `<aside class="budget-teaser">`,
            `<div>`,
            `<span class="eyebrow">${overviewIcon('wallet')} Tu inversión aproximada</span>`,
            `<strong>${price(t)}</strong>`,
            `<p class="budget-context">MXN · 1 persona · viaje completo</p>`,
            `<a class="budget-detail-link" href="#viaje/${id}/costes">Ver desglose del presupuesto ${overviewIcon('arrow')}</a>`,
            `${t.exchangeRates && t.exchangeRateSnapshot ? '<div class="budget-exchange"><div class="budget-exchange-label">Tipos de cambio · ' +
                esc(t.exchangeRateSnapshot.date) + '</div><div class="budget-exchange-values"><span>EUR 1 = $' +
                Number(t.exchangeRates.EUR).toFixed(4) + ' MXN</span><span>USD 1 = $' +
                Number(t.exchangeRates.USD).toFixed(4) + ' MXN</span></div></div>' : ''}`,
                        `</div>`,
            `</aside>`,
            `${t.id === 'emilia-romana' ? climateCard(t) + '</div>' : ''}`,
            `</div>`,
            `${window.AtlasTravel.mapSection(t)}${experiencePanel(t)}${reservationPlanning(t)}${t.majorTransport?.length ? window.AtlasMajorTransport.render(t) : railPlanning(t)}`,
            `${t.id === 'emilia-romana' ? '' : adviceCards(t)}`,
            `<article class="panel" id="alojamientos" style="margin-top:20px">`,
            `<h3>`,
            `<span class="section-icon" aria-hidden="true">⌂</span>Dónde dormir</h3>${stayParagraphs(id)}</article>${!t.planningDetails ? `<div class="source-warning"><strong>Antes de confirmar el viaje:</strong> confirma los vuelos para estas fechas y si el regreso llega a MEX ese mismo día. Los horarios de transportes son referencias. El gasto diario mostrado es una orientación de comidas, accesos y movilidad del día; no se suma al total, que ya los incluye por categorías.</div>` : ''}</section>${variants(t)}${railAppendix(t)}${seasonality(t)}<section class="section wrap" id="dias">`,
            `<div class="section-title">`,
            `<div>`,
            `<p class="eyebrow orange">El viaje, con tiempo para disfrutarlo</p>`,
            `<h2>Día por día.</h2>`,
            `</div>`,
            `<div>`,
            `<button class="printbutton" id="expand">Contraer todos los días</button> <button class="printbutton" id="print">Imprimir / guardar PDF</button>`,
            `</div>`,
            `</div>`,
            `<div class="itinerary-layout">`,
            `<aside class="daynav" aria-label="Días del itinerario">${t.days.map(d => `<a href="#viaje/${id}/dia-${d.n}"><strong>Día ${d.n} · ${short(d.date)}</strong>${esc(d.base)}${hotelForDay(t,d) ? ' · ' + esc(hotelForDay(t,d).name) : ''}</a>`).join('')}</aside>`,
            `<div class="days">${t.days.map(day).join('')}</div>`,
            `</div>`,
            `</section>${optionsSection(t)}<section class="section wrap" id="costes">`,
            `<div class="section-title">`,
            `<div>`,
            `<p class="eyebrow orange">Una persona · MXN</p>`,
            `<h2>Lo que cuesta el viaje.</h2>`,
            `</div>`,
            `<p>${t.majorTransport?.length ? 'Costos registrados y convertidos a MXN. El desglose es parcial mientras existan partidas por cotizar.' : 'Rango para planear con habitación privada, alimentación normal y principales visitas. No presupone ofertas disponibles.'}</p>`,
            `</div>`,
            `${t.majorTransport?.length ? window.AtlasBudgetTable.render(t) : ''}${!t.majorTransport?.length ? '<div class="budgetgrid"><div class="scrolltable"><table><thead><tr><th>Concepto</th><th>Desde</th><th>Hasta</th></tr></thead><tbody>' + t.costs.map(x => '<tr><td>' + esc(x[0]) + '</td><td>' + (x[1] === null ? 'Por cotizar' : money(x[1])) + '</td><td>' + (x[2] === null ? 'Por cotizar' : money(x[2])) + '</td></tr>').join('') + '<tr class="totalrow"><td>' + (t.budgetPreliminary ? 'Rango global preliminar conservado' : 'Total completo') + '</td><td>' + money(low) + '</td><td>' + money(high) + '</td></tr></tbody></table></div></div>' + knownCostPanel(t) : ''}</section>`,
            `${t.sources?.length ? `<section class="section wrap" id="fuentes">` : ''}`,
            `${t.sources?.length ? `<p class="eyebrow orange">Fuentes y reservas</p>` : ''}`,
            `${t.sources?.length ? `<h2>Consulta el canal oficial.</h2>` : ''}`,
            `${t.sources?.length ? `<div class="sources">${t.sources.map(x => `<a href="${esc(x[1])}" target="_blank" rel="noopener">${esc(x[0])}</a>`).join('')}</div>` : ''}`,
            `${t.sources?.length ? `<p class="tiny">${esc(t.sourceNote || 'Planeación de referencia: 1 de octubre de 2026. Textos y galerías revisados el 2 de octubre.')} Comprueba calendarios y tarifas para tus fechas antes de comprar; las fotografías muestran los lugares, no el clima que tendrás durante el viaje.</p>` : ''}`,
            `${t.sources?.length ? '</section>' : ''}`
        ].join('');
        window.AtlasGallery.init(main);
        mountView(t);
        window.AtlasTravel.initMap(t);
        document.querySelector('#dest-select').addEventListener('change', e => {
            location.hash = 'viaje/' + e.target.value;
        });
        document.querySelector('#expand').addEventListener('click', e => {
            const all = [...document.querySelectorAll('.day')];
            const opening = all.some(x => !x.open);
            all.forEach(x => {
                x.open = opening;
                if (opening) loadGallery(x);
            });
            e.target.textContent = opening ? 'Contraer todos los días' : 'Desplegar todos los días';
        });
        document.querySelector('#print').addEventListener('click', printGuide);
    }
    return { tripPage, cleanup };
};
