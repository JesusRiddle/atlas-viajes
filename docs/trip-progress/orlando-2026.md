# Registro de avance · Orlando 2026

**Viaje:** Orlando 2026 · Disney y Universal  
**JSON:** `data/trips/orlando-2026.json`  
**Rama / PR:** `feature/orlando-2026` · https://github.com/JesusRiddle/atlas-viajes/pull/17  
**Modalidad:** Itinerario detallado  
**Última actualización:** 2026-11-15  
**Etapa actual:** 11/13 · presupuesto conciliado y nueve secciones revisadas; pendiente auditoría global visual, precios de compras y aprobación de merge  
**Siguiente acción autónoma:** realizar auditoría global cruzada de 9 secciones, revisar imágenes remotas y experiencia visual, comprobar CI de rama final, comparar compra real de Magic Kingdom y términos finales de cotizaciones cuando sean accesibles; preparar PR para revisión, sin merge.

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
- [x] **05 Experiencias · refinadas 15/11/2026:** nueve tarjetas para los cuatro parques; tres áreas de Harry Potter prioritarias y cuatro comidas temáticas verificadas en menús oficiales. Actividades secundarias condicionadas por filas, en especial Epic Universe; coherencia con días 3–6 diciembre. Auditoría automatizada específica agregada en `tests/browser-smoke.cjs`.
- [x] **06 Reservaciones importantes · auditada 15/11/2026:** 3 grupos y 8 tarjetas, nota visible de compras no realizadas, referencias de vuelo/hotel/Universal preservadas, Disney pendiente, Park-to-Park con Hogwarts Express como alternativa opcional, paquetes excluyentes y condiciones de Rosen verificadas. CI Desktop/Mobile del commit `1d4d9230` aprobado.
- [x] **07 Movilidad y conexiones · refinada 15/11/2026:** vuelo directo redondo MEX–MCO con husos correctos y gasto único, cuatro fichas terrestres con enlaces y traslados MCO/Rosen/Universal/Disney, costes no duplicados y pruebas Desktop/Mobile agregadas. CI posterior a commit `fee9057e` en verificación.
- [x] **08 Dónde dormirás · auditada 15/11/2026:** Rosen Plan A único alojamiento presupuesto, Terra Luna alternativa excluyente de paquete; habitaciones, condiciones y mapas oficiales revisados, cinco noches validadas y día de salida sin sexta pernocta. CI específico en revisión.
- [x] **09 Día por día · auditado 15/11/2026:** seis jornadas refinadas con logística, pausas, plan ante filas, espectáculos navideños oficiales y condicionales; cinco noches y día de regreso sin hotel. CI en verificación.
- [x] **10 Panorama · auditado 15/11/2026:** intro 104 palabras, introShort 33; tres indicadores [style,language,entry], tarjeta de clima/luz independiente, estancia 5 noches/1 alojamiento y presupuesto con pendientes explícitos. Pruebas Browser Desktop/Mobile del commit `80e18b1f` aprobadas.
- [x] **11 Presupuesto · auditoría C editorial y CI superados:** gastos Plan A reconciliados y diferenciados por estado, seis jornadas de comida, impuesto Universal provisional y cotizaciones faltantes identificadas; Disney `cost.amount=null`. Subtotal $34,436.19 MXN antes de Disney, rango de planeación $39,000–$44,000 MXN. No es total final de compra.
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
- **Histórico previo a la auditoría de Presupuesto:** en esta fase inicial se estimó USD 1,450.93 más vuelo $7,015 y rango $37,000–$40,000; **superado** por la conciliación final de la sección Presupuesto (subtotal $34,436.19, rango $39,000–$44,000).
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

## Auditoría específica de Experiencias · 15/11/2026
- **Contenido:** de cuatro tarjetas extensas a nueve narraciones más precisas (2 Studios, 2 Islands, 2 Magic Kingdom y 3 Epic). Prioridad inmersiva: Diagon Alley/Gringotts, Hogwarts/Hagrid y Place Cachée/Battle at the Ministry/Le Cirque Arcanus. Knight Bus y lugares de ambientación añadidos.
- **Gastronomía temática verificada en menús oficiales:** Leaky Cauldron (fish and chips, cottage pie), Three Broomsticks (pollo asado, shepherd's pie), Sleepy Hollow (waffles/funnel cakes), Café L'air De La Sirène (baguette de pavo, crepes de Butterbeer); no presentarla como cocina tradicional de Orlando ni como reserva confirmada. Revisar alérgenos al ordenar.
- **Intensidad y capacidad:** VelociCoaster/Hulk, Stardust Racers/Mine-Cart Madness/Hiccup permanecen opcionales. Dark Universe/Monsters Unchained y Mario Kart son prioridad secundaria respecto del Ministerio de Magia. No añadir Pandora ni nuevos parques. Condicionar espectáculos por cartelera y Big Thunder por operación diaria. Hogwarts Express excluido de entradas 1 parque/día.
- **Sincronización:** revisadas las jornadas 3, 4, 5 y 6 de diciembre para reflejar la comida temática, prioridades y actividades secundarias. Sin cambiar vuelos, alojamiento, fechas ni precio de entradas.
- **Interfaz:** reemplazado encabezado compartido de tarjeta de enfoque (antes 'Un viaje con pocas maletas') por 'El enfoque de este viaje' para coherencia editorial.
- **Pruebas:** se añadió comprobación de 9 tarjetas, frases de Harry Potter, restaurantes oficiales, ausencia de parques descartados y flexibilidad Epic a la suite Playwright en escritorio y móvil. GitHub Actions de commits `9435ae0a`/`bf4539fb` aún pendientes al elaborar esta entrada; no afirmar resultado sin observar conclusión.
- **Siguiente sección recomendada:** **Reservaciones importantes**, con revisión del boleto Universal 1 parque/día frente a Hogwarts Express Park-to-Park, entrada Magic Kingdom, hotel Rosen, transporte y claridad de estados 'cotizado' versus 'comprado'.

## Auditoría específica de Panorama · 15/11/2026
- **Narrativa editorial:** se sustituyó el texto excesivamente enumerativo por una secuencia turística de cuatro días/tres mundos de Harry Potter: Diagon Alley, Hogwarts/Hogsmeade, Magic Kingdom y Ministry of Magic/Epic Universe. Introducción de 104 palabras y tarjeta breve de 33; resaltados vinculados a lugares reales mencionados, sin compras ni presupuestos incrustados.
- **Indicadores:** exactamente 3, `style`, `language`, `entry` en orden; caminar/parques/filas, inglés/USD, y requisitos pasaporte mexicano + visa estadounidense vigente (usuario ya la tiene), sin ESTA cuando se usa visa válida, enchufes A/B compatibles sin adaptador y electricidad 120 V/60 Hz. Fuentes CBP y State Department.
- **Clima y luz:** formato tres párrafos, 12 a 23 °C como normales mensuales 1991–2020 de Orlando MCO, diferencia frente a pronóstico futuro explicitada; amanecer 07:01–07:05 y atardecer 17:28 EST el 2–7 diciembre (tabla solar 2026), vestimenta y equipaje coherentes.
- **Hospedaje y presupuesto:** portada 5 noches · 1 alojamiento, Rosen Plan A cotizado sin reservar y Terra Luna Plan B excluyente en detalles. Se conservó rango `[37000,40000]` MXN como estimación provisional con margen, no como precio cerrado, y Magic Kingdom sigue sin cotización; no se alteraron importes del cuadro de gastos.
- **Verificaciones:** validación previa de presencia 13 resaltados, longitudes intro/introShort, formato climático y orden de indicadores. CI GitHub Actions del commit `80e18b1f919e21401d144dc310deef16355081d7` **success**, incluidas pruebas Node y browser Desktop/Mobile para Panorama.
- **Alcance:** sección Panorama concluida editorial y técnicamente. Cierre económico general de viaje aún pendiente de cotización Disney y verificación de compras; no implica que el viaje completo esté listo para merge.

**Siguiente sección recomendada:** Reservaciones importantes, para conciliar boleto Universal actual (sin Park-to-Park ni Hogwarts Express), alternativa que sí lo incluya y costos de Magic Kingdom y Rosen sin pedir repetir capturas previas. Sin merge.

## Auditoría específica de Reservaciones importantes · 15/11/2026

- **Componente y contrato:** `planningDetails` era una cadena; se corrigió a objeto `{reservationTitle,reservationNote}`. Ahora aparece introducción visible y título «Reservaciones importantes».
- **Organización:** 4 prioridades muy altas (Volaris, Rosen Inn, Universal y Magic Kingdom), 1 prioridad alta (traslados) y 3 decisiones flexibles (Park-to-Park/Hogwarts Express, paquete Terra Luna y pases rápidos). Ocho tarjetas con enlaces y sin estados falsos de compra.
- **Volaris:** captura 15/11, $7,015 MXN redondo para 1 adulto; 2/12 MEX–MCO 11:10–15:18, 7/12 MCO–MEX 17:05–19:45. Franquicia de equipaje y cambios pendientes, no inferidos.
- **Rosen Plan A:** captura 15/11, 5 noches US$539.94 impuestos incluidos; sin reserva. FAQ oficial: check-in 16:00, check-out 11:00, pasaporte físico y tarjeta a nombre del titular. Fecha de cancelación, preautorización y tarifa vigente sin confirmar. Shuttle Universal gratuito con cupos y reserva; shuttle Disney con cargo anunciado sin itinerario confirmado.
- **Universal:** subtotal de carrito US$335.99, 3 días/3 parques uno por día, NO Park-to-Park. Oferta oficial alternativa 3 días Park-to-Park (2 días Studios/Islands + 1 Epic) desde US$357 + impuestos, precio publicado genérico y NO tarifa para fecha 3/12; no calcular sobreprecio real por resta de un subtotal fechado contra un precio «desde». Hogwarts Express exige Park-to-Park; decisión abierta sin cambiar Plan A.
- **Disney:** 5/12/2026 Magic Kingdom, boleto fechado de un día sin cotización; `expenses.orlando-disney.cost.amount === null`. Disney confirma que no hay Mickey’s Very Merry Christmas Party el sábado 5/12; ticket regular no incluye Lightning Lane. Para alojamiento Rosen, opción de Lightning Lane 3 días antes, venta en app sujeto a cupo y precio dinámico. No se han comprado extras.
- **Presupuesto y alternativas:** conservar Rosen + entrada Universal como Plan A, Terra Luna US$1,577.46 paquete hotel+tickets como opción separada. Transferencias aeropuerto/Disney en rangos estimados sin cotización en vivo. Sin duplicados ni compras declaradas.
- **Tests:** comprobación en `tests/browser-smoke.cjs` de título/intro, 3 grupos, 8 tarjetas, estado de compra, enlaces, Hogwarts Express, alternativas y Disney null. GitHub Actions **success** commit `1d4d92301b0cd52b44c9c22efee317ce937c2146`, Node y browser escritorio/móvil. Fallo intermedio inicial solo por escape de `US$357` en test, corregido.
- **Pendiente ajeno a esta auditoría editorial:** tarifa Disney fechada, precio Universal final, cotización vuelo/hotel actualizados y compra por cuenta del usuario. No hacer merge.

**Siguiente sección recomendada:** Movilidad y conexiones, con auditoría de aeropuerto MCO, shuttle Rosen–Universal/Epic, transferencia real a Magic Kingdom, costos sin duplicar y coherencia de tarjetas de vuelo. Posteriormente Dónde dormirás, Día por día y cierre del Presupuesto.

## Auditoría específica de Movilidad y conexiones · 15/11/2026
- **Cuatro fichas terrestres en `groundConnections` renderizadas dentro de Movilidad:** (1) MCO↔Rosen, (2) shuttle Rosen↔Studios/Islands, (3) Rosen↔Magic Kingdom con acceso al TTC y monorriel/ferry, (4) shuttle Rosen↔Epic Universe. Tienen días, método, puntos de recogida, provisión de presupuesto e hipervínculos oficiales, sin falsear boletos comprados.
- **Vuelo:** MEX→MCO 2 dic 11:10–15:18 (-06:00/-05:00), 3h08; MCO→MEX 7 dic 17:05–19:45 (-05:00/-06:00), 3h40. Referencia Volaris $7,015 MXN redondo por captura, sin compra. MCO agregado a nombres reconocidos del renderer. `budgetIncludedIn:'orlando-flight'` impide que la ficha del vuelo duplique el gasto.
- **Traslado MCO:** Uber/Lyft o taxi; no existe shuttle Rosen gratuito al aeropuerto. Terminal y recogida sujetas a tarjeta de embarque y señalización; regreso con margen orientativo para vuelo internacional 17:05. Partida `orlando-airport` US$95 (rango US$70–120) redonda, no se duplica en día 6.
- **Rosen–Universal:** rutas norte C y Epic A, horarios publicados en web del hotel al 15/11/2026 y sujetos a cambios. Reserva presencial preferentemente un día antes, aforo limitado, sin entrada anticipada ni eventos. Se detectó inconsistencia entre páginas de Rosen sobre reserva con 30 minutos / 24 horas, por lo que se recomienda reservar el día previo y confirmar el cronograma al llegar. Uber/Lyft norte North Parking Garage 6000 Universal Blvd; Epic 1201 Epic Boulevard (distinto del estacionamiento 1001 Epic Blvd). Colchón US$40 compartido entre tres días, no uno por parque.
- **Disney:** Uber/Lyft o taxi hasta Transportation and Ticket Center; después monorriel Express o ferry a Magic Kingdom, retorno en sentido inverso. Rosen confirma shuttle Disney con cargo pero no publica horario, ruta ni precio; no presupuestarlo como gratis ni asumir bajada a la entrada. Partida `orlando-disney-transfer` US$70 (rango US$50–90) redonda, única.
- **Interfaz:** en `components/major-transport.js`, bloque dedicado a las cuatro conexiones terrestres, la información se muestra sin meter gastos adicionales al motor económico. Notas de `ticketNotes` migradas a objetos `{title,note}` para lectura correcta y guía de billetes. Encabezado adaptativo para otros tipos de movilidad, manteniendo vuelos/trenes de otros viajes intactos.
- **Testing:** `tests/browser-smoke.cjs` asegura 1 ficha de vuelo + 4 terrestres, enlaces, popups desplegables y 3 partidas únicas para MCO/Disney/traslados de respaldo, además de referencias de vuelo en día 1 y día 6. Un intento de agregar test corrompió el archivo y se restauró completamente desde el commit validado `ac9fc761`; versión corregida `fee9057e6b4b2cf4125beb36c4bd7c0a1c62c5a1`, CI en curso al registrar esta entrada.
- **Fuentes:** Rosen transportation, hotel-information y FAQ, Universal Orlando parking/directions, Disney monorail, MCO Arrival Guide. Importes de Uber/Lyft permanecen estimados, no calculados a partir de cotizaciones actuales.

**Siguiente sección recomendada:** Dónde dormirás — evaluar y documentar Rosen como alojamiento principal, Terra Luna como alternativa excluyente, ubicación, impuestos, habitación, cancelación y acceso a parques. Después Día por día y Presupuesto.

## Auditoría específica de Dónde dormirás · 15/11/2026
- **Geografía:** Rosen Inn Closest to Universal, 6327 International Drive, Orlando FL 32819, y Universal Terra Luna Resort, **5500 Epic Blvd**, Orlando FL 32819. Ambas ubicaciones con enlaces Google Maps corregidos y enlaces de alojamiento oficiales. No cambiar Rosen como opción principal sin decisión del viajero.
- **Rosen Plan A:** cinco noches 2–7 diciembre, 1 viajero, habitación Deluxe Double con dos camas dobles y baño privado, tina/regadera, aire acondicionado, WiFi, caja fuerte, mini refrigerador, microondas y cafetera; fuente: ficha oficial Rosen. Precio observado en captura 15/11/2026 US$479.95 + US$59.99 impuestos = US$539.94, no reservado ni tarifa actual garantizada. Hotel sin resort fee. Check-in 16:00, check-out 11:00, pasaporte físico y tarjeta de crédito a nombre del titular. Fecha límite de cancelación y depósitos no confirmados para ESA tarifa particular, no inferir de etiquetas generales.
- **Terra Luna Plan B:** el hotel oficial Universal se ubica junto a Epic, con shuttle a parques Universal y Early Park Admission solo en atracciones/parques seleccionados con entrada válida; no incluye Express ni traslados gratuitos MCO o Disney. Room Standard Double Queen. Captura 15/11: US$1,577.46 paquete conjunto 5 noches + entradas Universal Park-to-Park 3 días + 2 gratis; NO hotel-only. Las condiciones publicadas en web sobre depósito de 1 noche/cancelación antes de 6 días son **para habitación independiente**, no asumirlas para el paquete del carrito.
- **Comparación visible en `hotelsComparison`:** Rosen US$539.94 + Universal US$335.99 subtotal = US$875.93 más impuestos pendientes; Terra Luna paquete US$1,577.46; resta visual US$701.53, que **no es un diferencial final homogéneo** por condiciones, cobertura de entradas y beneficios distintos. Disney, vuelo y aeropuerto quedan fuera de ambos escenarios comparados. No duplicar partidas.
- **Corrección de integridad:** `days[5].hotel` (7 dic, salida) pasó de `orlando-rosen` a `null`, eliminando una sexta indicación de hospedaje. Solo las cinco noches 2–6 diciembre tienen el hotel Plan A. `bases=[['Orlando',5]]`, portada `5 noches · 1 alojamiento` y única partida lodging `orlando-hotel` US$539.94.
- **Interfaz:** el encabezado de la sección muestra 'Alojamiento elegido y alternativa' en Orlando. Dos tarjetas exhiben Plan A y B, pero el resumen conserva un solo alojamiento. Una nota de comparación aparece debajo; otros viajes siguen con encabezado previo.
- **Pruebas agregadas** en `tests/browser-smoke.cjs`: dos tarjetas, comparación excluyente, enlaces, cinco noches, ninguna del día 6, una sola partida en presupuesto. Commit funcional `8553d95931113525868362b18e377b69e620981f`; CI en curso al redactar.
- **Pendientes comerciales:** reabrir motor de reservas en vivo para fechas exactas y revisar política particular antes de pagar. No afirmar reservas confirmadas ni fusionar PR.

**Siguiente fase:** Día por día, seis jornadas y cuatro parques, verificando horarios festivos y accesos, tiempos, descansos, comidas y dependencias de traslado. Después Presupuesto integral.

## Auditoría específica de Día por día · 15/11/2026
- **Fechas inalteradas:** 2–7 diciembre 2026, 6 jornadas y 5 noches Rosen Inn; 3/12 Studios, 4/12 Islands, 5/12 Magic Kingdom, 6/12 Epic Universe; 7/12 check-out + regreso. Sin extensión, cambio de hotel ni parques agregados.
- **Día 1:** vuelo MEX 11:10→MCO 15:18, sin compra; migración, transporte terrestre variable, check-in Rosen 16:00 y shuttle del día siguiente reservado presencialmente. Sin actividades prepagadas por la tarde.
- **Día 2 Studios:** Diagon Alley/Gringotts como prioridad, Leaky Cauldron y descansos; Mummy/Transformers/Bourne opcionales. Se incorporó el desfile festivo Universal Holiday Parade featuring Macy’s para 2026 como alternativa a Diagon Alley iluminado; confirmar horario en app y regreso shuttle/Uber.
- **Día 3 Islands:** Hagrid/Forbidden Journey/Hogwarts con plan ante cierres y esperas, Three Broomsticks, Honeydukes, VelociCoaster/Spider-Man opcionales. Hogsmeade iluminado y proyecciones navideñas condicionadas a cartelera; Grinchmas se contempla como alternativa, no obligación.
- **Día 4 Magic Kingdom:** TTC + monorriel/ferry, atracciones por zonas, comida/descanso y Jingle Cruise/Frozen Holiday Surprise como opciones estacionales verificadas. Disney confirma que el 5/12 NO hay Mickey’s Very Merry Christmas Party. **No confundir** desfile/fuegos exclusivos de esa fiesta con programación regular: Disney Starlight y Happily Ever After sujetos a calendario y clima.
- **Día 5 Epic Universe:** Battle at the Ministry primera prioridad; Le Cirque Arcanus, pausa en Café L’air De La Sirène, Monsters Unchained y Mario Kart. Como máximo una actividad intensiva opcional entre Mine-Cart Madness, Stardust Racers y Hiccup’s Wing Gliders; decoraciones navideñas Nintendo, Isle of Berk/Snoggletog y Celestial Park confirmadas para la temporada, horarios concretos por comprobar. Salida en shuttle o Uber/Lyft 1201 Epic Blvd.
- **Día 6:** check-out antes de las 11:00, salida a MCO hacia 12:30–13:00 como planificación, vuelo 17:05→19:45 sin compra; sin noche adicional.
- **Validación editorial:** atracciones primarias y secundarias separadas, no se prometen colas cortas, espectáculos ni entrada anticipada, no se incluye Hogwarts Express con 1 parque/día, no se añaden parques descartados ni transportes o gastos repetidos. Fuentes oficiales Universal comunicados navideños del 11/11/2026 y páginas Studios/Islands; Disney calendario fiesta y Holidays.
- **Pruebas automatizadas** de seis fechas, 5 noches, cuatro parques, Macy’s/Grinchmas, distinción de evento privado Disney, límite opcional Epic y referencias de vuelo, añadidas al browser smoke (commit `c6a65f706bfe8a4ce139f8a4207bfaeeedf8b808`). CI en curso al redactar esta nota; no afirmar success antes del resultado.

**Siguiente etapa:** Presupuesto integral, revisar US$335.99 subtotal Universal, US$539.94 Rosen, $7,015 MXN Volaris, boleto Disney sin precio, transfers, alimentación, cargos y escenarios excluyentes Park-to-Park/Terra Luna; conciliación contra total del motor y pruebas.

## Auditoría específica de Presupuesto · 15/11/2026
- **Moneda:** $18.6188 MXN por USD; se corrigió fuente y fecha, **publicación en DOF el 13/11/2026**, no «FIX del domingo 15/11». El FIX determinado el viernes 13 fue $18.5525. En el comparativo se conserva $18.6188 como referencia de conversiones anteriores, no cambio de ventanilla garantizado. Fuentes: Banxico y DOF.
- **Cotizaciones de captura (NO compras):** Volaris redondo $7,015 MXN; Rosen 5 noches US$539.94, que YA incluye impuesto US$59.99; Universal 3-Day 3-Park un parque/día US$335.99 SUBTOTAL, pendiente de impuestos definitivos. Magic Kingdom 5/12 precio `null` y estado pending; no inventar tarifa.
- **Provisiones:** MCO↔Rosen redondo US$95, Rosen↔Disney US$70, apps de respaldo tres días Universal en bolsa común US$40, comidas total US$290, imprevistos US$80. Alimentos distribuidos por fecha: 2 dic US$30, 3 dic US$55, 4 dic US$55, 5 dic US$65, 6 dic US$60, 7 dic US$25. No se presupuestó la cena del 7 en Orlando.
- **Impuesto de Universal:** Florida DOR confirma impuesto de ventas Orange County 6.5%, Universal publica la oferta **más impuestos**. Se registró US$21.84 como 6.5% matemático de US$335.99, `status=estimated`, NO tax real comprobado; revisar pantalla de total para reemplazarlo o quitarlo si se incluyó en la cifra original. No gravar de nuevo hotel ni agregar impuesto ficticio a Disney sin cotización.
- **Subtotales (con redondeo MXN por partida del motor):** vuelo $7,015 + otras partidas convertidas ≈ **$34,436.19 MXN** antes de Magic Kingdom; un cálculo USD agregado antes de redondeo daría $34,436.21, diferencia de 2 centavos que se corrigió en textos. Entrada Disney solo para rango ilustrativo US$180–240, total hipotético ≈ $37,787.57–$38,904.70; no representa cotización final.
- **Rango de planeación:** se elevó de $37–40 mil a **$39,000–$44,000 MXN** para admitir fluctuaciones y compras menores. Es un margen editorial no un precio cerrado; seguro médico, equipaje fuera de la tarifa, souvenires y pases Express son opcionales pendientes de cotizar y podrían exceder el margen.
- **Alternativas excluyentes:** Terra Luna US$1,577.46 paquete hotel+tickets, no sumar junto a Rosen+Universal Plan A; tarifa Park-to-Park US$357 «desde» + impuesto tampoco se incluye como producto comprado.
- **Integridad económica y UI:** vuelo `majorTransport` con `budgetIncludedIn:'orlando-flight'`; partidas MCO/Disney/respaldo únicas. Categorías normalizadas a `admission`, `local_transport`, `contingency`, `taxes` y `food`. `components/budget-table.js` diferencia subtotal con pendientes de un total cerrado, incluye supuestos visibles y elimina etiqueta incorrecta de vuelo no incluido para Orlando.
- **CI:** commit `ea9aa983c6e00fdb71c1f98232e369c526f90cdd` concluyó **success** en GitHub Actions, con tests Node y navegador. Incluye control de importes, seis comidas diarias, monto Disney `null`, fecha de DOF y avisos de gastos no confirmados. Primer fallo intermedio por aserción de texto literal, corregido sin alterar precios.

**Siguiente fase = auditoría global final:** cruzar Panorama, Mapa, Temporadas, Experiencias, Reservaciones, Movilidad, Hoteles, Día por día y Presupuesto; revisar consistencia de fechas, fotos y créditos, usabilidad visual escritorio/móvil, enlaces, textos genéricos y CI. No hacer merge hasta aprobación del viajero. Quedan necesariamente pendientes cotizaciones y compras finales de Magic Kingdom, vuelo/hotel/Universal y extras.
