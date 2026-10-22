# Atlas de Viajes

Sitio de itinerarios y presupuestos: **https://jesusriddle.github.io/atlas-viajes/**. HTML, CSS, JavaScript y JSON; publicado con GitHub Pages.

## Crear un viaje nuevo

Con Node.js, ejecutar **uno** de estos comandos desde la raíz del repositorio:

```bash
# Desde cero
node scripts/new-trip.cjs mi-viaje "Nombre del viaje"

# Basado en un viaje antiguo
node scripts/new-trip.cjs mi-viaje "Nombre del viaje" --from espana-portugal
```

El comando crea `data/trips/mi-viaje.json` y registra el viaje en `modules.js` con `available: false` (oculto). Rechaza IDs repetidos y no modifica el viaje original. Desde un viaje antiguo solo copia ciudades y experiencias como **referencias por revisar**; no copia fechas, reservas ni precios.

Completar progresivamente el JSON siguiendo [`_template.json`](data/trips/_template.json) y el [contrato de datos](docs/trip-data-contract.md). `null`, campos omitidos y listas vacías indican pendientes; nunca usar `0` para un precio desconocido. El modelo visual es **Emilia-Romagna** y sus nueve secciones, no sus datos.

Tras verificar Desktop/Mobile, activar el nuevo registro cambiando `available` a `true`. Para más detalles sobre viajes antiguos: [piloto de reutilización](docs/legacy-migration-pilot.md).

## Probar localmente

```bash
python3 -m http.server 8765
# Abrir http://localhost:8765/
node --test tests/*.test.cjs
```

No abrir `index.html` mediante `file://`; los JSON se obtienen con `fetch`. GitHub Actions también comprueba sintaxis, JSON y pruebas de navegador Desktop/Mobile con Chromium. Los cambios se hacen en una branch de trabajo; **no fusionar a `main` sin autorización**.
