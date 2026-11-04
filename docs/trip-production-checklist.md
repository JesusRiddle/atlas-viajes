# Producción y auditoría integral de un viaje · Atlas

## Propósito
Evitar revisiones aisladas y reconstrucciones continuas. Cada nuevo viaje se trabaja como un paquete integral, con un solo registro de pendientes y pruebas agrupadas. Este documento complementa la guía editorial, el contrato de datos y AGENTS.md.

## Antes de crear el JSON

1. Recuperar decisiones ya confirmadas: destinos candidatos, duración y ventanas posibles, ritmo, restricciones, presupuesto objetivo y `travelerCount`. No exigir fechas, billetes, hoteles ni disponibilidad definitivos para empezar un viaje visible.
2. Abrir una rama y ejecutar `node scripts/new-trip.cjs <slug> "<nombre>"` para crear JSON visible (`available: true`), registro en `modules.js` y bitácora `docs/trip-progress/<slug>.md`. Verificar que ningún archivo heredado cambió.
3. Investigar **Temporadas** para los doce meses de las regiones candidatas. Con ese resultado validar fechas y ruta, noches y conexiones indispensables antes de cerrar el esqueleto de jornadas.
4. Investigar opciones de vuelos, trenes/autobuses y reservas que condicionan la ruta. Las tarifas no publicadas para el periodo objetivo se documentan como **referencias fechadas o supuestos estimados**, nunca como compras ni disponibilidad confirmada; si no hay fundamento razonable, dejar `null`.
5. Abrir y mantener un único registro de incertidumbres y evidencias de cada auditoría. La matriz logística y económica se completa progresivamente en etapas 07 y 11, respectivamente; **no exigirla completa antes de empezar**.

## Portada e introducciones
- [ ] **Subtítulo editorial obligatorio:** para cada viaje que vaya a mostrarse en la portada, completar `tag` o `heroEyebrow` con una frase turística propia del recorrido (por ejemplo, «DE TOKIO A KIOTO · ENTRE TEMPLOS Y METRÓPOLIS»). No utilizar «En planeación», cantidades de días, países o alojamientos como sustituto editorial. Revisar la vista hero y agregar una prueba de regresión para cada nuevo viaje visible.
- [ ] Redactar `intro` (70–130 palabras) para «La esencia de tu recorrido» e `introShort` (30–45 palabras) para cada nuevo viaje completo.
- [ ] Comprobar que `introShort` resume ciudades, monumentos y experiencias sin mezclar fechas, alojamientos, vuelos, precios ni logística.
- [ ] Verificar que la tarjeta de inicio renderiza `introShort` completo y la sección Panorama sigue mostrando `intro`, también en móvil.
- [ ] Al inicio ambos textos pueden permanecer `null`; la portada mostrará únicamente los campos disponibles, sin etiquetas de estado. Completarlos antes de cerrar la auditoría D.

## Puerta de control obligatoria · contratos de transporte y renderizado
- [ ] Antes de dar por terminada **Movilidad y conexiones (07)**, cada entrada de `majorTransport` debe pasar `AtlasTransportModel.validateTrip(trip)`: `options[]` no vacío; cada opción con `fares[]` no vacío, `selectedFare` existente, `journeys[].segments[]` y `selectedOption` válidos.
- [ ] Si una tarifa no está publicada, usar `{ "id": "pending", "name": "Tarifa por cotizar", "price": null }`, seleccionarla con `selectedFare: "pending"`; nunca omitir `fares`, ni poner importe `0` o inventar precio.
- [ ] Ejecutar la prueba real de **renderizado** de `AtlasMajorTransport.render(trip)` además de validar JSON y sintaxis. Un JSON parseable no garantiza que sus componentes puedan renderizarse.
- [ ] Mantener prueba de regresión para datos incompletos y confirmar que toda la pantalla sigue cargando, incluyendo Desktop/Mobile. Reparar primero el dato y reforzar el componente para degradar elegantemente ante tarifas ausentes.
- [ ] No declarar auditoría B/D aprobada si falla una prueba; documentar la línea, causa, corrección y resultado de CI.

## Checklist operativo por etapas y auditorías

**Los viajes nuevos aparecen inmediatamente en Inicio, incluso con datos mínimos.** No utilizar etiquetas «borrador», «en planeación», «preliminar» ni marcadores de progreso públicos en sus tarjetas o encabezados. El progreso y los pendientes viven exclusivamente en `docs/trip-progress/<slug>.md`; los campos desconocidos se omiten o se presentan con «Por definir» dentro de la sección correspondiente. Los viajes antiguos se reconocen por `homeGroup: "ideas"` en `modules.js`, nunca por su posición. La vista de GitHub Pages refleja esos cambios solo después del merge y despliegue de `main`; en desarrollo, la rama se visualiza localmente o en una vista previa separada.

**El orden de ejecución se basa en dependencias, no en la navegación.** La guía canónica es `docs/trip-progress-template.md`. La orden «refléjalo en el Atlas» activa etapas **00–13** sin microaprobaciones; crear `docs/trip-progress/<slug>.md` para señalar estado, evidencias y siguiente paso.

| Auditoría | Al concluir | Verificación |
| --- | --- | --- |
| **A · Clima y ruta** | **03** | Destinos → Temporadas (02) → fechas, `travelerCount`, ruta, noches y días |
| **B · Servicios** | **08** | Mapa (04), Experiencias (05), Reservaciones (06), Movilidad (07) y alojamientos (08) compatibles |
| **C · Dinero** | **11** | Día por día (09), Panorama (10), gastos y escenarios integrales (11) actualizados en Inicio |
| **D · Final** | **13** | Fotografías (12), portada, nueve secciones en orden visual, links, Node y navegador cuando disponible |

**Temporadas no depende de hoteles/vuelos:** investigar los doce meses para todas las regiones candidatas antes de comprometer las fechas. **Presupuesto sí depende de servicios:** no considerarlo completo antes de proponer/estimar vuelos, transporte, alojamiento, visitas, entradas, comidas y extras. No confundir un subtotal con la proyección completa. Las imágenes se abordan al final, tras tener lugares y días definidos. Si una conexión o reserva invalida la ruta, retroceder a 03 y revalidar.

Al terminar cada etapa registrar **verificado/en curso/pendiente/bloqueado** con evidencia. Diferenciar supuestos con fuente/fecha de cotizaciones y reservas reales, especialmente cuando el usuario solo necesita una planeación orientativa. No pedir autorización por bloque; solo para decisiones materiales, compras y merge. No prometer trabajo en segundo plano.

## Trabajo agrupado dentro de las etapas (evitar microfases)
1. **Lote de logística (etapas 03/07):** obtener/verificar de una vez todas las alternativas de tren, autobús, vuelo y transbordos. Los enlaces no protegidos o ajustados requieren márgenes explícitos (preferentemente >=20 minutos en cambios de tren, salvo justificación y confirmación). Registrar fuentes oficiales, fecha de referencia, estaciones exactas y opciones válidas de respaldo.
2. **Lote editorial (etapas 05/09/10):** redactar los días en conjunto, comparar secuencia, duración, apertura de museos, hoteles, pausas y traslados. No introducir duplicados entre texto libre y datos estructurados.
3. **Lote de presupuesto (etapa 11):** comparar pases contra billetes unitarios y elegir UNA modalidad contabilizada por trayecto. Si un registro es comparativo, señalar que no se suma; si se escoge el precio unitario, el presupuesto debe reflejar todo el recorrido. Los viajes redondos siempre se contabilizan en ambos sentidos; cada alternativa debe representar un costo completo o presupuestarse independientemente.
4. **Lote de presentación y QA (etapas 12/13):** ejecutar en una sola pasada pruebas de JSON, sintaxis JS, referencias, opciones/tarifas, sumas, renderizado y navegación móvil/escritorio, ausencia de errores en consola, y regresión de los otros viajes. No decir «probado en navegador» si solo se verificó sintaxis o lógica aislada.

## Verificación independiente contra el estándar maestro
Antes de crear un viaje, leer `docs/trip-master-standard.md` y `data/trips/_template.json`; cualquier viaje terminado puede servir como **ejemplo opcional** de inspección, nunca como dependencia ni fuente de datos. Antes de entregar, verificar **las nueve secciones visibles**, sus datos y sus componentes, en escritorio y móvil cuando haya navegador disponible:

1. **Panorama:** introducción turística, indicadores prácticos, alojamientos y noches, inversión aproximada, divisas y tipo de cambio con fecha, clima y luz; sin tarjetas heredadas duplicadas.
2. **Mapa:** localidades reales, pines válidos, correspondencia con el recorrido y comportamiento interactivo.
3. **Temporadas:** doce meses, estados, temperaturas y recomendaciones consistentes con fechas.
4. **Experiencias:** distribución editorial maestra, lugares y gastronomía local pertinentes, sin relleno.
5. **Reservaciones:** título **«Reservaciones importantes»**, grupos de prioridad, enlaces oficiales, fechas y estados no confundidos con compras.
6. **Traslados:** vuelos/trenes/autobuses y alternativas, ambos sentidos, estaciones/paradas con Google Maps, horarios, políticas de billetes y tarifas sin duplicación.
7. **Dónde dormir:** hoteles, fechas, noches, información de tarifas con estado correcto; **URL de reserva oficial** y `mapsUrl` de **Google Maps** para cada alojamiento, sin reutilizar precios de otras fechas como cotización actual.
8. **Día por día:** catorce días no es un mínimo universal; comprobar el número real de días, secuencia, transporte, hotel correspondiente, fotos y navegación/colapsables.
9. **Presupuesto:** todas las partidas pertinentes, estimaciones frente a cotizaciones, conversiones EUR/USD/MXN, sumas y cambios al seleccionar opciones.

Validar además encabezado, navegación entre nueve anclas, enlaces, responsive, regresiones de los otros viajes y `node --test`. No cambiar los componentes compartidos ni dar por concluida la validación de navegador sin ejecutarla; documentar lo no comprobable. Esta comparación se hace **autónomamente**, antes de pedir revisiones al usuario, sin exigir que repita decisiones editoriales ya registradas.

## Criterios obligatorios para cerrar
- Todos los días coherentes con vuelos, horarios, transporte, reserva y hospedaje.
- Cada transporte con estación/parada, enlace Maps, instrucciones de compra y validación, fechas de referencia y precio por sentido.
- Alternativas A/B/C separadas de ida/regreso cuando las tarifas difieren. Comprobar TODAS las combinaciones viables.
- No duplicar transporte cubierto por pases ni confundir precios ilustrativos con gastos incluidos.
- «Tu inversión aproximada» muestra cifra tan pronto como hay estimaciones suficientes; indica expresamente cobertura y partidas pendientes. Nunca llamar total cerrado a una estimación parcial.
- Todos los pendientes bloqueantes quedan en un único registro, con acción futura y condición de desbloqueo (p. ej. «al publicarse horarios 2027»).
- Correr `node --test tests/*.test.cjs` y pruebas de navegador en el entorno adecuado. Si no se pueden ejecutar, declarar exactamente qué faltó, sin sustituirlas por afirmaciones de certeza.
- Mantener una sola rama/PR hasta aprobación. Revisar tres veces *cambios de JS* con especial atención a comillas, expresiones y concatenaciones. Validar sintaxis antes del commit, luego comprobar regresiones.

## Lecciones aplicadas: Italia norte 2027
- Torino: ida y vuelta como transportes independientes; no precio de solo ida etiquetado como viaje redondo.
- Cinque Terre: seis tramos y vuelta opcional, pases vs billetes; no sumar dos veces las tarifas comparativas; indicar que los retornos alternativos son excluyentes.
- La Spezia → Lucca: opción A de referencia con 6 min y servicio extraordinario 2026; **PENDIENTE** encontrar conexión de >=20 min cuando se publiquen horarios del 11/04/2027.
- Firenze → Milano → Malpensa: distinguir márgenes de transbordo de llegada previa al vuelo y ausencia de protección por billetes separados.
- Un error de sintaxis en day-transport.js bloqueó la carga de todos los viajes; cada modificación JS requiere validación previa y prueba real de carga cuando sea posible.

## Auditoría de enchufes y adaptadores
- [ ] Comparar los conectores de todos los países del viaje con los mexicanos tipo A/B; indicar expresamente cuándo NO se necesita adaptador.
- [ ] Si se requiere, especificar entrada mexicana y salida de destino para comprar el adaptador correcto, contemplando conexión a tierra.
- [ ] Indicar voltaje y frecuencia; comprobar que los cargadores aceptan el rango local. Aclarar que un adaptador físico no convierte voltaje.
- [ ] Rechazar recomendaciones vagas como «llevar adaptador si corresponde» y verificar el texto visible de `practicalIndicators.entry`.

## Auditoría del indicador «Idioma y moneda»
- [ ] Para viajes nuevos, confirmar que `practicalIndicators.language.badge` indica idioma local y código ISO 4217 de moneda («Japonés · JPY»), no valoraciones como «Fácil de organizar».
- [ ] Confirmar que `practicalIndicators.language.text` incluye utilidad del inglés y consejos pertinentes de efectivo, tarjetas y conversión a MXN; revisar contenido en la interfaz.

## Auditoría de nomenclatura de alojamientos
- [ ] Confirmar que Inicio, portada, Panorama y comparativas presentan «X noches, Y alojamientos», en singular cuando corresponda.
- [ ] Buscar en componentes las expresiones «bases para dormir», «Noches y bases» y conteos de «estancias» usados como sustituto de alojamientos; no basta con inspeccionar JSON.
- [ ] Conservar los campos técnicos `bases` y `days[].base` y comprobar que las cifras provienen del calendario y alojamientos previstos, no de valores fijos.

## Comunicación con el usuario
Informar un plan agrupado y entregar una sola auditoría con: cambios aplicados, resultados verificables, pendientes que requieren datos externos y decisión requerida. No pedir al usuario revisar pantalla por pantalla salvo anomalías realmente imposibles de probar. Evitar prometer que «todo está probado» si no se ejecutó la comprobación completa.

## Puerta de control · vuelos con escala y precios variables
- [ ] La ficha de un vuelo con escala muestra cada segmento y el aeropuerto de conexión, **nunca una sola línea origen–destino que simule vuelo directo**. Si faltan horas internas, mantener `null`; verificar continuidad de estaciones/aeropuertos, duración no negativa y renderizado en navegador.
- [ ] SBB: los mínimos «desde CHF X» no sustituyen tarifas del día reservado. Comparar por fecha, clase, viajero y descuento: Point-to-Point flexible, Supersaver y Saver Day Pass (sujeto a área de validez y cupo), con y sin Swiss Half Fare Card.
- [ ] Al presupuestar dos pases, mostrar cuánto queda del fondo para los trayectos no incluidos; advertir si la provisión es insuficiente, sin cambiar el monto a una cotización ficticia.

## Tarifas oficiales con vigencia futura · control de edición
- [ ] Verificar **fecha de entrada en vigor** de cada tarifario, no solo su precio o la fecha de consulta. Si un organismo publica precios actuales en HTML y una tabla PDF diferente que rige durante el viaje, usar la **edición válida para el día exacto** y enlazar la tabla.
- [ ] Para zonas tarifarias, comprobar ruta, zona de origen/destino y reglas especiales de conteo (ej. Zürich 110 cuenta doble) antes de asignar tarifas o comparar billetes sencillos frente a pases de 24 horas.
- [ ] Si una tarifa oficial 2027 ya está publicada, documentarla con su importe, descuento y fuente; si el carrito no devuelve tarifa para un trayecto distinto, dejarlo pendiente. Los mínimos «desde» no sustituyen precios particulares.
- [ ] Asignar las fichas informativas nuevas a `budgetIncludedIn` cuando su costo ya está previsto dentro de un fondo global y verificar que el total no aumente dos veces.

## Control cruzado de pases, tarifas y renderizado
- [ ] Para cada precio verificar **qué producto** compra: tren simple, retorno, pase regional, paquete de invierno con equipo, suplemento de montaña, asiento opcional; tarifas de productos distintos no se sustituyen.
- [ ] La sección Movilidad presenta en el DOM la comparación `railSummary` cuando exista; inspeccionar el texto después de abrir el desplegable de comparación en Desktop/Mobile, no basta comprobar que existe el JSON o el elemento cerrado.
- [ ] Billetes ferroviarios con fecha futura no consultada conservan `price: null`; las tarifas antiguas son referencias fechadas y los puntos de equilibrio son escenarios matemáticos, nunca cotizaciones.
- [ ] Comprobar que `budgetNote`, `expenses` y fuentes oficiales concuerdan; mostrar el riesgo de insuficiencia del fondo ferroviario sin inflar pagos confirmados ni duplicar pases.

## Control de divisas y presentación monetaria
- [ ] Solo en viajes del formato nuevo: todo importe en moneda extranjera lleva inmediatamente la equivalencia `(... ≈ $X MXN)` en cada sección y tarjeta donde aparece, incluidos días, transportes, reservas, hoteles y gastos.
- [ ] Los tipos de cambio tienen fuente y fecha, y las conversiones usan los snapshots de cada viaje cuando estén disponibles.
- [ ] Los importes opcionales, históricos o no cotizados conservan su estado; no se duplican en presupuesto.
- [ ] Se auditan renderizado y datos para detectar monedas sin equivalencia, evitar dobles conversiones y no alterar enlaces, tiempos o números de referencia.

**Alcance de cambios:** Los viajes históricos deben permanecer intactos y solo pueden consultarse para extraer ideas; ninguna solicitud general de edición del Atlas autoriza modificar sus JSON ni la visualización heredada. Aplicar cambios de contenido exclusivamente a los viajes del formato nuevo.

## Puerta de control · arquitectura del Panorama (etapas 10, C y D)
- [ ] En **cada viaje nuevo**, `practicalIndicators` contiene **exactamente tres IDs** en orden `style`, `language`, `entry`, con títulos exactos «Estilo de viaje», «Idioma y moneda», «Documentación y consejos prácticos». Rechazar indicadores `weather` o `climate`; la electricidad es parte de consejos prácticos, no el nombre de la tarjeta.
- [ ] `climate` es un campo separado y contiene **tres párrafos** (clima con temperaturas de referencia y riesgos, `*Qué llevar:*` y `*Horas de luz:*` con amanecer/atardecer locales y uso del día). Distinguir promedios de pronósticos y evitar información incompleta.
- [ ] En **Desktop**, comprobar DOM y geometría: tres `.practical-indicator` en `.overview-intro` izquierda; `.overview-side` derecha contiene `.budget-teaser` y **exactamente una** `.overview-climate-card`. En **Mobile**, comprobar la misma pertenencia aunque la disposición se apile. No basta comparar títulos visualmente ni verificar nueve anclas.
- [ ] Contrastar esquema y contenido del Panorama nuevo contra `docs/trip-editorial-guide.md` y un viaje nuevo ya validado, por ejemplo España–Portugal 2027 **solo como control editorial de composición**, nunca para copiar itinerario, temperaturas ni precios.
- [ ] Las fuentes de divisas se obtienen dinámicamente para **cualquier moneda declarada** (`CHF`, `ARS`, `JPY`, `EUR`, etc.), no con lista limitada a EUR/USD/JPY; probar enlaces en Panorama.
- [ ] Un fallo de ubicación, nombre o detalle del clima bloquea auditorías C/D, aunque las pruebas generales de JavaScript y JSON pasen.

## Aceptación específica del panorama en viajes nuevos
- [ ] «Tu inversión aproximada» presenta proyección global o explica inequívocamente por qué solo hay subtotal; nunca confundir solo alojamiento con costo total.
- [ ] La proyección indica rango, supuestos y partidas excluidas; las tarifas cotizadas para otro mes no se interpretan como actuales o compradas.
- [ ] Si hay `exchangeRates` y `exchangeRateSnapshot`, los tipos aplicables (JPY, EUR, USD, etc.) se ven con fecha y fuente en Panorama, sin condicionar el renderizador a dos monedas fijas.
- [ ] «Clima y luz» enfatiza fechas elegidas y resume en segundo plano otras ventanas.
- [ ] Comprobar renderizado en escritorio/móvil y que el desglose de presupuesto no cuente dos veces vuelos u otros transportes.

- [ ] «Clima y luz» muestra franja superior del MISMO color que el estado del mes de inicio en «Temporadas» y su etiqueta correspondiente (Recomendable/Aceptable/Desaconsejable/Por definir), incluso si el JSON tiene fechas solo en `days[]` y no en `start`.

- [ ] En viajes nuevos la tarjeta «Clima y luz» tiene el encabezado COMPLETO coloreado, no solo un borde; muestra la etiqueta del estado y utiliza `pending` / «Por definir» cuando aún no se conoce la fecha. Comprobar los cuatro estados y que el CSS esté limitado al formato nuevo.

## Integridad visible del presupuesto
- [ ] Para cada `expenses[].category` con costo estimado o cotizado, verificar que exista renglón visible en «Lo que cuesta el viaje» y que el total coincida; **no basta con que la partida sume internamente**. En particular, `transport` es provisión global pendiente de separar entre interurbano y urbano, no una categoría que se oculte.
- [ ] Mostrar supuestos y sensibilidad del rango cuando haya gastos esenciales sin cotización. Probar el desglose en Desktop/Mobile, incluyendo el importe de movilidad, y distinguir meta presupuestaria de tarifa reservable.

## Comprobación de personas presupuestadas
- [ ] Viajes nuevos: `travelerCount` declarado como entero positivo o `null` si está por definir.
- [ ] Inicio y tabla comparativa muestran «Personas» usando el dato real; nunca inferir 1 desde `profile.solo` ni presentar `false`.
- [ ] Importes originales siguen siendo del grupo; desglose y proyección por persona solo cuando existe `travelerCount`, sin multiplicaciones ni duplicaciones.

## QA de cierre · viajes en planeación a alto nivel
- [ ] Mismo rango de presupuesto calculado en Inicio y Panorama; la tabla de Presupuesto identifica aparte subtotal registrado frente a proyección global sin sumar ambos.
- [ ] Para cada vuelo A/B/C/D: total = gastos terrestres aplicables + SOLO un vuelo; excluir hotel y retorno de escenario contrario, entradas opcionales y cualquier duplicación.
- [ ] Reconciliar `expenses` y presupuesto por fecha aun si `days[].spend` es `null`; no completar este campo con importes duplicados.
- [ ] Comprobar que el escenario alterno conserva el número de noches al sustituir último hotel, no sumarlo como alojamiento adicional.
- [ ] No exigir logística de detalle ni compras mientras el objetivo sea una estimación orientativa. Fotos y pruebas visuales son pendientes independientes.
