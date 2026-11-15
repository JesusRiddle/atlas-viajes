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
- [x] 13 / Auditoría D técnica: CI de sintaxis, JSON, 103 pruebas originales y navegador Desktop/Mobile aprobado antes de esta auditoría adicional. Las comprobaciones finales deben repetirse tras los últimos commits; revisión humana del PR aún pendiente.

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
- [x] Regresión automática por GitHub Actions ejecutada en commits previos y nuevamente solicitada tras añadir pruebas del calendario. Incluye tests de contrato de transporte y JSON; consultar estado de CI del último commit.
- [x] Smoke tests automatizados Desktop/Mobile aprobados en CI previo; ejecutar nuevamente en último commit. Fotografías existentes conservadas, sin edición de imágenes.
- [ ] Revisión manual de los presupuestos de transportes para evitar sumar alternativas comparativas.

**No hacer merge sin aprobación explícita.**

## Auditoría integral adicional · 15 noviembre 2026
- [x] Se corrigieron las fechas de las entradas en `expenses`: Duomo Milano 10/05, Museo Egizio 11/05 y Cenacolo 12/05, que no coincidían con las actividades.
- [x] Mapa recalendado: Cinque Terre viernes 14/05 antes de Portovenere sábado 15/05.
- [x] Narrativa e introducción rediseñadas para reflejar el orden real Milán → Turín → La Última Cena/Brera → Cinque Terre → Portovenere → Lucca → Florencia/Siena.
- [x] Se eliminaron referencias de servicios ferroviarios antiguos como si fueran trenes reales de mayo: fechas de los segmentos no aéreos en `null`, tarifas y operadores históricos explicitados como referencias.
- [x] Riesgos de Lucca (domingo, consigna y cambios), Malpensa (margen amplio), Siena 131R (Via Orti Oricellari) y Cúpula (463 escalones) documentados en días y movilidad.
- [x] Via dell’Amore: reserva independiente y dirección Riomaggiore→Manarola, opcional, costo 2027 pendiente y NO incluido en total.
- [x] Restaurados guías de embarque y enlaces de Maps que se habían perdido en la primera replanificación para los días 2, 4, 6, 7, 8, 9, 10 y 14.
- [x] Prueba de regresión nueva: coherencia de fechas de entradas, mapa, enlaces, horas futuras de tren no inventadas y estado de vuelo cotizado.
- [ ] Pendiente externo: tarifas reales hoteles 9–21 mayo, nuevas entradas y trenes cuando abra venta; no afirmar compras ni disponibilidad.
- [ ] Revisión humana de PR #15 y aprobación explícita del merge.
