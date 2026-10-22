# Estándar maestro de viaje — Emilia-Romagna (paso 2)

## Alcance y fuente de verdad
Inventario del renderizado **completo** de `data/trips/emilia-romana.json` en la branch `refactor/atlas-viajes-modulares-20261019`. Esta especificación describe lo existente, no cambia el contrato JSON ni implementa viajes parciales (pasos 3–8). El modelo maestro es la **composición visual, las clases, los componentes y las interacciones**, nunca los textos, precios, fechas, ciudades o reglas especiales de Emilia-Romagna. El encabezado `triphero`, la navegación `subnav` y el enlace opcional a fuentes se sitúan fuera de las nueve secciones.

## Nueve secciones obligatorias (orden y anclas)
| # | Sección / ancla | Renderizador real | Datos principales | Estructura / comportamiento existente |
| --- | --- | --- | --- | --- |
| 1 | Panorama / `plan` | `components/trip.js:fullSectionMarkup`, `practicalAdvice`, `overviewStays`, `climateCard` | `intro`, `introHighlights`, `practicalIndicators`, `bases`, `climate`, presupuesto, `exchangeRates`, `exchangeRateSnapshot` | `overview-editorial` con introducción, indicadores, estancias, resumen presupuestal y clima; enlace interno a `costes` |
| 2 | Mapa / `mapa` | `travel-ui.js:mapSection/initMap/clearMap` | `mapPoints`, `bases`, `name` | `trip-map-section`, listado de ciudades, mapa Leaflet diferido, leyenda y selección de puntos; al cambiar de viaje se limpia el mapa |
| 3 | Temporadas / `temporadas` | `components/seasonality.js:seasonality` | `seasonality.months` (01–12: `status`, `description`, `icon`), `summary` | `seasonality-section`, `season-months`; 12 meses enero–diciembre; estados `pending/recommended/conditional/avoid` |
| 4 | Experiencias / `experiencias` | `components/sections.js:experiencePanel` | `experiences` (ciudad y descripción), `profile.why` opcional | `experience-panel`, `experience-list`, tarjetas numeradas; Emilia usa `experience-column-order` y `--experience-rows` |
| 5 | Reservaciones / `reservas` | `components/sections.js:reservationPlanning` | `planningDetails`, `reservations` por grupos | `reservation-panel`, grupos de prioridad, numeración y enlaces oficiales; actualmente retorna vacío sin `planningDetails` |
| 6 | Traslados / `traslados` | `components/major-transport.js:render/mount` | `majorTransport`, tarifas, trayectos, segmentos, equipaje, `exchangeRates` | Tarjetas de transportes con alternativas; selectores de operador/tarifa actualizan costos mediante `AtlasSelections`, `AtlasBudget`, `AtlasBudgetTable` y `AtlasDayBudget` |
| 7 | Dónde dormir / `alojamientos` | `components/trip.js` + `components/sections.js:stayParagraphs/hotelCard` | `hotels`, `bases`, `stays` heredado | `hotel-section-heading`, `hotel-grid`, tarjetas de hoteles con fechas, dirección, condiciones y enlaces; el flujo antiguo puede usar `stays` |
| 8 | Día por día / `dias` | `components/trip.js` + `components/day.js:day` + `components/day-transport.js` + `components/day-budget.js` | `days`, `hotels`, referencias de transporte, presupuesto diario, fotos de `places` | `itinerary-panel`, índice `daynav`, `details.day`, Expandir/contraer e Imprimir/PDF; carga de fotos al expandir |
| 9 | Presupuesto / `costes` | `components/trip.js` + `components/budget-table.js:render/mount` + `components/budget.js` | `majorTransport`, `expenses`, `exchangeRates`, selecciones | `budget-section-panel`, `budget-ledger`; partidas y grupos plegables, costos conocidos y pendientes, monedas originales y MXN; las opciones de transporte modifican subtotales |

## Contrato de composición y navegación
- Orden de las nueve secciones: `plan → mapa → temporadas → experiencias → reservas → traslados → alojamientos → dias → costes`. Las anclas anteriores son parte del contrato de navegación `#viaje/<id>/<seccion>`; un `fuentes` adicional es **opcional y no cuenta como décima sección**.
- `components/trip.js:tripPage` administra la vista; `tripShell` compone encabezado, navegación y contenido. `app.js:route` resuelve el hash, las anclas de día y el retorno al catálogo. `tripPage` registra/desregistra selectores y efectos; `app.js` gestiona expansión de `details.day`.
- `AtlasGallery.init`, `AtlasMajorTransport.mount`, `AtlasBudgetTable.mount`, `mountTransport`, `AtlasDayBudget.mount` y `AtlasTravel.initMap` se activan únicamente en la ruta completa actual. `cleanup` desactiva suscripciones antes de montar otra vista.
- El catálogo (`components/home.js`) y los comparativos **no son secciones** del viaje. `modules.js` determina alta, visibilidad y orden; `loader.js` carga y normaliza; `components/empty-state.js` produce «Por definir» y «No aplica».
- Estilos maestros a conservar están en `style.css`: `triphero`, `subnav`, `overview-editorial`, `overview-side`, `overview-stays-inline`, `trip-map-section`, `seasonality-section`, `experience-panel`, `reservation-panel`, `hotel-grid`, `itinerary-panel`, `budget-section-panel`, además de sus reglas responsive. Verificar Desktop/Mobile antes de reemplazar cualquier contenedor.

## Excepciones actuales que NO deben convertirse en reglas universales
1. `t.id === 'emilia-romana'` en `components/trip.js`: controla el bloque de indicadores, posición de estancias, tarjetas de consejos y clima, así como leyendas y paneles. **La composición editorial es el estándar**; sustituir la detección por ID por comportamiento genérico solo en los pasos autorizados posteriores.
2. `t.id === 'emilia-romana'` en `components/sections.js`: determina orden en columnas de experiencias. La distribución es visual y debe ser reutilizable, no un privilegio del ID.
3. `t.id === 'emilia-romana'` en `travel-ui.js`: oculta un texto adicional del mapa. La nota debe tratarse como contenido configurado, no como una condición por destino.
4. `practicalAdvice` contiene badges y frases específicas de Emilia-Romagna; `experiencePanel` contiene una introducción editorial fija y `components/trip.js` contiene avisos genéricos heredados. **No trasladar esos textos a otros viajes como si fueran datos reales**.
5. `canRenderFullTrip` en `components/format.js`, `pendingTripSections` y `pendingTripHero` en `components/trip.js` y `draftCard` en `components/home.js` crean rutas alternativas para datos incompletos. Se inventarían aquí; se unificarán en el paso 4, no en este paso.
6. El renderizado de traslados usa `railPlanning` y presupuesto con `costs` si `majorTransport` está vacío; son variantes heredadas, **no** partes adicionales del modelo maestro.
7. La vista completa tiene dependencias estrictas de datos (`start/end`, `intro`, `days`, `bases`, `profile`, etc.). Con solo `id`/`name`, `loader.js` normaliza, pero aún no se obtiene visualmente el modelo maestro. Resolver en pasos 3–8 sin falsear importes ni fechas.

## Datos de referencia, sin convertirlos en constantes
En el JSON maestro se observaron **12 días, 7 puntos de mapa, 7 experiencias, 2 grupos de reservaciones, 7 transportes principales, 3 hoteles y 26 gastos**. Son contenido del itinerario, no mínimos requeridos para otros destinos. Hay 12 entradas mensuales, ordenadas semánticamente de enero a diciembre aunque el orden de claves del objeto varíe.

## Condiciones de aceptación para pasos posteriores
- Los nueve contenedores y sus anclas se mantienen visibles y con el mismo lenguaje de diseño, incluso cuando estén pendientes.
- Las áreas sin información muestran estados semánticos (nunca `undefined`, `NaN`, fecha inválida o costo cero inventado).
- Mapas y fotos no reciben ubicaciones/URLs ficticias; botones y selectores siguen funcionando tras navegar entre viajes.
- No se altera el JSON maestro ni los 16 JSON antiguos. No se copia lógica particular de Emilia-Romagna a destinos nuevos.
- Regresión automatizada de sintaxis/JSON/pruebas y verificación Desktop/Mobile en el paso 11. Esta documentación es el resultado del **paso 2**, no una afirmación de que el renderizado universal ya esté implementado.
