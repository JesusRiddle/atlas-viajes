# Atlas de Viajes

Atlas personal para explorar, comparar y planificar viajes. Sitio publicado: **https://jesusriddle.github.io/atlas-viajes/**.

## Arquitectura

Aplicación estática HTML/CSS/JavaScript, sin backend ni compilación. `index.html` carga los módulos JS; `modules.js` registra viajes y determina su orden/visibilidad; `loader.js` carga los JSON de `data/trips/` y completa sus campos con `data/trips/_template.json`. `data/places.json` centraliza lugares y fotografías. `app.js` gestiona rutas; `components/` contiene los renderizadores, presupuestos y controles de transporte.

La vista completa de **Emilia-Romagna** es la referencia visual, con nueve secciones y anclas estables: `plan`, `mapa`, `temporadas`, `experiencias`, `reservas`, `traslados`, `alojamientos`, `dias`, `costes`. Todos los viajes conservan esas secciones aunque falten datos. Más detalles en [estándar maestro](docs/emilia-romagna-master-standard.md) y [contrato de datos](docs/trip-data-contract.md).

## Añadir un viaje

1. Crear `data/trips/<id>.json` con, como mínimo, `{"id":"japon","name":"Japón"}`. El ID debe ser único, en minúsculas, con números y guiones.
2. Añadir `{"id":"japon","file":"japon.json","available":false}` al arreglo de `modules.js`, en la posición deseada.
3. Completar progresivamente el JSON. `null`, `[]` y campos omitidos indican información pendiente; **nunca usar 0 para costos desconocidos**. Los meses sin evaluación permanecen `pending`.
4. Verificar el resultado y cambiar `available` a `true` solo cuando se quiera publicarlo en el catálogo.

Hay dos ejemplos ocultos: `nuevo-viaje.json` (alta mínima) y `espana-portugal-renovado.json` (migración piloto). No son viajes públicos.

## Reutilizar viajes existentes

Los 16 itinerarios heredados se conservan como fuentes; no se sobrescriben. Crear un nuevo JSON con otro ID y copiar únicamente información que siga siendo pertinente, sin asumir que fechas, duración, hoteles ni costos antiguos continúan vigentes. Seguir el [procedimiento de migración](docs/legacy-migration-pilot.md).

## Ejecución local

Abrir la carpeta del proyecto y ejecutar:

```bash
python3 -m http.server 8765
```

Visitar `http://localhost:8765/`. No abrir `index.html` mediante `file://`, porque el cargador obtiene los JSON por `fetch`.

## Pruebas

La branch de trabajo `refactor/atlas-viajes-modulares-20261019` ejecuta GitHub Actions con revisión de sintaxis JS, JSON y tests Node, seguida de Chromium para Desktop (1440 × 900) y Mobile (390 × 844) sobre los 19 registros (17 visibles y 2 ocultos habilitados solo para pruebas).

Para ejecutar las pruebas unitarias localmente:

```bash
node --test tests/*.test.cjs
```

La prueba de navegador requiere Playwright y un servidor HTTP local; está automatizada en `.github/workflows/atlas-checks.yml`. Revisar manualmente los aspectos visuales finos, enlaces externos e interacciones en dispositivos reales antes de publicar.

## Publicación

GitHub Pages sirve la rama de publicación `main`. Los cambios se preparan en `refactor/atlas-viajes-modulares-20261019`; no fusionar a `main` sin revisión y autorización expresa.
