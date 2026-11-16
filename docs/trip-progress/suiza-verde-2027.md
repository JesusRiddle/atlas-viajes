# Registro de avance · Suiza Verde 2027 — Alpes de postal

**Viaje:** Suiza Verde 2027 — Alpes de postal  
**JSON:** `data/trips/suiza-verde-2027.json`  
**Rama:** `feature/suiza-verde-2027`  
**Actualizado:** 2026-11-16  
**Etapa:** 03 · Junio y esqueleto diario actualizados; auditoría A pendiente de cerrar.

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
- [ ] 02 · Temporadas: junio y septiembre considerados; auditoría de 12 meses y servicios específicos incompleta
- [x] 03 · Ruta y 16 jornadas tentativas actualizadas; auditoría A abierta
- [ ] 04 · Mapa y coordenadas verificadas
- [ ] 05 · Experiencias: detalle operativo, enlaces y alternativas por clima
- [ ] 06 · Reservaciones importantes: condiciones y prioridades
- [ ] 07 · Transporte mayor: modelo `AtlasTransportModel.validateTrip` y render sin ejecutar
- [ ] 08 · Alojamiento: zonas, hoteles y tarifas
- [ ] 09 · Día por día: traslados puerta a puerta y gastos pendientes
- [ ] 10 · Panorama: validar indicadores y clima en Desktop/Mobile
- [ ] 11 · Presupuesto integral: solo vuelos cotizados, resto pendiente
- [ ] 12 · Fotografías y portada
- [ ] 13 · Auditoría global, tests/CI y PR final

## Pendientes prioritarios
1. Cotizar alojamiento y trenes para las 14 noches; cotejar trayectos reales y pases frente a billetes.
2. Confirmar calendario de apertura de Heididorf (15 junio), teleféricos, senderos, Jungfraujoch y barco Brienz.
3. Validar noche de Ginebra y aeropuerto de salida; presupuesto integral sin duplicidades.
4. Crear mapa, transportes conformes al contrato, fotografías y QA visual.

**Control de calidad parcial:** JSON con 16 fechas consecutivas y 14 noches, sin importes inventados. No se ejecutó CI ni revisión visual en este cambio; no habilita merge.
