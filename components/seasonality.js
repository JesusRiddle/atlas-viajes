// Calendario de temporadas: contenido independiente en el JSON de cada itinerario.
window.AtlasSeasonality = function (ctx) {
    'use strict';
    const { esc } = ctx;
    const names = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    const states = {
        pending: { label: 'Por definir', css: 'pending' },
        recommended: { label: 'Recomendable', css: 'recommended' },
        conditional: { label: 'Aceptable', css: 'conditional' },
        avoid: { label: 'Desaconsejable', css: 'avoid' }
    };
    const weatherIcons = {
        snow: '<path d="M12 2v20M4 7l16 10M20 7 4 17M9 5l3 3 3-3M9 19l3-3 3 3"/>',
        cloudy: '<path d="M20 16a4 4 0 0 0-4-4 5.5 5.5 0 0 0-10.7-1.5A4 4 0 0 0 7 18h12a3 3 0 0 0 1-2Z"/>',
        partlyCloudy: '<path d="M12 2v2m-6.4.6L7 6m11-1.4L16.6 6M3 11h2m14 0h2M8 11a4 4 0 0 1 8-1"/><path d="M18 19a4 4 0 0 0-1-7.9 5 5 0 0 0-9.5 1.4A3.5 3.5 0 0 0 8 19h10Z"/>',
        hot: '<path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0Z"/><path d="M12 10v7"/><circle cx="19" cy="6" r="2.2"/><path d="M19 1v1m0 8v1m-5-5h1m8 0h-1m-6.5-3.5.7.7m5.6 5.6.7.7m0-7-.7.7m-5.6 5.6-.7.7"/>',
        sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/>'
    };
    function weatherIcon(type) {
        if (!Object.prototype.hasOwnProperty.call(weatherIcons, type)) return '';
        return '<svg class="season-weather-icon" viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + weatherIcons[type] + '</svg>';
    }
    function seasonality(trip) {
        const data = trip.seasonality;
        if (!data?.months) return '';
        const blocks = names.map((name, i) => {
            const key = String(i + 1).padStart(2, '0');
            const item = data.months[key] || { status: 'pending', description: 'Por definir' };
            const state = states[item.status] || states.pending;
            const note = item.description || 'Por definir';
            const match = note.match(/\(?\s*[-−]?\d{1,2}(?:[.,]\d+)?\s*[–—-]\s*[-−]?\d{1,2}(?:[.,]\d+)?\s*°\s*C\s*\)?/i);
            const temperature = match ? match[0].replace(/[()]/g, '').trim() : '';
            const description = match ? (note.slice(0, match.index) + note.slice(match.index + match[0].length))
                .replace(/\s+,/g, ',').replace(/\s{2,}/g, ' ').trim() : note;
            return `<li class="season-month season-${state.css}" aria-label="${esc(name + ': ' + state.label + '. ' + note)}"><div class="season-month-heading"><span class="season-temperature">${temperature ? esc(temperature) : '—'}</span>${weatherIcon(item.icon)}</div><strong class="season-month-name">${esc(name)}</strong><span class="season-state">${esc(state.label)}</span><p class="season-month-description">${esc(description || note)}</p></li>`;
        }).join('');
        return `<section class="section wrap seasonality-section atlas-panel-section" id="temporadas" aria-labelledby="seasonality-heading">
            <div class="seasonality-panel">
            <div class="section-title"><div><p class="eyebrow orange seasonality-kicker atlas-editorial-kicker"><svg class="seasonality-heading-icon" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18m-9 4 2 2 4-4"/></svg><span>Cuándo viajar</span></p><h2 id="seasonality-heading" class="atlas-editorial-title">Temporadas recomendadas.</h2><p class="seasonality-intro">Compara los meses según el clima, la afluencia turística y la comodidad del recorrido.</p></div></div>
            <ul class="season-months" aria-label="Temporadas de enero a diciembre">${blocks}</ul>
            
            </div>
        </section>`;
    }
    return { seasonality };
};
