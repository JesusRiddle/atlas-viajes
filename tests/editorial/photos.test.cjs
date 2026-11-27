'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {trips,read}=require('./catalog.cjs');
const {isUrl}=require('./contracts.cjs');
const root=path.resolve(__dirname,'../..');
const list=x=>Array.isArray(x)?x:[];
function check(trip,catalog,exists=src=>{try{const s=fs.statSync(path.resolve(root,src));return s.isFile()&&s.size>100;}catch{return false;}}){
 const errors=[];
 const refs=new Set([trip.cover,...list(trip.coverSlides),...list(trip.days).flatMap(d=>[...list(d?.places),...list(d?.optionalPlaces)])].filter(x=>x!=null));
 for(const key of refs){
  const src=typeof key==='string'&&Object.hasOwn(catalog,key)?catalog[key]?.photo?.src:null;
  if(typeof src!=='string'||!src.trim()){errors.push(String(key)+': referencia sin foto');continue;}
  if(/^[a-z][a-z0-9+.-]*:/i.test(src)){if(!src.startsWith('https://')||!isUrl(src))errors.push(key+': URL externa inválida');}
  else if(path.isAbsolute(src)||src.includes('\\')||src.split('/').includes('..')||src.startsWith('//')||!exists(src))errors.push(key+': archivo local inválido');
 }
 return errors;
}
test('Fotografías: archivos y referencias válidos del catálogo dinámico',()=>{const catalog=read('data/places.json');for(const {trip} of trips)assert.deepEqual(check(trip,catalog),[],trip.id);});
test('Fotografías: datos corruptos, rutas inseguras y archivos ausentes',()=>{
 const catalog={a:{photo:{src:'photos/a.jpg'}},b:{photo:{src:'https://example.org/b.jpg'}},c:{photo:{src:42}},d:{photo:{src:'../secret'}},e:{photo:{src:'http://example.org/e.jpg'}},f:{photo:{src:'javascript:alert(1)'}}};
 const exists=p=>p==='photos/a.jpg';assert.deepEqual(check({cover:'a',days:[null,{places:['b']}]},catalog,exists),[]);
 for(const cover of ['c','d','e','f','missing','toString'])assert.equal(check({cover},catalog,exists).length,1);
 assert.equal(check({cover:'a'},catalog,()=>false).length,1);
 assert.doesNotThrow(()=>check({days:[null,42,{places:42}],coverSlides:42},catalog,exists));
});
