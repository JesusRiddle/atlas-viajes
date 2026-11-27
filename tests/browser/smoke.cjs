'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const {all,primary}=require('../editorial/catalog.cjs');
const {full,draft,partial,installFixtures}=require('./fixtures.cjs');
const {invalid,visibleContract}=require('./editorial.cjs');
const base=process.env.ATLAS_TEST_URL||'http://127.0.0.1:8765/';
const origin=new URL(base).origin;
const photo='<svg xmlns="http://www.w3.org/2000/svg" width="64" height="48"><rect width="64" height="48" fill="teal"/></svg>';
async function context(browser,viewport){
 const ctx=await browser.newContext({viewport,deviceScaleFactor:1});
 // All external network is controlled; maps can degrade gracefully without external tiles.
 await ctx.route('**/*',route=>{
  const req=route.request(),url=new URL(req.url());
  if(url.origin===origin)return route.continue();
  if(req.resourceType()==='image')return route.fulfill({contentType:'image/svg+xml',body:photo});
  return route.abort();
 });
 const page=await ctx.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 return {ctx,page,errors};
}
async function openTrip(page,id){
 await page.goto(base+'#viaje/'+id,{waitUntil:'domcontentloaded'});
 await page.locator('.subnav a[href="#viaje/'+id+'/plan"]').waitFor();
}
async function home(page){
 await page.goto(base+'#inicio',{waitUntil:'domcontentloaded'});
 await page.locator('#atlas-home-title').waitFor();
}
async function catalog(page,viewport){
 await home(page);
 const ordered=[...primary].sort((a,b)=>(a.trip.start||'9999-12-31').localeCompare(b.trip.start||'9999-12-31'));
 const hrefs=await page.locator('#viajes .tripcard').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href')));
 assert.deepEqual(hrefs,ordered.map(x=>'#viaje/'+x.module.id));
 assert.equal(await page.locator('#ideas-viajes .idea-tripcard').count(),all.filter(x=>x.module.homeGroup==='ideas').length);
 const compared=await page.locator('#comparar tbody td:first-child a').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href')));
 assert.equal(new Set(compared).size,compared.length);
 assert.ok(compared.every(h=>hrefs.includes(h)));
 assert.equal(await page.locator('#comparar thead th').count(),8);
 await page.emulateMedia({reducedMotion:'reduce'});
 assert.equal(await page.locator('.atlas-home-hero-image img').evaluate(n=>getComputedStyle(n).animationName),'none');
 await page.emulateMedia({reducedMotion:'no-preference'});
 const hero=page.locator('.atlas-home-hero-image img');
 await hero.evaluate(img=>img.decode());
 assert.ok(await hero.evaluate(img=>img.naturalWidth>0));
 for(const {module,trip} of all){
  await openTrip(page,module.id);
  await visibleContract(page,{...trip,homeGroup:module.homeGroup},viewport);
 }
}
async function fixture(page,viewport){
 await installFixtures(page);
 await home(page);
 const links=await page.locator('#viajes .tripcard').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href')));
 assert.deepEqual(links,['#viaje/'+full.id,'#viaje/'+draft.id,'#viaje/'+partial.id]);
 assert.equal(await page.locator('#ideas-viajes .idea-tripcard').count(),1);
 assert.deepEqual(await page.locator('#comparar tbody td:first-child a').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href'))),['#viaje/'+full.id]);
 const card=page.locator('#viajes a[href="#viaje/'+draft.id+'"]');
 assert.doesNotMatch(await card.innerText(),/borrador|en planeación|preliminar|\$0\b|NaN|undefined/i);
 await card.click();
 await visibleContract(page,draft,viewport);
 assert.match(await page.locator('main').innerText(),/Por definir/i);
 assert.doesNotMatch(await page.locator('main').innerText(),/borrador|en planeación|en preparación|\$0\b|NaN|undefined/i);
 await openTrip(page,partial.id);
 await visibleContract(page,partial,viewport);
 assert.equal(await page.locator('#dias details.day').count(),1);
 assert.equal(await page.locator('#dias .day').count(),2);
 await openTrip(page,full.id);
 await visibleContract(page,full,viewport);
 await page.locator('.subnav a[href="#viaje/'+full.id+'/temporadas"]').click();
 await page.waitForURL('**#viaje/'+full.id+'/temporadas');
 const expand=page.locator('#expand');
 await expand.click();
 await page.waitForFunction(()=>document.querySelectorAll('#dias details.day[open]').length===0);
 await expand.click();
 await page.waitForFunction(n=>document.querySelectorAll('#dias details.day[open]').length===n,full.days.length);
 await page.locator('.daynav a[href="#viaje/'+full.id+'/dia-2"]').click();
 await page.waitForURL('**#viaje/'+full.id+'/dia-2');
 const image=page.locator('#dia-2 .photo-open').first();
 await image.click();
 await page.locator('dialog.photo-modal[open]').waitFor();
 await page.getByRole('button',{name:'Fotografía siguiente'}).click();
 assert.match(await page.locator('#photo-modal-title').innerText(),/Parque de Puerto/);
 await page.keyboard.press('Escape');
 await page.locator('dialog.photo-modal[open]').waitFor({state:'hidden'});
 const rail=page.locator('[data-transport="rail"]');
 await rail.locator('summary').click();
 const global=page.locator('#costes .budget-ledger .totalrow').first();
 const daily=page.locator('[data-day-budget="2"]');
 const dailyTransport=page.locator('[data-day-transport="2"]');
 assert.match(await dailyTransport.innerText(),/A12/);
 const globalBefore=await global.innerText(),dailyBefore=await daily.innerText();
 await rail.locator('select[data-field="option"]').selectOption('b');
 await page.waitForFunction(()=>document.querySelector('[data-transport="rail"] select[data-field="option"]')?.value==='b'&&document.querySelector('[data-day-transport="2"]')?.textContent.includes('B12'));
 assert.notEqual(await global.innerText(),globalBefore);
 assert.notEqual(await daily.innerText(),dailyBefore);
 assert.match(await rail.locator('.mt-price').innerText(),/400/);
 assert.match(await daily.locator('.day-budget-heading').innerText(),/700/);
 assert.match(await global.innerText(),/1,780/);
 assert.doesNotMatch(await dailyTransport.innerText(),/A12/);
 assert.equal(await rail.evaluate(n=>n.open),true);
 const air=page.locator('[data-transport="air"]');
 await air.locator('summary').click();
 assert.match(await air.innerText(),/X101/);
 assert.match(await air.innerText(),/X102/);
 assert.equal(await air.locator('.flight-day-offset').first().innerText(),'+1');
 assert.equal(await page.locator('#dia-1 [aria-label="AAA → BBB"]').count(),1);
 assert.equal(await page.locator('#dia-1 [aria-label="BBB → AAA"]').count(),0);
 assert.equal(await page.locator('#dia-3 [aria-label="BBB → AAA"]').count(),1);
 const toggle=page.locator('#costes [data-budget-toggle]').first();
 await toggle.click();assert.equal(await toggle.getAttribute('aria-expanded'),'false');
 await toggle.click();assert.equal(await toggle.getAttribute('aria-expanded'),'true');
 await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
 await page.waitForFunction(()=>!document.querySelector('.subnav')?.classList.contains('is-stuck'));
 await page.evaluate(()=>{const n=document.querySelector('.subnav-sticky-sentinel');window.scrollTo({top:n.getBoundingClientRect().top+scrollY+120,behavior:'instant'});});
 await page.waitForFunction(()=>document.querySelector('.subnav')?.classList.contains('is-stuck'));
 await page.locator('.subnav .subnav-home').click();
 await page.locator('#atlas-home-title').waitFor();
 await page.goto(base+'#comparar');
 await page.locator('#comparar .comparison-table').waitFor();
 assert.equal(await page.locator('#comparar tbody tr').count(),1);
 assert.doesNotMatch(await page.locator('main').innerText(),invalid);
}
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  for(const viewport of [{width:1440,height:900},{width:390,height:844}]){
   for(const [name,run] of [['catálogo',catalog],['fixture',fixture]]){
    const {ctx,page,errors}=await context(browser,viewport);
    try{await run(page,viewport);assert.deepEqual(errors,[],name+' '+viewport.width);console.log(name+' '+viewport.width+': aprobado');}
    catch(e){console.error(name+' '+viewport.width+' '+page.url());throw e;}
    finally{await ctx.close();}
   }
  }
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
