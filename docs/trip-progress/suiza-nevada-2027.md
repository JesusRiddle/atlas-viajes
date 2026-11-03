# Registro de avance por viaje · Atlas

Copiar esta plantilla a `docs/trip-progress/suiza-nevada-2027.md` al comenzar una **implementación nueva**. Es un registro de ejecución, no una fuente de datos turísticos: el itinerario y precios viven en `data/trips/suiza-nevada-2027.json`. Mantenerla en la **misma rama/PR** del viaje; no sobrescribirla con la de otro destino.

**Viaje:** Suiza nevada 2027  
**JSON:** `data/trips/suiza-nevada-2027.json`  
**Rama / PR:** feature/suiza-2027 · https://github.com/JesusRiddle/atlas-viajes/pull/9  
**Modalidad:** [ ] Planeación general  [x] Itinerario detallado  
**Última actualización:** 2026-11-03  
**Etapa actual:** 11 · Auditoría C editorial y económica completada; CI del último ajuste ferroviario pendiente  
**Siguiente acción autónoma:** Completar auditoría C con el resultado CI del commit 274d7266; luego revisar fotos/licencias/enlaces y auditoría D  
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
