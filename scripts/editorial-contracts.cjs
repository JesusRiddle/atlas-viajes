'use strict';

// Reglas editoriales compartidas. Sin dependencias de destinos, DOM ni datos externos.
const MONTHS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const STATES = new Set(['pending', 'recommended', 'conditional', 'avoid']);
const INDICATORS = [
  ['style', 'Estilo de viaje'],
  ['language', 'Idioma y moneda'],
  ['entry', 'Documentación y consejos prácticos']
];
const SECTIONS = ['plan', 'mapa', 'temporadas', 'experiencias', 'reservas',
  'traslados', 'alojamientos', 'dias', 'costes'];
const NUMBER = '[−-]?\\d{1,2}(?:[.,]\\d+)?';
const explicitRE = new RegExp('(?<![\\p{L}\\d])Máx\\.\\s*(' + NUMBER + ')\\s*°C\\s*·\\s*Mín\\.\\s*(' + NUMBER + ')\\s*°C(?![\\d,])', 'u');
const legacyRE = new RegExp('(?<![\\d.,−-])(' + NUMBER + ') a (' + NUMBER + ')\\s*°C(?![\\d,])', 'u');
const value = text => Number(text.replace('−', '-').replace(',', '.'));
const issue = (path, message) => ({ path, message });

function temperature(text, { allowLegacy = true } = {}) {
  if (typeof text !== 'string') return { kind: 'missing' };
  // Una notación Máx./Mín. incompleta no puede validarse como intervalo heredado.
  if (/Máx\.|Mín\./u.test(text) && !explicitRE.test(text))
    return { kind: 'invalid', errors: ['Par máximo/mínimo incompleto o malformado'] };
  const explicit = text.match(explicitRE);
  if (explicit) {
    const max = value(explicit[1]), min = value(explicit[2]);
    const errors = [];
    if (explicit[1].includes('-') || explicit[2].includes('-')) errors.push('Usar signo menos Unicode −');
    if (max < min) errors.push('La máxima no puede ser inferior a la mínima');
    return { kind: 'explicit', max, min, errors };
  }
  const legacy = text.match(legacyRE);
  if (legacy) {
    const low = value(legacy[1]), high = value(legacy[2]);
    const errors = [];
    if (legacy[1].includes('-') || legacy[2].includes('-')) errors.push('Usar signo menos Unicode −');
    if (low > high) errors.push('El intervalo debe ir de menor a mayor');
    if (!allowLegacy) errors.push('Se exige Máx. X °C · Mín. Y °C');
    // Un intervalo histórico puede describir máximas entre regiones, NO mínimas nocturnas.
    return { kind: 'legacy-interval', low, high, errors };
  }
  return { kind: 'invalid', errors: ['Formato térmico no reconocido'] };
}

function seasons(seasonality, path = 'seasonality') {
  const errors = [];
  if (!seasonality || !seasonality.months || typeof seasonality.months !== 'object' ||
      Array.isArray(seasonality.months)) return [issue(path, 'Se esperan doce meses')];
  const months = seasonality.months;
  if (Object.keys(months).length !== 12) errors.push(issue(path, 'Deben existir exactamente doce meses'));
  for (const key of MONTHS) {
    const item = months[key];
    if (!item || !STATES.has(item.status)) {
      errors.push(issue(path + '.months.' + key, 'Mes ausente o estado inválido'));
      continue;
    }
    if (item.status !== 'pending') {
      const result = temperature(item.description);
      if (!['explicit', 'legacy-interval'].includes(result.kind))
        errors.push(issue(path + '.months.' + key, 'Mes evaluado sin temperatura reconocible'));
      else for (const message of result.errors) errors.push(issue(path + '.months.' + key, message));
    }
  }
  return errors;
}

function indicators(items, { complete = false, path = 'practicalIndicators' } = {}) {
  if (!Array.isArray(items)) return [issue(path, 'Se espera una lista')];
  if (!complete && items.length === 0) return [];
  const errors = [];
  if (items.length !== 3) errors.push(issue(path, 'Se requieren exactamente tres indicadores'));
  INDICATORS.forEach(([id, title], index) => {
    const item = items[index];
    if (!item || item.id !== id || item.title !== title)
      errors.push(issue(path + '[' + index + ']', 'Orden, ID o título incorrecto'));
    else {
      if (!['green', 'orange'].includes(item.tone))
        errors.push(issue(path + '[' + index + '].tone', 'Tono inválido'));
      if (typeof item.text !== 'string' || !item.text.trim())
        errors.push(issue(path + '[' + index + '].text', 'Texto requerido'));
      if (typeof item.badge !== 'string' || !item.badge.trim())
        errors.push(issue(path + '[' + index + '].badge', 'Badge requerido'));
    }
  });
  const language = items.find(item => item?.id === 'language');
  if (language) {
    const badge = language.badge;
    const formatValid = typeof badge === 'string' &&
      /^[^·;,]+ · [A-Z]{3}(?:[;,] [^·;,]+ · [A-Z]{3})*$/.test(badge);
    const codes = formatValid ? [...badge.matchAll(/ · ([A-Z]{3})(?=[;,]|$)/g)].map(m => m[1]) : [];
    const knownCodes = new Set(Intl.supportedValuesOf('currency'));
    if (!formatValid || codes.length === 0 || codes.some(code => !knownCodes.has(code)))
      errors.push(issue(path + '.language.badge', 'Debe indicar idioma y moneda ISO 4217 válida'));
  }
  return errors;
}

function sections(ids) {
  if (!Array.isArray(ids)) return [issue('sections', 'Se espera una lista de anclas')];
  return ids.length === SECTIONS.length && ids.every((id, i) => id === SECTIONS[i])
    ? [] : [issue('sections', 'Se requieren las nueve secciones maestras en orden')];
}

function trip(tripData, { complete = false } = {}) {
  if (!tripData || typeof tripData !== 'object') return [issue('trip', 'Viaje inválido')];
  return [
    ...(complete || tripData.seasonality ? seasons(tripData.seasonality) : []),
    ...indicators(tripData.practicalIndicators ?? [], { complete })
  ];
}

module.exports = { MONTHS, STATES, INDICATORS, SECTIONS, temperature, seasons, indicators, sections, trip };
