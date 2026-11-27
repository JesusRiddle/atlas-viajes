'use strict';
const {suite,relationErrors,problem}=require('./section.cjs');
const {diagnosticSuite}=require('./diagnostics.cjs');
const {dateOK}=require('../../scripts/editorial-relations.cjs');
const list=x=>Array.isArray(x)?x:[];
const currencies=new Set(Intl.supportedValuesOf('currency'));
function check(t,c){
 const errors=relationErrors(t,['majorTransport'],c);
 for(const [i,item] of list(t.majorTransport).entries()){
   if(!item||typeof item!=='object')continue;
   const p='majorTransport['+i+']';
   if(item.options!=null&&!Array.isArray(item.options)){errors.push(problem(p+'.options','Lista inválida'));continue;}
   const options=list(item.options);
   const ids=new Set();
   for(const [j,o] of options.entries()){
     const q=p+'.options['+j+']';
     if(!o||typeof o.id!=='string'||!o.id.trim()||ids.has(o.id)){errors.push(problem(q+'.id','ID ausente o duplicado'));continue;}
     ids.add(o.id);
     if(!Array.isArray(o.fares)||!o.fares.length)errors.push(problem(q+'.fares','Tarifas requeridas'));
     const fares=new Set();
     for(const [k,f] of list(o.fares).entries()){
       const z=q+'.fares['+k+']';
       if(!f||typeof f.id!=='string'||!f.id.trim()||fares.has(f.id)){errors.push(problem(z+'.id','ID de tarifa inválido'));continue;}
       fares.add(f.id);
       if(f.price!=null&&(!currencies.has(f.price.currency)||f.price.amount!==null&&(!Number.isFinite(f.price.amount)||f.price.amount<0)))errors.push(problem(z+'.price','Importe o moneda inválidos'));
     }
     if(!fares.has(o.selectedFare))errors.push(problem(q+'.selectedFare','Tarifa seleccionada inexistente'));
     if(!Array.isArray(o.journeys)||!o.journeys.length)errors.push(problem(q+'.journeys','Trayectos requeridos'));
     for(const [k,journey] of list(o.journeys).entries()){
       const z=q+'.journeys['+k+']';
       if(!Array.isArray(journey?.segments)||!journey.segments.length){errors.push(problem(z,'Sin segmentos'));continue;}
       for(let n=0;n<journey.segments.length;n++){
         const s=journey.segments[n],prior=journey.segments[n-1];
         if(!s?.from||!s?.to){errors.push(problem(z,'Origen/destino ausente'));continue;}
         if(n&&prior?.to!==s.from)errors.push(problem(z,'Conexión inconexa'));
         for(const key of ['departure','arrival'])if(s[key]!=null&&item.type==='flight'&&(!/(?:Z|[+-]\d{2}:\d{2})$/.test(s[key])||!Number.isFinite(Date.parse(s[key]))))errors.push(problem(z+'.'+key,'Hora aérea sin fecha/zona válida'));
         if(s.departure&&s.arrival&&Date.parse(s.arrival)<Date.parse(s.departure))errors.push(problem(z,'Duración negativa'));
         if(prior?.arrival&&s.departure&&Date.parse(s.departure)<Date.parse(prior.arrival))errors.push(problem(z,'Escala negativa'));
       }
     }
   }
   if(item.selectedOption!=null&&!ids.has(item.selectedOption))errors.push(problem(p+'.selectedOption','Opción inexistente'));
 }
 return errors;
}
const valid={majorTransport:[{id:'tren',type:'train',selectedOption:'a',options:[{id:'a',selectedFare:'f',fares:[{id:'f',price:null}],journeys:[{segments:[{from:'A',to:'B'},{from:'B',to:'C'}]}]}]}]};
function mutate(fn){const t=structuredClone(valid);fn(t.majorTransport[0],t.majorTransport[0].options[0]);return t;}
suite('Traslados',check,valid,[
 mutate(t=>t.selectedOption='x'),mutate((t,o)=>o.selectedFare='x'),mutate((t,o)=>o.fares[0].price={amount:-1,currency:'MXN'}),
 mutate((t,o)=>o.journeys[0].segments=[]),mutate((t,o)=>o.journeys[0].segments[1].from='D'),
 mutate((t,o)=>{t.type='flight';o.journeys[0].segments[0].departure='2027-01-01T12:00';})
]);
function quotes(t){
 const errors=[];
 for(const item of list(t.majorTransport))for(const o of list(item?.options)){
   if(o?.status==='quoted'&&(!dateOK(o.quotedAt)||!list(o.fares).some(f=>f?.id===o.selectedFare&&Number.isFinite(f.price?.amount))))
     errors.push(problem('majorTransport.'+item.id+'.options.'+o.id,'Cotización sin fecha o tarifa seleccionada conocida'));
 }
 return errors;
}
diagnosticSuite('Traslados: evidencia de cotización',quotes,{majorTransport:[{id:'t',options:[{id:'a',status:'quoted',quotedAt:'2027-01-01',selectedFare:'f',fares:[{id:'f',price:{amount:100,currency:'MXN'}}]}]}]},[
 {majorTransport:[{id:'t',options:[{id:'a',status:'quoted'}]}]}
]);
