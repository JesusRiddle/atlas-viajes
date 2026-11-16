# Registro de avance · Suiza Verde 2027 — Alpes de postal

**Viaje:** Suiza Verde 2027 — Alpes de postal  
**JSON:** `data/trips/suiza-verde-2027.json`  
**Rama:** `feature/suiza-verde-2027`  
**Actualizado:** 2026-11-16  
**Etapa:** 11 · Presupuesto integral provisional documentado. Siguiente: 12 Fotografías y portada. Revisión de tarifas de 2027, tests Node, navegador y auditorías B/C/D pendientes.

## Decisiones registradas
- **12–27 junio 2027**, 16 días calendario, 14 noches de hotel provisionales: Zúrich 2, Lucerna 2, Grindelwald 6, Zermatt 3 y Ginebra 1.
- Una persona desde CDMX, trenes como medio principal; foco en MUST naturales y paisajes alpinos.
- Glacier Express y Bernina Express excluidos de este recorrido: ideas para viaje ferroviario independiente.
- Se conservan Heididorf, Lindt, Titlis, Lauterbrunnen/Mürren/Wengen, First/Bachalpsee, Jungfraujoch, lago Brienz/Giessbach, Oeschinensee, Gornergrat/Riffelsee y Sunnegga flexible.
- Vuelos Lufthansa/SWISS multidestino 12–27 junio Economy Light **$23,300.14 MXN**: cotización del usuario, **no comprado**; ida MEX–ZRH por FRA y regreso GVA–MEX por FRA.
- Septiembre: solo alternativa futura para comparar el mismo itinerario y presupuesto completo.

## Etapas y control
- [x] 00 · Viaje existente y rama propia creada
- [x] 01 · Alcance / MUST seleccionados
- [x] 02 · Temporadas: 12 meses evaluados, estados/intervalos consistentes y fuentes oficiales documentadas (verificación estructural realizada)
- [x] 03 · Ruta y 16 jornadas tentativas actualizadas; auditoría A abierta
- [x] 04 · Mapa: 23 puntos georreferenciados (5 zonas de alojamiento, 18 excursiones); Ginebra representa la ciudad, no el hotel ni el aeropuerto
- [x] 05 · Experiencias: 12 fichas de MUST por región, tren Luzern–Interlaken, alternativas y gastronomía regional documentada
- [x] 06 · Reservaciones importantes: tres grupos, 12 fichas con estado, fechas, alternativas y enlaces oficiales.
- [x] 07 · Transporte mayor: 14 fichas y 16 referencias en jornadas; validación estructural equivalente realizada, prueba real de render y Node pendientes
- [x] 08 · Alojamiento: cinco hoteles principales con fechas, direcciones, enlaces oficiales y Maps; tarifas exactas 2027 aún pendientes
- [x] 09 · Día por día: 16 jornadas con mañana/tarde/noche, hoteles candidatos, movilidad, tips y planes B; horarios de tren y gastos diarios pendientes
- [x] 10 · Panorama: narrativa, indicadores, clima, cinco alojamientos y subtotal aéreo reconciliados; prueba real Desktop/Mobile pendiente
- [x] 11 · Presupuesto integral provisional: 35 estimaciones terrestres, vuelo cotizado, rango, TC y no duplicación; faltan precios finales.
- [ ] 12 · Fotografías y portada
- [ ] 13 · Auditoría global, tests/CI y PR final

## Verificación de Temporadas · 2026-11-16
- 12/12 meses evaluados con estado y rango de temperaturas en formato `mínima a máxima °C`.
- Junio y septiembre recomendables; julio/agosto aceptables con demanda alta; meses invernales desaconsejados para esta ruta.
- Comprobado en fuentes oficiales: telecabina Oeschinensee 24 abr–19 sep 2027, tren Brienzer Rothorn hasta cumbre desde 5 jun 2027; no confundir apertura de transportes con seguridad de senderos.
- Fuentes: MeteoSwiss, Switzerland Tourism, Oeschinensee, Brienz Rothorn Bahn y SwitzerlandMobility.
- Verificado formato y secuencia en JSON; **no realizada inspección de DOM Desktop/Mobile ni CI del repositorio**. La validación visual se mantiene para auditoría global.

## Verificación de Mapa · 2026-11-16
- 23 pines: 5 alojamientos y 18 excursiones, con 23 nombres únicos, coordenadas numéricas y orden de recorrido.
- Todos los puntos de alojamiento se vinculan a `bases`; el punto del aeropuerto usa `stayName: "Ginebra o entorno del aeropuerto"` para las noches, sin inventar un hotel exacto.
- Puntos opcionales de senderismo/visibilidad identificados: Bachalpsee, Riffelsee y Sunnegga. Gimmelwald aparece en el itinerario pero sin pin individual hasta verificar su ubicación precisa; visita secundaria del día de Mürren.
- No se incorporan trenes Bernina ni Glacier ni atractivos descartados. Coordenadas combinan geografía documentada del proyecto y referencias externas geográficas.
- Comprobación JSON realizada; inspección visual Desktop/Mobile y CI completos pendientes, sin autorización de merge.

## Verificación de Experiencias · 2026-11-16
- 12 fichas con localidad/región y relato de actividades; cobertura de Zúrich, Maienfeld, Lucerna, Titlis, Jungfrau, Brienz, Oeschinensee y Zermatt.
- Actividades sujetas a clima, senderos y operación diferenciadas de visitas seguras; no se introdujeron Glacier/Bernina ni nuevas pernoctas.
- Gastronomía contrastada con portales turísticos de Zúrich, Lucerna, Grisones y Valais; las especialidades son sugerencias, no comidas reservadas. Los platos con lácteos requieren precaución individual.
- 12/12 registros completos y sin URLs incrustadas; enlaces de investigación conservados en `sources`.
- Pendiente prueba de renderizado Desktop/Mobile y CI, además de la auditoría B de consistencia tras alojamientos y transportes.

## Auditoría cruzada de Temporadas, Mapa y Experiencias · 2026-11-16
**Hallazgos corregidos:** (1) Se eliminó de la tarjeta de junio la referencia al Brienzer Rothorn, que no está en el programa. (2) El mapa dejó de tratar el punto físico del aeropuerto de Ginebra como lugar para dormir: representa Ginebra como ciudad, a falta de hotel definido. (3) Se incorporó el Luzern–Interlaken Express a las experiencias porque es un tramo escénico ya incluido en la ruta. (4) Se añadió acceso real a Heididorf: subida de 40 min/2,4 km y Heidi Bus normalmente solo fines de semana y festivos; logística del martes 15 pendiente de validar. (5) Se aclararon duración y posibles cierres de Bachalpsee y que el paso por Wengen después de Jungfraujoch no es seguro.
**Comprobaciones:** 12 tarjetas mensuales con estado y temperatura; 23 coordenadas numéricas, sin nombres repetidos y cinco puntos vinculados a 14 noches; 12 experiencias con textos y sin URLs; días y calendario coherentes. Fuente oficial de acceso Heidi y fichas turísticas consultadas.
**Pendientes externos:** calendario definitivo 2027, estado de senderos en junio, conexiones puerta a puerta y hotel concreto en Ginebra. No ejecutadas pruebas Node ni renderizado Desktop/Mobile en esta auditoría; quedan para B/D. No constituye visto bueno para merge.

## Verificación de Reservaciones importantes · 2026-11-16
- Se reemplazó la lista antigua de ocho notas por el contrato editorial: `reservations` en tres grupos y `planningDetails` como objeto con título y nota pública.
- 12 fichas: 3 de prioridad muy alta, 5 alta y 4 flexibles. Todas declaran expresamente ausencia de compra o reserva e incluyen enlaces oficiales.
- Jungfraujoch: confirmada obligación de reserva de asiento de 1 mayo a 31 octubre 2027 además de billete; pasar torniquetes al menos 10 minutos antes. Titlis: Rotair, Cliff Walk y cueva glaciar incluidos en billete peatonal; Ice Flyer separado. Oeschinensee: cambios sujetos a condiciones, cancelación ordinaria no disponible.
- Vuelos Lufthansa/SWISS $23,300.14 MXN permanecen cotización de noviembre 2026, no comprados. Las tarifas de montaña 2027 siguen pendientes; no se reutilizaron como cotización los precios actuales.
- Pendientes: comprobar apertura de calendarios 2027, condiciones particulares, selección hotelera y trenes/pases. No se ha ejecutado CI ni inspección visual Desktop/Mobile en esta etapa.

## Verificación de Movilidad y conexiones · 2026-11-16
- 14 fichas de transporte: vuelos multidestino con conexión real en Frankfurt y precio global $23,300.14 MXN; 13 agrupaciones de traslados de aeropuerto, interurbanos, regionales y montaña, con tarifas en CHF pendientes por falta de cotizaciones para junio de 2027.
- Vuelos con segmentos MEX–FRA–ZRH y GVA–FRA–MEX; horas intermedias FRA no inventadas; 16 referencias a IDs de transporte vinculadas a días. Jungfraujoch desglosado en Eiger Express + Jungfraubahn, ida/vuelta.
- Luzern–Interlaken Express: billete ordinario válido, reserva de asiento opcional. Jungfraujoch: reserva obligatoria de asiento, independiente del billete de montaña.
- Pases por comparar con desglose financiero posterior: Swiss Half Fare Card, Swiss Travel Pass 15 días y billetes normales/Supersaver/Saver Day Pass; ningún descuento representa viajes gratis universales.
- **Importante:** SBB/operadores no tienen tarifas completas verificadas para cada trayecto/fecha. Los 13 traslados CHF mantienen `price.amount: null`, sin inventar presupuesto. Ferry Brienz y teleféricos dependen de horarios y posibles rutas alternativas.
- Verificación estática de IDs únicos, opciones/selectedFare, segmentos contiguos, tarifas no vacías y referencias; **no se ejecutó el `AtlasTransportModel.validateTrip` real ni el render `AtlasMajorTransport.render` ni Node/browser**. Los hallazgos deberán cerrar en auditoría B/D antes de afirmar sección auditada y merge.
- Se mantuvieron exclusivamente cambios en el JSON Suiza Verde y la bitácora.

## Verificación de Dónde dormirás · 2026-11-16
- Cinco hoteles candidatos (sin reservas): Hotel Marta Zürich (13–15), Hotel Waldstätterhof Luzern (15–17), Hotel Tschuggen Grindelwald (17–23), Hotel Alphubel Zermatt (23–26), ibis Genève Aéroport (26–27).
- Suman 14 noches, cinco alojamientos. Cada uno presenta dirección real, Google Maps y web oficial; alternativas conservadas en `hotelsComparison`, sin fichas duplicadas antiguas.
- Se verificó riesgo de baño compartido: categoría Single balcony Eiger view del Tschuggen es baño privado, mientras otra single tiene baño compartido; Hotel Alpha Luzern (alternativa) también ofrece ambos tipos, verificar la categoría exacta. En Zermatt, el check-in del Alphubel se hace en Hotel Simi.
- ibis Genève Aéroport: Accor indica caminata de 10 minutos y shuttle de 05:00 a 11:00, compatible en principio con vuelo GVA 09:10, sujeto a verificación al reservar.
- **No hay cotización reproducible de junio 2027 para una persona, 14 noches, impuestos y cancelación.** No se inventaron totales ni se registraron gastos ficticios. Antes de marcar auditoría financiera B como cerrada, obtener tarifas o supuestos explícitos en Presupuesto.
- Validación estructural de fechas, ID, links y suma de noches; pruebas reales Node/CI y visual Desktop/Mobile pendientes.

## Corrección de cabecera y Panorama · 2026-11-16
- Corregido contrato `practicalIndicators`: ahora tres registros con `id`, `title`, `text`, `badge` y `tone`, en orden style/language/entry; antes `type`/`description` generaban `undefined` en pantalla.
- Cabecera: `work` = 10 días de lunes a viernes dentro de 12–27 junio 2027, estimación de jornadas laborales sin considerar calendario personal de vacaciones; alojamientos: `14 noches, 5 alojamientos`.
- Clima y luz normalizados a tres párrafos con temperaturas orientativas de valle, ropa y horas de luz; ajustes de documentación y electricidad tipo J 230 V/50 Hz con fuentes oficiales.
- Validación de contrato del JSON completa; **no se ha ejecutado aún prueba real Desktop/Mobile ni CI**, y sigue pendiente la auditoría del Panorama al terminar etapas 09–11.

## Corrección preventiva de Panorama y Clima y luz · 2026-11-16
- Causa: contrato editorial ya exigía `practicalIndicators[id,title,text,badge,tone]`; la primera captura usó `type/description`, y se declaró terminada sin renderizar ni ejecutar regresión.
- Clima corregido con referencias regionales **mínimas nocturnas vs máximas diurnas**: Zúrich/Lucerna 11 a 13 °C noche y 20 a 24 °C día; Grindelwald/Zermatt 6 a 10 °C noche y 16 a 20 °C día. Cumbres pueden tener heladas. Condiciones son referencias históricas orientativas, no pronóstico 2027.
- Luz 13–26 junio Zúrich: salida de sol aproximadamente 05:28–05:30 y puesta 21:22–21:26 (CEST, UTC+2), casi 16 horas. Ropa por capas, impermeable y calzado apto para senderos, sin exceder equipaje de mano.
- Nueva prueba `tests/loader-regression.test.cjs`: Suiza Verde se agrega a pruebas de indicadores/temporadas, valida campos completos, ausencia de `type/description`, luz, clima en tres párrafos y cabecera. También se actualizó una expectativa obsoleta de `status: draft`, que ya no es el estado público del viaje.
- Checklist reforzado para exigir pruebas desde la primera redacción de cabecera, indicadores y clima, y no solo en auditoría C/D.
- Validación de estructura mediante lectura del JSON y pruebas escritas; **la ejecución completa de Node y navegador sigue sujeta a CI / checkout local**. No afirmar finalizada la auditoría visual sin evidencia de ejecución.

## Verificación de Día por día · 2026-11-16
- 16 jornadas del 12 al 27 junio 2027: mañana, tarde, noche y lugares principales en encabezados. Días 2–15 asignados a uno de cinco hoteles candidatos, 14 noches sumadas, sin inventar reservas. Día 1 en vuelo y día 16 llegada a México.
- 16 referencias de fichas de movilidad conservadas, con enlaces oficiales en días clave y consejos siguiendo `• *Título:* ...` para pasos y tips.
- Prioridades y alternativas documentadas: 15 junio Heididorf con equipaje/Heidi Bus de martes; 18 junio Trümmelbach/Mürren con recorte de Gimmelwald; 19 junio First/Bachalpsee condicionado; 20 junio barco Giessbach dependiente de BLS 2027; 21 junio Jungfraujoch con reserva de asiento y Wengen únicamente con itinerario ferroviario compatible; 22 junio Oeschinensee sujeto a estado de senderos; 24/25 junio flexibilidad Gornergrat/Sunnegga; 26 junio traslado temprano a GVA para vuelo 27.
- No se crearon fotografías ni textos de galería sin imagen comprobada: `places: []` y `placeDescriptions: {}`. La selección fotográfica corresponde a etapa 12.
- `spend` permanece `null` cada día hasta estimar actividades, pases, alimentación y transporte sin doble conteo. No se ha cerrado presupuesto integral.
- Validación estática de secuencia, 14 referencias de hotel, 16 referencias de transporte y textos por periodo; **sin ejecución de test Node ni revisión real DOM Desktop/Mobile**.

## Auditoría adicional del Día por día · 2026-11-16
- **Defecto de interfaz corregido:** `components/day-transport.js` ocultaba itinerarios de tren y excursiones sin horas publicadas: filtraba los `journeys` únicamente si tenían `departure` del día. Ahora muestra todos los tramos sin horario cuando la ficha corresponde a esa jornada; para vuelos muestra también el día de llegada (+1) sin incluir el regreso.
- **15 junio · Heididorf:** revisar consigna con trazado real del tren. Dejar maleta en Zürich HB exige volver a recogerla antes de ir a Lucerna; no recomendar Maienfeld/Sargans como consigna confirmada sin verificar. Mantener decisión logística pendiente antes de reservas.
- **18 junio · Mürren:** corregido mecanismo a teleférico Lauterbrunnen–Grütschalp y tren Grütschalp–Mürren; alternativa por Stechelberg condicionada.
- **20 junio · Brienz:** aclarado barco Giessbach See, funicular y regreso, con horarios 2027 aún pendientes; la posibilidad de volver por Brienz es una alternativa y no un trayecto reservado.
- **21 junio · Jungfraujoch:** añadida opción B real de regreso por Kleine Scheidegg, Wengen, Lauterbrunnen y Zweilütschinen, además de opción A por Eigergletscher. La alternativa requiere billete de ruta adecuado, no usar automáticamente tarifa de vuelta directa. Reserva obligatoria mayo–octubre 2027, según operador oficial.
- **24 junio · Gornergrat:** Riffelsee a diez minutos caminando desde Rotenboden; recorrido opcional de aprox. 3.1 km/una hora hasta Riffelberg, solo si abierto y sin nieve residual, según operador.
- **27 junio · Ginebra:** indicado objetivo orientativo de aeropuerto a las 06:10 para vuelo cotizado de las 09:10; shuttle y documentación pendientes de confirmar.
- Añadida regresión de 16 fechas, 14 noches, IDs y render de transporte sin horarios, opción B Wengen y vuelo día +1 en `tests/loader-regression.test.cjs`.
- **Pendientes:** validación de horarios concretos 2027 y equipaje en Maienfeld; tarifas, imágenes y gastos diarios; Node/browser CI antes de merge.

## Verificación de Panorama · 2026-11-16
- `intro` reescrito como narrativa turística de **96 palabras**, sin precios, vuelos, compras ni estado administrativo. `introShort`: **35 palabras**, ambos en orden real: Zúrich/Maienfeld, Lucerna/Titlis, Grindelwald y Oberland, Zermatt y salida por Ginebra. `introHighlights`: 19 términos comprobados como fragmentos literales del texto.
- Corregido `profile.paceWhy`: cinco alojamientos (no cuatro), 14 noches y seis seguidas en Grindelwald. Se conservan planes variables por visibilidad; ninguna excursión opcional se muestra como garantizada.
- Los tres `practicalIndicators` se ajustan a `[style,language,entry]`, con badges y textos completos. Entrada para pasaporte mexicano: exención de visa corta estancia Schengen, pasaporte con tres meses posteriores al regreso y expedido en los diez años anteriores, frontera Schengen en Frankfurt/EES, ETIAS todavía inactivo según fuentes oficiales a 16 noviembre 2026; verificar cambios próximos a junio 2027. Electricidad: enchufe J, 230 V/50 Hz, adaptador México A/B a J con tierra cuando aplique.
- `climate` conserva tres párrafos con diferencias de altitud, lluvia/nieve residual, ropa para equipaje de mano y horarios locales de amanecer/puesta de sol en junio (CEST). La tarjeta se presenta independiente de los indicadores.
- Panorama económico: **solo el vuelo ida+regreso $23,300.14 MXN cotizado**, sin hoteles, trenes ni actividades calculados. Se añadió etiqueta reactiva de «Vuelo cotizado · subtotal parcial» en `components/trip.js` cuando únicamente hay una cotización aérea, para evitar confundirla con inversión total; volverá a «Tu inversión aproximada» al integrar presupuesto terrestre.
- Agregada prueba de regresión para tamaño de narrativa, highlights, los cinco alojamientos, requisitos prácticos, clima y subtotales. Validación estática del JSON/refs completada. **No se ha ejecutado todavía Node/CI ni inspección DOM en Desktop/Mobile**; auditoría C/D y aprobación de merge siguen abiertas.
- Fuentes revisadas: Secretaría de Estado de Migración suiza, Unión Europea (ETIAS, EES y documentos), Switzerland Tourism y meteorología previamente documentada.

## Verificación de Presupuesto integral · 2026-11-16
- Una persona, 16 días, 14 noches, cinco alojamientos. Solo el vuelo Lufthansa/SWISS $23,300.14 MXN es cotización real no comprada.
- Tipo de cambio de referencia: CHF 1 = MXN 22.12 del 16 noviembre 2026, no tasa de compra.
- Hospedaje provisional CHF 2,520: Zúrich CHF 370, Lucerna CHF 500, Grindelwald CHF 930, Zermatt CHF 555 y Ginebra CHF 165; sin reservas ni precios comprobados en junio 2027.
- Transporte público CHF 650: hipótesis Half Fare CHF 150 y hasta CHF 500 de billetes. Swiss Travel Pass 15 días CHF 499 más suplementos es alternativa, no se suma. Requiere cotización tramo por tramo.
- Remontes y entradas CHF 410 desglosados en nueve actividades fechadas (Lindt 17, Heidi 15, Titlis 58, Trümmelbach 18, First 42, Giessbach 18, Jungfraujoch 133, Oeschinensee 27 y Gornergrat 82); provisiones no cotizadas, potencialmente insuficientes sin descuentos. Sunnegga opcional excluido.
- Alimentación CHF 855 repartidos en 16 días; seguro CHF 120, tasas hoteleras CHF 70, incidentales CHF 110, contingencia CHF 460.
- Subtotal terrestre CHF 5,195 = MXN 114,913.40. Total central con único vuelo = MXN 138,213.54. Rango global estimado MXN 118,000–157,000, no garantía.
- Cada transporte terrestre se asocia a una partida de referencia mediante budgetIncludedIn; el vuelo no se duplica en expenses. Pase/trenes de CHF 650 son globales y no se cargan íntegros a un día; actividades, alimentación y alojamiento sí se distribuyen por jornada, sin doble suma.
- Prueba de regresión financiera añadida a tests/loader-regression.test.cjs; ejecución Node/Chromium pendiente, sin aprobación para merge.

## Pendientes prioritarios
1. Cotizar las cinco estancias de junio 2027 y comparar tres opciones de pase/tickets con todas las rutas y suplementos.
2. Confirmar calendario de apertura de Heididorf (15 junio), teleféricos, senderos, Jungfraujoch y barco Brienz.
3. Validar noche de Ginebra y aeropuerto de salida; presupuesto integral sin duplicidades.
4. Incorporar fotografías y portada; ejecutar pruebas de contrato de transporte, sumas, DOM/responsive y QA antes de PR/merge.

**Candidatos por ciudad:** Zúrich Marta/Bristol/Fred; Lucerna Alpha/Waldstätterhof/Central; Grindelwald Tschuggen/Bernerhof/Alpenblick; Zermatt Alphubel/Sarazena/Metropol; Ginebra ibis Genève Aéroport/Nash/ibis budget. Ninguno reservado ni cotizado en todas las fechas. Grindelwald es la prioridad económica por sus seis noches.

**Control de calidad parcial:** JSON con 16 fechas consecutivas y 14 noches, sin importes inventados. No se ejecutó CI ni revisión visual en este cambio; no habilita merge.
