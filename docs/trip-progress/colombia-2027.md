# Registro de avance · Colombia 2027

> **Actualización vigente · 06/11/2026 — Medellín:** Se sustituyó el candidato Landmark por **Moabi Hotel** (Carrera 43B #12-147, Manila) para **15–18 enero 2027, 3 noches, 1 adulto**. Habitación Doble Estándar, cama Queen, 16 m², aire acondicionado, baño propio e insonorización anunciada. Cotización Booking en captura del viajero del 06/11: **$4,768 MXN** por las tres noches, tarifa con cancelación gratuita hasta 12/01/2027 y pago antes de llegar, **sin reservar**; desayuno adicional (MXN 231 anunciado; confirmar unidad), precio real en COP con posible IVA. Hotel vinculado a días 1–3, mapa y fuentes en JSON. Nuevo escenario central orientativo **$56,250 MXN** y rango **$50,168–67,168 MXN**, sustituyendo la provisión de $7,000 de Landmark por $4,768 de Moabi (ahorro $2,232 frente al presupuesto estimado anterior). Se mantiene sin modificación la alternativa pendiente de Cabo San Juan/Barranquilla. **Aún no autoriza merge.** Nota de QA: la versión anterior del JSON ya carecía de familias de datos (p. ej. expenses/mapPoints) que requieren reparación en auditoría de integración; no declarar CI verde sin comprobarlo. Las cifras históricas más abajo son bitácora y no sustituyen este estado vigente.


## Plan fotográfico por bloques · etapa 12 (noviembre de 2026)

**Ejecución por zonas con revisión al final de cada bloque y confirmación del viajero antes de continuar.** Solamente URLs de fotos de Wikimedia Commons, sin descargar archivos ni alterar itinerario, vuelos o presupuesto.

1. **Bloque 1 — Medellín y Guatapé, días 15–17 enero:** Plaza Botero, Provenza, Piedra del Peñol, calle de zócalos, mural de Comuna 13, escaleras de Comuna 13 y Pueblito Paisa. **Hecho:** siete fotos únicas verificadas como fotografías visibles a color desde la página de Wikimedia/miniatura; autor y licencia consultados; 2/2/3 por día; descripciones 15–30 palabras. Se añadió test estructural. **Pendiente antes de declarar validación completa:** CI verde y comprobación de visualización en navegador. No iniciar bloque siguiente sin revisión.
2. **Bloque 2 — Santa Marta, Minca y Taganga, días 18–20:** **INTEGRADO:** seis fotografías independientes (2/2/2): Catedral de Santa Marta, Parque de los Novios; paisaje panorámico desde Minca y cascada de Marinka; bahía de Taganga y Playa Grande. Fuente Commons verificada en cada caso (imagen directa, autor, licencia y color); descripciones 15–30 palabras. Se evita presentar una finca genérica como si fuese Finca La Victoria: el café sigue en el itinerario textual pero la galería muestra paisajes auténticos de Minca. El mar de la fotografía de Playa Grande NO garantiza seguridad náutica para enero. Efectuar QA automatizado y navegador antes del cierre del bloque.
3. **Bloque 3 — Ecolodge y Tayrona, días 21–22:** **INTEGRADO:** cinco fotografías de Commons (2 para día 21, 3 para día 22). Día 21: dos imágenes de paisajes reales del parque próximo, rotuladas explícitamente como referencias regionales que **no representan el ecolodge ni una visita programada dentro del parque**. Día 22: sendero real de Tayrona y dos fotografías distintas de Cabo San Juan (la de amanecer es ilustrativa y NO promete estar allí a esa hora). Créditos y licencias 4×CC BY-SA 4.0, 1×CC BY-SA 3.0, pies de 15–30 palabras, enlaces directos a miniaturas Wikimedia comprobados visualmente en origen. **Pendiente:** cierre de pruebas automatizadas y navegador; no atribuir propiedades del hotel a fotos de tercero.
4. **Bloque 4 — Cartagena, días 23–25:** **INTEGRADO:** seis fotografías auténticas y coloridas de Commons, cada una con fuente, autor y licencia comprobados individualmente. Sábado 23 es solo traslado y check-in: sin galería añadida. Domingo 24 tiene cuatro fotografías (Torre del Reloj, barrio de San Diego, mural de Getsemaní, murallas). Lunes 25 tiene dos imágenes estrictamente **opcionales** (Castillo de San Felipe y Las Bóvedas, paseo próximo a San Diego), sin convertir esas visitas en obligaciones. Martes 26 es regreso: sin fotos añadidas. Se descartaron imágenes descontextualizadas (rótulos de calles como falso paisaje turístico), se registraron pies editoriales de 15–30 palabras y se añadieron pruebas de referencias, opcionalidad y días sin fotos. **Pruebas CI y navegador por confirmar**. Las fotos no se descargaron ni se subieron al repositorio.
5. **Bloque 5 — Portada y carrusel:** **INTEGRADO, validación final pendiente.** Portada principal sustituida: de una fotografía de Cartagena de 2008 a Cabo San Juan, Tayrona, fotografía de OpenAperture, CC BY-SA 3.0, fuente Commons y miniatura HTTPS inspeccionadas. Añadido `coverSlides` con cinco claves únicas y fotografías comprobadas visualmente: Cabo San Juan (Tayrona), mural de Comuna 13 (Medellín), calle de zócalos (Guatapé), cascada de Marinka (Minca), calle de San Diego (Cartagena). Cada foto mantiene crédito, URL y licencia en `data/places.json`. El carrusel de Inicio y la portada interior usan la misma selección editorial para Colombia y conservan la selección automática original en otros viajes; esto evita recorrer 24 fotos antes de mostrar otros destinos. Se retiró la antigua foto de portada de Cartagena del catálogo al quedar sin referencias (sin eliminarla del proveedor). No se modificaron galerías diarias, viajes antiguos ni archivos de imagen en el repo. **Pendiente:** CI verde y comprobaciones de navegador en escritorio/móvil; la estabilidad remota a largo plazo no puede garantizarse.
6. **Bloque 6 — Auditoría fotográfica final D:** **COMPLETADA; validaciones de CI aprobadas:** se consultaron individualmente las 24 páginas de archivo de Wikimedia Commons; existían y su autoría coincidía con el catálogo. Se cotejaron licencias por archivo y en particular el crédito obligatorio de Plaza Botero, corregido a «© Steffen Schmitz (Carschten) / Wikimedia Commons». Se confirmó visualmente la portada Cabo San Juan, fotos del carrusel y una selección de miniaturas; la de San Diego se cambió a la URL de miniatura accesible desde Commons. Son 24 imágenes únicas en 10 jornadas con galería y 2 días solo de traslado/vuelo sin imágenes; 2 fotos opcionales claramente marcadas. Pies turísticos de 15–30 palabras, todos con autor y licencia; no se guardaron bytes de fotografías. Inicio y portada del viaje rotan cinco destinos; la portada interior ahora salta imágenes externas caídas sin detener la rotación. Añadidas pruebas estructurales para 24 imágenes, 9 secciones, créditos, alt y carruseles en Desktop/Mobile. **Limitación:** no se ha comprobado con respuesta HTTP de imagen cada uno de los 24 URLs binarios desde CI; las páginas de Commons sí fueron comprobadas, y algunas miniaturas se abrieron. Los proveedores externos pueden dejar de servir imágenes en el futuro. PR en borrador; no hacer merge sin autorización.

**Control económico:** presupuesto principal $58,482 MXN con Copa A, exclusivamente equipaje de mano; fotografía no modifica esta cifra.

---



## Auditoría D · nueve secciones y fotografía (6 de noviembre de 2026)

| Sección | Control final realizado | Estado |
| --- | --- | --- |
| Panorama | Introducción turística, introShort, tres indicadores, tarjeta clima/luz y metadatos 12 días/11 noches | Conforme |
| Mapa | Siete puntos en secuencia; Tayrona marcado como pin regional, no coordenada del hotel | Conforme, referencia regional |
| Temporadas | Doce meses con temperaturas «X a Y °C»; enero considerado temporada alta de Tayrona | Conforme |
| Experiencias | Guatapé, Comuna 13, plazas, Pueblito Paisa y Provenza; café en Minca sin duplicar Antioquia | Conforme |
| Reservaciones importantes | Links de operadores de Guatapé/Minca, acceso Tayrona, tarifas e indicación explícita de no reservado | Conforme para planeación |
| Movilidad y conexiones | Copa A $9,023 CM149/397/365/188, B $9,719 respaldo; Avianca 18/01 y terrestre a Cartagena, sin contar vuelos dos veces | Conforme |
| Dónde dormirás | Cuatro alojamientos candidatos, 3/3/2/3 noches, fechas correctas y estimaciones sin fingir reserva | Conforme, precios no contratados |
| Día por día | Doce jornadas consecutivas, 24 imágenes únicas, galería en diez días, dos días de traslado/vuelo sin galería, opcionabilidad de Castillo/Bóvedas, 24 créditos/pies | Conforme |
| Presupuesto | Copa A único vuelo internacional presupuestado, sin equipaje documentado, 10 partidas que suman $58,482 MXN | Conforme como presupuesto de planeación |

**Correcciones detectadas en el cierre D:** código de carrusel interior con salto de imágenes externas fallidas; crédito requerido de Plaza Botero; enlace de imagen de San Diego homogeneizado con la miniatura HTTPS realmente consultada en Wikimedia; pruebas de la composición visual, créditos, accesibilidad básica y contador total de 24 imágenes. **Resultado verificado:** workflow GitHub Actions https://github.com/JesusRiddle/atlas-viajes/actions/runs/42241925444 finalizó SUCCESS, incluyendo regresiones Node, JSON y navegador Desktop/Mobile. La prueba no sustituye una verificación futura de disponibilidad de imágenes externas. Las fotos externas pueden fallar posteriormente, sin que una prueba pasada implique garantía permanente.

## Corrección transversal de planeación independiente · 6 noviembre 2026

**Decisión explícita del viajero:** los viajes de Atlas son escenarios independientes. No evaluar, reportar ni intentar resolver coincidencias de fechas con viajes ajenos al que está siendo planeado, salvo que el usuario lo pida expresamente. Se eliminó de esta bitácora una advertencia improcedente relativa a otro viaje. La regla se incorporó a AGENTS.md, trip-editorial-guide.md y trip-production-checklist.md. No se editó ningún otro itinerario.

**Vuelo principal A:** enlace Google Flights actualizado a regreso CM188, recibido del viajero, añadido a `majorTransport.options[A].links`. Tarifa de referencia $9,023 MXN, con equipaje de mano y sin documentado. Sin reserva, sin merge.

---


## ACTUALIZACIÓN POSTERIOR · 6 noviembre 2026 · COPA A Y EQUIPAJE DE MANO

**Esta actualización prevalece sobre importes, números de vuelo, horarios y condiciones antiguas citadas más abajo.**

- Nueva cotización principal A: **$9,023 MXN** multidestino, ida CM149 + CM397 el 15/01, regreso 26/01 por CM365 CTG 15:05→PTY 16:22; conexión de 2 h 55 min; CM188 PTY 19:17→MEX 22:05. Regreso 273 kg CO₂e. Sustituye A anterior $9,076 con CM866 y llegada 22:25.
- Copa B se conserva como **respaldo**, $9,719 con CM866 y llegada 22:25. No se suma al escenario A.
- El viajero confirma **solo equipaje de mano**, sin maleta documentada. Eliminada la partida de provisión por maleta en bodega ($1,600). Confirmar peso y dimensiones de la pieza de mano antes de pagar.
- **Presupuesto principal de planeación recalculado $58,482 MXN** (antes $60,135): ahorro $53 de vuelo y $1,600 de equipaje. Rango estimado $52,400–69,400; cuatro hoteles aún estimados, no reservados. Las diez partidas suman exactamente $58,482. Con B alternativo el total sería $59,178, solo como referencia, no como suma.
- Enlace de Google Flights de A actualizado con URL del viajero que identifica CM149 + CM397 / CM365 + CM188, conservando B de respaldo. Los enlaces no garantizan precio ni disponibilidad.
- Actualizados vuelos estructurados, gastos, reservas, introducción logística, notas de equipaje, día de regreso, presupuesto y pruebas. Sin compras ni merge. Fotografías siguen en etapa 12.

---

## AUDITORÍA DE LAS NUEVE SECCIONES · ESTADO VIGENTE 06/11/2026

**La información siguiente prevalece sobre estimaciones y decisiones antiguas registradas más abajo.** Copa **A** es única base de cálculo; Copa B permanece únicamente como respaldo y no se suma. Viaje **15–26 de enero de 2027, 12 días, 11 noches, 4 alojamientos**, 1 persona.

**Cifra integral final de PLANEACIÓN: $60,135 MXN (no tarifa final contratada)**, con rango de sensibilidad $54,000–71,000 MXN. Desglose: Copa A $9,076; Avianca $1,259; Landmark $7,000 (3n); Casa de Isabella $5,000 (3n); Senda Koguiwa $5,200 (2n); Casa La Fe $10,500 (3n); terrestre y lancha $6,000; alimentos $6,000; tours y entradas $5,000; seguro/contingencia $3,500; equipaje de pago previsto $1,600. La suma de estas once partidas es **exactamente $60,135 MXN**. Si no se usa documentada, presupuesto $58,535 MXN; Copa B, únicamente si es elegida, incrementaría $643. Ninguna habitación está cotizada para las fechas exactas, así que la cifra es un monto objetivo defendible, no precio de compra garantizado.

| Sección | Hallazgos y correcciones | Estado |
| --- | --- | --- |
| **1. Panorama** | Intro 91 palabras, resaltados consistentes, introShort sin logística ni número de noches, tres indicadores y clima/luz en tres párrafos; idioma y COP, cobertura de enchufes A/B sin adaptador y salud en preparación previa | Conforme para planeación |
| **2. Mapa** | Siete puntos en secuencia Medellín–Guatapé–Santa Marta–Minca–Taganga–Tayrona–Cartagena. Tayrona está representado por punto geográfico **genérico del parque**, no coordenada GPS del hotel ni del acceso; no se simula localización exacta | Conforme a escala regional; confirmar pin exacto en etapa D |
| **3. Temporadas** | Doce meses, formato «X a Y °C», enero favorable para Caribe pero Tayrona temporada alta con tarifa específica; estado y horarios solo orientativos futuros | Conforme, comprobar cierres extraordinarios 2027 |
| **4. Experiencias** | Comuna 13, Guatapé, Plaza Botero, Parque de Bolívar, Pueblito Paisa y Provenza permanecen; café en Minca, El Poblado solo como entorno del hotel. Gastronomía por región | Conforme |
| **5. Reservaciones importantes** | Prioridades correctas, se eliminaron enlaces obsoletos de tours cafeteros en Antioquia y se añadieron operador de Guatapé y finca La Victoria; entrada Tayrona + seguro específico y precios COP/MXN bien etiquetados | Conforme con reservas pendientes |
| **6. Movilidad y conexiones** | Copa A $9,076 y B $9,719 en trayectos y enlaces específicos, Avianca del 18, Marsol/privado al Caribe. Copa A base del presupuesto, B no simultánea. Terminales y transportistas no confirmados | Conforme para planeación |
| **7. Dónde dormirás** | Actualizadas 11 noches y provisiones HOTEL POR HOTEL según referencias públicas de otras fechas; ciudad/fecha/dirección, sitio oficial, Maps, estado sin reservar y condiciones de cancelación | Conforme, **tarifas 2027 no comprobadas** |
| **8. Día por día** | 12 fechas consecutivas, mañana/tarde/noche concisos, aeropuerto MDE llegada, equipaje previo a check-in, Comuna13/Pueblito, Guatapé con entrada extra, café en Minca, traslado seguro Taganga y Tayrona, salida a Cartagena y vuelta. Importes diarios `spend:null` para evitar repartir partidas ficticias | Conforme; fotografía pendiente etapa 12 |
| **9. Presupuesto** | Se corrigieron metas hoteleras subestimadas, se separaron vuelos de transporte terrestre en categorías visibles, tabla totaliza con una sola opción A, ahorro alterno por equipaje explicitado. Pruebas de escenario B sin duplicación | Conforme como cierre de planeación |

**Fuentes comparables, no reservables:** Landmark [Booking, otras fechas](https://www.booking.com/hotel/co/landmark.es-mx.html), Casa de Isabella [Booking, otras fechas](https://www.booking.com/hotel/co/casa-de-isabella.es-mx.html), Senda Koguiwa [tarifa temporada alta oficial](https://sendahotels.com/en/hotel/senda-koguiwa/bedrooms/standard-room/), Casa La Fe [Booking, otras fechas](https://www.booking.com/hotel/co/casa-la-fe.es-mx.html), [Parques Nacionales Tayrona](https://www.parquesnacionales.gov.co/nuestros-parques/pnn-tayrona/), [tour Guatapé](https://toursguatape.com/en/producto/full-day-guatape/) y [Finca La Victoria](https://www.fincalavictoria1892.com/). Capturas del viajero para Copa $9,076 (A) / $9,719 (B) y Avianca COP 217,580 siguen siendo las únicas referencias aéreas; **no se consultó ni garantizó inventario en vivo**.


---


**Viaje:** Colombia 2027 · Medellín y Caribe  
**JSON:** `data/trips/colombia-2027.json`  
**Rama:** `feat/colombia-2027`  
**Modalidad:** planeación detallada, tarifas aún provisionales  
**Actualización:** 2026-11-06  
**Etapa actual:** 11 · Auditoría integral de 9 secciones; etapa 12 fotografías pendiente  
**Siguiente acción autónoma:** inspeccionar ejecución CI final del presupuesto recalculado; después etapa 12 (fotografías de cada jornada, portada y carrusel) y auditoría D, sin merge.  
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
- [x] **09 Día por día:** 13 jornadas en formato editorial conciso del Atlas, con mañana/tarde/noche, hotel asociado a las 12 noches, traslados, alertas antirrobo y sanitarias y enlaces principales. Los gastos diarios siguen nulos para evitar inventar cotizaciones o duplicar partidas; fotografías pendientes en etapa 12.
- [x] **10 Panorama:** intro/introShort, tres indicadores exactos y clima independiente de tres párrafos, con fuentes históricas oficiales, formato térmico `X a Y °C`, referencia cambiaria fechada y geometría DOM comprobada en CI.
- [x] **11 Presupuesto:** total orientativo central **$50,662 MXN**, rango **$42,000–65,000 MXN** para 1 persona. Referencia COP/MXN 03/11/2026 documentada (0.00578764); las 10 partidas suman $49,662 sin duplicar vuelos y Marsol está cubierto por provisión global. El mismo escenario se usa en Inicio y Panorama. No es cotización ni reserva.
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

**Variante de 13 días con noche extra para descansar:** Medellín **14–17 enero (3 noches)**, Santa Marta **17–20 (3)**, Tayrona **20–23 (3)** y Cartagena **23–26 (3)**. Se considera solo si un ecolodge atractivo y bien equipado justifica un día entero de descanso; no sumar automáticamente noches a Cartagena. Se mantienen cuatro alojamientos y la noche adicional se utiliza exclusivamente en Tayrona, no en Cartagena. Implica vuelo **MDE→SMR domingo 17**, aún SIN cotizar ni confirmar horarios/tarifa. Un buscador muestra como indicio un vuelo directo Wingo domingo 17 cerca de 20:03–21:22, pero **no** puede tratarse como opción confirmada de solo ida ni de buena logística (llegada nocturna y excursión a Minca al día siguiente); preferir salida de día/tarde y llegada con margen para traslado seguro. Valorar la diferencia real en vuelos y hoteles antes de elegir.

**Programación de Medellín con solo dos días completos:** jueves 14 llegada; viernes 15 Comuna 13, Plaza Botero, Parque de Bolívar, El Poblado y Provenza; sábado 16 tour completo a Guatapé; domingo 17 tendría que alojar además el tour cafetero y Pueblito Paisa antes de volar a Santa Marta. Esta combinación es muy exigente y normalmente inviable si el vuelo sale durante el día. **No recortar Medellín a tres noches a costa de las siete prioridades explícitas, salvo que una opción real y horarios compatibles lo permitan.** Metrocable, Arví y Jardín Botánico no son prioridades.

**Variante de menor alteración del vuelo interno (pero cambio internacional):** mantener Avianca el lunes 18 y llegar a Medellín el viernes 15 en vez del jueves 14. Resultarían 12 días y 11 noches (3 Medellín + 3 Santa Marta + 2 Tayrona + 3 Cartagena), se debe **recotizar el vuelo internacional completo**, y se mantiene el mismo límite de dos días completos para Medellín. No asumir que el precio anterior de Copa aplica a la nueva fecha.

**Efecto económico:** adelantar el regreso puede ahorrar una noche de hotel y comidas, pero exige recotizar el vuelo de regreso del 25. Añadir una noche al ecolodge puede aumentar notablemente el costo: no conviene sin evaluar instalaciones, experiencias y tarifa real. Ambos escenarios obligan a verificar el vuelo interno del domingo 17. No reutilizar $50,662 MXN como total definitivo de ninguna variante.

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

**Decisión editorial:** no hay problema de estructura que impida comenzar la etapa fotográfica. La reducción de Medellín no debe aplicarse hasta comparar vuelo real y elegir entre regreso anticipado o una noche adicional en ecolodge, sin añadirla a Cartagena. Mantener PR #10 como borrador y no hacer merge.


### Mejoras editoriales complementarias · segunda revisión

- Revisión de `days[1..13].am/pm/night` con cronología, tiempos orientativos, traslados y descansos según la guía editorial del Atlas; se evita el estilo conversacional «platicadito», reservado para respuestas en el chat cuando el viajero lo pida.
- Advertencia de fiebre amarilla trasladada desde el día de la caminata a las prioridades de preparación previa al viaje y consejos de salida: es una decisión que debe resolverse antes de volar, no junto a la entrada de Tayrona. Mantener orientación por fuente sanitaria oficial, sin garantizar obligación general ni reemplazar consejo médico.
- Añadida fuente de reserva directa Kali Hotels a Casa de Isabella, sin inventar una dirección postal exacta porque las fichas consultadas difieren en numeración.
- Se comparó la reducción a tres noches con calendario y conectividad: no garantiza ahorro, reduce el margen meteorológico en Medellín y exige revisar vuelo del 17 o llegada internacional el 15. **No cambiar el cronograma vigente todavía.**
- Se restableció la aserción estricta de portada para todos los viajes y se amplió la prueba exclusiva de Colombia para exigir narración desarrollada y preparación sanitaria antes del viaje.
- Fuentes web comprobadas: [cierres de Tayrona](https://www.parquesnacionales.gov.co/nuestros-parques/pnn-tayrona/), [horarios generales de Marsol](https://www.marsol.com.co/bus-santa-marta-entrada-al-parque-tayrona-cartagena), [Casa de Isabella](https://kalihotels.com/en/casa-isabella/), [clima Medellín](https://climopolis.com/en/colombia/medellin), [clima Santa Marta OMM](https://worldweather.wmo.int/en/city.html?cityId=886), [tipo de cambio COP/MXN](https://theratesapi.com/convert/cop-to-mxn/) y [fotografía Commons](https://commons.wikimedia.org/wiki/File:Streetsofcartagena.jpg).
- **Pruebas:** ejecución CI previa de cambios estructurales aprobada; nueva ejecución tras reescritura narrativa y aserciones está por confirmar en GitHub Actions. No confundir ese estado con una auditoría D de fotos finalizada.

**Veredicto:** auditoría A–C suficientemente completa para avanzar a la etapa 12 en la ruta provisional actual. Mantener sin merge y dejar variante Medellín 3 noches pendiente de comparación real de horarios/costos; no comprometer fotografías asociadas a fechas inamovibles hasta seleccionar vuelos.


## Prioridades Medellín · revisión

Conservar cuatro noches mientras no exista un vuelo diurno alternativo. Imprescindibles: Guatapé en tour (16 enero), tour del café antioqueño de medio día (17 enero), El Poblado, Plaza Botero, Parque de Bolívar o Plaza Bolívar, Provenza y Pueblito Paisa. Comuna 13 con guía también permanece (15 enero).

Metrocable pasa a opcional; Parque Arví, Jardín Botánico y visita interior del Museo de Antioquia se retiran del programa principal. Minca continúa con naturaleza y cascadas, dejando allí el café como alternativa para no duplicar experiencias. El tour del café debe regresar a Medellín a media tarde para permitir Pueblito Paisa; tours compartidos de ocho horas no cumplen el requisito.

Se eleva la bolsa provisional de experiencias a $5,500 MXN; escenario central $50,662 MXN y rango orientativo $42,000–65,000 MXN. Nada reservado ni cotizado en fechas exactas. La opción de tres noches en Medellín queda supeditada a recortar actividades o encontrar otro vuelo; no se implementa.


## Corrección de criterio sobre la noche de Medellín y la redacción de Atlas

La opción de trasladar a Cartagena la noche recortada de Medellín queda **descartada por preferencia del viajero**. Solo hay dos escenarios a evaluar, sin cambiar por ahora el JSON de fechas: **A)** 3 noches Medellín + 3 Santa Marta + 2 Tayrona + 3 Cartagena, regreso de CTG el **25 de enero** (12 días/11 noches; requiere vuelo MDE→SMR el 17 y vuelo internacional de regreso el 25 por reconfirmar); **B)** 3 noches Medellín + 3 Santa Marta + 3 Tayrona + 3 Cartagena, regreso el **26 de enero** (13 días/12 noches; requiere vuelo MDE→SMR el 17 y verificar el ecolodge para un día completo de descanso). La opción B solo vale la pena si el hotel, piscina, senderos, comidas y ambiente compensan una noche extra. **Criterio de preferencia:** no quitar ningún imprescindible en Medellín para lograr arbitrariamente tres noches; evaluar además la viabilidad de las excursiones.

**Regla editorial corregida:** «itinerario platicadito» es exclusivamente un formato conversacional que el usuario pedirá expresamente en el chat; **NO** se escribe en `days` de Atlas. Restaurado el estilo editorial conciso conforme a `docs/trip-editorial-guide.md` y reemplazada la aserción de longitud narrativa por controles de contenido operativo y concisión. Mantener campos AM/PM/noche y viñetas de traslados y consejos. No ajustar datos de vuelos/hoteles/precisión de precios hasta escoger una opción. **Fotografías siguen siendo la etapa siguiente**, con PR en borrador sin merge.


## DECISIÓN VIGENTE · Vuelos A/B recibidos y 3 noches en Medellín (06/11/2026)

Este apartado **sustituye cualquier escenario anterior de 14–26 de enero** descrito más arriba: los apartados históricos documentan decisiones anteriores y **no son la ruta vigente**. Se integraron en el JSON el nuevo inicio **viernes 15/01/2027**, fin **martes 26/01/2027**, **12 días**, **11 noches** y **8 días laborables** (sin asumir feriados adicionales). Distribución: Medellín **3 noches** (15–18), Santa Marta **3** (18–21), Tayrona **2** (21–23), Cartagena **3** (23–26); cuatro alojamientos, ninguno comprado. No se añade noche a Cartagena. El vuelo interno Avianca AV9446 lunes 18 12:00–13:15 sigue como candidato.

**Copa A, principal, $9,076 MXN multidestino, una persona turista:** viernes 15: MEX 01:20 → PTY 06:00, CM149 Boeing 737 (3h40m); escala PTY 3h32m; PTY 09:32 → MDE 10:55, CM397 Boeing 737 MAX 9 (1h23m). Salida de madrugada (traslado al aeropuerto la noche del jueves). Regreso martes 26: CTG 15:05 → PTY 16:22, CM365 Boeing 737 (1h17m); escala PTY **3h12m**; PTY 19:34 → MEX 22:25, CM866 Boeing 737 (3h51m). Emisiones estimadas 263 kg CO₂e ida y 280 regreso, tal como muestra Google Flights. Una pieza de mano incluida; documentada solo por cargo adicional no cotizado; artículo personal, kilos y dimensiones pendientes. Tarifa en capturas de Google Flights del 06/11/2026, tasas obligatorias incluidas, no comprada.

**Copa B, respaldo, $9,719 MXN:** viernes 15: MEX 05:55 → PTY 10:38, CM195 Boeing 737 (3h43m); escala PTY **2h17m**; PTY 12:55 → MDE 14:15, CM654 Boeing 737 (1h20m). Regreso idéntico a A, CM365 y CM866, 15:05–22:25; emisiones 272 kg CO₂e ida, 280 regreso. Incluye misma pieza de mano gratuita, documentada con tarifa adicional no especificada. Diferencia con A **+$643 MXN**. Ambos se guardan en `majorTransport[0].options`, seleccionable sin duplicar el vuelo dentro de presupuesto. Condiciones de cambios/reembolsos no publicadas en las capturas: pendientes de revisar con Copa.

**Nueva distribución de experiencias:** viernes 15: llegada a MDE (A 10:55 / B 14:15), Plaza Botero y Parque de Bolívar solo si hay tiempo antes del anochecer, cena en Provenza. Sábado 16: Guatapé y Piedra del Peñol en tour, día completo. Domingo 17: Comuna 13 guiada + Pueblito Paisa, y plazas si no cupieron el viernes. Lunes 18: Avianca a Santa Marta. Martes 19: tour del café **en Minca** (en lugar de Antioquia) más cascadas de Marinka solo si logística lo permite. El Poblado se usa como zona del hotel, no se agenda paseo dedicado. Otras ciudades mantienen sus noches y fechas anteriores.

**Reconciliación económica:** hotel Medellín reducido de 4 noches/$4,800 meta a **3 noches/$3,600 meta**, Copa A $10,303 antigua → **$9,076 nueva**, alimentos 13 días/$6,500 → **12 días/$6,000**, excursiones 13 días/$5,500 con doble café → **12 días/$4,500 con café solo en Minca**. Central nuevo **$46,735 MXN**, rango orientativo **$39,000–61,000 MXN**. Con Copa B, central **$47,378 MXN**. Ninguna tarifa ni alojamiento comprado; se deben revisar precios de hoteles y excursiones realmente pagables.

**Integridad de interfaz:** actualizado `work`, `start`, `days`, `bases`, `hotels[].checkIn/out`, `majorTransport` y sus `day`/refs, `expenses`, `budgetPreliminary`, `budgetNote`, `intro`, `introShort`, `experiences`, `reservations`, `practicalIndicators`, `planningDetails` y pruebas. Los textos usan el formato editorial conciso de Atlas: el «itinerario platicadito» solo se usa en el chat a solicitud explícita.

**Riesgo por confirmar:** si la opción B llega después de las 14:00, podría no caber Plaza Botero y Parque de Bolívar el viernes. En ese caso el domingo deberá combinar las dos plazas, Comuna 13 y Pueblito Paisa sin visitar museos; evaluar operador con transporte y confirmar horas. No tratar como garantizada toda la lista sin revisar el ritmo del domingo. Fotografías y cierre D siguen pendientes. PR #10 sin merge.
