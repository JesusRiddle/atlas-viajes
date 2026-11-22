# Auditoría de tests del Atlas — cierre de fase 5 y plan de saneamiento

Fecha: 2026-11-22 · PR #23 · Rama `refactor/editorial-universal-contracts`.

## Principio rector

La suite protege **contratos editoriales, integridad entre campos, cálculos y representación**, no itinerarios congelados. Deben poder cambiar ciudades, duración, fechas, vuelos, conexiones, proveedores, hoteles, cantidades de actividades, fotos, tarifas y grupos de viajeros. Los cambios coherentes pasan; las inconsistencias se rechazan. Los viajes históricos no se modifican ni se bloquea otra edición para corregir contenido turístico ajeno.

## Evidencia y hallazgos auditados

1. **Catálogo congelado (corregido):** `loader-regression.test.cjs` esperaba 24 viajes, 15 ideas y IDs de destinos concretos. Sustituido por estructura dinámica, IDs únicos y visibilidad de viajes principales.
2. **Instantánea implícita de Italia (corregida):** `trip-editorial.test.cjs` verificaba fechas/noches/segmentos sobre un destino concreto, lógica cubierta también en `dynamic-trip-regressions.test.cjs` y `editorial-relations.test.cjs`. Eliminado el caso redundante. Reemplazada la validación de resaltados solo de Italia por contrato puro y diagnóstico de todos los viajes activos.
3. **Hallazgo editorial histórico (documentado, sin tocar itinerarios):** `suiza-nevada-2027` declara `Lindt Home of Chocolate` entre `introHighlights` aunque no figura literalmente en `intro`. Un refactor de tests no debe reescribir el viaje; corregirlo cuando se trabaje ese itinerario.
4. **Pruebas financieras con importes concretos (conservar):** `transport-budget.test.cjs` opera sobre `tests/fixtures/transport-regression.json` sintético. Cambiar vuelos reales no rompe las pruebas del algoritmo; son regresiones funcionales.
5. **Aislamiento de JSON (parcial):** `editorial-change-scope.cjs` verifica diferencias frente a un alcance explícito, pero no corre como gate universal porque todavía no existe un contrato de alcance por PR.
6. **Reservas hoteleras (parcial):** `editorial-lodging-audit.cjs` detecta inconsistencias textuales explícitas entre candidato y ledger; no demuestra compras, disponibilidad ni revisa todo el DOM.
7. **Geografía e idioma/divisa (humana/externa):** `PAN-05` no puede inferirse del código ISO ni de nombres de ciudades. Se requiere país por parada y fuentes de referencia para automatizarlo de manera fiable.
8. **Mutaciones (implementadas):** pruebas de cambios legítimos/adversariales con fixtures sintéticos y sobre los viajes principales en memoria; sin modificar JSON reales.
9. **Pruebas exclusivas pendientes de depuración:** `loader-regression.test.cjs` conserva bloques para Suiza nevada y Suiza Verde (fotografías, captions, transportes) y `browser-smoke.cjs` tiene comprobaciones de experiencias concretas. Deben migrarse gradualmente a invariantes dinámicas o fixtures de componente; no borrarlas por ser específicas sin demostrar equivalencia.
10. **Redundancia potencial:** varias suites comprueban anclas, noches, referencias de transporte o fotos. Eliminar duplicados solo cuando una prueba sustituta cubra el mismo nivel de fallo (modelo, loader o DOM); una prueba de JSON no sustituye un fallo de renderizado.

## Nuevo plan por fases

### A. Inventario y equivalencias de pruebas
Crear matriz por test, regla editorial, nivel (dato/modelo/render/CI), mutabilidad, fixture y riesgo. Clasificar: conservar, convertir a fixture sintético, generalizar, fusionar o eliminar. Prohibido retirar un caso sin cobertura equivalente demostrada. **Puerta:** ninguna prueba activa depende de un número fijo de destinos o de una reserva turística que pueda cambiar, salvo casos heredados explícitamente justificados.

### B. Contratos del modelo y fallos cruzados
Extender validaciones con fixtures de cambio combinado: mover vuelo y fecha de llegada; ajustar check-in/noches/presupuesto; eliminar excursión y su foto; cambiar hotel y ledger; duplicación de alternativas y moneda pendiente. Exigir controles positivos y adversariales, incluidos distintos husos y pernoctas alternativas. **Puerta:** cambiar datos coherentemente pasa; dejar una referencia huérfana o doble contabilización falla.

### C. Migración de suites específicas
Convertir los bloques de Suiza/Italia/Orlando restantes a fixtures de componentes o iteración dinámica, manteniendo pruebas que ejerciten APIs/DOM no cubiertas por validación de JSON. Para nuevos viajes, activar las reglas editoriales estrictas solo cuando están listos para cierre; las excepciones históricas son reportes explícitos, no silencios. **Puerta:** ninguna modificación turística legítima de un viaje exige editar una suite ajena.

### D. Integración de la cobertura editorial y chequeos externos
Decidir contrato de `countries`/países del recorrido y estados de reserva, sin introducir un mapeo geográfico inventado. Conectar diagnóstico de alcance y estados de alojamientos al proceso de PR con alcance declarado. Las ocho/nueve obligaciones externas requieren checklist con fecha, fuente, destino y responsable; no se convierten en checks verdes de CI. **Puerta:** inventario de 64 reglas con evidencia honesta y sin brechas silenciosas.

### E. Certificación final
Auditar diff del PR, ejecutar Node, JSON, sintaxis y Playwright escritorio/móvil en SHA final. Probar dos mutaciones válidas y dos inválidas sobre una copia de datos de cada tipo de viaje. Revisar las reglas parciales priorizadas y documentar riesgos aceptados. **Puerta:** CI verde y defectos críticos de automatización cero; merge solo con autorización del usuario.

## Dictamen

**La fase 5 de revisión y clasificación se puede cerrar como auditoría**, pero **no como automatización editorial exhaustiva**: permanecen reglas parciales, validadores no conectados al CI por viaje y pruebas específicas que merecen otra ronda de refactor. La fase de auditoría no autoriza automáticamente fusionar el PR. No confundir cobertura del catálogo con porcentaje de calidad.
