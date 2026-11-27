'use strict';
// Temporary compatibility adapter for legacy test callers; contracts live in V2.
const c=require('../tests/editorial/contracts.cjs');
function validate(trip,{complete=false,mode}={}){
 if(mode!=null&&!['incremental','complete'].includes(mode))return [{path:'mode',message:'Modo editorial desconocido'}];
 if(!trip||typeof trip!=='object'||Array.isArray(trip))return [{path:'trip',message:'Se espera un objeto de viaje'}];
 complete=mode==='complete'||(mode==null&&complete===true);
 return ['experiences','transport','lodging','map','calendar','budget','reservations'].flatMap(key=>c[key](trip,complete));
}
module.exports={validate,photos:c.photos,dateOK:c.dateOK,isUrl:c.isUrl};
