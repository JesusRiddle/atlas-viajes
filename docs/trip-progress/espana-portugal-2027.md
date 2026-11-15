# Auditoría de revisión · España + Portugal 2027

**Viaje:** España + Portugal 2027 · 8–27 mayo, 1 viajero  
**JSON:** `data/trips/espana-portugal-2027.json`  
**Rama / PR:** `feat/espana-portugal-vuelos-mayo-2027` · https://github.com/JesusRiddle/atlas-viajes/pull/16  
**Última actualización:** 2026-11-15  
**Estado:** revisión integral de cotización y coherencia editorial; sin boletos comprados, sin merge

## Comprobaciones realizadas
- Ruta: Barcelona 4, Madrid 4, Granada 2, Sevilla 4, Lisboa 4 noches; 20 días, 18 noches de hotel, primer día en vuelo y regreso a México el 27 de mayo.
- Vuelos MEX–DFW–BCN y LIS–LHR–MEX consignados con fechas, horas locales y escalas; precio conjunto cotizado $15,812.24 MXN en Iberia (15/11/2026), **sin compra**.
- 15 mayo: se elimina San Isidro como motivación turística no elegida y se propone Prado + Retiro; fiesta local solo como condicionante de horarios/tráfico. Prado es festivo con horario habitual 10:00–19:00, sujeto a reconfirmación 2027.
- Gastos: suma de expenses = $94,812.24 MXN; presupuesto central coincide con importe de vuelos cotizados una sola vez. Rango operativo orientativo $78,312.24–$120,312.24, con vuelos europeos NO cotizados.
- Referencias de day.places y optionalPlaces completadas; no se cambian otros viajes, hoteles, fechas ni ruta.
- Riesgos: Dallas 2 h 11 min con trámites estadounidenses; Heathrow T5 1 h 15 min (puerta al menos 20 minutos antes); traslados Madrid–Granada y Sevilla–Lisboa pendientes de compra/cotización.
- Sitio público sin cambios hasta merge.

## Pendientes antes de aprobar
1. **Externo importante:** verificar condiciones exactas de equipaje con American/British y tránsito, mismo billete protegido, conexión Heathrow y alternativa si se pierde.
2. **Externo importante:** cotizar y verificar días 17 y 23 de mayo de 2027 para los vuelos internos europeos; ajustar si no hay servicios prácticos.
3. **Externo:** horarios y cupos 2027 de Alhambra, Sagrada Família, Prado en festivo, Dalí, Alcázar, Catedral, Jerónimos y Sintra; trenes y autobuses.
4. **QA:** CI de GitHub **Atlas checks aprobado** en https://github.com/JesusRiddle/atlas-viajes/actions/runs/43691286871 (regresión y pruebas de navegador Desktop/Mobile). La auditoría manual de todas las pantallas y las tarifas reales aún depende de revisión humana.
5. Revisar PR #16 antes de merge; no comprar servicios con esta documentación como confirmación de disponibilidad.

**Resultado de auditorías:** A fechas y alojamientos coherentes (condicionado a transporte europeo); B servicios en cotización parcial; C día por día y gastos revisados; D CI de navegador y regresiones aprobado (run 43691286871), pendiente inspección manual final antes del merge.
