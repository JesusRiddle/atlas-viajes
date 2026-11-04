# Estándar maestro autónomo de viajes · Atlas

## Fuente de verdad
Este documento define el formato de todos los viajes nuevos, independientemente de que se eliminen los viajes que sirvieron para desarrollarlo. Complementa `docs/trip-editorial-guide.md`, `docs/trip-data-contract.md`, `docs/trip-production-checklist.md` y `data/trips/_template.json`. Los JSON de viajes existentes son ejemplos opcionales, nunca dependencias. La presentación se implementa en componentes compartidos de la aplicación.

## Protocolo autónomo al recibir «refléjalo en el Atlas»

El [checklist de avance por viaje](trip-progress-template.md) es la **única referencia canónica de las etapas 00–13**. Se ejecutan de lo **menos dependiente** a lo **más dependiente**: destinos y alcance (01) → **Temporadas (02)** → fechas, ruta, noches y días base (03) → Mapa (04) → Experiencias (05) → Reservaciones (06) → Movilidad (07) → Dónde dormirás (08) → Día por día (09) → Panorama (10) → **Presupuesto (11)** → fotos/portada (12) → QA/PR (13). La preparación es la etapa 00.

Hacer auditorías **A tras 03, B tras 08, C tras 11, D tras 13**. `AGENTS.md` define ejecución sin microaprobaciones; crear `docs/trip-progress/<slug>.md` para conservar evidencias y siguiente acción. El **orden visual** de las nueve secciones se mantiene sin cambios: Panorama, Mapa, Temporadas, Experiencias, Reservaciones importantes, Movilidad y conexiones, Dónde dormirás, Día por día, Presupuesto. Construir Temporadas antes de la ruta y presupuesto después de vuelos, transportes, entradas, hoteles y comida **no** autoriza reordenar la interfaz.

Si una planeación es a alto nivel, pueden usarse referencias fechadas o supuestos transparentes para costos no publicados, sin afirmar disponibilidad ni compras. Recalcular los resúmenes de Inicio y Panorama tras cerrar el presupuesto. Nunca hacer merge ni compras sin aprobación.

## Alta visible desde el primer paso

El generador registra cualquier viaje nuevo con `available: true` y sin `status: "draft"`. Su tarjeta normal aparece inmediatamente en la sección principal, incluso si solo conocemos nombre y destino; campos aún no informados se omiten sin mostrar cifras falsas, etiquetas «borrador», «en planeación» o «preliminar». La ficha enlaza a las nueve secciones, cuyas ausencias se señalan con estados neutrales. Las ideas históricas son únicamente aquellas clasificadas en `modules.js` como `homeGroup: "ideas"`, no todos los viajes posteriores al cuarto. La bitácora es interna al repositorio, no una etiqueta de la interfaz. En GitHub Pages la visibilidad pública exige el merge y posterior despliegue de `main`; durante el PR, usar vista local o preview de rama.

## Crear un viaje desde cero, sin ejemplos existentes
El procedimiento debe funcionar aunque no exista ningún JSON turístico completo. **Única fuente normativa:** esta especificación, `docs/trip-editorial-guide.md`, `docs/trip-data-contract.md`, `docs/trip-production-checklist.md` y `data/trips/_template.json`. `data/trips/italia-norte-2027.json` es el ejemplo de implementación vigente, **opcional**, no una plantilla ni requisito.

1. Definir restricciones reales: fechas, duración, presupuesto, transporte, preferencias y destinos candidatos; investigar fuentes oficiales y guardar fecha de consulta.
2. Construir primero ruta, noches, conexiones, visitas prioritarias y costos tentativos, sin inventar precios, reservas ni horarios.
3. Crear un JSON nuevo con identificador propio a partir de `_template.json` o con `id` y `name` para completarlo progresivamente; añadirlo a `modules.js` como visible desde el primer registro, aun incompleto.
4. Redactar `intro` (70–130 palabras) para Panorama e `introShort` (30–45 palabras) para la tarjeta de portada; ambos deben describir el recorrido y no mezclar logística ni presupuesto. Durante la captura inicial pueden quedar `null`, pero son obligatorios para un viaje editorialmente completo.
5. Completar las nueve secciones con los campos indicados abajo, separando confirmado, cotizado, estimado y pendiente. Los estados vacíos siguen el contrato de datos.
6. Comparar el resultado **contra este estándar y su checklist**, no contra otro viaje; comprobar enlaces, anclas, presupuesto, navegación, escritorio y móvil cuando sea posible.
7. Ejecutar las pruebas automatizadas, corregir regresiones y solicitar aprobación antes de publicar o hacer merge.

No exigir ninguna visita, ciudad, tarifa, cantidad de noches, fotografía o elección editorial tomada para un viaje anterior.

## Número de personas contempladas en el presupuesto
En los nuevos viajes declarar `travelerCount` explícitamente; utilizar `null` mientras no se decida. Para itinerarios desarrollados indicar entero positivo: 1 para viajes individuales y 2 para un viaje presupuestado para dos. La comparación de la portada usa «Personas» y muestra «Por definir» si no se conoce. `travelerCount` es diferente de `profile.solo`: este último describe la idoneidad de viajar solo, no la cantidad presupuestada. Mantener importes de grupo en `expenses`, sin multiplicarlos automáticamente; calcular equivalentes individuales únicamente si existe un valor válido, conservando sus supuestos y la coherencia entre Inicio, Panorama y Presupuesto.

## Terminología y métricas visibles
En Inicio, portada, Panorama y comparativas mostrar alojamiento en formato «X noches, Y alojamientos», calculado desde los datos, con singular/plural correcto. Prohibido «bases para dormir», «Noches y bases» o «estancias» como etiqueta de cantidad de alojamientos. `bases` y `days[].base` son claves técnicas y no deben cambiarse por esta regla. Auditar el renderizador además de los JSON para evitar textos heredados.

**Panorama · disposición obligatoria:** `.overview-intro` (izquierda en escritorio) contiene exactamente tres indicadores de `practicalIndicators`: `style`, `language`, `entry`, en ese orden y con títulos «Estilo de viaje», «Idioma y moneda», «Documentación y consejos prácticos». `.overview-side` (derecha) contiene presupuesto y **una sola tarjeta** `.overview-climate-card` generada desde `climate`. Está prohibido introducir `weather` en `practicalIndicators` o renombrar `entry` como «Documentación y electricidad». La tarjeta derecha muestra párrafos diferenciados de temperaturas/riesgos, `*Qué llevar:*` y `*Horas de luz:*`, con luz local y horarios de referencia para las fechas del viaje. En móvil las columnas pueden apilarse, pero el clima sigue perteneciendo a `.overview-side` y no a la lista de indicadores. Reglas verificadas con prueba DOM por viaje nuevo y comparación con el estándar, no por inspección superficial del JSON.

**Idioma y moneda:** `practicalIndicators.language.badge` debe mostrar idioma local y código ISO de moneda («Japonés · JPY»), nunca una valoración genérica de organización del viaje. Los consejos de pago e inglés van en `text`. Esta convención se verifica antes de aprobar viajes nuevos.

**Electricidad y adaptadores:** el indicador `entry` debe comparar enchufes de cada país con México (A/B) y decidir explícitamente si se requiere adaptador. Cuando sí, describir la conexión exacta que debe comprarse y advertir sobre toma de tierra, voltaje/frecuencia y cargadores INPUT 100–240 V; nunca dejar «adaptador si corresponde» como indicación genérica. No modificar datos eléctricos de viajes históricos por esta regla.

## Composición obligatoria y navegación
Preservar el encabezado `triphero`, menú `subnav` y exactamente estas nueve secciones, con estas anclas, en este orden:

1. **Panorama** (`plan`): introducción turística resaltada con `introHighlights`; indicadores prácticos de `practicalIndicators`, alojamientos y noches de `bases`, presupuesto `expenses` + `majorTransport`, tipos de cambio `exchangeRates` + `exchangeRateSnapshot` y tarjeta de clima/luz (`climate`). No duplicar las antiguas tarjetas «Salida y llegada · vuelos / Entre ciudades / Clima y luz / Ritmo y viajar solo».
2. **Mapa** (`mapa`): `mapPoints` con coordenadas reales y mapa interactivo. No crear pines ficticios.
3. **Temporadas** (`temporadas`): `seasonality.months` con los 12 meses, temperatura y estado; cada intervalo debe leerse `−3 a 5 °C` o `6 a 11 °C`, con ` a ` como separador y `−` solo como signo de temperatura negativa. Mostrar pendientes sin inventar condiciones.
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
En todas las secciones y vistas de un viaje del formato nuevo, cada cifra expresada en moneda extranjera debe llevar a continuación su equivalente aproximado en pesos mexicanos entre paréntesis, por ejemplo `¥4,000 (≈ $478 MXN)`. La regla se aplica a textos, listas, tarjetas y datos numéricos de viajes nuevos o reconstruidos; nunca editar viajes antiguos o heredados automáticamente. Tomar tasas documentadas con fecha y fuente, preferentemente `exchangeRates` del viaje. No transformar el dato monetario original, no mostrar conversión falsa cuando falta una tasa válida y no contabilizar dos veces gastos opcionales.

**Alcance de cambios:** Los viajes históricos deben permanecer intactos y solo pueden consultarse para extraer ideas; ninguna solicitud general de edición del Atlas autoriza modificar sus JSON ni la visualización heredada. Aplicar cambios de contenido exclusivamente a los viajes del formato nuevo.

**Tarjeta «Clima y luz»:** En los viajes de formato nuevo, sincronizar su franja superior y su etiqueta de estado con el mes de inicio mostrado en «Temporadas». La paleta y las etiquetas tienen una única correspondencia: Recomendable, Aceptable, Desaconsejable, Por definir. Leer fecha de `start` o primera jornada válida `days[].date`; comprobar comportamiento en Desktop/Mobile.
