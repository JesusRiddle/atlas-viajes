'use strict';
// Contratos estructurales del Atlas. No contiene IDs de viajes ni snapshots de precios.
const { URL } = require('node:url');
const problem = (path, message) => ({ path, message });
const dateOK = input => typeof input === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(input) &&
  !Number.isNaN(Date.parse(input + 'T00:00:00Z')) &&
  new Date(input + 'T00:00:00Z').toISOString().slice(0, 10) === input;
const nextDate = date => new Date(Date.parse(date + 'T00:00:00Z') + 86400000).toISOString().slice(0, 10);
const isUrl = input => {
  if (typeof input !== 'string' || !input.trim() || /\s/.test(input)) return false;
  try {
    const parsed = new URL(input);
    return (parsed.protocol === 'http:' || parsed.protocol === 'https:') &&
      !!parsed.hostname && !parsed.username && !parsed.password;
  } catch { return false; }
};
function unique(items, path, errors) {
  const seen = new Set();
  items.forEach((item, index) => {
    if (!item || typeof item.id !== 'string' || !item.id.trim())
      errors.push(problem(path + '[' + index + '].id', 'ID obligatorio'));
    else if (seen.has(item.id))
      errors.push(problem(path + '[' + index + '].id', 'ID duplicado'));
    else seen.add(item.id);
  });
}
function photos(trip, catalog, { complete = false } = {}) {
  const errors = [];
  if (!catalog || typeof catalog !== 'object' || Array.isArray(catalog))
    return [problem('photos', 'Catálogo fotográfico no válido')];
  const references = [{ key: trip?.cover, path: 'cover' }];
  if (trip?.coverSlides != null && !Array.isArray(trip.coverSlides))
    errors.push(problem('coverSlides', 'El carrusel debe ser una lista'));
  if (Array.isArray(trip?.coverSlides)) trip.coverSlides.forEach((key, j) =>
    references.push({ key, path: 'coverSlides[' + j + ']' }));
  if (Array.isArray(trip?.days)) trip.days.forEach((day, i) => {
    for (const field of ['places', 'optionalPlaces']) {
      if (day?.[field] != null && !Array.isArray(day[field]))
        errors.push(problem('days[' + i + '].' + field, 'Referencias fotográficas deben ser una lista'));
      if (Array.isArray(day?.[field]))
        day[field].forEach((key, j) => {
          const location = 'days[' + i + '].' + field + '[' + j + ']';
          references.push({ key, path: location });
          if (field === 'places' && (complete || trip.placeDescriptions != null) &&
              (typeof trip.placeDescriptions[key] !== 'string' ||
               !trip.placeDescriptions[key].trim()))
            errors.push(problem(location, 'Falta pie de foto de la actividad'));
        });
    }
  });
  for (const { key, path } of references) {
    if (key == null) continue;
    if (typeof key !== 'string' || !catalog[key] || !catalog[key].photo?.src)
      errors.push(problem(path, 'Referencia de fotografía inexistente o sin imagen'));
  }
  return errors;
}
function validate(trip, { complete = false, mode } = {}) {
  const errors = [];
  if (mode != null && !['incremental', 'complete'].includes(mode))
    return [problem('mode', 'Modo editorial desconocido')];
  complete = mode === 'complete' || (mode == null && complete === true);
  if (!trip || typeof trip !== 'object' || Array.isArray(trip))
    return [problem('trip', 'Se espera un objeto de viaje')];
  const collections = ['days', 'hotels', 'majorTransport', 'expenses', 'reservations', 'mapPoints'];
  for (const name of collections) if (trip[name] != null && !Array.isArray(trip[name]))
    errors.push(problem(name, 'Debe ser una colección'));
  const days = Array.isArray(trip.days) ? trip.days : [];
  const hotels = Array.isArray(trip.hotels) ? trip.hotels : [];
  const transport = Array.isArray(trip.majorTransport) ? trip.majorTransport : [];
  const expenses = Array.isArray(trip.expenses) ? trip.expenses : [];
  const groups = Array.isArray(trip.reservations) ? trip.reservations : [];
  if (trip.experiences != null && !Array.isArray(trip.experiences))
    errors.push(problem('experiences', 'Las experiencias deben ser una colección'));
  if (Array.isArray(trip.experiences)) trip.experiences.forEach((experience, index) => {
    if (!experience || typeof experience.city !== 'string' ||
        !experience.city.trim() || typeof experience.description !== 'string' ||
        !experience.description.trim())
      errors.push(problem('experiences[' + index + ']',
        'Experiencia sin lugar o descripción turística'));
  });
  unique(hotels, 'hotels', errors);
  unique(transport, 'majorTransport', errors);
  unique(expenses, 'expenses', errors);
  const hotelIds = new Set(hotels.map(h => h?.id).filter(Boolean));
  const transportIds = new Set(transport.map(t => t?.id).filter(Boolean));
  transport.forEach((item, i) => {
    if (item?.boardingLocations != null && !Array.isArray(item.boardingLocations))
      errors.push(problem('majorTransport[' + i + '].boardingLocations', 'Paradas inválidas'));
    if (Array.isArray(item?.boardingLocations)) item.boardingLocations.forEach((stop, j) => {
      if (typeof stop?.name !== 'string' || !stop.name.trim() || !isUrl(stop?.mapUrl))
        errors.push(problem('majorTransport[' + i + '].boardingLocations[' + j + ']',
          'El abordaje requiere nombre y enlace HTTP(S)'));
    });
  });
  for (const [i, hotel] of hotels.entries()) {
    if (!hotel || typeof hotel !== 'object') continue;
    if (complete && (hotel.checkIn == null || hotel.checkOut == null))
      errors.push(problem('hotels[' + i + ']', 'Fechas de alojamiento requeridas al cerrar'));
    if (hotel.checkIn != null || hotel.checkOut != null) {
      if (!dateOK(hotel.checkIn) || !dateOK(hotel.checkOut) || hotel.checkOut <= hotel.checkIn)
        errors.push(problem('hotels[' + i + ']', 'Check-in/check-out inválidos'));
    }
    if (complete && (!isUrl(hotel.mapsUrl) || !Array.isArray(hotel.links) || !hotel.links.length))
      errors.push(problem('hotels[' + i + ']', 'Enlace de mapa y al menos un enlace de reserva requeridos'));
    if (hotel.mapsUrl != null && !isUrl(hotel.mapsUrl))
      errors.push(problem('hotels[' + i + '].mapsUrl', 'URL de mapa inválida'));
    if (Array.isArray(hotel.links)) hotel.links.forEach((link, j) => {
      if (!isUrl(link?.url)) errors.push(problem('hotels[' + i + '].links[' + j + ']', 'URL inválida'));
    });
  }
  if (complete && trip.start == null) errors.push(problem('start', 'Fecha inicial requerida al cerrar'));
  if (trip.start != null && !dateOK(trip.start)) errors.push(problem('start', 'Fecha inválida'));
  if (complete && trip.end == null) errors.push(problem('end', 'Fecha final requerida al cerrar'));
  if (trip.end != null && !dateOK(trip.end)) errors.push(problem('end', 'Fecha inválida'));
  if (trip.start && trip.end && dateOK(trip.start) && dateOK(trip.end) && trip.end < trip.start)
    errors.push(problem('end', 'La fecha final precede a la inicial'));
  // Reglas universales sin snapshots de destinos o de fechas.
  if (complete && trip.travelerCount == null)
    errors.push(problem('travelerCount', 'Número de personas requerido al cerrar el presupuesto'));
  if (trip.travelerCount != null &&
      (!Number.isInteger(trip.travelerCount) || trip.travelerCount < 1))
    errors.push(problem('travelerCount', 'El número de personas debe ser entero positivo'));
  if (complete && dateOK(trip.start) && dateOK(trip.end) && !days.length)
    errors.push(problem('days', 'Un viaje completo con fechas necesita jornadas'));

  if (Array.isArray(trip.mapPoints)) {
    const orders = new Set();
    trip.mapPoints.forEach((point, i) => {
      const where = 'mapPoints[' + i + ']';
      if (!point || typeof point !== 'object') {
        errors.push(problem(where, 'Punto del mapa inválido')); return;
      }
      const coords = point.coords;
      if ((complete || coords != null) && (!Array.isArray(coords) || coords.length !== 2 ||
          !coords.every(Number.isFinite) ||
          coords[0] < -90 || coords[0] > 90 || coords[1] < -180 || coords[1] > 180))
        errors.push(problem(where + '.coords', 'Coordenadas geográficas fuera de rango'));
      if (point.order != null) {
        if (!Number.isInteger(point.order) || point.order < 1 || orders.has(point.order))
          errors.push(problem(where + '.order', 'Orden de punto repetido o inválido'));
        orders.add(point.order);
      }
    });
    if (complete && trip.mapPoints.length && orders.size < trip.mapPoints.length)
      errors.push(problem('mapPoints', 'Todos los puntos deben tener orden si alguno lo tiene'));
    if (complete && orders.size && orders.size === trip.mapPoints.length &&
        !trip.mapPoints.every((_, i) => orders.has(i + 1)))
      errors.push(problem('mapPoints', 'La numeración de puntos debe ser consecutiva'));
  }

  if (trip.exchangeRates != null) {
    if (!trip.exchangeRates || typeof trip.exchangeRates !== 'object' ||
        Array.isArray(trip.exchangeRates))
      errors.push(problem('exchangeRates', 'Tipos de cambio deben ser un objeto'));
    else for (const [code, rate] of Object.entries(trip.exchangeRates)) {
      if (!Intl.supportedValuesOf('currency').includes(code) ||
          !Number.isFinite(rate) || rate <= 0)
        errors.push(problem('exchangeRates.' + code, 'Tipo de cambio y moneda válidos requeridos'));
    }
  }
  const foreignCurrencies = new Set(expenses.filter(x =>
    Number.isFinite(x?.cost?.amount) && x.cost.currency !== 'MXN')
    .map(x => x.cost.currency));
  if (complete && foreignCurrencies.size) {
    for (const currency of foreignCurrencies) {
      if (!Number.isFinite(trip.exchangeRates?.[currency]) ||
          trip.exchangeRates[currency] <= 0)
        errors.push(problem('exchangeRates.' + currency, 'Falta tasa para convertir un gasto conocido'));
      if (!dateOK(trip.exchangeRateSnapshot?.date) ||
          !isUrl(trip.exchangeRateSnapshot?.sources?.[currency]))
        errors.push(problem('exchangeRateSnapshot.' + currency,
          'La conversión necesita fecha y fuente documental'));
    }
  }
  const seenNumbers = new Set();
  days.forEach((day, i) => {
    const path = 'days[' + i + ']';
    if (!dateOK(day?.date)) errors.push(problem(path + '.date', 'Fecha de jornada inválida'));
    if (i === 0 && trip.start && day.date !== trip.start)
      errors.push(problem(path + '.date', 'La primera jornada no coincide con el inicio'));
    if (i > 0 && dateOK(days[i - 1]?.date) && day.date !== nextDate(days[i - 1].date))
      errors.push(problem(path + '.date', 'Las jornadas deben ser consecutivas'));
    if (i === days.length - 1 && trip.end && day.date !== trip.end)
      errors.push(problem(path + '.date', 'La última jornada no coincide con el final'));
    if (complete && day.n == null)
      errors.push(problem(path + '.n', 'Número de jornada obligatorio al cerrar'));
    if (day.n != null) {
      if (!Number.isInteger(day.n) || day.n !== i + 1 || seenNumbers.has(day.n))
        errors.push(problem(path + '.n', 'Número de jornada duplicado o inválido'));
      seenNumbers.add(day.n);
    }
    if (day.hotel != null) {
      if (!hotelIds.has(day.hotel))
        errors.push(problem(path + '.hotel', 'Alojamiento referenciado inexistente'));
      else {
        const hotel = hotels.find(h => h?.id === day.hotel);
        if (dateOK(hotel.checkIn) && dateOK(hotel.checkOut) &&
          (day.date < hotel.checkIn || day.date >= hotel.checkOut))
          errors.push(problem(path + '.hotel', 'Jornada fuera de las fechas del alojamiento'));
      }
    }
    if (day.mobilityLinks != null && !Array.isArray(day.mobilityLinks))
      errors.push(problem(path + '.mobilityLinks', 'Enlaces de movilidad deben ser una lista'));
    if (Array.isArray(day.mobilityLinks)) day.mobilityLinks.forEach((link, j) => {
      if (typeof link?.label !== 'string' || !link.label.trim() || !isUrl(link.url))
        errors.push(problem(path + '.mobilityLinks[' + j + ']',
          'Cada enlace de movilidad necesita etiqueta y URL HTTP(S)'));
    });
    if (day.transportRefs != null && !Array.isArray(day.transportRefs))
      errors.push(problem(path + '.transportRefs', 'Referencias de transporte deben ser una lista'));
    if (Array.isArray(day.transportRefs))
      day.transportRefs.forEach((id, j) => { if (!transportIds.has(id))
        errors.push(problem(path + '.transportRefs[' + j + ']', 'Transporte inexistente')); });
  });
  // Una noche con hotel disponible pero sin elección en el itinerario es una
  // inconsistencia. No obligar a dormir en hotel durante vuelos nocturnos,
  // campamentos u otros días sin oferta hotelera registrada.
  if (complete) days.forEach((day, i) => {
    if (!dateOK(day?.date) || !dateOK(trip.end) || day.date >= trip.end ||
        day.hotel != null) return;
    const nightHasHotel = hotels.some(h => dateOK(h?.checkIn) && dateOK(h?.checkOut) &&
      h.checkIn <= day.date && day.date < h.checkOut);
    const flightNight = (typeof day.base === 'string' &&
      day.base.toLowerCase().startsWith('en vuelo')) || day.overnightType === 'flight';
    const alternativeNight = ['camping', 'other'].includes(day.overnightType);
    if (nightHasHotel || (!flightNight && !alternativeNight))
      errors.push(problem('days[' + i + '].hotel',
        'Noche sin alojamiento asignado ni excepción explícita'));
  });
  expenses.forEach((expense, i) => {
    const path = 'expenses[' + i + ']';
    if (expense?.status != null &&
        !['pending', 'quoted', 'estimated', 'confirmed', 'reserved', 'purchased', 'paid'].includes(expense.status))
      errors.push(problem(path + '.status', 'Estado de gasto desconocido'));
    if (expense?.hotelId && !hotelIds.has(expense.hotelId))
      errors.push(problem(path + '.hotelId', 'Gasto vinculado a un alojamiento inexistente'));
    if (expense?.date != null && !dateOK(expense.date))
      errors.push(problem(path + '.date', 'Fecha de gasto inválida'));
    if (expense?.cost != null) {
      const { amount, currency } = expense.cost;
      if (amount != null && (!Number.isFinite(amount) || amount < 0))
        errors.push(problem(path + '.cost.amount', 'Importe no válido'));
      if (amount != null && (typeof currency !== 'string' ||
        !Intl.supportedValuesOf('currency').includes(currency)))
        errors.push(problem(path + '.cost.currency', 'Moneda ISO 4217 requerida'));
    }
  });
  const groupNames = new Set();
  groups.forEach((group, i) => {
    if (!Array.isArray(group) || typeof group[0] !== 'string' || !group[0].trim() || !Array.isArray(group[1])) {
      errors.push(problem('reservations[' + i + ']', 'Grupo de reservas inválido')); return;
    }
    if (groupNames.has(group[0].trim()))
      errors.push(problem('reservations[' + i + ']', 'Grupo de reservas duplicado'));
    groupNames.add(group[0].trim());
    group[1].forEach((reservation, j) => {
      if (!reservation || typeof reservation.title !== 'string' || !reservation.title.trim())
        errors.push(problem('reservations[' + i + '][' + j + ']', 'Reserva sin título'));
      if (reservation?.status != null &&
          !['pending', 'quoted', 'estimated', 'confirmed', 'reserved', 'purchased'].includes(reservation.status))
        errors.push(problem('reservations[' + i + '][' + j + '].status', 'Estado desconocido'));
      if (reservation?.links != null && !Array.isArray(reservation.links))
        errors.push(problem('reservations[' + i + '][' + j + '].links', 'Enlaces inválidos'));
      if (Array.isArray(reservation?.links)) reservation.links.forEach((link, k) => {
        if (!isUrl(link?.url))
          errors.push(problem('reservations[' + i + '][' + j + '].links[' + k + ']', 'URL inválida'));
      });
    });
  });
  return errors;
}
module.exports = { validate, photos, dateOK, isUrl };
