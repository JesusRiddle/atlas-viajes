# Estándar maestro autónomo de viajes · Atlas

## Fuente de verdad
Este documento define el formato de todos los viajes nuevos, independientemente de que se eliminen los viajes que sirvieron para desarrollarlo. Complementa `docs/trip-editorial-guide.md`, `docs/trip-data-contract.md`, `docs/trip-production-checklist.md` y `data/trips/_template.json`. Los JSON de viajes existentes son ejemplos opcionales, nunca dependencias. La presentación se implementa en componentes compartidos de la aplicación.

## Crear un viaje desde cero, sin ejemplos existentes
El procedimiento debe funcionar aunque no exista ningún JSON turístico completo. **Única fuente normativa:** esta especificación, `docs/trip-editorial-guide.md`, `docs/trip-data-contract.md`, `docs/trip-production-checklist.md` y `data/trips/_template.json`. `data/trips/italia-norte-2027.json` es el ejemplo de implementación vigente, **opcional**, no una plantilla ni requisito.

1. Definir restricciones reales: fechas, duración, presupuesto, transporte, preferencias y destinos candidatos; investigar fuentes oficiales y guardar fecha de consulta.
2. Construir primero ruta, noches, conexiones, visitas prioritarias y costos tentativos, sin inventar precios, reservas ni horarios.
3. Crear un JSON nuevo con identificador propio a partir de `_template.json` o con `id` y `name` para completarlo progresivamente; añadirlo a `modules.js` como inactivo mientras se prepara.
4. Completar las nueve secciones con los campos indicados abajo, separando confirmado, cotizado, estimado y pendiente. Los estados vacíos siguen el contrato de datos.
5. Comparar el resultado **contra este estándar y su checklist**, no contra otro viaje; comprobar enlaces, anclas, presupuesto, navegación, escritorio y móvil cuando sea posible.
6. Ejecutar las pruebas automatizadas, corregir regresiones y solicitar aprobación antes de publicar o hacer merge.

No exigir ninguna visita, ciudad, tarifa, cantidad de noches, fotografía o elección editorial tomada para un viaje anterior.

## Composición obligatoria y navegación
Preservar el encabezado `triphero`, menú `subnav` y exactamente estas nueve secciones, con estas anclas, en este orden:

1. **Panorama** (`plan`): introducción turística resaltada con `introHighlights`; indicadores prácticos de `practicalIndicators`, alojamientos y noches de `bases`, presupuesto `expenses` + `majorTransport`, tipos de cambio `exchangeRates` + `exchangeRateSnapshot` y tarjeta de clima/luz (`climate`). No duplicar las antiguas tarjetas «Salida y llegada · vuelos / Entre ciudades / Clima y luz / Ritmo y viajar solo».
2. **Mapa** (`mapa`): `mapPoints` con coordenadas reales y mapa interactivo. No crear pines ficticios.
3. **Temporadas** (`temporadas`): `seasonality.months` con los 12 meses, temperatura y estado; mostrar pendientes sin inventar condiciones.
4. **Experiencias** (`experiencias`): `experiences` con presentación editorial en tarjetas y distribución de columnas; lugares y gastronomía local cuando proceda.
5. **Reservaciones** (`reservas`): título visible **«Reservaciones importantes»**; `planningDetails.reservationTitle`, `reservationNote`, `reservations` agrupadas por prioridad y enlaces oficiales. No tratar reservas pendientes como compras.
6. **Traslados** (`traslados`): `majorTransport`, alternativas, precios por tarifa, viajes de ida y vuelta, segmentos, estaciones/paradas, Google Maps, indicaciones de abordaje, condiciones y reglas de validez de billetes. No duplicar costes cubiertos por pases.
7. **Dónde dormir** (`alojamientos`): `hotels` con dirección, noches, check-in/out, tarifa y estado; para **cada hotel**, `mapsUrl` de Google Maps y `links` de reserva oficial cuando exista. Diferenciar referencias de otras fechas de cotizaciones del viaje.
8. **Día por día** (`dias`): `days`, fotos (`places`), transporte diario, consejos, tarjetas desplegables, navegación por día y correspondencia correcta con `hotel`.
9. **Presupuesto** (`costes`): `expenses`, `majorTransport`, conversiones, categorías y total parcial/estimado. Seleccionar una sola tarifa por transporte, actualizar totales cuando cambie la opción y evitar duplicados.

El número de días, alojamientos o gastos depende de cada itinerario; jamás copiar cantidades de un viaje de ejemplo. Pueden existir enlaces adicionales a fuentes, pero no sustituyen las nueve secciones. Una sección sin datos muestra «Por definir», sin `undefined`, `NaN`, ceros ficticios o fechas inválidas.

## Componentes y presentación
- `components/trip.js`: encabezado, navegación y composición de secciones.
- `components/sections.js`: experiencias, reservaciones y alojamientos.
- `components/seasonality.js`: temporadas.
- `components/major-transport.js`: traslados y alternativas.
- `components/day.js` y componentes diarios: itinerario, transporte y gastos por día.
- `components/budget.js` y `components/budget-table.js`: cálculos y desglose; `components/format.js`: textos de costo.
- `travel-ui.js`: mapa; `loader.js`: carga y normalización; `modules.js`: registro de viajes.
- `style.css`: mantener `triphero`, `subnav`, `overview-editorial`, `overview-side`, `overview-stays-inline`, `trip-map-section`, `seasonality-section`, `experience-panel`, `reservation-panel`, `hotel-grid`, `itinerary-panel`, `budget-section-panel` y sus estilos responsive.

No utilizar condiciones por ID de un viaje para conceder a los nuevos el formato maestro. La compatibilidad con viajes antiguos debe ser explícita y aislada; nunca condicionar características nuevas a que exista un JSON legado.

## Criterios de aceptación
Antes de entregar, ejecutar el checklist en `docs/trip-production-checklist.md`: verificar las nueve secciones, navegación, enlaces oficiales/Google Maps, opciones de transporte, presupuesto y tipos de cambio, coherencia de noches/días, JSON y pruebas `node --test`. Comprobar escritorio y móvil si existe navegador disponible y distinguir las verificaciones realmente ejecutadas de las pendientes. No hacer merge ni borrar viajes sin autorización.

## Convención monetaria obligatoria
En todas las secciones y vistas de un viaje, cada cifra expresada en moneda extranjera debe llevar a continuación su equivalente aproximado en pesos mexicanos entre paréntesis, por ejemplo `¥4,000 (≈ $478 MXN)`. La regla se aplica a textos, listas, tarjetas, datos numéricos renderizados, opciones, precios históricos y documentos editoriales. Tomar tasas documentadas con fecha y fuente, preferentemente `exchangeRates` del viaje. No transformar el dato monetario original, no mostrar conversión falsa cuando falta una tasa válida y no contabilizar dos veces gastos opcionales.
