window.AtlasFormat = function (ctx) {
    'use strict';
    const { trips } = ctx;
    const fmt = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 0 });
    const money = n => '$' + (Number.isInteger(n) ? fmt.format(n) : new Intl.NumberFormat('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)); const date = s => new Date(s + 'T12:00:00Z');
    const short = s => date(s).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', timeZone: 'UTC' });
    const long = s => date(s).toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });
    const range = t => short(t.start) + (t.start.slice(0, 4) !== t.end.slice(0, 4) ? ' ' + t.start.slice(0, 4) : '') + ' – ' + short(t.end) + ' ' + t.end.slice(0, 4);
    const sums = t => t.budgetRange || [t.costs.reduce((a, x) => a + x[1], 0), t.costs.reduce((a, x) => a + x[2], 0)];
    const price = t => { let [a, b] = sums(t); return money(a) + '–' + money(b) };
    const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const emphasisTerms = ["Bolonia", "Bologna", "Módena", "Modena", "Parma", "Ravenna", "Ferrara", "Matera", "Lecce", "Ostuni", "Bari", "Alberobello", "Locorotondo", "Polignano a Mare", "Monopoli", "Trani", 'Segovia', 'Zamora', 'Figueres', 'Lauterbrunnen', 'Wengen', 'Mürren', 'Grindelwald', 'First Cliff Walk', 'Bachalpsee', 'Oeschinensee', 'Riffelsee', 'Kandersteg', 'Interlaken', 'Swiss Half Fare Card', 'Viena', 'Eibsee', 'Pontresina', 'Tirano', 'Milán', 'Bernina Express', 'Schönbrunn', 'Bratislava', 'Barcelona', 'Sevilla', 'Málaga', 'Granada', 'Córdoba', 'Ronda', 'Toledo', 'Madrid', 'Múnich', 'Munich', 'Salzburg', 'Salzburgo', 'Núremberg', 'Neuschwanstein', 'Zugspitze', 'Garmisch-Partenkirchen', 'Garmisch', 'Füssen', 'Lisboa', 'Lisbon', 'Porto', 'Sintra', 'Guimarães', 'Douro', 'Régua', 'Pinhão', 'Lucerna', 'Zermatt', 'St. Moritz', 'Zúrich', 'Glacier Express', 'Swiss Travel Pass', 'Atenas', 'Nafplio', 'Meteora', 'Kalambaka', 'Delfos', 'Palermo', 'Catania', 'Siracusa', 'Noto', 'Taormina', 'Agrigento', 'Etna', 'Washington Dulles', 'Washington', 'Dulles', 'Arlington', 'Alexandria', 'Georgetown', 'Estambul', 'Nevşehir', 'Kayseri', 'Göreme', 'Capadocia', 'Izmir', 'Éfeso', 'Cancún', 'Nueva Orleans', 'French Quarter', 'Garden District', 'Grand Canyon South Rim', 'Grand Canyon', 'South Rim', 'West Rim', 'Hoover Dam', 'Strip', 'Marrakech', 'Essaouira', 'Agafay', 'Merzouga', 'San Antonio', 'River Walk', 'Alamo', 'Aeroméxico', 'Emirates', 'Iberia', 'Lufthansa', 'Turkish', 'United', 'Volaris', 'Viva', 'sin escalas', 'una conexión', 'una escala', 'dos vuelos internos', 'una sola reserva', 'una sola base', 'una misma reserva', 'Muy fácil', 'Fácil', 'Medio', 'Inglés', 'inglés B2'];
    const termPattern = [...new Set(emphasisTerms)].sort((a, b) => b.length - a.length).map(x => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    const emphasisPattern = new RegExp('\\b(?:' + termPattern + '|MEX|BCN|MAD|MUC|LIS|OPO|ZRH|FRA|CDG|AMS|ATH|PMO|CTA|IAD|DCA|IST|CUN|ADB|NAV|ASR|SAW|MSY|IAH|DFW|ATL|LAS|RAK|ESU|SAT|NLU)\\b|[−–-]?\\d+(?:[½¼])?(?:[–−-]\\d+(?:[½¼])?)?(?: a \\d+)?(?: °C| minutos?| min| horas?| h| noches)(?![\\p{L}])', 'gu');
    function railLinks(text) { return esc(text).replace(/Frecciarossa|Trenitalia|Italo/g, name => `<a href="${name === 'Italo' ? 'https://www.italotreno.com/' : 'https://www.trenitalia.com/'}" target="_blank" rel="noopener">${name}</a>`); }
    function readable(text) {
        const activeTrip = trips.find(t => t.id === location.hash.split('/')[1]); const specialStyle = !!activeTrip?.emphasisStyle;

        return String(text).split(/(\*[^*]+\*)/g).map(part => {
            if (part.startsWith('*') && part.endsWith('*')) {
                const content = esc(part.slice(1, -1));
                const className = specialStyle ? ' class="atlas-city"' : '';
                return `<strong${className}>${content}</strong>`;
            }

            if (activeTrip?.linkRailInText) return railLinks(part);

            return esc(part).replace(emphasisPattern, match =>
                `<strong>${match.replace(/minutos?$/u, 'min').replace(/horas?$/u, 'h')}</strong>`
            );
        }).join('');
    }
    function factParagraphs(text) { return text.split(/\n\s*\n/).filter(Boolean).map(part => `<p>${readable(part)}</p>`).join(''); }
    function highlightWords(text, words) {
        const source = String(text);
        if (!Array.isArray(words) || !words.length) return esc(source);
        const pattern = words.slice().sort((a, b) => b.length - a.length)
            .map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
        return esc(source).replace(new RegExp(pattern, 'gu'), matched =>
            '<strong class="atlas-city">' + matched + '</strong>');
    }
    // Título del día: negritas antes del primer ":"; si no existe, usar ciudad o base.
    function formatDayTitle(d) {
        const title = String(d.title || '');
        const separator = title.indexOf(':');
        if (separator >= 0) {
            return '<strong>' + esc(title.slice(0, separator + 1)) + '</strong> ' + esc(title.slice(separator + 1).trim());
        }
        return '<strong>' + esc(d.city || d.base) + ': </strong>' + esc(title);
    }
    return { money, short, long, range, sums, price, esc, railLinks, readable, factParagraphs, highlightWords, formatDayTitle };
};
