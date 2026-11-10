const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const trip = JSON.parse(fs.readFileSync('data/trips/colombia-2027.json', 'utf8'));
const ctx = vm.createContext({window:{}});
for (const file of ['components/transport-model.js','components/selections.js','components/budget.js']) {
  vm.runInContext(fs.readFileSync(file,'utf8'),ctx,{filename:file});
}
const model=ctx.window.AtlasTransportModel;
const budget=ctx.window.AtlasBudget;
test('Colombia: itinerario consecutivo, noches y alojamientos sin duplicación',()=>{
  assert.equal(trip.days.length,12);
  assert.equal(trip.travelerCount,1);
  assert.equal(trip.work,8);
  assert.equal(trip.bases.reduce((n,[,v])=>n+v,0),11);
  assert.equal(trip.hotels.length,4);
  assert.equal(trip.stays.length,0,'Hoteles estructurados no deben duplicarse en stays');
  const ids=new Set(trip.hotels.map(h=>h.id));
  const date=new Date('2027-01-15T12:00:00Z');
  for(let i=0;i<12;i++){
    const d=trip.days[i];
    assert.equal(d.n,i+1);
    assert.equal(d.date,date.toISOString().slice(0,10));
    date.setUTCDate(date.getUTCDate()+1);
    assert.ok(typeof d.am==='string' && typeof d.pm==='string' && typeof d.night==='string');
    assert.ok(d.am.length>35 && d.pm.length>35 && d.night.length>35, 'Día '+d.n+' sin contenido operativo suficiente');
    assert.ok(d.am.length<390 && d.pm.length<390 && d.night.length<390, 'Día '+d.n+' excede concisión editorial');
    assert.doesNotMatch(d.am+d.pm+d.night,/\b(?:placeholder|lorem ipsum|undefined)\b/i);
    if (i<11) assert.ok(ids.has(d.hotel),'Sin alojamiento en día '+d.n);
    else assert.equal(d.hotel,undefined);
  }
  for (const h of trip.hotels){
    const nights=(Date.parse(h.checkOut)-Date.parse(h.checkIn))/86400000;
    assert.equal(nights,trip.bases.find(x=>x[0]===h.city)?.[1]);
  }
  assert.match(trip.days[5].note,/robos/);
  assert.match(trip.days[5].note,/chaleco salvavidas/);
  assert.match(trip.days[0].note,/fiebre amarilla/);
  assert.match(trip.planningDetails,/12 días, 11 noches/);
  assert.match(trip.planningDetails,/Sin noche añadida a Cartagena/);
  const medellinText=[trip.days[0],trip.days[1],trip.days[2]].map(d=>d.title+' '+d.am+' '+d.pm+' '+d.night).join(' ');
  for(const term of ['Guatapé','Comuna 13','Plaza Botero','Bolívar','Provenza','Pueblito Paisa']) assert.ok(medellinText.includes(term), 'Falta prioridad Medellín: '+term);
  assert.match(trip.days[1].am,/tour organizado|excursión organizada/);
  assert.match(trip.days[4].am,/finca cafetera|tour del café/i);
  assert.ok(trip.reservations.flatMap(g=>g[1]).some(x=>/Requisitos sanitarios/.test(x.title)));
  assert.ok(trip.hotels.some(h=>h.id==='sm-bahia-suite' && h.links?.some(x=>x.url.includes('martienda-deluxe-centro-historico')) && h.links?.some(x=>x.url.includes('casa-verde'))));
  assert.match(trip.days[6].am,/Museo del Oro Tairona/);
  assert.doesNotMatch(trip.days.map(d=>d.title+' '+d.am+' '+d.pm).join(' '),/San Pedro Alejandrino/);
});
test('Colombia: vuelos válidos, referencias y fechas sin doble contabilizar',()=>{
  assert.deepEqual([...model.validateTrip(trip)],[]);
  assert.deepEqual(trip.majorTransport.map(x=>x.budgetIncludedIn),['air-copa','air-avianca','ground-mobility']);
  const ids=new Set(trip.expenses.map(x=>x.id));
  assert.ok(trip.majorTransport.every(t=>ids.has(t.budgetIncludedIn)));
  assert.equal(budget.summary(trip).issues.length,0);
  assert.equal(budget.summary(trip).pending.length,0);
  assert.equal(budget.summary(trip).knownTotalMXN,49752);
  const estimate=budget.planningEstimate(trip);
  assert.equal(estimate.totalMXN,49752);
  assert.equal(estimate.low,43670);
  assert.equal(estimate.high,60670);
  assert.equal(trip.majorTransport[0].selectedOption,'A');
  assert.equal(budget.summary(trip,{'flight-international':{option:'B'}}).knownTotalMXN,50448);
  assert.equal(trip.expenses.filter(x=>x.category==='flight').length,2);
  assert.equal(trip.expenses.filter(x=>x.category==='lodging').reduce((a,x)=>a+x.cost.amount,0),17970);
  assert.equal(trip.expenses.reduce((a,x)=>a+x.cost.amount,0),49752);
  assert.ok(!trip.expenses.some(x=>x.id==='luggage-allowance'));
  assert.equal(trip.majorTransport[0].options[0].journeys[1].segments[1].flightNumber,'CM 188');
  assert.match(trip.majorTransport[0].options[0].journeys[1].segments[1].arrival,/22:05/);
  assert.equal(trip.majorTransport[0].options[0].links.length,1,'El candidato A debe enlazar su selección actualizada');
  assert.match(trip.majorTransport[0].options[0].links[0].url,/TTIDMTg4/,'El enlace A debe contener el vuelo CM188');
  const backup=budget.planningEstimate({...trip,majorTransport:trip.majorTransport.map(t=>t.id==='flight-international'?{...t,selectedOption:'B'}:t)});
  assert.equal(backup.totalMXN,50448);
  assert.equal(trip.hotels[0].checkIn,'2027-01-15');
  assert.equal(trip.hotels[0].checkOut,'2027-01-18');
  assert.equal(trip.majorTransport[0].options[0].fares[0].price.amount,9023);
  assert.equal(trip.majorTransport[0].options[1].fares[0].price.amount,9719);
  const [primary, backupOption] = trip.majorTransport[0].options;
  for (const [option, flightNumbers] of [[primary,['MTQ5','Mzk3','MTg4']],[backupOption,['MTk1','NjU0']]]) {
    assert.equal(option.links?.length,1);
    const bookingLink=option.links[0].url;
    assert.ok(bookingLink.startsWith('https://www.google.com/travel/flights/booking?tfs='));
    for(const part of flightNumbers) assert.ok(bookingLink.includes(part),'Falta tramo del candidato en URL');
    assert.ok(bookingLink.includes('hl=es-419&gl=MX'));
  }
  assert.ok(trip.days[8].transportRefs.includes('bus-tayrona-cartagena'));
  assert.equal(trip.majorTransport.find(x=>x.id==='bus-tayrona-cartagena').options.length,2);
});
test('Colombia: temperaturas con fuentes, indicadores y fotografías',()=>{
  assert.equal(Object.keys(trip.seasonality.months).length,12);
  for (const m of Object.values(trip.seasonality.months))
    assert.match(m.description,/\d+ a \d+ °C/);
  assert.deepEqual(trip.practicalIndicators.map(x=>x.id),['style','language','entry']);
  assert.equal(trip.hotels[0].id,'med-moabi');
  assert.equal(trip.expenses.find(x=>x.id==='hotel-med').hotelId,'med-moabi');
  assert.equal(trip.expenses.find(x=>x.id==='hotel-med').cost.amount,4768);
  assert.equal(trip.hotels.find(x=>x.city==='Cartagena').id,'ct-cabrero-house');
  assert.equal(trip.expenses.find(x=>x.id==='hotel-cartagena').cost.amount,5933);
  assert.equal(trip.expenses.find(x=>x.id==='hotel-santa').cost.amount,2069);
  assert.equal(trip.expenses.find(x=>x.id==='ground-mobility').cost.amount,7000);
  assert.match(trip.expenses.find(x=>x.id==='ground-mobility').notes,/PLAN A/);
  assert.match(trip.expenses.find(x=>x.id==='ground-mobility').notes,/PLAN B/);
  assert.equal(trip.budgetRange[0],43670);
  assert.equal(trip.expenses.find(x=>x.id==='hotel-santa').hotelId,'sm-bahia-suite');
  assert.ok(!JSON.stringify(trip).includes('Casa de Isabella'));
  assert.ok(trip.days.slice(3,6).every(d=>d.hotel==='sm-bahia-suite'));
  assert.equal(trip.expenses.find(x=>x.id==='hotel-cartagena').hotelId,'ct-cabrero-house');
  assert.ok(trip.hotels.find(x=>x.id==='ct-cabrero-house').links.some(x=>/el-viajero-2/.test(x.url)));
  assert.ok(!JSON.stringify(trip).includes('Casa La Fe'));
  assert.ok(!JSON.stringify(trip).toLowerCase().includes('landmark'));
  assert.match(trip.days[10].title,/Islas del Rosario/);
  assert.match(trip.days[10].am,/Corales Cartagena/);
  assert.match(trip.days[10].note,/Oceanario/);
  assert.match(trip.days[10].note,/Bora Bora/);
  assert.equal(trip.climate.split(/\n\s*\n/).length,3);
  assert.ok(trip.exchangeRates.COP>0);
  const places=JSON.parse(fs.readFileSync('data/places.json','utf8'));
  assert.ok(places[trip.cover]?.photo?.src.startsWith('https://'));
  assert.equal(trip.cover,'col27-cabo-san-juan');
  assert.deepEqual(trip.coverSlides,[
    'col27-cabo-san-juan','col27-comuna13','col27-guatape','col27-marinka','col27-san-diego'
  ]);
  assert.equal(new Set(trip.coverSlides).size,5,'El carrusel debe tener fotos únicas');
  for(const key of trip.coverSlides){
    assert.ok(places[key]?.photo?.src?.startsWith('https://'),'Foto del carrusel no existe: '+key);
    assert.ok(places[key]?.photo?.source && places[key]?.photo?.license,'Falta autoría de '+key);
  }
  for(const module of ['components/home.js','components/trip.js']){
    assert.match(fs.readFileSync(module,'utf8'),/trip\.coverSlides\?\.length/,'El carrusel no usa selección editorial: '+module);
  }

  const block1=['col27-botero','col27-provenza','col27-penol','col27-guatape','col27-comuna13','col27-escaleras','col27-pueblito'];
  assert.deepEqual(trip.days.slice(0,3).map(d=>d.places.length),[2,2,3]);
  assert.equal(new Set(block1).size,block1.length);
  for(const key of block1){
    assert.ok(places[key], 'Fotografía faltante: '+key);
    assert.match(places[key].photo.src,/^https:\/\/(?:thumb|upload)\.wikimedia\.org\//);
    assert.match(places[key].photo.source,/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
    assert.ok(places[key].photo.author && places[key].photo.license && places[key].photo.licenseUrl);
    const wordCount=(trip.placeDescriptions[key]||'').trim().split(/\s+/).length;
    assert.ok(wordCount>=15 && wordCount<=30,'Pie de foto fuera de norma '+key+': '+wordCount);
  }
  const block2=['col27-santamarta-catedral','col27-parque-novios','col27-minca-paisaje','col27-marinka','col27-taganga-bahia','col27-playa-grande'];
  assert.deepEqual(trip.days.slice(3,6).map(d=>d.places.length),[2,2,2]);
  assert.equal(new Set(block2).size,block2.length);
  for(const key of block2){
    assert.ok(places[key], 'Foto bloque 2 inexistente: '+key);
    assert.match(places[key].photo.src,/^https:\/\/(?:thumb|upload)\.wikimedia\.org\//);
    assert.match(places[key].photo.source,/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
    assert.ok(places[key].photo.author && places[key].photo.license && places[key].photo.licenseUrl);
    const words=(trip.placeDescriptions[key]||'').trim().split(/\s+/).length;
    assert.ok(words>=15 && words<=30,'Pie de foto fuera de norma: '+key);
  }
  const block3=['col27-tayrona-costa','col27-tayrona-laguna','col27-tayrona-sendero','col27-cabo-san-juan','col27-cabo-amanecer'];
  assert.deepEqual(trip.days.slice(6,8).map(d=>d.places.length),[2,3]);
  assert.equal(new Set(block3).size,block3.length);
  for(const key of block3){
    assert.ok(places[key], 'Foto bloque 3 inexistente: '+key);
    assert.match(places[key].photo.src,/^https:\/\/thumb\.wikimedia\.org\//);
    assert.match(places[key].photo.source,/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
    assert.ok(places[key].photo.author && places[key].photo.license && places[key].photo.licenseUrl);
    const words=(trip.placeDescriptions[key]||'').trim().split(/\s+/).length;
    assert.ok(words>=15 && words<=30,'Pie de foto fuera de norma: '+key);
  }
  assert.match(trip.placeDescriptions['col27-tayrona-costa'],/no corresponde al alojamiento/);
  assert.match(trip.placeDescriptions['col27-cabo-amanecer'],/no representa el horario/);
  const block4=['col27-torre-reloj','col27-murallas','col27-san-diego','col27-getsemani-murales','col27-castillo-san-felipe','col27-bovedas','col27-islas-rosario','col27-palacio-inquisicion','col27-convento-popa'];
  assert.deepEqual(trip.days.slice(8,12).map(d=>d.places.length),[0,6,3,0]);
  assert.deepEqual(trip.days[10].optionalPlaces,['col27-palacio-inquisicion','col27-convento-popa']);
  assert.equal(new Set(block4).size,block4.length);
  for(const key of block4){
    const photo=places[key]?.photo;
    assert.ok(photo,'Foto bloque 4 inexistente: '+key);
    assert.match(photo.src,/^https:\/\/(?:thumb|upload)\.wikimedia\.org\//);
    assert.match(photo.source,/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
    assert.ok(photo.author && photo.license && photo.licenseUrl,'Crédito incompleto: '+key);
    const words=(trip.placeDescriptions[key]||'').trim().split(/\s+/).length;
    assert.ok(words>=15 && words<=30,'Pie fuera de norma: '+key+' '+words);
  }
  assert.equal(trip.mapPoints.length,8);
  assert.equal(trip.intro.split(/\s+/).length>=70,true);
  assert.equal(trip.introHighlights.every(name=>trip.intro.includes(name)),true);
  assert.doesNotMatch(trip.intro,/\b(?:lunes|martes|miércoles|jueves|viernes|sábado|domingo)\s+\d+|\b(?:enero|febrero)\s+de\s+20\d\d|\b(?:reservar|reservado|candidato|por definir|provisional|noches|check-in|cotizar)\b/i,
    'La esencia narra experiencias y no decisiones operativas');
  assert.ok(trip.intro.trim().split(/\s+/).length<=130,'Introducción editorial demasiado larga');
  assert.ok(trip.days[9].am.includes('Castillo') && trip.days[9].pm.includes('La Mulata') && trip.days[9].night.includes('Getsemaní'));
  assert.match(trip.days[9].note,/chiva cultural Nomades/);
  assert.match(trip.hotels.find(h=>h.id==='sm-bahia-suite').address,/Calle 20 #3-30/);
  assert.match(trip.hotels.find(h=>h.id==='sm-bahia-suite').notes,/anuncio de Booking/);
  assert.match(trip.days[10].note,/261,500/);
  assert.match(trip.days[10].am,/08:30/);
  assert.match(trip.days[7].note,/07:00–15:00/);
  assert.match(trip.days[7].note,/Cabo San Juan/);
  assert.match(trip.tips[1],/03\/11\/2026/);
  assert.match(trip.expenses.find(x=>x.id==='ground-mobility').notes,/\$6,537 MXN/);

  assert.doesNotMatch(trip.introShort,/\b\d+ noches|cotizar|reservar/i);
  assert.match(trip.practicalIndicators.find(x=>x.id==='entry').text,/no necesitas adaptador/);
  assert.ok(trip.reservations.flatMap(g=>g[1]).some(x=>x.links?.some(link=>link.url.includes('fincalavictoria1892.com'))));
  assert.deepEqual(trip.mapPoints.map(x=>x.order),[1,2,3,4,5,6,7,8]);
});
test('Colombia: auditoría D final de 27 imágenes, portada, créditos y visitas opcionales',()=>{
  const catalog=JSON.parse(fs.readFileSync('data/places.json','utf8'));
  const dayKeys=trip.days.flatMap(day=>day.places||[]);
  assert.equal(dayKeys.length,27);
  assert.equal(new Set(dayKeys).size,27,'No duplicar fotografías en distintas jornadas');
  const catalogKeys=Object.keys(catalog).filter(key=>key.startsWith('col27-'));
  assert.deepEqual(new Set(dayKeys),new Set(catalogKeys),'No dejar imágenes huérfanas en el catálogo de Colombia');
  assert.equal(trip.coverSlides[0],trip.cover,'La portada debe iniciar en su fotografía principal');
  assert.equal(new Set(trip.coverSlides).size,5,'Carrusel representativo sin repetidos');
  for(const key of dayKeys){
    const photo=catalog[key].photo;
    assert.ok(photo.src.startsWith('https://'),'Foto fuera de HTTPS: '+key);
    assert.ok(/^(?:https:\/\/thumb\.wikimedia\.org|https:\/\/upload\.wikimedia\.org)\//.test(photo.src),
      'La URL debe señalar imagen y no una página HTML: '+key);
    assert.ok(photo.source.startsWith('https://commons.wikimedia.org/wiki/File:'),
      'Fuente primaria de Commons: '+key);
    assert.ok(photo.author&&photo.attribution&&photo.license&&photo.licenseUrl,'Créditos/licencia: '+key);
    const wordCount=trip.placeDescriptions[key]?.trim().split(/\s+/).length||0;
    assert.ok(wordCount>=15&&wordCount<=30,'Descripción fuera de 15–30 palabras: '+key);
  }
  assert.deepEqual(trip.days.map(day=>day.places.length),[2,2,3,2,2,2,2,3,0,6,3,0]);
  assert.deepEqual(trip.days[10].optionalPlaces,['col27-palacio-inquisicion','col27-convento-popa'],
    'Las fotos del Museo Histórico y La Popa deben seguir siendo alternativas por mal tiempo');
  assert.ok(trip.days[6].places.every(k=>/tayrona/.test(k)),
    'Las imágenes del día de descanso son solo ilustraciones regionales');
  assert.match(catalog['col27-botero'].photo.attribution,/Wikimedia Commons/);
  const slideshow=fs.readFileSync('components/trip.js','utf8');
  assert.match(slideshow,/failedSources\.add\(sources\[next\]\)/,
    'Si una foto de proveedor falla, el carrusel no debe quedar bloqueado');
});
