window.AtlasHome = function (ctx) {
    'use strict';
    const { trips, photos, main, covers, esc, range, price, img, readable, highlightWords, familyLabel, baseLabel, canRenderFullTrip } = ctx;
    function draftCard(t, i) {
        return '<a class="tripcard tripcard-draft" href="#viaje/' + esc(t.id) + '">' +
            '<div class="draft-card-cover"><span class="rank">' + (i + 1) + '</span><span>Destino por definir</span></div>' +
            '<div class="cardbody"><p class="eyebrow">En planeación</p><h3>' + esc(t.flag || '') + ' ' + esc(t.name) +
            '</h3><p>Fechas · Por definir</p><p>Itinerario · Por definir</p><div class="cardbottom"><strong>Presupuesto por definir</strong></div></div></a>';
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
    function card(t, i) {
        if (!canRenderFullTrip(t)) return draftCard(t, i);
        const title = esc(t.name);
        const country = cardCountries(t.flag);
        const cities = t.routeCities.map(x => esc(x)).join(' · ');
        const lodging = t.lodgingSummary || baseLabel(t.bases.length);
        return '<a class="tripcard atlas-home-card" href="#viaje/' + esc(t.id) + '" aria-labelledby="card-' + esc(t.id) + '">' +
            '<div class="cardphoto">' + img(covers[t.id], '', false, false, true) + '<span class="rank">' + (i + 1) + '</span></div>' +
            '<div class="cardbody"><div class="card-overview"><span class="card-overview-location">' + (country ? esc(country) + ' · ' : '') + t.days.length +
            ' días</span><span class="carddates">' + range(t) + '</span></div>' +
            '<h3 id="card-' + esc(t.id) + '">' + title + '</h3>' +
            '<p class="card-route" title="' + esc(cities) + '">' + cities + '</p>' +
            '<div class="cardfacts"><span>' + t.work + ' laborales</span><span title="' + esc(lodging) + '">' +
            esc(lodging) + '</span></div>' +
            '<div class="cardbottom"><div class="card-price"><small>Presupuesto estimado por persona' +
            (t.budgetPreliminary ? ' · preliminar' : '') + '</small>' +
            '<strong>' + price(t) + ' <span class="card-currency">MXN</span></strong></div>' +
            '<span class="card-arrow" aria-hidden="true">↗</span></div></div></a>';
    }
    function comparison() {
        const items = trips.filter(canRenderFullTrip);
        return '<section class="section wrap home-comparison" id="comparar">' +
            '<div class="section-title"><div><p class="eyebrow orange">Compara tus opciones</p>' +
            '<h2>Los viajes, lado a lado.</h2></div></div>' +
            '<div class="scrolltable comparison-scroll" tabindex="0" role="region" aria-label="Tabla comparativa de viajes; desplázate horizontalmente para ver todas las columnas">' +
            '<table class="comparison-table"><thead><tr><th scope="col">Destino</th><th scope="col">Fechas</th>' +
            '<th scope="col">Días <small>/ laborales</small></th><th scope="col">Bases</th><th scope="col">Ritmo</th>' +
            '<th scope="col">Viajando solo</th><th scope="col">Clima</th><th scope="col">Presupuesto</th></tr></thead><tbody>' +
            items.map((t, i) => '<tr><td class="comparison-destination"><a href="#viaje/' + esc(t.id) + '">' +
                '<span class="comparison-rank">' + (i + 1) + '</span><span>' + esc(t.name) + '</span></a></td>' +
                '<td class="comparison-dates">' + range(t) + '</td><td class="comparison-number">' + t.days.length +
                ' <small>/ ' + t.work + '</small></td><td class="comparison-number">' + t.bases.length + '</td>' +
                '<td>' + esc(t.profile.pace) + '</td><td>' + esc(t.profile.solo) + '</td>' +
                '<td>' + esc(t.profile.weather) + '</td><td class="comparison-price"><strong>' + price(t) +
                ' <small>MXN</small></strong>' + (t.budgetPreliminary ? '<span>Preliminar</span>' : '') +
                '</td></tr>').join('') + '</tbody></table></div></section>';
    }
    function home() { document.title = 'Atlas de viajes · Viajes 2026–2027'; main.innerHTML = `<section class="home-intro wrap atlas-home-hero" aria-labelledby="atlas-home-title"><div class="atlas-home-hero-copy"><p class="eyebrow orange">ATLAS DE VIAJES · 2026–2027</p><h1 id="atlas-home-title">La vida es un viaje.</h1><p class="atlas-home-lead">Rutas desde CDMX, itinerarios detallados y presupuestos para elegir tu próxima aventura.</p></div><div class="intro-photo atlas-home-hero-image"><img src="photos/atlas-world-hero.webp" alt="Ilustración de destinos entre montañas, ciudades y costas" loading="eager" fetchpriority="high" decoding="async"><div class="photo-overlay"></div><div class="intro-caption"><span>EXPLORA EL MUNDO A TU RITMO</span></div></div></section><section class="section wrap" id="viajes" style="padding-top:25px"><div class="section-title"><div><p class="eyebrow orange">Caminos por descubrir</p><h2>Elige tu siguiente historia.</h2></div><p>Entre ciudades históricas, mercados, palacios y paisajes de montaña, encuentra la ruta que más te inspira.</p></div><div class="cards">${trips.map(card).join('')}</div></section>${comparison()}`; }
    return { card, comparison, home };
};
