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
