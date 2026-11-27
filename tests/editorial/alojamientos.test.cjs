'use strict';
const {suite,relationErrors,problem}=require('./section.cjs');
const {dateOK}=require('./contracts.cjs');
const list=x=>Array.isArray(x)?x:[];
function check(t,c){
 const errors=relationErrors(t,['hotels','bases'],c);
 const assigned=new Map();
 for(const h of list(t.hotels))if(h&&typeof h==='object'&&c&&!(typeof h.name==='string'&&h.name.trim()))errors.push(problem('hotels.'+h.id+'.name','Nombre requerido al cierre'));
 for(const day of list(t.days)){
   if(!day?.hotel)continue;
   if(!assigned.has(day.hotel))assigned.set(day.hotel,[]);
   assigned.get(day.hotel).push(day.date);
 }
 for(const h of list(t.hotels)){
   if(!h||!dateOK(h.checkIn)||!dateOK(h.checkOut))continue;
   const dates=assigned.get(h.id)||[];
   const nights=(Date.parse(h.checkOut)-Date.parse(h.checkIn))/86400000;
   if(dates.length>nights||new Set(dates).size!==dates.length||c&&dates.length&&dates.length!==nights)
     errors.push(problem('hotels.'+h.id,'Noches asignadas inconsistentes'));
 }
 return errors;
}
suite('Alojamientos',check,{hotels:[{id:'h',checkIn:'2027-05-01',checkOut:'2027-05-03',mapsUrl:'https://maps.google.com/',links:[{url:'https://example.org/'}]}]},[
 {hotels:[{id:'h',checkIn:'2027-05-03',checkOut:'2027-05-01'}]},
 {hotels:[{id:'h'},{id:'h'}]},
 {hotels:[{id:'h',mapsUrl:'not-a-url'}]},
 {hotels:[{id:'h',checkIn:'2027-05-01',checkOut:'2027-05-02'}],days:[{hotel:'h',date:'2027-05-01'},{hotel:'h',date:'2027-05-01'}]}
]);


// Advertencias orientativas: no se convierten en gates de compra ni de extensión.
// Diagnóstico conservador: no interpreta texto libre como comprobante de compra.
// Solo identifica contradicciones explícitas entre estados de hotel y gasto vinculado.
const negative = /\b(?:no\s+reservad[oa]s?|sin\s+reservar|por\s+reservar|candidat[oa]s?|primera\s+opci[oó]n)\b/iu;
const positive = /\b(?:reserva\s+confirmada|reservad[oa]s?|pagad[oa]s?)\b/iu;
function lodgingStatusWarnings(trip) {
  const warnings = [];
  if (!Array.isArray(trip?.hotels) || !Array.isArray(trip?.expenses)) return warnings;
  for (const [i, hotel] of trip.hotels.entries()) {
    if (!hotel || typeof hotel !== 'object' || typeof hotel.id !== 'string') continue;
    const status = typeof hotel.status === 'string' ? hotel.status : '';
    const candidate = negative.test(status);
    const confirmed = positive.test(status) && !candidate;
    for (const [j, cost] of trip.expenses.entries()) {
      if (cost?.hotelId !== hotel.id) continue;
      const booked = ['reserved','confirmed','purchased','paid'].includes(cost.status);
      const unbooked = ['pending','quoted','estimated'].includes(cost.status);
      if (candidate && booked) warnings.push({
        path: 'expenses[' + j + '].status', code: 'candidate-charged-as-booked',
        message: 'Gasto de alojamiento marcado como reservado/pagado mientras el hotel figura como candidato'
      });
      if (confirmed && unbooked) warnings.push({
        path: 'hotels[' + i + '].status', code: 'booked-with-unconfirmed-ledger',
        message: 'Hotel descrito como reservado pero el gasto vinculado sigue pendiente o estimado; verificar pago y estado'
      });
    }
  }
  return warnings;
}

const test=require('node:test');
const assert=require('node:assert/strict');
const {trips}=require('./catalog.cjs');
test('distingue candidato, cotización y reserva confirmada sin inventar compras', () => {
  const trip = { hotels: [{ id: 'a', status: 'Candidato · NO reservado' }],
    expenses: [{ hotelId: 'a', status: 'estimated' }] };
  assert.deepEqual(lodgingStatusWarnings(trip), []);
  trip.expenses[0].status = 'paid';
  assert.equal(lodgingStatusWarnings(trip)[0].code, 'candidate-charged-as-booked');
  trip.hotels[0].status = 'Reserva confirmada';
  trip.expenses[0].status = 'estimated';
  assert.equal(lodgingStatusWarnings(trip)[0].code, 'booked-with-unconfirmed-ledger');
  trip.expenses[0].status = 'paid';
  assert.deepEqual(lodgingStatusWarnings(trip), []);
});
test('no considera la frase NO reservado una reserva real', () => {
  const t = { hotels: [{ id: 'a', status: 'Seleccionado, no reservado' }],
    expenses: [{ hotelId: 'a', status: 'quoted' }] };
  assert.deepEqual(lodgingStatusWarnings(t), []);
  assert.deepEqual(lodgingStatusWarnings({ hotels: [], expenses: [] }), []);
});

test('alojamientos: advertencias visibles sobre catálogo dinámico',t=>{
 for(const {module,trip} of trips)for(const warning of lodgingStatusWarnings(trip))t.diagnostic(JSON.stringify({trip:module.id,...warning}));
});
