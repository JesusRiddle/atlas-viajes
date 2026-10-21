// Calendario de temporadas: contenido independiente en el JSON de cada itinerario.
window.AtlasSeasonality = function (ctx) {
    'use strict';
    const { esc } = ctx;
    const names = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    const states = {
        pending: { label: 'Por definir', css: 'pending' },
        recommended: { label: 'Recomendado', css: 'recommended' },
        conditional: { label: 'Aceptable', css: 'conditional' },
        avoid: { label: 'Poco recomendable', css: 'avoid' }
    };
    const weatherIcons = {
        snow: '<path d="M12 2v20M4 7l16 10M20 7 4 17M9 5l3 3 3-3M9 19l3-3 3 3"/>',
        cloudy: '<path d="M20 16a4 4 0 0 0-4-4 5.5 5.5 0 0 0-10.7-1.5A4 4 0 0 0 7 18h12a3 3 0 0 0 1-2Z"/>',
        partlyCloudy: '<path d="M12 2v2m-6.4.6L7 6m11-1.4L16.6 6M3 11h2m14 0h2M8 11a4 4 0 0 1 8-1"/><path d="M18 19a4 4 0 0 0-1-7.9 5 5 0 0 0-9.5 1.4A3.5 3.5 0 0 0 8 19h10Z"/>',
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
            return `<li class="season-month season-${state.css}" aria-label="${esc(name + ': ' + state.label + '. ' + note)}"><div class="season-month-heading"><strong>${esc(name.slice(0,3))}</strong>${weatherIcon(item.icon)}</div><span class="season-state">${esc(state.label)}</span><small>${esc(note)}</small></li>`;
        }).join('');
        return `<section class="section wrap seasonality-section atlas-panel-section" id="temporadas" aria-labelledby="seasonality-heading">
            <div class="seasonality-panel">
            <div class="section-title"><div><p class="eyebrow orange seasonality-kicker atlas-editorial-kicker"><svg class="seasonality-heading-icon" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18m-9 4 2 2 4-4"/></svg><span>Cuándo viajar</span></p><h2 id="seasonality-heading" class="atlas-editorial-title">Temporadas recomendadas.</h2><p class="seasonality-intro">Descubre qué meses ofrecen mejores condiciones para disfrutar este recorrido y cuáles requieren considerar el clima, las aglomeraciones y otros inconvenientes.</p></div></div>
            <ul class="season-months" aria-label="Temporadas de enero a diciembre">${blocks}</ul>
            <div class="season-legend" aria-label="Leyenda de estados">${Object.values(states).map(state => `<span><i class="season-swatch season-${state.css}" aria-hidden="true"></i>${esc(state.label)}</span>`).join('')}</div>
            <p class="season-summary"><strong>Resumen:</strong> ${esc(data.summary || 'Por definir')}</p>
            </div>
        </section>`;
    }
    return { seasonality };
};
