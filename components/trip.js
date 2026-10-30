window.AtlasTrip = function (ctx) {
    'use strict';
    const {
        trips, main, covers, photos, esc, money, range, short, sums, price, img,
        readable, highlightWords, baseLabel, experiencePanel, reservationPlanning,
        railPlanning, factParagraphs, stayParagraphs, day, hotelForDay, mountTransport, variants,
        railAppendix, optionsSection, seasonality, knownCostPanel, home,
        loadGallery, printGuide, canRenderFullTrip
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
        const tripStart = typeof t.start === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(t.start) ? t.start : (t.days || []).find(d => typeof d?.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d.date))?.date || '';
        const month = tripStart.slice(5, 7);
        const status = t.seasonality?.months?.[month]?.status || 'pending';
        const seasonLabels = { recommended: 'Recomendable', conditional: 'Aceptable', avoid: 'Desaconsejable', pending: 'Por definir' };
        const seasonClass = Object.prototype.hasOwnProperty.call(seasonLabels, status) ? ' season-' + status : '';
        const seasonBadge = seasonClass ? '<span class="overview-climate-season-status">' + seasonLabels[status] + '</span>' : '';
        return '<article class="overview-climate-card' + seasonClass + '"><h3>' + overviewIcon('sun') + ' Clima y luz' + seasonBadge + '</h3>' +
            '<div class="fact-copy">' + factParagraphs(t.climate) + '</div></article>';
    }
    function practicalAdvice(t) {
        const icons = {
            style: '<circle cx="12" cy="8" r="4"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/>',
            solo: '<circle cx="12" cy="8" r="4"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/>',
            pace: '<path d="m3 17 5-5 4 4 5-8 4 3"/><path d="M3 21h18"/>',
            language: '<path d="m5 8 6 6m-7 0 7-7M3 5h11M9 3v2m4 16 5-11 5 11m-8-4h6"/>',
            currency: '<rect x="2" y="5" width="20" height="15" rx="2"/><path d="M2 9h20M6 15h4"/>',
            entry: '<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M9 7h6M9 11h6M9 15h4"/>'
        };
        // Presentación experimental: etiquetas de lectura rápida para este itinerario.
        const indicators = Array.isArray(t.practicalIndicators) ? t.practicalIndicators : null;
        const legacyBadges = {
            solo: { label: 'Muy recomendable', tone: 'green', prefix: 'Muy recomendable. ' },
            pace: { label: 'Moderado–activo', tone: 'orange', prefix: 'Moderado–activo. ' },
            language: { label: 'Fácil', tone: 'green', prefix: '' },
            currency: { label: 'Tarjetas aceptadas', tone: 'green', prefix: '' }
        };
        // Backward compatibility: old Emilia-Romagna data predates per-trip badge fields.
        const badgeInfo = item => {
            if (typeof item.badge === 'string' && item.badge.trim()) {
                return { label: item.badge.trim(), tone: item.tone === 'orange' ? 'orange' : 'green', prefix: '' };
            }
            return t.id === 'emilia-romana' ? legacyBadges[item.id] : null;
        };
        const badgeMarkup = item => {
            const info = badgeInfo(item);
            if (!info) return '';
            const palette = info.tone === 'orange'
                ? 'color:#965015;background:#fff1db;border:1px solid #ebcd9c;'
                : 'color:#236145;background:#e8f5ee;border:1px solid #bddac9;';
            return '<span style="display:inline-block;padding:2px 8px;border-radius:999px;font-size:11px;font-weight:700;line-height:1.6;margin-right:5px;white-space:nowrap;' +
                palette + '">' + esc(info.label) + '</span>';
        };
        const description = item => {
            const prefix = badgeInfo(item)?.prefix;
            return prefix && item.text.startsWith(prefix) ? item.text.slice(prefix.length) : item.text;
        };
        const emphasizedDescription = item => {
            const safeText = esc(description(item));
            if (item.id !== 'entry') return safeText;
            return safeText
                .replace(/(^|[^\p{L}\p{N}])(Pasaporte|ETIAS|EES|visa|adaptador)(?=$|[^\p{L}\p{N}])/gu, '$1<strong>$2</strong>')
                .replace(/travel-europe\.europa\.eu\/etias/g,
                    '<a href="https://travel-europe.europa.eu/etias" target="_blank" rel="noopener noreferrer">sitio oficial de ETIAS</a>');
        };
        const content = indicators
            ? indicators.map(item => '<div class="practical-indicator" data-indicator-id="' + esc(item.id) + '">' +
                '<span class="practical-indicator-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' +
                (icons[item.id] || icons.solo) + '</svg></span>' +
                '<div><strong>' + esc(item.title) + '</strong><p>' + badgeMarkup(item) + emphasizedDescription(item) + '</p></div></div>').join('')
            : t.solo.split(/\n\s*\n/).filter(Boolean).map(part => '<div class="practical-item">' +
                readable(part) + '</div>').join('');
        return '<section class="overview-practical" aria-label="Estilo de viaje y consejos prácticos">' +

            '<div class="overview-practical-grid' + (indicators ? ' practical-indicators' : '') + '">' +
            content + '</div></section>';
    }
    function overviewStays(t, inline = false) {
        const nights = t.bases.reduce((sum, base) => sum + Number(base[1] || 0), 0);
        const caption = nights + ' ' + (nights === 1 ? 'noche' : 'noches') + ', ' + t.bases.length + (t.bases.length === 1 ? ' alojamiento' : ' alojamientos');
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
    // Estructura común de navegación: la información pendiente nunca oculta secciones.
    function tripNavigation(t, id, expanded = false) {
        const sections = sectionDefinitions.map(([id, label]) => [id, label]);
        const visible = expanded ? sections : sections.filter(([key]) =>
            !(['temporadas','experiencias','reservas','traslados'].includes(key)) ||
            (key === 'temporadas' && t.seasonality) ||
            (key === 'experiencias' && t.experiences?.length) ||
            (key === 'reservas' && t.planningDetails && t.reservations?.length) ||
            (key === 'traslados' && t.majorTransport?.length));
        return '<nav class="subnav" aria-label="Secciones del viaje"><div>' +
            visible.map(([key,label]) => '<a href="#viaje/' + esc(id) + '/' + key + '">' + label + '</a>').join('') +
            (t.sources?.length ? '<a href="#viaje/' + esc(id) + '/fuentes">Fuentes</a>' : '') +
            '</div><select aria-label="Cambiar destino" id="dest-select">' +
            trips.map(x => '<option value="' + esc(x.id) + '"' + (x.id === id ? ' selected' : '') + '>' +
                esc((x.flag ? x.flag + ' ' : '') + x.name) + '</option>').join('') +
            '</select></nav>';
    }
    function bindTripSelector() {
        document.querySelector('#dest-select')?.addEventListener('change', e => {
            location.hash = 'viaje/' + e.target.value;
        });
    }
    const sectionDefinitions = [
        ['plan', 'Panorama', 'La esencia de tu recorrido.'],
        ['mapa', 'Mapa', 'Tu viaje en el mapa.'],
        ['temporadas', 'Temporadas', 'Temporadas recomendadas.'],
        ['experiencias', 'Experiencias', 'Experiencias para recordar.'],
        ['reservas', 'Reservaciones', 'Reservaciones importantes.'],
        ['traslados', 'Traslados', 'Movilidad y conexiones.'],
        ['alojamientos', 'Dónde dormir', 'Tus alojamientos.'],
        ['dias', 'Día por día', 'Día por día.'],
        ['costes', 'Presupuesto', 'Lo que cuesta el viaje.']
    ];
    // All trips use the master page shell. Missing data only changes section content.
    function tripShell(t, id, content) {
        return tripHero(t, id) + tripNavigation(t, id, true) + content;
    }
    function pendingPanel(id, title, cssClass, label = 'Por definir') {
        return '<section class="section wrap atlas-panel-section" id="' + id + '">' +
            '<article class="panel ' + cssClass + '"><h2>' + esc(title) +
            '</h2><p class="draft-pending">' + esc(label) + '</p></article></section>';
    }
    function sectionReady(t, key) {
        switch (key) {
            case 'plan':
                return true; // The master overview renders defined and pending fields incrementally.
            case 'mapa': return true;
            case 'temporadas': return !!t.seasonality?.months;
            case 'experiencias': return true;
            case 'reservas': return true;
            case 'traslados': return true;
            case 'alojamientos': return true;
            case 'dias': return true;
            case 'costes': return true;
            default: return false;
        }
    }
    const masterPanelClass = {
        plan: 'overview overview-editorial',
        mapa: 'trip-map-section',
        temporadas: 'seasonality-panel',
        experiencias: 'experience-panel',
        reservas: 'reservation-panel',
        traslados: 'major-transport',
        alojamientos: 'hotel-grid',
        dias: 'itinerary-panel',
        costes: 'budget-section-panel'
    };
    function heroMetaIcon(type) {
        const paths = {
            calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18"/>',
            duration: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
            work: '<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/>',
            lodging: '<path d="M3 18V9m0 7h18m0 2V9M3 11h18M6 11V7h6v4"/>'
        };
        return '<svg class="hero-meta-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + paths[type] + '</svg>';
    }
    function tripHero(t, id) {
        const rank = trips.indexOf(t) + 1;
        const heroLabel = t.id === 'emilia-romana' ? 'Italia en tren' : (t.heroEyebrow || t.tag || 'En planeación');
        return [
            '<section class="triphero triphero-split"><div class="triphero-split-info">',
            '<div class="triphero-split-info-inner">',
            `<a class="breadcrumb" href="#inicio"><span aria-hidden="true">←</span> Regresar</a>`,
            `<p class="eyebrow hero-eyebrow">Viaje ${String(rank).padStart(2, '0')} · ${esc(heroLabel)}</p>`,
            `<h1>${esc(t.name)}</h1>`,
            '<div class="hero-meta">',
            `<span>${heroMetaIcon('calendar')}${t.start && t.end ? range(t) : 'Por definir'}</span>`,
            `<span>${heroMetaIcon('duration')}${t.days.length ? t.days.length + ' días naturales' : 'Duración por definir'}</span>`,
            `<span>${heroMetaIcon('work')}${t.work === null ? 'Días laborales por definir' : t.work + ' días laborales'}</span>`,
            `<span>${heroMetaIcon('lodging')}${t.heroLodgingSummary ? esc(t.heroLodgingSummary) : t.bases.length ? esc(baseLabel(t.bases)) : 'Alojamientos por definir'}</span>`,
            '</div></div></div>',
            `<div class="triphero-split-photo">${t.cover ? img(covers[id], '', true) : ''}</div>`,
            '</section>'
        ].join('');
    }
    const legacyAdviceTripIds = new Set(['espana-portugal', 'espana', 'munich', 'munich-viena', 'portugal', 'suiza', 'suiza-italia', 'grecia', 'sicilia', 'washington', 'turquia', 'nueva-orleans', 'vegas', 'marruecos', 'san-antonio', 'puglia-matera']);
    function fullSectionMarkup(t, id, low, high) {
        const complete = canRenderFullTrip(t);
        const masterOverview = !legacyAdviceTripIds.has(t.id) || !complete;
        const pending = () => '<span class="draft-pending">Por definir</span>';
        const hasBases = t.bases.length > 0;
        const overviewIntro = typeof t.intro === 'string' && t.intro.trim()
            ? highlightWords(t.intro, t.introHighlights) : pending();
        const overviewClimate = typeof t.climate === 'string' && t.climate.trim()
            ? climateCard(t) : '<article class="overview-climate-card"><h3>' +
                overviewIcon('sun') + ' Clima y luz</h3><div class="fact-copy"><p>' + pending() + '</p></div></article>';
        const overviewAdvice = Array.isArray(t.practicalIndicators) && t.practicalIndicators.length
            ? practicalAdvice(t) : '<section class="overview-practical" aria-label="Estilo de viaje y consejos prácticos">' +
                '<div class="overview-practical-grid"><p>' + pending() + '</p></div></section>';
        const overviewBases = hasBases ? overviewStays(t, true) :
            '<div class="overview-stays overview-stays-inline"><div class="overview-stays-heading">' +
            '<h3 class="overview-subheading">' + overviewIcon('bed') +
            ' Dónde dormirás</h3></div><p>' + pending() + '</p></div>';
        const overviewSummary = window.AtlasBudget?.currentSummary?.(t);
        const hasPricedEntries = Boolean(t.majorTransport?.length || t.expenses?.length);
        const overviewPrice = hasPricedEntries && overviewSummary && Number.isFinite(overviewSummary.knownTotalMXN)
            ? money(overviewSummary.knownTotalMXN) : pending();
        const forecast = masterOverview && t.budgetPreliminary && Number.isFinite(t.budgetPreliminary.low) && Number.isFinite(t.budgetPreliminary.high) && t.budgetPreliminary.low > 0 && t.budgetPreliminary.high >= t.budgetPreliminary.low;
        const dynamicEstimate = masterOverview ? window.AtlasBudget?.planningEstimate?.(t) : null;
        const featuredPrice = dynamicEstimate ? money(dynamicEstimate.low) + '–' + money(dynamicEstimate.high) : forecast ? money(t.budgetPreliminary.low) + '–' + money(t.budgetPreliminary.high) : overviewPrice;
        const budgetContext = forecast ? 'MXN · 1 persona · proyección global, no cotización' : 'MXN · 1 persona · estimación parcial del viaje';
        const fxInfo = masterOverview && t.exchangeRateSnapshot?.date && t.exchangeRates ? Object.entries(t.exchangeRates).filter(([code,rate]) => /^[A-Z]{3}$/.test(code) && Number.isFinite(rate) && rate > 0).map(([code,rate]) => code + ' 1 ≈ $' + rate.toFixed(4) + ' MXN') : [];
        const fxSource = t.exchangeRateSnapshot?.sources?.JPY || t.exchangeRateSnapshot?.sources?.EUR || t.exchangeRateSnapshot?.sources?.USD;
        const fxSourceLink = typeof fxSource === 'string' && /^https:\/\//.test(fxSource) ? ' · <a href="' + esc(fxSource) + '" target="_blank" rel="noopener noreferrer">Fuente</a>' : '';
        const fxMarkup = fxInfo.length ? '<div class="budget-exchange"><div class="budget-exchange-label">Tipo de cambio de referencia · ' + esc(t.exchangeRateSnapshot.date) + fxSourceLink + '</div><div class="budget-exchange-values">' + fxInfo.map(x => '<span>' + esc(x) + '</span>').join('') + '</div></div>' : '';
        // Render detailed day cards as soon as their data exists, even for draft trips.
        // A draft status must not force the entire itinerary into plain placeholders.
        const readyDays = (t.days || []).filter(d => d?.date && Number.isInteger(d.n) && Array.isArray(d.places) && d.am && d.pm && d.night);
        const completeDays = readyDays.length > 0;
        const renderedDays = () => (t.days || []).map((d, index) =>
            readyDays.includes(d) ? day(d) : '<article class="day panel"><h3>' + esc(d?.title || 'Día ' + (d?.n || index + 1)) +
            '</h3><p>' + esc(d?.date || 'Fecha por definir') + '</p><p class="draft-pending">En preparación</p></article>').join('');
        const partialDays = () => t.days.length ? t.days.map((d, index) =>
            '<article class="day panel"><h3>' + esc(d?.title || 'Día ' + (d?.n || index + 1)) +
            '</h3><p>' + esc(d?.date || 'Fecha por definir') + '</p>' +
            (d?.base ? '<p>' + esc(d.base) + '</p>' : '') + '</article>').join('') :
            '<p class="draft-pending">Por definir</p>';
        const partialBudget = () => {
            if (t.majorTransport.length || t.expenses.length) return window.AtlasBudgetTable.render(t) ||
                '<p class="draft-pending">Por cotizar</p>';
            if (t.costs.length) return '<div class="budgetgrid"><div class="scrolltable"><table><thead><tr><th>Concepto</th><th>Desde</th><th>Hasta</th></tr></thead><tbody>' +
                t.costs.map(row => '<tr><td>' + esc(row[0]) + '</td><td>' +
                    (Number.isFinite(row[1]) ? money(row[1]) : 'Por cotizar') + '</td><td>' +
                    (Number.isFinite(row[2]) ? money(row[2]) : 'Por cotizar') +
                    '</td></tr>').join('') + '</tbody></table></div></div>';
            return '<p class="draft-pending">Por definir</p>';
        };
        const parts = {
            plan: () => [
            `<section class="wrap" id="plan">`,
            `<div class="overview overview-editorial">`,
            `<div class="overview-intro">`,
            `<div class="overview-kicker">${overviewIcon('compass')}<span>Panorama del viaje</span></div>`,
            `<h2 class="overview-heading">La esencia de tu recorrido.</h2>`,
            `<p class="lead">${overviewIntro}</p>`,
            `${masterOverview ? (complete ? practicalAdvice(t) : overviewAdvice) : ''}`,
            `${masterOverview ? '' : `<div class="overview-route-block"><h3 class="overview-subheading">${overviewIcon('pin')} Ciudades del recorrido</h3><div class="trip-route" aria-label="Ciudades del recorrido">${t.routeCities.map(city => `<span class="trip-route-city">${esc(city)}</span>`).join('')}</div></div>`}`,
            `${masterOverview ? (complete ? overviewStays(t, true) : overviewBases) : ''} `,
            `</div>`,
            `${masterOverview ? '' : overviewStays(t)}`,
            `${masterOverview ? '<div class="overview-side">' : ''}`,
            `<aside class="budget-teaser">`,
            `<div>`,
            `<span class="eyebrow">${overviewIcon('wallet')} Tu inversión aproximada</span>`,
            `<strong>${featuredPrice}</strong>`,
            `<p class="budget-context">${esc(budgetContext)}</p>`,
            `<a class="budget-detail-link" href="#viaje/${id}/costes">Ver desglose del presupuesto ${overviewIcon('arrow')}</a>`,
            `${fxMarkup}`,
                        `</div>`,
            `</aside>`,
            `${masterOverview ? (complete ? climateCard(t) : overviewClimate) + '</div>' : ''}`,
            `</div>`,
            ].join(''),
            mapa: () => [
            `${window.AtlasTravel.mapSection(t)}`,
            ].join(''),
            temporadas: () => [
            `${seasonality(t)}`,
            ].join(''),
            experiencias: () => [
            `${experiencePanel(t)}`,
            ].join(''),
            reservas: () => [
            `${reservationPlanning(t)}`,
            ].join(''),
            traslados: () => [
            `${t.majorTransport?.length ? window.AtlasMajorTransport.render(t) : (canRenderFullTrip(t) ? '<section id="traslados" class="section wrap atlas-panel-section">' + (railPlanning(t) || '<article class="panel major-transport"><h2>Traslados principales.</h2><p class="draft-pending">Por definir</p></article>') + '</section>' : '<section class="major-transport" id="traslados"><div class="mt-heading"><span class="mt-kicker">Movilidad y conexiones</span><h2>Traslados principales.</h2></div><p class="draft-pending">Por definir</p></section>')}`,
            ].join(''),
            alojamientos: () => [
            `${legacyAdviceTripIds.has(t.id) && canRenderFullTrip(t) ? adviceCards(t) : ''}`,
            `<article class="panel" id="alojamientos" style="margin-top:20px">`,
            `<div class="hotel-section-heading"><div class="hotel-section-kicker">${overviewIcon('bed')}<span>Tu estancia</span></div><h2>Tus alojamientos.</h2></div>`,
            `${stayParagraphs(id)}</article>${!t.planningDetails && canRenderFullTrip(t) ? `<div class="source-warning"><strong>Antes de confirmar el viaje:</strong> confirma los vuelos para estas fechas y si el regreso llega a MEX ese mismo día. Los horarios de transportes son referencias. El gasto diario mostrado es una orientación de comidas, accesos y movilidad del día; no se suma al total, que ya los incluye por categorías.</div>` : ''}</section>`,
            ].join(''),
            dias: () => [
            `${complete && completeDays ? variants(t) + railAppendix(t) : ''}<section class="section wrap atlas-panel-section" id="dias"><article class="panel itinerary-panel">`,
            `<div class="section-title">`,
            `<div>`,
            `<p class="eyebrow orange atlas-section-kicker atlas-editorial-kicker"><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18M8 15h3m-3 3h7"/></svg><span>Itinerario</span></p>`,
            `<h2>Día por día.</h2>`,
            `</div>`,
            `<div>`,
            `${completeDays ? '<button class="printbutton" id="expand">Contraer todos los días</button> <button class="printbutton" id="print">Imprimir / guardar PDF</button>' : ''}`,
            `</div>`,
            `</div>`,
            `<div class="itinerary-layout">`,
            `${completeDays ? '<aside class="daynav" aria-label="Días del itinerario">' + t.days.map(d => '<a href="#viaje/' + id + '/dia-' + d.n + '"><strong>Día ' + d.n + ' · ' + short(d.date) + '</strong>' + esc(d.base) + (hotelForDay(t,d) ? ' · ' + esc(hotelForDay(t,d).name) : '') + '</a>').join('') + '</aside>' : ''}`,
            `<div class="days">${completeDays ? renderedDays() : partialDays()}</div>`,
            `</div>`,
            `</article></section>`,
            ].join(''),
            costes: () => [
            `${complete ? optionsSection(t) : ''}<section class="section wrap atlas-panel-section" id="costes"><article class="panel budget-section-panel">`,
            `<div class="section-title">`,
            `<div>`,
            `<p class="eyebrow orange atlas-section-kicker atlas-editorial-kicker"><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18m-6 5h3"/></svg><span>Una persona · MXN</span></p>`,
            `<h2 class="atlas-editorial-title">Lo que cuesta el viaje.</h2>`,
            `</div>`,
            `<p>${!complete ? 'Los importes registrados son parciales. Los costos pendientes aún no forman un total definitivo.' : t.majorTransport?.length ? 'Consulta los gastos estimados del viaje en pesos mexicanos. El total se completará conforme se definan los costos pendientes.' : 'Rango para planear con habitación privada, alimentación normal y principales visitas. No presupone ofertas disponibles.'}</p>`,
            `</div>`,
            `${!complete ? partialBudget() : (t.majorTransport?.length ? window.AtlasBudgetTable.render(t) : '')}${complete && !t.majorTransport?.length ? '<div class="budgetgrid"><div class="scrolltable"><table><thead><tr><th>Concepto</th><th>Desde</th><th>Hasta</th></tr></thead><tbody>' + t.costs.map(x => '<tr><td>' + esc(x[0]) + '</td><td>' + (x[1] === null ? 'Por cotizar' : money(x[1])) + '</td><td>' + (x[2] === null ? 'Por cotizar' : money(x[2])) + '</td></tr>').join('') + '<tr class="totalrow"><td>' + (t.budgetPreliminary ? 'Rango global preliminar conservado' : 'Total completo') + '</td><td>' + money(low) + '</td><td>' + money(high) + '</td></tr></tbody></table></div></div>' + knownCostPanel(t) : ''}</article></section>`,
            ].join(''),
            fuentes: () => [
            `${t.sources?.length ? `<section class="section wrap" id="fuentes">` : ''}`,
            `${t.sources?.length ? `<p class="eyebrow orange">Fuentes y reservas</p>` : ''}`,
            `${t.sources?.length ? `<h2>Consulta el canal oficial.</h2>` : ''}`,
            `${t.sources?.length ? `<div class="sources">${t.sources.map(x => `<a href="${esc(x[1])}" target="_blank" rel="noopener">${esc(x[0])}</a>`).join('')}</div>` : ''}`,
            `${t.sources?.length ? `<p class="tiny">${esc(t.sourceNote || 'Planeación de referencia: 1 de octubre de 2026. Textos y galerías revisados el 2 de octubre.')} Comprueba calendarios y tarifas para tus fechas antes de comprar; las fotografías muestran los lugares, no el clima que tendrás durante el viaje.</p>` : ''}`,
            `${t.sources?.length ? '</section>' : ''}`
            ].join('')
        };
        return sectionDefinitions.map(([id, label, title]) => {
            if (canRenderFullTrip(t) || sectionReady(t, id)) return parts[id]();
            return pendingPanel(id, title, masterPanelClass[id]);
        }).join('') + parts.fuentes();
    }
    // Presentación del hero: fuentes existentes, precarga gradual y pausa fuera de pantalla.
    function mountHeroSlideshow(trip) {
        const frame = typeof main.querySelector === 'function' ? main.querySelector('.triphero-split-photo') : null;
        if (!frame || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
        const sources = [...new Set([trip.cover, ...(trip.days || []).flatMap(day => day.places || [])]
            .map(key => photos[key]?.src).filter(Boolean))];
        if (sources.length < 2) return () => {};
        const base = frame.querySelector('img');
        if (!base) return () => {};
        const layers = [0, 1].map(() => {
            const node = document.createElement('img');
            node.className = 'triphero-slide';
            node.alt = '';
            node.setAttribute('aria-hidden', 'true');
            node.decoding = 'async';
            frame.appendChild(node);
            return node;
        });
        let index = 0, front = -1, tick = null, fadeTimer = null, generation = 0, loading = false;
        let inView = false;
        const zoom = (node, number) => {
            node.classList.remove('triphero-zoom-in', 'triphero-zoom-out');
            void node.offsetWidth;
            node.classList.add(number % 2 ? 'triphero-zoom-out' : 'triphero-zoom-in');
        };
        const advance = () => {
            if (!inView || document.hidden || loading || !frame.isConnected) return;
            loading = true;
            const next = (index + 1) % sources.length;
            const gen = generation;
            if (next === 0) {
                zoom(base, next);
                if (front >= 0) layers[front].classList.remove('is-visible');
                index = 0;
                front = -1;
                loading = false;
                return;
            }
            const preload = new Image();
            preload.onload = () => {
                if (generation !== gen || !inView || document.hidden) return;
                const target = front === 0 ? 1 : 0;
                const incoming = layers[target];
                const outgoing = front >= 0 ? layers[front] : null;
                incoming.classList.remove('is-visible', 'triphero-zoom-in', 'triphero-zoom-out');
                incoming.src = sources[next];
                incoming.style.zIndex = '2';
                if (outgoing) outgoing.style.zIndex = '1';
                void incoming.offsetWidth;
                incoming.classList.add('is-visible');
                zoom(incoming, next);
                if (fadeTimer !== null) clearTimeout(fadeTimer);
                fadeTimer = setTimeout(() => {
                    if (generation === gen && outgoing) outgoing.classList.remove('is-visible');
                    fadeTimer = null;
                }, 750);
                front = target;
                index = next;
                loading = false;
            };
            preload.onerror = () => { if (generation === gen) loading = false; };
            preload.src = sources[next];
        };
        const pause = () => {
            generation++;
            if (tick !== null) { clearInterval(tick); tick = null; }
            if (fadeTimer !== null) { clearTimeout(fadeTimer); fadeTimer = null; }
            loading = false;
        };
        const sync = () => {
            if (inView && !document.hidden) {
                if (tick === null) {
                    if (index === 0) zoom(base, 0);
                    tick = setInterval(advance, 4000);
                }
            } else pause();
        };
        const onVisibility = () => sync();
        document.addEventListener('visibilitychange', onVisibility);
        const observer = new IntersectionObserver(entries => {
            inView = entries[0]?.isIntersecting || false;
            sync();
        }, { threshold: 0.1 });
        observer.observe(frame);
        return () => {
            pause();
            observer.disconnect();
            document.removeEventListener('visibilitychange', onVisibility);
        };
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
        const [low, high] = canRenderFullTrip(t) || sectionReady(t, 'costes') ? sums(t) : [null, null];
        const content = fullSectionMarkup(t, id, low, high);
        main.innerHTML = tripShell(t, id, content);
        window.AtlasGallery.init(main);
        mountView(t);
        disposeView.push(mountHeroSlideshow(t));
        if (t.mapPoints?.some(p => Array.isArray(p.coords) && p.coords.length === 2 && p.coords.every(Number.isFinite))) window.AtlasTravel.initMap(t);
        bindTripSelector();
        document.querySelector('#expand')?.addEventListener('click', e => {
            const all = [...document.querySelectorAll('.day')];
            const opening = all.some(x => !x.open);
            all.forEach(x => {
                x.open = opening;
                if (opening) loadGallery(x);
            });
            e.target.textContent = opening ? 'Contraer todos los días' : 'Desplegar todos los días';
        });
        document.querySelector('#print')?.addEventListener('click', printGuide);
    }
    return { tripPage, cleanup };
};
