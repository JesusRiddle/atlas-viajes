# Contrato de datos para viajes del Atlas (paso 2)

## Objetivo
Un viaje puede empezar con `id` y `name` y completarse gradualmente. El JSON contiene **datos**, nunca textos de presentación que simulen datos. La interfaz resuelve los estados vacíos. Estas reglas se aplicarán en el cargador y los componentes durante los pasos 3–6; su existencia aquí no implica todavía compatibilidad total con datos parciales.

## Valores y significado
| Representación JSON | Significado | Presentación |
| --- | --- | --- |
| `null` | Dato escalar desconocido / no decidido | «Por definir» |
| `""` | Texto no capturado (tolerado como entrada) | «Por definir»; preferir `null` |
| `[]` | Colección aún sin elementos registrados | «Por definir» en la sección, no «ninguno» ni «0» |
| `{}` | Objeto estructurado sin propiedades informadas (por ejemplo, tipos de cambio) | «Por definir» para la información relevante |
| `"no_aplica"` | Se evaluó el campo y **no corresponde a este viaje** | «No aplica» |
| `0` | Cantidad o costo **conocido y realmente cero** | Mostrar cero con su unidad; nunca usar como sustituto de pendiente |
| `false` | Respuesta negativa confirmada | Mostrar el estado negativo real, no «Por definir» |
| `"pending"` | Estado de temporada pendiente de estudiar | Tarjeta morada «Por definir» |
| `"draft"` | Etapa de planificación del viaje; no equivale a campos vacíos | Mostrar contenido progresivamente |

**Importante:** `null` y `[]` no significan que algo no exista ni que sea gratis. `"no_aplica"` se reserva a atributos escalares u opciones que el modelo permita; no debe sustituir colecciones, fechas, objetos, montos ni el identificador. No mezclar estados de información con el contenido visible: «Por definir» y «No aplica» son textos de UI, no datos de negocio.

## Reglas por familia de campos
- **Identidad:** `id` (slug único, minúsculas, dígitos y guiones) y `name` (texto no vacío) obligatorios. `flag` puede ser `null`. El número y orden del viaje proceden de `modules.js`, no del JSON.
- **Fechas:** `start`, `end` y fechas individuales usan `YYYY-MM-DD` o `null`; no se crean fechas actuales ficticias. Sin ambas fechas, el rango sigue pendiente. Nunca se evalúa una fecha nula con `new Date()` para presentarla.
- **Textos:** `intro`, `climate`, `solo`, `flight`, `local`, `tag` y demás descripciones libres son `string | null`. Sin texto, mostrar marcador neutro en la sección.
- **Colecciones:** `routeCities`, `bases`, `days`, `hotels`, `stays`, `mapPoints`, `majorTransport`, `expenses`, `costs`, `reservations` y similares se inicializan como `[]`. Una colección vacía significa «sin registros todavía», no «no se visitarán ciudades».
- **Dinero:** importe pendiente = `null`, importe confirmado de cero = `0`. Un costo conocido necesita moneda. `exchangeRates: {}` indica tipos de cambio pendientes; no convertir sin cotización válida. Un subtotal acumulado de entradas conocidas puede ser cero matemático, pero debe mostrarse como pendiente si no hay partidas suficientes para afirmar un total.
- **Duraciones y cantidades:** `work: null` = días laborales por definir; `work: 0` = exactamente cero días laborales. Las noches no se presuponen a partir de bases vacías.
- **Temporadas:** deben existir 12 claves `01`…`12`; cada mes empieza con `{ "status": "pending", "description": null }`. Estados válidos: `pending`, `recommended`, `conditional`, `avoid`. `icon` es opcional, y no sustituye `status`.
- **Portadas y mapa:** `cover: null` significa imagen sin asignar, no imagen rota. `mapPoints: []` representa ubicaciones pendientes; no crear pines falsos.
- **Reserva o transporte:** colección vacía = aún no se han definido. Si no aplica una categoría a un viaje, ese estado debe documentarse explícitamente en el modelo futuro; no inferirlo de `[]`.
- **Perfil:** los atributos de `profile` pueden estar en `null`. Nunca inferir ritmo, facilidad para viajar solo ni clima de un borrador sin investigar.

## Visualización obligatoria
1. Mantener visibles todas las secciones del viaje, aunque estén pendientes.
2. Mostrar valores reales en cuanto existan, sin exigir un cambio manual de `status`.
3. No mostrar `undefined`, `NaN`, `Invalid Date`, `$0`, «0 días», «0 noches» ni «gratis» para datos aún pendientes.
4. Distinguir de forma explícita «No aplica» de «Por definir».
5. No sumar ausencias al presupuesto ni interpretar una lista vacía como presupuesto final.
6. Mantener el comportamiento de viajes completos existentes.

## Alta de un nuevo viaje
Copiar `data/trips/_template.json` a `data/trips/<id>.json`, editar inicialmente `id` y `name` y registrar `{ "id": "<id>", "file": "<id>.json", "available": true }` en `modules.js`. La plantilla **no** debe registrarse como viaje real.

## Próximos pasos técnicos
En el paso 3, normalizar y validar los datos contra este contrato antes del render; en los pasos 4–6, hacer que los componentes consuman estados seguros en lugar de valores falsos. La documentación pública de uso se consolidará en el README en el **paso 10**.
