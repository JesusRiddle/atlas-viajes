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

test('Italia 2027: fechas, noches y viajes de ida y vuelta coherentes', () => {
  const trip = JSON.parse(fs.readFileSync(path.join('data/trips', 'italia-norte-2027.json'), 'utf8'));
  assert.ok(trip.days.length > 0);
  const declaredDays = (Date.parse(trip.end) - Date.parse(trip.start)) / 86400000 + 1;
  assert.equal(trip.days.length, declaredDays);
  const selectedHotels = new Set(trip.days.map(day => day.hotel).filter(Boolean));
  const actualNights = trip.days.filter(day => day.hotel).length;
  const recordedNights = trip.hotels.filter(hotel => selectedHotels.has(hotel.id))
    .reduce((total, hotel) =>
      total + (Date.parse(hotel.checkOut) - Date.parse(hotel.checkIn)) / 86400000, 0);
  assert.equal(actualNights, recordedNights);
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
 const ready = trip.days.filter(d =>
  d.date && Number.isInteger(d.n) && Array.isArray(d.places) && d.am && d.pm && d.night);
 assert.ok(ready.length > 0, 'Una jornada completa debe renderizarse aunque otras estén en borrador');
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

