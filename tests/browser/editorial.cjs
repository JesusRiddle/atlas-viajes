'use strict';
const assert=require('node:assert/strict');
const anchors=['plan','mapa','temporadas','experiencias','reservas','traslados','alojamientos','dias','costes'];
const invalid=/\b(?:undefined|NaN|Invalid Date)\b/;
async function visibleContract(page,t,viewport){
 const id=t.id;
 await page.locator('.subnav a[href="#viaje/'+id+'/plan"]').waitFor();
 const nav=await page.locator('.subnav .subnav-sections a').evaluateAll(links=>links.map(a=>a.getAttribute('href').split('/').at(-1)));
 const legacySources=t.homeGroup==='ideas'&&t.sources?.length&&nav.includes('fuentes');
 assert.deepEqual(nav,legacySources?[...anchors,'fuentes']:anchors,id+': navegación');
 if(legacySources)assert.equal(await page.locator('#fuentes').count(),1,id+': fuentes históricas');
 for(const section of anchors){
  const loc=page.locator('#'+section);
  assert.equal(await loc.count(),1,id+': '+section);
  assert.ok(await loc.isVisible(),id+': sección invisible '+section);
 }
 const order=await page.locator(anchors.map(x=>'#'+x).join(',')).evaluateAll(nodes=>nodes.map(n=>n.id));
 assert.deepEqual(order,anchors,id+': orden de secciones');
 assert.doesNotMatch(await page.locator('main').innerText(),invalid,id+': valor inválido');
 assert.equal(await page.locator('#alojamientos h2').innerText(),'Tus alojamientos.',id);
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth<=3),id+': desbordamiento '+viewport.width);
 const names=await page.locator('#mapa .map-city-name').evaluateAll(nodes=>nodes.map(n=>{
  const primary=n.querySelector('.map-city-primary'),secondary=n.querySelector('.map-city-qualifier');
  return {primary:primary?Number(getComputedStyle(primary).fontWeight):0,secondary:secondary?Number(getComputedStyle(secondary).fontWeight):0};
 }));
 assert.ok(names.every(n=>n.primary>=700&&n.secondary<=400),id+': jerarquía mapa');
 assert.ok(await page.locator('#alojamientos .hotel-card h4').evaluateAll(nodes=>nodes.every(n=>n.scrollWidth<=n.clientWidth+3)),id+': título hotel');
 if(t.seasonality?.months){
  assert.equal(await page.locator('#temporadas .season-month').count(),12,id+': meses');
  if(t.homeGroup!=='ideas'){
   const temps=await page.locator('#temporadas .season-temperature').allInnerTexts();
   for(let i=0;i<12;i++){
    const status=t.seasonality.months[String(i+1).padStart(2,'0')]?.status;
    if(!status||status==='pending')assert.equal(temps[i],'—',id+': mes pendiente');
    else assert.match(temps[i],/^(?:Máx\. |Máximas: |Intervalo: )/,id+': significado de temperatura');
   }
  }
 }
 if(t.practicalIndicators?.length===3){
  const indicators=page.locator('#plan .overview-intro .practical-indicator');
  assert.deepEqual(await indicators.evaluateAll(nodes=>nodes.map(n=>n.dataset.indicatorId)),['style','language','entry'],id);
  const titles=await indicators.locator('strong').allInnerTexts();
  for(const title of ['Estilo de viaje','Idioma y moneda','Documentación y consejos prácticos'])assert.ok(titles.includes(title),id+': '+title);
  assert.equal(await page.locator('#plan .overview-side .overview-climate-card').count(),1,id);
  assert.equal(await page.locator('#plan .overview-intro .overview-climate-card').count(),0,id);
  const region=await page.locator('#plan').evaluate(root=>{
   const rect=selector=>{const r=root.querySelector(selector).getBoundingClientRect();return {x:r.x,y:r.y,right:r.right,bottom:r.bottom};};
   return {left:rect('.overview-intro'),right:rect('.overview-side'),climate:rect('.overview-climate-card'),budget:rect('.budget-teaser')};
  });
  if(viewport.width>800)assert.ok(region.right.x>=region.left.right-8,id+': columnas');
  else assert.ok(region.right.y>=region.left.y,id+': clima móvil');
  assert.ok(region.climate.y>=region.budget.bottom-3,id+': orden clima y presupuesto');
 }
 if(t.reservations?.length){
  assert.equal(await page.locator('#reservas .reservation-group').count(),t.reservations.length,id);
  if(t.homeGroup!=='ideas')assert.equal(await page.locator('#reservas h3').innerText(),'Reservaciones importantes',id);
 }
 const ready=(t.days||[]).filter(d=>d?.date&&Number.isInteger(d.n)&&Array.isArray(d.places)&&d.am&&d.pm&&d.night);
 assert.equal(await page.locator('#dias details.day').count(),ready.length,id+': días detallados');
 const pictures=page.locator('#dias .gallery img');
 assert.equal(await pictures.count(),await page.locator('#dias .gallery figure').count(),id+': figuras');
 assert.ok(await pictures.evaluateAll(nodes=>nodes.every(n=>n.alt.trim())),id+': texto alternativo');
 if(t.expenses?.length)assert.ok(await page.locator('#costes .budget-ledger').count()>0,id+': presupuesto');
}
module.exports={anchors,invalid,visibleContract};
