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

test('los 12 meses evaluados contienen rango de temperatura visible', () => {
  const drafts = fs.readdirSync('data/trips').filter(name => name.endsWith('.json') && !name.startsWith('_')).map(name => ({name, trip: JSON.parse(fs.readFileSync(path.join('data/trips', name), 'utf8'))})).filter(({trip}) => ['draft', 'ready'].includes(trip.status) && trip.seasonality?.months);
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
  const expected = {style:'Moderado–activo',language:'Italiano · EUR',entry:'Verificar antes de viajar'};
  assert.equal(trip.practicalIndicators.length, 3);
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
  assert.match(critical[0].description, /martes 6 o miércoles 7 de abril/);
  assert.match(critical[0].description, /7/);
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
    for (const o of t.options) {
      assert.ok(['planning', 'quoted'].includes(o.status), t.id);
      for (const fare of o.fares || []) {
        if (fare.price !== null) {
          assert.ok(Number.isFinite(fare.price.amount) && fare.price.amount >= 0, t.id);
          assert.ok(['MXN', 'EUR', 'USD'].includes(fare.price.currency), t.id);
        }
      }
    }
  }
});

test('Italia 2027: tres hoteles principales y presupuesto distribuido', () => {
  const trip = JSON.parse(fs.readFileSync(path.join('data/trips','italia-norte-2027.json'),'utf8'));
  assert.equal(trip.hotels.length,3);
  const nights={'Milano':4,'La Spezia':3,'Firenze':5};
  const hotelExpenses=trip.expenses.filter(x=>x.category==='lodging');
  assert.equal(hotelExpenses.length,3);
  assert.equal(hotelExpenses.reduce((a,x)=>a+x.cost.amount,0),25900);
  for(const h of trip.hotels){
    assert.match(h.status,/no reservado/);
    assert.match(h.rate,/no es cotización/i);
    assert.ok(h.mapsUrl?.startsWith('https://'), 'Google Maps faltante: ' + h.name);
    assert.ok(h.links?.some(link => link.url?.startsWith('https://')), 'Reserva oficial faltante: ' + h.name);
    assert.equal(hotelExpenses.find(x=>x.hotelId===h.id).nights,nights[h.city]);
  }
  assert.equal(trip.expenses.filter(x=>x.category==='food').length,14);
  assert.equal(trip.expenses.filter(x=>x.category==='food').reduce((a,x)=>a+x.cost.amount,0),11350);
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


test('Italia 2027: regreso 16 abril y distribución equilibrada de bases', () => {
 const trip=JSON.parse(fs.readFileSync(path.join('data/trips','italia-norte-2027.json'),'utf8'));
 assert.equal(trip.end,'2027-04-16');
 assert.deepEqual(trip.bases,[['Milano',4],['La Spezia',3],['Firenze',5]]);
 assert.equal(trip.work,10);
 assert.equal(trip.hotels.find(h=>h.city==='Firenze').checkOut,'2027-04-16');
 const flight=trip.majorTransport.find(t=>t.id==='flight-international').options[0];
 assert.match(flight.journeys[1].segments[0].departure,/^2027-04-16T23:05/);
 assert.match(flight.journeys[1].segments[0].arrival,/^2027-04-17T04:00/);
 for(const id of ['train-firenze-milano','airport-return'])assert.equal(trip.majorTransport.find(t=>t.id===id).day,14);
});


test('Italia 2027: distribución por fechas y visitas críticas coherentes', () => {
 const trip=JSON.parse(fs.readFileSync(path.join('data/trips','italia-norte-2027.json'),'utf8'));
 const titles=trip.days.map(d=>d.title);
 assert.equal(trip.days.length,14);
 assert.match(titles[4],/Milano/);
 assert.match(titles[6],/Portovenere/);
 assert.match(titles[7],/Cinque Terre/);
 assert.match(titles[8],/Lucca/);
 assert.match(titles[9],/Siena/);
 assert.match(titles[10],/David/);
 assert.match(titles[11],/Uffizi/);
 assert.match(titles[12],/Bargello/);
 assert.match(trip.days[8].note,/consigna/);
 assert.equal(trip.days[13].date,'2027-04-16');
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
 assert.match(language.text,/Euro/);
 assert.ok(!trip.practicalIndicators.some(i=>i.id==='currency'));
 for (const term of ['Pasaporte','ETIAS','EES','EE. UU.','adaptador','230 V']) assert.ok(entry.text.includes(term),'Falta '+term);
 const guide=fs.readFileSync('docs/trip-editorial-guide.md','utf8');
 assert.match(guide,/Requisitos prácticos obligatorios para CADA viaje nuevo/);
 assert.match(guide,/practicalIndicators\.entry/);
});


test('Italia 2027: fechas de hotel y traslados concuerdan con el día a día', () => {
 const trip=JSON.parse(fs.readFileSync(path.join('data/trips','italia-norte-2027.json'),'utf8'));
 const stays=[['2027-04-04','2027-04-08'],['2027-04-08','2027-04-11'],['2027-04-11','2027-04-16']];
 trip.hotels.forEach((h,i)=>{assert.equal(h.checkIn,stays[i][0]);assert.equal(h.checkOut,stays[i][1]);});
 const refsByDay={6:'train-milano-la-spezia',7:'bus-portovenere',8:'train-cinque-terre',9:'train-la-spezia-lucca',10:'train-siena',14:'train-firenze-milano'};
 for(const [day,id] of Object.entries(refsByDay)){
  assert.ok(trip.days[Number(day)-1].transportRefs?.includes(id),`Falta ${id} día ${day}`);
  assert.equal(trip.majorTransport.find(t=>t.id===id).day,Number(day));
 }
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


test('Italia 2027: todas las galerías apuntan a fotografías con fuente y créditos', () => {
  const trip = JSON.parse(fs.readFileSync('data/trips/italia-norte-2027.json', 'utf8'));
  const places = JSON.parse(fs.readFileSync('data/places.json', 'utf8'));
  for (const day of trip.days) {
    for (const id of day.places || []) {
      const photo = places[id]?.photo;
      assert.ok(photo, 'Foto inexistente: día ' + day.n + ', ' + id);
      for (const key of ['src', 'source', 'author', 'license', 'licenseUrl', 'attribution']) {
        assert.ok(typeof photo[key] === 'string' && photo[key].trim(), 'Crédito ' + key + ' faltante: ' + id);
      }
      assert.match(photo.src, /^(https:\/\/|photos\/)/, 'Ruta de imagen inválida: ' + id);
    }
  }
  const external = Object.entries(places).filter(([id]) => id.startsWith('italy27-'));
  assert.equal(external.length, 14, 'Se modificó el catálogo externo de Italia 2027');
  for (const [id, place] of external) {
    assert.match(place.photo.src, /^https:\/\/commons\.wikimedia\.org\/wiki\/Special:FilePath\//, id);
    assert.match(place.photo.source, /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/, id);
    assert.match(place.photo.licenseUrl, /^https:\/\/creativecommons\.org\//, id);
  }
});


test('documentación resalta palabras completas y presenta ETIAS como enlace seguro', () => {
 const component = fs.readFileSync('components/trip.js','utf8');
 assert.match(component, /item\.id !== 'entry'/);
 assert.ok(component.includes(String.raw`\p{L}`));
 assert.match(component, /Pasaporte\|ETIAS\|EES\|visa\|adaptador/);
 assert.match(component, /'<strong>\$2<\/strong>'/);
 assert.match(component, /https:\/\/travel-europe\.europa\.eu\/etias/);
 assert.match(component, /noopener noreferrer/);
});

