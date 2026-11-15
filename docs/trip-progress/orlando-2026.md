# Registro de avance · Orlando 2026

**Viaje:** Orlando 2026 · Disney y Universal  
**JSON:** `data/trips/orlando-2026.json`  
**Rama / PR:** `feature/orlando-2026` · https://github.com/JesusRiddle/atlas-viajes/pull/17  
**Modalidad:** Itinerario detallado  
**Última actualización:** 2026-11-15  
**Etapa actual:** 13 · auditoría técnica automatizada superada; pendiente cierre económico y verificación manual  
**Siguiente acción autónoma:** cerrar precio de Magic Kingdom y confirmar las cotizaciones/condiciones de hotel, vuelo, transporte y entrada Universal; completar inspección visual manual y preparar PR para revisión del propietario, sin merge.

## Decisiones definitivas del viajero

- 1 persona, vuelo redondo directo MEX–MCO, **2–7 diciembre de 2026**, cinco noches en un único alojamiento. No modificar fechas.
- Cuatro jornadas de parques: **3/12 Studios Florida; 4/12 Islands of Adventure; 5/12 Magic Kingdom; 6/12 Epic Universe**.
- **Harry Potter máxima prioridad:** Diagon Alley/Gringotts; Hogsmeade/Hogwarts/Hagrid; Place Cachée/Battle at the Ministry. Completar los días con VelociCoaster, Spider-Man, Space Mountain, Dark Universe, Donkey Kong y Stardust Racers solo según filas.
- **No agregar Pandora/Animal Kingdom, Hollywood Studios, EPCOT, Kennedy Space Center ni SeaWorld**, ni noche adicional. Hogwarts Express omitido por requerir Park-to-Park.
- Plan A **Rosen Inn Closest to Universal** (tarifa flexible 5 noches, 1 adulto, US$539.94 impuestos incluidos, captura 15/11/2026); Plan B **Terra Luna** con hotel+entradas Universal US$1,577.46, alternativa excluyente.
- Entradas Plan A **Universal 3-Day 3-Park** US$335.99 mostrado como subtotal para iniciar el 3/12/2026, válido 7 días; sin Park-to-Park. No hay compras.
- Vuelo Volaris $7,015 MXN redondo, captura 15/11/2026, equipaje con posible cargo.
- Shuttle gratuito Rosen–Universal/Epic: **programado, cupo limitado, reserva presencial**; no tiene acceso anticipado Universal. Aeropuerto–hotel y hotel–Disney requieren pago aparte.
- **Magic Kingdom 5/12** sin fiesta navideña privada según Disney; entrada regular todavía sin precio cotizado.
- El viajero pidió dejar cerrada la arquitectura del recorrido y no seguir pidiéndole pantallas de reservas.

## Checklist 00–13

- [x] **00 Preparación:** rama y registro visible creados previamente; guías maestras y plantillas consultadas.
- [x] **01 Alcance:** destino, 1 viajero, seis días, cuatro parques y prioridades definidos.
- [x] **02 Temporadas · refinada y revisada 3 veces (15/11/2026):** doce meses, mínimas/máximas medias 1991–2020 convertidas y redondeadas, clima y precipitación, temporada ciclónica, eventos Disney/Universal, puentes, afluencia y ventanas recomendadas. Cinco meses recomendables (con ventanas), tres aceptables, cuatro desaconsejables. Fuentes oficiales en `seasonality.referenceLinks`; CI de commit `7af27e38` en verificación.
- [x] **03 Fechas y esqueleto diario:** seis fechas continuas y cinco noches, secuencia compatible; **Auditoría A: verificación estructural parcial**, aún sin validar todas las disponibilidades operativas.
- [x] **04 Mapa:** cinco puntos (Rosen y cuatro parques), coordenadas comprobadas en Mapcarta/OSM; hotel con precisión aproximada de tres decimales.
- [x] **05 Experiencias:** Harry Potter y atracciones principales detalladas sin sumar parques extras.
- [x] **06 Reservaciones importantes:** vuelo, hotel y boleto Universal cotizados separados de Disney pendiente y transportes estimados.
- [x] **07 Movilidad:** vuelo estructurado con dos trayectos; shuttle y alternativas terrestres documentados. Falta probar renderer `AtlasMajorTransport.render`.
- [x] **08 Dónde dormirás:** Rosen Plan A y Terra Luna Plan B, mapas/enlaces oficiales y tarifas excluyentes; **Auditoría B pendiente de renderer y disponibilidad final**.
- [x] **09 Día por día:** mañana/tarde/noche, movilidad, notas y enlaces de seis días, sin prometer filas inexistentes.
- [x] **10 Panorama:** intro, introShort, clima/luz e indicadores [style,language,entry].
- [x] **11 Presupuesto preliminar:** nueve partidas Plan A; hotel y entradas cotizados, vuelos captura, gastos de traslados/comidas estimados; Disney cost.amount null. Escenario Terra Luna excluido. **Auditoría C provisional**, precio real de Disney pendiente.
- [x] **12 Fotos/portada:** cuatro fotos de Wikimedia Commons con fuentes, autores y licencias; portada Hogwarts, una foto por día de parque. Falta inspección visual efectiva en navegador.
- [x] **13 Auditoría D técnica:** GitHub Actions commit `6690d12d3356bea5737841afdf7a8f193d9a3e7d` concluyó **success** (Node y browser smoke Desktop/Mobile). PR #17 sigue en borrador por verificaciones manuales y cotizaciones pendientes. No merge.

## Verificaciones ejecutadas en este turno
- Lectura de JSON editado desde GitHub posterior al commit `6659775e03709f99459f6b60d560c4f1b422fff2`: parse JSON correcto.
- Comprobaciones de calendario: fechas continuas 02–07/12; 6 días/5 noches; 1 viajero; hotel asociado a cada día; 12 meses; tres indicadores exactos en orden.
- Entrada de transporte: selectedOption y selectedFare referencian opción/tarifa existentes.
- Fuente oficial Disney: eventos 3/4/6/12; no evento privado el 5/12.
- Fuente oficial Rosen: shuttle programado con reserva y cupos; fuente Banxico para USD/MXN.
- **NO ejecutadas:** tests locales Node, pruebas de navegador Desktop/Mobile y validación completa en renderer. El CI GitHub Actions del commit 775c858b está en curso; resultado aún desconocido. Imágenes añadidas, referencias presentes en data/places.json, pero carga visual no verificada.

## Pendientes prioritarios
1. **No bloqueantes para mostrar la propuesta:** cotizar Magic Kingdom, confirmar cargos de equipaje Volaris, disponibilidad y políticas reales de Rosen y boleto Universal, Uber/Lyft MCO↔hotel↔MCO y Rosen↔Disney.
2. **Bloqueantes para aprobar auditoría D:** render de transportes y presupuesto, pruebas de regresión escritorio/móvil, carga visual de fotos y CI exitoso.
3. **Comparación excluyente:** Terra Luna USD 1,577.46 ya contiene hotel y boletos Universal, mientras que Rosen USD 539.94 + Universal USD 335.99 se suman en plan A; nunca mezclar ambas opciones en un presupuesto.
4. **Riesgo de horarios:** tren Hogwarts Express no cubierto por billete 1 parque/día; no garantizar espectáculos ni todas las atracciones en días de alta demanda.

**No hay reservas, compras ni merge.** La tarjeta puede verse en vista previa de la rama, no en GitHub Pages público hasta el merge.

## Avance adicional · 15/11/2026
- **Mapa:** hotel Rosen, Studios Florida, Islands of Adventure, Magic Kingdom y Epic Universe con coordenadas documentadas de OpenStreetMap/Mapcarta.
- **Transporte:** horarios de salida y regreso del shuttle Rosen incluidos con aviso de reserva previa y restricciones; comprobar vigencia a la llegada.
- **Fotos:** cuatro entradas nuevas en data/places.json (or26-diagon, or26-hogwarts, or26-magic, or26-ministry) con CC y atribución. Foto portada Hogwarts, fotos en cuatro jornadas, ningún día de vuelo requiere foto.
- **Presupuesto:** partida conocida USD 1,450.93 + vuelo MXN 7,015 antes del boleto Disney. Rango general corregido $37,000–$40,000 MXN, con Disney solo como provisión y sin compras.
- **Comprobación en GitHub:** JSON descargado y parseado, cinco puntos de mapa, portada con imagen existente, cuatro fotos referenciadas existentes, secuencia de seis fechas y partidas USD conciliadas. Workflow del commit 775c858b todavía en progreso cuando se consultó; no atribuir éxito hasta que termine.

## Revisión de CI y fotografías · 15/11/2026
- GitHub Actions de commit 650063a y 775c858: **falló** la suite Node con 103 aprobadas y 2 fallidas. Errores localizados en `tests/loader-regression.test.cjs`: expectativa fija de 22 registros (ahora 23) y primera posición Colombia cuando la nueva cronología comienza con Orlando 2026.
- Se actualizaron ambas pruebas manteniendo los 15 viajes históricos en grupo `ideas`, agregando validación de Orlando como visible, y preservando el orden de los viajes 2027. Commit `c57eca756f21834e69368f46151dfce85c9ceca6`.
- Se comprobaron en Wikimedia Commons las cuatro páginas originales de las fotos, incluyendo sus autores y licencias. La fotografía Hogwarts `Hogwarts Castle (15379458178).jpg` tenía licencia mal declarada como CC BY-SA 4.0; corresponde a **CC BY 2.0** y se corrigió en `data/places.json` (commit `a24345f8ba78f92e6730246be633414894c4398b`).
- El nuevo CI se observó `in_progress` tras los commits de corrección; no afirmar éxito mientras siga sin conclusión.
- Sigue pendiente inspeccionar carga de imágenes en navegador y los resultados de pruebas de pantalla; archivos fuente y metadatos verificados no equivalen a validación visual.

## Cierre de regresiones automatizadas · 15/11/2026
- Se corrigió `tests/loader-regression.test.cjs` para reconocer Orlando como viaje principal número 1, sin retirar los 15 viajes históricos.
- Se corrigió `tests/browser-smoke.cjs`: ocho tarjetas principales, seis viajes de la comparativa presupuestada (Orlando todavía preliminar), fixture incremental de nueve tarjetas, e impresión de contexto cuando un valor inválido aparezca.
- El navegador detectó presupuesto inválido `$NaN–$3.00 MXN` en Orlando; causa: `budgetRange` se guardó como cadena en lugar de `[mínimo, máximo]`. Se corrigió a `[37000,40000]` (MXN).
- **GitHub Actions run 43755905853 del commit 6690d12d3356bea5737841afdf7a8f193d9a3e7d terminó SUCCESS**. Incluye pruebas de Node y Playwright browser smoke Desktop/Mobile, con nueve secciones y navegación de todos los viajes.
- Quedan fuera del alcance automático: comprobación humana de estética, visibilidad real de imágenes remotas bajo redes de usuarios, cotización de Magic Kingdom y disponibilidad de servicios aún no comprados.

## Auditoría específica de Temporadas · 15/11/2026

**Alcance 100% editorial de la sección:** 12/12 meses, rango normal de mínimas y máximas medias mensual (no máximas diurnas mezcladas), etiquetas y iconos válidos. Fuentes principales Florida Climate Center/NOAA 1991–2020, NHC para ciclones, Disney y Universal oficiales para eventos 2026/2027; estimaciones de afluencia de Undercover Tourist señaladas como no oficiales.

**Resultado:** `recommended` enero, febrero, abril, noviembre y diciembre con ventanas específicas; `conditional` marzo, mayo y octubre; `avoid` junio, julio, agosto y septiembre. Septiembre baja a desaconsejable por pico de actividad ciclónica pese a precios y filas atractivos; octubre queda aceptable por Halloween y riesgo residual. Diciembre primera mitad recomendado para Harry Potter; Navidad y Año Nuevo desaconsejados dentro del mismo mes por aglomeración.

**Tres revisiones ANTES del commit de datos:** (1) cobertura 12/12, estados/iconos y sintaxis de temperatura; (2) conversión °F a °C exacta de las 24 normales NOAA/Florida Climate Center, min/máx; (3) concordancia de 12 meses con vacaciones, fiestas, ciclones y prioridad Harry Potter. Todas sin observaciones; commit `7af27e38ebc8182bdddb001a14e048cee017393d`.

**Próxima sección recomendada:** Mapa (validación geográfica y visual fina, pines y correspondencia con noches), después Experiencias y Reservaciones importantes. El resto del viaje tiene contenido pero no debe marcarse como revisado al 100% por esta auditoría específica.

## Auditoría específica del Mapa · 15/11/2026

- **Cinco puntos cotejados con cartografía externa:** Rosen Inn Closest to Universal (28.46, −81.469), Universal Studios Florida (28.47724, −81.46924), Islands of Adventure (28.47114, −81.47157), Magic Kingdom (28.41909, −81.58143) y Epic Universe (28.4435, −81.44774). Fuente cartográfica: OpenStreetMap/Mapcarta; coordenadas de parque orientadas a sus áreas centrales, no a la puerta de acceso ni a puntos de recogida de autobuses.
- **Una estancia:** `base:true`, `stayName: 'Orlando'` y `bases: [['Orlando',5]]` asocian el hotel con cinco noches; los cuatro parques `base:false` no heredan noches. Números 1–5 corresponden a la secuencia 2–6 diciembre (hotel y 4 parques).
- **Experiencia de mapa:** cuatro sitios `kind:'Parque temático'`; etiquetas y leyenda específicas sin presentar parques como ciudades ni introducir rótulos 'referencia regional'. `travel-ui.js` usa descripción válida para ciudades y lugares y badge 'Parque temático' solo cuando corresponde, sin alterar otros viajes.
- **Geografía y movilidad:** Studios e Islands están en el complejo original/CityWalk, Epic en zona separada y Magic Kingdom en Walt Disney World. El mapa es de pines, no representa ruta vial ni tiempos. Universal publica puntos de vehículos: Epic pickup/dropoff en 1201 Epic Blvd (dirección de estacionamiento 1001 Epic Blvd); no suponer que el centro del mapa es acceso de Uber.
- **Transporte hotel:** servicio gratuito Rosen–Universal programado y sujeto a reserva/aforo. FAQ del hotel menciona opción Disney de pago pero sin horario, ruta ni precio confirmados; Uber/Lyft sigue como plan principal.
- **Control 1:** 5 coordenadas en región Orlando y 5 órdenes únicos. **Control 2:** cruce de 4 fechas/4 parques con hotel de 5 noches. **Control 3:** renderer con etiquetas, orden, leyenda y ausencia de 'Noches por definir' / 'referencia regional' en tests Desktop y Mobile.
- GitHub Actions del commit `42048c7f` terminó **success** con pruebas del mapa agregadas. Se hicieron cambios de etiquetas en commits `31574a55`/`5a5a9e51`; revisar el CI posterior antes de cerrar la auditoría técnica definitiva.

**Siguiente sección pendiente de refinamiento:** Experiencias: revisar todas las atracciones acordadas por parque, ordenar imprescindible/prioridad secundaria, comidas temáticas, intensidad y cobertura fotográfica sin alterar días ni añadir Pandora.
