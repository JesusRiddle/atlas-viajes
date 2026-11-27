# Atlas de Viajes

Sitio de itinerarios y presupuestos: **https://jesusriddle.github.io/atlas-viajes/**. HTML, CSS, JavaScript y JSON; publicado con GitHub Pages.

## Prompt reutilizable para planear un viaje

Copia el siguiente prompt en un chat nuevo. **Cambia únicamente el valor de `Destino`**; el resto funciona para cualquier viaje. Si existe un itinerario anterior del mismo destino en el repositorio, se utiliza solo como inspiración.

```text
Destino: Suiza 2027

Actúa como mi arquitecto de viajes para Atlas de Viajes.

Quiero planear el destino indicado arriba para el repositorio JesusRiddle/atlas-viajes. Si existe un itinerario anterior correspondiente a ese destino, consúltalo únicamente como lluvia de ideas, nunca como ruta definitiva ni como fuente que debas copiar.

Primera fase: planeación estratégica, sin modificar GitHub.

Investiga y compara las mejores fechas para viajar, considerando clima, paisajes, precios, temporada turística y días de vacaciones. Después, optimiza ciudades, atractivos, excursiones, alojamientos y desplazamientos, priorizando trenes, pocos cambios de hotel, rutas eficientes y experiencias memorables.

Considera salida desde CDMX, viaje en solitario y presupuesto costo-beneficio. Cuestiona mis propuestas cuando existan alternativas mejores y explica los compromisos importantes.

Trabajaremos por decisiones hasta definir fechas, duración, ruta y presupuesto preliminar. No crees ni modifiques archivos, ramas o PR durante esta primera fase.

Cuando te diga «Refléjalo en el Atlas», consulta y ejecuta autónomamente AGENTS.md, las guías editoriales y el checklist del repositorio, siguiendo sus etapas, verificaciones y auditorías. Publica el viaje desde la primera etapa, sin etiquetas de borrador, y trabaja en una rama con PR, sin hacer merge. Si ya existe una rama de trabajo para el viaje, reutilízala en lugar de crear otra.

Comienza comparando las mejores temporadas y ventanas de viaje para el destino indicado.
```

## Crear un viaje nuevo

Crear un viaje visible desde el primer registro, aunque todavía esté incompleto:

```bash
node scripts/new-trip.cjs mi-viaje "Nombre del viaje"
```

El comando crea `data/trips/mi-viaje.json`, registra el viaje en `modules.js` con `available: true` (visible de inmediato en la versión de la rama, sin etiquetas de estado) y genera automáticamente `docs/trip-progress/mi-viaje.md` para controlar las etapas y auditorías. Rechaza IDs repetidos. **No lee, copia ni modifica viajes antiguos.**

Antes de redactar, consultar [AGENTS.md](AGENTS.md) y la [guía editorial de las nueve secciones](docs/trip-editorial-guide.md); la guía define qué va en cada sección, qué debe excluirse y cómo usar `introHighlights` para las negritas del panorama.

**Orden:** seguir exclusivamente las etapas 00–13 de `AGENTS.md` y `docs/trip-progress-template.md`; el orden de construcción no modifica el orden visual.

Completar progresivamente el JSON siguiendo [`_template.json`](data/trips/_template.json) y el [contrato de datos](docs/trip-data-contract.md). `null`, campos omitidos y listas vacías indican pendientes; nunca usar `0` para un precio desconocido. El modelo visual está definido de forma autónoma en [`docs/trip-master-standard.md`](docs/trip-master-standard.md), con nueve secciones; no depende del JSON de ningún viaje.

Si buscas inspiración en un viaje antiguo, proporciona su JSON a la IA como **contexto** y decide junto con ella, campo por campo, qué añadir al JSON nuevo. No existe ninguna migración automática. El registro es visible desde su creación; verificar Desktop/Mobile sin ocultarlo por datos pendientes.

## Ejecución autónoma y seguimiento

Después de acordar destinos, restricciones y alcance, «**refléjalo en el Atlas**» activa el flujo de etapas **00–13** sin confirmaciones para cada sección. El **orden de llenado** sigue dependencias: primero **Temporadas (02)** con las ciudades candidatas, después calendario/ruta (03), mapa, experiencias, reservas, conexiones, alojamientos y día por día; Panorama (10) resume el recorrido, **Presupuesto (11)** integra todos los costos, y fotos/portada y QA cierran el proceso. **El orden visual del sitio no cambia.**

El generador crea automáticamente `docs/trip-progress/<slug>.md` desde [la plantilla de progreso](docs/trip-progress-template.md), registrando etapas verificadas, auditorías **A (03), B (08), C (11), D (13)**, decisiones bloqueantes y siguiente acción. Normativa en [AGENTS.md](AGENTS.md), [guía editorial](docs/trip-editorial-guide.md) y [checklist de producción](docs/trip-production-checklist.md). No se realizan compras ni merge sin aprobación.

## Probar localmente

```bash
node --test tests/editorial/*.test.cjs tests/functional/*.test.cjs
npm install --no-save playwright
npx playwright install chromium
python3 -m http.server 8765 --bind 127.0.0.1 &
node tests/browser/smoke.cjs
```

No abrir `index.html` mediante `file://`; los JSON se obtienen con `fetch`. GitHub Actions también comprueba sintaxis, JSON y pruebas de navegador Desktop/Mobile con Chromium. Los cambios se hacen en una branch de trabajo; **no fusionar a `main` sin autorización**.

La arquitectura V2 separa contratos editoriales, funcionales y navegador. Para cerrar una sección concreta: `ATLAS_TRIP_ID=mi-viaje ATLAS_QA_MODE=detailed ATLAS_QA_SECTIONS=plan,dias node --test tests/editorial/*.test.cjs`. Usar `general` para estimaciones de alto nivel. El CI normal es incremental; no exige cerrar borradores. Véase [diseño y bitácora V2](docs/testing-architecture-v2.md).

**Alcance del PR:** declarar una línea `Atlas scope: mi-viaje` (varios slugs separados por comas) o `Atlas scope: none` si no se autorizan cambios turísticos. La plantilla `_template` solo se admite cuando se declara expresamente en un PR que no sea `refactor/*`. Las ramas `refactor/*` no pueden modificar JSON de viajes ni la plantilla. El CI compara el árbol real con la base del PR; una edición de su descripción vuelve a activar la comprobación. Para reproducir localmente: `ATLAS_SCOPE_BASE=<SHA-base> ATLAS_SCOPE_TRIPS=mi-viaje node --test tests/editorial/change-scope.test.cjs`. Usar una cadena vacía para alcance sin viajes. La comparación local de deuda requiere `ATLAS_QA_BASE=<SHA-base>`; sin ella los diagnósticos no prueban ausencia de regresiones.
