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

test('resaltados editoriales de todos los viajes vigentes corresponden a texto real', () => {
  const window = {};
  const vm = require('node:vm');
  vm.runInNewContext(fs.readFileSync('modules.js', 'utf8'), { window });
  for (const module of window.ATLAS_MODULES.filter(m => m.available && m.homeGroup !== 'ideas')) {
    const trip = JSON.parse(fs.readFileSync(path.join('data/trips', module.file), 'utf8'));
    if (trip.intro == null) continue;
    assert.equal(typeof trip.intro, 'string', trip.id + ': introducción inválida');
    for (const name of trip.introHighlights || []) {
      assert.ok(trip.intro.includes(name), trip.id + ': resaltado ausente en intro: ' + name);
    }
    assert.doesNotMatch(trip.intro,
      /reservar primero|aún sin comprar|entrada nominativa|servicios no modificables/i,
      trip.id + ': información administrativa en texto turístico');
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

