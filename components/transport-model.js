// Modelo de alternativas y tarifas. No modifica los JSON ni calcula el presupuesto global.
window.AtlasTransportModel = (() => {
    'use strict';

    function selectedOption(transport) {
        return transport?.options?.find(option => option.id === transport.selectedOption) || null;
    }

    function selectedFare(option) {
        return option?.fares?.find(fare => fare.id === option.selectedFare) || null;
    }

    function quotedPrice(transport) {
        const option = selectedOption(transport);
        const fare = selectedFare(option);
        const price = fare?.price;
        return price && Number.isFinite(price.amount) && price.amount >= 0 && /^[A-Z]{3}$/.test(price.currency)
            ? { amount: price.amount, currency: price.currency }
            : null;
    }

    // Las fechas deben contener el desfase UTC explícito: 2026-11-26T00:05:00-06:00.
    function instant(value) {
        if (typeof value !== 'string' ||
            !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2})?(?:Z|[+-]\d{2}:\d{2})$/.test(value)) return null;
        const time = Date.parse(value);
        return Number.isFinite(time) ? time : null;
    }

    function durationMinutes(departure, arrival) {
        const from = instant(departure);
        const to = instant(arrival);
        return from === null || to === null || to < from ? null : Math.round((to - from) / 60000);
    }

    function journeySummary(journey) {
        const segments = journey?.segments || [];
        const first = segments[0], last = segments[segments.length - 1];
        const flightsOrLegs = segments.map(s => durationMinutes(s.departure, s.arrival));
        const layovers = segments.slice(1).map((segment, i) =>
            durationMinutes(segments[i].arrival, segment.departure));
        const totalMinutes = first && last ? durationMinutes(first.departure, last.arrival) : null;
        return {
            from: first?.from || null,
            to: last?.to || null,
            stops: Math.max(0, segments.length - 1),
            durationMinutes: totalMinutes,
            segmentMinutes: flightsOrLegs,
            layoverMinutes: layovers,
            connectionPoints: segments.slice(0, -1).map(segment => segment.to)
        };
    }

    function validateJourney(journey) {
        const errors = [];
        if (!journey || !Array.isArray(journey.segments) || !journey.segments.length) return ['Trayecto sin segmentos'];
        journey.segments.forEach((segment, i) => {
            if (!segment.from || !segment.to) errors.push('Segmento ' + (i + 1) + ': origen o destino ausente');
            if (segment.departure != null && instant(segment.departure) === null) errors.push('Segmento ' + (i + 1) + ': salida inválida o sin zona horaria');
            if (segment.arrival != null && instant(segment.arrival) === null) errors.push('Segmento ' + (i + 1) + ': llegada inválida o sin zona horaria');
            if (segment.departure && segment.arrival && durationMinutes(segment.departure, segment.arrival) === null) errors.push('Segmento ' + (i + 1) + ': duración inválida');
            if (i) {
                const prior = journey.segments[i - 1];
                if (prior.to !== segment.from) errors.push('Segmentos ' + i + '/' + (i + 1) + ': conexión no coincide');
                if (prior.arrival && segment.departure && durationMinutes(prior.arrival, segment.departure) === null) errors.push('Segmentos ' + i + '/' + (i + 1) + ': escala negativa');
            }
        });
        return errors;
    }

    function validateBaggage(baggage) {
        if (baggage == null) return [];
        const errors = [];
        for (const kind of ['personalItem', 'cabin', 'checked']) {
            const item = baggage[kind];
            if (item == null) continue; // No se conoce todavía la franquicia.
            if (typeof item !== 'object' || Array.isArray(item)) { errors.push(kind + ': equipaje inválido'); continue; }
            for (const key of ['pieces', 'weightKg']) {
                if (item[key] != null && (!Number.isFinite(item[key]) || item[key] < 0)) errors.push(kind + ': ' + key + ' inválido');
            }
            if (item.dimensionsCm != null && (!Array.isArray(item.dimensionsCm) || item.dimensionsCm.length !== 3 ||
                item.dimensionsCm.some(v => !Number.isFinite(v) || v <= 0))) errors.push(kind + ': dimensiones inválidas');
        }
        return errors;
    }

    function validateTransport(transport) {
        const errors = [];
        if (!transport || typeof transport !== 'object') return ['Transporte inválido'];
        if (!transport.id || !transport.type) errors.push('Faltan id o type');
        if (!Array.isArray(transport.options) || !transport.options.length) return [...errors, 'Sin opciones'];
        const ids = new Set();
        for (const option of transport.options) {
            if (!option.id || ids.has(option.id)) errors.push('ID de opción ausente o duplicado');
            ids.add(option.id);
            if (!Array.isArray(option.fares) || !option.fares.length) {
                errors.push('Opción sin tarifas: ' + option.id);
                continue;
            }
            const fareIds = new Set();
            for (const fare of option.fares) {
                if (!fare.id || fareIds.has(fare.id)) errors.push('Tarifa ausente o duplicada: ' + option.id);
                fareIds.add(fare.id);
                const p = fare.price;
                if (p && (p.amount !== null && (!Number.isFinite(p.amount) || p.amount < 0) ||
                    typeof p.currency !== 'string' || !/^[A-Z]{3}$/.test(p.currency))) {
                    errors.push('Importe o moneda inválidos: ' + option.id + '/' + fare.id);
                }
                for (const error of validateBaggage(fare.baggage)) errors.push(option.id + '/' + fare.id + ': ' + error);
            }
            if (Array.isArray(option.journeys)) {
                option.journeys.forEach((journey, i) => {
                    for (const error of validateJourney(journey)) errors.push(option.id + '/trayecto ' + (i + 1) + ': ' + error);
                });
            } else errors.push('Opción sin trayectos: ' + option.id);
            if (!fareIds.has(option.selectedFare)) errors.push('Tarifa seleccionada inexistente: ' + option.id);
        }
        if (!ids.has(transport.selectedOption)) errors.push('Opción seleccionada inexistente');
        return errors;
    }

    function validateTrip(trip) {
        const issues = [];
        const ids = new Set();
        for (const item of trip?.majorTransport || []) {
            if (ids.has(item.id)) issues.push(item.id + ': ID de transporte duplicado');
            ids.add(item.id);
            for (const error of validateTransport(item)) issues.push(item.id + ': ' + error);
        }
        return issues;
    }

    return { selectedOption, selectedFare, quotedPrice, durationMinutes, journeySummary, validateJourney, validateBaggage, validateTransport, validateTrip };
})();
