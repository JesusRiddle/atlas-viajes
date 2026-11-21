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

**Compatibilidad:** las tarjetas de temporada hoy extraen texto de `description` usando expresiones regulares que aceptan `−3 a 5 °C`. **Ese formato heredado ordena los números de menor a mayor, pero NO demuestra por sí solo que sean mínima nocturna y máxima diurna:** también puede describir máximas entre regiones. No intercambiar ni atribuir significados nuevos a sus extremos. La migración requiere coordinar:
1. formatos legibles de `climate` y `seasonality.months[MM].description`;
2. `components/seasonality.js` (extracción y render de cabecera);
3. tests para válidos/inválidos: `−3, 5`, ambos negativos, cero, misma temperatura, separadores inválidos, `pending`, intervalos invertidos;
4. migración segura de registros editoriales completos y verificación de los nueve viajes principales; nunca invertir valores meteorológicos sin interpretar el contexto.

**Los tests anteriores admiten el formato viejo y solo prueban que existe un patrón** (`tests/trip-editorial.test.cjs`, `tests/loader-regression.test.cjs` y `tests/browser-smoke.cjs`). Todavía no validan relación máxima ≥ mínima ni identidad semántica de ambos números. Se introducirán esos tests y se migrarán los datos en la fase 2/3. Esta fase 1 solo fija la regla y el inventario, sin alterar itinerarios ni afirmar que la nueva vista esté implementada.

## Ejecución por fases restantes

**Fase 2 · Validador común y tests de unidad:** implementar reglas A/C como funciones puras, con fixtures válidos e inválidos, y validación de los viajes aplicables. Empezar por temperatura (incluido orden), formato monetario, indicadores, 12 meses y nueve secciones. Registrar explícitamente reglas H no verificables automáticamente.

**Fase 3 · Migración y depuración:** migrar `seasonality.js` y el contenido térmico necesario sin inventar cifras; sustituir tests rígidos de viajes por contratos reutilizables cuando demuestren cobertura equivalente. Las reglas de clima y moneda deben comprobarse también en DOM.

**Fase 4 · CI y auditoría:** ejecutar Node y Playwright escritorio/móvil sobre el contrato vigente, comprobar errores por estado de planificación y reportar excepciones. Un solo PR para las cuatro fases, sin merge automático.

## Fase 2 — implementación del validador inicial (2026-11-21)

Implementados `scripts/editorial-contracts.cjs` (reglas puras sin dependencias del DOM ni de un viaje particular) y `tests/editorial-contracts.test.cjs` (fixtures válidos/erróneos y comprobación de los nueve viajes principales del catálogo).

**Contratos ejecutables incluidos:**
- rango térmico explícito `Máx. X °C · Mín. Y °C`, con máxima ≥ mínima, negativos en signo Unicode y decimales;
- intervalo histórico `X a Y °C`, con extremos ascendentes y sin atribuir por error al extremo inferior la condición de mínima nocturna; formato invertido/guion incorrecto se detecta;
- doce meses completos, cuatro estados válidos y temperatura reconocible para los meses evaluados; `pending` admite desconocidos;
- tres indicadores completos en orden, títulos y tonos válidos; badge de idioma y código de moneda con estructura ISO 4217 (incluidos multidestinos); los viajes recién creados admiten `practicalIndicators: []`;
- nueve anclas maestras, estructura y orden.

**Comprobación real de datos:** se ejecutaron las funciones del módulo contra los JSON de los nueve viajes principales disponibles por GitHub. Resultado: cero incidencias en los contratos iniciales. También se comprobaron interactivamente casos de máxima/mínima invertidas, valores negativos, intervalos heredados, separador prohibido, doce meses `pending` y anclas maestras.

**Límites deliberados:** el validador aún no confirma que el código de moneda sea el correcto para cada país; un patrón `[A-Z]{3}` no verifica esa relación. Eso requerirá información estructurada de países y posibles varias monedas, evitando un mapa improvisado por ID de viaje. Tampoco se comprueban hechos de clima, requisitos migratorios ni geografía desde un test local. La nueva notación `Máx./Mín.` NO se ha aplicado al renderizador ni a los JSON; ese trabajo corresponde a la fase 3. Las otras secciones se cubrirán progresivamente con reglas automatizables sustentadas en la guía, no mediante ejemplos específicos.

**Validación CI:** sintaxis V8 del módulo y del test revisada; ejecución de funciones concretas verificada; **no se ejecutó todavía `node --test` ni Playwright sobre esta rama** porque se acordó un único PR al final de cuatro fases. El CI completo es puerta obligatoria de fase 4. No se han modificado viajes, y no hay merge.

## Triple revisión de integridad de fases 1 y 2 (previa a fase 3)

**Pasada 1 — normativa y semántica.** Se cotejaron `trip-editorial-guide.md`, `trip-master-standard.md`, `trip-data-contract.md`, el inventario y `components/seasonality.js`. Hallazgo: `−3 a 5 °C` a veces indica rango de máximas regionales, no mínima nocturna/máxima diurna. Se ajustaron las tres guías para exigir pares explícitos **solo si ambos extremos describen realmente máximas/mínimas** y distinguir intervalos de máximas entre regiones. No se editaron los JSON ni el renderizador.

**Pasada 2 — tests adversariales y falsos positivos.** Se corrigió el patrón que aceptaba valores parciales incrustados en otros números, como `111 a 2 °C`; se admitió la puntuación final legítima de `Máx. 5 °C · Mín. −3 °C.`; se añadió diagnóstico para `Máx./Mín.` incompletos; se exigió `badge` no vacío para todos los indicadores. Un código de tres letras no basta: el indicador de idioma ahora se coteja contra códigos ISO 4217 reconocidos por `Intl.supportedValuesOf('currency')`, detectando `ZZZ` sin inventar una relación país-moneda.

**Pasada 3 — contraste con catálogo e integración.** Las reglas corregidas se ejecutaron contra los **nueve viajes principales** (sin exigir terminación a las 15 ideas históricas). Cero incidencias. Se verificaron once casos térmicos positivos/adversariales: negativos, orden invertido, guiones incorrectos, números incrustados, par malformado, sufijo numérico y puntuación. Se comprobó la lista de nueve anclas. En esta pasada también se corrigió `practicalIndicators || []` para no silenciar una colección de tipo incorrecto (p. ej., cadena vacía), conservando la aceptación de campos ausentes en borradores. Se reforzó el test de regresión correspondiente.

**Resultado:** hallazgos corregidos y **luz verde técnica para iniciar fase 3**, sin afirmar validación del pipeline completo. Estas verificaciones fueron ejecuciones aisladas del validador y análisis de sintaxis; `node --test` y Playwright en GitHub Actions quedan como controles obligatorios de la fase 4. La convención visual máxima/mínima sigue siendo **objetivo, no implementación actual**.

**Límites todavía abiertos:** la correspondencia real de monedas con cada país y la certeza climática son verificaciones contextuales/humanas; la notación heredada no permite inferir mínimas nocturnas; `sections()` existe como contrato puro, pero su uso contra el DOM y los cambios de `seasonality.js` corresponden a fase 3. No considerar esto cobertura completa de las nueve secciones hasta que todos sus contratos se integren en la suite.

## Fase 3 — migración de presentación y depuración (2026-11-21)

**Presentación adaptada:** `components/seasonality.js` interpreta ahora dos formatos sin cambiar valores meteorológicos:
- `Máx. 5 °C · Mín. −3 °C` se muestra como **par real máximo/mínimo** únicamente si está expresado así en la descripción;
- `−3 a 5 °C` se muestra como **«Máximas: −3 a 5 °C»** si el texto introduce explícitamente máximas; de lo contrario aparece como **«Intervalo: −3 a 5 °C»**, sin inventar que el valor inferior es una mínima nocturna;
- un mes `pending` muestra `—`, nunca una temperatura supuesta.

Se conserva íntegra la descripción cuando el rango aparece dentro de una frase, evitando textos truncados como «Máximas diurnas orientativas: (Grindelwald)». Solo se extrae el número del texto descriptivo si aparece al inicio. No se modificaron JSON, precios, vuelos ni itinerarios.

**Cobertura migrada:** `tests/editorial-contracts.test.cjs` ahora valida el HTML de Temporadas de los **nueve viajes principales**, las doce tarjetas por viaje y el significado de sus etiquetas. `tests/browser-smoke.cjs` añade una verificación genérica de temperaturas en el DOM para viajes principales, en escritorio y móvil. Se suprimieron dos casos redundantes que usaban listas fijas de seis viajes en `tests/trip-editorial.test.cjs` y `tests/loader-regression.test.cjs`. El resto de casos específicos se conserva hasta demostrar equivalencia; la fase no pretende borrar regresiones financieras o logísticas por reducir código.

**Comprobación aislada de esta fase:** el código del validador, del componente y de los tests pasó revisión de sintaxis JavaScript V8. Se renderizó cada uno de los nueve viajes principales y se comprobó que las 108 tarjetas de temperaturas presentan un valor o `—` según su estado, con cero incumplimientos. Estas verificaciones no sustituyen una corrida real de `node --test` y Playwright: la validación CI final sigue prevista en la fase 4.

**Limitaciones:** los intervalos climáticos sin descripción de significado continúan etiquetados «Intervalo», no «Máx./Mín.». Para convertirlos en máximas y mínimas reales hace falta un dato verificable por región y período, no una inversión automática. Todavía no existe correspondencia automatizada país-moneda; validar ISO 4217 no prueba qué divisa es local.
