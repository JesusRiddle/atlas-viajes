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
  assert.equal(trip.status, 'ready');
  assert.ok(Array.isArray(trip.introHighlights));
  assert.ok(trip.introHighlights.length > 0);
  for (const name of trip.introHighlights) {
    assert.ok(trip.intro.includes(name), 'Resaltado ausente en intro: ' + name);
  }
  assert.doesNotMatch(trip.intro, /reservar primero|aún sin comprar|entrada nominativa|servicios no modificables/i);
});

test('reservaciones importantes de Italia 2027 tienen grupos, prioridad y enlaces oficiales', () => {
  const trip = JSON.parse(fs.readFileSync(path.join('data/trips', 'italia-norte-2027.json'), 'utf8'));
  assert.equal(trip.planningDetails.reservationTitle, 'Reservaciones importantes');
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
  assert.match(critical[0].description, /miércoles 12 mayo/i);
  assert.match(critical[0].description, /marzo 2027/);
});

test('Italia 2027: fechas, noches y viajes de ida y vuelta coherentes', () => {
  const trip = JSON.parse(fs.readFileSync(path.join('data/trips', 'italia-norte-2027.json'), 'utf8'));
  assert.equal(trip.days.length, 14);
  assert.equal(trip.bases.reduce((total, [, nights]) => total + nights, 0), 12);
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
      for (const fare of option.fares || []) {
        if (fare.price !== null) {
          assert.ok(Number.isFinite(fare.price.amount) && fare.price.amount >= 0, transfer.id);
          assert.ok(['EUR', 'USD', 'MXN'].includes(fare.price.currency), transfer.id);
        }
      }
    }
  }
  const source = fs.readFileSync('components/major-transport.js', 'utf8');
  assert.match(source, /Array\.isArray\(item\)/, 'Las notas deben admitir objetos y arreglos');
});

test('Italia 2027 mantiene vuelos cotizados y trenes futuros sin precios inventados', () => {
  const trip = JSON.parse(fs.readFileSync(path.join('data/trips', 'italia-norte-2027.json'), 'utf8'));
  assert.match(trip.flight, /20,113\.46 MXN/);
  assert.match(trip.flight, /no comprada/i);
  const flight = trip.majorTransport.find(t => t.id === 'flight-international');
  assert.equal(flight.options[0].status, 'quoted');
  assert.equal(flight.options[0].fares[0].price.amount, 20113.46);
  assert.equal(flight.options[0].fares[0].price.currency, 'MXN');
  for (const t of trip.majorTransport.filter(t => t.id !== 'flight-international')) {
    for (const o of t.options) {
      assert.ok(['planning', 'quoted', 'reference'].includes(o.status), t.id);
      for (const fare of o.fares || []) {
        if (fare.price !== null) {
          assert.ok(Number.isFinite(fare.price.amount) && fare.price.amount >= 0, t.id);
          assert.ok(['MXN', 'EUR', 'USD'].includes(fare.price.currency), t.id);
        }
      }
    }
  }
});

test('Italia 2027: traslados y gastos de vuelos sin duplicados', () => {
 const trip=JSON.parse(fs.readFileSync(path.join('data/trips','italia-norte-2027.json'),'utf8'));
 const valid=new Set(trip.majorTransport.map(t=>t.id));
 for (const day of trip.days) for(const id of day.transportRefs||[]) assert.ok(valid.has(id),'Traslado inexistente '+id);
 assert.ok(trip.days[0].transportRefs.includes('flight-international'));
 assert.ok(trip.days.at(-1).transportRefs.includes('flight-international'));
 const flight=trip.majorTransport.find(t=>t.id==='flight-international');
 assert.equal(flight.options[0].fares[0].price.amount,20113.46);
 assert.ok(!trip.expenses.some(e=>e.category==='flight'),'El vuelo debe computarse desde majorTransport');
 const ct=trip.majorTransport.find(t=>t.id==='train-cinque-terre').options[0].journeys;
 assert.equal(ct[0].segments[0].to,'Riomaggiore');
 assert.match(ct[1].segments[0].from,/Vernazza|Monterosso/);
});


test('Italia 2027 incluye requisitos de entrada y guía universal para futuros viajes', () => {
 const trip=JSON.parse(fs.readFileSync(path.join('data/trips','italia-norte-2027.json'),'utf8'));
 const ids=trip.practicalIndicators.map(i=>i.id);
 assert.deepEqual(ids,['style','language','entry']);
 const entry=trip.practicalIndicators.find(i=>i.id==='entry');
 const language=trip.practicalIndicators.find(i=>i.id==='language');
 assert.equal(language.title,'Idioma y moneda');
 assert.equal(entry.title,'Documentación y consejos prácticos');
 assert.ok(!language.text.startsWith('Italiano'));
 const css=fs.readFileSync('style.css','utf8');
 assert.match(css,/data-indicator-id="entry"/);
 assert.equal(trip.practicalIndicators[0].title,'Estilo de viaje');
 assert.match(trip.practicalIndicators[0].text,/independiente/);
 assert.match(language.text,/euros|Euro/i);
 assert.ok(!trip.practicalIndicators.some(i=>i.id==='currency'));
 for (const term of ['Pasaporte','ETIAS','EES','EE. UU.','adaptador','230 V']) assert.ok(entry.text.includes(term),'Falta '+term);
 const guide=fs.readFileSync('docs/trip-editorial-guide.md','utf8');
 assert.match(guide,/Requisitos prácticos obligatorios para CADA viaje nuevo/);
 assert.match(guide,/practicalIndicators\.entry/);
});


test('reglas editoriales: fines de semana flexibles y redistribución de días', () => {
 const guide=fs.readFileSync('docs/trip-editorial-guide.md','utf8');
 const agents=fs.readFileSync('AGENTS.md','utf8');
 assert.match(guide,/Aprovechar fines de semana cuando convenga/);
 assert.match(guide,/preferencia flexible, nunca regla estricta/);
 assert.match(guide,/Nunca agregar automáticamente días al final/);
 assert.match(guide,/reoptimizar fechas dependientes/i);
 assert.match(guide,/costo total aproximado/);
 assert.match(guide,/tres objetos/);
 assert.match(agents,/no anexarlos por defecto al final/);
});


test('un viaje borrador presenta días completos con las tarjetas del itinerario maestro', () => {
 const source=fs.readFileSync('components/trip.js','utf8');
 assert.match(source,/const readyDays = \(t\.days \|\| \[\]\)\.filter/);
 assert.match(source,/readyDays\.includes\(d\) \? day\(d\)/);
 assert.match(source,/completeDays \? renderedDays\(\) : partialDays\(\)/);
 assert.doesNotMatch(source,/const completeDays = complete &&/);
 const trip=JSON.parse(fs.readFileSync(path.join('data/trips','italia-norte-2027.json'),'utf8'));
 for(const n of [1,2,14]){
  const d=trip.days[n-1];
  assert.ok(d.date && Number.isInteger(d.n) && Array.isArray(d.places) && d.am && d.pm && d.night,'Día '+n+' no listo');
 }
});


test('día por día enlaza cada noche al alojamiento correcto y muestra check-in solo al llegar', () => {
 const trip=JSON.parse(fs.readFileSync(path.join('data/trips','italia-norte-2027.json'),'utf8'));
 const stays=trip.hotels;
 const overnightDays=trip.days.filter(d=>d.hotel);
 assert.equal(overnightDays.length,12);
 for(const d of overnightDays){
  const hotel=stays.find(h=>h.id===d.hotel);
  assert.ok(hotel, 'Hotel inexistente en día '+d.n);
  assert.ok(d.date>=hotel.checkIn && d.date<hotel.checkOut, 'Hotel incorrecto día '+d.n);
 }
 assert.equal(trip.days[0].hotel,undefined);
 assert.equal(trip.days[13].hotel,undefined);
 for(const hotel of stays){
  const assigned=overnightDays.filter(d=>d.hotel===hotel.id);
  assert.equal(assigned[0].date,hotel.checkIn);
  assert.equal(assigned.length,Math.round((Date.parse(hotel.checkOut)-Date.parse(hotel.checkIn))/86400000));
 }
});


test('las actividades numeradas no repiten número dentro del texto', () => {
 const src=fs.readFileSync('components/day.js','utf8');
 assert.match(src,/numbered\[1\] \|\| numbered\[2\]/);
 assert.match(src,/const content = numbered \? numbered\[3\] : line/);
 const legacy='*1.* Actividad';
 const plain='1. Actividad';
 const pattern=/^\s*(?:\*(\d+)\.\*|(\d+)\.)\s*(.*)$/;
 for(const item of [legacy,plain]) {
  const match=item.match(pattern);
  assert.equal(match[1]||match[2],'1');
  assert.equal(match[3],'Actividad');
 }
});


test('documentación resalta palabras completas y presenta ETIAS como enlace seguro', () => {
 const component = fs.readFileSync('components/trip.js','utf8');
 assert.match(component, /item\.id !== 'entry'/);
 assert.ok(component.includes(String.raw`\p{L}`));
 assert.match(component, /Pasaporte\|ETIAS\|EES\|visa\|adaptador/);
 assert.match(component, /\$1<strong>\$2<\/strong>/);
 assert.match(component, /https:\/\/travel-europe\.europa\.eu\/etias/);
 assert.match(component, /noopener noreferrer/);
});


test('Italia mayo 2027: reservas, gastos, mapa y enlaces quedan sincronizados con la ruta', () => {
  const trip = JSON.parse(fs.readFileSync(path.join('data/trips', 'italia-norte-2027.json'), 'utf8'));
  const plan = {
    'ticket-milano-duomo': '2027-05-10',
    'ticket-egizio': '2027-05-11',
    'ticket-cenacolo': '2027-05-12',
    'ticket-brera': '2027-05-12',
    'ticket-siena': '2027-05-17',
    'ticket-accademia': '2027-05-18',
    'ticket-brunelleschi': '2027-05-18',
    'ticket-uffizi-vasari': '2027-05-19',
    'ticket-santa-croce': '2027-05-19',
    'ticket-bargello': '2027-05-20'
  };
  for (const [id, date] of Object.entries(plan)) {
    assert.equal(trip.expenses.find(e => e.id === id)?.date, date, id);
  }
  assert.equal(trip.days[6].title.includes('Cinque Terre'), true);
  assert.equal(trip.days[7].title.includes('Portovenere'), true);
  assert.ok(trip.mapPoints.find(x => x.name.includes('Cinque Terre')).order <
    trip.mapPoints.find(x => x.name === 'Portovenere').order);
  for (const day of [2, 4, 6, 7, 8, 9, 10, 14]) {
    const d = trip.days[day - 1];
    assert.ok(d.boardingGuide?.length > 60, 'Falta guía de embarque día ' + day);
    assert.ok(d.mobilityLinks?.length > 0, 'Faltan enlaces de Maps día ' + day);
    assert.ok(d.mobilityLinks.every(x => /^https:\/\//.test(x.url)));
  }
  for (const transfer of trip.majorTransport.filter(x => x.id !== 'flight-international')) {
    for (const option of transfer.options) {
      for (const journey of option.journeys) {
        for (const segment of journey.segments) {
          assert.equal(segment.departure, null, 'Tren futuro sin horario confirmado: ' + transfer.id);
          assert.equal(segment.arrival, null, 'Tren futuro sin horario confirmado: ' + transfer.id);
        }
      }
    }
  }
  assert.doesNotMatch(JSON.stringify(trip), /2027-04-(?:0[3-9]|1[0-6])/);
  const flight = trip.majorTransport.find(x => x.id === 'flight-international').options[0];
  assert.equal(flight.status, 'quoted');
  assert.match(flight.notes, /NO pagada ni comprada/);
});

test('Italia mayo 2027: evita regresiones de fechas ocultas y enlaces ferroviarios desaconsejados', () => {
  const trip = JSON.parse(fs.readFileSync(path.join('data/trips','italia-norte-2027.json'),'utf8'));
  const all = JSON.stringify(trip);
  for (const stale of ['1mayo', '04/04', '16/04', 'undefined Cada tramo']) assert.ok(!all.includes(stale), 'Referencia obsoleta: ' + stale);
  assert.match(trip.days[13].headerPlaces.join(' '), /22 de mayo de 2027/);
  const lucca = trip.majorTransport.find(x=>x.id==='train-la-spezia-lucca');
  const selected = lucca.options.find(x=>x.id===lucca.selectedOption);
  assert.doesNotMatch(selected.provider, /651|18707/);
  assert.ok(selected.journeys[0].segments.length >= 2);
  assert.match(selected.notes, /20–30 minutos/);
  const cinque = trip.majorTransport.find(x=>x.id==='train-cinque-terre');
  assert.equal(cinque.options[0].selectedFare, 'card-high');
  assert.equal(cinque.returnAlternatives, undefined);
  assert.match(trip.hotels[0].notes, /ferias comerciales/i);
  assert.match(trip.practicalIndicators.find(x=>x.id==='entry').text, /ETIAS/);
});
