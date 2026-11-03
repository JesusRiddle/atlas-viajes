# Registro de avance por viaje · Atlas

Copiar esta plantilla a `docs/trip-progress/<slug>.md` al comenzar una **implementación nueva**. Es un registro de ejecución, no una fuente de datos turísticos: el itinerario y precios viven en `data/trips/<slug>.json`. Mantenerla en la **misma rama/PR** del viaje; no sobrescribirla con la de otro destino.

**Viaje:** <nombre>  
**JSON:** `data/trips/<slug>.json`  
**Rama / PR:** <rama / enlace>  
**Modalidad:** [ ] Planeación general  [ ] Itinerario detallado  
**Última actualización:** <fecha>  
**Etapa actual:** <número>  
**Siguiente acción autónoma:** <acción precisa>  
**Decisión que sí requiere al usuario (si existe):** <pregunta y por qué bloquea>

## Checklist numerado de ejecución

Marcar **solo después de verificar**; nunca transformar un pendiente en éxito por haber escrito el JSON. En cada etapa anotar evidencia mínima: rutas modificadas, datos comprobados, fuente o prueba. El orden es obligatorio; permitir avanzar con datos estimados bien etiquetados cuando no bloquean el recorrido.

- [ ] **00 · Preparación.** Leer `AGENTS.md`, estándar, guía, contrato, checklist y plantilla; abrir rama, registrar JSON en `modules.js` y crear este archivo.
- [ ] **01 · Calendario y restricciones.** Fechas, vuelos de entrada/salida y alternativas, festivos, `work`, duración, `travelerCount`, ritmo, supuestos y prioridades.
- [ ] **02 · Ruta y alojamientos.** Ciudades en secuencia, excursiones y noches; `bases`, check-ins/check-outs y no retrocesos injustificados.
- [ ] **03 · Esqueleto diario.** Un registro por fecha, ciudad, actividad esencial, traslados, dependencias y reservas imprescindibles. **Auditoría A: calendario/logística.**
- [ ] **04 · Panorama.** `intro`, `introShort`, `introHighlights`, `practicalIndicators`, `climate`, perfil, moneda y requisitos.
- [ ] **05 · Mapa.** `mapPoints`, coordenadas verificadas, orden y consistencia con la ruta.
- [ ] **06 · Temporadas.** Los doce meses, clima, luz y recomendación fundamentada.
- [ ] **07 · Experiencias.** Atractivos y gastronomía por ciudad, sin repetición ni visitas imposibles. **Auditoría B: contenido/editorial (04–07).**
- [ ] **08 · Reservaciones importantes.** Prioridades, fechas, operadores oficiales, requisitos, alternativas y estado no confirmado.
- [ ] **09 · Movilidad y conexiones.** Vuelos, autobuses y trenes según corresponda, itinerarios completos y alternativas reales; `transportRefs`, costos/estados y equipaje.
- [ ] **10 · Dónde dormirás.** Alojamientos, noches, tarifa por habitación/grupo, enlaces oficiales, Maps y estados. **Auditoría C: reservas/transportes/alojamiento (08–10).**
- [ ] **11 · Día por día.** Mañana/tarde/noche, movilidad, tips, tiempos, descansos, opcionales explícitos y fotografías URL remotas verificadas cuando correspondan.
- [ ] **12 · Presupuesto.** `expenses`, `majorTransport`, `days[].spend` cuando aplique, rango y escenarios, tipo de cambio fechado, costo para `travelerCount`, exclusiones y sumas sin duplicaciones.
- [ ] **13 · Integridad general y entrega.** **Auditoría D** de las nueve secciones, portada, registro en Inicio, mapa, imágenes, enlaces, suma de noches, dinero y regresiones; pruebas Node + escritorio/móvil cuando estén disponibles, correcciones, PR y reporte de pendientes. **No hacer merge sin aprobación.**

## Puertas de control

| Control | Tras etapas | Evidencia imprescindible | Resultado |
| --- | --- | --- | --- |
| A · Ruta y calendario | 01–03 | Días, noches, viajeros, fechas, trayectos y reservas compatibles | Pendiente |
| B · Editorial y geografía | 04–07 | Panorama, mapa, temporadas y experiencias alineados | Pendiente |
| C · Servicios | 08–10 | Reservas, tramos y noches sincronizados; tarifas con estado | Pendiente |
| D · Integral | 11–13 | Nueve secciones, Inicio, costos, fotos, enlaces y CI Desktop/Mobile | Pendiente |

**Regla de avance:** una auditoría fallida obliga a reparar su bloque y los bloques dependientes **antes** de cerrar el siguiente. Si falta una tarifa de 2027 o fuente no publicada, conservar estado `estimated` / `pending`, fecha de referencia y rango; no bloquear la implementación general por una cotización futura si el usuario busca una idea orientativa. Si falta una decisión que altera la ruta, detener solo la dependencia afectada e indicar el bloqueo con alternativas.

## Evidencias y pendientes

| Etapa | Estado (pendiente/en curso/verificado/bloqueado) | Evidencia / commit / fuente | Pendiente o causa de bloqueo |
| --- | --- | --- | --- |
| 00–03 | Pendiente | — | — |
| 04–07 | Pendiente | — | — |
| 08–10 | Pendiente | — | — |
| 11–13 | Pendiente | — | — |

**Última auditoría:** <commit + pruebas realmente ejecutadas>  
**Pendientes externos no bloqueantes:** <precios futuros, horarios sin publicar, fotos inaccesibles, etc.>  
**Próxima ejecución autónoma:** <etapa y acción>

## Contrato de trabajo con el usuario

Cuando el usuario diga **«refléjalo en el Atlas»** después de definir la ruta, ejecutar consecutivamente las etapas 00–13 en la misma tarea **hasta donde permitan herramientas, límites y datos**; no pedir permiso entre secciones ni exigir respuestas «adelante». Agrupar escrituras y consultas, comprobar cada bloque y corregir fallas antes de seguir. Si no se logra terminar en esa ejecución, dejar esta bitácora actualizada con etapa exacta, pruebas y siguiente paso para que **un nuevo turno** continúe sin redescubrir el estado. No afirmar que se seguirá trabajando en segundo plano.

Mostrar al usuario un reporte compacto por hitos: **completadas / en curso / pendientes / bloqueadas, siguiente etapa y decisión requerida**; evitar narrar cada archivo. Las decisiones de ruta, gastos relevantes, compras, cambios destructivos y el merge siguen requiriendo aprobación explícita.
