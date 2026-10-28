# Auditoría integral de Italia Norte 2027 · 27/10/2026

## Alcance
14 días, del 3 al 16 de abril de 2027. Bases: Milano (4 noches), La Spezia (3), Firenze (5). Se revisaron referencias de transportes por jornada, fechas y días de semana, fechas de hotel, presupuesto, tickets y coherencia de reservas prioritarias.

## Presupuesto de planificación actualizado · 27/10/2026
- **MXN 68,584.53**, cifra estimada para una persona; no es cotización ni reserva. Tipo de cambio de referencia EUR 1 = MXN 20.81.
- Transporte interurbano y vuelos: MXN 21,259.13; alojamiento: MXN 25,900; alimentación: MXN 11,350; entradas y museos: MXN 4,494.96; tasas turísticas: MXN 1,394.27; transporte urbano: MXN 936.45; consigna: MXN 249.72; contingencia: MXN 3,000.
- Las entradas añadidas incluyen Cenacolo, Accademia, Brunelleschi Pass, Uffizi+Vasariano, Egizio, Duomo Milano, Brera, Duomo Siena, Santa Croce y Bargello. El acceso a Uffizi se cuenta una sola vez dentro del pase Uffizi+Vasariano; el Museo dell'Opera se cuenta dentro del Brunelleschi Pass.
- Los tres hoteles ($25,900 MXN por 12 noches) son **supuestos**, sin cotización real, tal como se decidió; se cotizarán más cerca del viaje. Los vuelos tampoco están comprados.
- Impuestos turísticos y movilidad local son provisiones, no tarifas confirmadas por establecimiento/fecha. Consigna e imprevistos también son estimaciones.
- El precio real puede subir o bajar al confirmar reservas, horarios, entradas y tipo de cambio. Evitar presentar esta cifra como total garantizado.

## Itinerario revisado
- Los 14 días consecutivos coinciden con sus fechas y días de semana: sáb 3, dom 4, lun 5, mar 6, mié 7, jue 8, vie 9, sáb 10, dom 11, lun 12, mar 13, mié 14, jue 15, vie 16.
- Noches por hotel: Milano 4 (4–8), La Spezia 3 (8–11), Firenze 5 (11–16). Total 12 noches en Italia; vuelos nocturnos en extremos.
- Torino lunes 5: Museo Egizio con franja matutina; ida/vuelta presupuestadas por separado.
- Milano 6–7: Cenacolo y Brera flexibles según disponibilidad de la reserva. Verificar actividades reservadas antes de fijar Duomo.
- Viernes 9 Portovenere y sábado 10 Cinque Terre: evaluar intercambio por mal clima antes de comprar billetes restrictivos.
- Domingo 11: La Spezia → Lucca → Firenze, con equipaje y consigna; **bloqueante** buscar conexión con >=20 minutos en Viareggio en horarios 2027; actual 6 minutos y regional extraordinario otoño 2026.
- Lunes 12: Siena por bus 131R; verificar poste temporal y horarios 2027.
- Martes 13: Accademia y cúpula con franjas espaciadas; Museo dell'Opera incluido con Brunelleschi Pass.
- Miércoles 14: Uffizi + Vasariano (Uffizi entra dos horas antes del corredor), Santa Croce solo si hay tiempo.
- Jueves 15: Bargello y San Miniato/atardecer, día flexible para absorber Santa Croce.
- Viernes 16: Firenze → Milano → MXP; tres alternativas con 35 minutos de enlace y 3 h 47 a 5 h 17 de margen antes del vuelo internacional. Billetes independientes: no protección automática.

## Validación técnica
- `AtlasTransportModel.validateTrip`: cero errores.
- `AtlasBudget.summary`: cero incidencias de cálculo para los registros presentes.
- Precio EUR/MXN, entradas y otras provisiones contabilizados una sola vez.
- Quedan por hacer pruebas reales de navegador Desktop/Mobile y regresión de otros viajes antes del merge, además de validación de horarios/tarifas 2027.

## Fuentes de precios oficiales consultadas
- Cenacolo: https://cenacolovinciano.org/en/info/
- Accademia: https://www.galleriaaccademiafirenze.it/es/visit/
- Brunelleschi Pass: https://tickets.duomo.firenze.it/en/support/prices
- Uffizi + Vasariano: https://www.uffizi.it/en/tickets

## Criterio de cierre
No presentar los MXN 60,923.09 como importe final. Cotizar todas las entradas obligatorias, agregar movilidad local y tasas, confirmar estancia y política de equipaje, y cerrar el enlace La Spezia–Lucca antes de comprar trenes. Priorizar la viabilidad de reservas del Cenacolo, Accademia, Cúpula y Corredor.
