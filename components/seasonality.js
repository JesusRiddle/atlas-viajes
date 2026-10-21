// Calendario de temporadas: contenido independiente en el JSON de cada itinerario.
window.AtlasSeasonality = function (ctx) {
    'use strict';
    const { esc } = ctx;
    const names = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    const states = {
        pending: { label: 'Por definir', css: 'pending' },
        recommended: { label: 'Recomendado', css: 'recommended' },
        conditional: { label: 'Condicional', css: 'conditional' },
        avoid: { label: 'Poco recomendable', css: 'avoid' }
    };
    function seasonality(trip) {
        const data = trip.seasonality;
        if (!data?.months) return '';
        const blocks = names.map((name, i) => {
            const key = String(i + 1).padStart(2, '0');
            const item = data.months[key] || { status: 'pending', description: 'Por definir' };
            const state = states[item.status] || states.pending;
            const note = item.description || 'Por definir';
            return `<li class="season-month season-${state.css}" aria-label="${esc(name + ': ' + state.label + '. ' + note)}"><strong>${esc(name.slice(0,3))}</strong><span class="season-state">${esc(state.label)}</span><small>${esc(note)}</small></li>`;
        }).join('');
        return `<section class="section wrap seasonality-section atlas-panel-section" id="temporadas" aria-labelledby="seasonality-heading">
            <div class="seasonality-panel">
            <div class="section-title"><div><p class="eyebrow orange seasonality-kicker atlas-editorial-kicker"><svg class="seasonality-heading-icon" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18m-9 4 2 2 4-4"/></svg><span>Cuándo viajar</span></p><h2 id="seasonality-heading" class="atlas-editorial-title">Temporadas recomendadas.</h2><p class="seasonality-intro">Evaluación del itinerario completo, considerando las actividades y ciudades que incluye.</p></div></div>
            <ul class="season-months" aria-label="Temporadas de enero a diciembre">${blocks}</ul>
            <div class="season-legend" aria-label="Leyenda de estados">${Object.values(states).map(state => `<span><i class="season-swatch season-${state.css}" aria-hidden="true"></i>${esc(state.label)}</span>`).join('')}</div>
            <p class="season-summary"><strong>Resumen:</strong> ${esc(data.summary || 'Por definir')}</p>
            </div>
        </section>`;
    }
    return { seasonality };
};
