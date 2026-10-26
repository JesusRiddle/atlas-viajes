# Guía editorial maestra de viajes · Atlas

## Aplicación
Esta guía regula la **redacción y curación** de viajes nuevos y sus revisiones. Complementa `docs/trip-data-contract.md` (tipos y semántica), `data/trips/_template.json` (campos) y `docs/emilia-romagna-master-standard.md` (presentación). Si hay conflicto técnico, prevalece el contrato de datos. No copiar contenido, costos, imágenes ni reservas desde el viaje maestro.

**Separación de responsabilidades:** JSON = información turística y estados verificables; guía = instrucciones para autores y agentes; código = representación. No agregar `instructions` o `aiNotes` al JSON de cada viaje ni renderizar normas editoriales al usuario.

## Convenciones universales
- Ser específico y natural, español de México, conciso y útil; nombrar atractivos en su denominación reconocible, sin prometer experiencias no verificadas.
- Respetar orden geográfico, ritmos de visita, tiempos de traslado puerta a puerta, días de cierre, fines de semana, equipaje y márgenes de contingencia. No agregar ciudades solo para aumentar el número de destinos.
- Mantener separado: **confirmado**, **cotizado con fecha**, **previsto/estimado** y **pendiente**. Una cotización nunca significa comprado. `null` para importes desconocidos, nunca cero ficticio.
- Enlaces a páginas oficiales para horarios, reservas, transporte y políticas cuando estén disponibles; revisar información sensible a fechas antes de fijar billetes.
- Resaltar nombres propios geográficos y monumentos en el texto `intro` usando el array `introHighlights` existente; no introducir HTML ni asteriscos literales como sustituto. Evitar negritas indiscriminadas. Verificar que cada elemento resaltado esté presente literalmente en `intro`, con mayúsculas y acentos correspondientes.
- Los datos incompletos no deben ocultar secciones, ni aparecer como `undefined`, `NaN`, `$0` o «gratis».
- No reemplazar el recorrido histórico de un viaje anterior sin autorización; usar branch y PR; no fusionar a `main` sin permiso.

## Las nueve secciones

### 1. Panorama del viaje (`plan`)
**Para qué:** transmitir el recorrido, su esencia y sus atractivos en lenguaje narrativo.
**Campos:** `intro`, `introHighlights`, `routeCities`, `bases`, `profile`, `climate` y resúmenes correspondientes.
**Cómo:** `intro` de ~70–130 palabras; 1 párrafo con secuencia lógica de ciudades/regiones, monumentos emblemáticos y contraste entre experiencias. Nombrar lugares reales que estén en el programa. En `introHighlights` registrar regiones, ciudades y sitios destacados citados en ese párrafo, sin incluir términos genéricos.
**Indicadores prácticos:** registrar en `practicalIndicators` cuatro objetos con IDs `solo`, `pace`, `language` y `currency`, títulos «Viajar solo», «Ritmo», «Idioma» y «Pagos y moneda». Cada `text` debe ser concreto, breve, sin repetir la narrativa turística: autonomía y precauciones; nivel de esfuerzo y cambios de base; idioma local y facilidad comunicativa; moneda, tarjetas, efectivo y conversión. Estos contenidos van debajo de la introducción, nunca dentro de `intro`. El renderizador toma los títulos y textos del JSON; no usar recomendaciones genéricas ni inventar una tarifa de cambio.\n**Clima y luz (`climate`):** redactar siguiendo el modelo editorial de Emilia-Romagna, en tres párrafos separados por línea en blanco, con etiquetas visibles `*Qué llevar:*` y `*Horas de luz:*`. Primero explicar **condiciones climatológicas para las fechas exactas** (rangos aproximados de máximas diurnas y mínimas nocturnas en °C, diferencias entre zonas y riesgos relevantes como lluvia, viento, niebla o calor). Después recomendar prendas y calzado según actividades y restricciones de equipaje. Finalmente indicar horarios aproximados de amanecer y atardecer **en horario local** y cómo aprovecharlos en exteriores/miradores o para programar museos. Usar énfasis `*texto*` compatible con el renderizador y separar las ideas claramente. Distinguir promedios históricos de pronósticos; comprobar zona horaria y horario de verano. No copiar temperaturas, ropa ni luz de otro viaje; adaptar a estación, geografía y excursiones del nuevo destino. Evitar cifras sin sustento o falsa precisión.
**No incluir en `intro`:** estado de compras, entradas nominativas pendientes, fechas límite para reservar, vuelos no comprados, precios, instrucciones al agente o frases administrativas. Esos asuntos van en reservas, traslados y costos.
**Ejemplo:** «Comienza en **Milano** con el **Duomo** y continúa hacia la costa de **Liguria**…» (la negrita visible se genera con `introHighlights`, no con Markdown incrustado).

### 2. Mapa (`mapa`)
**Campos:** `mapPoints`, `bases`, `routeCities`.
**Cómo:** puntos georreferenciados verificables, orden coherente con el recorrido; distinguir base, excursión y parada. Nombres concisos que quepan en tarjetas; nunca coordenadas inventadas. Los lugares opcionales deben identificarse.
**No incluir:** ubicaciones genéricas no visitadas ni pines ficticios para rutas por confirmar.

### 3. Temporadas (`temporadas`)
**Campos:** `seasonality.summary`, `seasonality.months`.
**Cómo:** los doce meses con estado y justificación concreta de clima, masificación, festividades y disponibilidad. Anotar incertidumbre y no inferir seguridad futura a partir de noticias de hoy.
**No incluir:** predicciones meteorológicas de fechas lejanas como hechos.

**Temperaturas obligatorias en las tarjetas:** cada `seasonality.months[MM].description` de un mes evaluado debe contener un rango numérico orientativo con el formato `6–11 °C`. El componente `components/seasonality.js` **extrae automáticamente ese rango desde `description`** y lo muestra en la cabecera de la tarjeta; no existe actualmente un campo `temperature` separado. En ausencia del patrón, la interfaz muestra `—`. Preferir rangos aproximados de máximas diurnas y aclararlo en `seasonality.summary`; si hay regiones climáticas muy diferentes, añadir esa salvedad y evitar presentar el rango como universal. Consultar fuentes climáticas fiables, no copiar valores de otro viaje y no confundir climatología con pronóstico. Si falta información, usar `pending` en lugar de inventar un número. Comprobar que las doce tarjetas muestren temperatura y no `—` antes de aprobar el viaje.\n\n**Criterio de temporada:** documentar los doce meses (`01`–`12`) con `status` (`recommended`, `conditional`, `avoid` o `pending` cuando falte investigación), `description` de una o dos frases e `icon` compatible con el renderizador si corresponde. Comparar el recorrido completo, no solo una ciudad: temperaturas y horas de luz, lluvia/viento, ocupación y precios, eventos y festivos, operativa de barcos o senderos y apertura de atracciones. El `summary` sintetiza los mejores meses y los que implican concesiones, justificando por qué. Evitar marcar todos los meses como ideales, o tomar el icono como evidencia de un pronóstico. Eventos fechados —como ferias— deben verificarse en fuente oficial y explicarse como condiciones de la ventana específica, no como una característica permanente del mes. En temporada baja, servicios reducidos no significa cierre total. Evitar porcentajes, precios o temperaturas demasiado precisos sin documentación.\n\n### 4. Experiencias (`experiencias`)
**Campos:** `experiences`.
**Cómo:** cada experiencia debe explicar por qué merece la pena; conectar ciudad y atractivo singular. Seleccionar lo más distintivo y evitar repetición literal de `intro`.
**No incluir:** frases vacías («un lugar maravilloso») ni listas indiscriminadas de atracciones.

### 5. Reservaciones (`reservas`)
**Campos:** `planningDetails`, `reservations`, `ticketNotes`, `attractionTerms`.
**Cómo:** separar obligatorias de opcionales, indicar ventana de apertura, idioma, horario, titularidad, enlaces oficiales, duración, políticas y fechas alternativas. Una visita obligatoria debe tener al menos dos posibilidades razonables si existen; no afirmar disponibilidad sin comprobación.
**No incluir:** entradas como adquiridas sin comprobante o información reservada en el párrafo `intro`.

### 6. Traslados (`traslados`)
**Campos:** `majorTransport`, `local` y referencias `days[].transportRefs` donde corresponda.
**Cómo:** origen/destino, operadores, trasbordos, estimaciones realistas puerta a puerta, equipaje, flexibilidad y enlaces. Distinguir horarios publicados para la fecha exacta de frecuencias habituales.
**No incluir:** números de tren/vuelo inventados o precios sin fecha de cotización.

### 7. Dónde dormir (`alojamientos`)
**Campos:** `hotels`, `bases`, `lodgingSummary`, `heroLodgingSummary`.
**Cómo:** cuadrar fechas y noches; priorizar zonas según estaciones y recorridos; para hoteles concretos, verificar habitación privada, baño, impuestos, cancelación, políticas y tarifa. No usar hotel como «reservado» si solo es candidato.
**No incluir:** habitaciones gratuitas o promociones supuestas.

### 8. Día por día (`dias`)
**Campos:** `days`, con `n`, `date`, `title`, `base`, `am`, `pm`, `night`, `mobility`, `note`, `headerPlaces`, `places`, `transportRefs`, `spend` según necesidad.
**Cómo:** mañana, tarde, noche y traslados coherentes; priorizar lo obligatorio, horarios de cierre, descansos, distancias, carga física, clima y contingencias. Mantener título específico y no duplicar instrucciones largas entre `intro` y notas.
**No incluir:** cinco museos en una sola jornada sin márgenes ni afirmaciones de reservas no hechas.

### 9. Presupuesto (`costes`)
**Campos:** `costs`, `expenses`, `exchangeRates`, `exchangeRateSnapshot`, `budgetPreliminary`, `knownCosts`.
**Cómo:** desglose con moneda original y MXN cuando hay conversión sustentada; mostrar rango realista y fecha de cotización. Separar precio base, impuestos, equipaje y extras. Si falta información, conservar `null`.
**No incluir:** presupuestos cerrados construidos con ceros de relleno.

## Proceso obligatorio de creación
1. Leer `AGENTS.md`, esta guía, contrato de datos, plantilla y estándar visual.
2. Crear branch desde `main`, ejecutar `node scripts/new-trip.cjs <id> "Nombre"` cuando se trabaje localmente o reproducir exactamente su alta: JSON independiente y entrada inactiva en `modules.js`. Nunca clonar el JSON antiguo.
3. Acordar prioridades, destinos, fechas, aeropuertos y noches antes de poblar detalles. Registrar los asuntos pendientes en sus campos, nunca en `intro`.
4. Redactar una narración `intro` coherente con el recorrido y su `introHighlights`; completar progresivamente las nueve secciones conforme a los datos disponibles.
5. Pasar lista de verificación: días consecutivos y fechas reales, suma de noches, cierres, conexiones, prioridad de reservas, mapa, enlaces y costos; comprobar Desktop/Mobile.
6. Ejecutar `node --test tests/*.test.cjs` y, cuando corresponda, pruebas de navegador. No afirmar pruebas no ejecutadas.
7. Publicar solo tras revisión y autorización explícita; preservar viajes existentes.

## Auditoría editorial humana
Las pruebas automáticas pueden verificar estructura y coincidencias literales de resaltados, pero **no** pueden determinar si una narración es atractiva, si un lugar merece la pena o si una conexión es segura. Revisar esos puntos manualmente antes de aprobar el PR.
