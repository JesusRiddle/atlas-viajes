# Testing V2 — diseño y bitácora
Fecha: 2026-11-27. Rama desde main. Sustituye el plan de saneamiento incremental, no la normativa turística.

## Estado
- Fase 1: inventario inicial y diseño documentados; pendiente lectura detallada de reglas por sección y comprobación de dependencias de los scripts.
- Fases 2–6: pendientes. No retirar pruebas hasta demostrar equivalencia. No modificar itinerarios ni fusionar.

## Fuentes normativas
AGENTS.md, trip-editorial-guide.md, trip-data-contract.md, trip-master-standard.md, trip-production-checklist.md y _template.json. La matriz previa es referencia, no fuente de requisitos ni prueba de cobertura. Ante contradicción, documentar y resolver antes de convertir en gate. Ejemplo: AGENTS exige intervalo con «a», mientras contrato permite Máx./Mín. explícitos cuando ambas métricas son reales; distinguir semántica, no imponer un formato que falsee datos. El checklist pide ampliar manualmente regresiones por viaje: reemplazar esa instrucción por descubrimiento dinámico al activar V2.

## Arquitectura
tests/editorial/ (nueve suites por sección y una transversal si necesaria), tests/functional/ (lógica independiente de destino), tests/browser/ (smoke y reglas visibles), tests/fixtures/ y helpers solo si reutilizados. Una regla tiene un dueño; datos y DOM pueden necesitar evidencias distintas. Node 22 y Playwright existentes, sin nueva dependencia. Descubrir viajes desde modules.js, distinguir ideas históricas, borradores y viajes cerrados sin inferir cierre por campos presentes. Completitud estricta solo con estado/etapa explícita y verificada; validar datos presentes incluso en borradores. Las ideas conservan compatibilidad, no se migran por la fuerza.

## Checklist de diseño por sección
| Sección | Automático candidato (datos / DOM cuando corresponda) | Manual/externo |
|---|---|---|
| Panorama | indicadores exactos y orden, intro y resaltados, clima separado, tres párrafos, estado/tono de mes, noches y viajeros, divisas y fuentes | narrativa, país/idioma, migración, enchufes, meteorología |
| Mapa | coordenadas y referencias válidas, orden, etiquetas de alojamiento, título en negrita | geografía real y pertinencia |
| Temporadas | doce meses, estados, pendiente legítimo, semántica de intervalos y signos | datos climáticos y recomendación |
| Experiencias | estructura, títulos, enlaces cuando procedan, extensión orientativa como aviso | selección, gastronomía, contexto |
| Reservaciones | título, grupos, enlaces y estados coherentes | disponibilidad, vigencia y compra real |
| Traslados | opciones, tarifa seleccionada, tramos, continuidad, referencias, null vs cero, ida/regreso, enlaces | horarios, validez tarifaria y condiciones reales |
| Alojamientos | fechas/noches, alternativas excluyentes, URLs, estado, terminología | disponibilidad y confirmación |
| Día por día | calendario, referencias, bloques, fotos/pies/créditos según política, pendientes | viabilidad, aperturas, autenticidad fotográfica |
| Presupuesto | IDs, importes, moneda, tasas, conciliación, alternativas, grupo/persona, equivalencia MXN | vigencia de cotizaciones y suficiencia real |
| Transversal | identidad, catálogo dinámico, nueve anclas, estados vacíos, aislamiento del alcance del PR, español y nomenclatura | calidad editorial, investigación y revisión visual |
Esta tabla es un mapa inicial, no una certificación exhaustiva. En fase 2 desglosar cada cláusula aplicable, clasificar obligatoria/condicional/orientativa/manual y añadir caso válido e inválido a cada contrato mecánico. Las orientativas no son fallos bloqueantes sin justificación normativa.

## Inventario inicial (main: 16 suites Node y un smoke)
| Suite actual | Decisión de migración (provisional) |
|---|---|
| dynamic-trip-regressions | repartir invariantes por sección; evitar duplicar relaciones |
| editorial-contracts | migrar temporadas, panorama y navegación |
| editorial-relations | repartir contratos por sección, compartir solo utilidades puras |
| editorial-mutations | integrar casos adversariales en sus suites; conservar un escenario cruzado |
| editorial-experience-audit | integrar avisos en experiencias |
| editorial-lodging-audit | integrar estados en alojamientos |
| editorial-change-scope | control de diff de PR, no test turístico; exige alcance explícito |
| editorial-rule-catalog | sustituir metapruebas por checklist trazable ligera |
| format-budget-contract | rescatar cálculos y compatibilidad de formatos |
| home-comparison | rescatar traducción, pendientes y columnas normativas |
| loader-regression | rescatar normalización, navegación, estados vacíos; migrar bloques Suiza/Italia a fixtures o invariantes |
| map-stay-labels | sustituir Colombia por fixture sintético |
| new-trip | rescatar alta y no sobrescritura |
| transport-budget | rescatar algoritmo y render con fixture existente, retirar duplicados comprobados |
| trip-editorial | repartir contratos; sustituir Italia y metapruebas redundantes |
| trip-production-workflow | checklist de proceso, no snapshots de documentación salvo contrato operativo esencial |
| browser-smoke | reescribir navegación y reglas DOM sin IDs de destinos |
No borrar scripts sin buscar consumidores en producción y CI. El fixture transport-regression es sintético, los números concretos allí son legítimos.

## Puertas por fase
1. Completar lectura de normativa, inventario de consumidores y clasificación de cláusulas; diseño aprobado por evidencia, no cantidad de tests.
2. Implementar suites editoriales y casos positivos/negativos, con detección dinámica. Documentar brechas manuales y diferencias heredadas sin tocar JSON.
3. Rescatar comportamiento crítico con fixtures: loader/alta, moneda, presupuesto, selección de tarifas, conexiones y referencias, mapas y comparativa.
4. Smoke escritorio/móvil: portada, comparativa, viaje mínimo y completo, nueve anclas, interacciones esenciales y reglas de DOM. Sin exigir destinos concretos ni red externa.
5. Retirar anterior solo tras equivalencia; revisar consumidores y actualizar CI (descubrimiento recursivo de suites) y documentación operativa. Un solo sistema final.
6. Ejecutar sintaxis, JSON, Node y Chromium en SHA final; mutaciones válidas e inválidas, verificar diff sin JSON turísticos, registrar riesgos y dejar PR listo para revisión. No merge automático.

## Punto de reanudación
Completar fase 1: leer el texto íntegro de las nueve secciones y reglas transversales por bloques, revisar _template.json/modules.js y consumidores de scripts; cerrar checklist antes de escribir suites. El PR inicial es borrador; CI anterior permanece intacto.
