# Refactorización de pruebas del Atlas — Fase 1: auditoría y línea base

Fecha de auditoría: 2026-11-21  
Alcance: `tests/`, `.github/workflows/atlas-checks.yml` y la ejecución de GitHub Actions.  
Rama de trabajo: `refactor/tests-audit-and-consolidation`. **Solo auditoría: no se modifican los tests, los datos ni la aplicación.**

## Línea base verificable

- **12 archivos de pruebas**: 11 archivos `*.test.cjs` ejecutados con `node --test`, más `browser-smoke.cjs` ejecutado con Playwright.
- **3,290 líneas**, **1,343 llamadas sintácticas a `assert.*(...)`**, **113 declaraciones estáticas `test(...)`** en los 11 archivos del runner Node. Se obtuvieron leyendo los archivos en GitHub; no representan el número real de aserciones ejecutadas dentro de iteraciones ni el número de casos que informa Node.
- **1 fixture de transporte**: `tests/fixtures/transport-regression.json` (~114 KB). Riesgo de crecimiento y datos repetidos; **no borrar sin verificar sus consumidores**.
- Workflow actual: comprobación sintáctica de JS; parseo de todos los JSON de viaje; `node --test tests/*.test.cjs`; instalación de Playwright/Chromium; una pasada completa de `browser-smoke.cjs` en escritorio y móvil.
- Referencia de CI: ejecución [44386534164](https://github.com/JesusRiddle/atlas-viajes/actions/runs/44386534164) en `main`: las validaciones de sintaxis, JSON y tests Node pasaron, pero el smoke falló por esperar 8 tarjetas cuando había 9.
- Referencia de la corrección separada: [PR #20](https://github.com/JesusRiddle/atlas-viajes/pull/20), ejecución [44931894081](https://github.com/JesusRiddle/atlas-viajes/actions/runs/44931894081): la primera discrepancia fue superada, pero el smoke falló después por esperar 7 filas en comparación cuando había 8. **PR #20 pendiente y CI rojo; no considerarlo una base verde.**
- La rama de esta auditoría parte de `main` para no mezclarla con el PR #20. Antes de integrar el PR final de refactorización se deberán resolver ambos cambios y ejecutar las pruebas sobre la rama actualizada.

## Inventario y decisión propuesta

| Archivo | Líneas | Aserciones sintácticas | Casos `test()` | Clasificación | Acción de fase posterior |
|---|---:|---:|---:|---|---|
| `browser-smoke.cjs` | 778 | 296 | — | Crítico + frágil | Mantener smoke real desktop/mobile; quitar aserciones de itinerarios y números fijos; verificar navegación, ausencia de errores, nueve secciones, overflow y accesibilidad básica. |
| `colombia-2027.test.cjs` | 316 | 228 | 4 | Mixto: integridad + snapshot editorial | Extraer reglas generales reutilizables; conservar solo decisiones contractuales justificadas como snapshots voluntarios. |
| `format-budget-contract.test.cjs` | 34 | 9 | 3 | Crítico y compacto | Conservar; sustituir total numérico de Italia por fixture sintético cuando sea posible. |
| `home-comparison.test.cjs` | 48 | 8 | 3 | Crítico y compacto | Conservar: traducciones y columnas separadas son regresiones verificadas. |
| `loader-regression.test.cjs` | 923 | 369 | 31 | Crítico + repetición + snapshots editoriales | Separar carga/normalización y contratos compartidos de auditorías por destino; reducir solapamiento con browser. |
| `map-stay-labels.test.cjs` | 45 | 12 | 2 | Contrato editorial + contenido | Mantener la regla «nunca Base» y el vínculo noches/alojamientos; desacoplar de Colombia. |
| `new-trip-integration.test.cjs` | 47 | 12 | 1 | Integración relevante | Combinar con `new-trip.test.cjs` sin perder creación incremental y no sobrescritura. |
| `new-trip.test.cjs` | 32 | 7 | 1 | Parcialmente solapado | Consolidar con prueba de integración. |
| `patagonia-regression.test.cjs` | 157 | 74 | 10 | Mixto: integridad + contenido | Llevar invariantes generales al validador; dejar snapshots específicos fuera del CI bloqueante. |
| `transport-budget.test.cjs` | 410 | 142 | 32 | Lógica crítica | Conservar lógica de zonas horarias, selección de tarifas, costos y no duplicación; eliminar aserciones editoriales específicas del destino. |
| `trip-editorial.test.cjs` | 396 | 156 | 22 | Contratos editoriales + Italia fija | Conservar reglas universales y separar auditorías de contenido (fechas, hoteles, precios). |
| `trip-production-workflow.test.cjs` | 104 | 30 | 4 | Documentación/proceso + generador | Mantener funcionalidad del generador; mover sincronización textual de documentos a comprobación no bloqueante/manual si no justifica bloquear cada PR. |

**Clasificación:** «crítico» significa protección de comportamiento; «frágil» indica expectativas legítimamente cambiantes; «solapado» significa cobertura conceptual repetida, **no equivalencia demostrada de cada aserción**. No autoriza borrado automático.

## Mapa de posibles solapamientos (pendiente de prueba de equivalencia)

1. **Catálogo y portada:** `browser-smoke`, `loader-regression`, `home-comparison`. Un contrato fuente de verdad para qué viajes son visibles; navegador solo verifica render y orden.
2. **Fechas/noches/hoteles:** `colombia-2027`, `patagonia-regression`, `trip-editorial`, `loader-regression`, `map-stay-labels` y smoke. Usar invariantes reutilizables; no fijar calendarios en el CI.
3. **Presupuestos y transporte:** `transport-budget`, `format-budget-contract`, `patagonia-regression`, `trip-editorial`, smoke. Lógica en pruebas unitarias con fixtures; smoke comprueba que se muestra sin `NaN`.
4. **Nueve secciones, clima, indicadores y textos:** `loader-regression`, `trip-editorial`, smoke. Separar contrato editorial de estructura DOM; no repetir afirmaciones literales por destino en varios niveles.
5. **Creación de viaje:** `new-trip.test`, `new-trip-integration.test`, `trip-production-workflow.test`. Una prueba pequeña del comando + un flujo de integración; documentación fuera de ruta crítica.
6. **Fotografías y créditos:** tests de Colombia, Patagonia, Italia, Suiza en loader y browser. Validador genérico de referencias/atribución, sin fijar cantidad exacta de fotografías.
7. **«Bases» como texto visible:** mantener el contrato editorial de etiqueta en UI. No sustituir automáticamente campos internos históricos `bases`: su uso en el esquema de datos es diferente al texto que se presenta al usuario.

## Qué no debe perderse

- Parseo/sintaxis y consistencia de IDs, rutas de archivos y referencias de imágenes.
- Validación de fechas reales y de intervalos, noches sin superposición, y ausencia de campos inventados para datos incompletos.
- Cálculo monetario, tarifas mutuamente excluyentes, cambio de divisas, noche de alojamiento y ausencia de doble contabilización.
- Normalización/carga de datos incompletos y compatibilidad con viajes heredados.
- No sobrescritura al crear viajes; flujo de alta y renderización.
- Traducciones al español, nombres editoriales (por ejemplo «Tus alojamientos.»), no mostrar «Bases» en UI, etiquetas de presupuesto y clima correcto.
- Navegación, nueve secciones, errores de consola o `undefined`/`NaN`, layout y overflow en escritorio y móvil.
- El CI debe fallar por un defecto de comportamiento y **no** porque cambió legítimamente un hotel, un total cotizado o el número de viajes.

## Reglas de decisión para fases 2–4

- **Conservar:** prueba que cubre una decisión o fallo real y tiene aserción significativa.
- **Consolidar:** dos pruebas evalúan la misma propiedad con los mismos datos/capa; elegir la más barata y precisa, conservando una prueba de integración por ruta importante.
- **Generalizar:** constante de itinerario convertible en invariante de esquema, relación entre datos o derivación desde `modules.js`.
- **Mover a auditoría optativa:** reglas de aprobación editorial con fechas, nombres propios, importes o textos sujetos a cambio. No eliminar de forma irreversible sin justificar.
- **Eliminar:** solo después de documentar la aserción sustituta o demostrar que no agrega señal, y comprobar que la suite vuelve a detectar el defecto simulado.
- **Aserciones de contenido intencional:** permitir fixtures/snapshots versionados si se ejecutan fuera del CI obligatorio o si un contrato de producto exige literalidad, con dueño explícito.

## Criterios de salida

**Fase 1 (esta entrega):** inventario y cifras, mapa de solapamientos, riesgos, política de conservación y baseline de CI documentados. No implica CI verde.

**Fase 2:** consolidación funcional por dominios; registrar pruebas antes/después, cobertura conservada, y fallo reproducible ante regresiones críticas.

**Fase 3:** desacoplar destinos y eliminar números/literales rígidos del pipeline; los cambios de rutas/precios legítimos no deben romperlo, mientras los datos inválidos sí.

**Fase 4:** reducir el smoke, depurar workflow y ejecutar Node + navegador en escritorio y móvil; PR final solo tras checks en verde y revisión de diff. No hacer merge automático.

## Riesgos y límites de esta auditoría

Los conteos son **estáticos** y no sustituyen una medición instrumentada de cobertura o mutación. «Redundancia» aquí es hipótesis a verificar por contrato, no señal para borrar tests. La prueba Playwright contiene bucles por viaje y dos viewports, por lo que sus 296 llamadas a `assert` pueden ejecutar muchas más comprobaciones. Tampoco se midieron duración, flakiness ni porcentaje de cobertura: registrar esas métricas en la siguiente fase antes de recortar.

## Fase 2 — consolidación funcional (2026-11-21)

### Cambios realizados

- `tests/new-trip.test.cjs`: concentra **dos escenarios** separados, con un único arnés `withSandbox` que crea archivos de prueba en un directorio temporal y limpia al terminar incluso si el escenario es asíncrono.
  1. Alta real, JSON mínimo, bitácora, registro y protección contra duplicados/copias que puedan sobrescribir originales.
  2. Edición incremental y normalización del loader sin perder contenido ni inventar campos pendientes.
- `tests/new-trip-integration.test.cjs`: eliminado **solo tras trasladar** sus comprobaciones al archivo consolidado.
- `tests/trip-production-workflow.test.cjs`: se dejan las **tres pruebas documentales**; la cuarta, que volvía a ejercitar el generador, queda cubierta por el escenario funcional consolidado.

**Controles preservados:** rechazo de duplicado, no sobrescritura, JSON básico, `travelerCount: null`, introducciones pendientes, `modules.js`, bitácora con etapa 00/01 y ruta del JSON, edición gradual, normalización de 12 meses, colecciones ausentes y no mutación del archivo. El flujo de documentación sigue bajo su propio contrato.

### Delta verificable y alcance

| Métrica de los archivos intervenidos | Antes | Después |
|---|---:|---:|
| Archivos | 3 | 2 |
| Declaraciones `test()` | 6 | 5 |
| Código del generador/alta | 2 arneses independientes + 1 tercer sandbox | 1 arnés compartido |
| Escenarios críticos de alta | Creación, duplicados, integración | Conservados |

Se hicieron comprobaciones de **sintaxis** de los dos archivos actualizados. No se ejecutó todavía `node --test` sobre un checkout completo ni Playwright: el workflow no se dispara por `push` a esta rama y se mantiene la decisión de abrir un solo PR al final. No se declara CI verde ni cobertura equivalente de manera experimental.

### Pendientes que no se deben confundir con cobertura eliminable

- Presupuestos, hoteles y rutas comparten conceptos entre archivos pero **no se eliminan** hasta extraer helpers y demostrar equivalencia (fases 3/4).
- El PR #20 sigue separado. Su fallo posterior (comparativa 8 vs 7) no se corrige en esta fase.
- El generador actual no valida mediante parseo el contenido final de `modules.js` cuando parte de un catálogo vacío. Es un posible caso límite de la aplicación, **no atribuible a la consolidación**; investigar fuera de esta refactorización de tests o incorporar un caso explícito de regresión con su corrección.

### Siguiente control antes del merge

Actualizar esta rama respecto de `main` y el PR #20 resuelto, abrir el PR final, ejecutar toda la suite y comprobar que la eliminación del escenario redundante no degrada la detección de regresiones. La fase 3 extraerá invariantes generales de los datos de los viajes; no se retirarán comprobaciones numéricas hasta tener reemplazos funcionales.

## Fase 3 — desacoplamiento parcial del catálogo (2026-11-21)

- Se sustituyeron conteos fijos de la portada y de tarjetas de ideas por el catálogo de módulos disponibles.
- El orden esperado de la portada se deriva de las fechas de inicio de los JSON de los viajes principales, y no de una lista fija de ocho IDs.
- La comparación comprueba que sus viajes pertenecen a los principales, aparecen sin duplicados, y siguen el orden cronológico; el número de personas se compara contra el `travelerCount` real del viaje, no contra un arreglo fijo.
- La tarjeta de Patagonia conserva la comprobación de presentación del presupuesto por persona, sin fijar los dos importes de una cotización.
- Se preservaron los contratos de navegación, encabezados, traducciones, etiquetas laborales, layout y existencia de los viajes históricos.

### Limitaciones y pendientes

- La fase 3 no elimina todos los snapshots por destino: otras aserciones de Orlando, Patagonia, Italia y Suiza continúan fijando valores particulares y requieren decidir explícitamente qué migrar antes del PR final.
- Comprobación hecha: sintaxis JavaScript de `browser-smoke.cjs` evaluada con parser V8. **No se ejecutaron pruebas de navegador ni de la suite Node contra un checkout real**, por lo que no se afirma que el pipeline esté verde.
- El PR #20 independiente utiliza una solución parcial para las mismas aserciones; **no fusionar ambas implementaciones a ciegas**. La rama de refactorización contiene la generalización más completa, pero debe integrarse y validarse primero en una ejecución real.
- Existe el riesgo de que la comparación excluya viajes que no tengan datos suficientes. La prueba valida el subconjunto y el orden; la cobertura de elegibilidad se mantiene en las pruebas de loader/formato, no queda demostrada en este smoke.

### Próxima fase

Reducir las aserciones editoriales restantes del smoke de forma controlada, revisar la compatibilidad con el PR #20, ejecutar Node y Playwright en GitHub Actions, y resolver las regresiones que aparezcan antes de proponer el merge.

## Auditoría retrospectiva de las fases 1–3 — correcciones previas a fase 4

Fecha: 2026-11-21. Revisión de los archivos modificados y de las aserciones que sustituyeron snapshots.

### Hallazgos y resoluciones

1. **Defecto real en el generador con catálogo vacío (corregido).** `scripts/new-trip.cjs` insertaba incondicionalmente una coma antes de la primera entrada del arreglo. El proceso terminaba con estado 0, pero `modules.js` resultaba sintácticamente inválido. Se hace depender el separador de la existencia de elementos. Se añadieron verificaciones con `vm.runInNewContext` en `tests/new-trip.test.cjs` tanto para catálogo vacío como para catálogo existente, comprobando IDs y ejecución efectiva del módulo.
2. **Falso positivo por comparación parcial (corregido).** La fase 3 verificaba `comparedIds === chronologicalIds.filter(id => comparedIds.includes(id))`, que toleraba omitir cualquier viaje. Ahora se deriva el conjunto completo de viajes comparables desde los objetos normalizados en `window.ATLAS_READY` y la elegibilidad que utiliza la aplicación. Se exige equivalencia completa (miembros y orden) además de ausencia de duplicados.
3. **Arnés asíncrono (revisado).** `withSandbox` espera `runScenario` antes del bloque `finally`, por lo que los archivos temporales permanecen mientras el loader asíncrono los usa.
4. **Presupuesto de Italia (sin modificación).** La fase 3 solo desacopló la portada/comparativa y un snapshot de Patagonia. El archivo `tests/format-budget-contract.test.cjs` conserva su total fijo, todavía pendiente de la simplificación final. No documentar una eliminación que no ocurrió.
5. **PR #20 (pendiente).** Sigue abierto y su ejecución del CI conocida está roja. Los cambios del PR #20 y los del smoke de esta rama modifican las mismas aserciones: resolver en fase 4, no encadenar los dos cambios sin revisar el diff.

### Validación realmente realizada

- Parser JavaScript V8: `tests/new-trip.test.cjs`, `tests/browser-smoke.cjs`, `tests/trip-production-workflow.test.cjs` y `scripts/new-trip.cjs` (quitando el shebang para la comprobación mediante `new Function`) sin errores sintácticos.
- Se añadieron pruebas de ejecución del catálogo generado, vacío y con entradas previas, para detectar errores de sintaxis al registrar viajes. La validación integral se realizó posteriormente mediante GitHub Actions.
- Antes de abrir el PR final no era posible clonar GitHub desde el entorno local por un error de DNS. Posteriormente se abrió el PR #21 y se ejecutó la suite real en GitHub Actions.

### Decisión

**Apta para entrar a la fase 4 (validación integral), no apta para merge.** No avanzar al merge sin corregir los fallos que revele CI. Se recomienda que la fase 4 ejecute la suite real, verifique regresiones en escritorio/móvil, cierre el conflicto de expectativas con el PR #20 y deje un PR final revisable.

## Fase 4 — validación e integración final (2026-11-21)

- Se abrió el [PR #21](https://github.com/JesusRiddle/atlas-viajes/pull/21) como único PR de la refactorización.
- La ejecución [44935303568](https://github.com/JesusRiddle/atlas-viajes/actions/runs/44935303568) detectó otro número fijo en la prueba de alta incremental: esperaba 9 tarjetas cuando el catálogo contiene 9 viajes principales más el fixture.
- Se cambió esa expectativa a `primaryModules.length + 1` y el número de ideas a `ideaModules.length`.
- La ejecución [44935439613](https://github.com/JesusRiddle/atlas-viajes/actions/runs/44935439613) terminó **con éxito**, incluyendo sintaxis JS, JSON, tests Node y Playwright en los dos viewports (1440 × 900 y 390 × 844).
- Se actualizaron las acciones de GitHub `checkout@v4` y `setup-node@v4` a `@v5` para evitar la dependencia del runtime Node 20 descontinuado. Se requiere una ejecución verde adicional sobre ese último commit.
- El PR #20 contiene una corrección parcial y superpuesta de la portada; **no debe fusionarse por separado** si se integra el PR #21.

### Resultado y límite de alcance

Se conserva el comportamiento del Atlas y no se modificaron archivos de itinerarios. La consolidación redujo un archivo de pruebas y agrupó la creación de viajes. Las validaciones principales de catálogo y comparativa ya no dependen de un conteo fijo, aunque **aún existen snapshots específicos de viajes** en `browser-smoke.cjs`, `loader-regression.test.cjs` y otros tests. Una eliminación masiva de esas aserciones sin cobertura sustituta no sería segura; queda como mejora posterior, separada de este PR.

**Criterio de cierre:** mantener el PR en borrador si los últimos checks aún no pasan. Cuando GitHub Actions confirme verde sobre el commit final, marcar el PR listo para revisión, cerrar el PR #20 como supersedido y no hacer merge automático.
