# Atlas de Viajes

Sitio de itinerarios y presupuestos: **https://jesusriddle.github.io/atlas-viajes/**. HTML, CSS, JavaScript y JSON; publicado con GitHub Pages.

## Crear un viaje nuevo

**1. Crear** `data/trips/mi-viaje.json` con lo mínimo:

```json
{
  "id": "mi-viaje",
  "name": "Nombre del viaje",
  "status": "draft"
}
```

El `id` debe ser único y usar minúsculas, números y guiones. Para conocer los campos disponibles, consultar [`_template.json`](data/trips/_template.json); **no es necesario copiarlo entero**. El cargador `loader.js` completa los campos omitidos.

**2. Registrar** el viaje en `modules.js` en la posición deseada:

```js
{ "id": "mi-viaje", "file": "mi-viaje.json", "available": false }
```

`available: false` lo mantiene oculto; para revisarlo en el navegador, activarlo temporalmente y volver a ocultarlo hasta su publicación.

**3. Completar** el JSON poco a poco. Dejar desconocidos en `null`, listas vacías o campos omitidos; nunca introducir precios ficticios ni usar `0` como «pendiente». Las temporadas no investigadas quedan en `pending`. El Atlas siempre muestra las nueve secciones maestras: Panorama, Mapa, Temporadas, Experiencias, Reservaciones, Traslados, Alojamientos, Día por día y Presupuesto.

**4. Revisar y publicar:** comprobar contenido, vínculos, fechas, cifras y vista Desktop/Mobile; después cambiar `available` a `true`.

### ¿Desde cero o a partir de un viaje antiguo?

- **Desde cero:** comenzar con el JSON mínimo anterior.
- **Basado en un viaje antiguo:** crear **otro** JSON con un `id` nuevo. Reutilizar solo contenido vigente, revisando ciudades, experiencias y textos. No arrastrar fechas, reservas, hoteles ni precios sin confirmarlos. Los viajes antiguos no se modifican.

El viaje **Emilia-Romagna** es la referencia de diseño; **no** es un archivo para duplicar con sus datos. Guías: [contrato JSON](docs/trip-data-contract.md), [estándar visual](docs/emilia-romagna-master-standard.md) y [migración de ejemplo](docs/legacy-migration-pilot.md).

## Probar localmente

```bash
python3 -m http.server 8765
# Abrir http://localhost:8765/
node --test tests/*.test.cjs
```

No abrir `index.html` mediante `file://`; los JSON se obtienen con `fetch`. GitHub Actions también comprueba sintaxis, JSON y pruebas de navegador Desktop/Mobile con Chromium. Los cambios se hacen en una branch de trabajo; **no fusionar a `main` sin autorización**.
