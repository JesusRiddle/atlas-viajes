# Testing V2 — diseño y bitácora
Fecha: 2026-11-27. Rama desde main. Sustituye el plan de saneamiento incremental, no la normativa turística.

## Estado
- Fase 1: diseño normativo cerrado; inventario y decisiones de implementación registrados abajo.
- Fase 2: iniciada (catalog.cjs, Panorama, Temporadas y transversal); no certificada ni ejecutada en CI. Fases 3–6: pendientes. No retirar pruebas hasta demostrar equivalencia. No modificar itinerarios ni fusionar.

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


## Cierre de diseño — 27 de noviembre

Se revisaron guía (261 líneas), contrato de datos, estándar maestro, checklist, AGENTS, plantilla JSON, registro de módulos y formato de bitácoras. Se inspeccionaron los consumidores principales de los seis scripts editoriales: no aparecen en index.html, app.js, loader.js, travel-ui.js, gallery.js, componentes revisados, generador ni workflow. Sus referencias conocidas están en suites Node y en el catálogo de reglas; V2 ya reutiliza editorial-contracts. No se autoriza borrar ninguno hasta verificar consumidores restantes (incluido selections.js), referencias documentales y equivalencia en fase 5.

### Decisiones de diseño y conflictos
- **Temperaturas:** prevalece el contrato técnico: Máx./Mín. etiquetadas solo para magnitudes reales, máxima primero; intervalos ascendentes con «a» para rangos, sin inventar semántica. Armonizar AGENTS y checklist al sustituir la arquitectura.
- **Datos cambiantes:** la guía, línea 176, pide actualizar tests de sumas y el checklist, línea 138, exige ampliar regresiones por cada alta. V2 sustituye estas instrucciones por invariantes dinámicas y fixtures sintéticos; actualizar documentación operativa en fase 5. La referencia a 16 noches en el cierre de estimación es un ejemplo de escenario, no requisito universal.
- **Divisas:** contrato y estándar usan exchangeRateSnapshot; la guía menciona exchangeRatesAsOf. Admitir compatibilidad existente sin crear un campo nuevo; usar fecha y fuente comprobables, no exigir cotización en vivo.
- **Completitud:** modules.js registra disponibilidad y homeGroup, no estado de QA. Las bitácoras históricas tienen formatos heterogéneos (Colombia y Suiza Ferroviaria lo demuestran). No inferir cierre por número de campos, ID, fechas, status público o existencia de una bitácora. Validar datos presentes de todos los viajes principales; ejecutar controles de cierre con selección explícita de viaje en la herramienta de auditoría/PR, en modalidad general o detallada. Ausencia de selección no equivale a cierre aprobado: reportar alcance y pendientes. No exigir a planeación general cotizaciones futuras o logística detallada. No añadir campos de QA a JSON turístico.
- **Legado:** distinguir ideas por homeGroup, no por posición ni nombre. Validar compatibilidad de carga y navegación de ideas; las reglas de formato nuevo no fuerzan migraciones. Los incumplimientos preexistentes se informan, sin lista de excepciones por destino ni ocultar fallos nuevos. Si una regla objetiva falla en main, registrar evidencia y resolver política de transición antes de activar el gate; no modificar itinerarios desde este PR.

### Checklist normativo de implementación (dueño por sección)
Leyenda: D = dato, F = comportamiento con fixture, V = navegador, H = humano/externo. Obligatorio al informar un dato salvo indicación de cierre; recomendaciones de longitud/estilo son avisos, no falsos bloqueos.

| Área | Contratos objetivos y condiciones | Verificación no automatizable |
|---|---|---|
| Transversal | D: ID único, registro/archivo, tipos y estados canónicos, campos técnicos sin instrucciones; independencia entre viajes. F/V: alta mínima, nueve anclas y orden, ausencia de placeholders falsos, null distinto de cero/false, ideas y formato nuevo, etiquetas públicas sin estado interno. Control de alcance mediante diff explícito, no por nombre de viaje. | H: español natural, concisión, ventanas óptimas, festivos, fuentes y autorización de cambios. |
| Panorama | D: intro/introShort presentes al cierre, resaltados literales, tres indicadores exactos con campos/títulos/orden/tono, ISO reconocido y badge language verde, climate separado con tres párrafos y etiquetas. Longitud aproximada 70–130/30–45 como aviso. V: indicadores izquierda, clima derecha debajo de presupuesto, una tarjeta, estado/mes y color compartidos, documentación resaltada con escape, portada sin truncamiento. | H: narrativa, idioma real, migración, enchufes, voltaje, clima y luz. |
| Mapa | D: coordenadas finitas en rango, orden único y coherencia de referencias, base/stayName resuelve alojamiento si está definido, opcionalidad. V: nombre principal en negrita, calificadores normales, noches o excursión y pendientes sin «Base», interacción y ausencia de pines ficticios generados. | H: lugar real, orden geográfico y pertinencia. |
| Temporadas | D: claves 01–12 y cuatro estados, temperatura válida en meses evaluados; signos y semántica de intervalos, descripción y resumen al cierre según alcance. V: 12 tarjetas, estado/color, formato y pendientes. | H: exactitud climática, eventos, cierres y conveniencia. |
| Experiencias | D: city/description no vacíos al informar, sin URLs públicas en descripción nueva, extensión 18–35 aproximada con excepción gastronómica como aviso. V: estructura de tarjetas y columnas. | H: atractivos concretos, gastronomía local, ausencia de relleno y cobertura de localidades. |
| Reservaciones | D: grupos válidos y únicos, título/description/enlaces, estados, título fijo si informado; no exigir grupos vacíos ni fechas sin disponibilidad. V: título y enlaces visibles. | H: prioridad, cupo, alternativa viable, fuentes, compra y ventanas reales. |
| Movilidad | D/F: IDs y referencias, opciones/selectedFare/fares/journeys/segments, dirección y conexiones, UTC si horas aéreas conocidas, quotedAt y precio si cotizado, null si pendiente, enlaces/paradas, exclusión de alternativas y pases. V: escalas, selector, regreso, railSummary, boarding y ticketNotes antiguos/nuevos. | H: validez de billetes, tarifas reales, seguridad de conexiones, contingencias A/B/C solo cuando existan, equipaje y políticas. |
| Alojamientos | D: IDs, check-in/out, cobertura nocturna con excepciones vuelo/camping, enlaces, candidatos vs estado de gasto, hotelId y noches. V: «Tus alojamientos.», enlaces, resumen singular/plural, no «bases» como etiqueta, título sin desbordamiento. | H: ubicación exacta, tarifa/condiciones, impuestos, calidad y reserva efectiva. |
| Día por día | D: fechas/número consecutivos y referencias, bloques am/pm/night al cierre detallado, sintaxis de mobility/note para contenido nuevo o editado, movilidadLinks, fotos/portadas resueltas, pies y metadatos según origen. V: despliegue, navegación, render parcial, tarjetas, enlaces, carga degradada de imagen. H/aviso: longitud de pies 15–30; no cantidad fija de fotos. | H: horarios, carga física, histórico-cultural, autenticidad, color, licencia y disponibilidad de imágenes. |
| Presupuesto | D/F: importes/monedas/estados, tasa positiva y fuente fechada, viajeros, gastos vinculados, subtotales, alternativas y agrupadores sin duplicación, por persona, pesos pagados, proyección y margen sin sumar dos veces. V: todas las categorías, equivalencias MXN inmediatas cuando exista tasa, pendiente explícito, Inicio/Panorama/comparativa coherentes. | H: cotización real, comidas, suficiencia y supuestos razonables. |

### Puerta de fase 1
Diseño, inventario de suites, clasificación por área, política de alcance y resolución normativa de diseño registrados. La comprobación exhaustiva de consumidores antes de borrar se mantiene como puerta de fase 5; la lectura línea por línea de casos de prueba y equivalencias es trabajo de fases 2–5. El diseño no certifica reglas implementadas. Las primeras suites de fase 2 aún no están incluidas en el comando CI actual: no confundir un CI anterior verde con su ejecución.

## Punto de reanudación
Fase 2: implementar las siete secciones restantes y ampliar Panorama/Temporadas/transversal según esta checklist. Incorporar un comando de prueba V2 provisional que ejecute las suites nuevas explícitamente (sin quitar la suite vigente), comprobar resultados, casos positivos/negativos y reportar brechas. No declarar cobertura total por crear archivos. Conservar los seis scripts hasta comprobar sustitución y consumidores. No tocar JSON ni hacer merge.
