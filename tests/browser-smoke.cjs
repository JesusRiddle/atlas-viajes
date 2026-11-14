// Browser regression for Desktop and Mobile: run against a local static HTTP server.
const { chromium } = require('playwright');
const fs = require('node:fs');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const catalog = fs.readFileSync('modules.js', 'utf8');
  const allDestinations = [...catalog.matchAll(/"id": "([a-z0-9-]+)"/g)].map(match => match[1]);
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
      assert.equal(await featuredCards.count(), 7, 'La portada muestra seis viajes presupuestados y el borrador de Suiza verde');
      assert.equal(await ideaCards.count(), allDestinations.length - 7, 'Todos los viajes históricos deben permanecer accesibles');
      assert.equal(await page.locator('#ideas-viajes-title').innerText(), 'Ideas generales de viajes.');
      assert.equal(await page.locator('#comparar .comparison-table tbody tr').count(), 6,
        'La comparativa no debe confundir ideas históricas con viajes terminados');
      const comparisonHeaders = await page.locator('#comparar .comparison-table thead th').allInnerTexts();
      assert.ok(comparisonHeaders.includes('Personas'), 'La comparación debe incluir la columna Personas');
      assert.ok(!comparisonHeaders.includes('Viajando solo'), 'No mostrar el valor booleano de viajando solo');
      const people = await page.locator('#comparar .comparison-table tbody tr').evaluateAll(rows =>
        rows.map(row => row.cells[5].textContent.trim()));
      assert.deepEqual(people, ['1', '1', '1', '1', '1', '2'], 'Cinco viajes individuales y Patagonia para dos');
      const topIds = await featuredCards.evaluateAll(cards => cards.map(card => card.getAttribute('href')));
      assert.deepEqual(topIds, [
        '#viaje/colombia-2027', '#viaje/suiza-nevada-2027', '#viaje/italia-norte-2027', '#viaje/espana-portugal-2027',
        '#viaje/suiza-verde-2027', '#viaje/japon-2027', '#viaje/patagonia-argentina-2027'
      ]);
      assert.ok(!(await page.locator('#ideas-viajes').innerText()).includes('Presupuesto estimado por persona'),
        'El archivo no debe mostrar precios históricos como vigentes');
      const patagoniaCard = page.locator('.tripcard[href="#viaje/patagonia-argentina-2027"]');
      assert.equal(await patagoniaCard.count(), 1, 'La portada de Patagonia debe existir');
      assert.ok(!(await patagoniaCard.innerText()).includes('En planeación'));
      const patagoniaCardText = await patagoniaCard.innerText();
      assert.match(patagoniaCardText, /68[,.]974/, 'La portada debe mostrar escenario mínimo por persona');
      assert.match(patagoniaCardText, /75[,.]974/, 'La portada debe mostrar escenario máximo por persona');
      for (const id of destinations) {
        await page.goto('http://127.0.0.1:8765/#viaje/' + id, { waitUntil: 'domcontentloaded' });
        await page.locator('.triphero').waitFor();
        // Esperar navegación específica: la portada del viaje anterior aún puede existir tras cambiar el hash.
        await page.locator('.subnav a[href*="#viaje/' + id + '/"]').first().waitFor();
        for (const anchor of anchors) assert.equal(await page.locator('[id="' + anchor + '"]').count(), 1, viewport.width + ' ' + id + ' ' + anchor);
        const text = await page.locator('main').innerText();
        assert.doesNotMatch(text, /undefined|Invalid Date|NaN/, id + ' has invalid UI value');
        const navigationCount = await page.locator('.subnav a[href*="#viaje/' + id + '/"]').count();
        assert.ok(navigationCount >= 9, id + ' navigation links ' + navigationCount);
        // Contrato editorial del Panorama: tres indicadores a la izquierda, clima separado a la derecha.
        if (['suiza-nevada-2027', 'espana-portugal-2027', 'italia-norte-2027',
          'japon-2027', 'patagonia-argentina-2027'].includes(id)) {
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
        if (id === 'colombia-2027') {
          const photoCatalog = JSON.parse(fs.readFileSync('data/places.json','utf8'));
          const tripData = JSON.parse(fs.readFileSync('data/trips/colombia-2027.json','utf8'));
          assert.equal(await page.locator('#dias details.day').count(),12,'Colombia: 12 jornadas');
          assert.equal(await page.locator('#temporadas .season-month').count(),12,'Colombia: 12 meses');
          assert.equal(await page.locator('#alojamientos .hotel-card').count(),4,'Colombia: 4 hoteles');
          assert.equal(await page.locator('#plan .overview-intro .practical-indicator').count(),3,'Colombia: 3 indicadores');
          assert.equal(await page.locator('#plan .overview-side .overview-climate-card').count(),1,'Colombia: clima separado');
          assert.equal(await page.locator('#traslados .mt-card').count(),3,'Colombia: 3 transportes');
          assert.equal(await page.locator('#dias .gallery figure').count(),27,'Colombia: 27 imágenes editoriales');
          assert.equal(await page.locator('#dias .gallery .credit').count(),27,'Colombia: créditos completos');
          assert.equal(await page.locator('#dias .gallery .photo-option').count(),3,'Colombia: Plaza Botero opcional más dos visitas de Cartagena');
           assert.match(await page.locator('#dia-10 .day-places').innerText(),/Castillo de San Felipe/,'Cartagena: encabezado de lugares visible');
           assert.match(await page.locator('#dia-11 .day-places').innerText(),/Islas del Rosario/,'Rosario: encabezado de lugares visible');
           assert.match(await page.locator('#dia-11 .mobility').innerText(),/Bodeguita/,'Corales: punto de embarque visible');
          assert.equal(await page.locator('#dias .gallery img[alt=""]').count(),0,'Colombia: fotografías con alt informativo');
          const heroSrc=await page.locator('.triphero-split-photo img').first().getAttribute('src');
          assert.equal(heroSrc,photoCatalog[tripData.cover].photo.src,'Colombia: portada Tayrona');
          const renderedPhotos=await page.locator('#dias .gallery img').evaluateAll(imgs=>imgs.map(img=>img.getAttribute('src')));
          assert.equal(new Set(renderedPhotos).size,27,'Colombia: no duplicar imágenes diarias');
          assert.ok(renderedPhotos.every(src=>src.startsWith('https://')),'Colombia: solo imágenes externas HTTPS');
          assert.match(await page.locator('#costes').innerText(),/50[,.]381/,'Colombia: presupuesto actualizado a Copa $9,652');
          assert.match(await page.locator('#dia-1').innerText(),/14:15/,'Colombia: llegada diurna');
          assert.match(await page.locator('#dia-1').innerText(),/Provenza/,'Colombia: visita del viernes');
          assert.match(await page.locator('#dia-12').innerText(),/00:15/,'Colombia: llegada a México el 27');
          assert.match(await page.locator('#dia-12').innerText(),/5 h 05 min/,'Colombia: espera en Tocumen');
          assert.match(await page.locator('#alojamientos').innerText(),/Moabi Hotel/,'Colombia: Moabi visible en alojamiento');
          assert.doesNotMatch(await page.locator('#alojamientos').innerText(),/Landmark/,'Colombia: Landmark retirado de alojamientos');
          assert.match(await page.locator('#alojamientos').innerText(),/Cabrero House Boutique/,'Cartagena: primer candidato vigente');
          assert.match(await page.locator('#alojamientos').innerText(),/Bahía Suite/,'Santa Marta: Bahia Suite vigente');
          assert.doesNotMatch(await page.locator('#alojamientos').innerText(),/Casa La Fe/,'Cartagena: hotel descartado retirado');
        }
        if (id === 'suiza-nevada-2027') {
          const swissClimate = page.locator('#plan .overview-side .overview-climate-card');
          const swissClimateText = await swissClimate.innerText();
          assert.match(swissClimateText, /Qué llevar:/);
          assert.match(swissClimateText, /Horas de luz:/);
          assert.match(swissClimateText, /08:00/);
          assert.match(swissClimateText, /17:21/);
          assert.ok((await swissClimate.locator('p').count()) >= 3,
            'Suiza requiere tres párrafos diferenciados en tarjeta climática');
          assert.ok(await swissClimate.evaluate(node => node.classList.contains('season-recommended')),
            'El color de clima debe corresponder al estado del mes de inicio');
          assert.match(await page.locator('#plan .budget-exchange').innerText(), /CHF/);
          assert.equal(await page.locator('#plan .budget-exchange a').count(), 1,
            'CHF debe tener fuente enlazada en el Panorama');
          assert.equal(await page.locator('#traslados .mt-card').count(), 7,
            'Suiza debe mostrar vuelo, aeropuerto, tres trenes interurbanos y ZVV Kilchberg');
          assert.equal(await page.locator('#traslados .mt-pass-comparison').count(), 1,
            'Comparación de pases debe ser visible como bloque accesible, no solo existir en JSON');
          await page.locator('#traslados .mt-pass-comparison > summary').click();
          const comparison = await page.locator('#traslados .mt-pass-comparison').innerText();
          assert.match(comparison, /Punto de equilibrio/);
          assert.match(comparison, /Winter Pass/);
          assert.match(comparison, /CHF 102/, 'La tarifa oficial del retorno Gornergrat debe mostrarse');
          assert.match(comparison, /CHF 51/, 'La mitad de tarifa oficial Gornergrat debe mostrarse');
          assert.match(comparison, /CHF 175\.80/, 'Half Fare descuenta Gornergrat y ambos recorridos ZVV conocidos');
          assert.doesNotMatch(comparison, /Winter Pass CHF 102|NO es el billete convencional de ida y vuelta/i);
          assert.equal(await page.locator('#traslados .mt-pass-comparison li').count(), 12,
            'La comparativa de Suiza incluye productos turísticos, billetes Saver y sensibilidad económica');
          assert.match(comparison, /Saver Day Pass/);
          assert.match(comparison, /CHF 326/, 'Costo de adquirir ambos pases y riesgo presupuestario');
          assert.match(comparison, /CHF 14\.80/, 'La tarifa ZVV para 2027 se ve en Movilidad');
          assert.match(comparison, /Zúrich → aeropuerto/, 'La conexión al aeropuerto debe estar documentada');
          const airportZvv = page.locator('#traslados .mt-card').filter({hasText:'Zürich Flughafen'});
          assert.ok(await airportZvv.count() >= 1);
          const zvvCard = page.locator('#traslados .mt-card').filter({hasText:'Kilchberg'});
          assert.ok(await zvvCard.count() >= 1, 'La ficha ZVV debe aparecer');
          const faresText = await zvvCard.first().innerText();
          assert.match(faresText, /24 h|24h|ZVV/i);
          const flights = page.locator('#traslados .mt-card[data-transport="flight-international"]');
          await flights.locator('summary').click();
          assert.equal(await flights.locator('.flight-leg').count(), 4,
            'Las dos direcciones del vuelo de referencia deben mostrar dos segmentos cada una');
          assert.match(await flights.innerText(), /MAD|Madrid/);
          assert.match(await flights.innerText(), /CDG|París/);

          assert.equal(await page.locator('#dias details.day').count(), 12,
            'Suiza debe mostrar sus doce jornadas');
          assert.equal(await page.locator('#alojamientos .hotel-card').count(), 4,
            'Suiza debe mostrar sus cuatro alojamientos');
          assert.equal(await page.locator('#temporadas .season-month').count(), 12,
            'Suiza debe incluir los doce meses de temporadas');
          assert.ok(await page.locator('#costes .budget-ledger').count() >= 1,
            'Suiza debe presentar el desglose de presupuesto');
          const swissBudget = await page.locator('#costes .budget-ledger').innerText();
          assert.match(swissBudget, /Transporte terrestre · provisión global/);
          assert.match(swissBudget, /Trenes, movilidad urbana y pase seleccionado/);
          assert.match(swissBudget, /10,000\.00/, 'Los $10,000 MXN ferroviarios deben verse en el desglose');
          assert.match(swissBudget, /86,981/, 'El escenario de riesgo debe aparecer sin alterar el total de referencia');
          await page.screenshot({path: '/tmp/atlas-suiza-nevada-' + viewport.width + '.png', fullPage: true});
        }
        if (id === 'patagonia-argentina-2027') {
          assert.equal(await page.locator('#traslados .mt-card').count(), 4, 'Patagonia debe renderizar sus cuatro traslados');
          assert.equal(await page.locator('#dias details.day').count(), 15, 'Patagonia debe mostrar sus 15 jornadas');
          assert.ok(await page.locator('#alojamientos .hotel-card').count() >= 4, 'Patagonia debe mostrar cuatro estancias');
          assert.ok(await page.locator('#costes .budget-ledger').count() >= 1, 'Patagonia debe mostrar presupuesto');
          const budgetText = await page.locator('#costes').innerText();
          assert.match(budgetText, /144[,.]948|144948/, 'El presupuesto debe incluir el total esperado');
          await page.screenshot({path: '/tmp/atlas-patagonia-' + viewport.width + '.png', fullPage: true});
        }
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
      assert.equal(await page.locator('#dias details.day').count(), 14);
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
      assert.equal(await page.locator('#dias details.day[open]').count(), 14);
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
      await page.waitForFunction(() => !document.querySelector('.subnav')?.classList.contains('is-stuck'));
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
      assert.equal(await page.locator('#viajes .tripcard').count(), 8, 'Siete viajes en portada más el fixture incremental');
      assert.equal(await page.locator('#ideas-viajes .idea-tripcard').count(), 15);
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
    console.log('Browser smoke checks passed: Desktop/Mobile, complete and incremental visible trips, nine anchors, overflow and runtime errors.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
