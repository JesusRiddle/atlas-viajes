# Registro de avance · Suiza Verde 2027 — Alpes de postal

**Viaje:** Suiza Verde 2027 — Alpes de postal  
**JSON:** `data/trips/suiza-verde-2027.json`  
**Rama:** `feature/suiza-verde-2027`  
**Actualizado:** 2026-11-16  
**Etapa:** Auditoría cruzada de 02/04/05 concluida a nivel de datos; siguiente sección: 06 Reservaciones importantes. Auditorías B/D de navegador y CI pendientes.

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
- [ ] 06 · Reservaciones importantes: condiciones y prioridades
- [ ] 07 · Transporte mayor: modelo `AtlasTransportModel.validateTrip` y render sin ejecutar
- [ ] 08 · Alojamiento: zonas y hoteles candidatos investigados; tarifas exactas de 14 noches pendientes
- [ ] 09 · Día por día: traslados puerta a puerta y gastos pendientes
- [ ] 10 · Panorama: validar indicadores y clima en Desktop/Mobile
- [ ] 11 · Presupuesto integral: solo vuelos cotizados, resto pendiente
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

## Pendientes prioritarios
1. Comparar tarifas y disponibilidad del 13–27 de junio de 2027, 1 adulto en habitación privada (idealmente baño privado), impuestos, desayuno y cancelación; después cotizar trenes y pases.
2. Confirmar calendario de apertura de Heididorf (15 junio), teleféricos, senderos, Jungfraujoch y barco Brienz.
3. Validar noche de Ginebra y aeropuerto de salida; presupuesto integral sin duplicidades.
4. Crear mapa, transportes conformes al contrato, fotografías y QA visual.

**Candidatos por ciudad:** Zúrich Marta/Bristol/Fred; Lucerna Alpha/Waldstätterhof/Central; Grindelwald Tschuggen/Bernerhof/Alpenblick; Zermatt Alphubel/Sarazena/Metropol; Ginebra ibis Genève Aéroport/Nash/ibis budget. Ninguno reservado ni cotizado en todas las fechas. Grindelwald es la prioridad económica por sus seis noches.

**Control de calidad parcial:** JSON con 16 fechas consecutivas y 14 noches, sin importes inventados. No se ejecutó CI ni revisión visual en este cambio; no habilita merge.
