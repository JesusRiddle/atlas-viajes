# Registro de avance · Colombia 2027

**Viaje:** Colombia 2027 · Medellín y Caribe  
**JSON:** `data/trips/colombia-2027.json`  
**Rama:** `feat/colombia-2027`  
**Modalidad:** planeación detallada, tarifas aún provisionales  
**Actualización:** 2026-11-04  
**Etapa actual:** 12 · Fotografías y portada (tras auditoría correctiva de etapas 00–11)  
**Siguiente acción autónoma:** verificar CI al SHA actual; mantener en evaluación la variante Medellín 3 noches mientras se conservan las fechas de los vuelos candidatos. Luego iniciar fotografías externas por destino, portada/carrusel y auditoría D; no hacer merge.  
**Decisiones que requieren al usuario:** ninguna por ahora. No hay compras autorizadas.

## Etapas 00–13

- [x] **00 Preparación:** leídos AGENTS.md, README, contrato, estándar, checklist y guía; rama separada, JSON y registro visible en Inicio.
- [x] **01 Alcance:** 1 persona, 14–26 enero 2027, cuatro alojamientos y ruta definida.
- [x] **02 Temporadas:** doce meses completados con bandas térmicas regionales `X a Y °C`, variación de lluvias y cierres de Tayrona; fuentes climáticas indicadas. Requiere auditoría final de comparabilidad de series.
- [x] **03 Calendario y esqueleto:** 13 días consecutivos, 12 noches, 4 alojamientos y 9 días laborables de calendario; vuelos no comprados. Accesos y horarios futuros permanecen pendientes externos, no bloquean la arquitectura.
- [x] **04 Mapa:** 7 referencias generales de localidades/sectores en orden, sin fingir coordenadas de hoteles; geometría visual incluida en la prueba de navegador. Verificar localización exacta de punto El Zaino al contratar transporte.
- [x] **05 Experiencias:** siete fichas de zonas revisadas, con gastronomía regional y excursiones opcionales. Taganga medio día, sin Quinta ni Museo del Oro. Operadores quedan por contratar.
- [x] **06 Reservaciones importantes:** prioridades y contingencias incluidas; fuentes oficiales para Tayrona y vuelos, Marsol y ecolodge. Ninguna reserva comprada.
- [x] **07 Movilidad y conexiones:** Copa, Avianca y Marsol/privado con segmentos, tarifas seleccionables, presupuesto sin duplicar, mapas de embarque y zonas horarias explícitas. `AtlasTransportModel.validateTrip` sin errores mediante prueba específica. Horarios futuros y precio efectivo pendientes externos.
- [x] **08 Dónde dormirás:** cuatro hoteles candidatos con fechas y mapas, sin duplicación de `stays`; fuentes oficiales identificadas de Landmark, Senda Koguiwa y Casa La Fe. No se confirmó sitio propio de Casa de Isabella; se conserva Maps sin inventar enlace oficial. Tarifas y políticas por cotizar.
- [x] **09 Día por día:** 13 jornadas con mañana/tarde/noche, hotel asociado a cada una de las 12 noches, traslados, alertas antirrobo y sanitarias, enlaces principales en días relevantes. Gastos diarios quedan nulos mientras el desglose general es provisional; ampliar enlaces y fotografías en etapa 12.
- [x] **10 Panorama:** intro/introShort, tres indicadores exactos y clima independiente de tres párrafos, con fuentes históricas oficiales, formato térmico `X a Y °C`, referencia cambiaria fechada y geometría DOM comprobada en CI.
- [x] **11 Presupuesto:** total orientativo central **$49,662 MXN**, rango **$42,000–63,000 MXN** para 1 persona. Referencia COP/MXN 03/11/2026 documentada (0.00578764); las 10 partidas suman $49,662 sin duplicar vuelos y Marsol está cubierto por provisión global. El mismo escenario se usa en Inicio y Panorama. No es cotización ni reserva.
- [ ] **12 Fotos/portada:** portada de Cartagena desde Wikimedia con autor y licencia registrada; faltan fotos para galerías y días clave, respetando enlaces externos.
- [ ] **13 Auditoría D y PR:** PR de trabajo sin merge; completar prueba automática y Desktop/Mobile antes de aprobación.

## Auditorías

| Control | Estado | Pendiente |
| --- | --- | --- |
| A (etapas 01–03) | Verificado para planeación | 12 meses con fuentes, ruta/días/noches y cierres programados |
| B (etapas 04–08) | Verificado para planeación | mapa, transportes y hoteles; operaciones y tarifas finales son pendientes externos |
| C (etapas 09–11) | Verificado para planeación | 13 días, 3 indicadores, 3 párrafos de clima y presupuesto reconciliado |
| D (etapas 12–13) | Pendiente | fotografías para experiencias y días, verificación de licencia/enlaces y revisión final del PR |

## Reglas y decisiones de este viaje

- Prioridad en comodidad, baño privado, cuatro alojamientos, conexiones de día donde convenga y no pagar sobreprecios por ahorros marginales.
- Copa multidestino y Avianca AV 9446 son candidatos, no reservas. No reabrir búsqueda de vuelos sin necesidad de validación de compra.
- El 20 de enero se visita Taganga/Playa Grande medio día; se excluyeron Quinta de San Pedro Alejandrino y Museo del Oro por preferencias del viajero.
- **Seguridad Taganga:** evitar sendero peatonal a Playa Grande por reportes de robos. Lancha autorizada con chaleco salvavidas, precio acordado y retorno diurno; verificar oleaje.
- **Seguridad Tayrona:** verificar estado operativo 2027, entradas, senderos y corrientes. Ecolodge con cancelación flexible.
- No asumir precios de hotel como cotizaciones; no registrar un subtotal como presupuesto integral. No comprar ni hacer merge sin autorización.
- No modificar viajes históricos ni reglas maestras por exigencias exclusivas de este viaje.

## Evidencia de este turno

Se comprobó la estructura y se creó el viaje primero en `modules.js`. GitHub Actions confirmó sintaxis, JSON y pruebas Node aprobadas en una ejecución; la primera ejecución de navegador encontró expectativas antiguas de cinco tarjetas, adaptadas después. El workflow `Atlas checks` de commit `2a22583875cbee2c9377dc456ef447531efc8d68` terminó SUCCESS: sintaxis JS, validación de JSON, Node y smoke tests Desktop/Mobile aprobados. Esto no sustituye la auditoría editorial completa ni la revisión humana. No marcar puertas A–D verificadas hasta auditoría completa.

**Reanudación concreta:** PR #10 (rama `feat/colombia-2027`), último workflow verde `https://github.com/JesusRiddle/atlas-viajes/actions/runs/41931782085`. Siguiente: completar imágenes externas legales y `days[].places`, ampliar movilidad terrestre con opciones estructuradas, verificar tasas COP/MXN con snapshot fechado, comprobar enlaces/hoteles y cerrar auditorías A/B/C/D. La comparativa de Inicio ahora contempla viajes nuevos con `budgetRange` aunque `budgetPreliminary` sea booleano. Sin merge.

## Auditoría correctiva exhaustiva · 4 de noviembre de 2026

**Hallazgos corregidos:** (1) doce temperaturas demasiado uniformes sin definición de métrica → máximas diurnas mensuales Medellín/Santa Marta con fuentes OMM, no mínimas; (2) cambio COP/MXN faltante → snapshot del 3/11/2026; (3) suma antigua $49,647 → $49,662 y `budgetPreliminary` estructurado, con fuente y reconciliación; (4) `work: null` y `profile.weather: null` impedían usar vista maestra → 9 días laborables y clima declarado; (5) cuatro alojamientos duplicados en `stays` → dejar solo `hotels`; (6) horarios de vuelo sin zonas horarias → offsets explícitos; (7) traslado El Zaino→Cartagena sin modelar → Marsol y vehículo privado como alternativas, precios por fecha pendientes; (8) recomendaciones sanitarias de fiebre amarilla y seguridad de Taganga reforzadas; (9) eliminada modificación global innecesaria en `components/home.js`, restituido desde main; (10) agregada prueba propia `tests/colombia-2027.test.cjs` para asegurar calendario, alojamiento, fuentes, transportes y presupuesto.

**Evidencia automatizada:** `Atlas checks` completó con éxito en `https://github.com/JesusRiddle/atlas-viajes/actions/runs/41933143935` (commit `40582c0a914cd477d936d1aa8212e045053a55e8`): sintaxis JS, JSON, pruebas Node (incluida Colombia), navegador Desktop/Mobile. Correcciones anteriores con fallos ya sustituidas por esta ejecución verde. La revisión humana de fotografías no está cerrada.

**Pendientes externos no bloqueantes:** precio pagable de vuelos/hoteles; elección efectiva de tour, lancha, coche privado y conductor; apertura extraordinaria de Tayrona, posible vacuna recomendada según autoridad sanitaria y consulta médica; condiciones de mar; equipaje; disponibilidad hotel individual; confirmar link oficial de Casa de Isabella antes de agregarlo.

**Pendientes de la siguiente etapa:** imágenes de Comuna 13, Guatapé, Minca, Taganga, Tayrona y Cartagena con fuentes/licencias confiables enlazadas, `days[].places` y cobertura real del carrusel; auditoría D y aprobación explícita antes de merge.

**Decisión:** luz verde **solo para iniciar etapa 12**, sin reservas ni merge; repetir auditoría C/B si cambian gastos, noches o transportes.


## Revisión adicional · variante Medellín 3 noches (4 de noviembre de 2026)

**Estado de decisión:** bajo evaluación, NO aprobada. El JSON vigente permanece con Medellín 4 noches, Santa Marta 3, Tayrona 2 y Cartagena 3 porque el vuelo directo Avianca AV 9446 MDE→SMR del lunes 18 ya tiene una referencia concreta. El deseo de recortar una noche no constituye autorización para cambiarlo por otro vuelo ni borrar el itinerario. No modificar fechas/horarios/partidas hasta comparar una opción viable de domingo 17 con equipaje, llegada segura y precio final.

**Variante geográficamente óptima si conserva los 13 días:** Medellín **14–17 enero (3 noches)**, Santa Marta **17–20 (3)**, Tayrona **20–22 (2)** y Cartagena **22–26 (4)**. Se evita un quinto hotel y el tiempo liberado se dedica a Cartagena, no se vuelve a Santa Marta ni se acorta el total. Implica vuelo **MDE→SMR domingo 17**, aún SIN cotizar ni confirmar horarios/tarifa. Un buscador muestra como indicio un vuelo directo Wingo domingo 17 cerca de 20:03–21:22, pero **no** puede tratarse como opción confirmada de solo ida ni de buena logística (llegada nocturna y excursión a Minca al día siguiente); preferir salida de día/tarde y llegada con margen para traslado seguro. Valorar la diferencia real en vuelos y hoteles antes de elegir.

**Programación de Medellín con solo dos días completos:** jueves 14 llegada y cena tranquila; viernes 15 Comuna 13 guiada y Metrocable o centro/Plaza Botero, priorizando Comuna 13 y Metrocable sobre el interior del Museo de Antioquia; sábado 16 Guatapé + Piedra del Peñol; domingo 17 vuelo directo a Santa Marta. Si existiera un vuelo **tardío pero seguro**, el Metrocable podría trasladarse a la mañana del domingo sin hacer una carrera hacia el aeropuerto. Arví y Jardín Botánico dejan de ser actividades principales. Es un ritmo menos flexible ante lluvia o cansancio; si el vuelo solo sale de noche, no conviene sacrificar calidad y seguridad solo por quitar una noche de Medellín.

**Variante de menor alteración de logística:** mantener Avianca el lunes 18 y llegar a Medellín el viernes 15 en vez del jueves 14. Resultarían 12 días y 11 noches (3 Medellín + 3 Santa Marta + 2 Tayrona + 3 Cartagena), se debe **recotizar el vuelo internacional completo**, y se mantiene el mismo límite de dos días completos para Medellín. No asumir que el precio anterior de Copa aplica a la nueva fecha.

**Efecto económico:** sustituir una noche de Medellín por una de Cartagena **no garantiza ahorro**: el objetivo presupuestario actual es Medellín $4,800/4 noches y Cartagena $5,200/3; Cartagena tiene una provisión nocturna mayor. Se necesita tarifa real de vuelo del domingo y la diferencia de hoteles antes de comprometer el presupuesto de $49,662 MXN.

**Regla de implementación:** conservar la versión vigente como única verdad para usuario hasta seleccionar variante. Una vez elegida, actualizar atómicamente `bases`, `hotels[].checkIn/checkOut`, `days`, `majorTransport`, `expenses`, `reservations`, `budgetNote`, `intro`, `lodgingSummary`, `planningDetails`, bitácora y pruebas, sin dejar referencias desfasadas. No hacer merge antes.

### Segunda auditoría técnica y editorial

- [x] Recontados 13 días y 12 noches, cuatro hoteles y zona de alojamiento, sin duplicados.
- [x] Confirmados horarios oficiales generales de Marsol El Zaino→Cartagena, sitio de Parques Nacionales para cierres de Tayrona, climatología histórica de Medellín y Santa Marta y snapshot COP/MXN del 03/11/2026.
- [x] Web oficial de Casa de Isabella identificada en Kali Hotels: `https://kalihotels.com/en/casa-isabella/`; añadida al hotel y a «Reservaciones importantes».
- [x] Verificado que la página de Wikimedia Commons de la fotografía de portada existe y tiene licencia de dominio público; el hotlink final debe comprobarse durante etapa 12.
- [x] Restituida la prueba estricta de portada `trip.cover || trip.status === 'draft'`: el alta de Colombia no debe debilitar garantías del resto del catálogo.
- [x] Confirmado que el cambio de tres noches de Medellín debe permanecer como una alternativa no aprobada; no se modificaron los vuelos del día 18 ni las noches actuales.
- [ ] Comprobar CI verde para el SHA final de esta auditoría; no utilizar el verde de un commit anterior como evidencia del estado actual.
- [ ] Foto galería y carrusel, 2–3 imágenes de lugares para días turísticos; etapa 12.
- [ ] Tarifa confirmada para vuelo directo MDE–SMR domingo 17 de enero, solo si el usuario elige la variante.

**Decisión editorial:** no hay problema de estructura que impida comenzar la etapa fotográfica. La reducción de Medellín no debe aplicarse hasta comparar vuelo real y aceptar perder flexibilidad. Mantener PR #10 como borrador y no hacer merge.
