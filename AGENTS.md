# Instrucciones del proyecto Atlas de Viajes

Antes de crear, modificar o auditar un viaje:
1. Leer `docs/trip-editorial-guide.md` para contenido y estilo de las nueve secciones.
2. Leer `docs/trip-data-contract.md` para tipos de datos y pendientes, `data/trips/_template.json` para estructura y `docs/emilia-romagna-master-standard.md` para la referencia visual.
3. Mantener reglas editoriales fuera de los JSON turísticos. No copiar reservas ni itinerarios de otros viajes al nuevo.
4. Tratar `intro` como **narrativa de ciudades, regiones y atractivos**; prohibido colocar allí instrucciones de compra, pendientes administrativos, vuelos y precios. Usar `introHighlights` para negritas selectivas de nombres presentes en el párrafo.
5. Nunca inventar horarios, costos, reservas, disponibilidad o coordenadas. Conservar `null` para información desconocida.
6. Hacer cambios en una rama, verificar pruebas y visualización. No hacer merge a `main` ni eliminar viajes existentes sin aprobación.

Si un requisito del usuario contradice una regla editorial, discutir o documentar la excepción antes de introducirla; prevalecen los datos confirmados del usuario sobre ejemplos de plantillas.

## Orden de trabajo obligatorio
Seguir **Fase 0 → Fase 1 → Fase 2 (secciones 5–13) → Fase 3** de `docs/trip-editorial-guide.md`. Antes de redactar cada sección comprobar sus dependencias y el diseño maestro de Emilia-Romagna; al terminar, ejecutar las validaciones pertinentes y corregir errores antes de avanzar. No completar primero los textos y después inventar logística para justificarlos. Respetar la concisión solicitada: información concreta, no paja.
