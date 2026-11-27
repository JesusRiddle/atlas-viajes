'use strict';
const {diagnosticSuite}=require('./diagnostics.cjs');
const {problem}=require('./section.cjs');
function check(t){
 const errors=[];
 if(typeof t.intro==='string'&&/reservar primero|aún sin comprar|entrada nominativa|servicios no modificables/i.test(t.intro))errors.push({...problem('intro','Texto administrativo en introducción turística'),evidence:t.intro});
 const subtitle=t.heroEyebrow||t.tag;
 if(subtitle!=null&&(typeof subtitle!=='string'||/^(en planeaci[oó]n|por definir|\d+ d[ií]as|dos pa[ií]ses)/i.test(subtitle.trim())))errors.push({...problem('heroEyebrow','Subtítulo editorial genérico'),evidence:subtitle});
 if(Array.isArray(t.introHighlights))for(const h of t.introHighlights)
   if(typeof h!=='string'||!h.trim()||typeof t.intro!=='string'||!t.intro.includes(h))errors.push({...problem('introHighlights','Resaltado ausente en intro: '+h),evidence:[h,t.intro]});
 if(typeof t.climate==='string'&&t.climate.trim()){
   const parts=t.climate.trim().split(/\n\s*\n/);
   if(parts.length!==3||!parts[1]?.startsWith('*Qué llevar:*')||!parts[2]?.startsWith('*Horas de luz:*'))errors.push({...problem('climate','Tres párrafos con etiquetas en orden'),evidence:t.climate});
 }
 return errors;
}
diagnosticSuite('Panorama: narrativa y clima',check,{intro:'Visitar Puerto',introHighlights:['Puerto'],climate:'Clima templado.\n\n*Qué llevar:* Abrigo.\n\n*Horas de luz:* Amanecer temprano.'},[
 {intro:'Puerto',introHighlights:['Ciudad']},
 {intro:'reservar primero'},
 {heroEyebrow:'Por definir'},
 {climate:'Clima\n\n*Horas de luz:* Día\n\n*Qué llevar:* Abrigo'}
]);
