(()=>{'use strict';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const top=document.createElement('button');top.type='button';top.className='back-top';top.innerHTML='<span aria-hidden="true">↑</span> Volver arriba';top.setAttribute('aria-label','Volver al inicio de esta página');document.body.append(top);top.addEventListener('click',()=>{window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});const heading=document.querySelector('main h1');if(heading){heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true});}});
let leafletPromise=null,activeMap=null,mapObserver=null;
function leaflet(){if(leafletPromise)return leafletPromise;leafletPromise=Promise.all([new Promise((resolve,reject)=>{const css=document.createElement('link');css.rel='stylesheet';css.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';css.integrity='sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';css.crossOrigin='anonymous';css.onload=resolve;css.onerror=reject;document.head.append(css);}),new Promise((resolve,reject)=>{if(window.L){resolve();return;}const script=document.createElement('script');script.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';script.integrity='sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';script.crossOrigin='anonymous';script.onload=resolve;script.onerror=reject;document.head.append(script);})]).then(()=>window.L);return leafletPromise;}
function mapSection(t){
const points=(window.ATLAS_MAP_POINTS?.[t.id] || t.mapPoints || []).filter(p => p && typeof p.name === 'string');
const positioned=points.filter(p => Array.isArray(p.coords) && p.coords.length === 2 && p.coords.every(Number.isFinite));
const nightsByBase = new Map((t.bases || []).map(([name, nights]) => [String(name).toLocaleLowerCase('es'), Number(nights)]));
const stayLabel = point => {
  const nights = nightsByBase.get(String(point.name).toLocaleLowerCase('es'));
  return Number.isFinite(nights) && nights > 0 ? nights + (nights === 1 ? ' noche' : ' noches') : point.base ? 'Base' : 'Excursión';
};
const icon='<svg class="trip-map-heading-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3z"/><path d="M9 3v15m6-12v15"/></svg>';
return `<section class="trip-map-section" id="mapa" aria-labelledby="map-title">
<div class="trip-map-header">
<div class="trip-map-top">
<div class="trip-map-intro">
<div class="trip-map-heading">${icon}<span>EXPLORA TU DESTINO</span></div>
<h3 class="trip-map-title" id="map-title">Tu viaje en el mapa.</h3>
<p class="trip-map-description">Explora las ciudades del recorrido en el mapa interactivo.</p>
</div>

</div>
${positioned.length ? `<div class="trip-map-cities">
<ul class="map-city-list">${positioned.map(p=>`<li><button type="button" class="map-city-select" data-map-order="${p.order}" aria-label="Mostrar ${esc(p.name)} en el mapa"><span class="map-city-name">${p.order}. ${esc(p.name)}</span><small class="map-city-stay">${Number(nightsByBase.get(String(p.name).toLocaleLowerCase("es"))) > 0 ? '<svg class="map-city-bed" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 18V7m18 11V7M3 15h18M5 15v-4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4M5 12h14"/></svg>' : ""}${esc(stayLabel(p))}${p.optional ? " · opcional" : ""}</small></button></li>`).join('')}</ul></div>` : ''}
</div>
${positioned.length ? `<div id="trip-map" class="trip-map" aria-label="Mapa de ${esc(t.name)}"></div>` : `<div class="trip-map trip-map-pending"><p class="draft-pending">Por definir</p></div>`}
<div class="trip-map-footer"><p class="map-status" role="status">${positioned.length ? "El mapa se carga al llegar a esta sección." : "Coordenadas por definir."}</p>
<div class="map-legend"><span>Base para dormir</span><span>Excursión sin alojamiento</span>${points.some(p=>p.optional)?'<span>Visita opcional</span>':''}</div></div>

</section>`;
}
function clearMap(){mapObserver?.disconnect();mapObserver=null;if(activeMap){activeMap.remove();activeMap=null;}}
function initMap(t){clearMap();const el=document.getElementById('trip-map');if(!el)return;const status=el.parentElement.querySelector('.map-status');const points=(window.ATLAS_MAP_POINTS?.[t.id] || t.mapPoints || []).filter(p => p && Array.isArray(p.coords) && p.coords.length === 2 && p.coords.every(Number.isFinite));if(!points.length){status.textContent='Ubicaciones por definir.';return;}let started=false;const markers=new Map();let loadPromise=null;
async function start(){if(loadPromise)return loadPromise;if(!el.isConnected)return;started=true;loadPromise=(async()=>{mapObserver?.disconnect();status.textContent='Cargando mapa…';try{const L=await leaflet();if(!el.isConnected)return;const map=L.map(el,{scrollWheelZoom:true});activeMap=map;const tiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',referrerPolicy:'strict-origin-when-cross-origin'}).addTo(map);let errors=0;tiles.on('tileerror',()=>{if(++errors>=3)status.textContent='No se pudo cargar parte del mapa; puedes abrir las localidades con los enlaces de abajo.';});tiles.on('load',()=>{if(!errors)status.textContent='';});
for(const p of points){const icon=L.divIcon({className:'atlas-marker',html:`<span class="atlas-pin ${p.base?'base':p.optional?'optional':''}" aria-hidden="true"><span class="pin-number">${p.order}</span></span>`,iconSize:[28,34],iconAnchor:[12,29],popupAnchor:[0,-26]});markers.set(String(p.order),L.marker(p.coords,{icon,title:p.order+'. '+p.name,alt:p.order+'. '+p.name+' · '+p.kind,keyboard:true}).addTo(map).bindPopup(`<strong>${p.order}. ${esc(p.name)}</strong><br>${esc(p.kind)}`));}
if(points.length===1)map.setView(points[0].coords,11);else map.fitBounds(L.latLngBounds(points.map(p=>p.coords)),{padding:[35,35],maxZoom:11});status.textContent='';
}catch(error){if(el.isConnected)status.textContent='No se pudo cargar el mapa. Intenta nuevamente.';loadPromise=null;}})();return loadPromise;}
el.parentElement.querySelectorAll('.map-city-select').forEach(button=>button.addEventListener('click',async()=>{await start();const marker=markers.get(button.dataset.mapOrder);if(!marker||!activeMap||!el.isConnected)return;activeMap.setView(marker.getLatLng(),Math.max(activeMap.getZoom(),10),{animate:true});marker.openPopup();}));
if('IntersectionObserver' in window){mapObserver=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting))start();},{threshold:0.05});mapObserver.observe(el);}else start();}
window.addEventListener('hashchange',()=>queueMicrotask(()=>{if(activeMap&&!activeMap.getContainer().isConnected)clearMap();}));
window.AtlasTravel={mapSection,initMap};
})();
