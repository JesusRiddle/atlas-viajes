# Italia 2027 · Registro de actualización mayo

**JSON:** `data/trips/italia-norte-2027.json`  
**Rama:** `feat/italia-mayo-2027`  
**Última actualización:** 2026-11-15  
**Alcance:** ajuste de fechas 8–21 mayo 2027, 12 noches, tres alojamientos, sin compras ni merge.

## Estado de revisión por etapas
- [x] 00–03: reglas del proyecto revisadas; ruta, noches, fechas y días de semana reorganizados.
- [x] 04–06: mapa geográfico preservado; experiencias y entradas críticas recalendadas; reservas no confirmadas indicadas.
- [x] 07–08: rutas y referencias de transporte y alojamientos actualizadas; horarios de mayo aún sin confirmar, suprimidas salidas estructuradas obsoletas.
- [x] 09–11: 14 jornadas redactadas; narrativa, clima y gastos centrales actualizados.
- [x] 12: imágenes existentes preservadas, sin añadir archivos.
- [ ] 13 / Auditoría D: pendiente CI y revisión visual Desktop/Mobile sobre vista previa de rama antes de merge.

## Reglas y decisiones
- Vuelos AM76 8/05 22:25 MEX–MXP 9/05 18:20 y AM77 21/05 23:05 MXP–MEX 22/05 04:00; tarifa Clásica **$20,113.46 MXN cotizada, no comprada**.
- Alojamientos candidatos: Milano Aosta 9–13, Casa Danè 13–16, Mia Cara 16–21 mayo; **no reservados**.
- 10/05 Duomo y exteriores; 11/05 Torino/Museo Egizio; 12/05 Cenacolo/Brera.
- 14/05 Cinque Terre; 15/05 Portovenere; invertir solo por clima.
- 18/05 Accademia/Cúpula/Museo dell'Opera; 19/05 Uffizi/Corridoio/Santa Croce; 20/05 Bargello/San Miniato/Piazzale.
- La Cúpula tiene 463 escalones sin elevador; revisar viabilidad física. Confirmar elevador en Casa Danè y consigna dominical en Lucca.
- Tren Firenze → Milano el 21/05 con salida objetivo 12:30–13:30 para larga holgura hasta vuelo internacional.

## Presupuesto y evidencia
- Presupuesto anterior reconstruido: **≈$68,546 MXN** (estimación).
- Presupuesto mayo central: **≈$81,046 MXN** según partidas y transportes de referencia del JSON; no representa reserva ni tarifa garantizada.
- Tipo de cambio: snapshot del Atlas 28/10/2026, **€1 = $20.7416 MXN**. Recalcular cuando se confirme el tipo de cambio.
- Hoteles objetivo: Milano $12,000; La Spezia $7,500; Firenze $14,500. Impuestos/entradas/transporte siguen basados en referencias, no comprobación de disponibilidad exacta.
- Ventas Cenacolo mayo–julio 2027 previstas para marzo de 2027 (apertura específica pendiente).
- Revisar disponibilidad real de hoteles, entradas, frecuencias de tren, Via dell'Amore, 131R y condiciones operativas antes de comprar.

## QA pendiente
- [x] Comprobación de estructura JSON mediante parseo y fechas del 8 al 21 mayo.
- [x] Identificador `italia-norte-2027` preservado y 14 jornadas consecutivas.
- [x] Detección de referencias explícitas a las antiguas fechas ISO de abril 2027.
- [ ] `node --test tests/*.test.cjs` y pruebas de renderizado `AtlasTransportModel.validateTrip` / `AtlasMajorTransport.render`, al disponer de ejecución del código del repositorio.
- [ ] Inspección Desktop/Mobile y revisión de imágenes y enlaces.
- [ ] Revisión manual de los presupuestos de transportes para evitar sumar alternativas comparativas.

**No hacer merge sin aprobación explícita.**
