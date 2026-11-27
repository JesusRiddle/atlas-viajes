'use strict';
const {suite,relationErrors,problem}=require('./section.cjs');
function check(t,c){
 const errors=relationErrors(t,['experiences'],c);
 if(c&&(!Array.isArray(t.experiences)||!t.experiences.length))errors.push(problem('experiences','Experiencias pendientes de definir'));
 return errors;
}
suite('Experiencias',check,{experiences:[{city:'Puerto',description:'Recorrer el mercado y probar especialidades locales.'}]},[
 {experiences:[{city:'',description:'Visita'}]},
 {experiences:[{city:'Puerto',description:''}]},
 {experiences:'texto'}
],{complete:true});


// Advertencias orientativas: no se convierten en gates de compra ni de extensión.
// Auditoría editorial optativa de experiencias: advertencias, no bloqueo de viajes heredados.
// Las excepciones de gastronomía se revisan manualmente; jamás inferirlas por longitud.
function experienceWarnings(trip) {
  const warnings = [];
  if (!Array.isArray(trip?.experiences)) return warnings;
  trip.experiences.forEach((experience, index) => {
    if (!experience || typeof experience.description !== 'string') return;
    const words = experience.description.trim().split(/\s+/u).filter(Boolean).length;
    if (words < 18) warnings.push({path: 'experiences[' + index + '].description',
      code: 'too-short', words, message: 'Experiencia por debajo de 18 palabras; revisar contenido específico'});
    if (words > 35) warnings.push({path: 'experiences[' + index + '].description',
      code: 'review-extension', words, message: 'Más de 35 palabras; comprobar justificación gastronómica'});
  });
  return warnings;
}

const test=require('node:test');
const assert=require('node:assert/strict');
const {trips}=require('./catalog.cjs');
test('experiencias: longitud recomendada y excepciones bajo revisión', () => {
  const intro = 'Recorrer el centro histórico, visitar su museo principal y explorar las plazas cercanas con un guía local que explique su arquitectura y acontecimientos importantes.';
  assert.deepEqual(experienceWarnings({ experiences: [{ city: 'Ciudad', description: intro }] }), []);
  assert.equal(experienceWarnings({ experiences: [{ description: 'Pasear.' }] })[0].code, 'too-short');
  assert.equal(experienceWarnings({ experiences: [{ description: Array(36).fill('gastronomía').join(' ') }] })[0].code, 'review-extension');
  assert.deepEqual(experienceWarnings({ experiences: [] }), []);
});

test('experiencias: advertencias visibles sobre catálogo dinámico',t=>{
 for(const {module,trip} of trips)for(const warning of experienceWarnings(trip))t.diagnostic(JSON.stringify({trip:module.id,...warning}));
});
