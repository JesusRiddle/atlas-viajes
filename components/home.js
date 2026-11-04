window.AtlasHome = function (ctx) {
    'use strict';
    const { trips, photos, main, covers, esc, range, price, img, readable, highlightWords, familyLabel, baseLabel, canRenderFullTrip } = ctx;
    // Fotos ya registradas en los días del viaje; no se descargan hasta hacer hover.
    const cardSlides = new Map(trips.map(trip => {
        const keys = [covers[trip.id], ...(trip.days || []).flatMap(day => day.places || [])];
        const seen = new Set();
        const sources = keys.map(key => photos[key]?.src).filter(src => {
            if (!src || seen.has(src)) return false;
            seen.add(src);
            return true;
        });
        return [trip.id, sources];
    }));
    const primaryTrips = trips.filter(t => t.homeGroup !== 'ideas');
    const ideaTrips = trips.filter(t => t.homeGroup === 'ideas');
    const hoverTimers = new Set();
    function mountCoverSlideshow() {
        // Do not block setup based on media-query pointer detection.
        // Mouse events determine whether a desktop pointer is actually used.
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        document.querySelectorAll('#viajes .atlas-home-card, #ideas-viajes .atlas-home-card').forEach(card => {
            const tripId = card.getAttribute('href')?.replace('#viaje/', '');
            const sources = cardSlides.get(tripId) || [];
            const frame = card.querySelector('.cardphoto');
            if (!frame || sources.length < 2) return;
            const original = frame.querySelector('img');
            // Dos capas permiten fundir entre fotos sin reemplazar la fuente de la capa visible.
            const layers = [0, 1].map(() => {
                const layer = document.createElement('img');
                layer.className = 'cardphoto-slide';
                layer.alt = '';
                layer.setAttribute('aria-hidden', 'true');
                layer.decoding = 'async';
                frame.insertBefore(layer, frame.querySelector('.rank'));
                return layer;
            });
            let index = 0, active = -1, timer = null, token = 0, busy = false;
            const failedSources = new Set();
            const zoom = (image, out) => {
                image.classList.remove('cardphoto-zoom-cycle', 'cardphoto-zoom-out');
                void image.offsetWidth;
                image.classList.add('cardphoto-zoom-cycle');
                if (out) image.classList.add('cardphoto-zoom-out');
            };
            const stop = () => {
                token++;
                if (timer !== null) { clearInterval(timer); hoverTimers.delete(timer); timer = null; }
                index = 0;
                active = -1;
                busy = false;
                layers.forEach(layer => layer.classList.remove('visible', 'cardphoto-zoom-cycle', 'cardphoto-zoom-out'));
                original.classList.remove('cardphoto-zoom-cycle', 'cardphoto-zoom-out');
            };
            const advance = () => {
                if (!frame.isConnected || document.hidden) { stop(); return; }
                if (busy) return;
                busy = true;
                // Skip images that failed to load; never block the carousel on one URL.
                let next = (index + 1) % sources.length;
                let checked = 0;
                while (failedSources.has(sources[next]) && checked < sources.length) {
                    next = (next + 1) % sources.length;
                    checked++;
                }
                if (checked >= sources.length || next === index) { busy = false; return; }
                const currentToken = token;
                if (next === 0) {
                    // Desvanecer la última foto y revelar la portada original.
                    zoom(original, false);
                    layers.forEach(layer => layer.classList.remove('visible'));
                    index = 0;
                    active = -1;
                    busy = false;
                    return;
                }
                const preload = new Image();
                preload.onload = () => {
                    if (currentToken !== token) return;
                    const incomingIndex = active === 0 ? 1 : 0;
                    const incoming = layers[incomingIndex];
                    const outgoing = active >= 0 ? layers[active] : original;
                    incoming.classList.remove('visible', 'cardphoto-zoom-cycle', 'cardphoto-zoom-out');
                    incoming.src = sources[next];
                    // Situar la capa entrante por encima y comenzar desde opacidad cero.
                    incoming.style.zIndex = '2';
                    if (outgoing !== original) outgoing.style.zIndex = '1';
                    void incoming.offsetWidth;
                    incoming.classList.add('visible');
                    zoom(incoming, next % 2 === 1);
                    if (outgoing !== original) outgoing.classList.remove('visible');
                    active = incomingIndex;
                    index = next;
                    busy = false;
                };
                preload.onerror = () => {
                    if (currentToken !== token) return;
                    failedSources.add(sources[next]);
                    busy = false;
                    // Try the next photograph without waiting another full interval.
                    queueMicrotask(advance);
                };
                preload.src = sources[next];
            };
            // Activar desde toda la tarjeta, no solo desde la fotografía.
            // El temporizador se detiene al abandonar la tarjeta o cambiar de página.
            card.addEventListener('mouseenter', () => {
                if (timer !== null) return;
                token++;
                zoom(original, false);
                timer = setInterval(advance, 2000);
                hoverTimers.add(timer);
            });
            card.addEventListener('mouseleave', stop);
            card.addEventListener('click', stop);
            document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
        });
    }
    function cardCountries(flag) {
        const symbols = Array.from(String(flag || ''));
        const names = new Intl.DisplayNames(['es'], { type: 'region' });
        const countries = [];
        for (let i = 0; i + 1 < symbols.length; i++) {
            const a = symbols[i].codePointAt(0), b = symbols[i + 1].codePointAt(0);
            if (a >= 0x1f1e6 && a <= 0x1f1ff && b >= 0x1f1e6 && b <= 0x1f1ff) {
                const code = String.fromCharCode(a - 0x1f1e6 + 65, b - 0x1f1e6 + 65);
                countries.push(names.of(code));
                i++;
            }
        }
        return countries.join(' + ');
    }
    // Los días laborales aún por confirmar no deben ocultar un viaje con ruta y presupuesto.
    const homeReady = t => canRenderFullTrip(t) || (t?.start && t.end &&
        t?.routeCities?.length &&
        (Number.isFinite(window.AtlasBudget?.planningEstimate?.(t)?.low) ||
         (Array.isArray(t.budgetRange) && t.budgetRange.length === 2 &&
          t.budgetRange.every(Number.isFinite))));
    // New-trip home prices are derived from the same ledger used in Presupuesto.
    // No flight is booked automatically: the first quoted option is a dated reference.
    const homePrice = t => {
        const estimate = window.AtlasBudget?.planningEstimate?.(t);
        if (!estimate) return homeReady(t) ? price(t) : null;
        const travelers = Number.isInteger(t.travelerCount) && t.travelerCount > 0 ? t.travelerCount : null;
        if (travelers === null) return '$' + estimate.low.toLocaleString('es-MX') + '–$' + estimate.high.toLocaleString('es-MX');
        const perPerson = amount => (amount / travelers).toLocaleString('es-MX', { maximumFractionDigits: 0 });
        return String.fromCharCode(36) + perPerson(estimate.low) + '–' + String.fromCharCode(36) + perPerson(estimate.high);
    };
    function card(t, i) {
        const title = esc(t.name);
        const country = cardCountries(t.flag);
        const cities = (t.routeCities || []).filter(Boolean).map(esc).join(' · ');
        const dateText = t.start && t.end ? range(t) : '';
        const introduction = (typeof t.introShort === 'string' && t.introShort.trim()) ||
            (typeof t.intro === 'string' && t.intro.trim()) || '';
        const travelers = Number.isInteger(t.travelerCount) && t.travelerCount > 0;
        const forecast = window.AtlasBudget?.planningEstimate?.(t);
        const hasRange = Array.isArray(t.budgetRange) && t.budgetRange.length === 2 &&
            t.budgetRange.every(n => Number.isFinite(n) && n > 0);
        const hasEstimate = (forecast && Number.isFinite(forecast.low) && forecast.low > 0) || hasRange || (Array.isArray(t.expenses) && t.expenses.some(e => e.cost?.amount > 0)) ||
            (Array.isArray(t.costs) && t.costs.some(row => Number.isFinite(row[1]) && row[1] > 0));
        const amount = hasEstimate ? homePrice(t) : null;
        return '<a class="tripcard atlas-home-card" href="#viaje/' + esc(t.id) + '" aria-labelledby="card-' + esc(t.id) + '">' +
            '<div class="cardphoto">' + (covers[t.id] ? img(covers[t.id], '', false, false, true) :
                '<div class="home-photo-empty" aria-hidden="true"></div>') +
            '<span class="rank">' + (i + 1) + '</span></div>' +
            '<div class="cardbody"><div class="card-overview">' +
            (country || t.days?.length ? '<span class="card-overview-location">' +
                (country ? esc(country) : '') + (country && t.days?.length ? ' · ' : '') +
                (t.days?.length ? t.days.length + ' días' : '') + '</span>' : '') +
            (dateText ? '<span class="carddates">' + dateText + '</span>' : '') +
            '</div><h3 id="card-' + esc(t.id) + '">' + title + '</h3>' +
            (cities ? '<p class="card-route" title="' + esc(cities) + '">' + cities + '</p>' : '') +
            (Number.isInteger(t.work) ? '<div class="cardfacts"><span>' + t.work + ' laborales</span></div>' : '') +
            (introduction ? '<p class="card-trip-intro">' + esc(introduction) + '</p>' : '') +
            (amount ? '<div class="cardbottom"><div class="card-price"><small>' +
                (travelers ? 'Presupuesto estimado por persona' : 'Presupuesto estimado del viaje') +
                '</small><strong>' + amount + ' <span class="card-currency">MXN</span></strong></div>' +
                '<span class="card-arrow" aria-hidden="true">↗</span></div>' : '') +
            '</div></a>';
    }
    function ideaCard(t) {
        const cities = (t.routeCities || []).filter(Boolean).map(esc).join(' · ');
        return '<a class="tripcard atlas-home-card idea-tripcard" href="#viaje/' + esc(t.id) + '">' +
            '<div class="cardphoto">' + (covers[t.id] ? img(covers[t.id], '', false, false, true) : '<div class="draft-card-cover">Idea de viaje</div>') + '</div>' +
            '<div class="cardbody"><p class="idea-tripcard-status">Idea por actualizar</p>' +
            '<h3>' + esc(t.flag || '') + ' ' + esc(t.name) + '</h3>' +
            (cities ? '<p class="card-route">' + cities + '</p>' : '') +
            '<span class="idea-tripcard-open">Explorar idea <span aria-hidden="true">↗</span></span>' +
            '</div></a>';
    }
    function comparison() {
        const items = primaryTrips.filter(homeReady);
        return '<section class="section wrap home-comparison" id="comparar">' +
            '<div class="section-title"><div><p class="eyebrow orange">Compara tus opciones</p>' +
            '<h2>Los viajes, lado a lado.</h2></div></div>' +
            '<div class="scrolltable comparison-scroll" tabindex="0" role="region" aria-label="Tabla comparativa de viajes; desplázate horizontalmente para ver todas las columnas">' +
            '<table class="comparison-table"><thead><tr><th scope="col">Destino</th><th scope="col">Fechas</th>' +
            '<th scope="col">Días <small>/ laborales</small></th><th scope="col">Bases</th><th scope="col">Ritmo</th>' +
            '<th scope="col" title="Número de personas contempladas en el presupuesto">Personas</th><th scope="col">Clima</th><th scope="col">Presupuesto</th></tr></thead><tbody>' +
            items.map((t, i) => '<tr><td class="comparison-destination"><a href="#viaje/' + esc(t.id) + '">' +
                '<span class="comparison-rank">' + (i + 1) + '</span><span>' + esc(t.name) + '</span></a></td>' +
                '<td class="comparison-dates">' + range(t) + '</td><td class="comparison-number">' + t.days.length +
                ' <small>/ ' + (Number.isInteger(t.work) ? t.work : 'Por definir') + '</small></td><td class="comparison-number">' + t.bases.length + '</td>' +
                '<td>' + esc(t.profile.pace) + '</td><td class="comparison-number">' + (Number.isInteger(t.travelerCount) && t.travelerCount > 0 ? t.travelerCount : 'Por definir') + '</td>' +
                '<td>' + esc(t.profile.weather) + '</td><td class="comparison-price"><strong>' + (t.travelerCount ? homePrice(t) : price(t)) +
                ' <small>MXN</small></strong>' +
                '</td></tr>').join('') + '</tbody></table></div></section>';
    }
    function home() { document.title = 'Atlas de viajes · Viajes 2026–2027'; main.innerHTML = `<section class="home-intro wrap atlas-home-hero atlas-home-hero-immersive" aria-labelledby="atlas-home-title"><div class="intro-photo atlas-home-hero-image"><img src="photos/atlas-world-hero-horizontal.webp" onerror="this.onerror=null;this.src=\'photos/atlas-world-hero.webp\'" alt="Ilustración de destinos entre montañas, ciudades y costas" loading="eager" fetchpriority="high" decoding="async"><div class="photo-overlay"></div><div class="atlas-home-hero-copy"><p class="eyebrow">ATLAS DE VIAJES · 2026–2027</p><h1 id="atlas-home-title">La vida es un viaje.</h1><p class="atlas-home-lead">Rutas desde CDMX, itinerarios detallados y presupuestos para elegir tu próxima aventura.</p></div></div></section><section class="section wrap" id="viajes" style="padding-top:25px"><div class="section-title"><div><p class="eyebrow orange">Caminos por descubrir</p><h2>Elige tu siguiente historia.</h2></div><p>Entre ciudades históricas, mercados, palacios y paisajes de montaña, encuentra la ruta que más te inspira.</p></div><div class="cards">${primaryTrips.map(card).join('')}</div></section>${comparison()}${ideaTrips.length ? '<section class="section wrap home-ideas" id="ideas-viajes" aria-labelledby="ideas-viajes-title"><div class="section-title"><div><p class="eyebrow orange">Archivo de inspiración</p><h2 id="ideas-viajes-title">Ideas generales de viajes.</h2></div><p>Rutas antiguas por rediseñar y actualizar. Sus fechas, itinerarios y presupuestos son referencias históricas, no planes vigentes.</p></div><div class="cards ideas-cards">' + ideaTrips.map(ideaCard).join('') + '</div></section>' : ''}`; mountCoverSlideshow(); }
    return { card, comparison, home };
};
