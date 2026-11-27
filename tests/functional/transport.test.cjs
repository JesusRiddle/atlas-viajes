'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {runtime,plain,transport}=require('./runtime.cjs');
const model=runtime(['components/transport-model.js']).AtlasTransportModel;
test('Duraciones absolutas, escalas y cambio de fecha local',()=>{
 const journey={segments:[
 {from:'A',to:'B',departure:'2027-01-01T23:00:00-06:00',arrival:'2027-01-02T08:00:00+01:00'},
 {from:'B',to:'C',departure:'2027-01-02T09:30:00+01:00',arrival:'2027-01-02T11:00:00+01:00'}]};
 const result=plain(model.journeySummary(journey));
 assert.equal(result.durationMinutes,300);
 assert.deepEqual(result.segmentMinutes,[120,90]);
 assert.deepEqual(result.layoverMinutes,[90]);
 assert.deepEqual(result.connectionPoints,['B']);
 assert.equal(result.stops,1);
 assert.equal(model.validateJourney(journey).length,0);
 assert.equal(model.durationMinutes('2027-01-01T12:00Z','2027-01-01T12:00Z'),0);
 assert.equal(model.durationMinutes('2027-01-01T12:00','2027-01-01T13:00Z'),null);
 assert.equal(model.durationMinutes('2027-01-01T13:00Z','2027-01-01T12:00Z'),null);
});
test('Tarifa seleccionada, pendiente y referencias no válidas',()=>{
 const t=transport();
 assert.equal(model.selectedOption(t).id,'a');
 assert.equal(model.selectedFare(model.selectedOption(t)).id,'basic');
 assert.deepEqual(plain(model.quotedPrice(t)),{amount:10,currency:'EUR'});
 t.options[0].fares[0].price=null;
 assert.equal(model.quotedPrice(t),null);
 assert.equal(model.validateTransport(t).length,0);
 t.selectedOption='missing';
 assert.ok(model.validateTransport(t).some(s=>s.includes('Opción seleccionada')));
});
test('Modelo identifica conexión negativa y equipaje imposible, permite pendientes',()=>{
 const j={segments:[{from:'A',to:'B',departure:'2027-01-01T12:00Z',arrival:'2027-01-01T14:00Z'},{from:'B',to:'C',departure:'2027-01-01T13:00Z',arrival:null}]};
 assert.ok(model.validateJourney(j).some(s=>s.includes('escala negativa')));
 assert.equal(model.validateJourney({segments:[{from:'A',to:'B',departure:null,arrival:null}]}).length,0);
 assert.equal(model.validateBaggage({cabin:null,checked:{pieces:0}}).length,0);
 assert.ok(model.validateBaggage({cabin:{weightKg:-1,dimensionsCm:[1,0,3]}}).length>=2);
 assert.ok(model.validateTrip({majorTransport:[transport()],days:[{n:1,transportRefs:['missing']}]}).some(s=>s.includes('referencia desconocida')));
});

test('Referencias repetidas, día incompatible y tarifa inválida',()=>{
 const t={...transport(),day:2};
 assert.equal(model.validateTrip({majorTransport:[t],days:[{n:2,transportRefs:['rail']}]}).length,0);
 const errors=model.validateTrip({majorTransport:[t],days:[{n:1,transportRefs:['rail','rail']}]});
 assert.ok(errors.some(x=>x.includes('repetido')));
 assert.ok(errors.some(x=>x.includes('fecha no coincide')));
 t.options[0].fares[0].price={amount:-1,currency:'EUR'};
 assert.equal(model.quotedPrice(t),null);
 assert.ok(model.validateTransport(t).some(x=>x.includes('Importe')));
});
