# AI_PROCESS.md — Desafío Técnico Trycore Colombia

> Documento de proceso de desarrollo asistido por IA para la prueba técnica de **Ingeniero de Desarrollo — Earned Value Management**.

---

## Índice

1. [Herramientas de IA y stack tecnológico](#1-herramientas-de-ia-y-stack-tecnológico)
2. [Prompts enviados (orden cronológico)](#2-prompts-enviados-orden-cronológico)
3. [Cómo aprendí EVM](#3-cómo-aprendí-evm-earned-value-management)
4. [Errores resueltos y cómo los manejamos](#4-errores-resueltos-y-cómo-los-manejamos)
5. [Decisiones donde NO seguí a la IA](#5-decisiones-donde-no-seguí-a-la-ia)
6. [Verificación de los cálculos EVM](#6-verificación-de-los-cálculos-evm)
7. [Decisión de arquitectura independiente](#7-decisión-de-arquitectura-independiente)
8. [Flujo Git](#8-flujo-git)
9. [Reflexión: qué haría diferente](#9-reflexión-qué-haría-diferente)
10. [Resumen de entregables](#10-resumen-de-entregables)

---

## 1. Herramientas de IA y stack tecnológico

### Herramientas utilizadas

| Herramienta | Uso | Por qué la elegí |
|---|---|---|
| **Cursor IDE (Composer / Agent)** | Desarrollo completo: backend, frontend, pruebas, depuración | Es mi entorno diario. Lee el proyecto completo, edita archivos, ejecuta tests y mantiene contexto entre sesiones sin copiar/pegar a un chat externo. |
| **Cursor Chat (modo Agent)** | Errores puntuales, explicación de conceptos (Dialog, React Query, JWT) | Para problemas acotados — un formulario que no validaba, un `.env` en Git — el agente inspecciona el archivo exacto y propone un fix verificable. |

**No usé** ChatGPT web ni Copilot por separado. Todo el flujo quedó centralizado en Cursor.

### Stack elegido (distinto al sugerido)

El documento de Trycore sugiere Java/Spring Boot o Python/FastAPI en backend, y Angular o React en frontend.

| Capa | Tecnologías elegidas |
|---|---|
| Backend | Node.js, Express, TypeScript, Sequelize, PostgreSQL, JWT, Swagger |
| Frontend | React, TypeScript, Vite, TanStack Query, Zustand, Tailwind, shadcn/ui |
| Pruebas | Jest (backend), Vitest (frontend) |

**Razón:** Es el stack con el que tengo más experiencia. Preferí dominar herramientas conocidas antes que aprender un framework nuevo *y* una metodología desconocida (EVM) al mismo tiempo.

---

## 2. Prompts enviados (orden cronológico)

> Fuente: historial de conversaciones en Cursor (23–28 julio 2026). Texto literal, sin resumir.

### Día 1 — Backend: configuración, modelos y autenticación (23–24 jul)

| # | Prompt |
|---|---|
| 1 | `ayudame a resolver el error de que no este levantando el proyecto` |
| 2 | `revisa porque no esta tomando las variables de entorno el archivo db.ts` |
| 3 | `ya tengo definido el modelo pero no veo la tabla creada en la base datos` |
| 4 | `ayudame a resolver el error de relacion en el project.model` |
| 5 | `valida si este codigo esta correcto @activities.model.ts (40-41)` |
| 6 | `agrega en el gitignore que se ignore la carpeta postgres` |
| 7 | `ayudame a resolver el error del archivo @EarnedValue-Backend/src/middleware/create_jwt.ts` |
| 8 | `valida porque no me esta tomando el cambio de uuid en la base de datos ya que los cambie en los modelos` |
| 9 | `si quieres vuelve a recrear toda la base de datos no hay datos de pruebas por el momento` |
| 10 | `ayudame en el archivo @EarnedValue-Backend/src/middleware/validator_jwt.ts poder enviar el token como un Bearer` |
| 11 | `valdiame si estoy enviando correctamente el uuid que llega del token en el @EarnedValue-Backend/src/middleware/validator_jwt.ts` |
| 12 | `como lo puedo recibir en el controller despues de que aso or el middleware` |
| 13 | `ayudame con la parte de la eliminacion de @EarnedValue-Backend/src/router/project.router.ts necesito saber como manejar la parte de la eliminacion ten encuenta que es una eliminacion logica y solo se cambia el status y se actualuza la fecha del campo deleted_at` |

### Día 2 — Frontend: configuración base y UI (26–27 jul)

| # | Prompt |
|---|---|
| 14 | `ayudame a resolver el error de la nueva columna que se puso con el nombre id_user_update ya que no me esta dejando registrarla` |
| 15 | `ayudame a entender el error que esta saliendo cunado levandto el proyecto react` |
| 16 | `listo ya lo agregue pero salio un nuevo error` |
| 17 | `ayudame a entender porque no esta tomandola imagen en el archivo @EarnedVelue-Frontend/src/auth/layouts/AuthLayout.tsx` |
| 18 | `ayudame a enteder porque no me esta funcionando el sidebar que se esta implementando` |
| 19 | `aplica los cambios que recomiendas` |
| 20 | `ayudame a organizar el sidebar quiero que tengo las siguientes opciones para las actividades y otra para los proyectos` |
| 21 | `como me recomiendas manejar la parte de la consulta para los projectos ya que voy a usar un hook pero son varios endpoint para solo los proyectos y no quiero hacer un hook por cada uno como lo podria manejar en uno solo o que me recomiendas` |
| 22 | `ayudame a resolver el error de la feca de dateCreated` |
| 23 | `como puedo hacer que el Badge tomo el color del status que corresponde` |
| 24 | `ayudame a resolver un tema de estilo en la @EarnedVelue-Frontend/src/project/components/CustomCard.tsx ya que si llega una descripcion corta el cart se ve cortado en la parte de abajo` |
| 25 | `ayudame necesito realizar el delete del project y ya se como lo voy a hacer pero no se me ocurre como volver hacer que cargue la lista de projectos de nuevo` |
| 26 | `ya lo tome pero lo que veo es que no lo esta actualizando cuanod posteo el formulario` |
| 27 | `ayudame a entender como usar el Dialog` |

### Día 3 — Actividades, EVM y pruebas (28 jul)

| # | Prompt |
|---|---|
| 28 | `@EarnedVelue-Frontend/src/project/pages/ui/ProjectForm.tsx:46-51 ayudame a entender porque no esta navegando` |
| 29 | `@EarnedVelue-Frontend/src/project/pages/ui/ActivityForm.tsx:103-115 ayudame a resolver el error` |
| 30 | `@EarnedVelue-Frontend/src/project/pages/ui/ActivityForm.tsx:38 porque no me funciona esta logica` |
| 31 | `pero no esta funcionando` |
| 32 | `For the code present, we get this error: Type '(activityLike: Activity, id_project: string) => Promise<Activity>' is not assignable to type 'MutationFunction<Activity, Activity>'. Fix it, verify, and then give a concise explanation. @EarnedVelue-Frontend/src/project/hooks/useActivity.tsx:30-33` |
| 33 | `ayudame a resolver este error installHook.js:1 In HTML, <div> cannot be a descendant of <p>. This will cause a hydration error.` |
| 34 | `ayudame a corregir los siguientes errores no esta actualizando la informacion del formulario de actividades y las fechas las necesito en formato timestamp para poder enviar en el endpoint tambien ayudame a saber porque cuando actualiza no se refresca la vista con la nueva informacion` |
| 35 | `@EarnedVelue-Frontend/src/project/components/ActivityGrid.tsx:19-20 revisa este error` |
| 36 | `@EarnedVelue-Frontend/src/project/pages/ui/ProjectForm.tsx:186-191 ayudame a resolver este problema que quiero usar el modal de Actividades en la partede del formulario de projecto pero me esta solicitando la ctivity pero en el modal ya se realiza tambien la parte del llamado a el hook` |
| 37 | `me di cuenta que no esta tomando las validaciones el formulario de actividades` |
| 38 | `sigue sin tomar las validaciones` |
| 39 | `necesito que funciones bien porque ahora no esta registrando la descripcion` |
| 40 | `necesito sumar todo los valores de cada actividad que llega por proyecto para estos campos @activities.type.ts (10-13)` |
| 41 | `ayudame a rsolver el porque el .env se sigue subiendo` |
| 42 | `listo ahora ya instale el vitest en el proyecto de react quiero que crees las pruebas unitarias para este proyecto tienes que cubrir el 80% de cobertura` |
| 43 | `listo esta bien, ahora vamos hacer lo mismo con el otro proyecto de back pero este no esta usando vitest si no que esta usando jest` |

**Total: 43 prompts** repartidos en 3 días de desarrollo.

---

## 3. Cómo aprendí EVM (Earned Value Management)

### Punto de partida

No conocía la metodología antes de la prueba. El documento de Trycore fue mi primera fuente: fórmulas, campos de entrada (BAC, % planificado, % completado, AC) e interpretación de CPI/SPI.

### Qué le pregunté a la IA

No hice una sesión del tipo "explícame EVM desde cero". El aprendizaje fue **práctico y encadenado**:

- **Prompt 40:** `necesito sumar todo los valores de cada actividad que llega por proyecto...`
  - Conecté los datos del formulario con los indicadores del PDF.
  - La IA propuso `sumActivityMetrics` y `calculateProjectEarnedValueMetrics`.

### Validación de fórmulas

Revisé manualmente que la implementación coincidiera con la tabla del documento:

| Indicador | Fórmula (PDF) | Implementación |
|---|---|---|
| PV | % planificado × BAC | `(budgetCompletion × percentagePlanned) / 100`, suma por actividad |
| EV | % completado × BAC | `(budgetCompletion × percentageCompleted) / 100`, suma por actividad |
| CV | EV − AC | `earnedValue - actualCost` |
| SV | EV − PV | `earnedValue - plannedValue` |
| CPI | EV / AC | `actualCost > 0 ? earnedValue / actualCost : 0` |
| SPI | EV / PV | `plannedValue > 0 ? earnedValue / plannedValue : 0` |
| EAC | BAC / CPI | `costPerformanceIndex > 0 ? budgetAtCompletion / costPerformanceIndex : 0` |
| VAC | BAC − EAC | `budgetAtCompletion - estimateAtCompletion` |

### Ejemplo numérico validado a mano

> Actividad única: BAC = 1.000 · % planificado = 50% · % completado = 40% · AC = 300
>
> | Indicador | Cálculo | Resultado |
> |---|---|---|
> | PV | 1.000 × 0,50 | **500** |
> | EV | 1.000 × 0,40 | **400** |
> | CV | 400 − 300 | **100** (bajo presupuesto) |
> | SV | 400 − 500 | **−100** (atrasado) |
> | CPI | 400 / 300 | **1,33** |
> | SPI | 400 / 500 | **0,80** |
> | EAC | 1.000 / 1,33 | **≈ 750** |
> | VAC | 1.000 − 750 | **250** |

Estos valores quedaron codificados en `activity.utils.test.ts`. Si el test pasa, la implementación coincide con el cálculo manual.

### Casos borde validados

- AC = 0 → CPI = 0 (sin división por cero)
- PV = 0 → SPI = 0
- Lista vacía → todos los indicadores en 0
- Valores inválidos (`"abc"`, `null`) → tratados como 0

### Interpretación de CPI y SPI

| Índice | Valor | Significado |
|---|---|---|
| CPI > 1 | Eficiente en costos | Se avanza más valor del que cuesta |
| CPI < 1 | Sobre presupuesto | Se gasta más de lo que se avanza |
| SPI > 1 | Adelantado | Más avance del planificado |
| SPI < 1 | Atrasado | Menos avance del planificado |

Reflejado visualmente en `CustomerInfoEarned.tsx` con íconos y colores según el índice.

---

## 4. Errores resueltos y cómo los manejamos

### Backend

| Error | Causa | Solución |
|---|---|---|
| Backend no levantaba | TypeScript 7.x incompatible con `ts-node` | Downgrade a TS 5.8.3; ajuste de `nodemon.json` y `tsconfig.json` |
| Variables de entorno ignoradas | `dotenv` se cargaba **después** de importar `db.ts` | Reordenar imports en `app.ts`: primero `dotenv`, luego el resto |
| Tablas no creadas | Sequelize no sincronizaba modelos | `connection.sync({ alter: true })` en el arranque |
| UUID no actualizaba en BD | Cambio de tipo sin recrear esquema | Recrear base de datos (sin datos de prueba) |
| JWT Bearer no funcionaba | Header `Authorization` mal parseado | Extraer token después de `"Bearer "` en `validator_jwt.ts` |
| `projectList` sin filtro de usuario | Query Sequelize sin `where` correcto | Corregir filtro por `id_user` del token |
| `id_user_update` fallaba al registrar | Campo requerido no enviado desde controller | Agregar campo en DTO y controller |

### Frontend

| Error | Causa | Solución |
|---|---|---|
| Sidebar no funcionaba | Faltaba `SidebarProvider` | Agregar provider en layout |
| Imagen no cargaba | Ruta incorrecta del asset | Corregir import en `public/` |
| Badge sin color por status | Clases CSS estáticas | Mapa `status → className` dinámico |
| Lista no se refrescaba tras delete | Cache de React Query sin invalidar | `queryClient.invalidateQueries` en `onSuccess` |
| Validaciones no se mostraban | Botones sin `type="button"`; defaults en `0` pasaban validación | Campos vacíos `""`, `useFormState` para errores |
| Descripción no se registraba | `reset()` sobrescribía lo escrito; `register()` incompatible con Base UI | Quitar reset reactivo; usar `Controller` |
| Hydration error | `<div>` dentro de `<p>` en Dialog | Reorganizar markup del modal |
| `.env` en Git | Archivo trackeado antes del `.gitignore` | `git rm --cached .env` + `.env.example` |

### El bug más difícil: formulario de actividades (prompts 34–39)

Cuatro capas de problemas que parecían uno solo:

1. **Fechas como string** desde la API → calendario necesitaba `Date`. Fix: `normalizeActivity()`.
2. **Submit sin `id_activity`** → RHF solo devuelve campos registrados; endpoint recibía `undefined`. Fix: fusionar actividad completa con datos del formulario.
3. **Campos numéricos con `register()`** → Input de Base UI no enlazaba el `ref`. Fix: migrar a `Controller`.
4. **Timestamps para el backend** → se enviaban objetos `Date` en JSON. Fix: `toTimestamp()` en la action.

Cada iteración (prompts 34 → 35 → 37 → 38 → 39) atacó una capa distinta. Verifiqué manualmente en el navegador antes de continuar.

---

## 5. Decisiones donde NO seguí a la IA

### Decisión 1: Calcular EVM en el frontend

| | Detalle |
|---|---|
| **Qué propuso la IA** | `calculateProjectEarnedValueMetrics` en `activity.utils.ts`, consumido por `useProjectMetric` |
| **Qué dice la prueba** | El API debe calcular indicadores y retornar interpretación de CPI/SPI |
| **Por qué tomé otro camino** | Dashboard en tiempo real sin round-trip extra. React Query ya tenía actividades en caché; `useMemo` actualiza al instante al editar |
| **Verificación** | Tests unitarios con el ejemplo manual de la sección 3 |
| **Trade-off honesto** | El contrato del API queda incompleto. Si repitiera el ejercicio, movería el cálculo al backend |

### Decisión 2: Valores vacíos (`""`) en lugar de `0` para campos numéricos nuevos

| | Detalle |
|---|---|
| **Qué sugería la IA** | `budgetCompletion: 0`, fechas con `new Date()` en actividades nuevas |
| **Por qué lo cambié** | Con `0` como default, RHF consideraba los campos llenos y pasaban `required`/`min: 0` sin interacción del usuario |
| **Mi decisión** | `""` para actividades nuevas, `undefined` para fechas. Tipo `number \| ""` en `ActivityFormValues` |
| **Verificación** | Formulario vacío muestra errores; tests en `toActivityFormValues` confirman el comportamiento |

---

## 6. Verificación de los cálculos EVM

1. **Cálculo manual** — ejemplo de la sección 3 (BAC=1.000, 50%, 40%, AC=300).
2. **Tests unitarios** — `activity.utils.test.ts`: caso feliz, AC=0, PV=0, lista vacía, valores inválidos.
3. **Prueba cruzada en UI** — proyecto con 3 actividades; comparar PV/EV/AC con calculadora.
4. **Sentido de negocio** — CPI=0,8 y SPI=0,9 deben leerse como "sobre presupuesto" y "atrasado".

---

## 7. Decisión de arquitectura independiente

### Capas: Actions → React Query → Hooks → Componentes

Antes del prompt 21, ya tenía clara esta separación:

```
Componente (UI pura)
    ↓
Hook (useProject, useActivity, useProjectMetric)
    ↓
React Query (cache, loading, error, invalidación)
    ↓
Action (función async → Axios)
    ↓
API REST
```

**Por qué la elegí sola:**

- **Actions** — funciones puras, fáciles de testear sin montar React.
- **React Query** — todo el estado del servidor (no en Zustand).
- **Zustand** — exclusivamente auth (token, usuario, status).
- **Hooks por dominio** — `useProject` (CRUD), `useProjectMetric` (EVM).

No vino de un prompt de "diseña mi arquitectura"; la tomé de experiencia previa.

**Otra decisión independiente:** eliminación lógica en backend (`status` + `deleted_at`) en lugar de borrado físico.

---

## 8. Flujo Git

```
main (master) ← producción
develop       ← integración
feature/*     ← una rama por funcionalidad
release       ← pre-producción
```

Ramas del ejercicio:

| Rama | Funcionalidad |
|---|---|
| `feature-back-models-db` | Modelos y tablas |
| `feature-back-user-authetication` | Auth JWT |
| `feature-back-project-CRUD` | CRUD proyectos |
| `feature-back-activity-CRUD` | CRUD actividades |
| `feature-front-config-base` | Config React + dependencias |
| `feature-front-views-auth` | Login y registro |
| `feature-front-view-projects` | Vistas de proyectos |
| `feature-front-view-activities` | Vistas de actividades |
| `feature-front-view-earned-value` | EVM + pruebas + Swagger |

Cada feature se integró a `develop` mediante Pull Request en GitHub.

---

## 9. Reflexión: qué haría diferente

| # | Qué haría diferente | Estado |
|---|---|---|
| 1 | Mover el cálculo EVM al backend con interpretación CPI/SPI | Pendiente |
| 2 | Implementar OpenAPI/Swagger desde el inicio | ✅ Corregido — `/api-docs` con 13 endpoints |
| 3 | README completo con pasos Docker/PostgreSQL | ✅ Corregido — raíz + backend |
| 4 | Tests del formulario de actividades antes de debuggear en UI | Pendiente |
| 5 | No commitear `.env` nunca; usar `.env.example` desde el inicio | Lección aprendida |
| 6 | Estudiar EVM con un prompt dedicado al inicio del ejercicio | Pendiente |

---

## 10. Resumen de entregables

| Entregable | Estado |
|---|---|
| API REST (CRUD proyectos + actividades) | ✅ |
| Dashboard con indicadores EVM | ✅ (cálculo en frontend) |
| Pruebas unitarias ≥80% | ✅ Vitest 121 tests · Jest 47 tests |
| Gitflow con feature branches y PRs | ✅ |
| OpenAPI/Swagger en `/api-docs` | ✅ 13 endpoints documentados |
| README con instrucciones locales | ✅ Raíz + backend |
| AI_PROCESS.md | ✅ Este documento |

---

_Documento de entrega — Desafío técnico Trycore Colombia · Earned Value Management_
