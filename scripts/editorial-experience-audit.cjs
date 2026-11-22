'use strict';
// Auditoría editorial optativa de experiencias: advertencias, no bloqueo de viajes heredados.
// Las excepciones de gastronomía se revisan manualmente; jamás inferirlas por longitud.
function experienceWarnings(trip) {
  const warnings = [];
  if (!Array.isArray(trip?.experiences)) return warnings;
  trip.experiences.forEach((experience, index) => {
    if (!experience || typeof experience.description !== 'string') return;
    const words = experience.description.trim().split(/\s+/u).filter(Boolean).length;
    if (words < 18) warnings.push({path: 'experiences[' + index + '].description',
      code: 'too-short', words, message: 'Experiencia por debajo de 18 palabras; revisar contenido específico'});
    if (words > 35) warnings.push({path: 'experiences[' + index + '].description',
      code: 'review-extension', words, message: 'Más de 35 palabras; comprobar justificación gastronómica'});
  });
  return warnings;
}
module.exports = { experienceWarnings };
