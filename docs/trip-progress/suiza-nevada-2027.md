# Registro de avance por viaje · Atlas

Copiar esta plantilla a `docs/trip-progress/suiza-nevada-2027.md` al comenzar una **implementación nueva**. Es un registro de ejecución, no una fuente de datos turísticos: el itinerario y precios viven en `data/trips/suiza-nevada-2027.json`. Mantenerla en la **misma rama/PR** del viaje; no sobrescribirla con la de otro destino.

**Viaje:** Suiza nevada 2027  
**JSON:** `data/trips/suiza-nevada-2027.json`  
**Rama / PR:** feature/suiza-2027 · https://github.com/JesusRiddle/atlas-viajes/pull/9  
**Modalidad:** [ ] Planeación general  [x] Itinerario detallado  
**Última actualización:** 2026-11-03  
**Etapa actual:** 13 · Auditoría D automatizada aprobada, revisión externa de fotos y tarifas pendiente  
**Siguiente acción autónoma:** Cotizar cuatro rutas nacionales en SBB; los dos trayectos ZVV de Zúrich ya tienen tarifa oficial 2027. Conciliar presupuesto y auditar el PR  
**Decisión que sí requiere al usuario (si existe):** Ninguna para publicar el PR; reservas no autorizadas

## Checklist numerado de ejecución · orden de dependencias

El **orden de producción** se organiza de lo más independiente a lo más dependiente. **NO** es el orden de las nueve secciones en la pantalla, que permanece definido por el estándar maestro. Marcar «verificado» solo tras cotejar fuente, consistencia y dependencias; cifras de temporadas o tarifas futuras pueden ser estimaciones documentadas, no disponibilidades confirmadas.

- [ ] **00 · Preparación.** Leer `AGENTS.md`, estándar, guía, contrato y plantilla; crear rama, JSON **visible de inmediato en Inicio**, y bitácora; sin etiquetas de estado ni modificación de viajes heredados.
- [ ] **01 · Alcance y geografía.** Recuperar restricciones ya acordadas: países, ciudades candidatas, prioridades, tipo de viaje, `travelerCount`, duración aproximada, presupuesto objetivo y ventanas sugeridas. **No fijar todavía alojamientos ni horarios inventados.**
- [ ] **02 · Temporadas (sección visible 3).** Investigar cada uno de los doce meses para **todos los destinos/regiones candidatos**, clima/luz, fenómenos, cierres y ocupación. Recomendar ventanas y advertir variaciones regionales; esta fase **no depende de hoteles ni tarifas**. Si el usuario ya eligió fechas, evaluarlas sin cambiarlas arbitrariamente.
- [ ] **03 · Calendario, ruta y esqueleto diario.** Elegir/validar ventana con `work`, festivos, llegada/salida, orden de ciudades, `bases`, noches, traslados plausibles, excursiones prioritarias y `days[]` por fecha. Investigar conexiones cruciales y reservas que **podrían invalidar** la ruta antes de cerrarla; horarios y precios definitivos quedan para etapas posteriores. **Auditoría A: temporadas → fechas → ruta → noches y días compatibles.**
- [ ] **04 · Mapa (sección visible 2).** Poblar `mapPoints`, coordenadas reales y orden tras conocer la ruta; verificar correspondencia con ciudades, alojamientos/excursiones y continuidad espacial.
- [ ] **05 · Experiencias (sección visible 4).** Curar atractivos, excursiones opcionales y gastronomía de todas las ciudades del recorrido. Verificar pertinencia, tiempos aproximados, cierres conocidos y ausencia de repeticiones; no prometer una actividad todavía no reservada.
- [ ] **06 · Reservaciones importantes (sección visible 5).** Priorizar experiencias que requieren fecha/cupo, entradas, operadores oficiales, criterios de cancelación y alternativas; anotar dependencias con actividades. Si una disponibilidad vuelve inviable la ruta, volver a 03 antes de seguir.
- [ ] **07 · Movilidad y conexiones (sección visible 6).** Modelar vuelos, trenes, autobuses, aeropuertos y trasbordos; opciones reales y respaldos, ida y vuelta, condiciones, equipaje y tarifas históricas/propuestas/cotizadas claramente distinguidas. No inventar servicio futuro; vincular `transportRefs`.
- [ ] **08 · Dónde dormirás (sección visible 7).** Proponer alojamiento por zona y fecha, validar check-in/out, `travelerCount`, noches, Maps y URLs oficiales; costos de habitación/grupo, no multiplicar. **Auditoría B: mapa, experiencias, reservas, transportes y alojamientos contra la ruta.**
- [ ] **09 · Día por día (sección visible 8).** Completar mañana/tarde/noche, traslados puerta a puerta, tips, gastos por asignar, pausas, márgenes, opciones por clima y correspondencia de alojamientos y entradas. Verificar que el calendario operativo sostenga las experiencias.
- [ ] **10 · Panorama (sección visible 1).** Redactar `intro`, `introShort`, `introHighlights`, `practicalIndicators`, `climate`, perfil y documentación **a partir del recorrido ya consolidado**; preparar narrativa de portada. La tarjeta de presupuesto del Panorama se **reconcilia obligatoriamente** en 11, no se rellena con costos inventados.
- [ ] **11 · Presupuesto (sección visible 9).** **Después de vuelos, movilidad, entradas, comidas, hoteles y días**: llenar `expenses`, escenarios, categoría, estado, `exchangeRates` con fecha y `days[].spend` cuando aplique; evitar sumas duplicadas y mostrar equivalentes por persona solo con `travelerCount`. Actualizar el presupuesto del Panorama e Inicio. **Auditoría C: 09–11, costos, fechas y portadas reconciliados.**
- [ ] **12 · Fotografías y portada.** Vincular URLs externas en `data/places.json` sin descargarlas, revisar correspondencia por lugar y opcionales, imagen de portada, `introShort`, tarjetas del Inicio y carga de imágenes cuando exista acceso; **no exigir fotos en días solo de vuelo**.
- [ ] **13 · Auditoría integral y entrega.** **Auditoría D:** nueve secciones en **orden visual**, datos, enlaces oficiales, mapa, fotografías, presupuesto, escenarios, rutas, noches, viaje aislado, comparación y portada; Node/JSON/JS y navegador Desktop/Mobile cuando disponible; reparar fallas, documentar pendientes y abrir PR. **Jamás hacer merge, compras o borrados sin aprobación.**

## Orden visual inmutable (independiente del orden de llenado)

1. Panorama (`plan`) → se construye en **10**.
2. Mapa (`mapa`) → **04**.
3. Temporadas (`temporadas`) → **02**.
4. Experiencias (`experiencias`) → **05**.
5. Reservaciones importantes (`reservas`) → **06**.
6. Movilidad y conexiones (`traslados`) → **07**.
7. Dónde dormirás (`alojamientos`) → **08**.
8. Día por día (`dias`) → **09**.
9. Presupuesto (`costes`) → **11**.

## Puertas de control

| Control | Tras etapas | Evidencia imprescindible | Resultado |
| --- | --- | --- | --- |
| A · Clima y arquitectura del viaje | 01–03 | Destinos, 12 temporadas, fechas, noches, excursiones y trayectos viables | Pendiente |
| B · Servicios y recorrido | 04–08 | Mapa, experiencias, reservas, movilidad y hoteles compatibles | Pendiente |
| C · Itinerario y dinero | 09–11 | Jornada por jornada, narrativa, vuelos, entradas, comidas, hoteles, transportes y rango coherentes | Pendiente |
| D · Visual y regresiones | 12–13 | Nueve secciones en orden visual, fotos, Inicio, sumas, links y CI Desktop/Mobile | Pendiente |

**Dependencias y retrocesos:** las etapas se pueden investigar en paralelo cuando son independientes, pero una etapa no se marca como **verificada** hasta que sus requisitos existan. Si un dato tardío cambia la ruta, volver a 03 y revalidar las etapas afectadas. Las tarifas históricas identificadas con fuente/fecha y los supuestos explícitos bastan para **planeación general**, nunca para afirmar reservas disponibles; bloquear solo decisiones realmente irresolubles.

**Cinco controles de eficiencia del orden:** (1) clima sin requerir ruta cerrada; (2) ruta y noches condicionan mapa; (3) experiencias y reservas condicionan movilidad/horarios; (4) día por día y narrativa dependen de servicios; (5) presupuesto depende de **todos** los costos y la fotografía solo de lugares definidos. La verificación final revisa que el orden de pantalla permanezca igual.

## Evidencias y pendientes

| Etapa | Estado (pendiente/en curso/verificado/bloqueado) | Evidencia / commit / fuente | Pendiente o causa de bloqueo |
| --- | --- | --- | --- |
| 00–03 (Auditoría A) | Verificado a nivel de datos | 12 fechas consecutivas, 10 noches (1+4+3+2), ruta consistente | Revalidar horarios ferroviarios de 2027 |
| 04–08 (Auditoría B) | Verificado en CI automatizado | 7 experiencias, 3 grupos de reservas, 6 fichas de transporte, 4 hoteles y 23 enlaces de estaciones. GitHub Actions 41729087342 OK | Tarifas reales enero 2027 y enlaces externos sujetos a revalidación |
| 09–11 (Auditoría C) | Verificado a nivel de datos | 12 jornadas, 17 apariciones fotográficas, MXN 81,981, viajero 1 | Tarifa de hoteles y pases sin cotización exacta 2027 |
| 12–13 (Auditoría D) | Verificado en CI automatizado | `Atlas checks` run 41728049488: JavaScript, JSON, Node y Chromium Desktop/Mobile aprobados | Revisión humana de imágenes externas en vista previa si se desea |

**Última auditoría:** 2026-11-03 · auditoría estructural por lectura directa de JSON y módulos (3 pasadas: fechas/noches, fotos/licencias/enlaces, presupuesto/aislamiento); no equivale a test Node ni navegador.  
**Pendientes externos no bloqueantes:** <precios futuros, horarios sin publicar, fotos inaccesibles, etc.>  
**Próxima ejecución autónoma:** Validación CI y visual; revisar tarifas 2027 cuando se disponga de ellas

## Contrato de trabajo con el usuario

Cuando el usuario diga **«refléjalo en el Atlas»** después de definir la ruta, ejecutar consecutivamente las etapas 00–13 en la misma tarea **hasta donde permitan herramientas, límites y datos**; no pedir permiso entre secciones ni exigir respuestas «adelante». Agrupar escrituras y consultas, comprobar cada bloque y corregir fallas antes de seguir. Si no se logra terminar en esa ejecución, dejar esta bitácora actualizada con etapa exacta, pruebas y siguiente paso para que **un nuevo turno** continúe sin redescubrir el estado. No afirmar que se seguirá trabajando en segundo plano.

Mostrar al usuario un reporte compacto por hitos: **completadas / en curso / pendientes / bloqueadas, siguiente etapa y decisión requerida**; evitar narrar cada archivo. Las decisiones de ruta, gastos relevantes, compras, cambios destructivos y el merge siguen requiriendo aprobación explícita.


## Estado específico · 2026-11-03
- Etapas 00–03: definidas por planeación conversacional; Aud. A: calendario y noches sumados, pendiente validación con pruebas de repositorio.
- Etapas 04–08: poblados mapa, experiencias, reservas, movilidad y hoteles candidatos; Aud. B: pendientes pruebas de renderizado.
- Etapas 09–11: 12 fechas / 10 noches / presupuesto MXN 81,981 calculado y escenarios aéreos no acumulables; Aud. C: revisión estructural manual, falta QA de código.
- Etapas 12–13: portada editorial y primer registro visibles en la rama; fotografías específicas y auditoría D visual pendientes.
- **Pendientes externos no bloqueantes:** vuelos no comprados, precios hoteleros no cotizados para fecha exacta, horarios SBB 2027 por revalidar, clima/operación invernal, seguros y entradas.
- **Restricciones:** solo una persona; otros viajes del Atlas no son restricciones; Suiza verde será alternativa mutuamente excluyente.


## Auditoría de fotografías · 2026-11-03
- 7 entradas nuevas en `data/places.json` de Wikimedia Commons con autor, licencia y fuente; no se cambiaron las fichas de viajes anteriores.
- 17 asociaciones de fotos en diez jornadas con visitas, días de vuelo sin fotos; portada `swiss27-grindelwald-winter`.
- Validación local a nivel de datos de 12 días consecutivos, referencias, 4 hoteles, presupuesto $81,981 MXN y posición 1 en portada: sin errores detectados.
- **No verificado todavía:** carga real de URLs externas en navegador, responsive Desktop/Mobile y resultado completo de GitHub Actions.

## CI y corrección de regresiones · 2026-11-03
- Ejecución #334 de Atlas checks: sintaxis JS **PASS**, validación JSON **PASS**, Node regresiones **89/91**; navegador omitido por fallo previo.
- Las dos fallas eran aserciones del catálogo anterior (19 viajes y España–Portugal en posición 1); ahora son 20 y Suiza nevada está en posición 1 por decisión del usuario.
- Se actualizaron expectativas y añadió prueba específica de Suiza nevada (10 noches, 12 jornadas, fotos, presupuesto y portada). **Nuevo CI todavía no confirmado**.

## Corrección de renderizado de movilidad · 2026-11-03
- Error informado: `major-transport.js:166` al leer `option.fares.find` en traslados de aeropuerto sin `fares`.
- Corregidos `airport-arrival` y `airport-return` con `selectedFare: pending`, tarifa `{price: null}`; sin inventar importes.
- Renderizador protegido frente a tarifas ausentes; añadida prueba de contrato `AtlasTransportModel.validateTrip` y de renderizado con datos parciales.
- Actualizados `AGENTS.md` y `docs/trip-production-checklist.md` para exigir contrato + renderizado al cerrar movilidad y auditorías B/D.
- **CI:** nueva ejecución `41726747667` iniciada, resultado pendiente de verificación.


## Auditoría D · Resultado confirmado 2026-11-03
- GitHub Actions **41728049488: SUCCESS** para commit `f85b5fca97d5768f8a82b69ca92b86e53323f4ea`: sintaxis JS, JSON, tests Node, navegador Desktop/Mobile.
- Se actualizó `tests/browser-smoke.cjs` para 5 viajes visibles, Suiza en Viaje 01 y pruebas específicas de Suiza. Se corrigió `components/home.js` para no excluir del comparador viajes con días laborales por definir.
- Tras revisar tres veces calendario/hoteles, inversión y contrato presupuestario, se corrigió `budgetPreliminary` con objeto válido y `majorTransport.flight-international.budgetIncludedIn = flight-budget`. Esto conserva $81,981 MXN como referencia, evita sumar dos veces el vuelo y permite la comparación de tarifas.
- **Pendiente no bloqueante:** revisión editorial humana de las imágenes cargadas externamente, tarifas y horarios reales de 2027. Sin reservas ni merge.


## Etapas 05–08 y auditoría B · 2026-11-03
- Experiencias enriquecidas: Lucerna, Grindelwald, Lauterbrunnen/Wengen, Mürren, Jungfraujoch/Männlichen, Zermatt y Zúrich/Kilchberg con gastronomía, límites por clima y exclusiones.
- Reservaciones diferenciadas por prioridad: hoteles alpinos, Lindt, vuelo, hoteles urbanos, pases y miradores variables.
- Movilidad ampliada a 6 tarjetas: vuelos, traslados aeropuerto, Lucerna–Grindelwald, Grindelwald–Zermatt y Zermatt–Zúrich. Tarifas desconocidas en `null`, con estaciones, cobertura de pases y 23 enlaces Maps en jornadas.
- Corregido Fred Guest House a Konradstrasse 11, 8005 Zürich y URL oficial específica; ibis budget Lucerna vinculado a ficha oficial Accor.
- **Tres controles previos a escritura:** integridad de días/noches y referencias, esquema de transporte y hoteles, reconciliación del vuelo y presupuesto `$81,981 MXN` sin cambio.
- **GitHub Actions #41729087342: SUCCESS**; validación JS, JSON, pruebas Node y Chromium Desktop/Mobile completas. Auditoría B aprobada a nivel automatizado.
- **Pendientes no bloqueantes:** tarifa exacta de trayectos nacionales 2027, posible conveniencia de Half Fare versus pase Jungfrau y fotos externas por revisión humana. Próximo bloque 09–11.


## Etapas 09–11 · Auditoría C · 2026-11-03
- Día por día: reescritos los 12 días con mañana/tarde/noche, márgenes, pasajes completos, alternativa climática, gastronomía y hotel. Los vuelos de conexión se explicitan como dos segmentos (sin horarios de cada vuelo individual disponibles). No se inventaron servicios de tren.
- Panorama: `intro` 107 palabras; `introShort` 35 palabras. `work=8` días entre salida y regreso por avión, sujeto a calendario laboral personal; llegada a CDMX miércoles 3 febrero a las 04:20, posible noveno día libre.
- Transporte: pase invernal peatonal Jungfrau de 3 días (25–27 enero) con precio oficial 2026/27 CHF 176 (≈ $4,040 MXN); Swiss Half Fare CHF 150 (≈ $3,444 MXN). Sin billetes nacionales cotizados, no se puede decidir ahorro neto ni recomendar comprar ambos. `railSummary` adaptado al formato de pares requerido por el renderizador.
- Presupuesto: $20,331 vuelos + $31,750 hoteles + $10,000 movilidad + $6,500 entradas + $9,000 alimentos + $4,400 seguros/extras = $81,981 MXN; evita doble cómputo de billetes de First cubiertos por Jungfrau y vuelo.
- **Tres revisiones antes de guardar:** calendario/noches/tramos, consistencia de modelos/refs y total sin duplicación. GitHub Actions #41729872233 SUCCESS para la primera edición; #41729995449 lanzado para ajuste final del esquema de `railSummary`, pendiente al registrar.
- Pendiente para auditoría D: comprobar último CI, fotos externas, enlaces y comportamiento de la comparativa sin precios definitivos.


## Auditoría integral correctiva de Panorama y sitio · 2026-11-03
- **Causa:** el JSON Suiza incluía cuatro `practicalIndicators` (`style/language/entry/weather`) pese a que la guía ya exigía tres. El cuarto colocaba «Clima y luz» a la izquierda y el campo `climate` de la tarjeta derecha solo tenía un resumen breve. Además el título `entry` retrocedió a «Documentación y electricidad», contra la convención vigente. No era fallo de CSS, sino omisión del contrato y ausencia de aserciones específicas.
- **Corrección:** `practicalIndicators` exactamente `[style,language,entry]` con títulos correctos y tonos admitidos; `climate` reescrito como tres párrafos de clima/temperaturas, `*Qué llevar:*`, `*Horas de luz:*`, con horas CET orientativas y límites de operación de montaña.
- **Hallazgo de documentación:** la guía editorial contenía una frase contradictoria: decía que `entry` iba a la derecha, aunque el diseño maestro lo pone a la izquierda. Se corrigió y alinearon `AGENTS.md`, estándar, guía editorial, contrato y checklist. El esquema se prueba en JSON, DOM y geometría Desktop/Mobile, para los cinco itinerarios nuevos.
- **Corrección transversal:** fuente de divisas dinámica en Panorama (CHF/ARS además de EUR/USD/JPY); antes solo buscaba JPY/EUR/USD.
- **Auditoría exhaustiva:** 20 JSON del catálogo verificados sin referencias fotográficas inexistentes ni referencias huérfanas de hotel/transporte. En los 5 viajes principales, indicadores `style/language/entry` y títulos oficiales coincidentes. Referencias de las siete fotografías nuevas comprobadas en fichas de Wikimedia Commons con atribución/licencia; carga de imágenes externas no garantizada en todos los dispositivos o redes.
- **Pruebas:** GitHub Actions #41731165505 **SUCCESS** (JS, JSON, Node, navegador Desktop/Mobile sobre itinerarios activos, nueve anclas, orden, navegación y ausencia de `undefined`/`NaN`/desbordamientos); cambio posterior solo de tonos de indicadores requiere nueva verificación CI. PR #9 permanece abierto, sin merge.
- **Pendientes no bloqueantes:** tarifas definitivas SBB/hoteles y boletos, comprobar imágenes externas en una sesión de usuario con red habitual, revisar respuesta visual de fotos seleccionadas. La etapa 12 no se cierra como revisada humanamente solo por aprobar CI.

- **Cierre técnico final:** GitHub Actions #41731582103 concluyó **SUCCESS**: sintaxis JavaScript, validación de JSON, suite Node y pruebas de navegador Desktop/Mobile. La comprobación posterior a tonos de indicadores y reglas de Panorama queda aprobada a nivel automatizado. No equivale a confirmar visualmente cada imagen remota ni la disponibilidad futura de servicios.


## Auditoría editorial comparada · Italia Norte 2027 · 2026-11-03
- Se realizaron tres pasadas de revisión: (1) reglas editoriales y comparación de las nueve secciones con Italia Norte; (2) coherencia de jornada, fotografías, transporte y mapa; (3) calendario, No. de personas y conciliación económica.
- **Temporadas:** 12 rangos indicativos de máximas diurnas, contrastando Grindelwald (pueblo) y ciudades bajas, explícitamente NO pronóstico; fuente y limitaciones en resumen. Italia ya tenía esta convención y Suiza no.
- **Día por día:** ahora 12 fichas cumplen `• *Título:*` en `mobility` y `note`, más cabeceras descriptivas. El día de Jungfraujoch/Männlichen dejó de mostrar una foto de Wengen como si fuera del mirador.
- **Fotos:** pies de fotos presentes, ahora de 15–30 palabras para todos los lugares usados; falta verificación editorial directa de carga, fidelidad a estación y color de recursos remotos.
- **Experiencias:** ampliadas especialidades locales de Lucerna, Grindelwald/Oberland, Zermatt/Valais y Zúrich. `ticketNotes` elimina el apunte de seguridad de montaña, que no es billete; permanece en el itinerario.
- **Mapa:** 11 puntos ordenados: Lucerna, Grindelwald, First, Lauterbrunnen, Wengen, Mürren, Jungfraujoch (opcional), Zermatt, Gornergrat, Zúrich y Lindt. Coordenadas de las cuatro altas nuevas contrastadas con referencias cartográficas o científicas; sin modificar viajes antiguos.
- **Comida:** fondo de $9,000 MXN asignado a 11 días (no a una sola fecha ni al vuelo transatlántico), con status `estimated`. Total integral $81,981 MXN y noches 10 conservados; sin tarifas definitivas de hoteles/trenes.
- **Control preventivo:** `tests/loader-regression.test.cjs` exige temperaturas mensuales, formato de tips/movilidad, textos de fotografías, mapa ordenado y partida diaria de comidas. **GitHub Actions #41733760707: SUCCESS**, con Node, validación JS/JSON y Chromium Desktop/Mobile.
- **Estado editorial por sección:** Panorama aprobado; Mapa aprobado a nivel de datos; Temporadas aprobadas con climatología orientativa; Experiencias aprobadas en contenido base; Reservaciones completas como plan sin compras; Dónde dormir completo en candidatos, tarifas exactas pendientes; Movilidad y Presupuesto pendientes de comparativa numérica por billetes reales; Día por día consolidado con foto de mirador pendiente y horarios futuros condicionados. Fotografías/licencias pendientes de verificación visual en navegador con red externa.
- **Siguiente paso autónomo:** auditar carga, color y pertinencia de todas las fotos de Suiza; completar fotografía representativa de Jungfraujoch/Männlichen y contrastar precios ferroviarios hasta cerrar las secciones de Movilidad y Presupuesto. No hacer merge sin autorización.


## Imágenes y decisión de pases · 2026-11-03
- Día 6 ahora tiene fotografías distintas y correctamente atribuidas: Jungfraujoch con nieve fotografiado en febrero 2026 (Reustli, CC BY-SA 4.0) y Männlichen Royal Walk en diciembre 2021 (Jpatokal, CC BY-SA 4.0); ambas alternativas se etiquetan opcionales. Metadatos y licencias contrastados en Wikimedia Commons.
- Tarifas oficiales confirmadas: Jungfrau Winter Hiking and Sledging Pass 3 días CHF 176 (25–27 enero 2027); suplemento Top Ticket Jungfraujoch CHF 63 válido 1/12/2026–30/4/2027; Swiss Half Fare Card CHF 150 sin cambio en 2027; Swiss Travel Pass 15 días 2ª clase CHF 499 sin cambio para 2027. Referencia tren Gornergrat temporada 2026/27 CHF 102 ida/vuelta (sujeta a checkout oficial), mitad con descuento válido.
- **Comparativa económica:** pase Jungfrau recomendado condicional para días 25–27; Half Fare Card solo si ahorro de billetes restantes (nacionales + Gornergrat) supera CHF 150; Swiss Travel Pass descartado por defecto porque CHF 499 excede provisión ferroviaria. No se compran ambos pases automáticamente.
- **Riesgo abierto:** SBB no ha proporcionado cotizaciones agregadas verificadas para todos los trenes del 23, 24, 28 y 31 enero y 1–2 febrero. Los $10,000 MXN son una provisión potencialmente corta, no un precio cerrado. Presupuesto integral de $81,981 MXN conservado como estimación, no aprobado como definitivo.
- Prueba Node añadida: fotos correctas y alternativas del día 6, estructura del resumen de pases y suplemento; GitHub Actions #41734499744: SUCCESS (JSON, JavaScript, Node y Chromium Desktop/Mobile).
- **Siguiente acción:** verificar prueba y carga visual externa de fotos, cotizar en SBB cada trayecto nacional con y sin Half Fare, recalcular diferencia real y cerrar presupuesto antes de merge.


## Auditoría comparada adicional y avance económico · 2026-11-03
- Tres pasadas sobre Suiza vs `italia-norte-2027` y guías: (1) Panorama, 12 meses, itinerario, 10 noches, 4 hoteles; (2) referencias de fotografías (14 claves), tarifas sin cotización = `price: null`, estado `planning`, 8 notas comparativas y enlaces de hoteles; (3) reconciliación de `expenses` ($81,981 MXN), vuelos sin duplicación, comida $9,000 y escenarios de riesgo.
- **Error material corregido:** CHF 102 de Gornergrat NO es ida/vuelta convencional en tren, sino Winter Pass con equipamiento; tarifa con Half Fare CHF 72 (no CHF 51). Precio del tren convencional de enero 2027 sigue por cotizar.
- **Nueva información confirmada:** pase Jungfrau 3 días CHF 176, Top Ticket CHF 63, Swiss Half Fare Card CHF 150; reserva de asiento Luzern–Interlaken Express CHF 12 opcional (02/11/2026–30/04/2027), sin suplemento panorámico obligatorio.
- **Comparación visible:** `railSummary` ahora se muestra en desplegable dentro de Movilidad, con puntos de equilibrio matemáticos (no tarifas SBB). Prueba de navegador abre el desplegable antes de leerlo, evitando falsos negativos.
- **Segundo error de presentación corregido:** partida `expenses.category=transport` de $10,000 se sumaba al total pero faltaba en el desglose; `budget-table.js` ahora la presenta con categoría «Transporte terrestre · provisión global». El presupuesto revela también supuestos y sensibilidad de +$5,000/+10,000 ($86,981/$91,981 MXN), sin presentar escenarios como cotizaciones.
- Se añadieron reglas de prevención en guía editorial y checklist: distinción de productos, comparación renderizada, partidas visibles, precio `null` cuando no esté cotizado.
- **CI:** ejecución de cambios de componentes #41736632352 SUCCESS; ejecución de documentación #41736714762 completando navegador al momento de registrar. Las pruebas cubren 20 viajes, escritorio/móvil y errores de JS/JSON.
- **Estado:** Panorama, Mapa, Temporadas, Experiencias, Reservaciones (planeación), Alojamientos (candidatos) y Día por día completos en contenido y auditoría de datos. Movilidad y Presupuesto ahora tienen un modelo comparativo verificable, pero siguen **pendientes de cotizaciones exactas** de trenes nacionales, hoteles y Gornergrat, y de conciliación final.
- **Próximo paso:** consultar billetes reales en SBB para 23/24/28/31 enero y 1/2 febrero (clase 2, adulto 1, con y sin tarjeta), cotizar Gornergrat ferroviario sin paquete y hacer auditoría final de imágenes externas; entonces elegir pases y ajustar el rango presupuestario.


## Reconciliación ferroviaria con tarifario oficial 2026/27 · 2026-11-03
- **Rectificación de un error propio:** las auditorías anteriores calificaron erróneamente CHF 102 de Gornergrat como Winter Pass. El PDF oficial de Gornergrat, edición junio 2026, muestra claramente billete ferroviario Zermatt–Gornergrat **ida/vuelta CHF 102** en noviembre 2026–abril 2027, **ida CHF 51**; descuento de 50 % con Swiss Half Fare Card, por tanto retorno reducido **CHF 51**. Se reemplaza la afirmación errónea en el JSON y las comparativas. La tabla anterior confundía productos por no haber verificado el PDF tarifario y el tipo de billete, pese a figurar una fuente oficial.
- **Jungfrau:** pase peatonal de tres días CHF 176 en fechas 25–27 enero 2027; Top Ticket Jungfraujoch CHF 63 adicional opcional, según tabla oficial Jungfrau.
- **SBB:** no se obtuvo una lista de precios de compra para los seis desplazamientos del viaje, con y sin Half Fare Card, en el canal público accesible. Suiza Turismo publica oferta de Luzern–Interlaken desde CHF 34 con ventana que incluye enero 2027, pero no garantiza ese precio ni incluye la conexión a Grindelwald. Las tarjetas de billete nacional siguen con `price: null`, estado `planning`, sin inventar importes.
- **Punto de equilibrio verificable:** Gornergrat aporta CHF 51 de ahorro, así que a la tarjeta turística CHF 150 le faltan CHF 99 de descuentos en billetes SBB/ZVV; si todos reducen 50 % el umbral de gasto ordinario del resto es CHF 198. Tarifas Saver, descuentos mínimos y otras condiciones pueden cambiar la cifra.
- **Presupuesto:** $81,981 MXN aún es estimación, con provisión de transporte $10,000 MXN no conciliada por billetes SBB fechados; precio Gornergrat confirmado como referencia oficial. Se mantienen 12 jornadas, 10 noches, 4 hoteles y vuelos no comprados.
- **Siguiente paso:** completar la cotización SBB real en el proceso de compra (sin pagar) de los seis trayectos fechados y documentar tarifas normales/Supersaver con y sin Half Fare. Recalcular subtotal terrestre y rango; luego revisión externa de imágenes y cierre editorial del PR. No hacer merge.

 
## Auditoría editorial triple y avance de movilidad · 2026-11-03 (continuación)
- **A: estructura y línea editorial:** contra `AGENTS.md`, guía editorial y plantilla de Italia Norte: 12 fechas consecutivas, 10 noches, cuatro alojamientos, los 12 meses, tres indicadores exactos en Panorama, nueve secciones con estructura y reservas correctamente jerarquizadas. Fotos y descripciones del viaje independientes de Italia.
- **B: logística, pruebas y fotografías:** se detectó que los vuelos con escalas se codificaban como un solo tramo, aparentando vuelos directos MEX–ZRH/ZRH–MEX. Corregidos a dos segmentos por sentido: MAD/CDG en opción A y FRA/MUC en opción B; horarios internos desconocidos = `null`, sin inventar. Regresión Node y prueba de navegador para conexiones. Verificadas las páginas de las nueve fotografías nuevas en Wikimedia Commons; imagen, atribución, licencia y origen presentes en `data/places.json`; no equivale a garantizar descarga desde cada dispositivo.
- **C: tarifas y dinero:** mantenidos CHF 176 Jungfrau Winter Hiking Pass (25–27 enero), CHF 63 Top Ticket (periodo 01/12/2026–30/04/2027, confirmado en la versión vigente de Jungfrau), CHF 150 Swiss Half Fare y tarifa oficial Gornergrat retorno CHF 102 / CHF 51 con tarjeta. Se añadieron Saver Day Pass de SBB como escenario de comparación para 28 y 31 de enero: **desde CHF 52 sin Half Fare / CHF 29 con tarjeta** son mínimos promocionales sujetos a cupos, NO cotización de nuestros días. SBB abre ventas hasta seis meses antes, por lo que los días de enero 2027 pueden cotizarse ahora; la web pública de resultados no expuso el precio exacto de carrito, así que permanecen `price:null` y `status:planning`.
- **Riesgo de presupuesto:** combinar los pases Jungfrau + Half Fare exige CHF 326 (≈ $7,484 MXN, según tipo de cambio editorial) y deja ≈ $2,516 MXN de los $10,000 de movilidad para todos los trenes nacionales y locales. Ese saldo probablemente no bastará; **no declarar cerrado Movilidad ni Presupuesto** hasta cotizar por trayecto y recalcular el total. El total global de $81,981 MXN sigue siendo **meta estimada**, no presupuesto reservado.
- **Pruebas:** 3 pasadas de auditoría de datos sin incidencias; nuevos controles para multi-tramos aéreos, 10 entradas de comparación y 9 fuentes/licencias de fotos. CI por confirmar para el commit de pruebas más reciente al registrar.
- **Documentación preventiva:** guía editorial y checklist actualizados con la obligación de mostrar cada segmento de vuelos con escala, respetar `null` para horarios internos y no confundir precios «desde» con importes reservables.
- **Siguiente paso:** obtener tarifa normal y promociones efectivamente ofrecidas por SBB para Zürich Flughafen–Luzern (23 ene), Luzern–Grindelwald (24), Grindelwald–Zermatt (28), Zermatt–Zürich HB (31), Zürich–Kilchberg (1 feb) y Zürich HB–Flughafen (2). Comparar descuento sobre cada importe y decidir si vale la pena comprar Half Fare; luego cierre del presupuesto y revisión visual final. Sin merge ni reservas.


## Avance en cotización oficial 2027 · ZVV y SBB · 2026-11-03
- **Nueva tarifa 2027:** ZVV publicó precios vigentes desde el 13/12/2026. Zürich (zona 110 cuenta doble) ↔ Kilchberg ZH (zona 150) exige **tres zonas**. Billete sencillo adulto CHF 7.40, con Half Fare CHF 3.70. Pase 24h CHF 14.80 adulto o CHF 7.40 con Half Fare. Dos sencillos equivalen al pase 24h, que aporta flexibilidad.
- **Fuente original:** https://www.zvv.ch/content/dam/markt/tarif-und-fahrausweiskontrolle/verbundtarif/2027/Preise%20ab%2013.12.2026.pdf
- **Rectificación editorial:** la web inglesa ZVV aún presentaba precios anteriores (CHF 7.20 / 3.60 y 14.40 / 7.20). Para el 1/02/2027 prevalece la nueva tabla PDF.
- Se añadió la ficha majorTransport.zurich-kilchberg-zvv con cuatro tarifas oficiales y dos direcciones, referenciada por el día 11. Su atributo budgetIncludedIn: rail-budget impide duplicar los $10,000 MXN de movilidad.
- **SBB restante:** la venta puede hacerse hasta seis meses antes pero no se pudieron obtener importes de checkout para las fechas concretas. Faltan Zürich Flughafen–Luzern, Luzern–Grindelwald, Grindelwald–Zermatt, Zermatt–Zürich HB y Zürich HB–Flughafen. No atribuirles mínimos promocionales como si fueran cotizaciones.
- **Presupuesto:** mantiene $81,981 MXN provisional, incluyendo ya ZVV dentro de la provisión ferroviaria y Gornergrat dentro de actividades. Half Fare no se recomienda por defecto sin el ahorro efectivamente ofrecido por SBB.
- **Revisión:** tres pasadas de coherencia (12 días/10 noches, contratos y referencias, presupuesto y doble cómputo) completas antes del JSON. Pruebas Node y browser con nueva ficha ZVV añadidas; CI por verificar en la última ejecución.
- **Siguiente paso:** obtener cotizaciones dinámicas reales SBB de las cinco rutas con y sin Half Fare y Saver Day Pass, reconciliar totales y continuar auditoría D. No hacer merge ni compras.


## Auditoría triple de ZVV y siguiente traslado · 2026-11-03
- **Auditoría A · Guías/edición:** Panorama, mapa, doce temporadas, siete experiencias, reservas, siete tarjetas de transporte, cuatro hoteles, doce jornadas y presupuesto visibles según el estándar. Comparación de indicadores de Panorama con Italia Norte sin desviaciones; rutas y textos turísticos independientes.
- **Auditoría B · Contrato transporte:** detectado y corregido que la ficha Zürich ↔ Kilchberg mostraba dos `single` como opciones de precio de una ida/vuelta. Ahora las cuatro alternativas representan viajes COMPLETOS: pase 24h CHF 14.80 / 7.40 con Half Fare, o DOS sencillos por CHF 14.80 / 7.40. Los precios unitarios de CHF 7.40 / 3.70 siguen explicados, pero no se presentan como ida/vuelta. Fuente PDF ZVV desde 13/12/2026, página de tarifas 3 zonas, verificada. Añadida guía preventiva y pruebas Node/browser.
- **Avance etapa 07:** Zürich HB → Zürich Flughafen del 2 febrero 2027 está en zonas 110 (cuenta doble) + 121. Se actualizó `airport-return` con tarifa oficial de sencillo CHF 7.40 / 3.70 con Half Fare, un solo sentido y `budgetIncludedIn: rail-budget`. Como consecuencia, son CUATRO las conexiones nacionales todavía pendientes de cotización exacta: ZRH→Luzern (23 enero), Luzern→Grindelwald (24), Grindelwald→Zermatt (28), Zermatt→Zürich HB (31). La ida a Kilchberg y el traslado urbano al aeropuerto ya están tarifados.
- **Auditoría C · Económica:** la tarjeta Swiss Half Fare CHF 150 aportaría CHF 51 de ahorro en Gornergrat y CHF 11.10 en ambos ZVV, CHF 62.10 en total. Faltan CHF 87.90 de descuentos sobre billetes nacionales, equivalentes a CHF 175.80 de tarifas ordinarias si todos se redujeran 50 %. Los boletos Supersaver pueden alterar ese umbral; el cálculo es condicionante, no cotización. Presupuesto total proyectado se conserva en $81,981 MXN, incluyendo ZVV y sin doble sumar billetes.
- **Validación:** tres pasadas en datos (integridad de nueve secciones, contratos/referencias, conciliación financiera) sin desviaciones. Tests de ida/vuelta, aeropuerto y umbral Half Fare agregados al CI; **GitHub Actions #41748594996 SUCCESS**: JavaScript, JSON, Node y navegador Desktop/Mobile completos, sin fallos.
- **Siguiente paso:** obtener precio realmente ofertado por SBB para las cuatro conexiones nacionales, comparar boletos flexibles/Supersaver/Saver Day Pass con y sin Half Fare, ajustar provisión $10,000 si fuera necesario; luego fotos externas y auditoría D. PR #9 abierto, sin merge ni compras.


## Reanudación tras límite de conversación · 2026-11-03
- Recuperado estado del PR #9 en `feature/suiza-2027`, SHA `dd96e9f52c06e7913bba153db56a43500450e718`; la rama `main` permanece sin merge.
- **CI verificado nuevamente:** GitHub Actions run **41748828567**, número 415, resultado **SUCCESS** para el SHA anterior. Corrige cualquier ambigüedad sobre el último CI pendiente en apuntes anteriores.
- **Pendientes reales en el JSON actual:** cuatro billetes nacionales: Zürich Flughafen→Luzern (23 ene), Luzern→Grindelwald (24 ene), Grindelwald→Zermatt (28 ene), Zermatt→Zürich HB (31 ene). ZVV Zürich↔Kilchberg y Zürich HB→Flughafen cuentan ya con valores 2027 documentados.
- **Consulta SBB:** las fuentes oficiales SBB indican que Supersaver y Saver Day Pass se ofrecen hasta seis meses antes, con tarifas dependientes de inventario, fecha y selección de descuento; no fue posible recuperar del carrito cuatro cotizaciones específicas para las fechas del viaje. Fuentes: https://www.sbb.ch/en/help-and-contact/products-services/tickets/switzerland/supersaver-tickets-saver-day-passes.html y https://www.sbb.ch/en/offers/find-saver-offers . Mantener `price: null` para las cuatro rutas, no convertir mínimos «desde» en cotizaciones.
- **Presupuesto:** $81,981 MXN continúa provisional, con $10,000 MXN de provisión para movilidad. No recomendar automáticamente Half Fare antes de comparar los cuatro importes y las condiciones de los pases; persiste riesgo de insuficiencia.
- **Siguiente paso comprobable:** conseguir en el proceso de compra SBB cuatro pares de tarifas con/sin Half Fare (incluyendo disponibilidad de Supersaver/Saver Day Pass) para las fechas exactas, sin pagar; luego conciliar presupuesto y hacer revisión visual externa de fotos. Sin compras ni merge.


## Comparativa SBB: condiciones y límite presupuestario · 2026-11-03
- **Fuentes SBB verificadas:** https://www.sbb.ch/en/offers/supersaver-ticket ; https://www.sbb.ch/en/offers/saver-day-pass ; https://www.sbb.ch/en/offers/swiss-half-fare-card ; https://www.sbb.ch/en/help-and-contact/products-services/tickets/switzerland/tickets.html .
- Los billetes Point-to-Point ordinarios tienen flexibilidad durante el día de validez; Supersaver se ata a un tren/conexión y suele tener reembolso muy restringido; Saver Day Pass cubre la red de validez GA durante el día, **no debe suponerse que incluye remontes de montaña**. Los precios «desde CHF 29 / CHF 52» de Saver Day Pass (con/sin Half Fare) son **mínimos públicos, no cotizaciones específicas de enero 2027**. Swiss Half Fare Card oficial CHF 150 por un mes. La venta de billetes por tren depende también de la publicación del horario tras cambio anual de diciembre; no equiparar «6 meses de anticipación» con disponibilidad de cualquier conexión.
- **Comparativa pendiente por cada fecha de las cuatro rutas**: a) billete Point-to-Point ordinario con/sin Half Fare; b) Supersaver y Flex real para conexión elegida, con/sin tarjeta; c) Saver Day Pass disponible para fecha, con/sin tarjeta, comprobando área GA, horario y transbordos. No mezclar precios de distintos horarios en una misma opción.
- **Prioridad logística:** Zürich Flughafen→Luzern 23/01 tras vuelo internacional no debe fijarse automáticamente a Supersaver no flexible: retrasos, inmigración y equipaje pueden invalidar la conexión. Lucerna→Grindelwald, Grindelwald→Zermatt y Zermatt→Zürich pueden elegirse con mayor antelación si el cronograma permite margen.
- **Chequeo financiero ilustrativo usando snapshot editorial CHF≈$22.96 MXN, NO tarifas de tren:** presupuesto movilidad $10,000 MXN ≈ CHF 435.54. Jungfrau CHF 176 + ZVV ya documentado CHF 14.80 (Kilchberg ida/vuelta) + CHF 7.40 (aeropuerto) = CHF 198.20: quedan ≈ CHF 237.34 para **los cuatro trayectos nacionales y cualquier otro transporte pendiente**, sin Half Fare. Si se adquiere también Half Fare CHF 150, las dos tarifas ZVV reducidas sumarían CHF 11.10, resultando CHF 176 + 150 + 11.10 = CHF 337.10 y saldo ≈ CHF 98.44. El descuento Gornergrat (CHF 51) corresponde al **fondo de actividades** y no se debe descontar dos veces del fondo de movilidad.
- **Decisión prudente:** no recomendar comprar Half Fare ni cambiar el presupuesto $81,981 MXN hasta conseguir cotizaciones verdaderas de los cuatro trayectos; comparar también escenario sin tarjeta + Saver Day Pass, ya que puede resultar más económico y flexible en días de traslados largos. Mantener `price:null` en los cuatro trayectos. Revalidar importe final, categoría y enlaces en UI antes de cerrar auditoría C/D.


## Revisión del pase Jungfrau · 2026-11-03
- Fuente oficial: https://www.jungfrau.ch/en-gb/jungfrau-ski-region/jungfrau-region-hiking-sledging-pass/ (tarifario 2026/27). Los días 25–27/01/2027 caen fuera de temporada alta: pase consecutivo de **3 días CHF 176**; alternativa de **2 días CHF 120 + 1 día CHF 61 = CHF 181**. La segunda cuesta solo CHF 5 (≈ $115 MXN) más, pero permite separar un día dentro de la estancia ante mal tiempo; NO adquirir ambos escenarios.
- La alternativa 2+1 está documentada en `railSummary`. El total presupuestario permanece **$81,981 MXN** y sigue contando solo una provisión provisional; las cuatro tarifas SBB continúan `null`.
- El Jungfraujoch Top Ticket aparece en la página oficial a CHF 63, con validez 01/12/2026–30/04/2027. Es suplemento del pase elegible, no billete independiente; decidir según visibilidad y condiciones.
- Control de datos previo a guardar: 12 jornadas, 7 fichas `majorTransport`, suma `expenses` $81,981 MXN. **CI del nuevo commit todavía por verificar**; no declarar auditoría D cerrada por esta comprobación estructural.
- Siguiente paso: confirmar tarifas efectivas de carrito SBB para los cuatro viajes; posteriormente, resolver conveniencia global Half Fare, fotografias externas y QA final.


## Auditoría correctiva de Top Ticket y fotos · 2026-11-03
- **Error crítico corregido en JSON (commit 37934b5):** Jungfrau Top Ticket de CHF 63 requiere Winter Hiking and Sledging Pass **desde 3 días** (u otro pase elegible). La alternativa 2 días CHF 120 + 1 día CHF 61 = CHF 181 **NO equivale** al pase de tres días para este beneficio. Corregidas las comparativas `railSummary`, día 27/01, notas de pases y gastos; mantener la modalidad 3 días consecutivos si se desea Jungfraujoch. Fuente oficial: https://www.jungfrau.ch/en-gb/jungfrau-ski-region/top-ticket-jungfraujoch/
- Fuente de temporada 2026/27 del pase: https://www.jungfrau.ch/en-gb/jungfrau-ski-region/jungfrau-region-hiking-sledging-pass/ ; confirma precios y vigencia 21/11/2026–25/04/2027. El Top Ticket figura con periodo 01/12/2026–30/04/2027. El suplemento depende del pase elegible y condiciones de operación.
- **Fotografías externas:** se abrieron correctamente las fichas de Wikimedia Commons para Grindelwald, Wengen, Mürren y Männlichen; se comprobó que los títulos de fichero existen. No se infiere de ello que las URLs de imagen respondan siempre en el navegador ni que todas las atribuciones estén validadas visualmente. La inspección de las otras cinco y prueba real de carga siguen pendientes.
- **Consistencia estructural posterior a corrección:** 12 jornadas, siete fichas de movilidad y `expenses` con suma $81,981 MXN. Cuatro precios nacionales SBB continúan en `null`; la provisión de transporte $10,000 MXN no queda conciliada. Sin compras, merge ni cambios en viajes ajenos.
- **Pendientes de cierre:** cotización real del carrito SBB para cuatro trayectos; verificar precios de hoteles para fechas exactas; comprobar las nueve imágenes externas en navegador con conectividad; esperar resultado CI del último commit. No marcar D aprobada sin ello.

- **Ampliación auditoría de fuentes fotográficas:** abiertas también las fichas Wikimedia de Lauterbrunnen, Zermatt, fuente Lindt, Wintermatterhorn y Jungfraujoch. Las **nueve de nueve páginas de origen** existen y responden; esto valida la URL de fuente, **no equivale** a prueba de descarga de `Special:FilePath?...width=1280` en todos los dispositivos ni a revisión estética completa en el Atlas. Estado editorial: fuente verificada / render remoto pendiente.
