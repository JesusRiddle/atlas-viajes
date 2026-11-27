'use strict';
const {suite,relationErrors,photos,read}=require('./section.cjs');
const catalog=read('data/places.json');
const check=(t,c)=>[...relationErrors(t,['start','end','days'],c),...photos(t,catalog,{complete:c})];
suite('Día por día',check,{start:'2027-05-01',end:'2027-05-01',days:[{n:1,date:'2027-05-01',places:[]}]},[
 {days:[{date:'2027-02-30'}]},
 {days:[{n:2,date:'2027-05-01'}]},
 {days:[{date:'2027-05-01',transportRefs:['missing']}]},
 {days:[{date:'2027-05-01',places:['__missing_fixture__']}]}
],{complete:true});
