# Producción y auditoría integral de un viaje · Atlas

## Propósito
Evitar revisiones aisladas y reconstrucciones continuas. Cada nuevo viaje se trabaja como un paquete integral, con un solo registro de pendientes y pruebas agrupadas. Este documento complementa la guía editorial, el contrato de datos y AGENTS.md.

## Antes de crear el JSON
1. Confirmar fechas, vuelo internacional y su precio, aeropuertos, restricciones, ciudades donde se pernocta, alojamientos, noches y horas reales de llegada/salida. En la interfaz y los textos editoriales, no usar «base» como sinónimo de alojamiento; conservar `bases` solo como campo técnico para compatibilidad.
2. Definir recorrido de ciudades y excursiones con tiempos puerta a puerta, conexión y equipaje. Registrar destinos opcionales por separado.
3. Crear **matriz de logística**: fecha, origen, destino, opciones A/B/C, sentidos ida/regreso independientes, horarios, operador, estación o parada exacta, transbordos y minutos, compra, validación, costo, fuente y fecha de consulta.
4. Marcar expresamente «confirmado», «referencia de otra fecha», «estimado», «pendiente» y «comprado». Nunca presentar un horario de 2026 como servicio confirmado de 2027.
5. Crear **matriz económica** desde que se conozca el vuelo: vuelo, alojamientos por noches, alimentos, transportes de cada sentido, entradas prioritarias, impuestos, tasas, extras y contingencia. Separar subtotal cotizado de presupuesto estimado global; usar EUR y conversión MXN con fuente y fecha.

## Trabajo por lotes (evitar microfases)
1. **Bloque A · Logística completa:** obtener/verificar de una vez todas las alternativas de tren, autobús, vuelo y transbordos. Los enlaces no protegidos o ajustados requieren márgenes explícitos (preferentemente >=20 minutos en cambios de tren, salvo justificación y confirmación). Registrar fuentes oficiales, fecha de referencia, estaciones exactas y opciones válidas de respaldo.
2. **Bloque B · Contenido y coherencia:** redactar los días en conjunto, comparar secuencia, duración, apertura de museos, hoteles, pausas y traslados. No introducir duplicados entre texto libre y datos estructurados.
3. **Bloque C · Presupuesto:** comparar pases contra billetes unitarios y elegir UNA modalidad contabilizada por trayecto. Si un registro es comparativo, señalar que no se suma; si se escoge el precio unitario, el presupuesto debe reflejar todo el recorrido. Los viajes redondos siempre se contabilizan en ambos sentidos; cada alternativa debe representar un costo completo o presupuestarse independientemente.
4. **Bloque D · Presentación y QA:** ejecutar en una sola pasada pruebas de JSON, sintaxis JS, referencias, opciones/tarifas, sumas, renderizado y navegación móvil/escritorio, ausencia de errores en consola, y regresión de los otros viajes. No decir «probado en navegador» si solo se verificó sintaxis o lógica aislada.

## Comparación obligatoria con los dos viajes terminados
Antes de crear un viaje, leer `docs/trip-master-standard.md` y `data/trips/_template.json`; `data/trips/italia-norte-2027.json` es el ejemplo práctico vigente, pero el proceso debe completarse sin abrirlo ni copiar datos de ningún otro viaje. Antes de entregar, comparar **las nueve secciones visibles**, sus datos y sus componentes, en escritorio y móvil cuando haya navegador disponible:

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

## Auditoría de nomenclatura de alojamientos
- [ ] Confirmar que Inicio, portada, Panorama y comparativas presentan «X noches, Y alojamientos», en singular cuando corresponda.
- [ ] Buscar en componentes las expresiones «bases para dormir», «Noches y bases» y conteos de «estancias» usados como sustituto de alojamientos; no basta con inspeccionar JSON.
- [ ] Conservar los campos técnicos `bases` y `days[].base` y comprobar que las cifras provienen del calendario y alojamientos previstos, no de valores fijos.

## Comunicación con el usuario
Informar un plan agrupado y entregar una sola auditoría con: cambios aplicados, resultados verificables, pendientes que requieren datos externos y decisión requerida. No pedir al usuario revisar pantalla por pantalla salvo anomalías realmente imposibles de probar. Evitar prometer que «todo está probado» si no se ejecutó la comprobación completa.

## Control de divisas y presentación monetaria
- [ ] Solo en viajes del formato nuevo: todo importe en moneda extranjera lleva inmediatamente la equivalencia `(... ≈ $X MXN)` en cada sección y tarjeta donde aparece, incluidos días, transportes, reservas, hoteles y gastos.
- [ ] Los tipos de cambio tienen fuente y fecha, y las conversiones usan los snapshots de cada viaje cuando estén disponibles.
- [ ] Los importes opcionales, históricos o no cotizados conservan su estado; no se duplican en presupuesto.
- [ ] Se auditan renderizado y datos para detectar monedas sin equivalencia, evitar dobles conversiones y no alterar enlaces, tiempos o números de referencia.

**Alcance de cambios:** Los viajes históricos deben permanecer intactos y solo pueden consultarse para extraer ideas; ninguna solicitud general de edición del Atlas autoriza modificar sus JSON ni la visualización heredada. Aplicar cambios de contenido exclusivamente a los viajes del formato nuevo.

## Aceptación específica del panorama en viajes nuevos
- [ ] «Tu inversión aproximada» presenta proyección global o explica inequívocamente por qué solo hay subtotal; nunca confundir solo alojamiento con costo total.
- [ ] La proyección indica rango, supuestos y partidas excluidas; las tarifas cotizadas para otro mes no se interpretan como actuales o compradas.
- [ ] Si hay `exchangeRates` y `exchangeRateSnapshot`, los tipos aplicables (JPY, EUR, USD, etc.) se ven con fecha y fuente en Panorama, sin condicionar el renderizador a dos monedas fijas.
- [ ] «Clima y luz» enfatiza fechas elegidas y resume en segundo plano otras ventanas.
- [ ] Comprobar renderizado en escritorio/móvil y que el desglose de presupuesto no cuente dos veces vuelos u otros transportes.

- [ ] «Clima y luz» muestra franja superior del MISMO color que el estado del mes de inicio en «Temporadas» y su etiqueta correspondiente (Recomendable/Aceptable/Desaconsejable/Por definir), incluso si el JSON tiene fechas solo en `days[]` y no en `start`.

- [ ] En viajes nuevos la tarjeta «Clima y luz» tiene el encabezado COMPLETO coloreado, no solo un borde; muestra la etiqueta del estado y utiliza `pending` / «Por definir» cuando aún no se conoce la fecha. Comprobar los cuatro estados y que el CSS esté limitado al formato nuevo.

## QA de cierre · viajes en planeación a alto nivel
- [ ] Mismo rango de presupuesto calculado en Inicio y Panorama; la tabla de Presupuesto identifica aparte subtotal registrado frente a proyección global sin sumar ambos.
- [ ] Para cada vuelo A/B/C/D: total = gastos terrestres aplicables + SOLO un vuelo; excluir hotel y retorno de escenario contrario, entradas opcionales y cualquier duplicación.
- [ ] Reconciliar `expenses` y presupuesto por fecha aun si `days[].spend` es `null`; no completar este campo con importes duplicados.
- [ ] Comprobar que el escenario alterno conserva el número de noches al sustituir último hotel, no sumarlo como alojamiento adicional.
- [ ] No exigir logística de detalle ni compras mientras el objetivo sea una estimación orientativa. Fotos y pruebas visuales son pendientes independientes.
