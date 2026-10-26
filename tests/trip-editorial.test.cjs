const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('existen instrucciones editoriales y están enlazadas desde README y AGENTS', () => {
  const guide = fs.readFileSync('docs/trip-editorial-guide.md', 'utf8');
  const agents = fs.readFileSync('AGENTS.md', 'utf8');
  const readme = fs.readFileSync('README.md', 'utf8');
  for (const heading of ['Panorama del viaje', 'Mapa', 'Temporadas', 'Experiencias',
    'Reservaciones', 'Traslados', 'Dónde dormir', 'Día por día', 'Presupuesto']) {
    assert.ok(guide.includes(heading), 'Falta sección editorial: ' + heading);
  }
  assert.match(agents, /trip-editorial-guide\.md/);
  assert.match(readme, /trip-editorial-guide\.md/);
  assert.match(guide, /introHighlights/);
  assert.match(guide, /No incluir en `intro`/);
});

test('el viaje Italia 2027 mantiene introducción turística con resaltados existentes', () => {
  const trip = JSON.parse(fs.readFileSync(path.join('data/trips','italia-norte-2027.json'), 'utf8'));
  assert.equal(trip.status, 'draft');
  assert.ok(Array.isArray(trip.introHighlights));
  assert.ok(trip.introHighlights.length > 0);
  for (const name of trip.introHighlights) {
    assert.ok(trip.intro.includes(name), 'Resaltado ausente en intro: ' + name);
  }
  assert.doesNotMatch(trip.intro, /reservar primero|aún sin comprar|entrada nominativa|servicios no modificables/i);
});

test('los 12 meses evaluados contienen rango de temperatura visible', () => {
  const drafts = fs.readdirSync('data/trips').filter(name => name.endsWith('.json') && !name.startsWith('_')).map(name => ({name, trip: JSON.parse(fs.readFileSync(path.join('data/trips', name), 'utf8'))})).filter(({trip}) => trip.status === 'draft' && trip.seasonality?.months);
  assert.ok(drafts.length, 'Sin viajes borrador para validar');
  const pattern = /[-−]?\d{1,2}(?:[.,]\d+)?\s*[–—-]\s*[-−]?\d{1,2}(?:[.,]\d+)?\s*°\s*C/i;
  for (const {name, trip} of drafts) {
    const months = trip.seasonality.months;
    assert.equal(Object.keys(months).length, 12, name + ': número de meses');
    for (let month = 1; month <= 12; month++) {
      const key = String(month).padStart(2, '0');
      assert.ok(months[key], name + ': falta mes ' + key);
      if (months[key].status !== 'pending') {
        assert.match(months[key].description, pattern, name + ': mes sin temperatura visible ' + key);
      }
    }
  }
});

test('los indicadores prácticos del viaje incluyen etiquetas y tonos válidos', () => {
  const trip = JSON.parse(fs.readFileSync(path.join('data/trips', 'italia-norte-2027.json'), 'utf8'));
  const expected = {solo:'Muy recomendable',pace:'Moderado–activo',language:'Fácil',currency:'Tarjetas aceptadas'};
  assert.equal(trip.practicalIndicators.length, 4);
  for (const item of trip.practicalIndicators) {
    assert.equal(item.badge, expected[item.id]);
    assert.ok(['green','orange'].includes(item.tone));
    assert.ok(item.text.trim().length > 15);
  }
  const component = fs.readFileSync('components/trip.js', 'utf8');
  assert.match(component, /item\.badge/);
  assert.match(component, /item\.tone/);
});

test('reservas críticas de Italia 2027 tienen grupos, prioridad y enlaces oficiales', () => {
  const trip = JSON.parse(fs.readFileSync(path.join('data/trips', 'italia-norte-2027.json'), 'utf8'));
  assert.equal(trip.planningDetails.reservationTitle, 'Reservas críticas');
  assert.ok(trip.reservations.length >= 2);
  for (const [heading, items] of trip.reservations) {
    assert.ok(heading && Array.isArray(items) && items.length);
    for (const item of items) {
      assert.ok(item.title && item.description?.length > 30);
      for (const link of item.links || []) {
        assert.ok(link.label && /^https:\/\//.test(link.url));
      }
    }
  }
  const critical = trip.reservations[0][1];
  assert.match(critical[0].title, /Última Cena/);
  assert.match(critical[0].description, /6 de abril/);
  assert.match(critical[0].description, /7/);
});

test('Italia 2027: fechas, noches y viajes de ida y vuelta coherentes', () => {
  const trip = JSON.parse(fs.readFileSync(path.join('data/trips', 'italia-norte-2027.json'), 'utf8'));
  assert.equal(trip.days.length, 12);
  assert.equal(trip.bases.reduce((total, [, nights]) => total + nights, 0), 10);
  for (let i = 0; i < trip.days.length; i++) {
    const expected = new Date(Date.parse(trip.start + 'T12:00:00Z') + i * 86400000).toISOString().slice(0, 10);
    assert.equal(trip.days[i].date, expected);
    assert.equal(trip.days[i].n, i + 1);
  }
  assert.equal(trip.days.at(-1).date, trip.end);
  for (const transfer of trip.majorTransport) {
    for (const option of transfer.options) {
      assert.ok(option.journeys.length);
      for (const journey of option.journeys) {
        assert.ok(journey.segments.length);
        for (let i = 1; i < journey.segments.length; i++) {
          assert.equal(journey.segments[i - 1].to, journey.segments[i].from,
            transfer.id + ': segmentos inconexos');
        }
      }
      if (option.status === 'planning') {
        assert.ok(option.fares.every(fare => fare.price === null),
          transfer.id + ': precio sin cotizar presentado como confirmado');
      }
    }
  }
  const source = fs.readFileSync('components/major-transport.js', 'utf8');
  assert.match(source, /Array\.isArray\(item\)/, 'Las notas deben admitir objetos y arreglos');
});

test('el manual y AGENTS establecen el orden de armado antes de publicar', () => {
  const guide = fs.readFileSync('docs/trip-editorial-guide.md', 'utf8');
  const agents = fs.readFileSync('AGENTS.md', 'utf8');
  const readme = fs.readFileSync('README.md', 'utf8');
  for (const section of ['Fase 0', 'Fase 1', 'Fase 2', 'Fase 3', 'Mapa', 'Temporadas', 'Experiencias', 'Movilidad y conexiones', 'Presupuesto']) {
    assert.ok(guide.includes(section), 'Falta paso: ' + section);
  }
  assert.match(agents, /Fase 0/);
  assert.match(readme, /Orden:/);
});

test('Italia 2027 mantiene vuelos cotizados y trenes futuros sin precios inventados', () => {
  const trip = JSON.parse(fs.readFileSync(path.join('data/trips', 'italia-norte-2027.json'), 'utf8'));
  assert.match(trip.flight, /16,683 MXN/);
  assert.match(trip.flight, /no comprada/i);
  const flight = trip.majorTransport.find(t => t.id === 'flight-international');
  assert.equal(flight.options[0].status, 'quoted');
  assert.equal(flight.options[0].fares[0].price.amount, 16683);
  assert.equal(flight.options[0].fares[0].price.currency, 'MXN');
  for (const t of trip.majorTransport.filter(t => t.id !== 'flight-international')) {
    const o = t.options[0];
    assert.equal(o.status, 'planning', t.id);
    assert.equal(o.fares[0].price, null, t.id);
  }
});

test('Italia 2027: tres hoteles principales y presupuesto distribuido', () => {
  const trip = JSON.parse(fs.readFileSync(path.join('data/trips','italia-norte-2027.json'),'utf8'));
  assert.equal(trip.hotels.length,3);
  const nights={'Milano':3,'La Spezia':2,'Firenze':5};
  const hotelExpenses=trip.expenses.filter(x=>x.category==='lodging');
  assert.equal(hotelExpenses.length,3);
  assert.equal(hotelExpenses.reduce((a,x)=>a+x.cost.amount,0),21800);
  for(const h of trip.hotels){
    assert.match(h.status,/no reservado/);
    assert.match(h.rate,/No es cotización/);
    assert.equal(hotelExpenses.find(x=>x.hotelId===h.id).nights,nights[h.city]);
  }
  assert.equal(trip.expenses.filter(x=>x.category==='food').length,12);
  assert.equal(trip.expenses.filter(x=>x.category==='food').reduce((a,x)=>a+x.cost.amount,0),9500);
  assert.equal(trip.budgetPreliminary,true);
});


test('Italia 2027: traslados y gastos de vuelos sin duplicados', () => {
 const trip=JSON.parse(fs.readFileSync(path.join('data/trips','italia-norte-2027.json'),'utf8'));
 const valid=new Set(trip.majorTransport.map(t=>t.id));
 for (const day of trip.days) for(const id of day.transportRefs||[]) assert.ok(valid.has(id),'Traslado inexistente '+id);
 assert.ok(trip.days[0].transportRefs.includes('flight-international'));
 assert.ok(trip.days.at(-1).transportRefs.includes('flight-international'));
 const flight=trip.majorTransport.find(t=>t.id==='flight-international');
 assert.equal(flight.options[0].fares[0].price.amount,16683);
 assert.ok(!trip.expenses.some(e=>e.category==='flight'),'El vuelo debe computarse desde majorTransport');
 const ct=trip.majorTransport.find(t=>t.id==='train-cinque-terre').options[0].journeys;
 assert.equal(ct[0].segments[0].to,'Riomaggiore');
 assert.equal(ct[1].segments[0].from,'Monterosso al Mare');
});
