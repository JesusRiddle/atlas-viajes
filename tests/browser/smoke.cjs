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
async function navigateDay(page,tripId,day,viewport){
 const hash='#viaje/'+tripId+'/dia-'+day;
 const link=page.locator('.daynav a[href="'+hash+'"]');
 assert.equal(await link.count(),1,'Enlace diario único');
 if(viewport.width>1000){
  assert.ok(await link.isVisible(),'Menú diario visible en escritorio');
  await link.click();
 }else{
  assert.equal(await link.isVisible(),false,'Menú lateral oculto en móvil');
  // El móvil accede a las jornadas mediante desplazamiento; comprobar también enlaces profundos.
  await page.locator('#dia-'+day).scrollIntoViewIfNeeded();
  await page.goto(base+hash);
 }
 await page.waitForURL('**'+hash);
 assert.equal(await page.locator('#dia-'+day).count(),1,'Destino diario único');
}
async function home(page){
 await page.goto(base+'#inicio',{waitUntil:'domcontentloaded'});
 await page.locator('#atlas-home-title').waitFor();
}
async function catalog(page,viewport){
 await home(page);
       const heroBounds = await page.locator('.atlas-home-hero-immersive .atlas-home-hero-image').boundingBox();
      assert.ok(heroBounds, 'El hero de Inicio debe estar visible');
      await page.waitForFunction(() => {
        const img = document.querySelector('.atlas-home-hero-immersive .atlas-home-hero-image img');
        return img && img.complete && img.naturalWidth > 0;
      });

      if (viewport.width > 800) {
        assert.ok(heroBounds.height <= 305, 'El hero de escritorio debe ser compacto: ' + heroBounds.height);
        assert.ok(heroBounds.height >= 250, 'El hero debe conservar espacio suficiente para el texto');
      }
      // La versión 1 anima solo la fotografía y la luz, nunca el texto.
      const heroMotion = await page.locator('.atlas-home-hero-immersive .atlas-home-hero-image').evaluate(hero => ({
        imageAnimation: getComputedStyle(hero.querySelector('img')).animationName,
        lightAnimation: getComputedStyle(hero, '::after').animationName,
        copyAnimation: getComputedStyle(hero.querySelector('.atlas-home-hero-copy')).animationName,
        lightPointerEvents: getComputedStyle(hero, '::after').pointerEvents
      }));
      assert.match(heroMotion.imageAnimation, /atlas-home-hero-drift/,
        'La fotografía principal debe tener movimiento lento');
      assert.match(heroMotion.imageAnimation, /atlas-home-hero-breathe/,
        'La fotografía principal debe tener el pulso ambiental de brillo');
      assert.match(heroMotion.lightAnimation, /atlas-home-hero-light/,
        'El hero debe incluir el reflejo de luz discreto');
      assert.equal(heroMotion.copyAnimation, 'none', 'El texto debe permanecer inmóvil');
      assert.equal(heroMotion.lightPointerEvents, 'none', 'El reflejo no debe bloquear interacción');
      const heroProgress = await page.locator('.atlas-home-hero-immersive .atlas-home-hero-image').evaluate(hero => {
        const photo = hero.querySelector('img');
        const motion = photo.getAnimations().find(a => a.animationName === 'atlas-home-hero-drift');
        const lightStyle = getComputedStyle(hero, '::after');
        if (!motion || lightStyle.animationName !== 'atlas-home-hero-light') return {active:false};
        const initialTime = motion.currentTime;
        motion.pause();
        motion.currentTime = 0;
        const begin = getComputedStyle(photo).transform;
        motion.currentTime = 17000;
        const end = getComputedStyle(photo).transform;
        motion.currentTime = initialTime;
        motion.play();
        return {active:true, begin, end, driftDuration:motion.effect.getTiming().duration,
          lightDuration:parseFloat(lightStyle.animationDuration) * 1000};
      });
      assert.ok(heroProgress.active, 'Las dos animaciones deben ejecutarse realmente');
      assert.notEqual(heroProgress.begin, heroProgress.end,
        'El desplazamiento debe cambiar la imagen, no solo declarar un nombre CSS');
      assert.ok(heroProgress.driftDuration <= 18000 && heroProgress.lightDuration <= 13000,
        'Los ciclos deben ser suficientemente cortos para percibirse');
      const brightnessPulse = await page.locator('.atlas-home-hero-immersive .atlas-home-hero-image img').evaluate(photo => {
        const pulse = photo.getAnimations().find(a => a.animationName === 'atlas-home-hero-breathe');
        if (!pulse) return null;
        const original = pulse.currentTime;
        pulse.pause();
        pulse.currentTime = 0;
        const start = getComputedStyle(photo).filter;
        pulse.currentTime = 5000;
        const midpoint = getComputedStyle(photo).filter;
        pulse.currentTime = original;
        pulse.play();
        return {start, midpoint, duration: pulse.effect.getTiming().duration};
      });
      assert.ok(brightnessPulse && brightnessPulse.duration > 0,'Pulso ambiental activo');
      assert.notEqual(brightnessPulse.start, brightnessPulse.midpoint,
        'El pulso debe cambiar ligeramente el brillo real de la fotografía');
      const heroCopy = page.locator('.atlas-home-hero-immersive .atlas-home-hero-copy');
      await page.emulateMedia({ reducedMotion: 'reduce' });
      const staticHero = await page.locator('.atlas-home-hero-immersive .atlas-home-hero-image').evaluate(hero => ({
        imageAnimation: getComputedStyle(hero.querySelector('img')).animationName,
        lightDisplay: getComputedStyle(hero, '::after').display
      }));
      assert.equal(staticHero.imageAnimation, 'none', 'Reducir movimiento debe desactivar animación');
      assert.equal(staticHero.lightDisplay, 'none', 'Reducir movimiento debe desactivar reflejo');
      await page.emulateMedia({ reducedMotion: 'no-preference' });

      const copyBounds = await heroCopy.boundingBox();
      assert.ok(copyBounds && copyBounds.y >= heroBounds.y - 1 &&
        copyBounds.y + copyBounds.height <= heroBounds.y + heroBounds.height + 2,
        'El texto del hero debe quedar dentro de la fotografía');
       assert.equal(await workDayBadges.count(), primary.filter(({trip})=>Number.isInteger(trip.work)).length,
        'Cada viaje con días laborales declarados muestra su indicador');
      const workingDayTexts = await workDayBadges.allInnerTexts();
      assert.ok(workingDayTexts.every(value => /^\d+ días laborales$/.test(value)),
        'Portada: escribir siempre X días laborales');
      const tones = await page.locator('#viajes .atlas-home-card').evaluateAll(cards => cards.map(card => {
        const place = card.querySelector('.card-overview-location');
        const work = card.querySelector('.cardfacts span');
        return work ? { work: getComputedStyle(work).color, place: getComputedStyle(place).color,
          weight: getComputedStyle(work).fontWeight } : null;
      })).then(values => values.filter(Boolean));
      assert.ok(tones.every(value => value.work === value.place && Number(value.weight) >= 700),
        'Portada: días laborales usan el mismo color y énfasis que Colombia · 12 días');
 const ordered=[...primary].sort((a,b)=>(a.trip.start||'9999-12-31').localeCompare(b.trip.start||'9999-12-31'));
 const hrefs=await page.locator('#viajes .tripcard').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href')));
 assert.deepEqual(hrefs,ordered.map(x=>'#viaje/'+x.module.id));
 assert.equal(await page.locator('#ideas-viajes .idea-tripcard').count(),all.filter(x=>x.module.homeGroup==='ideas').length);
 const compared=await page.locator('#comparar tbody td:first-child a').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href')));
 const eligible=await page.evaluate(async()=>{
  const {trips}=await window.ATLAS_READY;
  const format=window.AtlasFormat({trips});
  return trips.filter(t=>t.homeGroup!=='ideas'&&(format.canRenderFullTrip(t)||(t.start&&t.end&&t.routeCities?.length&&Number.isFinite(window.AtlasBudget.planningEstimate(t)?.low))))
   .sort((a,b)=>(a.start||'9999-12-31').localeCompare(b.start||'9999-12-31')).map(t=>'#viaje/'+t.id);
 });
 assert.deepEqual(compared,eligible,'Todos y solo los viajes elegibles, en orden');
 const headers=await page.locator('#comparar thead th').allInnerTexts();assert.ok(headers.includes('Personas'));assert.ok(!headers.includes('Viajando solo'));
 const people=await page.locator('#comparar tbody tr').evaluateAll(rows=>rows.map(row=>row.cells[5].textContent.trim()));
 assert.deepEqual(people,compared.map(href=>{const t=primary.find(x=>'#viaje/'+x.module.id===href).trip;return Number.isInteger(t.travelerCount)&&t.travelerCount>0?String(t.travelerCount):'Por definir';}));
 assert.equal(await page.locator('#comparar thead th').count(),8);
 assert.ok(await page.locator('#comparar thead th').evaluateAll(nodes=>[nodes[3],nodes[4]].every(n=>getComputedStyle(n).whiteSpace==='nowrap')),'Cabeceras de alojamientos y ritmo sin saltos');
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
 const pendingDay=page.locator('.daynav a[href="#viaje/'+partial.id+'/dia-2"]');
 assert.match(await pendingDay.innerText(),/Fecha por definir/);
 await navigateDay(page,partial.id,2,viewport);
 await page.locator('#expand').click();
 await page.waitForFunction(()=>document.querySelectorAll('#dias details.day[open]').length===0);
 await page.locator('#expand').click();
 await page.waitForFunction(()=>document.querySelectorAll('#dias details.day[open]').length===1);
 await openTrip(page,full.id);
 await visibleContract(page,full,viewport);
 if(viewport.width>1000){
 const layout=await page.locator('#mapa .trip-map-header').evaluate(header=>{const i=header.querySelector('.trip-map-intro').getBoundingClientRect(),c=header.querySelector('.trip-map-cities').getBoundingClientRect();return {width:header.getBoundingClientRect().width,citiesWidth:c.width,introRight:i.right,citiesLeft:c.left,cards:[...header.querySelectorAll('.map-city-list li')].map(n=>n.getBoundingClientRect().width)};});
 assert.ok(layout.citiesWidth>=layout.width*.55);assert.ok(layout.citiesLeft>layout.introRight);assert.ok(layout.cards.every(w=>w>=90));
 }
 assert.match(await page.locator('#mapa').innerText(),/1 noche/);
 await page.locator('.subnav a[href="#viaje/'+full.id+'/temporadas"]').click();
 await page.waitForURL('**#viaje/'+full.id+'/temporadas');
 const expand=page.locator('#expand');
 await expand.click();
 await page.waitForFunction(()=>document.querySelectorAll('#dias details.day[open]').length===0);
 await expand.click();
 await page.waitForFunction(n=>document.querySelectorAll('#dias details.day[open]').length===n,full.days.length);
 await navigateDay(page,full.id,2,viewport);
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
 assert.match(globalBefore,/1,580/);
 assert.match(await daily.locator('.day-budget-heading').innerText(),/500/);
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
 assert.ok(await page.locator('.subnav .subnav-home').isVisible());
 await page.locator('.subnav .subnav-home').click();
 await page.locator('#atlas-home-title').waitFor();
 await page.goto(base+'#comparar');
 await page.locator('#comparar .comparison-table').waitFor();
 assert.equal(await page.locator('#comparar tbody tr').count(),1);
 assert.doesNotMatch(await page.locator('main').innerText(),invalid);
}
(async()=>{
 const browser=await chromium.launch({headless:true});
 const failures=[];
 try{
  for(const viewport of [{width:1440,height:900},{width:390,height:844}]){
   for(const [name,run] of [['catálogo',catalog],['fixture',fixture]]){
    const {ctx,page,errors}=await context(browser,viewport);
    try{await run(page,viewport);assert.deepEqual(errors,[],name+' '+viewport.width);console.log(name+' '+viewport.width+': aprobado');}
    catch(e){console.error(name+' '+viewport.width+' '+page.url(),e);failures.push(new Error(name+' '+viewport.width+': '+e.message,{cause:e}));}
    finally{await ctx.close();}
   }
  }
 }finally{await browser.close();}
 if(failures.length)throw new AggregateError(failures,'Escenarios de navegador fallidos: '+failures.length);
})().catch(e=>{console.error(e);process.exitCode=1;});
