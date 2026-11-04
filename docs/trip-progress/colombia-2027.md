# Registro de avance · Colombia 2027

**Viaje:** Colombia 2027 · Medellín y Caribe  
**JSON:** `data/trips/colombia-2027.json`  
**Rama:** `feat/colombia-2027`  
**Modalidad:** planeación detallada, tarifas aún provisionales  
**Actualización:** 2026-11-04  
**Etapa actual:** 03 (contenido preliminar adelantado de 05–10)  
**Siguiente acción autónoma:** investigar y completar doce meses de temporadas; validar fuentes, fechas, cierres y tarifas; después auditoría A y mapa con coordenadas verificadas.  
**Decisiones que requieren al usuario:** ninguna por ahora. No hay compras autorizadas.

## Etapas 00–13

- [x] **00 Preparación:** leídos AGENTS.md, README, contrato, estándar, checklist y guía; rama separada, JSON y registro visible en Inicio.
- [x] **01 Alcance:** 1 persona, 14–26 enero 2027, cuatro alojamientos y ruta definida.
- [ ] **02 Temporadas:** doce meses inicializados como pendientes; falta climatología regional con fuentes y formato `X a Y °C`. No inventar temperaturas.
- [ ] **03 Calendario y esqueleto:** trece días y doce noches cargados, sujetos a verificación externa de accesos, horarios y operaciones para auditoría A.
- [ ] **04 Mapa:** `mapPoints` pendiente; añadir solo coordenadas verificadas y puntos acordados.
- [ ] **05 Experiencias:** propuesta narrativa cargada para Medellín, Guatapé, Santa Marta, Minca, Taganga, Tayrona y Cartagena; falta auditoría de fechas y operadores.
- [ ] **06 Reservaciones importantes:** prioridades y políticas por confirmar capturadas, ninguna comprada.
- [ ] **07 Movilidad y conexiones:** opciones de vuelos candidatos y tramos terrestres narrados; falta verificar `AtlasTransportModel.validateTrip`, render y opciones de transporte terrestre con horarios reales.
- [ ] **08 Dónde dormirás:** cuatro hoteles candidatos con zonas, fechas, requisitos y rango objetivo NO cotizado; comparar alternativas, URLs oficiales, tarifas y cancelación.
- [ ] **09 Día por día:** trece jornadas con mañana, tarde, noche, transporte, consejos y gastos aún `null`; faltan enlaces detallados y presupuesto diario.
- [ ] **10 Panorama:** intro e introShort, indicadores prácticos preliminares; `climate` pendiente de tres párrafos con datos de clima/luz verificados.
- [ ] **11 Presupuesto:** solo referencias de vuelos ($10,303 MXN + COP 217,580) y metas de alojamiento ($15,500–21,600 MXN); NO hay presupuesto integral. Falta movilidad, comida, entradas, excursiones, seguro, tipo de cambio COP/MXN fechado y gastos consolidados.
- [ ] **12 Fotos/portada:** no asignadas; aplicar política de enlaces externos sin descargas.
- [ ] **13 Auditoría D y PR:** PR de trabajo sin merge; completar prueba automática y Desktop/Mobile antes de aprobación.

## Auditorías

| Control | Estado | Pendiente |
| --- | --- | --- |
| A (etapas 01–03) | En curso | 12 meses con fuentes; revisión del calendario y Tayrona |
| B (etapas 04–08) | Pendiente | mapa, validación transporte, enlaces y hoteles |
| C (etapas 09–11) | Pendiente | clima, presupuesto integral reconciliado y gastos |
| D (etapas 12–13) | Pendiente | fotografías, portada, pruebas Node y navegador |

## Reglas y decisiones de este viaje

- Prioridad en comodidad, baño privado, cuatro alojamientos, conexiones de día donde convenga y no pagar sobreprecios por ahorros marginales.
- Copa multidestino y Avianca AV 9446 son candidatos, no reservas. No reabrir búsqueda de vuelos sin necesidad de validación de compra.
- El 20 de enero se visita Taganga/Playa Grande medio día; se excluyeron Quinta de San Pedro Alejandrino y Museo del Oro por preferencias del viajero.
- **Seguridad Taganga:** evitar sendero peatonal a Playa Grande por reportes de robos. Lancha autorizada con chaleco salvavidas, precio acordado y retorno diurno; verificar oleaje.
- **Seguridad Tayrona:** verificar estado operativo 2027, entradas, senderos y corrientes. Ecolodge con cancelación flexible.
- No asumir precios de hotel como cotizaciones; no registrar un subtotal como presupuesto integral. No comprar ni hacer merge sin autorización.
- No modificar viajes históricos ni reglas maestras por exigencias exclusivas de este viaje.

## Evidencia de este turno

Se comprobó por lectura el JSON de referencia de formato moderno, el contrato y la estructura real del repositorio. Se creó el JSON y se registró como primer viaje visible en `modules.js`. No se ejecutaron aún pruebas Node/Chromium ni inspección visual Desktop/Mobile; no aprobar auditorías ni afirmar CI verde sin evidencia.

**Reanudación concreta:** fetch de JSON y este registro en `feat/colombia-2027`; comenzar por fuente de temperaturas y luz mensual de Medellín/Santa Marta/Tayrona/Cartagena, verificar cierres oficiales de Tayrona, completar `seasonality`, validar orden diario y proceder a auditoría A.