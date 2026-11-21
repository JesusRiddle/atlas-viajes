# Auditoría de minimalismo editorial · Ronda 3 · Fase 1

Fecha: 2026-11-21. Rama: `refactor/editorial-universal-contracts` (PR #23 abierto). **Esta fase solo clasifica; no borra tests ni cambia itinerarios.**

## Criterio

- **K — Conservar:** verifica funcionalidad compartida, cálculo, accesibilidad/presentación o estado pendiente mediante fixtures, sin inmovilizar datos turísticos.
- **G — Generalizar:** mezcla una regla valiosa con fechas, destinos, hoteles, vuelos, precios, imágenes o cantidades concretas. Extraer la regla y aplicarla a todos los viajes relevantes; preservar primero la detección de fallos.
- **R — Retirar tras equivalencia:** snapshots/auditorías de contenido dependientes de una decisión puntual o redundantes con otro contrato. Exigir un reemplazo probado antes de borrarlos.

Las etiquetas se asignan **al caso completo**; los casos G pueden contener aserciones K que deben rescatarse. Un K no significa que su implementación actual sea perfecta, sino que la intención merece permanecer. La auditoría es de riesgo de mantenimiento, no una medición de cobertura.

## Inventario completo de casos Node

### `tests/colombia-2027.test.cjs` (316 líneas; 4 casos)

| # | Caso actual | Decisión |
|---:|---|:---:|
| 1 | Colombia: itinerario consecutivo, noches y alojamientos sin duplicación | **G** |
| 2 | Colombia: vuelos válidos, referencias y fechas sin doble contabilizar | **G** |
| 3 | Colombia: temperaturas con fuentes, indicadores y fotografías | **G** |
| 4 | Colombia: auditoría D final de 27 imágenes, portada, créditos y visitas opcionales | **R** |

### `tests/patagonia-regression.test.cjs` (157 líneas; 10 casos)

| # | Caso actual | Decisión |
|---:|---|:---:|
| 1 | Patagonia: 15 días correlativos y 14 noches sin solapamientos | **G** |
| 2 | Patagonia: costos estimados coherentes y referencias históricas explícitas | **G** |
| 3 | Patagonia: todas las imágenes y hoteles referenciados existen | **G** |
| 4 | Patagonia: nueve secciones con datos editoriales verificables | **G** |
| 5 | Patagonia: distribución presupuestaria sin partidas duplicadas | **G** |
| 6 | Patagonia: los gastos por día coinciden con el presupuesto sin duplicarlo | **G** |
| 7 | Patagonia: los cuatro transportes renderizan y no duplican presupuesto | **G** |
| 8 | Patagonia: escenario por persona y alojamientos vinculados con el ledger | **G** |
| 9 | Patagonia: tipo de cambio fechado y escenarios de autobús sin doble conteo | **G** |
| 10 | El estándar presupuestario declara viajeros para los cuatro viajes nuevos | **G** |

### `tests/trip-editorial.test.cjs` (361 líneas; 20 casos)

| # | Caso actual | Decisión |
|---:|---|:---:|
| 1 | existen instrucciones editoriales y están enlazadas desde README y AGENTS | **K** |
| 2 | el viaje Italia 2027 mantiene introducción turística con resaltados existentes | **G** |
| 3 | los indicadores prácticos del viaje incluyen etiquetas y tonos válidos | **G** |
| 4 | reservaciones importantes de Italia 2027 tienen grupos, prioridad y enlaces oficiales | **G** |
| 5 | Italia 2027: fechas, noches y viajes de ida y vuelta coherentes | **G** |
| 6 | Italia 2027 mantiene vuelos cotizados y trenes futuros sin precios inventados | **G** |
| 7 | Italia 2027: tres hoteles principales y presupuesto distribuido | **G** |
| 8 | Italia 2027: traslados y gastos de vuelos sin duplicados | **G** |
| 9 | Italia 2027: regreso 21 mayo y distribución equilibrada de bases | **G** |
| 10 | Italia 2027: distribución por fechas y visitas críticas coherentes | **G** |
| 11 | Italia 2027 incluye requisitos de entrada y guía universal para futuros viajes | **G** |
| 12 | Italia 2027: fechas de hotel y traslados concuerdan con el día a día | **G** |
| 13 | reglas editoriales: fines de semana flexibles y redistribución de días | **K** |
| 14 | un viaje borrador presenta días completos con las tarjetas del itinerario maestro | **K** |
| 15 | día por día enlaza cada noche al alojamiento correcto y muestra check-in solo al llegar | **K** |
| 16 | las actividades numeradas no repiten número dentro del texto | **K** |
| 17 | Italia 2027: todas las galerías tienen imágenes referenciadas | **G** |
| 18 | documentación resalta palabras completas y presenta ETIAS como enlace seguro | **K** |
| 19 | Italia mayo 2027: reservas, gastos, mapa y enlaces quedan sincronizados con la ruta | **G** |
| 20 | Italia mayo 2027: evita regresiones de fechas ocultas y enlaces ferroviarios desaconsejados | **G** |

### `tests/loader-regression.test.cjs` (889 líneas; 30 casos)

| # | Caso actual | Decisión |
|---:|---|:---:|
| 1 | todos los viajes activos conservan estructura y archivos JSON válidos | **K** |
| 2 | Suiza verde mantiene fechas, ruta y estados sin afirmar compras | **G** |
| 3 | coexisten viajes con hoteles estructurados y viajes heredados con stays | **K** |
| 4 | el loader normaliza un viaje mínimo sin alterar Italia Norte 2027 | **K** |
| 5 | el loader permite stays ausente y rechaza colecciones de tipo incorrecto | **K** |
| 6 | la limpieza de la vista de viaje es segura y repetible al navegar | **K** |
| 7 | plantilla universal: identidad mínima, estados pendientes y meses completos | **K** |
| 8 | un viaje mínimo comparte encabezado, navegación y nueve anclas del modelo maestro | **K** |
| 9 | Panorama incremental utiliza los contenedores maestros sin inventar presupuesto | **K** |
| 10 | Temporadas renderiza los doce meses con pendientes y valores conocidos | **K** |
| 11 | Experiencias vacías o parciales mantienen el panel maestro sin inventar destinos | **K** |
| 12 | reservaciones y alojamientos admiten registros vacíos y parciales | **K** |
| 13 | la composición mínima presenta reservaciones, traslados y hoteles con sus anclas maestras | **K** |
| 14 | el mapa no ofrece botones de localidad sin coordenadas válidas | **K** |
| 15 | Día por día y Presupuesto muestran pendientes sin totales ficticios | **K** |
| 16 | el alta mínima es visible de inmediato y conserva los viajes históricos | **K** |
| 17 | Colombia y Suiza siguen el orden cronológico y España + Portugal conserva su contenido completo | **G** |
| 18 | Panorama editorial de los seis viajes desarrollados: tres indicadores y clima independiente | **G** |
| 19 | Suiza nevada: contratos editoriales de temporadas, días y fotografías | **G** |
| 20 | Suiza nevada: diez noches, fotografías válidas y presupuesto individual sin duplicación | **G** |
| 21 | paso 15: template universal preserva información parcial, cero y falso sin mutar origen | **K** |
| 22 | paso 15: un viaje nuevo completo no pierde datos estructurados al cargar | **K** |
| 23 | portadas de viajes planificados requieren subtítulo editorial específico | **K** |
| 24 | pie Fuentes y reservas solo se agrega en viajes heredados | **K** |
| 25 | transportes de viajes nuevos validan tarifas y no bloquean la vista si falta una | **G** |
| 26 | Suiza verde: Panorama sin undefined, clima de montaña y luz comprobados | **G** |
| 27 | Suiza Verde: 16 jornadas y fichas de movilidad visibles sin horarios inventados | **G** |
| 28 | Suiza Verde: Panorama definitivo congruente, sin totales ficticios | **G** |
| 29 | Suiza Verde: presupuesto integral concilia sin duplicar vuelos ni pases | **G** |
| 30 | Suiza Verde: fotografías estivales, portada, galerías y créditos completos | **G** |

### `tests/transport-budget.test.cjs` (410 líneas; 32 casos)

| # | Caso actual | Decisión |
|---:|---|:---:|
| 1 | JSON de escenario histórico aislado sin referencias de transporte inválidas | **K** |
| 2 | zona horaria, escala y duración completas | **K** |
| 3 | fecha sin zona horaria y conexión negativa se rechazan | **K** |
| 4 | equipaje desconocido se permite pero datos imposibles no | **K** |
| 5 | seleccionar alternativa recalcula sin mutar el JSON | **K** |
| 6 | solo se suma una tarifa por transporte, no las alternativas | **K** |
| 7 | sin tipo de cambio EUR no se inventa una conversión | **K** |
| 8 | no duplica vuelos redondos referenciados en días 1 y 12 | **K** |
| 9 | distribución hotelera por noche preserva el importe | **K** |
| 10 | cambiar Frecciarossa por Italo modifica solo el tren seleccionado y el total | **K** |
| 11 | pesos pagados prevalecen sobre divisas y el tipo de cambio de referencia | **K** |
| 12 | los alojamientos se cuentan una sola vez y se distribuyen por sus noches | **K** |
| 13 | las cotizaciones incompletas no se interpretan como costos cero | **K** |
| 14 | el rango preliminar no se suma al subtotal conocido | **K** |
| 15 | vuelos Iberia: cuatro segmentos completos, escalas y tres tarifas | **G** |
| 16 | cambio de tarifa de vuelo actualiza presupuesto sin sumar tarifas alternativas | **K** |
| 17 | los días muestran el transporte vinculado y siguen el selector Frecciarossa/Italo | **K** |
| 18 | Traslados principales muestra trenes en timeline y distingue el regreso de una escala | **K** |
| 19 | Traslados principales muestra cronologías de ida y regreso con sus números de vuelo | **K** |
| 20 | referencias diarias de vuelos muestran solo el sentido correcto | **K** |
| 21 | los vuelos muestran +1/+2 solo al llegar en días locales posteriores a la salida inicial | **K** |
| 22 | cinco excursiones muestran ambos tramos desde los datos estructurados | **G** |
| 23 | operadores y números de servicio sobreviven a la integración diaria | **K** |
| 24 | trenes referenciados se asignan al día sin duplicar el subtotal global | **K** |
| 25 | presupuesto diario responde al cambio de tren sin modificar los alojamientos | **K** |
| 26 | tarjeta diaria presenta partidas registradas, no inventa comidas ni asigna vuelos redondos | **K** |
| 27 | días sin cotización no se presentan como gasto cero y las notas son contextuales | **G** |
| 28 | el desglose nuevo excluye opcionales y conserva exactamente las entradas de Firenze | **G** |
| 29 | el JSON carece de presupuestos históricos duplicados y etiqueta importes diarios | **G** |
| 30 | JSON modular sin resúmenes ferroviarios ni notas cambiarias heredadas | **G** |
| 31 | limpieza preserva las once noches y el presupuesto de referencia | **G** |
| 32 | Iberia: terminal IB1238 pendiente y condiciones no presentadas como confirmadas | **G** |

### `tests/format-budget-contract.test.cjs` (37 líneas; 2 casos)

| # | Caso actual | Decisión |
|---:|---|:---:|
| 1 | structured expenses remain eligible and use the calculated ledger amount | **K** |
| 2 | legacy budget ranges remain eligible and render independently of structured totals | **K** |

### `tests/home-comparison.test.cjs` (48 líneas; 3 casos)

| # | Caso actual | Decisión |
|---:|---|:---:|
| 1 | la comparativa traduce climas codificados y ritmos | **K** |
| 2 | el clima ausente tiene una etiqueta legible | **K** |
| 3 | la cabecera conserva ocho columnas, sin fusionar Alojamientos y Ritmo | **K** |

### `tests/map-stay-labels.test.cjs` (45 líneas; 2 casos)

| # | Caso actual | Decisión |
|---:|---|:---:|
| 1 | Colombia: todos los puntos de alojamiento resuelven sus noches | **G** |
| 2 | El mapa no convierte una estancia desconocida en Base ni en Excursión | **K** |

### `tests/new-trip.test.cjs` (115 líneas; 2 casos)

| # | Caso actual | Decisión |
|---:|---|:---:|
| 1 | crear un viaje genera JSON, bitácora y registro sin sobrescribir originales | **K** |
| 2 | alta incremental conserva los datos y normaliza campos pendientes | **K** |

### `tests/trip-production-workflow.test.cjs` (66 líneas; 3 casos)

| # | Caso actual | Decisión |
|---:|---|:---:|
| 1 | Atlas: plantilla de seguimiento incluye 14 etapas consecutivas y cuatro auditorías | **K** |
| 2 | Atlas: guía, estándar, agente y checklist comparten el procedimiento | **K** |
| 3 | Atlas: nueve secciones se llenan según dependencias, no en orden visual | **K** |

### `tests/editorial-contracts.test.cjs` (137 líneas; 8 casos)

| # | Caso actual | Decisión |
|---:|---|:---:|
| 1 | temperatura explícita: máxima izquierda, mínima derecha y negativos correctos | **K** |
| 2 | intervalos históricos conservan significado sin inventar mínimos nocturnos | **K** |
| 3 | doce meses: pendientes legítimos y evaluados con intervalos válidos | **K** |
| 4 | indicadores de Panorama: orden, moneda ISO y borrador incremental | **K** |
| 5 | un nuevo viaje parcial no exige secciones ya completadas | **K** |
| 6 | nueve secciones maestras en el orden establecido | **K** |
| 7 | Temporadas presenta rangos sin atribuir mínimas nocturnas inexistentes | **K** |
| 8 | contratos se aplican a los nueve viajes principales sin exigir datos de ideas históricas | **K** |

**Totales Node:** 116 casos = **68 K**, **47 G**, **1 R**. Las proporciones no equivalen a líneas eliminables: una sola prueba puede incluir decenas de aserciones.

## Browser smoke: grupos independientes de tests Node

El script `tests/browser-smoke.cjs` no declara casos `test()`: sus 826 líneas y 301 ocurrencias de `assert` se ejecutan en dos viewports. Clasificación por bloques:

| Grupo | Decisión | Justificación |
|---|:---:|---|
| Carga de portada, navegación, catálogo dinámico y nueve anclas | K | Invariantes de UI independientes de número de viajes |
| Errores JS, overflow responsive, hoteles/mapa, etiquetas y temperaturas | K | Contratos editoriales visibles; deben usar reglas y no valores fijos |
| Animaciones de portada, imagen y CSS al píxel / texto exacto de una fecha | G | Probar resultado funcional y preferencias de movimiento, no implementación o itinerario |
| Bloques `if (id === 'orlando-2026')`, `colombia-2027`, `suiza-nevada-2027`, `patagonia-argentina-2027` | R/G | Cifras, cantidades y vuelos concretos se retiran tras reemplazos; conservar comprobaciones de coherencia real |
| Verificaciones fijas de una selección de viajes, datos históricos y precios | R/G | Sustituir por iteración sobre catálogo y contratos, sin borrar casos límite únicos |
| `ATLAS_EDITORIAL_AUDIT=1` | G | Auditar reglas editoriales profundas, no congelar decisiones de itinerario |

## Qué retirar primero y qué proteger

**Candidatos prioritarios a sustitución:** importes exactos (Colombia `50381`, Patagonia `144948`, Suiza `81981`, Italia `20113.46`); conteos rígidos (27 fotos de Colombia, 15 días Patagonia, tres hoteles Italia, 16 jornadas Suiza); fechas, números de vuelo, hoteles y operadores inmutables. Estas afirmaciones son snapshots de planificación, no contratos universales.

**Reglas que NO deben perderse:** días consecutivos y correspondencia inicio/fin; suma de noches sin traslapes; referencias `hotelId` y `transportRefs`; presupuesto y conversiones consistentes; una sola alternativa de tarifa contabilizada; pendientes no representados como cero; fotos y créditos para actividades actuales; links, moneda, temperatura, indicadores y nueve secciones; loader de borradores sin inventar contenido; layout usable en móvil.

**Advertencias:** (1) varios tests actuales protegen incidentes reales; cambiar su estructura sin fixtures adversariales puede perder cobertura; (2) eliminar checks de compras/fechas sin verificar el **estado** puede permitir mostrar cotizado como reservado; (3) un validador puro que no se integre en el CI y DOM no protege la interfaz; (4) no imponer mínimos arbitrarios de actividades, fotos o estancias a viajes parciales; (5) correspondencia país-moneda exige ubicación estructurada, no heurísticas basadas en el ID.

## Puerta para fase 2

Completar contratos universales para alojamientos/fechas, referencias, reservas, fotos, transportes, gastos, tipo de cambio y presentación por estado editorial. Cada contrato nuevo debe tener fixture válido + inválido, y demostrar que las pruebas específicas reemplazadas no detectan un fallo que el contrato nuevo pase por alto. Conservar toda la suite antigua hasta alcanzar esa equivalencia. Solo fase 3 puede retirar aserciones y archivos específicos. El PR #23 permanece abierto y sin merge.

## Fase 2 — contratos cruzados implementados (2026-11-21)

Nuevo módulo puro `scripts/editorial-relations.cjs` y suite de mutación `tests/editorial-relations.test.cjs`, independientes de IDs, tarifas, operadores y número de actividades.

**Reglas bloqueantes ya ejecutables:** fechas de jornadas válidas y consecutivas; correspondencia con inicio y final; fechas válidas de check-in/check-out; alojamiento de cada noche existente y vigente para esa jornada; `hotelId` de gastos y `transportRefs` de jornadas presentes; IDs únicos de hoteles, transporte y gastos; importes no negativos y código ISO 4217 cuando existe importe; `null` legítimo para precio pendiente; enlaces HTTP(S) válidos de hoteles y reservas; grupos de reservas estructurados; `cover`, `places` y `optionalPlaces` referenciados en `data/places.json`.

**Pruebas positivas y negativas:** agregar/quitar actividades, renombrar hotel, alterar importes o prolongar la estancia con fechas congruentes debe pasar; referencias huérfanas, fechas imposibles, noches fuera de check-in/out, duplicaciones, montos negativos, monedas inexistentes, fotos ausentes y URLs inválidas deben fallar. Se ejecutan los contratos contra los nueve viajes principales, sin fijar sus decisiones de planificación.

**Límites deliberados:** una URL bien formada no demuestra disponibilidad real; una moneda ISO válida no demuestra pertinencia geográfica. Las fotografías locales pueden tener solo `photo.src`, a diferencia de fotos externas con autor/licencia: no exigir metadatos externos a archivos propios. Los tests existentes de presupuestos complejos se conservan: aquí validamos integridad estructural, **no** recalculamos por segunda vez las fórmulas del ledger ni toda la guía editorial. La comprobación de correspondencia país-moneda, estados de compra y la depuración de snapshots continúan como tareas pendientes de la fase 3/4.

**Puerta de salida:** no eliminar tests rígidos hasta demostrar que el nuevo contrato o un fixture de presupuesto conserva su detección. El PR #23 sigue abierto, sin merge. 

## Fase 3 — depuración de snapshots y sustitución por contratos (2026-11-21)

Se retiraron **17 casos Node** (aprox. **316 líneas netas** de cinco archivos; medición contra la rama previa a esta fase), que fijaban fotografías, itinerarios, fechas, operadores, tarifas, alojamientos y conteos puntuales. Desglose: `colombia-2027.test.cjs` 1 caso, `patagonia-regression.test.cjs` 4, `trip-editorial.test.cjs` 6, `loader-regression.test.cjs` 3, `transport-budget.test.cjs` 3.

Los nuevos contratos de relaciones en `editorial-relations.test.cjs` sustituyen las comprobaciones estructurales con fixtures mutables y todos los viajes principales. Se reforzó la cobertura de `coverSlides` y pies de foto de `days[].places`, sin exigir cantidades fijas de imágenes. La compatibilidad funcional del loader, el cálculo de alternativas presupuestarias, cronologías de transporte y el smoke responsive permanecen en la suite.

**No se han eliminado todavía** todos los snapshots específicos: muchos casos combinan ejemplos reales con lógica de presupuesto/transportes única que necesita reemplazos equivalentes más completos antes de depurarse. El resto se reevalúa en fase 4 para no cambiar la seguridad del pipeline por una reducción artificial de líneas.

**Control de calidad:** la primera corrida tras reforzar pies de foto falló en un fixture cuyo lugar opcional carecía de descripción, sin afectar datos reales. Se corrigió el fixture para representar un viaje editorialmente válido. El resultado definitivo del CI se registra en la PR y se verificará antes de cerrar esta fase. Sin cambios en JSON de itinerarios, sin merge.
