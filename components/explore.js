window.AtlasExplore = function (ctx) {
  'use strict';
  const { main, esc } = ctx;
  let cache = null;
  let pending = null;
  const safePhoto = file => 'https://commons.wikimedia.org/wiki/Special:FilePath/' + encodeURIComponent(file) + '?width=900';
  const renderCard = item => `
    <article class="explore-card">
      <div class="explore-card-image">
        <img loading="lazy" decoding="async" src="${esc(safePhoto(item.image))}" alt="Vista representativa de ${esc(item.name)}">
      </div>
      <div class="explore-card-copy">
        <p class="explore-card-country">${esc(item.flag)} ${esc(item.name)}</p>
        <h3>${esc(item.experience)}</h3>
        <p class="explore-route"><strong>Posible ruta:</strong> ${esc(item.route)}</p>
        <p>${esc(item.note)}</p>
        <a class="explore-credit" href="${esc(item.photoPage)}" target="_blank" rel="noopener noreferrer">Foto: ${esc(item.credit)} ↗</a>
      </div>
    </article>`;
  const section = (items, title, summary, id) => `
    <section class="section explore-group" aria-labelledby="${id}">
      <div class="section-title"><div><p class="eyebrow orange">Ideas para más adelante</p><h2 id="${id}">${title}</h2></div><p>${summary}</p></div>
      <div class="explore-grid">${items.map(renderCard).join('')}</div>
    </section>`;
  function paint(data) {
    main.innerHTML = `<div class="wrap explore-page">
      <div class="explore-heading">
        <a href="#inicio" class="explore-back">← Volver a todos los viajes</a>
        <p class="eyebrow orange">Archivo de inspiración</p>
        <h1>Destinos por explorar.</h1>
        <p class="explore-lead">${esc(data.description)}</p>
        <p class="explore-count">${data.destinations.length} ideas guardadas · Sin fechas asignadas</p>
      </div>
      ${section(data.destinations.filter(x => x.region === 'europa'), 'Europa: rutas que podrían combinarse.', 'Alemania, Austria y Chequia pueden encajar en una ruta regional; Polonia requiere evaluar distancia y días disponibles.', 'explore-europe')}
      ${section(data.destinations.filter(x => x.region === 'otros'), 'Otros horizontes.', 'Experiencias para viajes propios, escalas o combinaciones que estudiaremos cuando llegue el momento.', 'explore-world')}
      <p class="explore-footnote">Las excursiones, accesos y temporadas se revisarán antes de construir itinerarios. Ninguna de estas ideas implica una reserva o compra.</p>
    </div>`;
  }
  async function explore() {
    if (cache) { paint(cache); return; }
    main.innerHTML = '<section class="section wrap explore-loading" role="status">Cargando destinos por explorar…</section>';
    try {
      pending ||= fetch('data/explore.json', { cache: 'no-cache' }).then(response => {
        if (!response.ok) throw new Error('No se pudo cargar el archivo de inspiración');
        return response.json();
      });
      const data = await pending;
      if (!data || !Array.isArray(data.destinations)) throw new Error('Formato de ideas inválido');
      cache = data;
      if (location.hash === '#explorar') paint(data);
    } catch (error) {
      pending = null;
      if (location.hash === '#explorar') main.innerHTML = '<section class="section wrap"><h1>No se pudieron cargar los destinos por explorar.</h1><p>Vuelve a intentarlo desde el menú.</p></section>';
      console.error(error);
    }
  }
  return { explore };
};
