// Browser regression for Desktop and Mobile: run against a local static HTTP server.
const { chromium } = require('playwright');
const fs = require('node:fs');
const assert = require('node:assert/strict');

(async () => {
  const editorialAudit = process.env.ATLAS_EDITORIAL_AUDIT === '1';
  const browser = await chromium.launch({ headless: true });
  const catalog = fs.readFileSync('modules.js', 'utf8');
  const modules = [...catalog.matchAll(/\{[^{}]*\}/g)].map(match => JSON.parse(match[0]));
  const allDestinations = modules.filter(module => module.available).map(module => module.id);
  const primaryModules = modules.filter(module => module.available && module.homeGroup !== 'ideas');
  const ideaModules = modules.filter(module => module.available && module.homeGroup === 'ideas');
  const tripById = new Map(modules.filter(module => module.available).map(module => [module.id,
    JSON.parse(fs.readFileSync('data/trips/' + module.file, 'utf8'))]));
  const chronologicalIds = primaryModules.map(module => module.id).sort((a, b) =>
    (tripById.get(a).start || '9999-12-31').localeCompare(tripById.get(b).start || '9999-12-31'));
  // Incluye también el viaje nuevo: no depender únicamente de la validación de su JSON.
  const destinations = allDestinations;
  assert.ok(allDestinations.includes("patagonia-argentina-2027"), "Patagonia 2027 debe figurar en el catálogo");
  assert.equal(new Set(allDestinations).size, allDestinations.length, "El catálogo no debe repetir IDs");
  const anchors = ['plan', 'mapa', 'temporadas', 'experiencias', 'reservas', 'traslados', 'alojamientos', 'dias', 'costes'];
  try {
    for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
      const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
      const failures = [];
      page.on('pageerror', error => failures.push(error.message));

      await page.goto('http://127.0.0.1:8765/', { waitUntil: 'domcontentloaded' });
      await page.locator('.tripcard').first().waitFor();
      const heroBounds = await page.locator('.atlas-home-hero-immersive .atlas-home-hero-image').boundingBox();
      assert.ok(heroBounds, 'El hero de Inicio debe estar visible');
      const heroPhoto = page.locator('.atlas-home-hero-immersive .atlas-home-hero-image img');
      assert.equal(await heroPhoto.getAttribute('src'), 'photos/atlas-world-hero-horizontal.webp',
        'La portada debe solicitar la nueva imagen sin renombrar ni reemplazar la original');
      await page.waitForFunction(() => {
        const img = document.querySelector('.atlas-home-hero-immersive .atlas-home-hero-image img');
        return img && img.complete && img.naturalWidth > 0;
      });

      if (viewport.width > 800) {
        assert.ok(heroBounds.height <= 305, 'El hero de escritorio debe ser compacto: ' + heroBounds.height);
        assert.ok(heroBounds.height >= 250, 'El hero debe conservar espacio suficiente para el texto');
      }
      // La versión 1 anima solo la fotografía y la luz, nunca el texto.
      const heroMotion = await page.locator('.atlas-home-hero-immersive .atlas-home-hero-image').evaluate(hero => ({
        imageAnimation: getComputedStyle(hero.querySelector('img')).animationName,
        lightAnimation: getComputedStyle(hero, '::after').animationName,
        copyAnimation: getComputedStyle(hero.querySelector('.atlas-home-hero-copy')).animationName,
        lightPointerEvents: getComputedStyle(hero, '::after').pointerEvents
      }));
      assert.match(heroMotion.imageAnimation, /atlas-home-hero-drift/,
        'La fotografía principal debe tener movimiento lento');
      assert.match(heroMotion.imageAnimation, /atlas-home-hero-breathe/,
        'La fotografía principal debe tener el pulso ambiental de brillo');
      assert.match(heroMotion.lightAnimation, /atlas-home-hero-light/,
        'El hero debe incluir el reflejo de luz discreto');
      assert.equal(heroMotion.copyAnimation, 'none', 'El texto debe permanecer inmóvil');
      assert.equal(heroMotion.lightPointerEvents, 'none', 'El reflejo no debe bloquear interacción');
      const heroProgress = await page.locator('.atlas-home-hero-immersive .atlas-home-hero-image').evaluate(hero => {
        const photo = hero.querySelector('img');
        const motion = photo.getAnimations().find(a => a.animationName === 'atlas-home-hero-drift');
        const lightStyle = getComputedStyle(hero, '::after');
        if (!motion || lightStyle.animationName !== 'atlas-home-hero-light') return {active:false};
        const initialTime = motion.currentTime;
        motion.pause();
        motion.currentTime = 0;
        const begin = getComputedStyle(photo).transform;
        motion.currentTime = 17000;
        const end = getComputedStyle(photo).transform;
        motion.currentTime = initialTime;
        motion.play();
        return {active:true, begin, end, driftDuration:motion.effect.getTiming().duration,
          lightDuration:parseFloat(lightStyle.animationDuration) * 1000};
      });
      assert.ok(heroProgress.active, 'Las dos animaciones deben ejecutarse realmente');
      assert.notEqual(heroProgress.begin, heroProgress.end,
        'El desplazamiento debe cambiar la imagen, no solo declarar un nombre CSS');
      assert.ok(heroProgress.driftDuration <= 18000 && heroProgress.lightDuration <= 13000,
        'Los ciclos deben ser suficientemente cortos para percibirse');
      const brightnessPulse = await page.locator('.atlas-home-hero-immersive .atlas-home-hero-image img').evaluate(photo => {
        const pulse = photo.getAnimations().find(a => a.animationName === 'atlas-home-hero-breathe');
        if (!pulse) return null;
        const original = pulse.currentTime;
        pulse.pause();
        pulse.currentTime = 0;
        const start = getComputedStyle(photo).filter;
        pulse.currentTime = 5000;
        const midpoint = getComputedStyle(photo).filter;
        pulse.currentTime = original;
        pulse.play();
        return {start, midpoint, duration: pulse.effect.getTiming().duration};
      });
      assert.ok(brightnessPulse && brightnessPulse.duration === 10000,
        'El pulso ambiental debe tener un ciclo de diez segundos');
      assert.notEqual(brightnessPulse.start, brightnessPulse.midpoint,
        'El pulso debe cambiar ligeramente el brillo real de la fotografía');
      const heroCopy = page.locator('.atlas-home-hero-immersive .atlas-home-hero-copy');      await page.emulateMedia({ reducedMotion: 'reduce' });
      const staticHero = await page.locator('.atlas-home-hero-immersive .atlas-home-hero-image').evaluate(hero => ({
        imageAnimation: getComputedStyle(hero.querySelector('img')).animationName,
        lightDisplay: getComputedStyle(hero, '::after').display
      }));
      assert.equal(staticHero.imageAnimation, 'none', 'Reducir movimiento debe desactivar animación');
      assert.equal(staticHero.lightDisplay, 'none', 'Reducir movimiento debe desactivar reflejo');
      await page.emulateMedia({ reducedMotion: 'no-preference' });

      const copyBounds = await heroCopy.boundingBox();
      assert.ok(copyBounds && copyBounds.y >= heroBounds.y - 1 &&
        copyBounds.y + copyBounds.height <= heroBounds.y + heroBounds.height + 2,
        'El texto del hero debe quedar dentro de la fotografía');

      // Los viajes actuales forman la portada; los históricos siguen en el archivo de ideas.
      const featuredCards = page.locator('#viajes .tripcard');
      const ideaCards = page.locator('#ideas-viajes .idea-tripcard');
      assert.equal(await featuredCards.count(), primaryModules.length, 'La portada muestra todos los viajes principales disponibles');
      const orlandoHomeCard = page.locator('#viajes .tripcard[href="#viaje/orlando-2026"]');
      assert.equal(await orlandoHomeCard.count(), 1, 'Orlando: portada presente');
      const workDayBadges = featuredCards.locator('.cardfacts span');
      assert.equal(await workDayBadges.count(), primaryModules.filter(module =>
        Number.isInteger(tripById.get(module.id).work)).length,
        'Cada viaje con días laborales declarados muestra su indicador');
      const workingDayTexts = await workDayBadges.allInnerTexts();
      assert.ok(workingDayTexts.every(value => /^\d+ días laborales$/.test(value)),
        'Portada: escribir siempre X días laborales');
      const tones = await page.locator('#viajes .atlas-home-card').evaluateAll(cards => cards.map(card => {
        const place = card.querySelector('.card-overview-location');
        const work = card.querySelector('.cardfacts span');
        return work ? { work: getComputedStyle(work).color, place: getComputedStyle(place).color,
          weight: getComputedStyle(work).fontWeight } : null;
      })).then(values => values.filter(Boolean));
      assert.ok(tones.every(value => value.work === value.place && Number(value.weight) >= 700),
        'Portada: días laborales usan el mismo color y énfasis que Colombia · 12 días');

      const cardDetails = orlandoHomeCard.locator('.card-trip-details');
      assert.equal(await cardDetails.count(), 1, 'Orlando: fecha y laborales agrupados');
      if (editorialAudit) {
        assert.match(await cardDetails.innerText(), /2 dic.*7 dic 2026/);
        assert.match(await cardDetails.innerText(), /4 días laborales/);
      }
      assert.equal(await orlandoHomeCard.locator('.card-route-label').innerText(), 'Ruta');
      assert.equal(await orlandoHomeCard.locator('.card-trip-intro').count(), 1);
      const layout = await orlandoHomeCard.evaluate(card => {
        const selectors = ['.card-overview','h3','.card-trip-details','.card-route','.card-trip-intro','.cardbottom'];
        const elements = selectors.map(selector => card.querySelector(selector));
        return {
          y: elements.map(element => element.getBoundingClientRect().top),
          bottom: elements.map(element => element.getBoundingClientRect().bottom),
          cardBottom: card.getBoundingClientRect().bottom,
          overflow: card.scrollWidth > card.clientWidth + 2
        };
      });
      assert.ok(layout.y.every((value, index, items) => index === 0 || value >= layout.bottom[index-1] - 1),
        'Portada: bloques del viaje sin superposiciones');
      assert.ok(layout.cardBottom >= layout.bottom[5] - 1, 'Portada: presupuesto dentro de tarjeta');
      assert.equal(layout.overflow, false, 'Portada: sin desbordamiento horizontal');
      if (editorialAudit) assert.match(await orlandoHomeCard.locator('.cardbottom').innerText(), /39[,.]000–\$44[,.]000/,
        'Orlando: mostrar rango preliminar $39,000–$44,000 MXN en portada');
      assert.match(await orlandoHomeCard.locator('.card-price small').innerText(), /Presupuesto estimado por persona/,
        'Orlando: rango preliminar etiquetado, no presentado como compra');
      assert.equal(await ideaCards.count(), ideaModules.length, 'Todos los viajes históricos deben permanecer accesibles');
      assert.equal(await page.locator('#ideas-viajes-title').innerText(), 'Ideas generales de viajes.');
      const comparisonRows = page.locator('#comparar .comparison-table tbody tr');
      const comparedIds = await comparisonRows.locator('td:first-child a').evaluateAll(links =>
        links.map(link => link.getAttribute('href').replace('#viaje/', '')));
      assert.ok(comparedIds.length > 0, 'La comparativa tiene viajes listos para comparar');
      assert.equal(new Set(comparedIds).size, comparedIds.length, 'No hay viajes duplicados en la comparativa');
      // La tabla debe contener TODOS los viajes principales elegibles, no un subconjunto.
      // Calcular elegibilidad con los módulos reales que usa la aplicación.
      const eligibleIds = await page.evaluate(async () => {
        const { trips } = await window.ATLAS_READY;
        const format = window.AtlasFormat({ trips });
        const ready = trip => format.canRenderFullTrip(trip) || (trip.start && trip.end &&
          trip.routeCities?.length && Number.isFinite(window.AtlasBudget?.planningEstimate?.(trip)?.low));
        return trips.filter(trip => trip.homeGroup !== 'ideas' && ready(trip))
          .sort((a, b) => (a.start || '9999-12-31').localeCompare(b.start || '9999-12-31'))
          .map(trip => trip.id);
      });
      assert.deepEqual(comparedIds, eligibleIds,
        'La comparativa contiene todos y solo los viajes principales elegibles en orden cronológico');
      const comparisonHeaders = await page.locator('#comparar .comparison-table thead th').allInnerTexts();
      assert.ok(comparisonHeaders.includes('Personas'), 'La comparación debe incluir la columna Personas');
      assert.ok(!comparisonHeaders.includes('Viajando solo'), 'No mostrar el valor booleano de viajando solo');
      const people = await comparisonRows.evaluateAll(rows => rows.map(row => row.cells[5].textContent.trim()));
      assert.deepEqual(people, comparedIds.map(id => {
        const travelers = tripById.get(id).travelerCount;
        return Number.isInteger(travelers) && travelers > 0 ? String(travelers) : 'Por definir';
      }), 'La comparativa respeta el número de personas definido para cada viaje');
      const topIds = await featuredCards.evaluateAll(cards => cards.map(card => card.getAttribute('href')));
      assert.deepEqual(topIds, chronologicalIds.map(id => '#viaje/' + id),
        'La portada incluye todos los viajes principales en orden cronológico');
      assert.ok(!(await page.locator('#ideas-viajes').innerText()).includes('Presupuesto estimado por persona'),
        'El archivo no debe mostrar precios históricos como vigentes');
      const patagoniaCard = page.locator('.tripcard[href="#viaje/patagonia-argentina-2027"]');
      assert.equal(await patagoniaCard.count(), 1, 'La portada de Patagonia debe existir');
      assert.ok(!(await patagoniaCard.innerText()).includes('En planeación'));
      assert.match(await patagoniaCard.locator('.card-price').innerText(), /Presupuesto estimado por persona/, 
        'La portada de Patagonia muestra el presupuesto por persona sin fijar importes');
      for (const id of destinations) {
        await page.goto('http://127.0.0.1:8765/#viaje/' + id, { waitUntil: 'domcontentloaded' });
        await page.locator('.triphero').waitFor();
        // Esperar navegación específica: la portada del viaje anterior aún puede existir tras cambiar el hash.
        await page.locator('.subnav a[href*="#viaje/' + id + '/"]').first().waitFor();
        for (const anchor of anchors) assert.equal(await page.locator('[id="' + anchor + '"]').count(), 1, viewport.width + ' ' + id + ' ' + anchor);
        // Contrato universal de Temperaturas: DOM y datos deben coincidir en todos los viajes desarrollados.
        const currentTrip = tripById.get(id);
        if (currentTrip?.seasonality?.months && primaryModules.some(module => module.id === id)) {
          const temperatures = await page.locator('#temporadas .season-temperature').allInnerTexts();
          assert.equal(temperatures.length, 12, id + ': las doce temperaturas están presentes');
          for (let month = 1; month <= 12; month++) {
            const key = String(month).padStart(2, '0');
            const status = currentTrip.seasonality.months[key]?.status;
            const rendered = temperatures[month - 1];
            if (status === 'pending') assert.equal(rendered, '—', id + ': mes pendiente ' + key);
            else {
              assert.notEqual(rendered, '—', id + ': temperatura ausente ' + key);
              assert.match(rendered, /^(?:Máx\. |Máximas: |Intervalo: )/,
                id + ': temperatura sin significado identificado ' + key);
            }
          }
        }

        // Un mismo contrato de diseño para tarjetas de mapa y alojamientos en todos los viajes.
        assert.equal(await page.locator('#alojamientos h2').innerText(), 'Tus alojamientos.',
          id + ': el título no cambia por candidatos ni alternativas');
        const mapNames = page.locator('#mapa .map-city-name');
        const mapCount = await mapNames.count();
        if (mapCount > 0) {
          const mapTypography = await mapNames.evaluateAll(nodes => nodes.map(node => {
            const main = node.querySelector('.map-city-primary');
            const qualifier = node.querySelector('.map-city-qualifier');
            return {
              main: Boolean(main),
              weight: main ? getComputedStyle(main).fontWeight : '',
              qualifierWeight: qualifier ? getComputedStyle(qualifier).fontWeight : null,
              title: node.innerText
            };
          }));
          assert.ok(mapTypography.every(item => item.main && Number(item.weight) >= 700),
            id + ': el nombre de todas las tarjetas del mapa debe ir en negritas');
          assert.ok(mapTypography.every(item => item.qualifierWeight === null ||
            Number(item.qualifierWeight) <= 400),
            id + ': las aclaraciones entre paréntesis no llevan negritas');
        }
        const hotelHeadings = page.locator('#alojamientos .hotel-card h4');
        const hotelLayout = await hotelHeadings.evaluateAll(nodes => nodes.map(node => ({
          city: Boolean(node.querySelector('.hotel-heading-city')),
          overflow: node.scrollWidth > node.clientWidth + 3
        })));
        assert.ok(hotelLayout.every(item => !item.overflow),
          id + ': encabezados de hotel sin desbordamiento horizontal');
        const text = await page.locator('main').innerText();
        const invalidValue = /undefined|Invalid Date|NaN/.exec(text);
        assert.equal(invalidValue, null, id + ' has invalid UI value near: ' + (invalidValue ? text.slice(Math.max(0, invalidValue.index - 140), invalidValue.index + 170) : 'none'));
        const navigationCount = await page.locator('.subnav a[href*="#viaje/' + id + '/"]').count();
        assert.ok(navigationCount >= 9, id + ' navigation links ' + navigationCount);
        // Contrato editorial del Panorama: tres indicadores a la izquierda, clima separado a la derecha.
        if (['orlando-2026', 'suiza-nevada-2027', 'espana-portugal-2027', 'italia-norte-2027',
          'suiza-verde-2027', 'japon-2027', 'patagonia-argentina-2027'].includes(id)) {
          const indicators = page.locator('#plan .overview-intro .practical-indicator');
          assert.equal(await indicators.count(), 3, id + ' debe tener exactamente tres indicadores');
          const ids = await indicators.evaluateAll(nodes => nodes.map(node => node.dataset.indicatorId));
          assert.deepEqual(ids, ['style', 'language', 'entry'], id + ' debe mantener IDs y orden');
          const headings = await indicators.locator('strong').allInnerTexts();
          assert.deepEqual(headings.filter(label => ['Estilo de viaje', 'Idioma y moneda',
            'Documentación y consejos prácticos', 'Documentación y electricidad'].includes(label)),
            ['Estilo de viaje', 'Idioma y moneda', 'Documentación y consejos prácticos'],
            id + ' nombres de indicadores');
          const climate = page.locator('#plan .overview-side .overview-climate-card');
          assert.equal(await climate.count(), 1, id + ' debe mostrar un clima separado en columna derecha');
          assert.equal(await page.locator('#plan .overview-intro .overview-climate-card').count(), 0,
            id + ' no debe mezclar clima con indicadores');
          const region = await page.locator('#plan').evaluate(root => {
            const left = root.querySelector('.overview-intro').getBoundingClientRect();
            const right = root.querySelector('.overview-side').getBoundingClientRect();
            const climate = root.querySelector('.overview-side .overview-climate-card').getBoundingClientRect();
            const budget = root.querySelector('.overview-side .budget-teaser').getBoundingClientRect();
            return {left:{x:left.x,y:left.y,w:left.width,h:left.height},
              right:{x:right.x,y:right.y,w:right.width,h:right.height},
              climate:{x:climate.x,y:climate.y}, budget:{x:budget.x,y:budget.y,h:budget.height}};
          });
          if (viewport.width > 800) {
            assert.ok(region.right.x >= region.left.x + region.left.w - 8,
              id + ' clima/presupuesto deben ubicarse a la derecha del texto');
          } else {
            assert.ok(region.right.y >= region.left.y,
              id + ' móvil debe conservar el bloque de clima separado');
          }
          assert.ok(region.climate.y >= region.budget.y,
            id + ' tarjeta Clima y luz debe seguir al presupuesto');
        }
        if (editorialAudit) {
          // Auditoría profunda basada en el contenido ACTUAL del JSON, sin destinos ni números fijos.
          const tripData = tripById.get(id);
          if (tripData?.days?.length) {
            const dayCards = page.locator('#dias details.day');
            assert.equal(await dayCards.count(), tripData.days.length,
              id + ': una tarjeta por jornada del itinerario vigente');
          }
          if (tripData?.seasonality?.months)
            assert.equal(await page.locator('#temporadas .season-month').count(), 12,
              id + ': los doce meses deben aparecer');
          if (tripData?.practicalIndicators?.length)
            assert.deepEqual(await page.locator('#plan .practical-indicator').evaluateAll(nodes =>
              nodes.map(node => node.dataset.indicatorId)),
              tripData.practicalIndicators.map(item => item.id),
              id + ': indicadores visibles según su configuración editorial');
          if (Array.isArray(tripData?.reservations) && tripData.reservations.length) {
            assert.equal(await page.locator('#reservas .reservation-group').count(),
              tripData.reservations.length, id + ': grupos de reservas sincronizados');
            assert.equal(await page.locator('#reservas h3').innerText(),
              'Reservaciones importantes', id + ': título editorial');
          }
          assert.equal(await page.locator('#dias .gallery img[alt=""]').count(), 0,
            id + ': fotografías sin texto alternativo');
          const pictures = await page.locator('#dias .gallery img').count();
          if (pictures)
            assert.equal(await page.locator('#dias .gallery figure').count(), pictures,
              id + ': cada imagen tiene su tarjeta y créditos');
          if (tripData?.expenses?.length)
            assert.ok(await page.locator('#costes .budget-ledger').count() >= 1,
              id + ': el presupuesto actual se presenta');
        } // Fin de auditoría editorial profunda, sin snapshots de itinerarios.
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        assert.ok(overflow <= 3, id + ' horizontal overflow ' + overflow + ' at ' + viewport.width);
      }
      // Dedicated master-trip visual and functional regression.
      await page.goto('http://127.0.0.1:8765/#viaje/italia-norte-2027', { waitUntil: 'domcontentloaded' });
      await page.locator('#plan .overview-editorial').waitFor();
      assert.equal(await page.locator('#temporadas .season-month').count(), 12);
      assert.ok(await page.locator('#experiencias .experience-card').count() >= 7);
      assert.ok(await page.locator('#reservas .reservation-group').count() >= 2);
      assert.ok(await page.locator('#alojamientos .hotel-card').count() >= 3);
      assert.equal(await page.locator('#dias details.day').count(), tripById.get('italia-norte-2027').days.length);
      assert.ok(await page.locator('#costes .budget-ledger').count() >= 1);
      assert.ok(await page.locator('#traslados .mt-card').count() >= 1);
      const navigation = page.locator('.subnav a[href="#viaje/italia-norte-2027/temporadas"]');
      assert.equal(await navigation.count(), 1);
      await navigation.click();
      await page.waitForTimeout(150);
      assert.equal(new URL(page.url()).hash, '#viaje/italia-norte-2027/temporadas');
      await page.locator('#expand').click();
      assert.equal(await page.locator('#dias details.day[open]').count(), 0);
      await page.locator('#expand').click();
      assert.equal(await page.locator('#dias details.day[open]').count(), tripById.get('italia-norte-2027').days.length);
      const budgetCategories = page.locator('#costes .budget-category');
      assert.ok(await budgetCategories.count() > 0);
      const visibleLabels = await page.locator('#plan, #mapa, #temporadas, #experiencias, #reservas, #traslados, #alojamientos, #dias, #costes').count();
      assert.equal(visibleLabels, 9);
      for (const id of anchors) {
        const bounds = await page.locator('[id="' + id + '"]').boundingBox();
        assert.ok(bounds && bounds.width > 50 && bounds.height > 10, viewport.width + ' invisible master section ' + id);
      }
      if (viewport.width > 1000) {
        const layout = await page.locator('#mapa .trip-map-header').evaluate(header => {
          const intro = header.querySelector('.trip-map-intro').getBoundingClientRect();
          const cities = header.querySelector('.trip-map-cities').getBoundingClientRect();
          const cards = [...header.querySelectorAll('.map-city-list li')]
            .map(item => item.getBoundingClientRect());
          const width = header.getBoundingClientRect().width;
          return {width, citiesWidth: cities.width, introRight: intro.right,
            citiesLeft: cities.left, cards};
        });
        assert.ok(layout.citiesWidth >= layout.width * 0.55,
          'La columna de ciudades debe ocupar al menos 55% del encabezado en escritorio');
        assert.ok(layout.citiesLeft > layout.introRight,
          'Las columnas del encabezado no deben encimarse');
        assert.ok(layout.cards.length >= 4 &&
          layout.cards.slice(0, 4).every(card => card.width >= 90),
          'Las primeras cuatro tarjetas deben caber sin volverse ilegibles');
        const rowPositions = [...new Set(layout.cards.map(card => Math.round(card.y)))];
        assert.ok(rowPositions.length <= Math.ceil(layout.cards.length / 4),
          'Las ciudades deben acomodarse en cuatro columnas sin filas adicionales');
        assert.ok(Math.abs(layout.cards[0].y - layout.cards[3].y) <= 1,
          'Las primeras cuatro ciudades deben compartir la primera fila');
      }
      await page.locator('#mapa').scrollIntoViewIfNeeded();
      await page.screenshot({ path: '/tmp/atlas-italia-' + viewport.width + '.png', fullPage: true });
      if (viewport.width > 1000) {
        await page.goto('http://127.0.0.1:8765/#viaje/espana-portugal-2027/mapa', { waitUntil: 'domcontentloaded' });
        await page.locator('#mapa .trip-map-cities .map-city-list li').first().waitFor();
        const locations = await page.locator('#mapa .trip-map-cities .map-city-list li').evaluateAll(items =>
          items.map(item => {
            const r = item.getBoundingClientRect();
            return { x: Math.round(r.x), y: Math.round(r.y), width: r.width };
          }));
        assert.equal(locations.length, 10, 'España + Portugal debe conservar diez localidades');
        assert.equal(new Set(locations.map(item => item.y)).size, 3,
          'Diez localidades deben ocupar exactamente tres filas en escritorio');
        assert.equal(new Set(locations.slice(0, 4).map(item => item.y)).size, 1,
          'Las cuatro primeras localidades deben compartir fila');
        assert.ok(locations.every(item => item.width >= 90), 'Ninguna tarjeta debe quedar demasiado estrecha');
      }
      // El logo del Atlas aparece al fijarse la barra y navega a Inicio.
      await page.goto('http://127.0.0.1:8765/#viaje/italia-norte-2027', { waitUntil: 'domcontentloaded' });
      await page.locator('.subnav-sticky-sentinel').waitFor();
      await page.evaluate(() => window.scrollTo({top:0,behavior:'instant'}));
      await page.waitForFunction(() => window.scrollY <= 1 &&
        !document.querySelector('.subnav')?.classList.contains('is-stuck') &&
        getComputedStyle(document.querySelector('.subnav .subnav-home')).display === 'none');
      const stickyHome = page.locator('.subnav .subnav-home');
      assert.equal(await stickyHome.getAttribute('href'), '#inicio');
      assert.equal(await stickyHome.isVisible(), false, 'El logo no debe duplicarse antes del scroll');
      await page.evaluate(() => {
        const sentinel = document.querySelector('.subnav-sticky-sentinel');
        window.scrollTo({top:sentinel.getBoundingClientRect().top + window.scrollY + 120,behavior:'instant'});
      });
      await page.waitForFunction(() => document.querySelector('.subnav')?.classList.contains('is-stuck'));
      assert.equal(await stickyHome.isVisible(), true, 'El logo debe aparecer en la barra fija');
      const homeLogoBounds = await stickyHome.boundingBox();
      assert.ok(homeLogoBounds && homeLogoBounds.width >= 29 && homeLogoBounds.height >= 29);
      const sectionScroll = page.locator('.subnav .subnav-sections');
      assert.ok(await sectionScroll.count() === 1, 'Se conserva el desplazamiento horizontal de secciones');
      await stickyHome.click();
      await page.locator('#atlas-home-title').waitFor();
      assert.equal(new URL(page.url()).hash, '#inicio', 'El logo debe regresar a Inicio');
      // Simula un nuevo destino real desde el primer commit: visible, sin fechas ni fotos.
      const testId = 'viaje-incremental-prueba';
      const testCatalog = catalog.replace(/\];\s*$/,
        ',\n  {"id": "viaje-incremental-prueba", "file": "viaje-incremental-prueba.json", "available": true}\n];');
      await page.route('**/modules.js', route => route.fulfill({
        status: 200, contentType: 'application/javascript', body: testCatalog
      }));
      await page.route('**/data/trips/viaje-incremental-prueba.json', route => route.fulfill({
        status: 200, contentType: 'application/json',
        body: JSON.stringify({id:testId,name:'Nuevo destino de prueba',travelerCount:null})
      }));
      await page.goto('http://127.0.0.1:8765/?incremental-fixture=1#inicio', { waitUntil: 'domcontentloaded' });
      const newCard = page.locator('#viajes a[href="#viaje/' + testId + '"]');
      await newCard.waitFor();
      assert.equal(await page.locator('#viajes .tripcard').count(), primaryModules.length + 1,
        'Los viajes principales más el fixture incremental deben estar visibles');
      assert.equal(await page.locator('#ideas-viajes .idea-tripcard').count(), ideaModules.length,
        'El fixture no debe alterar el número de ideas');
      const initialCardText = await newCard.innerText();
      assert.match(initialCardText, /Nuevo destino de prueba/);
      assert.doesNotMatch(initialCardText, /borrador|en planeación|preliminar|\$0\b|NaN|undefined/i);
      await newCard.click();
      await page.locator('#plan').waitFor();
      assert.equal(await page.locator('.subnav .subnav-sections a').count(), 9);
      for (const anchor of anchors) assert.equal(await page.locator('[id="' + anchor + '"]').count(), 1);
      assert.doesNotMatch(await page.locator('main').innerText(), /borrador|en planeación|en preparación|Invalid Date|NaN|undefined/i);
      assert.ok((await page.locator('main').innerText()).includes('Nuevo destino de prueba'));

      assert.deepEqual(failures, [], 'Browser errors at ' + viewport.width);
      await page.close();
    }
    console.log('Browser ' + (editorialAudit ? 'editorial audit' : 'smoke') + ' passed: Desktop/Mobile, visible trips, nine anchors, overflow and runtime errors.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
