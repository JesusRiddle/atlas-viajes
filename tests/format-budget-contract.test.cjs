// Regression: legacy budget fields and structured expenses must both render on the home page.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const context = vm.createContext({ window: {}, Intl, Number, String, Date, Object, Array, Math, Set });
for (const file of ['components/budget.js', 'components/format.js']) {
  vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, { filename: file });
}
const italy = JSON.parse(fs.readFileSync(path.join(root, 'data/trips/italia-norte-2027.json'), 'utf8'));
const format = context.window.AtlasFormat({ trips: [italy] });
test('Italy 2027 home and budget use the same structured total', () => {
  assert.equal(italy.days.length, 14);
  assert.ok(format.canRenderFullTrip(italy));
  const total = context.window.AtlasBudget.summary(italy).knownTotalMXN;
  assert.equal(total, 68546.21);
  assert.equal(italy.budgetPreliminary, true, 'El total sigue siendo una estimación');
  assert.equal(format.price(italy), '$68,546.21');
});
test('legacy budget range still renders and remains eligible', () => {
  const legacy = { ...italy, expenses: [], budgetRange: [50000, 65000] };
  assert.ok(format.canRenderFullTrip(legacy));
  assert.equal(format.price(legacy), '$50,000–$65,000');
});
test('trip with structured expenses but no legacy budget stays eligible', () => {
  const structured = { ...italy };
  delete structured.budgetRange;
  delete structured.costs;
  assert.ok(format.canRenderFullTrip(structured));
  assert.equal(format.price(structured), '$68,546.21');
});
