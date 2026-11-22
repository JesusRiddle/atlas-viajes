# Matriz de trazabilidad editorial del Atlas · ciclo de cierre

Fecha: 2026-11-21 · Rama `refactor/editorial-universal-contracts` · PR #23.

## Qué mide y qué NO mide

Se inventariaron **64 obligaciones** procedentes de las nueve secciones de la guía maestra y de sus requisitos transversales, enlazadas a su capítulo rector. Este documento acompaña al catálogo ejecutable `scripts/editorial-rule-catalog.cjs`; la suite `tests/editorial-rule-catalog.test.cjs` protege identidad, existencia de fuentes, nueve encabezados reales y evidencia de los checks declarados. **No se trata de una demostración de que cada frase normativa esté ya automatizada**, ni de una calificación porcentual de calidad.

- `automated`: existe evidencia de comprobación en el CI; aun así pueden faltar casos límite.
- `partial`: solo una parte del contrato está cubierta.
- `missing`: el contrato automatizable no tiene una prueba fiable.
- `manual`: exige investigación actual o juicio editorial; no debe presentarse como aprobación automática.

**Estado medido tras fase 2:** 20 con evidencia automatizada, 32 parciales, 4 sin prueba y 8 humanas/externas. Se completará esta lista cuando se encuentren nuevas obligaciones normativas; no fijar porcentajes de calidad a partir de estos recuentos.

## Inventario

| Identificador | Área | Obligación | Cobertura | Evidencia |
|---|---|---|---|---|
| `CAT-01` | transversal | IDs del catálogo únicos y viajes visibles | Automatizada (con evidencia) | `tests/browser-smoke.cjs` |
| `CAT-02` | transversal | Los viajes son independientes y no se bloquean por coincidencias de fecha | Automatizada (con evidencia) | `tests/editorial-relations.test.cjs` |
| `LIF-01` | transversal | Un viaje mínimo admite datos pendientes sin fabricarlos | Automatizada (con evidencia) | `tests/loader-regression.test.cjs` |
| `LIF-02` | transversal | Distinguir formalmente etapas incremental y editorialmente completo | Automatizada (con evidencia) | `tests/editorial-relations.test.cjs` |
| `NAV-01` | transversal | Nueve secciones y anclas en orden | Automatizada (con evidencia) | `tests/editorial-contracts.test.cjs` |
| `NAV-02` | transversal | Estilos y etiquetas visibles en español sin terminología prohibida | Parcial | `tests/browser-smoke.cjs` |
| `PAN-01` | plan | Tres indicadores Panorama con títulos y orden estables | Automatizada (con evidencia) | `tests/editorial-contracts.test.cjs` |
| `PAN-02` | plan | Tarjeta independiente Clima y luz con tres párrafos y tono correcto | Parcial | `tests/browser-smoke.cjs` |
| `PAN-03` | plan | Intro e introShort de longitud editorial; resaltados literales | Parcial | `tests/trip-editorial.test.cjs` |
| `PAN-04` | plan | Idioma con moneda ISO reconocida | Automatizada (con evidencia) | `tests/editorial-contracts.test.cjs` |
| `PAN-05` | plan | Correspondencia idioma, divisa y país del recorrido | Sin prueba | — |
| `PAN-06` | plan | Requisitos migratorios, enchufes y voltaje verificados por país y fechas | Externa / humana | — |
| `MAP-01` | mapa | Coordenadas dentro del rango geográfico y no ficticias | Parcial | `tests/editorial-relations.test.cjs` |
| `MAP-02` | mapa | Puntos de alojamiento vinculados a noches y etiquetas correctas | Parcial | `tests/map-stay-labels.test.cjs` |
| `MAP-03` | mapa | Puntos y orden del mapa sincronizados con itinerario vigente | Parcial | `tests/browser-smoke.cjs` |
| `SEA-01` | temporadas | Doce meses con estado válido y pendientes explícitos | Automatizada (con evidencia) | `tests/editorial-contracts.test.cjs` |
| `SEA-02` | temporadas | Temperaturas con semántica verificada y máxima/mínima sin invertir | Automatizada (con evidencia) | `tests/editorial-contracts.test.cjs` |
| `SEA-03` | temporadas | Exactitud de temporadas, luz y clima respecto a fuentes externas | Externa / humana | — |
| `EXP-01` | experiencias | Experiencias específicas sin relleno y extensión recomendada | Parcial | `tests/editorial-relations.test.cjs` |
| `EXP-02` | experiencias | Gastronomía y disponibilidad local contrastadas con fuentes | Externa / humana | — |
| `RES-01` | reservas | Grupos y enlaces de reserva con estructura válida | Parcial | `tests/editorial-relations.test.cjs` |
| `RES-02` | reservas | Estado confirmado/cotizado/estimado/pendiente no confundido | Parcial | `tests/transport-budget.test.cjs` |
| `RES-03` | reservas | Vigencia y destino correcto de enlaces oficiales de reserva | Externa / humana | — |
| `TRA-01` | traslados | Referencias diarias de transporte sin huérfanos | Automatizada (con evidencia) | `tests/editorial-relations.test.cjs` |
| `TRA-02` | traslados | Segmentos, escalas y cronología de viajes renderizados | Parcial | `tests/transport-budget.test.cjs` |
| `TRA-03` | traslados | Tarifa elegida cubre todos los tramos aplicables y no duplica presupuesto | Parcial | `tests/transport-budget.test.cjs` |
| `TRA-04` | traslados | Operador, horario, tarifa y fuente válidos para fecha de viaje | Externa / humana | — |
| `LOD-01` | alojamientos | Check-in/out y vínculo válido entre noches y alojamiento | Parcial | `tests/editorial-relations.test.cjs` |
| `LOD-02` | alojamientos | Todas las noches cubiertas, sin traslape ni pernocta fantasma | Parcial | `tests/editorial-relations.test.cjs` |
| `LOD-03` | alojamientos | Enlaces de mapa y reserva con formato válido | Parcial | `tests/editorial-relations.test.cjs` |
| `LOD-04` | alojamientos | Ubicación y disponibilidad real de hoteles y reservas | Externa / humana | — |
| `DAY-01` | dias | Jornadas consecutivas, límites y referencias de alojamiento | Automatizada (con evidencia) | `tests/editorial-relations.test.cjs` |
| `DAY-02` | dias | Numeración consecutiva sin saltos ni duplicados | Automatizada (con evidencia) | `tests/editorial-relations.test.cjs` |
| `DAY-03` | dias | Campos de mañana/tarde/noche y tips/movilidad con sintaxis editorial | Parcial | `tests/loader-regression.test.cjs` |
| `DAY-04` | dias | Fotografías de actividades y portada referenciadas correctamente | Automatizada (con evidencia) | `tests/editorial-relations.test.cjs` |
| `DAY-05` | dias | Créditos, pies de 15–30 palabras y fuentes fotográficas por origen | Parcial | `tests/loader-regression.test.cjs` |
| `DAY-06` | dias | Aperturas, recorridos y tiempos locales verificables | Externa / humana | — |
| `BUD-01` | costes | Gastos únicos, importes no negativos y divisas ISO válidas | Automatizada (con evidencia) | `tests/editorial-relations.test.cjs` |
| `BUD-02` | costes | Subtotal conciliado y alternativas no contabilizadas dos veces | Parcial | `tests/transport-budget.test.cjs` |
| `BUD-03` | costes | Desglose por día, hotel y transporte coherente con ledger | Parcial | `tests/transport-budget.test.cjs` |
| `BUD-04` | costes | Equivalencia MXN inmediata y tipo de cambio fechado con fuente | Parcial | `tests/editorial-relations.test.cjs` |
| `BUD-05` | costes | Viajeros por presupuesto y cálculo por persona sin asumir uno | Parcial | `tests/home-comparison.test.cjs` |
| `BUD-06` | costes | Importe pendiente null distinto de cero conocido en todas las vistas | Parcial | `tests/transport-budget.test.cjs` |
| `UI-01` | transversal | Sin NaN, undefined, overflow y anclas rotas escritorio/móvil | Automatizada (con evidencia) | `tests/browser-smoke.cjs` |
| `UI-02` | transversal | Auditoría editorial de navegador incluida en CI normal | Automatizada (con evidencia) | `.github/workflows/atlas-checks.yml` |
| `CAT-03` | transversal | No modificar JSON de otros viajes ni ideas históricas durante una edición aislada | Sin prueba | — |
| `PAN-07` | plan | introHighlights son nombres presentes literalmente en intro | Parcial | `tests/trip-editorial.test.cjs` |
| `PAN-08` | plan | Texto intro no incluye información de compras, precios ni reglas administrativas | Parcial | `tests/trip-editorial.test.cjs` |
| `MAP-04` | mapa | Nombre principal en negrita y calificadores sin negrita en la vista | Automatizada (con evidencia) | `tests/browser-smoke.cjs` |
| `SEA-04` | temporadas | Color de Clima y luz idéntico al estado de mes seleccionado | Parcial | `tests/browser-smoke.cjs` |
| `EXP-03` | experiencias | Descripción de experiencias 18–35 palabras, salvo ampliaciones justificadas | Sin prueba | — |
| `RES-04` | reservas | Título fijo Reservaciones importantes y grupos de prioridad visibles | Parcial | `tests/browser-smoke.cjs` |
| `TRA-05` | traslados | Enlaces de abordaje y paradas actuales accesibles por jornada | Parcial | `tests/editorial-relations.test.cjs` |
| `TRA-06` | traslados | Tarifa pendiente conserva null; no se inventa un costo cero | Parcial | `tests/transport-budget.test.cjs` |
| `LOD-05` | alojamientos | Resumen X noches, Y alojamientos con plural y fuentes dinámicas | Parcial | `tests/browser-smoke.cjs` |
| `LOD-06` | alojamientos | Candidato o cotizado no aparece como reservado en texto o presupuesto | Sin prueba | — |
| `DAY-07` | dias | Cada pie de fotografía vigente contiene 15–30 palabras concretas | Parcial | `tests/loader-regression.test.cjs` |
| `DAY-08` | dias | Fotos externas directas HTTPS y autor/licencia según procedencia | Parcial | `tests/loader-regression.test.cjs` |
| `DAY-09` | dias | Días parciales se renderizan sin bloquear todo el itinerario | Automatizada (con evidencia) | `tests/loader-regression.test.cjs` |
| `BUD-07` | costes | Portada y Panorama usan proyección dinámica del ledger actual | Parcial | `tests/format-budget-contract.test.cjs` |
| `BUD-08` | costes | Tipo de cambio tiene fecha, fuente y no simula cotización vigente | Parcial | `tests/editorial-relations.test.cjs` |
| `BUD-09` | costes | MXN realmente pagados prevalecen sobre conversión estimada | Automatizada (con evidencia) | `tests/transport-budget.test.cjs` |
| `UI-03` | transversal | Fotografías nítidas, a color y pertinentes al lugar real | Externa / humana | — |
| `UI-04` | transversal | Layout móvil evita desbordamiento y controla movimiento reducido | Automatizada (con evidencia) | `tests/browser-smoke.cjs` |

## Brechas prioritarias (siguientes fases)

1. **Completitud/flujo:** distinguir viaje mínimo, sección parcialmente preparada y viaje editorialmente cerrado sin suposiciones. No bloquear un borrador por carecer de actividades, ni aprobar un viaje terminado con noches sin alojamientos. Probar que una edición de un viaje no altera los demás.
2. **Integridad calendario-alojamiento:** exigir numeración sucesiva; noches contiguas, cubiertas y sin doble estancia; coordenadas geográficas posibles y referenciadas; sincronización con noches, presupuesto y mapas, incluyendo el caso de último día sin hotel.
3. **Compra y logística:** validar estado real de las reservas y hoteles, opciones de tarifa elegibles y tramos de ida/vuelta sin horas ficticias; límites entre `null` pendiente y `0` verdadero; enlaces de abordaje y tarjetas visibles.
4. **Monedas y finanzas:** reconciliar un único presupuesto por alternativas excluyentes, origen/moneda/cantidad de personas, conversión MXN con tasa, fecha y fuente; no congelar importes por viaje ni confundir moneda ISO válida con la moneda del destino.
5. **Narrativa y fotos:** automatizar lo mecánico de experiencias, captions, créditos y políticas HTTPS respetando distinción entre fotos externas nuevas y originales aportadas; comprobar actualidad, autenticidad, color y gastronomía mediante revisión humana.
6. **Refactor restante:** los tests de Colombia/Italia/Suiza/Patagonia aún contienen snapshots; reemplazarlos por fixtures mutables y pruebas adversariales antes de retirarlos. `browser-smoke.cjs` ya tiene chequeos dinámicos, pero eso no constituye una prueba integral de todos los estados.

## Puertas de aceptación

Cada contrato automatizable necesita pruebas positivas, negativas, y de límites; debe especificar si rige a viajes parciales o cerrados. Las reglas DOM deben verificarse en escritorio y móvil; las reglas con fuentes externas deben aportar una checklist explícita sin falso verde. La suite debe demostrar que modificar fechas, tarifas, hoteles, excursiones y vuelos **coherentemente** sigue pasando, pero una inconsistencia editorial no. **Solo entonces** cabe recomendar merge por cumplimiento del objetivo del usuario.

## Cambios de fase 1

Se creó la matriz ejecutable y la prueba de conservación de evidencias y capítulos. Se corrigieron tres separadores literales `\\n\\n` incrustados en la guía, incluido uno que ocultaba la sección cuatro, «Experiencias», como encabezado Markdown. El contenido turístico y los JSON de itinerarios no se modificaron. La cobertura sustantiva faltante es trabajo de fases 2–5.

## Fase 2 — validadores ampliados

Se ampliaron `scripts/editorial-relations.cjs` y sus fixtures, sin incluir ningún ID de destino o tarifa fija. Las reglas ahora cubren números de jornada consecutivos, viajeros positivos, calendarios completos, noches de hotel asignadas y excepciones explícitas para vuelos nocturnos/campamentos, coordenadas válidas y órdenes únicos del mapa, estados de reserva/gastos reconocidos, grupos de reserva únicos, tipos de cambio positivos respaldados por fuente fechada cuando existen gastos extranjeros, experiencias con ciudad/descrición y enlaces de movilidad/abordaje bien formados.

**Compatibilidad deliberada:** `mode: 'incremental'` permite días sin número o puntos aún sin georreferenciar. `mode: 'complete'` exige fechas de hotel, total de viajeros, orden numérico y noches justificadas. Los hoteles alternativos simultáneos son candidatos excluyentes; no se presume que todos estén reservados. Los días de salida internacional pueden ser noches de vuelo sin alojamiento. Los puntos del mapa no deben estar ordenados físicamente en el array, pero sus valores `order` han de ser únicos y consecutivos.

**Pruebas adversariales añadidas:** numeración con saltos, viaje cerrado sin jornadas, viajeros negativos, hotel sin check-in, día nocturno sin hotel, campamento explícito, coordenadas 999°, orden de mapa duplicado, grupo de reservas vacío o repetido, estados inválidos, gasto EUR sin tasa/fecha/fuente, tarifa cero frente a pendiente, enlaces de tren y paradas inválidos; añadir una visita, cambiar el hotel, ampliar una noche coherentemente o compartir fechas entre viajes debe seguir pasando.

**Límites todavía abiertos y no maquillados:** las cuatro reglas `PAN-05`, `CAT-03`, `EXP-03`, `LOD-06` permanecen sin validación suficiente; otras 32 siguen siendo parciales. La pertinencia real de países/divisas, licencias fotográficas, disponibilidad de hoteles, tarifas vigentes y la veracidad del lenguaje comercial necesitan datos adicionales o revisión humana. La migración de los tests rígidos de destinos y las pruebas de mutación amplias corresponden a las siguientes fases.

No se modificaron JSON de itinerarios ni se hizo merge.

## Fase 3 — sustitución de snapshots por invariantes compartidas

Se eliminaron **dos archivos exclusivos de destinos**: `tests/colombia-2027.test.cjs` (284 líneas) y `tests/patagonia-regression.test.cjs` (98 líneas). Se depuró `tests/trip-editorial.test.cjs` de 272 a 120 líneas y `tests/loader-regression.test.cjs` de 788 a 492, preservando pruebas de compatibilidad, navegación y renderizado que no tenían sustituto equivalente.

**Sustitución ejecutable:** `tests/dynamic-trip-regressions.test.cjs` revisa los nueve viajes activos sin fijar fechas, hoteles, importes, proveedores o cantidades de actividades. Verifica noches realmente asignadas frente al intervalo de cada alojamiento elegido (sin contar alternativas simultáneas), referencias de transporte y hoteles, conexiones de segmentos, rutas de presupuesto indirectas hasta su partida o agrupador tarifario, ciclos huérfanos, totales diarios cuando el viaje los declara, fotos vigentes e imágenes locales existentes. Los servicios todavía pendientes (`price: null`) no se convierten artificialmente en gastos cero.

**Decisión de calidad:** `tests/transport-budget.test.cjs` conserva ejemplos con números, operadores y horarios concretos porque **usa `tests/fixtures/transport-regression.json`**, un escenario sintético estable de integración, no los JSON vivos de ningún viaje. Cambiar un hotel, precio, vuelo o excursión real no altera esos fixtures. El objetivo no es prohibir cantidades en tests, sino prohibir snapshots cambiantes de itinerarios reales.

**Cobertura que permanece intencionalmente parcial:** autenticidad y metadatos de ciertas fotos externas de España/Portugal y Patagonia, precisión y fuentes de información turística, conciliación universal de todos los estados financieros, transportes en escenario alternativo y validación de frases de la guía para viajes históricos. Hay pruebas funcionales con ejemplos reales de Italia y Suiza que aún conviene convertir a fixtures sintéticos en fase 4 si se pretende tolerar incluso la eliminación completa de esos viajes del catálogo.

**Validación:** el CI completo debe mantenerse verde para cerrar esta fase. La fase 4 está dedicada a mutaciones y a demostrar con cambios consistentes de un viaje real en memoria que las aserciones supervivientes no producen falsos positivos. No se cambiaron JSON de viajes ni se realizó merge.
