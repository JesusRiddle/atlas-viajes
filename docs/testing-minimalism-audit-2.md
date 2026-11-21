# Segunda auditoría de minimalismo de tests — 2026-11-21

Esta auditoría usa como línea base el PR #21 (`refactor/tests-audit-and-consolidation`), no la rama `main` anterior.

## Línea base

- 11 archivos de test, 3,313 líneas, 1,341 llamadas estáticas a `assert.*()` y 112 declaraciones `test()` de Node. La ejecución del navegador no se cuenta como `test()` porque es un script independiente.
- Último CI verde conocido de la base: [44935629087](https://github.com/JesusRiddle/atlas-viajes/actions/runs/44935629087), Node + Playwright escritorio y móvil.
- No hay todavía medición instrumentada de coverage, mutation score ni tiempos de cada test. **No podemos afirmar un mínimo matemático** ni eliminar todas las pruebas de un destino sin medir la pérdida de detección.

## Diagnóstico por coste y señal

| Grupo | Hallazgo | Riesgo | Decisión |
|---|---|---|---|
| `browser-smoke.cjs` (803 líneas, 297 aserciones estáticas) | Duplica expectativas de importes y detalles de itinerarios que Node ya valida, y recorre todas las rutas en dos viewports | Alto: smoke lento y frágil | Separar smoke esencial (UI/navegación) de auditoría editorial opcional en fase posterior; no perder cobertura de errores de navegador |
| `loader-regression.test.cjs` (923, 369) | Mezcla normalización de esquema con snapshots de Suiza y contratos de UI | Alto | Extraer por responsabilidades y probar invariantes compartidas antes de borrar snapshots |
| `colombia-2027.test.cjs` (316, 228) | Incluye conteos y decisiones editoriales (p.ej. imágenes, hoteles, tours) | Alto | Conservar coherencia de datos y créditos; mover snapshots de aprobación de contenido fuera del CI obligatorio |
| `trip-editorial.test.cjs` (396, 156) | Numerosas expectativas ligadas a Italia y solapamiento con loader/smoke | Alto | Contratos editoriales genéricos vs. revisión editorial específica |
| `transport-budget.test.cjs` (410, 142) | Mezcla reglas financieras críticas con vuelos/trenes actuales | Medio-alto | Mantener cálculos, divisas y no duplicación; progresivamente usar fixtures sintéticos |
| `patagonia-regression.test.cjs` (157, 74) | Datos de itinerario y fórmulas mezclados | Medio | Migrar invariantes de hotel/noches/gastos a validadores genéricos |
| `trip-production-workflow.test.cjs` (66, 19) | Tres verificaciones principalmente de redacción documental | Medio | Mantener auditoría documental ejecutable, pero evaluar moverla a check optativo |
| `format-budget-contract.test.cjs` (34, 9) | Utilizaba un total real fijo de Italia como pseudo-contrato; aserciones redundantes de elegibilidad | Bajo | **Fase A: sustituir por dos casos sintéticos con resultado conocido** |
| `home-comparison.test.cjs`, `map-stay-labels.test.cjs`, `new-trip.test.cjs` | Protegen defectos históricos y flujo de alta con coste relativamente bajo | Bajo | Conservar hasta demostrar un solapamiento exacto |

## Plan por fases con criterios de salida

**Fase A — pruebas pequeñas desacopladas (iniciada en esta rama):**
Sustituir el total `81,315.20` de Italia por un dato sintético `1,234.50 MXN` y mantener una prueba de rango histórico. Eliminar una tercera prueba que comprobaba de nuevo la misma elegibilidad con presupuesto estructurado. Verificar en CI los resultados explícitos `$1,234.50` y `$50,000–$65,000`. No tocar JSON.

**Fase B — contratos compartidos y coste:**
Extraer validadores reutilizables de integridad de datos, detectar solapamientos exactos entre loader/editorial/Colombia/Patagonia; retirar solamente aserciones con reemplazo demostrado. Registrar pruebas antes/después y, si es posible, un fallo deliberado de un fixture alterado.

**Fase C — browser mínimo:**
Dejar un recorrido de humo real de portada, navegación, las nueve secciones, errores de JavaScript, render, overflow y escritorio/móvil. Trasladar comprobaciones de contenido particular a suite editorial explícita. Comparar el tiempo de ejecución antes y después.

**Fase D — workflow y comprobación final:**
Separar los checks bloqueantes de lógica/renderizado de la auditoría documental opcional, únicamente si se puede invocar esta última manualmente. Confirmar Node + Playwright en GitHub Actions, revisar el diff y no hacer merge automático.

## Guardarraíles

- No convertir pruebas exactas de cálculo en simples `Number.isFinite` que acepten resultados equivocados.
- No interpretar la eliminación de líneas o aserciones como mejor calidad sin sustituir cobertura importante.
- No modificar rutas, alojamientos, fotos, reservas ni importes reales de viajes.
- La rama de esta ronda parte del PR #21, que todavía no está fusionado a `main`. Su PR debe apuntar a esa rama hasta que #21 sea integrado, para evitar presentar de nuevo sus cambios como propios.

## Fase B — revisión de equivalencia y primer recorte seguro (2026-11-21)

### Cobertura concreta retirada

Se eliminó el caso `manual y agente establecen el flujo 00–13 y las cuatro auditorías` de `tests/trip-editorial.test.cjs` (un `test()`, 18 líneas de cuerpo, cuatro llamadas estáticas a `assert` con bucles).

Su contenido estaba duplicado por:
- `tests/trip-production-workflow.test.cjs`: comprueba 14 etapas consecutivas de 00 a 13, las auditorías A/B/C/D, su posición y el orden de elaboración;
- en el mismo archivo, verifica que AGENTS, guía editorial, README y checklist referencian la plantilla del progreso y comparten las etapas;
- `tests/trip-editorial.test.cjs`, primer caso, sigue verificando la existencia de las nueve secciones, el enlace a la guía editorial y `introHighlights`.

**No se eliminó** ningún caso de Colombia o Patagonia: verifican coherencia particular de las fechas, referencias a hoteles, vuelos, importes y fotos, y no existe todavía un reemplazo genérico probado que detecte esos mismos errores. Tampoco se borraron snapshots sin un criterio explícito de aceptación.

### Estado y validación

Los dos archivos modificados en esta ronda se comprobaron mediante parser JavaScript V8 y los contratos numéricos sintéticos de presupuesto produjeron los valores esperados al invocar los módulos correspondientes. Esto **no equivale** a ejecutar `node --test` ni Playwright completos sobre la rama. El PR #22 está basado en #21, cuyo workflow solo se dispara automáticamente en PR dirigidos a `main`; hace falta validación CI real del conjunto antes de fusionar.

### Siguientes pasos

La fase C debe recortar el smoke para que solo valide comportamiento visual y navegación; requiere primero medir y preservar los casos de error runtime, layout y móvil. No mover auditorías editoriales sin ejecutar comparaciones antes/después de los tests.

### Registro de ejecución

Se solicitó la validación del PR #22 frente a `main` únicamente para activar el workflow configurado en GitHub Actions; la base prevista para integrar sigue siendo la rama del PR #21. El resultado debe comprobarse contra el SHA de este commit antes de declarar la fase validada.

## Fase C — Playwright por niveles (2026-11-21)

Se mantiene un único ejecutable `tests/browser-smoke.cjs` para no duplicar inicialización de navegador, catálogos, servidor y dos viewports. **El modo predeterminado sigue recorriendo todos los viajes disponibles en escritorio 1440 × 900 y móvil 390 × 844**, y conserva:

- portada, composición del hero, preferencias de movimiento reducido, tarjeta visual y comparativa completa;
- inclusión de los viajes principales y archivo de ideas sin números fijos;
- todas las rutas de viaje, nueve anclas, navegación, título de alojamientos, tipografía del mapa, encabezados de hoteles sin overflow, ausencia de `NaN`/`undefined` y overflow horizontal;
- recorrido de integración de Italia, expandir/colapsar días, navegación desde la barra fija, y alta de viaje incremental desde catálogo modificado;
- recopilación y fallo por errores `pageerror` del navegador.

**Auditoría profunda opcional**: `ATLAS_EDITORIAL_AUDIT=1 node tests/browser-smoke.cjs`, con el servidor de desarrollo en `http://127.0.0.1:8765/`. Ejecuta adicionalmente las comprobaciones particulares de Orlando, Colombia, Suiza nevada y Patagonia (importes, hoteles, enlaces, textos de tours, fechas, fotografías, fichas de traslado y capturas de pantalla). Se conservaron, no se borraron, para poder ejecutarlas en revisiones editoriales deliberadas.

Se eliminaron del smoke predeterminado dos expectativas de Orlando (fechas y días laborales concretos) y el importe exacto de su portada; todas siguen bajo la opción editorial. Se reemplazó el número fijo de 14 días de Italia por `tripById.get('italia-norte-2027').days.length` en la navegación y el expandir/colapsar, conservando la prueba de interacción real.

**Advertencia de riesgo**: la profundidad de la auditoría no se ejecuta en cada PR y puede quedar desfasada mientras evolucionan los viajes. Antes de publicar una revisión importante de un itinerario debe ejecutarse con `ATLAS_EDITORIAL_AUDIT=1`; en fase D se evaluará formalizar esta ejecución como job manual o bajo demanda. Esta fase reduce el coste de CI, **no reduce todavía en forma significativa el número de líneas del archivo** porque se optó por preservar los escenarios documentales en vez de eliminarlos.

### Puerta de validación de fase C

La validación requerida es la ejecución de `Atlas checks` contra el commit actual: sintaxis, JSON, `node --test` y smoke de Chromium en ambos tamaños. El modo editorial optativo se ejecutará en las auditorías de contenido y no constituye el requisito bloqueante para cada PR de código.

## Fase D — workflow, métricas y aceptación (2026-11-21)

### Configuración

El workflow `.github/workflows/atlas-checks.yml` admite ahora un parámetro booleano `editorial_audit` en `workflow_dispatch`, desactivado por defecto. El job de regresión siempre valida sintaxis, JSON, Node y el smoke de Playwright en escritorio y móvil. **Solo si se lanza manualmente con `editorial_audit = true`**, añade un segundo pase del mismo script con `ATLAS_EDITORIAL_AUDIT=1`; se reutilizan la instalación de Chromium y el servidor local del job. Un fallo profundo marca la ejecución manual como fallida.

Uso en GitHub Actions: abrir **Atlas checks** → **Run workflow** → elegir la rama que contiene el cambio (o `main` tras el merge) → activar **Ejecutar además la auditoría editorial profunda de itinerarios** → ejecutar. También puede ejecutarse localmente arrancando servidor estático en puerto 8765 y usando `ATLAS_EDITORIAL_AUDIT=1 node tests/browser-smoke.cjs`.

### Comparación de duración observada

Fuente: timestamps en logs de jobs de GitHub Actions (misma plataforma, ejecutados consecutivamente el 21 de noviembre de 2026).

| Recorrido | Comando lanzado | Mensaje de éxito | Duración aproximada |
|---|---|---|---:|
| Smoke original con auditoría editorial completa: [44936953190](https://github.com/JesusRiddle/atlas-viajes/actions/runs/44936953190) | 18:42:45.302 UTC | 18:43:04.134 UTC | 18.83 s |
| Smoke reducido: [44937260582](https://github.com/JesusRiddle/atlas-viajes/actions/runs/44937260582) | 18:45:59.410 UTC | 18:46:13.461 UTC | 14.05 s |

Diferencia aproximada: **4.78 s menos (25.4 %)** para el paso navegador. Son dos mediciones, no un benchmark estadísticamente robusto; no prueban mejora de la misma magnitud en el tiempo total del pipeline, donde instalar Chromium y dependencias sigue teniendo peso. No se redujo el recorrido de destinos/viewport del smoke obligatorio.

### Estado de cobertura y límites

- Fase A: contratos de presupuesto sintéticos y valores exactos.
- Fase B: una duplicación editorial retirada sin perder el verificador que la cubre.
- Fase C: expectativas editoriales profundas retenidas en modo optativo; smoke de interfaz obligatorio y CI verde antes del cambio de workflow.
- Fase D: mecanismo manual para la auditoría y medición reproducible documentada.

**No se afirma que el código de pruebas sea el mínimo absoluto**: persisten snapshots por destino y un archivo de navegador voluminoso. La meta alcanzada es distinguir claramente pruebas bloqueantes de exploración editorial, con cobertura conservada en modo bajo demanda. Para una futura ronda, exigir medidas de cobertura/mutación antes de borrar aserciones adicionales.

**Puerta de salida:** verificar `Atlas checks` verde sobre el commit final del PR #22 (JSON, Node, desktop/mobile), PR #22 dependiente de #21, no fusionar automáticamente. La ejecución manual con `editorial_audit=true` queda disponible después de integrar el workflow en la rama elegida; no hay constancia de que se haya ejecutado en esta fase.
