# Atlas de Viajes

Sitio de itinerarios y presupuestos: **https://jesusriddle.github.io/atlas-viajes/**. HTML, CSS, JavaScript y JSON; publicado con GitHub Pages.

## Crear un viaje nuevo

Crear un viaje visible desde el primer registro, aunque todavía esté incompleto:

```bash
node scripts/new-trip.cjs mi-viaje "Nombre del viaje"
```

El comando crea `data/trips/mi-viaje.json`, registra el viaje en `modules.js` con `available: true` (visible de inmediato en la versión de la rama, sin etiquetas de estado) y genera automáticamente `docs/trip-progress/mi-viaje.md` para controlar las etapas y auditorías. Rechaza IDs repetidos. **No lee, copia ni modifica viajes antiguos.**

Antes de redactar, consultar [AGENTS.md](AGENTS.md) y la [guía editorial de las nueve secciones](docs/trip-editorial-guide.md); la guía define qué va en cada sección, qué debe excluirse y cómo usar `introHighlights` para las negritas del panorama.

**Orden:** preparar restricciones, vuelos y bases → esqueleto diario y reservas imprescindibles → panorama → mapa → temporadas → experiencias → reservas → movilidad → hoteles → día por día detallado → presupuesto → auditoría final. Ver los criterios y dependencias en la guía editorial; comprobar `docs/trip-master-standard.md` al finalizar cada sección.

Completar progresivamente el JSON siguiendo [`_template.json`](data/trips/_template.json) y el [contrato de datos](docs/trip-data-contract.md). `null`, campos omitidos y listas vacías indican pendientes; nunca usar `0` para un precio desconocido. El modelo visual está definido de forma autónoma en [`docs/trip-master-standard.md`](docs/trip-master-standard.md), con nueve secciones; no depende del JSON de ningún viaje.

Si buscas inspiración en un viaje antiguo, proporciona su JSON a la IA como **contexto** y decide junto con ella, campo por campo, qué añadir al JSON nuevo. No existe ninguna migración automática. Tras verificar Desktop/Mobile, activar el registro con `available: true`.

## Ejecución autónoma y seguimiento

Después de acordar destinos, restricciones y alcance, «**refléjalo en el Atlas**» activa el flujo de etapas **00–13** sin confirmaciones para cada sección. El **orden de llenado** sigue dependencias: primero **Temporadas (02)** con las ciudades candidatas, después calendario/ruta (03), mapa, experiencias, reservas, conexiones, alojamientos y día por día; Panorama (10) resume el recorrido, **Presupuesto (11)** integra todos los costos, y fotos/portada y QA cierran el proceso. **El orden visual del sitio no cambia.**

El generador crea automáticamente `docs/trip-progress/<slug>.md` desde [la plantilla de progreso](docs/trip-progress-template.md), registrando etapas verificadas, auditorías **A (03), B (08), C (11), D (13)**, decisiones bloqueantes y siguiente acción. Normativa en [AGENTS.md](AGENTS.md), [guía editorial](docs/trip-editorial-guide.md) y [checklist de producción](docs/trip-production-checklist.md). No se realizan compras ni merge sin aprobación.

## Probar localmente

```bash
python3 -m http.server 8765
# Abrir http://localhost:8765/
node --test tests/*.test.cjs
```

No abrir `index.html` mediante `file://`; los JSON se obtienen con `fetch`. GitHub Actions también comprueba sintaxis, JSON y pruebas de navegador Desktop/Mobile con Chromium. Los cambios se hacen en una branch de trabajo; **no fusionar a `main` sin autorización**.
