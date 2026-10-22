# Migración controlada de viajes antiguos — Paso 10

## Principio
Los dieciséis viajes heredados son fuentes de consulta; sus archivos no se sobrescriben. La composición y las nueve anclas del viaje maestro Emilia-Romagna son el destino de la migración. Un viaje migrado se crea como un JSON **nuevo** y permanece oculto (`available: false`) hasta una revisión editorial y visual específica.

## Piloto verificable
- **Origen:** `data/trips/espana-portugal.json`
- **Destino independiente:** `data/trips/espana-portugal-renovado.json`
- **Estado:** borrador oculto; no duplica la opción visible.
- **Datos reutilizados sin alterar:** nombre, listado de ciudades y cinco experiencias. Estos datos siguen siendo propuestas antiguas, sujetos a revisión.
- **Datos expresamente NO copiados:** introducción editorial (contiene duración y bases de la ruta antigua), fechas, días de trabajo, noches, presupuesto, reservas, transporte, hoteles, mapa y temporada. El cargador normaliza sus ausencias como pendientes.

## Procedimiento para las siguientes migraciones
1. Elegir un viaje original y hacer inventario de sus afirmaciones vigentes, opciones y datos obsoletos.
2. Crear un JSON nuevo con un ID distinto y `name`; conservar únicamente campos corroborados o que se puedan revisar sin inducir certeza.
3. No inferir precios, duración, fechas, noches, ubicación de hoteles ni meses recomendados. Ausencia = `null` o `[]`, nunca cero.
4. Registrar el nuevo ID en `modules.js` con `available: false`.
5. Verificar normalización, las nueve anclas, ausencia de cifras ficticias y convivencia con el original.
6. Solicitar revisión editorial y visual antes de activar la versión nueva; retirar un original solo por decisión explícita.

## Restricciones
El piloto NO convierte automáticamente todos los itinerarios anteriores ni supone que sus descripciones sigan siendo correctas. Los cambios de diseño y pruebas exhaustivas en Desktop/Mobile se reservan para el paso 11. El README se revisará en el paso 12.
