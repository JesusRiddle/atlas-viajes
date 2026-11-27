'use strict';
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'../..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const plain=value=>JSON.parse(JSON.stringify(value));
function runtime(files,globals={}){
 const context=vm.createContext({window:{},...globals});
 for(const file of files)vm.runInContext(read(file),context,{filename:file});
 return context.window;
}
const money=(amount,currency='MXN')=>({amount,currency});
function transport(id='rail'){
 return {id,type:'train',selectedOption:'a',options:[
  {id:'a',selectedFare:'basic',journeys:[{segments:[{from:'Puerto',to:'Valle',departure:null,arrival:null}]}],fares:[{id:'basic',price:money(10,'EUR')},{id:'flex',price:money(15,'EUR')}]},
  {id:'b',selectedFare:'basic',journeys:[{segments:[{from:'Puerto',to:'Valle',departure:null,arrival:null}]}],fares:[{id:'basic',price:money(20,'EUR')}]}
 ]};
}
module.exports={root,read,plain,runtime,money,transport};
