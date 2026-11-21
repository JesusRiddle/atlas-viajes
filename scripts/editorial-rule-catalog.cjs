'use strict';
// Catálogo de obligaciones editoriales. coverage=automated significa prueba existente,
// NO demostración de exhaustividad ni de fuentes externas verificadas.
// missing, partial y manual NO pueden presentarse como cobertura completa.
module.exports = Object.freeze([
  {
    "id": "CAT-01",
    "section": "transversal",
    "requirement": "IDs del catálogo únicos y viajes visibles",
    "coverage": "automated",
    "evidence": {
      "file": "tests/browser-smoke.cjs",
      "contains": "El catálogo no debe repetir IDs"
    }
  },
  {
    "id": "CAT-02",
    "section": "transversal",
    "requirement": "Los viajes son independientes y no se bloquean por coincidencias de fecha",
    "coverage": "missing"
  },
  {
    "id": "LIF-01",
    "section": "transversal",
    "requirement": "Un viaje mínimo admite datos pendientes sin fabricarlos",
    "coverage": "automated",
    "evidence": {
      "file": "tests/loader-regression.test.cjs",
      "contains": "plantilla universal: identidad mínima"
    }
  },
  {
    "id": "LIF-02",
    "section": "transversal",
    "requirement": "Distinguir formalmente etapas incremental y editorialmente completo",
    "coverage": "missing"
  },
  {
    "id": "NAV-01",
    "section": "transversal",
    "requirement": "Nueve secciones y anclas en orden",
    "coverage": "automated",
    "evidence": {
      "file": "tests/editorial-contracts.test.cjs",
      "contains": "nueve secciones maestras en el orden establecido"
    }
  },
  {
    "id": "NAV-02",
    "section": "transversal",
    "requirement": "Estilos y etiquetas visibles en español sin terminología prohibida",
    "coverage": "partial",
    "evidence": {
      "file": "tests/browser-smoke.cjs",
      "contains": "Tus alojamientos."
    }
  },
  {
    "id": "PAN-01",
    "section": "plan",
    "requirement": "Tres indicadores Panorama con títulos y orden estables",
    "coverage": "automated",
    "evidence": {
      "file": "tests/editorial-contracts.test.cjs",
      "contains": "indicadores de Panorama"
    }
  },
  {
    "id": "PAN-02",
    "section": "plan",
    "requirement": "Tarjeta independiente Clima y luz con tres párrafos y tono correcto",
    "coverage": "partial",
    "evidence": {
      "file": "tests/browser-smoke.cjs",
      "contains": "overview-climate-card"
    }
  },
  {
    "id": "PAN-03",
    "section": "plan",
    "requirement": "Intro e introShort de longitud editorial; resaltados literales",
    "coverage": "partial",
    "evidence": {
      "file": "tests/trip-editorial.test.cjs",
      "contains": "mantiene introducción turística con resaltados"
    }
  },
  {
    "id": "PAN-04",
    "section": "plan",
    "requirement": "Idioma con moneda ISO reconocida",
    "coverage": "automated",
    "evidence": {
      "file": "tests/editorial-contracts.test.cjs",
      "contains": "moneda ISO"
    }
  },
  {
    "id": "PAN-05",
    "section": "plan",
    "requirement": "Correspondencia idioma, divisa y país del recorrido",
    "coverage": "missing"
  },
  {
    "id": "PAN-06",
    "section": "plan",
    "requirement": "Requisitos migratorios, enchufes y voltaje verificados por país y fechas",
    "coverage": "manual"
  },
  {
    "id": "MAP-01",
    "section": "mapa",
    "requirement": "Coordenadas dentro del rango geográfico y no ficticias",
    "coverage": "missing"
  },
  {
    "id": "MAP-02",
    "section": "mapa",
    "requirement": "Puntos de alojamiento vinculados a noches y etiquetas correctas",
    "coverage": "partial",
    "evidence": {
      "file": "tests/map-stay-labels.test.cjs",
      "contains": "todos los puntos de alojamiento resuelven sus noches"
    }
  },
  {
    "id": "MAP-03",
    "section": "mapa",
    "requirement": "Puntos y orden del mapa sincronizados con itinerario vigente",
    "coverage": "partial",
    "evidence": {
      "file": "tests/browser-smoke.cjs",
      "contains": "map-city-list"
    }
  },
  {
    "id": "SEA-01",
    "section": "temporadas",
    "requirement": "Doce meses con estado válido y pendientes explícitos",
    "coverage": "automated",
    "evidence": {
      "file": "tests/editorial-contracts.test.cjs",
      "contains": "doce meses"
    }
  },
  {
    "id": "SEA-02",
    "section": "temporadas",
    "requirement": "Temperaturas con semántica verificada y máxima/mínima sin invertir",
    "coverage": "automated",
    "evidence": {
      "file": "tests/editorial-contracts.test.cjs",
      "contains": "temperatura explícita"
    }
  },
  {
    "id": "SEA-03",
    "section": "temporadas",
    "requirement": "Exactitud de temporadas, luz y clima respecto a fuentes externas",
    "coverage": "manual"
  },
  {
    "id": "EXP-01",
    "section": "experiencias",
    "requirement": "Experiencias específicas sin relleno y extensión recomendada",
    "coverage": "missing"
  },
  {
    "id": "EXP-02",
    "section": "experiencias",
    "requirement": "Gastronomía y disponibilidad local contrastadas con fuentes",
    "coverage": "manual"
  },
  {
    "id": "RES-01",
    "section": "reservas",
    "requirement": "Grupos y enlaces de reserva con estructura válida",
    "coverage": "partial",
    "evidence": {
      "file": "tests/editorial-relations.test.cjs",
      "contains": "monedas, cantidades, enlaces y reservas inválidas"
    }
  },
  {
    "id": "RES-02",
    "section": "reservas",
    "requirement": "Estado confirmado/cotizado/estimado/pendiente no confundido",
    "coverage": "partial",
    "evidence": {
      "file": "tests/transport-budget.test.cjs",
      "contains": "las cotizaciones incompletas no se interpretan como costos cero"
    }
  },
  {
    "id": "RES-03",
    "section": "reservas",
    "requirement": "Vigencia y destino correcto de enlaces oficiales de reserva",
    "coverage": "manual"
  },
  {
    "id": "TRA-01",
    "section": "traslados",
    "requirement": "Referencias diarias de transporte sin huérfanos",
    "coverage": "automated",
    "evidence": {
      "file": "tests/editorial-relations.test.cjs",
      "contains": "referencias: detecta hoteles, transportes"
    }
  },
  {
    "id": "TRA-02",
    "section": "traslados",
    "requirement": "Segmentos, escalas y cronología de viajes renderizados",
    "coverage": "partial",
    "evidence": {
      "file": "tests/transport-budget.test.cjs",
      "contains": "zona horaria, escala y duración completas"
    }
  },
  {
    "id": "TRA-03",
    "section": "traslados",
    "requirement": "Tarifa elegida cubre todos los tramos aplicables y no duplica presupuesto",
    "coverage": "partial",
    "evidence": {
      "file": "tests/transport-budget.test.cjs",
      "contains": "solo se suma una tarifa por transporte"
    }
  },
  {
    "id": "TRA-04",
    "section": "traslados",
    "requirement": "Operador, horario, tarifa y fuente válidos para fecha de viaje",
    "coverage": "manual"
  },
  {
    "id": "LOD-01",
    "section": "alojamientos",
    "requirement": "Check-in/out y vínculo válido entre noches y alojamiento",
    "coverage": "partial",
    "evidence": {
      "file": "tests/editorial-relations.test.cjs",
      "contains": "fechas: rechaza calendario imposible"
    }
  },
  {
    "id": "LOD-02",
    "section": "alojamientos",
    "requirement": "Todas las noches cubiertas, sin traslape ni pernocta fantasma",
    "coverage": "partial",
    "evidence": {
      "file": "tests/patagonia-regression.test.cjs",
      "contains": "los gastos por día coinciden con el presupuesto"
    }
  },
  {
    "id": "LOD-03",
    "section": "alojamientos",
    "requirement": "Enlaces de mapa y reserva con formato válido",
    "coverage": "partial",
    "evidence": {
      "file": "tests/editorial-relations.test.cjs",
      "contains": "monedas, cantidades, enlaces y reservas inválidas"
    }
  },
  {
    "id": "LOD-04",
    "section": "alojamientos",
    "requirement": "Ubicación y disponibilidad real de hoteles y reservas",
    "coverage": "manual"
  },
  {
    "id": "DAY-01",
    "section": "dias",
    "requirement": "Jornadas consecutivas, límites y referencias de alojamiento",
    "coverage": "automated",
    "evidence": {
      "file": "tests/editorial-relations.test.cjs",
      "contains": "fechas: rechaza calendario imposible"
    }
  },
  {
    "id": "DAY-02",
    "section": "dias",
    "requirement": "Numeración consecutiva sin saltos ni duplicados",
    "coverage": "missing"
  },
  {
    "id": "DAY-03",
    "section": "dias",
    "requirement": "Campos de mañana/tarde/noche y tips/movilidad con sintaxis editorial",
    "coverage": "partial",
    "evidence": {
      "file": "tests/loader-regression.test.cjs",
      "contains": "Suiza nevada: contratos editoriales"
    }
  },
  {
    "id": "DAY-04",
    "section": "dias",
    "requirement": "Fotografías de actividades y portada referenciadas correctamente",
    "coverage": "automated",
    "evidence": {
      "file": "tests/editorial-relations.test.cjs",
      "contains": "fotografías: permite agregar o quitar actividades"
    }
  },
  {
    "id": "DAY-05",
    "section": "dias",
    "requirement": "Créditos, pies de 15–30 palabras y fuentes fotográficas por origen",
    "coverage": "partial",
    "evidence": {
      "file": "tests/loader-regression.test.cjs",
      "contains": "fotografías estivales, portada, galerías"
    }
  },
  {
    "id": "DAY-06",
    "section": "dias",
    "requirement": "Aperturas, recorridos y tiempos locales verificables",
    "coverage": "manual"
  },
  {
    "id": "BUD-01",
    "section": "costes",
    "requirement": "Gastos únicos, importes no negativos y divisas ISO válidas",
    "coverage": "automated",
    "evidence": {
      "file": "tests/editorial-relations.test.cjs",
      "contains": "monedas, cantidades, enlaces y reservas inválidas"
    }
  },
  {
    "id": "BUD-02",
    "section": "costes",
    "requirement": "Subtotal conciliado y alternativas no contabilizadas dos veces",
    "coverage": "partial",
    "evidence": {
      "file": "tests/transport-budget.test.cjs",
      "contains": "solo se suma una tarifa por transporte"
    }
  },
  {
    "id": "BUD-03",
    "section": "costes",
    "requirement": "Desglose por día, hotel y transporte coherente con ledger",
    "coverage": "partial",
    "evidence": {
      "file": "tests/transport-budget.test.cjs",
      "contains": "distribución hotelera por noche preserva el importe"
    }
  },
  {
    "id": "BUD-04",
    "section": "costes",
    "requirement": "Equivalencia MXN inmediata y tipo de cambio fechado con fuente",
    "coverage": "missing"
  },
  {
    "id": "BUD-05",
    "section": "costes",
    "requirement": "Viajeros por presupuesto y cálculo por persona sin asumir uno",
    "coverage": "partial",
    "evidence": {
      "file": "tests/home-comparison.test.cjs",
      "contains": "la cabecera conserva ocho columnas"
    }
  },
  {
    "id": "BUD-06",
    "section": "costes",
    "requirement": "Importe pendiente null distinto de cero conocido en todas las vistas",
    "coverage": "partial",
    "evidence": {
      "file": "tests/transport-budget.test.cjs",
      "contains": "las cotizaciones incompletas no se interpretan como costos cero"
    }
  },
  {
    "id": "UI-01",
    "section": "transversal",
    "requirement": "Sin NaN, undefined, overflow y anclas rotas escritorio/móvil",
    "coverage": "automated",
    "evidence": {
      "file": "tests/browser-smoke.cjs",
      "contains": "horizontal overflow"
    }
  },
  {
    "id": "UI-02",
    "section": "transversal",
    "requirement": "Auditoría editorial de navegador incluida en CI normal",
    "coverage": "automated",
    "evidence": {
      "file": ".github/workflows/atlas-checks.yml",
      "contains": "ATLAS_EDITORIAL_AUDIT"
    }
  }
]);
