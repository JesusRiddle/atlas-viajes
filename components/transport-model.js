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
            }
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

    return { selectedOption, selectedFare, quotedPrice, validateTransport, validateTrip };
})();
