# Instrucciones del proyecto Atlas de Viajes

Antes de crear, modificar o auditar un viaje:
0. Leer `docs/trip-production-checklist.md` y preparar una auditoría por lotes (logística, contenido, presupuesto y QA), evitando revisiones repetitivas con el usuario.
1. Leer `docs/trip-editorial-guide.md` para contenido y estilo de las nueve secciones.
2. Leer `docs/trip-data-contract.md` para tipos de datos y pendientes, `data/trips/_template.json` para estructura y `docs/trip-master-standard.md` para la composición visual independiente de cualquier viaje.
3. Mantener reglas editoriales fuera de los JSON turísticos. No copiar reservas ni itinerarios de otros viajes al nuevo.
4. Tratar `intro` como **narrativa de ciudades, regiones y atractivos**; prohibido colocar allí instrucciones de compra, pendientes administrativos, vuelos y precios. Usar `introHighlights` para negritas selectivas de nombres presentes en el párrafo.
5. Nunca inventar horarios, costos, reservas, disponibilidad o coordenadas. Conservar `null` para información desconocida.
6. Hacer cambios en una rama, verificar pruebas y visualización. No hacer merge a `main` ni eliminar viajes existentes sin aprobación.

Si un requisito del usuario contradice una regla editorial, discutir o documentar la excepción antes de introducirla; prevalecen los datos confirmados del usuario sobre ejemplos de plantillas.

## Referencias obligatorias para cada viaje nuevo
Antes de redactar o modificar un viaje nuevo, leer `docs/trip-master-standard.md` y `data/trips/_template.json`, ; `data/trips/italia-norte-2027.json` queda como ejemplo opcional de implementación, nunca como paso obligatorio. La especificación maestra, no un JSON turístico, define el diseño; ningún viaje concreto es requisito para iniciar uno nuevo. Reutilizar estructura, convenciones y componentes, **nunca** copiar automáticamente destinos, precios, reservas o fechas. Aplicar el checklist comparativo de `docs/trip-production-checklist.md`; no reintroducir bloques heredados ni omitir enlaces oficiales, Google Maps, indicadores, tipos de cambio o controles existentes.

## Orden de trabajo obligatorio
Seguir **Fase 0 → Fase 1 → Fase 2 (secciones 5–13) → Fase 3** de `docs/trip-editorial-guide.md`. Antes de redactar cada sección comprobar sus dependencias y el estándar independiente `docs/trip-master-standard.md`; al terminar, ejecutar las validaciones pertinentes y corregir errores antes de avanzar. No completar primero los textos y después inventar logística para justificarlos. Respetar la concisión solicitada: información concreta, no paja.

## Criterios de calendario y extensiones
Optimizar fechas comparando costo total, días laborales, festivos y fines de semana; aprovecharlos cuando beneficien, nunca de manera rígida. Si se agregan días, distribuirlos entre las bases donde más reduzcan traslados apresurados y mejoren visitas: no anexarlos por defecto al final. Revalidar días de apertura, reservas, hoteles, trenes, presupuesto y tests. Consultar `docs/trip-editorial-guide.md` como fuente detallada. En textos visibles usar «alojamiento(s)» para hospedaje, nunca «base(s)» como sinónimo; preservar los campos técnicos existentes. Los viajes con JSON antiguos son referencias de ideas: los nuevos se crean uno a uno desde la plantilla, sin migraciones automáticas ni alteración de los JSON heredados.
