# Atlas Testing V2 — arquitectura vigente

## Estado y principio rector

Las seis fases de V2 se completaron en el PR #26, integrado en main. Los itinerarios son modificables, la guía editorial es normativa y la funcionalidad debe estar protegida. Esta referencia técnica no sustituye la normativa turística: consultar AGENTS.md, trip-editorial-guide.md, trip-data-contract.md, trip-master-standard.md, trip-production-checklist.md, trip-progress-template.md y data/trips/_template.json.

No inferir una regla de un itinerario concreto. Las nueve secciones, doce meses y tres indicadores tienen cantidades normativas; fechas, destinos, viajeros, hoteles, vuelos, actividades, fotos y precios pueden variar. Conservar las ideas históricas como consulta, sin migración automática.

## Arquitectura y ejecución

- `tests/editorial/`: contratos por sección y transversales, catálogo dinámico, diagnósticos, fotos, mutaciones y control de alcance.
- `tests/functional/`: lógica real de carga, alta, presentación, transporte, selección y presupuesto con fixtures aislados. `tests/fixtures/transport-regression.json` conserva casos de integración multitrayecto sin depender de los datos turísticos activos.
- `tests/browser/`: un runner Chromium, catálogo real y escenarios controlados en escritorio (1440px) y móvil (390px); red externa controlada.
- `.github/workflows/atlas-checks.yml`: sintaxis, JSON, control de alcance en PR, editorial incremental, funcional y navegador. Node 22.

Consultar [README](../README.md) para comandos locales. Para cierre explícito:

```bash
ATLAS_TRIP_ID=mi-viaje ATLAS_QA_MODE=detailed ATLAS_QA_SECTIONS=plan,dias node --test tests/editorial/*.test.cjs
```

Modos: `incremental` (por defecto), `general` (estimación de alto nivel) y `detailed` (cierre detallado). El cierre necesita un ID principal explícito y las secciones solicitadas; si no se indican, se seleccionan todas. Las restantes conservan controles incrementales. Nunca deducir completitud por número de campos, disponibilidad del módulo o estado de una bitácora. Cerrar una sección no implica cerrar el viaje. No inventar fechas, tarifas o logística para satisfacer un test.

## Alcance y deuda editorial

En PR declarar una única línea `Atlas scope: slug1,slug2` o `Atlas scope: none`. Las ramas `refactor/*` no pueden modificar JSON en data/trips, incluida la plantilla. `_template` puede declararse expresamente en otros PR. La comprobación usa diff real frente a la base, rutas delimitadas por NUL y ambos lados de los renombrados. Una edición de la descripción reactiva el CI. La declaración no sustituye autorización del propietario ni es una frontera de seguridad contra cambios al workflow o pushes directos. Reproducción: `ATLAS_SCOPE_BASE` y `ATLAS_SCOPE_TRIPS` (cadena vacía si ninguno).

El CI normal compara los diagnósticos contra la base con los mismos contratos, por viaje, identidad, evidencia y multiplicidad. Las jornadas usan número y campo como identidad diagnóstica, no fecha. Sin `ATLAS_QA_BASE` explícita una ejecución local no acredita ausencia de regresiones. Los nuevos incumplimientos fallan; los heredados no agravados se informan y bloquean el cierre explícito de su sección. No crear allowlists por destino. Renumeraciones ambiguas con deuda pueden necesitar resolución editorial.

## Criterios de mantenimiento

- Validar registro antes de leer rutas: ID slug único, archivo correspondiente, available booleano, homeGroup ausente o ideas. Identidad de todos los módulos disponibles. Reglas nuevas para principales; preservar compatibilidad de ideas. Un catálogo vacío es legítimo, pero no acredita revisión turística; ejecutar fixtures aun si no hay principales.
- Validar los datos presentes, distinguir omitido/null de tipos inválidos, no confundir cero/false con ausencia. No simular completitud con defaults. Cargar mediante implementación real en pruebas funcionales.
- Una regla tiene un dueño; datos, función y DOM pueden necesitar evidencias distintas. Contraejemplos independientes y mutaciones coherentes/adversariales; no duplicar comprobaciones con la misma señal ni comparar un validador consigo mismo. No fijar datos turísticos en aserciones del catálogo vivo.
- Temperaturas: Máx./Mín. etiquetadas solo para magnitudes reales, máxima primero; intervalos ascendentes con «a» cuando sean una misma magnitud. Usar exchangeRateSnapshot para fecha y fuente de divisas. Longitudes orientativas son avisos, no bloqueos rígidos.
- Revisar consumidores y equivalencia antes de retirar pruebas o herramientas. Verificar CI del SHA final; reportar alcance, evidencia y límites.

## Matriz de contratos y revisión humana
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

La matriz describe los contratos a proteger y las revisiones humanas necesarias, no una certificación de cobertura automática de cada cláusula. La normativa de producción sigue en las guías y en las auditorías A–D.

## Evidencia de cierre del refactor

PR [#26](https://github.com/JesusRiddle/atlas-viajes/pull/26), último SHA antes del merge `db73ae976251a3776ef8b09d1a4f332cd3b761b8`: CI [46084787420](https://github.com/JesusRiddle/atlas-viajes/actions/runs/46084787420) y 46084786769 aprobados. 99 pruebas editoriales aprobadas (100 descubiertas; una omisión esperada del diff ejecutado separadamente), 48 funcionales, 5 controles de alcance, 4 escenarios de Chromium, cero fallos. No sumar los controles duplicados como casos únicos. El refactor redujo 1,639 líneas netas (+2,116/-3,755, 60 archivos), fixture de transporte 71.76% en caracteres, sin modificar JSON turísticos. Producción: únicamente app.js y components/trip.js para jornadas parciales. Merge en main `2350e135e4b29e10f2c4335ee9d9dbe19d471701`.

Mutaciones coherentes de fechas, extensión, alojamiento, transporte, actividades, portada, viajeros, importes y divisas aceptadas; contraejemplos de fechas imposibles, referencias huérfanas, duplicados, precio inválido, tasa sin respaldo, URLs inválidas, ciclos y cierre incompleto rechazados.

Al cierre se observaron 83 hallazgos heredados (70 formato diario, 8 zonas horarias, 2 Panorama, 2 mapa, 1 cotización), cero nuevas regresiones. Es una línea base histórica, no una cantidad que deba conservarse. Corregir mediante cambios editoriales autorizados separados.

**Límites:** no se midió cobertura de líneas/ramas ni se ejecutó un motor de mutation testing sobre cada línea. Investigación, pertinencia narrativa, horarios, reservas, fuentes, autenticidad/licencia de fotografías y revisión visual humana siguen siendo obligatorias cuando corresponda. Chromium no certifica todos los navegadores ni disponibilidad externa.

El historial completo de diseño, decisiones y auditorías de las seis fases permanece recuperable en [la versión original al cierre](https://github.com/JesusRiddle/atlas-viajes/blob/2350e135e4b29e10f2c4335ee9d9dbe19d471701/docs/testing-architecture-v2.md). Los planes y comandos de transición allí registrados son históricos, no instrucciones operativas.
