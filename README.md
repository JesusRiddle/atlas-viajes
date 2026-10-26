# Atlas de Viajes

Sitio de itinerarios y presupuestos: **https://jesusriddle.github.io/atlas-viajes/**. HTML, CSS, JavaScript y JSON; publicado con GitHub Pages.

## Crear un viaje nuevo

Crear un borrador vacío desde la raíz del repositorio:

```bash
node scripts/new-trip.cjs mi-viaje "Nombre del viaje"
```

El comando crea `data/trips/mi-viaje.json` y registra el viaje en `modules.js` con `available: false` (oculto). Rechaza IDs repetidos. **No lee, copia ni modifica viajes antiguos.**

Antes de redactar, consultar [AGENTS.md](AGENTS.md) y la [guía editorial de las nueve secciones](docs/trip-editorial-guide.md); la guía define qué va en cada sección, qué debe excluirse y cómo usar `introHighlights` para las negritas del panorama.

**Orden:** preparar restricciones, vuelos y bases → esqueleto diario y reservas imprescindibles → panorama → mapa → temporadas → experiencias → reservas → movilidad → hoteles → día por día detallado → presupuesto → auditoría final. Ver los criterios y dependencias en la guía editorial; comprobar el diseño de Emilia-Romagna al finalizar cada sección.

Completar progresivamente el JSON siguiendo [`_template.json`](data/trips/_template.json) y el [contrato de datos](docs/trip-data-contract.md). `null`, campos omitidos y listas vacías indican pendientes; nunca usar `0` para un precio desconocido. El modelo visual es **Emilia-Romagna** y sus nueve secciones, no sus datos.

Si buscas inspiración en un viaje antiguo, proporciona su JSON a la IA como **contexto** y decide junto con ella, campo por campo, qué añadir al JSON nuevo. No existe ninguna migración automática. Tras verificar Desktop/Mobile, activar el registro con `available: true`.

## Probar localmente

```bash
python3 -m http.server 8765
# Abrir http://localhost:8765/
node --test tests/*.test.cjs
```

No abrir `index.html` mediante `file://`; los JSON se obtienen con `fetch`. GitHub Actions también comprueba sintaxis, JSON y pruebas de navegador Desktop/Mobile con Chromium. Los cambios se hacen en una branch de trabajo; **no fusionar a `main` sin autorización**.
