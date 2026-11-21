// Contract: structured budgets and legacy ranges must both render on the home page.
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

// Synthetic complete trip: changing a real itinerary or quotation cannot break this contract.
const trip = {
  id: 'budget-contract', cover: 'fixture', start: '2027-01-01', end: '2027-01-02',
  intro: 'Viaje de prueba', climate: 'Templado', solo: 'Sí',
  flight: 'Pendiente', local: 'Transporte público',
  days: [{ n: 1, date: '2027-01-01', places: [] }],
  bases: [['Ciudad', 1]], routeCities: ['Ciudad'], work: 1,
  profile: { pace: 'balanced', solo: true, weather: 'mild' },
  expenses: [{ id: 'expense-test', category: 'transport', cost: { amount: 1234.50, currency: 'MXN' } }]
};
const format = context.window.AtlasFormat({ trips: [trip] });

test('structured expenses remain eligible and use the calculated ledger amount', () => {
  assert.ok(format.canRenderFullTrip(trip));
  assert.equal(context.window.AtlasBudget.summary(trip).knownTotalMXN, 1234.50);
  assert.equal(format.price(trip), '$1,234.50');
});

test('legacy budget ranges remain eligible and render independently of structured totals', () => {
  const legacy = { ...trip, expenses: [], budgetRange: [50000, 65000] };
  assert.ok(format.canRenderFullTrip(legacy));
  assert.equal(format.price(legacy), '$50,000–$65,000');
});
