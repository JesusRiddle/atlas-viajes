# Registro de avance · Orlando 2026

**Viaje:** Orlando 2026 · Disney y Universal  
**JSON:** `data/trips/orlando-2026.json`  
**Rama / PR:** `feature/orlando-2026` · https://github.com/JesusRiddle/atlas-viajes/pull/17  
**Modalidad:** Itinerario detallado  
**Última actualización:** 2026-11-15  
**Etapa actual:** 12 · mapa y fotografías principales incorporados; auditoría D pendiente de CI/navegador  
**Siguiente acción autónoma:** verificar resultado de GitHub Actions del commit 775c858b, ejecutar comprobación de navegador Desktop/Mobile y corregir fallas; después completar foto extra opcional y verificar entradas Disney/costos pendientes.

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
- [x] **02 Temporadas:** doce meses con normales climáticas generales Orlando Florida Climate Center 1991–2020; evaluaciones de demanda cualitativas.
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
- [ ] **13 Auditoría D/entrega:** PR #17 ya existe en borrador; no ejecutar merge. Node, browser y CI por confirmar.

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
