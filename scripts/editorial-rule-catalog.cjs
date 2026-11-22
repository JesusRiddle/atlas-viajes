'use strict';
// Registro trazable: automated=prueba CI existente, partial=cobertura incompleta,
// missing=sin contrato comprobable, manual=verificación humana/externa.
module.exports = Object.freeze([
  {
    "id": "CAT-01",
    "section": "transversal",
    "requirement": "IDs del catálogo únicos y viajes visibles",
    "coverage": "automated",
    "evidence": {
      "file": "tests/browser-smoke.cjs",
      "contains": "El catálogo no debe repetir IDs"
    },
    "source": {
      "file": "docs/trip-editorial-guide.md",
      "heading": "## Convenciones universales"
    }
  },
  {
    "id": "CAT-02",
    "section": "transversal",
    "requirement": "Los viajes son independientes y no se bloquean por coincidencias de fecha",
    "coverage": "automated",
    "source": {
      "file": "docs/trip-editorial-guide.md",
      "heading": "## Convenciones universales"
    },
    "evidence": {
      "file": "tests/editorial-relations.test.cjs",
      "contains": "los viajes no se rechazan por compartir fechas"
    }
  },
  {
    "id": "LIF-01",
    "section": "transversal",
    "requirement": "Un viaje mínimo admite datos pendientes sin fabricarlos",
    "coverage": "automated",
    "evidence": {
      "file": "tests/loader-regression.test.cjs",
      "contains": "plantilla universal: identidad mínima"
    },
    "source": {
      "file": "docs/trip-editorial-guide.md",
      "heading": "## Convenciones universales"
    }
  },
  {
    "id": "LIF-02",
    "section": "transversal",
    "requirement": "Distinguir formalmente etapas incremental y editorialmente completo",
    "coverage": "automated",
    "source": {
      "file": "docs/trip-editorial-guide.md",
      "heading": "## Convenciones universales"
    },
    "evidence": {
      "file": "tests/editorial-relations.test.cjs",
      "contains": "modo editorial distingue borrador de cierre"
    }
  },
  {
    "id": "NAV-01",
    "section": "transversal",
    "requirement": "Nueve secciones y anclas en orden",
    "coverage": "automated",
    "evidence": {
      "file": "tests/editorial-contracts.test.cjs",
      "contains": "nueve secciones maestras en el orden establecido"
    },
    "source": {
      "file": "docs/trip-editorial-guide.md",
      "heading": "## Convenciones universales"
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
    },
    "source": {
      "file": "docs/trip-editorial-guide.md",
      "heading": "## Convenciones universales"
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
    },
    "source": {
      "file": "docs/trip-editorial-guide.md",
      "heading": "### 1. Panorama del viaje (`plan`)"
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
    },
    "source": {
      "file": "docs/trip-editorial-guide.md",
      "heading": "### 1. Panorama del viaje (`plan`)"
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
    },
    "source": {
      "file": "docs/trip-editorial-guide.md",
      "heading": "### 1. Panorama del viaje (`plan`)"
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
    },
    "source": {
      "file": "docs/trip-editorial-guide.md",
      "heading": "### 1. Panorama del viaje (`plan`)"
    }
  },
  {
    "id": "PAN-05",
    "section": "plan",
    "requirement": "Correspondencia idioma, divisa y país del recorrido",
    "coverage": "missing",
    "source": {
      "file": "docs/trip-editorial-guide.md",
      "heading": "### 1. Panorama del viaje (`plan`)"
    }
  },
  {
    "id": "PAN-06",
    "section": "plan",
    "requirement": "Requisitos migratorios, enchufes y voltaje verificados por país y fechas",
    "coverage": "manual",
    "source": {
      "file": "docs/trip-editorial-guide.md",
      "heading": "### 1. Panorama del viaje (`plan`)"
    }
  },
  {
    "id": "MAP-01",
    "section": "mapa",
    "requirement": "Coordenadas dentro del rango geográfico y no ficticias",
    "coverage": "partial",
    "source": {
      "file": "docs/trip-editorial-guide.md",
      "heading": "### 2. Mapa (`mapa`)"
    },
    "evidence": {
      "file": "tests/editorial-relations.test.cjs",
      "contains": "mapa: latitud, longitud"
    }
  },
  {
    "id": "MAP-02",
    "section": "mapa",
    "requirement": "Puntos de alojamiento vinculados a noches y etiquetas correctas",
    "coverage": "partial",
    "evidence": {
      "file": "tests/map-stay-labels.test.cjs",
      "contains": "todos los puntos de alojamiento resuelven sus noches"
    },
    "source": {
      "file": "docs/trip-editorial-guide.md",
      "heading": "### 2. Mapa (`mapa`)"
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
    },
    "source": {
      "file": "docs/trip-editorial-guide.md",
      "heading": "### 2. Mapa (`mapa`)"
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
    },
    "source": {
      "file": "docs/trip-editorial-guide.md",
      "heading": "### 3. Temporadas (`temporadas`)"
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
    },
    "source": {
      "file": "docs/trip-editorial-guide.md",
      "heading": "### 3. Temporadas (`temporadas`)"
    }
  },
  {
    "id": "SEA-03",
    "section": "temporadas",
    "requirement": "Exactitud de temporadas, luz y clima respecto a fuentes externas",
    "coverage": "manual",
    "source": {
      "file": "docs/trip-editorial-guide.md",
      "heading": "### 3. Temporadas (`temporadas`)"
    }
  },
  {
    "id": "EXP-01",
    "section": "experiencias",
    "requirement": "Experiencias específicas sin relleno y extensión recomendada",
    "coverage": "partial",
    "source": {
      "file": "docs/trip-editorial-guide.md",
      "heading": "### 4. Experiencias (`experiencias`)"
    },
    "evidence": {
      "file": "tests/editorial-relations.test.cjs",
      "contains": "experiencias y enlaces opcionales se verifican"
    }
  },
  {
    "id": "EXP-02",
    "section": "experiencias",
    "requirement": "Gastronomía y disponibilidad local contrastadas con fuentes",
    "coverage": "manual",
    "source": {
      "file": "docs/trip-editorial-guide.md",
      "heading": "### 4. Experiencias (`experiencias`)"
    }
  },
  {
    "id": "RES-01",
    "section": "reservas",
    "requirement": "Grupos y enlaces de reserva con estructura válida",
    "coverage": "partial",
    "evidence": {
      "file": "tests/editorial-relations.test.cjs",
      "contains": "monedas, cantidades, enlaces y reservas inválidas"
    },
    "source": {
      "file": "docs/trip-editorial-guide.md",
      "heading": "### 5. Reservaciones (`reservas`)"
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
    },
    "source": {
      "file": "docs/trip-editorial-guide.md",
      "heading": "### 5. Reservaciones (`reservas`)"
    }
  },
  {
    "id": "RES-03",
    "section": "reservas",
    "requirement": "Vigencia y destino correcto de enlaces oficiales de reserva",
    "coverage": "manual",
    "source": {
      "file": "docs/trip-editorial-guide.md",
      "heading": "### 5. Reservaciones (`reservas`)"
    }
  },
  {
    "id": "TRA-01",
    "section": "traslados",
    "requirement": "Referencias diarias de transporte sin huérfanos",
    "coverage": "automated",
    "evidence": {
      "file": "tests/editorial-relations.test.cjs",
      "contains": "referencias: detecta hoteles, transportes"
    },
    "source": {
      "file": "docs/trip-editorial-guide.md",
      "heading": "### 6. Traslados (`traslados`)"
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
    },
    "source": {
      "file": "docs/trip-editorial-guide.md",
      "heading": "### 6. Traslados (`traslados`)"
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
    },
    "source": {
      "file": "docs/trip-editorial-guide.md",
      "heading": "### 6. Traslados (`traslados`)"
    }
  },
  {
    "id": "TRA-04",
    "section": "traslados",
    "requirement": "Operador, horario, tarifa y fuente válidos para fecha de viaje",
    "coverage": "manual",
    "source": {
      "file": "docs/trip-editorial-guide.md",
      "heading": "### 6. Traslados (`traslados`)"
    }
  },
  {
    "id": "LOD-01",
    "section": "alojamientos",
    "requirement": "Check-in/out y vínculo válido entre noches y alojamiento",
    "coverage": "partial",
    "evidence": {
      "file": "tests/editorial-relations.test.cjs",
      "contains": "fechas: rechaza calendario imposible"
    },
    "source": {
      "file": "docs/trip-editorial-guide.md",
      "heading": "### 7. Dónde dormir (`alojamientos`)"
    }
  },
  {
    "id": "LOD-02",
    "section": "alojamientos",
    "requirement": "Todas las noches cubiertas, sin traslape ni pernocta fantasma",
    "coverage": "partial",
    "evidence": {
      "file": "tests/editorial-relations.test.cjs",
      "contains": "pernoctas alternativas: vuelo nocturno y camping"
    },
    "source": {
      "file": "docs/trip-editorial-guide.md",
      "heading": "### 7. Dónde dormir (`alojamientos`)"
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
    },
    "source": {
      "file": "docs/trip-editorial-guide.md",
      "heading": "### 7. Dónde dormir (`alojamientos`)"
    }
  },
  {
    "id": "LOD-04",
    "section": "alojamientos",
    "requirement": "Ubicación y disponibilidad real de hoteles y reservas",
    "coverage": "manual",
    "source": {
      "file": "docs/trip-editorial-guide.md",
      "heading": "### 7. Dónde dormir (`alojamientos`)"
    }
  },
  {
    "id": "DAY-01",
    "section": "dias",
    "requirement": "Jornadas consecutivas, límites y referencias de alojamiento",
    "coverage": "automated",
    "evidence": {
      "file": "tests/editorial-relations.test.cjs",
      "contains": "fechas: rechaza calendario imposible"
    },
    "source": {
      "file": "docs/trip-editorial-guide.md",
      "heading": "### 8. Día por día (`dias`)"
    }
  },
  {
    "id": "DAY-02",
    "section": "dias",
    "requirement": "Numeración consecutiva sin saltos ni duplicados",
    "coverage": "automated",
    "source": {
      "file": "docs/trip-editorial-guide.md",
      "heading": "### 8. Día por día (`dias`)"
    },
    "evidence": {
      "file": "tests/editorial-relations.test.cjs",
      "contains": "mutaciones de calendario detectan saltos"
    }
  },
  {
    "id": "DAY-03",
    "section": "dias",
    "requirement": "Campos de mañana/tarde/noche y tips/movilidad con sintaxis editorial",
    "coverage": "partial",
    "evidence": {
      "file": "tests/loader-regression.test.cjs",
      "contains": "Suiza nevada: contratos editoriales"
    },
    "source": {
      "file": "docs/trip-editorial-guide.md",
      "heading": "### 8. Día por día (`dias`)"
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
    },
    "source": {
      "file": "docs/trip-editorial-guide.md",
      "heading": "### 8. Día por día (`dias`)"
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
    },
    "source": {
      "file": "docs/trip-editorial-guide.md",
      "heading": "### 8. Día por día (`dias`)"
    }
  },
  {
    "id": "DAY-06",
    "section": "dias",
    "requirement": "Aperturas, recorridos y tiempos locales verificables",
    "coverage": "manual",
    "source": {
      "file": "docs/trip-editorial-guide.md",
      "heading": "### 8. Día por día (`dias`)"
    }
  },
  {
    "id": "BUD-01",
    "section": "costes",
    "requirement": "Gastos únicos, importes no negativos y divisas ISO válidas",
    "coverage": "automated",
    "evidence": {
      "file": "tests/editorial-relations.test.cjs",
      "contains": "monedas, cantidades, enlaces y reservas inválidas"
    },
    "source": {
      "file": "docs/trip-editorial-guide.md",
      "heading": "### 9. Presupuesto (`costes`)"
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
    },
    "source": {
      "file": "docs/trip-editorial-guide.md",
      "heading": "### 9. Presupuesto (`costes`)"
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
    },
    "source": {
      "file": "docs/trip-editorial-guide.md",
      "heading": "### 9. Presupuesto (`costes`)"
    }
  },
  {
    "id": "BUD-04",
    "section": "costes",
    "requirement": "Equivalencia MXN inmediata y tipo de cambio fechado con fuente",
    "coverage": "partial",
    "source": {
      "file": "docs/trip-editorial-guide.md",
      "heading": "### 9. Presupuesto (`costes`)"
    },
    "evidence": {
      "file": "tests/editorial-relations.test.cjs",
      "contains": "divisas: gasto extranjero requiere tasa positiva"
    }
  },
  {
    "id": "BUD-05",
    "section": "costes",
    "requirement": "Viajeros por presupuesto y cálculo por persona sin asumir uno",
    "coverage": "partial",
    "evidence": {
      "file": "tests/home-comparison.test.cjs",
      "contains": "la cabecera conserva ocho columnas"
    },
    "source": {
      "file": "docs/trip-editorial-guide.md",
      "heading": "### 9. Presupuesto (`costes`)"
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
    },
    "source": {
      "file": "docs/trip-editorial-guide.md",
      "heading": "### 9. Presupuesto (`costes`)"
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
    },
    "source": {
      "file": "docs/trip-editorial-guide.md",
      "heading": "## Convenciones universales"
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
    },
    "source": {
      "file": "docs/trip-editorial-guide.md",
      "heading": "## Convenciones universales"
    }
  },
  {
    "id": "CAT-03",
    "section": "transversal",
    "requirement": "No modificar JSON de otros viajes ni ideas históricas durante una edición aislada",
    "coverage": "partial",
    "evidence": {
      "file": "tests/editorial-change-scope.test.cjs",
      "contains": "edición aislada acepta su viaje"
    },
    "source": {
      "file": "docs/trip-editorial-guide.md",
      "heading": "## Convenciones universales"
    }
  },
  {
    "id": "PAN-07",
    "section": "plan",
    "requirement": "introHighlights son nombres presentes literalmente en intro",
    "coverage": "partial",
    "evidence": {
      "file": "tests/trip-editorial.test.cjs",
      "contains": "resaltados editoriales de todos los viajes vigentes"
    },
    "source": {
      "file": "docs/trip-editorial-guide.md",
      "heading": "### 1. Panorama del viaje (`plan`)"
    }
  },
  {
    "id": "PAN-08",
    "section": "plan",
    "requirement": "Texto intro no incluye información de compras, precios ni reglas administrativas",
    "coverage": "partial",
    "evidence": {
      "file": "tests/trip-editorial.test.cjs",
      "contains": "mantiene introducción turística con resaltados existentes"
    },
    "source": {
      "file": "docs/trip-editorial-guide.md",
      "heading": "### 1. Panorama del viaje (`plan`)"
    }
  },
  {
    "id": "MAP-04",
    "section": "mapa",
    "requirement": "Nombre principal en negrita y calificadores sin negrita en la vista",
    "coverage": "automated",
    "evidence": {
      "file": "tests/browser-smoke.cjs",
      "contains": "mapTypography.every"
    },
    "source": {
      "file": "docs/trip-editorial-guide.md",
      "heading": "### 2. Mapa (`mapa`)"
    }
  },
  {
    "id": "SEA-04",
    "section": "temporadas",
    "requirement": "Color de Clima y luz idéntico al estado de mes seleccionado",
    "coverage": "partial",
    "evidence": {
      "file": "tests/browser-smoke.cjs",
      "contains": "overview-climate-card"
    },
    "source": {
      "file": "docs/trip-editorial-guide.md",
      "heading": "### 3. Temporadas (`temporadas`)"
    }
  },
  {
    "id": "EXP-03",
    "section": "experiencias",
    "requirement": "Descripción de experiencias 18–35 palabras, salvo ampliaciones justificadas",
    "coverage": "partial",
    "evidence": {
      "file": "tests/editorial-experience-audit.test.cjs",
      "contains": "experiencias: longitud recomendada y excepciones bajo revisión"
    },
    "source": {
      "file": "docs/trip-editorial-guide.md",
      "heading": "### 4. Experiencias (`experiencias`)"
    }
  },
  {
    "id": "RES-04",
    "section": "reservas",
    "requirement": "Título fijo Reservaciones importantes y grupos de prioridad visibles",
    "coverage": "partial",
    "evidence": {
      "file": "tests/browser-smoke.cjs",
      "contains": "Reservaciones importantes"
    },
    "source": {
      "file": "docs/trip-editorial-guide.md",
      "heading": "### 5. Reservaciones (`reservas`)"
    }
  },
  {
    "id": "TRA-05",
    "section": "traslados",
    "requirement": "Enlaces de abordaje y paradas actuales accesibles por jornada",
    "coverage": "partial",
    "source": {
      "file": "docs/trip-editorial-guide.md",
      "heading": "### 6. Traslados (`traslados`)"
    },
    "evidence": {
      "file": "tests/editorial-relations.test.cjs",
      "contains": "experiencias y enlaces opcionales se verifican"
    }
  },
  {
    "id": "TRA-06",
    "section": "traslados",
    "requirement": "Tarifa pendiente conserva null; no se inventa un costo cero",
    "coverage": "partial",
    "evidence": {
      "file": "tests/transport-budget.test.cjs",
      "contains": "las cotizaciones incompletas no se interpretan como costos cero"
    },
    "source": {
      "file": "docs/trip-editorial-guide.md",
      "heading": "### 6. Traslados (`traslados`)"
    }
  },
  {
    "id": "LOD-05",
    "section": "alojamientos",
    "requirement": "Resumen X noches, Y alojamientos con plural y fuentes dinámicas",
    "coverage": "partial",
    "evidence": {
      "file": "tests/browser-smoke.cjs",
      "contains": "Tus alojamientos."
    },
    "source": {
      "file": "docs/trip-editorial-guide.md",
      "heading": "### 7. Dónde dormir (`alojamientos`)"
    }
  },
  {
    "id": "LOD-06",
    "section": "alojamientos",
    "requirement": "Candidato o cotizado no aparece como reservado en texto o presupuesto",
    "coverage": "partial",
    "evidence": {
      "file": "tests/editorial-lodging-audit.test.cjs",
      "contains": "distingue candidato, cotización"
    },
    "source": {
      "file": "docs/trip-editorial-guide.md",
      "heading": "### 7. Dónde dormir (`alojamientos`)"
    }
  },
  {
    "id": "DAY-07",
    "section": "dias",
    "requirement": "Cada pie de fotografía vigente contiene 15–30 palabras concretas",
    "coverage": "partial",
    "evidence": {
      "file": "tests/loader-regression.test.cjs",
      "contains": "Suiza nevada: contratos editoriales"
    },
    "source": {
      "file": "docs/trip-editorial-guide.md",
      "heading": "### 8. Día por día (`dias`)"
    }
  },
  {
    "id": "DAY-08",
    "section": "dias",
    "requirement": "Fotos externas directas HTTPS y autor/licencia según procedencia",
    "coverage": "partial",
    "evidence": {
      "file": "tests/loader-regression.test.cjs",
      "contains": "Suiza Verde: fotografías estivales"
    },
    "source": {
      "file": "docs/trip-editorial-guide.md",
      "heading": "### 8. Día por día (`dias`)"
    }
  },
  {
    "id": "DAY-09",
    "section": "dias",
    "requirement": "Días parciales se renderizan sin bloquear todo el itinerario",
    "coverage": "automated",
    "evidence": {
      "file": "tests/loader-regression.test.cjs",
      "contains": "un viaje mínimo comparte encabezado"
    },
    "source": {
      "file": "docs/trip-editorial-guide.md",
      "heading": "### 8. Día por día (`dias`)"
    }
  },
  {
    "id": "BUD-07",
    "section": "costes",
    "requirement": "Portada y Panorama usan proyección dinámica del ledger actual",
    "coverage": "partial",
    "evidence": {
      "file": "tests/format-budget-contract.test.cjs",
      "contains": "structured expenses remain eligible"
    },
    "source": {
      "file": "docs/trip-editorial-guide.md",
      "heading": "### 9. Presupuesto (`costes`)"
    }
  },
  {
    "id": "BUD-08",
    "section": "costes",
    "requirement": "Tipo de cambio tiene fecha, fuente y no simula cotización vigente",
    "coverage": "partial",
    "source": {
      "file": "docs/trip-editorial-guide.md",
      "heading": "### 9. Presupuesto (`costes`)"
    },
    "evidence": {
      "file": "tests/editorial-relations.test.cjs",
      "contains": "divisas: gasto extranjero requiere tasa positiva"
    }
  },
  {
    "id": "BUD-09",
    "section": "costes",
    "requirement": "MXN realmente pagados prevalecen sobre conversión estimada",
    "coverage": "automated",
    "evidence": {
      "file": "tests/transport-budget.test.cjs",
      "contains": "pesos pagados prevalecen"
    },
    "source": {
      "file": "docs/trip-editorial-guide.md",
      "heading": "### 9. Presupuesto (`costes`)"
    }
  },
  {
    "id": "UI-03",
    "section": "transversal",
    "requirement": "Fotografías nítidas, a color y pertinentes al lugar real",
    "coverage": "manual",
    "source": {
      "file": "docs/trip-editorial-guide.md",
      "heading": "## Convenciones universales"
    }
  },
  {
    "id": "UI-04",
    "section": "transversal",
    "requirement": "Layout móvil evita desbordamiento y controla movimiento reducido",
    "coverage": "automated",
    "evidence": {
      "file": "tests/browser-smoke.cjs",
      "contains": "Reducir movimiento debe desactivar animación"
    },
    "source": {
      "file": "docs/trip-editorial-guide.md",
      "heading": "## Convenciones universales"
    }
  }
]);
