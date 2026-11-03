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
      await page.route('**/modules.js', route => route.fulfill({
        status: 200, contentType: 'application/javascript',
        body: catalog.replace(/"available": false/g, '"available": true')
      }));
      await page.goto('http://127.0.0.1:8765/', { waitUntil: 'domcontentloaded' });
      await page.locator('.tripcard').first().waitFor();
      for (const id of destinations) {
        await page.goto('http://127.0.0.1:8765/#viaje/' + id, { waitUntil: 'domcontentloaded' });
        await page.locator('.triphero').waitFor();
        // Esperar navegación específica: la portada del viaje anterior aún puede existir tras cambiar el hash.
        await page.locator('.subnav a[href*="#viaje/' + id + '/"]').first().waitFor();
        for (const anchor of anchors) assert.equal(await page.locator('[id="' + anchor + '"]').count(), 1, viewport.width + ' ' + id + ' ' + anchor);
        const text = await page.locator('main').innerText();
        assert.doesNotMatch(text, /undefined|Invalid Date|NaN/, id + ' has invalid UI value');
        const navigationCount = await page.locator('.subnav a[href*="#viaje/' + id + '/"]').count();
        const isDraft = id === 'nuevo-viaje';
        assert.ok(navigationCount >= (isDraft ? 5 : 9), id + ' navigation links ' + navigationCount);
        if (id === 'patagonia-argentina-2027') {
          assert.equal(await page.locator('#traslados .mt-card').count(), 4, 'Patagonia debe renderizar sus cuatro traslados');
          assert.equal(await page.locator('#dias details.day').count(), 15, 'Patagonia debe mostrar sus 15 jornadas');
          assert.ok(await page.locator('#alojamientos .hotel-card').count() >= 4, 'Patagonia debe mostrar cuatro estancias');
          assert.ok(await page.locator('#costes .budget-ledger').count() >= 1, 'Patagonia debe mostrar presupuesto');
          const budgetText = await page.locator('#costes').innerText();
          assert.match(budgetText, /144[,.]648|144648/, 'El presupuesto debe incluir el total esperado');
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
      await page.locator('#mapa').scrollIntoViewIfNeeded();
      await page.screenshot({ path: '/tmp/atlas-italia-' + viewport.width + '.png', fullPage: true });
      assert.deepEqual(failures, [], 'Browser errors at ' + viewport.width);
      await page.close();
    }
    console.log('Browser smoke checks passed: Desktop/Mobile, complete and draft trips, nine anchors, overflow and runtime errors.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
