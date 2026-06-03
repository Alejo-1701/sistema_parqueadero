---
name: triage
description: "Trigger: triage, issue, feature request, bug report, analyze, route, priorizar. Evalúa requests entrantes y determina curso de acción descomponiendo el trabajo en nodos atómicos según el DAG del proyecto."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

# Triage — Skill de Análisis y Ruteo

## Activation Contract

Usar este skill cuando llegue un request externo (issue, feature request, bug report, consulta) y se necesite determinar **qué hacer con él**. No es para trabajo interno ya planificado — eso va directo a implementer.

**GOBERNANZA**: este skill NO puede ejecutarse ni pasar sus resultados al implementer sin autorización EXPLÍCITA del usuario. Completado el análisis y ruteo, DEBE pausar y esperar confirmación humana antes de que el flujo continúe. Violar esta regla rompe el DAG.

## Hard Rules

1. **ATOMICIDAD ES REGLAMENTARIA**: todo nodo compuesto (`atomic: false`) DEBE descomponerse hasta que todos los sub-nodos sean `atomic: true`. Un nodo compuesto NO puede pasar a `implementer`.
2. **UN NODO ATÓMICO** = una responsabilidad + ejecutable independientemente + verificable en aislamiento.
3. **SIN ADIVINANZAS**: todo análisis DEBE basarse en lectura de código real, no suposiciones.
4. **SALIDA ESTRUCTURADA**: el triage SIEMPRE termina con una resolución de ruteo clara.
5. **CONSULTAR EL DAG**: antes de rutear, leer `.atl/dag.json` para validar la estructura de nodos.
6. **REQUIRES_TESTS ES OBLIGATORIO**: cada nodo atómico DEBE tener el flag `requires_tests` definido por triage. El implementer no decide esto. Si triage no lo define, el nodo no puede pasar a implementer.

## Decision Gates

| Situación | Acción |
|-----------|--------|
| Request claro, 1 módulo, 1 capa | Nodo atómico directo → ruteo a implementer |
| Request multi-módulo o multi-capa | Descomponer en sub-nodos atómicos por módulo/capa |
| Request vago o incompleto | Crear nodo de exploración previa → ruteo a explore |
| Request fuera del alcance del proyecto | Rechazar con justificación técnica |
| Request repetido o ya resuelto | Derivar a documentación existente |
| **Capa backend** (nuevo endpoint, lógica de negocio, entidad) | `requires_tests: true` — debe tener test del servicio/controlador |
| **Capa frontend** (nuevo componente, servicio, pipe) | `requires_tests: true` — debe tener test del componente/servicio |
| **Base de datos** (nueva migración, entidad, índice) | `requires_tests: false` — se valida con migraciones |
| **Refactor sin cambio de comportamiento** | `requires_tests: false` — los tests existentes cubren |
| **Bug fix** | `requires_tests: true` — debe tener test que reproduzca el bug |
| **Configuración/infra** | `requires_tests: false` |

## Execution Steps

### 1. Cargar Contexto

- Leer `openspec/config.yaml` — proyecto, stack, estado de SDD
- Leer `.atl/dag.json` — estructura de nodos y reglas de atomicidad
- Buscar en Engram contexto del proyecto: `mem_search(query: "sistema_parqueadero", scope: "project")`

### 2. Understand — Entender el Pedido

Extraer del request:
- **Qué**: ¿qué pide exactamente? (feature, bug, refactor, consulta)
- **Por qué**: ¿qué problema resuelve?
- **Para quién**: ¿residente, administrador, visitante, sistema?
- **Urgencia**: ¿es blocker, prioritario, nice-to-have, diferible?

Si el request no responde estas preguntas → devolver al emisor con las preguntas específicas.

### 3. Analyze — Analizar Impacto

Leer código real para determinar alcance:

```
ANALYZAR:
├── Buscar funcionalidad existente relacionada (grep por términos clave)
├── Identificar módulos afectados (backend: src/**/*, frontend: src/**/*)
├── Revisar tests existentes
├── Identificar dependencias entre módulos
├── Determinar si el cambio requiere tests (nueva funcionalidad, bug fix → sí; refactor, config → no)
└── Estimar: archivos a tocar, módulos nuevos, riesgo de breaking changes
```

**Determinación de `requires_tests`**: por cada sub-nodo atómico, evaluar:
- ¿Introduce nueva lógica de negocio? → `true`
- ¿Corrige un bug? → `true`
- ¿Es refactor que no cambia comportamiento? → `false`
- ¿Es configuración/migración? → `false`

Si afecta MÚLTIPLES módulos o capas → descomponer en sub-nodos atómicos:

```json
{
  "padre": "triage.analyze",
  "atomic": false,
  "subnodes": [
    { "id": "analyze.backend.vehicles", "atomic": true, "modules": ["vehicles", "parking"] },
    { "id": "analyze.frontend.vehicles", "atomic": true, "components": ["vehicle-list", "vehicle-form"] }
  ]
}
```

Cada sub-nodo atómico debe tener su propio análisis de impacto independiente.

### 4. Route — Resolver y Recomendar

Determinar la acción basada en el análisis:

| Resolución | Descripción | Próximo nodo DAG |
|------------|-------------|------------------|
| `implement` | Request claro, analizado, nodos atómicos definidos | `implementer` |
| `explore` | Necesita más investigación antes de decidir | `explore` (pre-request) |
| `defer` | Válido pero no prioritario ahora | backlog |
| `reject` | Fuera de alcance o inviable | — |

### 5. Marcar requires_tests en cada nodo atómico

Antes de persistir, cada nodo atómico en la tabla de salida DEBE incluir `requires_tests: true/false`. Esta decisión es responsabilidad EXCLUSIVA del triage — el implementer la recibe como instrucción.

### 6. Persistir y Reportar

- Guardar en Engram: `mem_save(topic_key: "sistema_parqueadero/triage/{issue-id}", type: "decision")`
- Reportar al orquestador con el formato abajo.

## Output Contract

Siempre retornar esta estructura:

```markdown
## Triage: {issue-title}

### Request
{qué pidió el usuario}

### Análisis de Impacto
- Módulos afectados: {lista}
- Archivos estimados: {N}
- Riesgo: {bajo/medio/alto}
- Descomposición atómica: {sí/no — si no, por qué}

### Nodos Atómicos Resultantes
| ID | Responsabilidad | Archivos | Stack | requires_tests | Estado | dependencies |
|----|----------------|----------|-------|----------------|--------|-------------|
| {id} | {qué hace} | {path} | {backend/frontend/db} | {true/false} | pending | {ids} |

### Resolución
**{implement | explore | defer | reject}**

### Próximo paso recomendado
{qué debería pasar después}
```

## References

- `.atl/dag.json` — DAG maestro del proyecto, nodos, reglas de atomicidad
- `openspec/config.yaml` — configuración del proyecto y estado SDD
