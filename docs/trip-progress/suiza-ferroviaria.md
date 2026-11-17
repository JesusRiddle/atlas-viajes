# Registro de avance por viaje · Atlas

Copiar esta plantilla a `docs/trip-progress/suiza-ferroviaria.md` al comenzar una **implementación nueva**. Es un registro de ejecución, no una fuente de datos turísticos: el itinerario y precios viven en `data/trips/suiza-ferroviaria.json`. Mantenerla en la **misma rama/PR** del viaje; no sobrescribirla con la de otro destino.

**Viaje:** Suiza Ferroviaria — Glacier & Bernina Express  
**JSON:** `data/trips/suiza-ferroviaria.json`  
**Rama / PR:** feature/suiza-ferroviaria · PR pendiente  
**Modalidad:** [x] Planeación general  [ ] Itinerario detallado  
**Última actualización:** 2026-11-17  
**Etapa actual:** 02 verificada · 03 en análisis, sin fijar año ni fechas  
**Siguiente acción autónoma:** Comparar precios completos de hoteles para junio y septiembre en Zermatt/Pontresina/Zúrich/Milán y comprobar cobertura de remontes; después decidir ventana y cerrar etapa 03.  
**Decisión que sí requiere al usuario (si existe):** Elegir ventana junio (segunda mitad) o septiembre (primera mitad) y confirmar si la variante A optimizada merece pasar a calendario; año todavía abierto.

## Checklist numerado de ejecución · orden de dependencias

El **orden de producción** se organiza de lo más independiente a lo más dependiente. **NO** es el orden de las nueve secciones en la pantalla, que permanece definido por el estándar maestro. Marcar «verificado» solo tras cotejar fuente, consistencia y dependencias; cifras de temporadas o tarifas futuras pueden ser estimaciones documentadas, no disponibilidades confirmadas.

- [x] **00 · Preparación.** Leer `AGENTS.md`, estándar, guía, contrato y plantilla; crear rama, JSON **visible de inmediato en Inicio**, y bitácora; sin etiquetas de estado ni modificación de viajes heredados.
- [x] **01 · Alcance y geografía.** Recuperar restricciones ya acordadas: países, ciudades candidatas, prioridades, tipo de viaje, `travelerCount`, duración aproximada, presupuesto objetivo y ventanas sugeridas. **No fijar todavía alojamientos ni horarios inventados.**
- [x] **02 · Temporadas (sección visible 3).** Investigar cada uno de los doce meses para **todos los destinos/regiones candidatos**, clima/luz, fenómenos, cierres y ocupación. Recomendar ventanas y advertir variaciones regionales; esta fase **no depende de hoteles ni tarifas**. Si el usuario ya eligió fechas, evaluarlas sin cambiarlas arbitrariamente.
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
| 00–03 (Auditoría A) | En curso | 12 meses añadidos al JSON con normales de Samedan y calendario operativo; 00–02 cerradas | Año/ventana y ruta aún no aprobados, falta armar días |
| 04–08 (Auditoría B) | Pendiente | — | — |
| 09–11 (Auditoría C) | Pendiente | — | — |
| 12–13 (Auditoría D) | Pendiente | — | — |

**Última auditoría:** <commit + pruebas realmente ejecutadas>  
**Pendientes externos no bloqueantes:** <precios futuros, horarios sin publicar, fotos inaccesibles, etc.>  
**Próxima ejecución autónoma:** 03 · tras selección de temporada, armar 10–12 días y noches, cotizar vuelos, comprobar transferencias y ejecutar auditoría A.

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
