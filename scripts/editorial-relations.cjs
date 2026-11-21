'use strict';
// Contratos estructurales del Atlas. No contiene IDs de viajes ni snapshots de precios.
const problem = (path, message) => ({ path, message });
const dateOK = input => typeof input === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(input) &&
  !Number.isNaN(Date.parse(input + 'T00:00:00Z')) &&
  new Date(input + 'T00:00:00Z').toISOString().slice(0, 10) === input;
const nextDate = date => new Date(Date.parse(date + 'T00:00:00Z') + 86400000).toISOString().slice(0, 10);
const isUrl = input => typeof input === 'string' && /^https?:\/\/[^\s/]+(?:\/[^\s]*)?$/i.test(input);
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
function photos(trip, catalog) {
  const errors = [];
  if (!catalog || typeof catalog !== 'object' || Array.isArray(catalog))
    return [problem('photos', 'Catálogo fotográfico no válido')];
  const references = [{ key: trip?.cover, path: 'cover' }];
  if (Array.isArray(trip?.days)) trip.days.forEach((day, i) => {
    for (const field of ['places', 'optionalPlaces']) {
      if (day?.[field] != null && !Array.isArray(day[field]))
        errors.push(problem('days[' + i + '].' + field, 'Referencias fotográficas deben ser una lista'));
      if (Array.isArray(day?.[field]))
        day[field].forEach((key, j) => references.push({ key, path: 'days[' + i + '].' + field + '[' + j + ']' }));
    }
  });
  for (const { key, path } of references) {
    if (key == null) continue;
    if (typeof key !== 'string' || !catalog[key] || !catalog[key].photo?.src)
      errors.push(problem(path, 'Referencia de fotografía inexistente o sin imagen'));
  }
  return errors;
}
function validate(trip, { complete = false } = {}) {
  const errors = [];
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
  unique(hotels, 'hotels', errors);
  unique(transport, 'majorTransport', errors);
  unique(expenses, 'expenses', errors);
  const hotelIds = new Set(hotels.map(h => h?.id).filter(Boolean));
  const transportIds = new Set(transport.map(t => t?.id).filter(Boolean));
  for (const [i, hotel] of hotels.entries()) {
    if (!hotel || typeof hotel !== 'object') continue;
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
  if (trip.start != null && !dateOK(trip.start)) errors.push(problem('start', 'Fecha inválida'));
  if (trip.end != null && !dateOK(trip.end)) errors.push(problem('end', 'Fecha inválida'));
  if (trip.start && trip.end && dateOK(trip.start) && dateOK(trip.end) && trip.end < trip.start)
    errors.push(problem('end', 'La fecha final precede a la inicial'));
  const seenNumbers = new Set();
  days.forEach((day, i) => {
    const path = 'days[' + i + ']';
    if (!dateOK(day?.date)) { errors.push(problem(path + '.date', 'Fecha de jornada inválida')); return; }
    if (i === 0 && trip.start && day.date !== trip.start)
      errors.push(problem(path + '.date', 'La primera jornada no coincide con el inicio'));
    if (i > 0 && dateOK(days[i - 1]?.date) && day.date !== nextDate(days[i - 1].date))
      errors.push(problem(path + '.date', 'Las jornadas deben ser consecutivas'));
    if (i === days.length - 1 && trip.end && day.date !== trip.end)
      errors.push(problem(path + '.date', 'La última jornada no coincide con el final'));
    if (day.n != null) {
      if (!Number.isInteger(day.n) || seenNumbers.has(day.n))
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
    if (day.transportRefs != null && !Array.isArray(day.transportRefs))
      errors.push(problem(path + '.transportRefs', 'Referencias de transporte deben ser una lista'));
    if (Array.isArray(day.transportRefs))
      day.transportRefs.forEach((id, j) => { if (!transportIds.has(id))
        errors.push(problem(path + '.transportRefs[' + j + ']', 'Transporte inexistente')); });
  });
  expenses.forEach((expense, i) => {
    const path = 'expenses[' + i + ']';
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
  groups.forEach((group, i) => {
    if (!Array.isArray(group) || typeof group[0] !== 'string' || !Array.isArray(group[1])) {
      errors.push(problem('reservations[' + i + ']', 'Grupo de reservas inválido')); return;
    }
    group[1].forEach((reservation, j) => {
      if (!reservation || typeof reservation.title !== 'string' || !reservation.title.trim())
        errors.push(problem('reservations[' + i + '][' + j + ']', 'Reserva sin título'));
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
