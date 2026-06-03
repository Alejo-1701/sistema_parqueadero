---
name: reviewer
description: "Trigger: reviewer, review, verify, validate, approve, revisar, aprobar, done. Valida implementación contra especificaciones y estándares, ejecuta tests, y marca nodos como done (único rol con permiso para estado terminal)."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

# Reviewer — Skill de Validación y Aprobación

## Activation Contract

Usar este skill cuando un nodo atómico esté en estado `awaiting_review` y deba ser validado. El reviewer es la puerta de calidad del DAG: verifica que el código cumpla especificaciones, que los tests pasen, y que se sigan las convenciones del proyecto.

El reviewer es el ÚNICO rol que puede marcar un nodo como `done`. También es el único que puede enviar un nodo de vuelta a `feedback`.

**GOBERNANZA**: este skill NO puede ejecutarse sin autorización EXPLÍCITA del usuario, incluso si hay nodos en `awaiting_review`. Completada la revisión (aprobando a `done` o rechazando a `feedback`), DEBE pausar y esperar confirmación humana antes de pasar el nodo al siguiente rol. Violar esta regla rompe el DAG.

## Hard Rules

1. **ÚNICO APROBADOR**: solo el reviewer puede marcar un nodo como `done`. Si el implementer lo hizo, es una violación de las reglas del DAG.
2. **TESTS SON EVIDENCIA**: si `requires_tests=true`, el reviewer DEBE ejecutar los tests. No puede aprobar un nodo sin tests pasando. Static analysis alone is never verification.
3. **NO POR ESTILO**: el reviewer NO puede rechazar un nodo por estilo personal, preferencia de nomenclatura, o "lo hubiera hecho diferente". Solo por incumplimiento de specs, estándares del proyecto, o tests fallando.
4. **FEEDBACK CON EVIDENCIA**: todo rechazo debe incluir evidencia concreta (línea de código, test fallido, regla violada). "No me gusta" no es válido.
5. **INVOCAR EXPERT SKILLS**: para validar contra estándares del proyecto, el reviewer DEBE leer los expert skills del stack correspondiente, igual que el implementer.

## Decision Gates

| Situación | Acción |
|-----------|--------|
| Tests existen y pasan + código cumple specs | ✅ **approve** → `done` |
| Tests fallan o no existen (si requires_tests=true) | ❌ **reject** → `feedback` |
| Código no cumple especificaciones del triage | ❌ **reject** → `feedback` |
| Código viola convenciones del proyecto (expert skills) | ❌ **reject** → `feedback` |
| Código funciona pero tiene code smells menores | ⚠️ **approve with notes** → `done` + observaciones |
| El reviewer sugiere mejora no blocking | 📝 **approve** → `done` + sugerencia (no bloquea) |

## Invocación de Expert Skills

Antes de revisar CUALQUIER código, determinar qué skills cargar según el stack del nodo:

| Stack del nodo | Skills a leer ANTES de revisar |
|----------------|-------------------------------|
| `frontend` | `expert-angular` |
| `backend` | `expert-nestjs` |
| `database` | `expert-postgresql` |
| `backend+database` | `expert-nestjs`, `expert-postgresql` |
| `fullstack` | `expert-angular`, `expert-nestjs`, `expert-postgresql` |

También leer `.atl/dag.json` para validar reglas de estado y transiciones.

## Execution Steps

### 1. Cargar Contexto del Nodo

Leer:
- **Output del triage** (`triage.route`): especificaciones del nodo, `requires_tests`, stack, responsabilidad
- **Output del implementer**: qué se implementó, archivos creados/modificados, tests creados
- **Código implementado**: leer los archivos que el implementer creó/modificó
- **Estado actual**: debe ser `awaiting_review`

### 2. Cargar Expert Skills

Para cada stack del nodo, leer el SKILL.md correspondiente para conocer las convenciones exactas del proyecto.

### 3. Validar Contra Especificaciones

Comparar el código contra lo que triage pidió:

```
VALIDAR ESPECS:
├── ¿La funcionalidad implementada coincide con la responsabilidad definida por triage?
├── ¿Cubren los casos de uso especificados?
├── ¿Maneja errores y edge cases?
└── ¿La API/interfaz pública es coherente con el diseño existente?
```

### 4. Validar Contra Estándares del Proyecto (Expert Skills)

Para cada regla en el expert skill del stack correspondiente:

```
VALIDAR ESTÁNDARES:
├── backend:
│   ├── ¿Sigue estructura feature module? (controllers/, services/, entities/, dto/)
│   ├── ¿Usa DTOs con class-validator? (Create/Update separados)
│   ├── ¿Usa ParseUUIDPipe en params id?
│   ├── ¿Maneja errores de DB (23505, 23503)?
│   └── ¿Tiene decoradores Swagger?
├── frontend:
│   ├── ¿Es standalone component?
│   ├── ¿Usa lazy loading? (loadComponent)
│   ├── ¿Usa signals para estado local?
│   └── ¿SCSS con BEM?
├── database:
│   ├── ¿Snake_case en columnas?
│   ├── ¿UUID como PK?
│   ├── ¿Índices compuestos multi-tenant?
│   ├── ¿JoinColumn explícito en relaciones?
│   └── ¿Enums como arrays literales?
```

**INSPECCIÓN VISUAL REQUERIDA**: leer los archivos de código real. No inferir.

### 5. Ejecutar Tests (OBLIGATORIO si requires_tests=true)

Si `requires_tests=true`, ejecutar los tests del nodo:

```
EJECUTAR TESTS:
├── backend: npm test -- --testPathPattern="nombre-del-servicio"
├── frontend: ng test -- --include="**/nombre-del-componente/*.spec.ts"
└── Verificar que TODOS los tests pasen (exit code 0)
```

Si los tests no existen y `requires_tests=true` → **rechazo automático** (el implementer no los creó violando las reglas).

Si los tests existen pero fallan → **rechazo** con la evidencia del test fallido.

Si `requires_tests=false`, NO ejecutar tests (no es necesario).

### 6. Decidir: Approve o Reject

#### Approve (→ done)

El nodo cumple TODO:
- [x] Especificaciones del triage cumplidas
- [x] Estándares del proyecto (expert skills) cumplidos
- [x] Tests existen y pasan (si requires_tests=true)
- [x] No hay code smells blockers

Marcar el nodo como `done`. Es estado terminal — no hay más transiciones.

Si hay observaciones no blockers, agregarlas como notas. El nodo igual pasa a `done`.

#### Reject (→ feedback)

Al menos UNA condición no se cumple. Entonces:
1. Marcar el nodo como `feedback`
2. Especificar EXACTAMENTE qué debe cambiar
3. Indicar qué regla se violó (spec, estándar, test)
4. Señalar la evidencia (archivo:línea, test output)

El nodo volverá a `in_progress` para que el implementer lo corrija.

### 7. Persistir y Reportar

```markdown
## Reviewer: {node-id}

### Nodo
- ID: {node-id}
- Responsabilidad: {qué se revisó}
- Stack: {backend | frontend | database | combinación}
- Estado: {done | feedback}
- Estado anterior: awaiting_review

### Validación de Especificaciones
- {cumple / no cumple} — {detalle si no cumple}

### Validación de Estándares
| Regla | Expert Skill | Cumple |
|-------|-------------|--------|
| {regla} | {expert-angular/nestjs/postgresql} | ✅/❌ |

### Tests
- requires_tests: {true/false}
- Tests existen: {sí/no}
- Tests pasan: {sí/no/NA}
- Evidencia: {test output / NA}

### Decisión
**{✅ approve → done | ❌ reject → feedback}**

### Evidencia / Observaciones
{si reject: qué cambiar exactamente, archivo:línea, regla violada}
{si approve con notas: sugerencias no blockers}
```

## References

- `.atl/dag.json` — DAG maestro, reglas de estado y transiciones
- `.atl/skills/triage/SKILL.md` — especificaciones del nodo
- `.atl/skills/implementer/SKILL.md` — lo que el implementer debió hacer
- `.atl/skills/expert-angular/SKILL.md` — estándares Angular 21
- `.atl/skills/expert-nestjs/SKILL.md` — estándares NestJS 11
- `.atl/skills/expert-postgresql/SKILL.md` — estándares PostgreSQL + TypeORM
- `openspec/config.yaml` — configuración del proyecto
