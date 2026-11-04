# Registro de avance · Colombia 2027

**Viaje:** Colombia 2027 · Medellín y Caribe  
**JSON:** `data/trips/colombia-2027.json`  
**Rama:** `feat/colombia-2027`  
**Modalidad:** planeación detallada, tarifas aún provisionales  
**Actualización:** 2026-11-04  
**Etapa actual:** 11 (etapas 02–11 cargadas; auditorías aún en revisión)  
**Siguiente acción autónoma:** comprobar el último CI, reparar regresiones visuales, completar galería de fotografías externas y auditar transporte, hoteles, presupuestos y fuentes antes de aprobar PR.  
**Decisiones que requieren al usuario:** ninguna por ahora. No hay compras autorizadas.

## Etapas 00–13

- [x] **00 Preparación:** leídos AGENTS.md, README, contrato, estándar, checklist y guía; rama separada, JSON y registro visible en Inicio.
- [x] **01 Alcance:** 1 persona, 14–26 enero 2027, cuatro alojamientos y ruta definida.
- [x] **02 Temporadas:** doce meses completados con bandas térmicas regionales `X a Y °C`, variación de lluvias y cierres de Tayrona; fuentes climáticas indicadas. Requiere auditoría final de comparabilidad de series.
- [ ] **03 Calendario y esqueleto:** trece días y doce noches cargados, sujetos a verificación externa de accesos, horarios y operaciones para auditoría A.
- [x] **04 Mapa:** siete puntos de ruta y excursiones con coordenadas geográficas respaldadas en fuentes municipales/Mapcarta/IDEAM; validar ubicación visual.
- [ ] **05 Experiencias:** propuesta narrativa cargada para Medellín, Guatapé, Santa Marta, Minca, Taganga, Tayrona y Cartagena; falta auditoría de fechas y operadores.
- [ ] **06 Reservaciones importantes:** prioridades y políticas por confirmar capturadas, ninguna comprada.
- [ ] **07 Movilidad y conexiones:** opciones de vuelos candidatos y tramos terrestres narrados; falta verificar `AtlasTransportModel.validateTrip`, render y opciones de transporte terrestre con horarios reales.
- [ ] **08 Dónde dormirás:** cuatro hoteles candidatos con zonas, fechas, requisitos y rango objetivo NO cotizado; comparar alternativas, URLs oficiales, tarifas y cancelación.
- [ ] **09 Día por día:** trece jornadas con mañana, tarde, noche, transporte, consejos y gastos aún `null`; faltan enlaces detallados y presupuesto diario.
- [x] **10 Panorama:** intro e introShort, tres indicadores y `climate` de tres párrafos con datos históricos y luz aproximada; verificar DOM Desktop/Mobile.
- [x] **11 Presupuesto:** proyección orientativa central $49,647 MXN, intervalo $42,000–63,000 MXN; diez partidas de vuelos, hoteles, movilidad, comida, experiencias y seguro/imprevistos. No son cotizaciones reales. Falta cotejar visual, sensibilidad y tipo de cambio COP/MXN fechado; se conserva tarifa original en COP en el transporte.
- [ ] **12 Fotos/portada:** portada de Cartagena desde Wikimedia con autor y licencia registrada; faltan fotos para galerías y días clave, respetando enlaces externos.
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

Se comprobó la estructura y se creó el viaje primero en `modules.js`. GitHub Actions confirmó sintaxis, JSON y pruebas Node aprobadas en una ejecución; la primera ejecución de navegador encontró expectativas antiguas de cinco tarjetas, adaptadas después. El workflow `Atlas checks` de commit `2a22583875cbee2c9377dc456ef447531efc8d68` terminó SUCCESS: sintaxis JS, validación de JSON, Node y smoke tests Desktop/Mobile aprobados. Esto no sustituye la auditoría editorial completa ni la revisión humana. No marcar puertas A–D verificadas hasta auditoría completa.

**Reanudación concreta:** PR #10 (rama `feat/colombia-2027`), último workflow verde `https://github.com/JesusRiddle/atlas-viajes/actions/runs/41931782085`. Siguiente: completar imágenes externas legales y `days[].places`, ampliar movilidad terrestre con opciones estructuradas, verificar tasas COP/MXN con snapshot fechado, comprobar enlaces/hoteles y cerrar auditorías A/B/C/D. La comparativa de Inicio ahora contempla viajes nuevos con `budgetRange` aunque `budgetPreliminary` sea booleano. Sin merge.