# Matriz única de obligaciones editoriales · Atlas

Fecha: 2026-11-21 · PR #23, rama `refactor/editorial-universal-contracts`.

## Alcance y significado

Este inventario inicial agrupa **45 obligaciones explícitas** reconocidas en la guía. No constituye todavía un inventario exhaustivo de todas sus frases y casos condicionales. La fuente ejecutable de estas filas es `scripts/editorial-rule-catalog.cjs`, y `tests/editorial-rule-catalog.test.cjs` comprueba unicidad, secciones, fuentes y existencia de pruebas declaradas. **Existencia de un test NO demuestra que ese contrato ya cubra todos los casos límite.**

- **Automatizada:** hay una comprobación concreta en el CI, pero puede ser incompleta para el escenario integral.
- **Parcial:** hay evidencia de prueba de una parte, faltan condiciones o mutaciones.
- **Sin contrato:** no hay prueba confiable para la regla; debe implementarse.
- **Verificación humana/externa:** depende de datos actuales o juicio editorial, no se puede declarar automáticamente aprobada con JSON local.

Conteo del inventario: **45 reglas**, **13 automatizadas con evidencia**, **18 parciales**, **7 sin contrato**, **7 humanas/externas**. Estos números describen estado de implementación, **no porcentaje certificado de cumplimiento editorial**.

## Inventario por sección

| ID | Área | Contrato | Estado | Evidencia |
|---|---|---|---|---|
| `CAT-01` | transversal | IDs del catálogo únicos y viajes visibles | Automatizada (evidencia en CI) | `tests/browser-smoke.cjs` |
| `CAT-02` | transversal | Los viajes son independientes y no se bloquean por coincidencias de fecha | Sin contrato | — |
| `LIF-01` | transversal | Un viaje mínimo admite datos pendientes sin fabricarlos | Automatizada (evidencia en CI) | `tests/loader-regression.test.cjs` |
| `LIF-02` | transversal | Distinguir formalmente etapas incremental y editorialmente completo | Sin contrato | — |
| `NAV-01` | transversal | Nueve secciones y anclas en orden | Automatizada (evidencia en CI) | `tests/editorial-contracts.test.cjs` |
| `NAV-02` | transversal | Estilos y etiquetas visibles en español sin terminología prohibida | Parcial | `tests/browser-smoke.cjs` |
| `PAN-01` | plan | Tres indicadores Panorama con títulos y orden estables | Automatizada (evidencia en CI) | `tests/editorial-contracts.test.cjs` |
| `PAN-02` | plan | Tarjeta independiente Clima y luz con tres párrafos y tono correcto | Parcial | `tests/browser-smoke.cjs` |
| `PAN-03` | plan | Intro e introShort de longitud editorial; resaltados literales | Parcial | `tests/trip-editorial.test.cjs` |
| `PAN-04` | plan | Idioma con moneda ISO reconocida | Automatizada (evidencia en CI) | `tests/editorial-contracts.test.cjs` |
| `PAN-05` | plan | Correspondencia idioma, divisa y país del recorrido | Sin contrato | — |
| `PAN-06` | plan | Requisitos migratorios, enchufes y voltaje verificados por país y fechas | Verificación humana/externa | — |
| `MAP-01` | mapa | Coordenadas dentro del rango geográfico y no ficticias | Sin contrato | — |
| `MAP-02` | mapa | Puntos de alojamiento vinculados a noches y etiquetas correctas | Parcial | `tests/map-stay-labels.test.cjs` |
| `MAP-03` | mapa | Puntos y orden del mapa sincronizados con itinerario vigente | Parcial | `tests/browser-smoke.cjs` |
| `SEA-01` | temporadas | Doce meses con estado válido y pendientes explícitos | Automatizada (evidencia en CI) | `tests/editorial-contracts.test.cjs` |
| `SEA-02` | temporadas | Temperaturas con semántica verificada y máxima/mínima sin invertir | Automatizada (evidencia en CI) | `tests/editorial-contracts.test.cjs` |
| `SEA-03` | temporadas | Exactitud de temporadas, luz y clima respecto a fuentes externas | Verificación humana/externa | — |
| `EXP-01` | experiencias | Experiencias específicas sin relleno y extensión recomendada | Sin contrato | — |
| `EXP-02` | experiencias | Gastronomía y disponibilidad local contrastadas con fuentes | Verificación humana/externa | — |
| `RES-01` | reservas | Grupos y enlaces de reserva con estructura válida | Parcial | `tests/editorial-relations.test.cjs` |
| `RES-02` | reservas | Estado confirmado/cotizado/estimado/pendiente no confundido | Parcial | `tests/transport-budget.test.cjs` |
| `RES-03` | reservas | Vigencia y destino correcto de enlaces oficiales de reserva | Verificación humana/externa | — |
| `TRA-01` | traslados | Referencias diarias de transporte sin huérfanos | Automatizada (evidencia en CI) | `tests/editorial-relations.test.cjs` |
| `TRA-02` | traslados | Segmentos, escalas y cronología de viajes renderizados | Parcial | `tests/transport-budget.test.cjs` |
| `TRA-03` | traslados | Tarifa elegida cubre todos los tramos aplicables y no duplica presupuesto | Parcial | `tests/transport-budget.test.cjs` |
| `TRA-04` | traslados | Operador, horario, tarifa y fuente válidos para fecha de viaje | Verificación humana/externa | — |
| `LOD-01` | alojamientos | Check-in/out y vínculo válido entre noches y alojamiento | Parcial | `tests/editorial-relations.test.cjs` |
| `LOD-02` | alojamientos | Todas las noches cubiertas, sin traslape ni pernocta fantasma | Parcial | `tests/patagonia-regression.test.cjs` |
| `LOD-03` | alojamientos | Enlaces de mapa y reserva con formato válido | Parcial | `tests/editorial-relations.test.cjs` |
| `LOD-04` | alojamientos | Ubicación y disponibilidad real de hoteles y reservas | Verificación humana/externa | — |
| `DAY-01` | dias | Jornadas consecutivas, límites y referencias de alojamiento | Automatizada (evidencia en CI) | `tests/editorial-relations.test.cjs` |
| `DAY-02` | dias | Numeración consecutiva sin saltos ni duplicados | Sin contrato | — |
| `DAY-03` | dias | Campos de mañana/tarde/noche y tips/movilidad con sintaxis editorial | Parcial | `tests/loader-regression.test.cjs` |
| `DAY-04` | dias | Fotografías de actividades y portada referenciadas correctamente | Automatizada (evidencia en CI) | `tests/editorial-relations.test.cjs` |
| `DAY-05` | dias | Créditos, pies de 15–30 palabras y fuentes fotográficas por origen | Parcial | `tests/loader-regression.test.cjs` |
| `DAY-06` | dias | Aperturas, recorridos y tiempos locales verificables | Verificación humana/externa | — |
| `BUD-01` | costes | Gastos únicos, importes no negativos y divisas ISO válidas | Automatizada (evidencia en CI) | `tests/editorial-relations.test.cjs` |
| `BUD-02` | costes | Subtotal conciliado y alternativas no contabilizadas dos veces | Parcial | `tests/transport-budget.test.cjs` |
| `BUD-03` | costes | Desglose por día, hotel y transporte coherente con ledger | Parcial | `tests/transport-budget.test.cjs` |
| `BUD-04` | costes | Equivalencia MXN inmediata y tipo de cambio fechado con fuente | Sin contrato | — |
| `BUD-05` | costes | Viajeros por presupuesto y cálculo por persona sin asumir uno | Parcial | `tests/home-comparison.test.cjs` |
| `BUD-06` | costes | Importe pendiente null distinto de cero conocido en todas las vistas | Parcial | `tests/transport-budget.test.cjs` |
| `UI-01` | transversal | Sin NaN, undefined, overflow y anclas rotas escritorio/móvil | Automatizada (evidencia en CI) | `tests/browser-smoke.cjs` |
| `UI-02` | transversal | Auditoría editorial de navegador incluida en CI normal | Automatizada (evidencia en CI) | `.github/workflows/atlas-checks.yml` |

## Brechas objetivas de la próxima fase

1. **Nivel de completitud:** declarar por campo cuándo un viaje está incremental, parcialmente redactado o editorialmente cerrado, y evitar tratar una sección de un viaje recién creado como una sección vacía inválida. No inferir completitud de la presencia de un array.
2. **Calendario:** detectar secuencia numérica de días, cobertura total de noches, alojamiento faltante, estancias traslapadas, cambios de fechas no propagados a gastos y reservas; validar escenarios de ida y regreso sin pernocta fantasma.
3. **Mapa:** comprobar coordenadas reales dentro de rangos, duplicación indebida, orden del recorrido, conexiones de noche y etiquetas de estancia. La mera longitud dos de un array no valida geografía.
4. **Reserva/movilidad:** estados verdaderos `pending/quoted/estimated/confirmed`, tramos/horarios/zonas, elegibilidad de tarifas y vigencia; controles algebraicos de un solo escenario económico, no snapshots de operadores.
5. **Finanzas:** conciliación de presupuesto sin doble sumas, importes conocidos `0` frente a desconocidos `null`, conversión con fuente/fecha, base de precio por persona y moneda geográfica.
6. **Prosa/fotos/experiencias:** exigencias mecánicas de extensiones, formatos, referencias y créditos con excepciones apropiadas para foto propia. Evaluación de autenticidad, color, exactitud histórica y gastronomía queda humana.
7. **Suite específica:** convertir los tests que aún fijan Colombia, Italia, Suiza o Patagonia en fixtures dinámicos antes de retirar los antiguos. Recalcular salidas desde entradas mutables y exigir invariantes del DOM, no totales del año pasado.

## Criterios de cierre para las siguientes fases

Cada regla automatizable debe tener **validez positiva y negativa**, pruebas de bordes y una explicación documentada del comportamiento incremental. Cada regla de presentación requiere comprobación DOM en escritorio y móvil. El CI debe ejecutar la matriz y demostrar que cambios coherentes de fecha, tarifa, hotel, actividad y ruta no provocan falsos errores. Las obligaciones humanas deben figurar en la checklist con responsable/fuente y **no contar como aprobación automatizada**. El alcance editorial real se decidirá contra esta matriz **y** la guía fuente, no solo por color verde de Actions.

## Cambios de esta fase

- Se creó inventario ejecutable de obligaciones enlazado a la sección normativa y, cuando existe, a una prueba comprobable.
- Se añadió un test de integridad de matriz, fuentes y nueve encabezados oficiales de la guía.
- Se corrigieron tres párrafos de la guía que tenían saltos `\\n\\n` literales; uno ocultaba el encabezado de «4. Experiencias» como línea independiente.
- No se han modificado itinerarios, presupuestos, vuelos, hoteles ni actividades. Las fases de implementación, mutación y CI integral definitivo siguen pendientes.
