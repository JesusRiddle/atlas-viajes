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
      assert.match(heroMotion.lightAnimation, /atlas-home-hero-light/,
        'El hero debe incluir el reflejo de luz discreto');
      assert.equal(heroMotion.copyAnimation, 'none', 'El texto debe permanecer inmóvil');
      assert.equal(heroMotion.lightPointerEvents, 'none', 'El reflejo no debe bloquear interacción');
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

      // Solo los primeros cuatro viajes siguen siendo protagonistas de la portada.
      const featuredCards = page.locator('#viajes .tripcard');
      const ideaCards = page.locator('#ideas-viajes .idea-tripcard');
      assert.equal(await featuredCards.count(), 4, 'La portada principal debe tener cuatro viajes');
      assert.equal(await ideaCards.count(), allDestinations.length - 4, 'Todos los viajes anteriores deben permanecer accesibles');
      assert.equal(await page.locator('#ideas-viajes-title').innerText(), 'Ideas generales de viajes.');
      assert.equal(await page.locator('#comparar .comparison-table tbody tr').count(), 4,
        'La comparativa no debe confundir ideas históricas con viajes terminados');
      const comparisonHeaders = await page.locator('#comparar .comparison-table thead th').allInnerTexts();
      assert.ok(comparisonHeaders.includes('Personas'), 'La comparación debe incluir la columna Personas');
      assert.ok(!comparisonHeaders.includes('Viajando solo'), 'No mostrar el valor booleano de viajando solo');
      const people = await page.locator('#comparar .comparison-table tbody tr').evaluateAll(rows =>
        rows.map(row => row.cells[5].textContent.trim()));
      assert.deepEqual(people, ['1', '1', '1', '2'], 'Tres viajes de una persona y Patagonia para dos');
      const topIds = await featuredCards.evaluateAll(cards => cards.map(card => card.getAttribute('href')));
      assert.deepEqual(topIds, [
        '#viaje/espana-portugal-2027', '#viaje/italia-norte-2027',
        '#viaje/japon-2027', '#viaje/patagonia-argentina-2027'
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
      assert.equal(await page.locator('#viajes .tripcard').count(), 5);
      assert.equal(await page.locator('#ideas-viajes .idea-tripcard').count(), 15);
      const initialCardText = await newCard.innerText();
      assert.match(initialCardText, /Nuevo destino de prueba/);
      assert.doesNotMatch(initialCardText, /borrador|en planeación|preliminar|\$0\b|NaN|undefined/i);
      await newCard.click();
      await page.locator('#plan').waitFor();
      assert.equal(await page.locator('.subnav a').count(), 9);
      for (const anchor of anchors) assert.equal(await page.locator('[id="' + anchor + '"]').count(), 1);
      assert.doesNotMatch(await page.locator('main').innerText(), /borrador|en planeación|en preparación|Invalid Date|NaN|undefined/i);
      assert.ok((await page.locator('main').innerText()).includes('Nuevo destino de prueba'));

      assert.deepEqual(failures, [], 'Browser errors at ' + viewport.width);
      await page.close();
    }
    console.log('Browser smoke checks passed: Desktop/Mobile, complete and incremental visible trips, nine anchors, overflow and runtime errors.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
