// Browser regression for Desktop and Mobile: run against a local static HTTP server.
const { chromium } = require('playwright');
const fs = require('node:fs');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const catalog = fs.readFileSync('modules.js', 'utf8');
  const destinations = [...catalog.matchAll(/"id": "([a-z0-9-]+)"/g)].map(match => match[1]);
  assert.equal(destinations.length, 19);
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
        for (const anchor of anchors) assert.equal(await page.locator('[id="' + anchor + '"]').count(), 1, viewport.width + ' ' + id + ' ' + anchor);
        const text = await page.locator('main').innerText();
        assert.doesNotMatch(text, /undefined|Invalid Date|NaN/, id + ' has invalid UI value');
        assert.equal(await page.locator('.subnav a[href*="#viaje/' + id + '/"]').count() >= 9, true);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        assert.ok(overflow <= 3, id + ' horizontal overflow ' + overflow + ' at ' + viewport.width);
      }
      assert.deepEqual(failures, [], 'Browser errors at ' + viewport.width);
      await page.close();
    }
    console.log('Browser smoke checks passed: Desktop/Mobile, complete and draft trips, nine anchors, overflow and runtime errors.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
