'use strict';
// Diagnóstico conservador: no interpreta texto libre como comprobante de compra.
// Solo identifica contradicciones explícitas entre estados de hotel y gasto vinculado.
const negative = /\b(?:no\s+reservad[oa]s?|sin\s+reservar|por\s+reservar|candidat[oa]s?|primera\s+opci[oó]n)\b/iu;
const positive = /\b(?:reserva\s+confirmada|reservad[oa]s?|pagad[oa]s?)\b/iu;
function lodgingStatusWarnings(trip) {
  const warnings = [];
  if (!Array.isArray(trip?.hotels) || !Array.isArray(trip?.expenses)) return warnings;
  for (const [i, hotel] of trip.hotels.entries()) {
    if (!hotel || typeof hotel !== 'object' || typeof hotel.id !== 'string') continue;
    const status = typeof hotel.status === 'string' ? hotel.status : '';
    const candidate = negative.test(status);
    const confirmed = positive.test(status) && !candidate;
    for (const [j, cost] of trip.expenses.entries()) {
      if (cost?.hotelId !== hotel.id) continue;
      const booked = ['reserved','confirmed','purchased','paid'].includes(cost.status);
      const unbooked = ['pending','quoted','estimated'].includes(cost.status);
      if (candidate && booked) warnings.push({
        path: 'expenses[' + j + '].status', code: 'candidate-charged-as-booked',
        message: 'Gasto de alojamiento marcado como reservado/pagado mientras el hotel figura como candidato'
      });
      if (confirmed && unbooked) warnings.push({
        path: 'hotels[' + i + '].status', code: 'booked-with-unconfirmed-ledger',
        message: 'Hotel descrito como reservado pero el gasto vinculado sigue pendiente o estimado; verificar pago y estado'
      });
    }
  }
  return warnings;
}
module.exports = { lodgingStatusWarnings };
