# Inventario de contratos editoriales universales · Fase 1

Fecha: 21 de noviembre de 2026.
Fuentes normativas: `docs/trip-editorial-guide.md`, `docs/trip-master-standard.md`, `docs/trip-data-contract.md`, `docs/trip-production-checklist.md` y la plantilla `data/trips/_template.json`. Los JSON de destinos son datos de prueba, no fuentes de reglas.

## Alcance y estados

El catálogo tiene actualmente 24 viajes activos: 9 principales y 15 ideas históricas. Los nueve apartados deben **renderizar siempre**, incluso con datos incompletos. Los criterios de **viaje editorialmente completo** no deben aplicarse sin matiz a borradores incrementales ni a viajes heredados. Evitar excepciones por `id` de destino: definir explícitamente el estado o la versión del contrato.

Cada regla se clasifica en:
- **A — automatizable y bloqueante:** estructura, formatos, coherencia interna y DOM; ejecutar contra todos los viajes aplicables.
- **C — condicional:** solo cuando la sección/campo se haya completado, la opción exista o una fase editorial esté cerrada.
- **H — revisión humana:** fiabilidad histórica, vigencia legal, exactitud del clima, gastronomía y fotografías, enlaces que requieren comprobación externa. El CI no puede garantizar hechos externos con expresiones regulares.

## Matriz de reglas por sección

| Sección | Contratos para validar | Aplicabilidad |
|---|---|---|
| 1. Panorama `plan` | Exactamente tres indicadores `style → language → entry` con títulos y tonos válidos; idioma y código ISO 4217 de moneda en `language.badge`; `climate` separado en tres párrafos (clima, «Qué llevar», «Horas de luz»); fecha/luz local; no incluir tarifas en introducción; texto y franja climática coherentes con el mes; sin cifras inventadas. | A/C; exactitud de visa, enchufe, idioma y moneda del país es H apoyada en referencias |
| 2. Mapa `mapa` | Coordenadas válidas, orden, puntos con pernocta vinculados a `bases`; etiquetas de noches o «Excursión»; nombres principales en negritas; nunca «Base» visible, ni pines sin ubicación. | A/C; geolocalización verificada es H |
| 3. Temporadas `temporadas` | Doce meses `01`–`12`; estados `pending/recommended/conditional/avoid`; mes evaluado con temperaturas numéricas, signo correcto, orden semántico y cabecera DOM concordante; mes `pending` sin temperatura inventada. | A/C; valores climáticos históricos son H |
| 4. Experiencias `experiencias` | Registros `city/description` coherentes, sin vacío cuando sección terminada, sin prometer actividades condicionadas, sin duplicados literales obvios; longitud orientativa, no umbral universal cuando incluye gastronomía. | C; autenticidad cultural y gastronomía son H |
| 5. Reservaciones `reservas` | Título «Reservaciones importantes»; grupos con prioridad, objetos y enlaces válidos; compra/reserva diferenciada de cotización o pendiente; sin URLs inventadas. | A/C; disponibilidad y autenticidad de enlaces son H |
| 6. Traslados `traslados` | IDs únicos; referencias `days[].transportRefs` existentes; trayectos con segmentos, escalas, moneda ISO y precio `null` cuando falta; `quoted` con fecha; no sumar tarifas alternativas ni pases cubiertos. | A/C; horarios externos y operador son H |
| 7. Alojamientos `alojamientos` | Título exacto «Tus alojamientos.»; singular/plural «X noches, Y alojamientos»; fecha `checkIn < checkOut`, noches coherentes con días, `hotelId` existente; `mapsUrl` y reservas cuando se conocen; ausencia de «Bases» visible. | A/C; veracidad de ficha Google Maps es H |
| 8. Día por día `dias` | Fechas consecutivas, número único, pernocta aplicable, transportes y gastos referenciados, mañana/tarde/noche y tarjetas de movilidad/tips formateadas cuando informadas, fotografías con créditos, sin contenido de estado ficticio. | A/C; viabilidad horaria real y licencias son H |
| 9. Presupuesto `costes` | Costos numéricos no negativos y moneda ISO; `null` para pendiente, sin presentar cero como estimado; conversión con fecha/fuente y MXN aproximado cuando exista tipo válido; suma exacta por categoría, sin doble contabilización ni opcionales; total por persona solo si `travelerCount` válido. | A/C; cotizaciones del mercado y tasas históricas son H |

### Contratos transversales

- Renderizar las nueve anclas `plan/mapa/temporadas/experiencias/reservas/traslados/alojamientos/dias/costes` en escritorio y móvil.
- Sin `undefined`, `NaN`, `Invalid Date`, importes ficticios ni anglicismos en etiquetas visibles.
- Monedas: una ISO 4217 válida **no basta** para probar que corresponde al país; validar contra un catálogo mantenible de países/monedas si la ruta y los países están estructurados. Los viajes con más de una moneda son válidos; no imponer una única moneda.
- Presupuestos en moneda extranjera muestran MXN aproximado **solo con tipo de cambio sustentado**; si falta, emitir pendiente, nunca convertir usando una tasa inventada.
- Contratos independientes del destino: ningún test universal debe exigir días, hoteles, precios, aerolíneas, fotos o ciudades concretas.

## Hallazgo prioritario: temperaturas

**Convención solicitada y acordada para la interfaz:** izquierda = **máxima diurna**, derecha = **mínima nocturna**, SIEMPRE con etiquetas, por ejemplo `Máx. 5 °C · Mín. −3 °C`. El valor más alto debe ser ≥ el más bajo; permitir negativos y cero. Rechazar `Máx. −3 °C · Mín. 5 °C` y rangos ambiguos `5 a −3 °C` sin etiquetas.

**Compatibilidad:** las tarjetas de temporada hoy extraen texto de `description` usando expresiones regulares que aceptan `−3 a 5 °C`. **Ese formato heredado significa mínima a máxima**; no intercambiar su significado ni afirmar que ya se presenta máxima primero. La migración requiere coordinar:
1. formatos legibles de `climate` y `seasonality.months[MM].description`;
2. `components/seasonality.js` (extracción y render de cabecera);
3. tests para válidos/inválidos: `−3, 5`, ambos negativos, cero, misma temperatura, separadores inválidos, `pending`, intervalos invertidos;
4. migración segura de registros editoriales completos y verificación de los nueve viajes principales; nunca invertir valores meteorológicos sin interpretar el contexto.

**Los tests anteriores admiten el formato viejo y solo prueban que existe un patrón** (`tests/trip-editorial.test.cjs`, `tests/loader-regression.test.cjs` y `tests/browser-smoke.cjs`). Todavía no validan relación máxima ≥ mínima ni identidad semántica de ambos números. Se introducirán esos tests y se migrarán los datos en la fase 2/3. Esta fase 1 solo fija la regla y el inventario, sin alterar itinerarios ni afirmar que la nueva vista esté implementada.

## Ejecución por fases restantes

**Fase 2 · Validador común y tests de unidad:** implementar reglas A/C como funciones puras, con fixtures válidos e inválidos, y validación de los viajes aplicables. Empezar por temperatura (incluido orden), formato monetario, indicadores, 12 meses y nueve secciones. Registrar explícitamente reglas H no verificables automáticamente.

**Fase 3 · Migración y depuración:** migrar `seasonality.js` y el contenido térmico necesario sin inventar cifras; sustituir tests rígidos de viajes por contratos reutilizables cuando demuestren cobertura equivalente. Las reglas de clima y moneda deben comprobarse también en DOM.

**Fase 4 · CI y auditoría:** ejecutar Node y Playwright escritorio/móvil sobre el contrato vigente, comprobar errores por estado de planificación y reportar excepciones. Un solo PR para las cuatro fases, sin merge automático.
