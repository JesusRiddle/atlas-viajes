// Selecciones temporales en memoria; el futuro administrador gestionará la persistencia.
window.AtlasSelections = (() => {
    'use strict';
    const overridesByTrip = new Map();
    const listeners = new Set();
    const copy = value => Object.fromEntries(Object.entries(value).map(([key, item]) => [key, { ...item }]));
    const get = tripId => copy(overridesByTrip.get(tripId) || {});

    function set(trip, transportId, optionId, fareId) {
        if (!trip?.id) throw new Error('Viaje inválido');
        const transport = trip.majorTransport?.find(item => item.id === transportId);
        const option = transport?.options?.find(item => item.id === optionId);
        const fare = option?.fares?.find(item => item.id === fareId);
        if (!transport || !option || !fare) throw new Error('Opción o tarifa inexistente');
        const current = overridesByTrip.get(trip.id) || {};
        const next = { ...current, [transportId]: { option: optionId, fare: fareId } };
        overridesByTrip.set(trip.id, next);
        for (const listener of listeners) listener(trip.id, get(trip.id));
        return get(trip.id);
    }

    function reset(tripId) {
        overridesByTrip.delete(tripId);
        for (const listener of listeners) listener(tripId, get(tripId));
    }

    function subscribe(listener) {
        if (typeof listener !== 'function') throw new TypeError('Listener inválido');
        listeners.add(listener);
        return () => listeners.delete(listener);
    }

    return { get, set, reset, subscribe };
})();
