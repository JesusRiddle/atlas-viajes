window.ATLAS_READY.then(() => {
    'use strict';
    const { trips, places } = window.ATLAS;
    const photos = window.PHOTOS;
    const main = document.querySelector('main');
    const covers = Object.fromEntries(trips.map(t => [t.id, t.cover]));
    const stays = Object.fromEntries(trips.map(t => [t.id, Array.isArray(t.stays) ? t.stays : []]));
    function loadGallery(scope) {
        scope.querySelectorAll('img[data-src]').forEach(image => {
            image.src = image.dataset.src;
            image.removeAttribute('data-src');
        });
    }
    main.addEventListener('toggle', event => {
        if (!event.target.matches?.('details.day')) return;
        if (event.target.open) loadGallery(event.target);
        const button = document.querySelector('#expand');
        if (button) button.textContent = [...document.querySelectorAll('.day')].every(day => day.open)
            ? 'Contraer todos los días' : 'Desplegar todos los días';
    }, true);
    async function printGuide() {
        document.querySelectorAll('.day').forEach(day => { day.open = true; loadGallery(day); });
        const images = [...main.querySelectorAll('img')];
        images.forEach(image => image.loading = 'eager');
        await Promise.allSettled(images.map(image => image.decode()));
        window.print();
    }
    window.addEventListener('beforeprint', () => {
        document.querySelectorAll('.day').forEach(day => { day.open = true; loadGallery(day); });
        main.querySelectorAll('img').forEach(image => image.loading = 'eager');
    });
    const ctx = { trips, places, photos, main, covers, stays, loadGallery, printGuide };
    Object.assign(ctx, window.AtlasFormat(ctx));
    Object.assign(ctx, window.AtlasSections(ctx));
    Object.assign(ctx, window.AtlasDay(ctx));
    Object.assign(ctx, window.AtlasHome(ctx));
    Object.assign(ctx, window.AtlasSeasonality(ctx));
    Object.assign(ctx, window.AtlasTrip(ctx));
    let currentTrip = null;
    function route() { const hash = decodeURIComponent(location.hash.slice(1)), parts = hash.split('/'); if (parts[0] === 'viaje' && parts[1]) { if (currentTrip !== parts[1] || !document.querySelector('.triphero')) ctx.tripPage(parts[1]); currentTrip = parts[1]; if (parts[2]) { let el = document.getElementById(parts[2]); if (el) { if (el.tagName === 'DETAILS') { el.open = true; loadGallery(el); } requestAnimationFrame(() => el.scrollIntoView({ block: 'start' })) } } else scrollTo({ top: 0, behavior: 'instant' }); } else { ctx.cleanup(); main.classList.remove('trip-espana-portugal', 'trip-emilia'); currentTrip = null; if (hash === 'comparar') { main.innerHTML = ctx.comparison(); document.title = 'Comparar viajes · Atlas' } else ctx.home(); if (hash === 'viajes') { requestAnimationFrame(() => document.getElementById('viajes')?.scrollIntoView({ block: 'start' })); } else scrollTo({ top: 0, behavior: 'instant' }); } }
    window.addEventListener('hashchange', route); route();
}).catch(error => {
    console.error('Error al cargar los viajes:', error);
    document.querySelector('main').innerHTML = '<section class="section wrap"><h1>No se pudieron cargar los viajes.</h1><p>Revisa los archivos JSON y modules.js.</p></section>';
});
