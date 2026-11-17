# Registro de avance por viaje · Atlas

Copiar esta plantilla a `docs/trip-progress/suiza-ferroviaria.md` al comenzar una **implementación nueva**. Es un registro de ejecución, no una fuente de datos turísticos: el itinerario y precios viven en `data/trips/suiza-ferroviaria.json`. Mantenerla en la **misma rama/PR** del viaje; no sobrescribirla con la de otro destino.

**Viaje:** Suiza Ferroviaria — Glacier & Bernina Express  
**JSON:** `data/trips/suiza-ferroviaria.json`  
**Rama / PR:** feature/suiza-ferroviaria · PR pendiente  
**Modalidad:** [x] Planeación general  [ ] Itinerario detallado  
**Última actualización:** 2026-11-17  
**Etapa actual:** Auditoría A APROBADA (03) · pasar a 04 Mapa, 05 Experiencias y 06 Reservaciones; 07 y 08 por completar  
**Siguiente acción autónoma:** Completar etapa 04 Mapa con estaciones y atractivos reales; después 05 Experiencias, 06 Reservaciones, 07 Movilidad y 08 Alojamiento, antes de Auditoría B.  
**Decisión que sí requiere al usuario (si existe):** Ninguna para continuar la investigación; junio 12–22 de 2027 es primera opción de planificación, compras y merge siempre requieren aprobación.

## Checklist numerado de ejecución · orden de dependencias

El **orden de producción** se organiza de lo más independiente a lo más dependiente. **NO** es el orden de las nueve secciones en la pantalla, que permanece definido por el estándar maestro. Marcar «verificado» solo tras cotejar fuente, consistencia y dependencias; cifras de temporadas o tarifas futuras pueden ser estimaciones documentadas, no disponibilidades confirmadas.

- [x] **00 · Preparación.** Leer `AGENTS.md`, estándar, guía, contrato y plantilla; crear rama, JSON **visible de inmediato en Inicio**, y bitácora; sin etiquetas de estado ni modificación de viajes heredados.
- [x] **01 · Alcance y geografía.** Recuperar restricciones ya acordadas: países, ciudades candidatas, prioridades, tipo de viaje, `travelerCount`, duración aproximada, presupuesto objetivo y ventanas sugeridas. **No fijar todavía alojamientos ni horarios inventados.**
- [x] **02 · Temporadas (sección visible 3).** Investigar cada uno de los doce meses para **todos los destinos/regiones candidatos**, clima/luz, fenómenos, cierres y ocupación. Recomendar ventanas y advertir variaciones regionales; esta fase **no depende de hoteles ni tarifas**. Si el usuario ya eligió fechas, evaluarlas sin cambiarlas arbitrariamente.
- [x] **03 · Calendario, ruta y esqueleto diario.** Elegir/validar ventana con `work`, festivos, llegada/salida, orden de ciudades, `bases`, noches, traslados plausibles, excursiones prioritarias y `days[]` por fecha. Investigar conexiones cruciales y reservas que **podrían invalidar** la ruta antes de cerrarla; horarios y precios definitivos quedan para etapas posteriores. **Auditoría A: temporadas → fechas → ruta → noches y días compatibles.**
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
| 00–03 (Auditoría A) | En curso | 12 meses y ruta A con 11 días fechados, 9 noches, 4 alojamientos previstos en JSON, junio elegido como primera opción | Verificar trenes por fecha, hoteles y equipaje antes de aprobar auditoría A |
| 04–08 (Auditoría B) | Pendiente | — | — |
| 09–11 (Auditoría C) | Pendiente | — | — |
| 12–13 (Auditoría D) | Pendiente | — | — |

**Última auditoría:** <commit + pruebas realmente ejecutadas>  
**Pendientes externos no bloqueantes:** <precios futuros, horarios sin publicar, fotos inaccesibles, etc.>  
**Próxima ejecución autónoma:** Cerrar Auditoría A tras validar operativa real y márgenes de conexión, luego 04 Mapa y 05 Experiencias.

## Contrato de trabajo con el usuario

Cuando el usuario diga **«refléjalo en el Atlas»** después de definir la ruta, ejecutar consecutivamente las etapas 00–13 en la misma tarea **hasta donde permitan herramientas, límites y datos**; no pedir permiso entre secciones ni exigir respuestas «adelante». Agrupar escrituras y consultas, comprobar cada bloque y corregir fallas antes de seguir. Si no se logra terminar en esa ejecución, dejar esta bitácora actualizada con etapa exacta, pruebas y siguiente paso para que **un nuevo turno** continúe sin redescubrir el estado. No afirmar que se seguirá trabajando en segundo plano.

Mostrar al usuario un reporte compacto por hitos: **completadas / en curso / pendientes / bloqueadas, siguiente etapa y decisión requerida**; evitar narrar cada archivo. Las decisiones de ruta, gastos relevantes, compras, cambios destructivos y el merge siguen requiriendo aprobación explícita.


## Acuerdos y alcance · 2026-11-17
- Viaje independiente, 1 persona, 10–12 días orientativos, equipaje de mano, 3–4 alojamientos preferidos, cuarto privado y baño propio.
- Protagonistas Glacier Express, Bernina, Engadina, Albula/Landwasser y excursiones no redundantes; no deportes de invierno ni alto impacto.
- **Año, fechas, ruta, alojamiento y tarifas no seleccionados**; no trasplantar visitas o precios de Suiza Nevada/Verde.
- Hipótesis a contrastar: llegada Suiza, Zermatt → Glacier Express → Engadina → Bernina → Tirano → salida Milán; evaluar Chur, Andermatt y regionales.
- La ruta inicial no es una decisión confirmada. No añadir fechas ni días fingidos.
- Auditorías A–D pendientes; no se ha ejecutado navegador o CI en esta etapa.

## Investigación inicial · fuentes consultadas 2026-11-17
- Glacier Express: ruta Zermatt–St. Moritz; reserva obligatoria 1.ª/2.ª clase desde 93 días antes; tarifa publicada CHF 166 (2.ª) + CHF 54 reserva; 1.ª CHF 284 + CHF 54. Fuente https://www.glacierexpress.ch/en/price y https://www.glacierexpress.ch/en/timetable . **Referencia vigente, no cotización 2027/2028.**
- Glacier: cierre del tramo Rhine Gorge / Chur–Disentis 17 abril–2 mayo 2027, bus sustitutorio; validar calendario verano 2027 antes de escoger fechas.
- Bernina Express: RhB anuncia calendario verano 2027 del 24 abril al 3 octubre; consultar frecuencias exactas/dirección. Fuente https://www.rhb.ch/en/panoramic-journeys/bernina-express/ .
- Regional Bernina St. Moritz–Tirano: asiento opcional CHF 5 publicado, frente a panorámico con suplemento obligatorio. Fuente https://www.rhb.ch/en/tickets/bernina-line-reservations/ .
- RhB UNESCO World Heritage Pass 2 días / 4 días de validez, regular Thusis–Tirano excluye Bernina/Glacier Express, CHF 75 segunda clase publicado. Fuente https://www.rhb.ch/en/regional-passes/world-heritage-pass/ .
- Engadina: junio inicia verano y prados florecidos; septiembre transición al otoño y paseos tranquilos. Fuente https://www.engadin.ch/en/guide/engadin-holiday-resorts/engadin-mountains-in-summer-autumn/our-monthly-tips-for-the-engadin .
- Muottas Muragl y Alp Languard: calendario verano 2026 6 junio–25 octubre, **no extrapolar como fechas confirmadas 2027**. Fuente https://www.engadin.ch/en/guide/mountains-railways/operating-times-timetables/mountain-railways-operating-times-in-summer .
- Tirano–Milano Centrale: Trenord referencia 2h30, desde EUR 12.50; conexión a MXP aún por estudiar. Fuente https://www.trenord.it/en/routes-and-timetables/most-searched-lines/milano-centrale-tirano/ .
- Comparación estructural a debatir: (A) Zürich–Zermatt–Glacier completo–Engadina/Pontresina–Bernina regional–Tirano–Milán (11–12 días, 3–4 hoteles); (B) Zürich–Andermatt–Glacier parcial–Chur–Albula–Engadina–Bernina–Tirano–Milán (10–11 días, más diferenciación, Glacier incompleto); (C) Zürich–Zermatt–Glacier completo–Chur/St. Moritz–Bernina completo desde Chur–Tirano–Milán (11–12 días, repite Albula y aumenta movimientos).
- Pendiente prioritario: contrastar vuelos multidestino MEX–ZRH y MXP–MEX con redondos, y validar que conexiones en Tirano/Milán permitan dormir en Milán según horario de vuelo.
- **No se ha elegido ruta, año ni fechas.** No completar etapas 02/03 sin comparación de doce meses y decisión de itinerario.


## Hito 02 · Temporadas y ruta A optimizada · 2026-11-17

### Evidencia climática
- Samedan (1,709 m), normales climáticas de 1991–2020 compiladas con datos MeteoSwiss: junio máxima/minima media 17/3 °C, 91 mm y 11 días de precipitación, 186 horas de sol; septiembre 15/1 °C, 73 mm y 8 días con precipitación, 155 horas de sol. Son referencias regionales, no pronósticos ni comparables literalmente con Zúrich, Zermatt, Tirano. Fuente: https://www.swissactivities.com/en-us/weather/samedan/ . La serie de doce meses quedó en seasonality.months.
- Engadin Tourismus: junio abre la temporada estival, florecen praderas y el valle puede estar tranquilo; septiembre es transición de verano a otoño; laderas de alerce dorado típicamente octubre. Fuentes: https://www.engadin.ch/en/guide/engadin-holiday-resorts/engadin-mountains-in-summer-autumn/our-monthly-tips-for-the-engadin ; https://www.engadin.ch/en/guide/holiday-resorts/autumn-in-the-engadin/engadin-autumn-bucket-list .
- Aperturas **históricas 2026**, NO confirmadas 2027/28: Diavolezza 4 mayo–16 octubre, Muottas Muragl y Alp Languard 6 junio–25 octubre, Corvatsch desde 20 junio, Furtschellas desde 27 junio. Fuente https://www.engadin.ch/en/guide/mountains-railways/operating-times-timetables/mountain-railways-operating-times-in-summer . Por este motivo finales de junio > primera mitad de junio para excursionismo; septiembre temprano ofrece más operatividad conjunta.
- Glacier Express anuncia verano 8 mayo–9 octubre 2027; cierre 17 abril–2 mayo 2027 (Chur–Disentis sustitución). Fuente https://www.glacierexpress.ch/en/timetable y PDF https://www.glacierexpress.ch/GEX-Timetable.pdf?v=2026-11 .
- Bernina Express verano 24 abril–3 octubre 2027, según selector oficial RhB; trayecto panorámico Chur–Tirano y alternativa regional con paradas St. Moritz/Pontresina–Tirano. https://www.rhb.ch/en/panoramic-journeys/bernina-express/ ; https://www.rhb.ch/en/tickets/bernina-line-reservations/ . Calendario 2028 no publicado.

### Alternativa A optimizada sin aprobar
- Ruta lógica: llegada MEX–ZRH; **Zúrich solo como noche amortiguadora opcional** → Zermatt (2 noches; propósito abordar Glacier completo, sin repetir Gornergrat) → Glacier Express Zermatt–St. Moritz (~8 h) → continuar en regional a **Pontresina** o alojamiento práctico St. Moritz (4–5 noches, un solo hotel en Engadina) → Bernina regional de día con **parada en Alp Grüm** y descenso hacia Tirano → regional Trenord Tirano–Milano Centrale (~2 h 30 min) → Milán (1 noche cercana al aeropuerto/tren) → MXP–MEX, sujeto a vuelos.
- Versión 10 días calendario / 8 noches de hotel: 1 Zúrich + 2 Zermatt + 4 Pontresina/St. Moritz + 1 Milán; incluye 1 noche en vuelo de ida y regreso día 10, condicionado por horarios intercontinentales.
- Versión preferible 11 días / 9 noches: 1 Zúrich + 2 Zermatt + 5 Pontresina/St. Moritz + 1 Milán, idem con noche en vuelo. No convertir esta propuesta en bases/days confirmados sin usuario.
- Zúrich podría suprimirse si llegada aérea temprana y traslado robusto directo a Zermatt; 3 hoteles (Zermatt/Engadina/Milán) en lugar de 4, pero no asumir factibilidad sin cotización.
- Globo de excursiones Engadina: Diavolezza (candidato fuerte distinto de Jungfraujoch); Muottas Muragl (candidato fuerte por lagos), pueblos Samedan/Bever/Zuoz, lago Sils/Silvaplana, visita especial Albula/Landwasser desde Filisur con shuttle/plataforma Hennings (candidato de día ferroviario). Corvatsch opcional y parcialmente redundante; St. Moritz ciudad visita corta, no obligatorio hotel allí. Fuente Landwasser: https://www.rhb.ch/en/excursions/viaduct-shuttle/ .
- Advertencia logística **importante**: Glacier Express ya pasa por viaducto Landwasser (línea Albula); el mirador implica viaje parcial de regreso desde Engadina y solo justifica ese desplazamiento si se quiere ver/fotografiar un tren cruzando el viaducto desde afuera. Evitar Bernina Express completo Chur–Tirano a continuación del Glacier porque repite Albula.
- El Bernina **regional** permite parada Alp Grüm, mientras que el Bernina Express panorámico exige reserva y no debe asumirse que permite bajar/reembarcar con la misma reserva. Fuente https://www.rhb.ch/en/tickets/bernina-line-reservations/ .
- Tirano–Milán Trenord: ~2h30, regional directo; referencias de horario y tarifa solo actuales, no cotizadas. Fuente https://www.trenord.it/en/routes-and-timetables/most-searched-lines/milano-centrale-tirano/ . Si se visita Alp Grüm, verificar luz y llegada a Milán con margen; no programar vuelo internacional el mismo día de Bernina.
- Oferta 'Mountain Railways included' para huéspedes de alojamientos participantes a partir de dos noches; verificar hoteles/participación y remontes concretos antes de estimar costo. https://www.engadin.ch/en/guide/mountains-railways/mountain-railway-tariffs/summer-tariffs-mountain-railways/mountain-railways-included .
- **Recomendación provisional**: primera mitad de septiembre (menor lluvia media, remontes activos y poca nieve en senderos) vs segunda mitad de junio (más luz, flores y nieve en cimas). No afirmar menor costo sin cotizaciones de vuelos/hoteles, ni previsión de cielo despejado. Año 2027/2028 sigue sin decidir.

### Control de etapa
- 02 verificada a nivel de investigación climática con 12 meses en JSON y fuentes citadas.
- 03 solo propuesta; **Auditoría A pendiente**, al igual que vuelos, hoteles, tarifas, validación CI y visualización del navegador.


## Hito 03 parcial · Vuelo multidestino de referencia elegido · 2026-11-17
- **Selección del usuario:** conservar como mejor candidato de **junio de 2027**, sin compra, la tarifa total de **MXN 17,450 para 1 adulto** mostrada en Google Flights al reservar mediante SWISS (la opción de reserva directa Lufthansa se muestra a MXN 17,878). Los cuatro vuelos son operados por Lufthansa. Capturas compartidas en conversación, 17 noviembre 2026.
- **Ida sábado 12 junio:** MEX 19:50 → FRA +1 día 14:50, LH499 Boeing 747 (11 h). FRA 16:30 → ZRH 17:25, LH1194 A320neo (55 min); escala 1 h 40 min. Aterrizaje domingo 13 junio. Primera noche en Zúrich es coherente con esta llegada.
- **Regreso martes 22 junio:** MXP 11:00 → FRA 12:20, LH249 A321 (1 h 20 min); FRA 13:30 → MEX 17:30, LH498 Boeing 747 (12 h). Escala **1 h 10 min**, relativamente ajustada; comprobar conexión en boleto único y condiciones de protección, paso fronterizo Schengen y margen antes de confirmar compra.
- **Equipaje:** Google Flights muestra 1 pieza de equipaje de mano gratis; equipaje documentado con costo adicional, condiciones específicas por proveedor/tarifa aún por verificar.
- **No interpretar como reserva ni gasto incurrido.** El año, las fechas del viaje y la ruta siguen formalmente pendientes; junio 12–22 es un escenario comparativo seleccionado para conservar, no decisión que descarte septiembre 2027 o 2028. No fijar `start`/`end` ni `days` en JSON hasta aprobar escenario.
- **Pendiente:** comparación con septiembre y confirmación de tarifa final directamente en SWISS (precio/cabina/conexión/equipaje). Verificar si la llegada de Tirano a Milán el 21 junio permite alojamiento y traslado a MXP sin presión.


## Cotización alternativa de septiembre verificada · 2026-11-17
- **4–14 septiembre 2027, 1 adulto, multidestino MEX→ZRH / MXP→MEX**, Google Flights: SWISS **$21,419 MXN**, Lufthansa **$21,848 MXN**, mismos segmentos LH499 + LH1194 / LH249 + LH498 que el escenario de junio, ida 19:50→17:25 (+1), regreso 11:00→17:30. Equipaje de mano incluido según captura; facturado adicional. Escalas FRA 1h40 ida y 1h10 regreso. Fuente: capturas del viajero en chat.
- Diferencia de itinerarios equivalentes SWISS: **septiembre +$3,969 MXN** frente a junio 12–22 ($17,450 MXN). No extrapolar esta diferencia a hoteles ni costo integral antes de compararlos.
- Precaución: el regreso seleccionado de septiembre de **11:00** no es el de 08:55 (que tenía conexión más larga y se mostró por el mismo precio en listado previo); solicitar nuevo desglose si se decide éste.
- **Siguiente lote:** hoteles por fecha de estancia, alternativas Pontresina/St. Moritz, beneficio de remontes, itinerario 11 días con 1 Zúrich + 2 Zermatt + 5 Engadina + 1 Milán, sin convertirlos en reservas.


## Primer filtro de alojamientos · investigación 17 noviembre 2026
- **No son reservas ni cotizaciones fechadas.** Comparar una persona / habitación privada / baño privado y total de cada ventana: Zúrich 13 jun vs 5 sep (1 noche), Zermatt 14–16 jun vs 6–8 sep (2), Pontresina 16–21 jun vs 8–13 sep (5), Milán 21–22 jun vs 13–14 sep (1). Este reparto sigue siendo hipótesis; ninguna noche se fija en `bases`.
- **Pontresina preferida provisionalmente por infraestructura ferroviaria y beneficio hotelero**, no por precio comprobado. Candidatos con sitios oficiales: Hotel Station (frente a estación; investigar posible ruido) https://www.hotelstation.ch/ ; Hotel Bernina (a ~10 minutos andando de estación, traslado hasta 17:00, desayuno, remontes incluidos con condiciones) https://www.hotelbernina.ch/en/ ; Hotel Garni Chesa Mulin (cuarto con baño privado, desayuno y remontes incluidos 2+ noches; taxi a la estación no necesariamente gratuito) https://www.chesa-mulin.ch/en/ ; Hotel Steinbock https://www.hotelsteinbock.ch/en/steinbock/steinbock-benefits . Comparador St. Moritz: Hauser Hotel https://www.hotelhauser.ch/ (centro, desnivel a estación); no declarar más barato uno sin tarifas equivalentes.
- **Zermatt:** Hotel Sarazena, Bahnhofplatz 14, cerca de estación, habitaciones con baño propio: https://www.hotel-sarazena.ch/home-en ; Hotel Butterfly, Bodmenstrasse 21, cerca de estación: https://www.hotelbutterfly.ch/ . Comparar habitaciones individuales reales y flexibilidad.
- **Oferta oficial Engadin Mountain Railways Included:** huéspedes de alojamientos participantes con estancia de 2+ noches obtienen determinados remontes en verano; comprobar vigencia en 2027, **qué remontes** cubre (incluida Diavolezza) y si transporte local está incluido por separado; no confundir con trenes interurbanos, Glacier Express o Bernina regional. Fuentes: https://www.engadin.ch/en/guide/mountains-railways/mountain-railway-tariffs/summer-tariffs-mountain-railways/mountain-railways-included ; https://www.myswitzerland.com/en-us/planning/offers/mountain-railways-included/ ; https://www.chesa-mulin.ch/en/room ; https://www.hotelbernina.ch/en/hotel/ .
- **Advertencia:** Hotel Bernina muestra temporada 2026 desde 12 junio, no garantía de apertura o beneficios para 2027; verificar especialmente primera quincena de junio. Antes de comprar pases turísticos, cuantificar realmente las inclusiones hoteleras.
- **No se ha cerrado hotel ni etapa 08.** Faltan tarifas comparables 2027 para cuatro localidades, cancelación, tasas, enlace Maps y validación final de estación a hotel. La comparación de costo integral junio/septiembre sigue pendiente, aunque el vuelo es MXN 3,969 más barato en junio.


## Hito investigación operativa y alojamientos · 17 noviembre 2026
- **Nueva evidencia oficial 2027**, reemplaza la inferencia histórica 2026 para esos remontes: Diavolezza 3 mayo–22 octubre 2027, con cambios de horario por subperíodo; Corvatsch Surlej–Murtèl y Murtèl–Corvatsch **19 junio–22 octubre 2027**; Furtschellas **26 junio–22 octubre 2027**. Fuente https://www.corvatsch-diavolezza.ch/en/news-1/operating-hours . La ventana de Engadina 16–21 junio permite Diavolezza y Corvatsch **solo los días 19–20**, pero NO Furtschellas. Septiembre temprano permite las tres. Muottas Muragl solo tiene horarios 2026 visibles, no afirmar confirmación 2027: https://www.engadin.ch/en/guide/mountains-railways/operating-times-timetables/mountain-railways-operating-times-in-summer .
- **Hotel Bernina Pontresina** publica apertura **11 junio–24 octubre 2027**, compatible con ambos escenarios, y anuncia transporte público regional + remontes de Alta Engadina incluidos para estancias de 2 noches o más en verano; comprobar cobertura exacta de destinos, elegibilidad de la tarifa y fechas antes de reservar. Fuentes https://www.hotelbernina.ch/en/ y https://www.hotelbernina.ch/en/hotel/ . Se favorece como candidato fuerte, NO seleccionado ni precio confirmado.
- **Hotel Station Pontresina**, junto a estación, anuncia beneficio de transporte público y remontes desde segunda noche; https://www.pontresina.ch/en/guide/accommodation/hotels/hotel-station . **Hotel Steinbock** también ofrece transporte y remontes, así como traslado de estación en horas delimitadas: https://www.hotelsteinbock.ch/en/steinbock/steinbock-benefits .
- **Hotel Sarazena (Zermatt)**: turístico oficial confirma ubicación junto a estación y Gornergratbahn https://www.myswitzerland.com/en-us/accommodations/hotel-garni-sarazena-1/ .
- **No se obtuvieron cotizaciones de hotel para las fechas exactas** 13–14, 14–16, 16–21, 21–22 junio 2027 y homólogas septiembre. Los precios indexados en portales corresponden a otras fechas, monedas o habitaciones; NO tratarlos como tarifas verificadas. Falta total comparable de 9 noches (1 persona, baño privado, desayuno, tasas/cancelación) en ambos escenarios.
- **Fórmula de decisión:** septiembre requiere ahorrar al menos MXN 3,969 en alojamiento y excursiones frente a junio para igualar el subtotal de vuelos, manteniendo beneficios y calidad comparables. Sin precios exactos, junio es líder aéreo y septiembre líder de flexibilidad de remontes; costo integral no determinado.
- **Próximo paso:** cotizaciones hoteleras equivalentes con filtros precisos y llegada a MXP; después decidir fechas/ruta, modelar pases y ejecutar Auditoría A. No modificar `start/end/bases/days/hotels/expenses` como si las fechas o reservas estuvieran confirmadas.

### Validación adicional de beneficio hotelero
- El catálogo oficial del paquete de montaña enumera expresamente el **teleférico de Diavolezza** entre los incluidos, sujeto a vigencia y hotel participante: https://booking.engadin.ch/de/experiences/hotel--bergbahnen-inklusive . El beneficio no sustituye billetes del Glacier/Bernina Express.
- No incluir precios extraídos de Booking para otras fechas/monedas. Para comparar estadías de 9 noches, cotizar *misma ocupación/tarifa/impuestos* en ambos períodos; diferencia aérea $3,969 MXN es el umbral económico antes de excursiones.


## Decisión de calendario · 2026-11-17
- **Usuario seleccionó junio de 2027 como primera opción y autorizó planear para esa fecha**. Se usa ventana ya cotizada **12–22 junio 2027** sin afirmar billetes comprados; septiembre sigue como alternativa no prioritaria.
- JSON actualizado: `start/end`, 11 jornadas fechadas, `bases` (Zúrich 1, Zermatt 2, Pontresina 5, Milán 1), `routeCities`, perfil de viajero solo y `work: 7` jornadas laborales de lunes a viernes (sujeto a festivos laborales específicos); días en vuelo no se contabilizan como alojamiento hotelero.
- Orden: 12 vuelo, 13 Zúrich, 14–15 Zermatt, 16 Glacier Express Zermatt–St. Moritz y traslado a Pontresina, 17–20 cuatro días completos Engadina, 21 Bernina regional con Alp Grüm/Tirano a Milán, 22 vuelo de regreso. Pontresina queda localidad de alojamiento prevista, **ningún hotel reservado**.
- El Glacier Express pasa por Albula/Landwasser en el día de traslado; excursión el 20 a Filisur solo si la vista desde fuera y logística justifican retorno en tren. Bernina regional permite parada en Alp Grüm, pero manejo de equipaje pendiente.
- Corvatsch comienza verano **19 junio 2027**, solo puede visitarse del 19 al 20 antes de salir de Engadina; Diavolezza otro día. Fuente operador: https://www.corvatsch-diavolezza.ch/en/news-1/operating-hours . Verificar Muottas Muragl con calendario final.
- Fuentes trayectos: https://www.glacierexpress.ch/en/timetable ; https://www.rhb.ch/en/panoramic-journeys/bernina-express/ ; https://www.rhb.ch/en/ ; https://www.trenord.it/en/routes-and-timetables/most-searched-lines/milano-centrale-tirano/ . No inventar horas de los trenes de 2027; horarios no insertados.
- **Auditoría A todavía pendiente:** validar horario exacto Glacier 16 junio y enlaces a Pontresina, paso Alp Grüm 21 junio, manejo equipaje, y conexión Milán/MXP. Gastos, hoteles, reservas y fotos pendientes; no pasar B/C/D ni merge.


## Auditoría A · revisión ferroviaria 17 noviembre 2026
- **Glacier Express, 16 junio 2027:** horario de verano oficial ya publicado: **PE 902 Zermatt 08:50 → St. Moritz 16:36** (propuesto preferente) o **PE 904 09:50 → 17:36** (alternativa). Ambas opciones recorren el itinerario completo. Consultado el PDF oficial gráfico en 2026-11-17: https://www.glacierexpress.ch/GEX-Timetable.pdf?v=2026-11 y https://www.glacierexpress.ch/en/timetable . Reserva 1.ª/2.ª clase obligatoria, disponible hasta 93 días antes; sin disponibilidad de asientos confirmada.
- **Alp Grüm: RhB confirma que la estación NO dispone de casilleros:** https://www.rhb.ch/en/information/stations/alp-gruem/ . Corrección autónoma: la parada turística pasa al 17 junio como extensión OPCIONAL después de Diavolezza, viajando sin maleta desde Pontresina. El día 21 pasa a ser traslado Bernina regional → Tirano → Milán sin paradas largas. Evitar dependencia logística de guardar equipaje durante tránsito a Italia.
- **Regional Bernina:** RhB confirma reserva opcional CHF 5 por tramo en regional St. Moritz–Tirano, reserva de 1.ª/2.ª clase, no equivale al Bernina Express panorámico: https://www.rhb.ch/en/tickets/bernina-line-reservations/ . Horarios individualizados de 17/21 junio 2027 aún por verificar; no afirmar correspondencia exacta.
- **Tirano→Milano Centrale:** Trenord publica tren directo aprox. 2h30 y servicios regulares, verificar horarios para lunes 21 junio en fecha objetivo: https://www.trenord.it/en/routes-and-timetables/most-searched-lines/milano-centrale-tirano/ .
- **Milano Centrale→MXP T1 el 22 junio:** Malpensa Express publica duración ~51 minutos, primer tren desde Milano Centrale 05:25 y precio de referencia €15 (publicado en noviembre 2026; NO tarifa cotizada para 2027). Fuente https://www.malpensaexpress.it/en/lines-and-timetable/most-searched-lines/milano-centrale-malpensa-aeroporto-t1-route/ . Vuelo MXP 11:00: salida temprana desde hotel próximo a Centrale es viable en principio, verificar terminal/salida concreta y margen de aeropuerto.
- **Puerta Auditoría A:** coherencia de ruta y noches preliminar OK; no declarar auditoría formal completamente aprobada hasta validar el horario real de Bernina regional del 21, enlace Trenord y correspondencia a Pontresina el 16. No se han ejecutado tests en navegador o CI ni comprado transportes.


## Hito 04–06 · Primer contenido estructurado · 2026-11-17
- Mapa inicial en JSON: 5 pines reales para Zúrich, Zermatt, Pontresina, Tirano y Milán; 4 alojamientos + tránsito ferroviario. Coordenadas Zúrich y Zermatt contrastadas con el viaje Suiza Verde existente; Pontresina (46.4955, 9.90126), Tirano (46.21482, 10.16335) contrastados geodatos.net; Milán centro urbano (45.4631, 9.19) aproximado. Falta añadir pines de miradores/estaciones con georreferencias verificadas, no inventar coordenadas. Mapa no marcado como finalizado.
- Experiencias: ocho grupos en JSON (Glacier, Bernina regional, Diavolezza, Muottas Muragl, lagos Sils/Silvaplana, Albula/Landwasser, pueblos de Engadina, Corvatsch opcional). Evitar repetir Jungfraujoch, Gornergrat o Titlis por inercia.
- Reservaciones: prioridad muy alta (Glacier, vuelos, hoteles), alta (Bernina+Trenord, beneficios hoteleros), flexible (remontes y excursiones por clima). Enlaces oficiales; ninguna compra confirmada.
- Verificación complementaria: RhB indica reservas opcionales de CHF 5 para asientos de trenes regionales Bernina, NO Bernina Express panorámico: https://www.rhb.ch/en/tickets/bernina-line-reservations/ . Trenord confirma servicio directo Tirano–Milano Centrale aprox. 2h30, 15 servicios diarios en referencia actual, €12.50 tarifa 2ª publicada sin fecha específica: https://www.trenord.it/en/routes-and-timetables/most-searched-lines/milano-centrale-tirano/ .
- Archivo Glacier Express oficial de 2027 inspeccionado también visualmente (PDF 1 pág): PE 902 Zermatt 08:50–St. Moritz 16:36 y PE 904 09:50–17:36, verano 08 mayo–09 octubre. Fuente https://www.glacierexpress.ch/GEX-Timetable.pdf?v=2026-11 . El 2027-06-16 no tiene asiento reservado; no dar disponibilidad por hecha.
- **Decisión financiera pendiente:** comparar Swiss Travel Pass, Swiss Half Fare Card y Saver Day Pass teniendo en cuenta hoteles con movilidad local incluida; Glacier requiere reserva aparte incluso con pase. SBB publica Half Fare Card CHF 150: https://www.sbb.ch/en/offers/swiss-half-fare-card .
- **Estado:** avance editorial 04–06, no finalizar B/C/D; faltan coordenadas de excursiones, fotografías, hoteles y horarios de regionales individualizados en 2027, contratos `majorTransport`, presupuesto y pruebas DOM.


## Hito de visualización anticipada · 17 noviembre 2026
- **Necesidad del usuario:** ver ya los datos disponibles en la página, sin esperar al cierre del presupuesto ni hoteles. Se completaron en JSON `intro` (narrativa turística), `introShort`, `introHighlights`, `climate` (3 párrafos), `solo`, `local`, `practicalIndicators` (exactamente style, language, entry), `cover: glacier`, `routeHighlights`, `cardHighlights` y `days[].places` donde existían fotos previamente acreditadas en `data/places.json`. Se preservó `places: []` para jornadas exclusivamente de vuelo.
- Se reutilizaron fotos existentes acreditadas de Zúrich, Zermatt, Glacier Express, St. Moritz, Pontresina, Bernina y Tirano; **las fotos de Diavolezza, Alp Grüm, Muottas Muragl, Silvaplana/Sils y mirador exterior Landwasser faltan como entradas específicas**. Las fotos existentes son apoyo inicial y no deben venderse como imágenes de lugares distintos; sustituirlas/completarlas en etapa 12 con fuente, licencia y autor acreditados.
- Datos prácticos verificados para nota 2026-11-17: electricidad C/J, 230 V y 50 Hz según Switzerland Tourism https://www.myswitzerland.com/en-ch/planning/about-switzerland/general-facts/general-information/electricity/ ; ETIAS sin fecha final confirmada en FAQ oficial, consultar antes de salida https://travel-europe.europa.eu/etias/faq . Valores climatológicos de Samedan en `seasonality` son históricos; horas de luz de Pontresina son aproximaciones, no garantías de cielo despejado.
- Persisten `hotels: []`, `majorTransport: []`, `expenses: []`, `exchangeRates: {}` porque falta precio, hotel elegido y modelado de billetes. No completar con cero ficticio, inventar precios o denominar alojamientos como elegidos. Los vuelos ya figuran como cotización en `flight`.
- **Verificación de contenido:** referencia de portada `glacier` y todas las claves de `days[].places` contrastadas con fotografías existentes en `data/places.json`, introHighlights comprobados como subcadenas de `intro` y estructura de JSON validada al guardar. **No se ejecutó servidor ni Chromium Desktop/Mobile/CI** desde el conector GitHub. Hasta ejecutar pruebas formales no dar luz verde al merge.


## Auditoría A · Cierre aprobado, 17 noviembre 2026
**Alcance exclusivamente etapas 00–03 y coherencia clima/calendario/ruta/noches. No es auditoría B, C o D ni confirma billetes/hoteles comprados o disponibilidad de asientos.**

### Resultado de verificaciones
- **Ventana aprobada por el viajero como primera opción:** sábado 12 a martes 22 de junio de 2027; una persona; 11 días civiles, **9 noches hotel** (13–22 de junio) y 1 noche en avión (12–13). `work = 7` días laborables lunes a viernes: lun 14–vie 18 + lun 21–mar 22; sin festivos laborales mexicanos federales dentro de esa semana.
- **Secuencia y alojamientos compatibles:** Zúrich 13–14 (1); Zermatt 14–16 (2); Pontresina 16–21 (5); Milán 21–22 (1). Ninguna jornada obliga a cambiar de hotel dos veces ni supone llegada desde Italia el mismo día del vuelo. Las noches se reconcilian con `bases` y `days[].base`.
- **Vuelo cotizado, NO comprado** MEX→FRA→ZRH 12–13 junio (ZRH 17:25); regreso MXP→FRA→MEX 22 junio (MXP 11:00). Frankfurt: **1h40 ida y 1h10 regreso**; regreso crítico y sujeto a billete único/protección. No fingir disponibilidad ni garantizar la conexión. Revisar al comprar en etapa 07. Referencia proporcionada por el viajero (Google Flights 17-11-2026).
- **Glacier Express verificado para miércoles 16 junio 2027:** PE 902 **Zermatt 08:50 → St. Moritz 16:36**, PE 904 **09:50 → 17:36** alternativo, ambos en temporada **8 mayo–9 octubre de 2027**; cierre Chur–Disentis por obras solo 17 abril–2 mayo, por tanto NO afecta. Reservas obligatorias y no compradas. Fuente PDF oficial: https://glacierexpress.ch/GEX-Timetable.pdf?v=2026-11 y https://glacierexpress.ch/en/faq . Conexión posterior St. Moritz → Pontresina es viable como itinerario ferroviario regional de referencia, pero seleccionar horario individual y margen exactos en 07.
- **RhB 2027:** publicada gráfica horaria de validez **13 diciembre 2026–11 diciembre 2027** para línea 06 St. Moritz–Tirano y línea 05 Chur–St. Moritz/Pontresina. Ello confirma la estructura de corredores y servicios diarios, **no constituye** reserva ni correspondencia exacta con Trenord. Fuentes: https://assets.eu.ctfassets.net/h76myjvzsgnd/12bFjkjM6vyEBWVMmrUjjV/00803a56dac056f07cc66bd5e74fdb02/06_St.Moritz-Tirano_FP2027.pdf y https://assets.eu.ctfassets.net/h76myjvzsgnd/3jmM2UhtTrGDeL8uf40i23/5e0bbe70fa3524866afb4ac20e22d398/05_Chur-St._Moritz_FP2027.pdf . No insertar minutos deducidos de gráficas.
- **21 junio traslado sin rediseñar ruta:** Pontresina→Tirano regional RhB → Milano Centrale Trenord RE8 (trayecto italiano **~2h30** y frecuencia habitual horaria según operador); pernocta Milán antes de MXP 22. Criterio de selección en 07: enlace de **mínimo 20–30 minutos** en Tirano (billetes independientes y posible retraso) y llegada a Milán de día. Fuente https://www.trenord.it/en/routes-and-timetables/most-searched-lines/milano-centrale-tirano/ . Si horarios exactos cambian, escoger otro tren **sin modificar ciudades/noches**.
- **Alp Grüm**: estación RhB sin casilleros; visita opcional del jueves 17 en excursión desde Pontresina, sin maleta. Fuente https://www.rhb.ch/en/information/stations/alp-gruem/ . No condiciona traslado del 21.
- **Clima/temporada:** junio 3 a 17 °C referencia histórica Samedan, días largos, praderas de valle y nieve residual en cumbres. Diavolezza opera el 17 (03 mayo–18 junio 2027 08:20–17:00); Corvatsch abre **sábado 19 junio**; Furtschellas **sábado 26 junio** y queda fuera. Fuente https://www.corvatsch-diavolezza.ch/en/news-1/operating-hours . Miradores condicionados por tiempo, con alternativas en valle.
- **Muottas Muragl:** operador de terraza anuncia **verano 5 junio–24 octubre 2027**, llegada en funicular; verificar servicios exactos en etapa 05/07. Fuente https://www.muottasmuragl.ch/en/restaurant/panoramic-terrace . No condiciona ruta.
- **Landwasser:** Viaduct Shuttle anuncia **6 mayo–27 junio 2027 de miércoles a domingo**; domingo **20 junio incluido**. Se accede desde Filisur al mirador Hennings próximo a Schmitten GR Landwasser Viaduct. La excursión 20 es factible en temporada y puede alternarse con Corvatsch sábado 19 según visibilidad. Fuente https://shop.landwasserwelt.ch/en/pages/viaduct-shuttle . No asegurar asientos ni horarios de 2027 de la lanzadera.
- **Ritmo:** cambios 13→14, 16, 21 y 22; el 16 es un día completo de tren panorámico y el 21 un traslado internacional por tierra; las excursiones en Engadina (17–20) conservan alternativas por clima. No exigir segunda excursión alpina durante traslados. Zermatt 15 junio es día colchón y descanso; no forzar Gornergrat ya conocido.

### Defectos corregidos
1. Muottas Muragl antes figuraba como operación 2027 enteramente desconocida: ya existe temporada publicada para terraza; se precisó fuente y se mantiene la consulta del horario del funicular.
2. Landwasser figuraba con lanzadera incierta: fuente oficial de 2027 confirma servicio dominical en la ventana del 20; se describió acceso a mirador sin prometer reserva.
3. Falta de criterio de margen en Tirano: ahora se exige conexión de al menos 20–30 min y llegada diurna a Milán.
4. Calendario de cumbres condicionado: Corvatsch solo del 19–20 y puede intercambiarse con Landwasser; Furtschellas fuera del itinerario.
5. Distinción entre horarios operativos publicados, servicios regionales todavía no seleccionados y disponibilidad no comprobada; alternativa Glacier PE 904 registrada.

### Puerta de control
**AUDITORÍA A: APROBADA para pasar a etapa 04**. Verificación semántica del JSON realizada tras esta escritura: continuidad de once fechas, 9 noches y 4 alojamientos previstos, secuencia y clima. **No requiere precios/hoteles ni reserva real del Glacier para aprobar etapa 03**: esos son entregables de etapas 06–08. Riesgos residuales registrados para 07 (FRA 1h10, enlace RhB/Trenord y MXP), sin bloqueo estructural de ruta.

**No afirmar auditoría B/C/D, suite Node ni test visual:** aún pendientes de sus etapas.
