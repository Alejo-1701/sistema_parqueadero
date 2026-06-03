---
name: implementer
description: "Trigger: implement, implementer, apply, execute, codificar, crear, desarrollar, programar. Ejecuta nodos atómicos invocando expert skills, crea tests donde triage lo indique, y marca nodos como awaiting_review."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

# Implementer — Skill de Ejecución

## Activation Contract

Usar este skill cuando un nodo atómico esté en estado `pending` o `feedback` y deba ser implementado. El implementer recibe instrucciones del triage (qué hacer, en qué stack, si requiere tests) y produce código + tests.

NO es para analizar requerimientos — eso ya lo hizo triage. NO es para revisar — eso es reviewer.

**GOBERNANZA**: este skill NO puede ejecutarse ni pasar sus resultados al reviewer sin autorización EXPLÍCITA del usuario. Completada la implementación, DEBE pausar con estado `awaiting_review` y esperar confirmación humana antes de que el reviewer tome el nodo. Violar esta regla rompe el DAG.

## Hard Rules

1. **NUNCA marcar un nodo como `done`** — el estado final del implementer es SIEMPRE `awaiting_review`. El reviewer es el único que puede marcar `done`.
2. **REQUIRES_TESTS ES LEÍDO, NO DECIDIDO**: si triage marcó `requires_tests: true`, el implementer DEBE crear los tests correspondientes. Si es `false`, NO debe crearlos. No hay excepción.
3. **INVOCAR EXPERT SKILLS**: antes de escribir código en un stack, leer el skill correspondiente. No se escribe código Angular sin leer expert-angular, ni NestJS sin expert-nestjs, ni TypeORM sin expert-postgresql.
4. **CICLO DE VIDA**: el nodo comienza en `pending`, el implementer lo pasa a `in_progress`, y al terminar lo pasa a `awaiting_review`. Si viene de `feedback` (reviewer rechazó), vuelve a `in_progress`.
5. **NO SALTARSE LA TABLA DE NODOS**: el implementer ejecuta EXACTAMENTE los nodos atómicos que triage definió. No agrega ni quita responsabilidades.

## Invocación de Expert Skills

Antes de escribir CUALQUIER código, determinar qué skills cargar según el stack del nodo:

| Stack del nodo | Skills a leer ANTES de escribir |
|----------------|-------------------------------|
| `frontend` | `expert-angular` |
| `backend` | `expert-nestjs` |
| `database` | `expert-postgresql` |
| `backend+database` | `expert-nestjs`, `expert-postgresql` |
| `fullstack` | `expert-angular`, `expert-nestjs`, `expert-postgresql` |

Los skills contienen las convenciones EXACTAS del proyecto extraídas del código real. No son sugerencias — son instrucciones vinculantes.

## Execution Steps

### 1. Cargar Contexto del Nodo

Leer del output del triage:
- `ID` del nodo atómico
- `Responsabilidad`: qué hay que hacer
- `Stack`: backend, frontend, database, o combinación
- `Archivos`: paths a los archivos a crear/modificar
- `requires_tests`: si hay que crear tests
- `Estado actual`: pending o feedback

Leer `.atl/dag.json` para validar reglas de estado y transiciones.

### 2. Cargar Expert Skills

Para cada stack en el nodo, leer el SKILL.md correspondiente:

```
SKILLS A CARGAR:
├── Si stack = frontend → leer .atl/skills/expert-angular/SKILL.md
├── Si stack = backend → leer .atl/skills/expert-nestjs/SKILL.md
├── Si stack = database → leer .atl/skills/expert-postgresql/SKILL.md
└── Si combinación → leer TODOS los skills aplicables
```

### 3. Cambiar Estado a in_progress

Marcar el nodo como `in_progress` para indicar que está siendo trabajado.

### 4. Implementar Código

Seguir las convenciones del skill experto correspondiente. NO inventar patrones — usar los que ya existen en el proyecto.

#### Backend (NestJS)
```
IMPLEMENTAR BACKEND:
├── Crear/actualizar entidad (entity) con TypeORM
├── Crear/actualizar DTO con class-validator
├── Crear/actualizar servicio con lógica de negocio
├── Crear/actualizar controlador con decoradores Swagger
├── Registrar en el módulo correspondiente
└── Exportar si otros módulos lo requieren
```

#### Frontend (Angular)
```
IMPLEMENTAR FRONTEND:
├── Crear/actualizar componente standalone
├── Crear/actualizar template HTML
├── Crear/actualizar estilos SCSS
├── Crear/actualizar servicio (si aplica)
├── Crear/actualizar rutas lazy (si aplica)
├── Conectar en las rutas principales (si es feature nueva)
└── Actualizar modelos/interfaces si cambia la API
```

#### Base de Datos (PostgreSQL + TypeORM)
```
IMPLEMENTAR DB:
├── Crear/actualizar entidad TypeORM
├── Crear migración (NUNCA confiar en synchronize)
├── Agregar índices compuestos con tenantId si es multi-tenant
├── Definir relaciones con JoinColumn explícito
└── Manejar errores 23505 (unique) y 23503 (FK) en servicios
```

### 5. Crear Tests (SOLO si requires_tests=true)

Si triage marcó `requires_tests: true`, crear tests para el código implementado.

#### Tests Backend (Jest)

Crear archivo `{nombre}.spec.ts` junto al archivo de producción:

```typescript
// servicios: nombre.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { MiServicio } from './mi.service';

describe('MiServicio', () => {
  let service: MiServicio;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MiServicio],
    }).compile();

    service = module.get<MiServicio>(MiServicio);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
```

Patrón de tests existente en el proyecto:
- `backend/src/app.controller.spec.ts` — test de controlador
- Configuración Jest en `backend/package.json` con `testRegex: ".*\\.spec\\.ts$"`

Reglas para tests backend:
- Unit test por servicio: mockear repositorios con `useValue`
- Unit test por controlador: mockear servicios
- Test de validación de DTOs
- NO crear tests e2e a menos que el nodo lo especifique explícitamente

#### Tests Frontend (Vitest)

Crear archivo `{nombre}.spec.ts` junto al componente:

```typescript
// componentes: nombre.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MiComponente } from './mi.componente';

describe('MiComponente', () => {
  let component: MiComponente;
  let fixture: ComponentFixture<MiComponente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiComponente],
    }).compileComponents();

    fixture = TestBed.createComponent(MiComponente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

Reglas para tests frontend:
- Test de creación del componente (smoke test)
- Test de estado inicial (signals, propiedades)
- Test de interacción del usuario si el componente tiene eventos
- Mockear servicios con `jasmine.createSpyObj` o providers simulados

### 6. Verificar el Código

Antes de marcar como `awaiting_review`:

```
VERIFICAR:
├── ¿El código sigue las convenciones del expert skill?
├── ¿Si requires_tests=true, existen los tests?
├── ¿Los tests compilan? (NO ejecutar — el reviewer lo hará)
├── ¿El código compila sin errores?
├── ¿El estado del nodo es correcto (awaiting_review)?
└── ¿No hay TODOs, console.log, o código comentado?
```

### 7. Marcar como awaiting_review

Una vez que el código está escrito y verificado:

1. Marcar el nodo como `awaiting_review` (NUNCA `done`)
2. Persistir el progreso en Engram con `mem_save(topic_key: "sistema_parqueadero/implementer/{issue-id}/{node-id}", type: "architecture")`
3. Reportar al orquestador

## Output Contract

Siempre retornar esta estructura:

```markdown
## Implementer: {node-id}

### Nodo
- ID: {node-id}
- Responsabilidad: {qué se implementó}
- Stack: {backend | frontend | database | combinación}
- Estado: awaiting_review (anterior: in_progress)

### Archivos Creados/Modificados
| Archivo | Acción | Stack |
|---------|--------|-------|
| {path} | {creado/modificado} | {backend/frontend} |

### Tests Creados
| Archivo | Tipo |
|---------|------|
| {path/*.spec.ts} | {unit/integration} |
*(N/A si requires_tests=false)*

### Expert Skills Invocados
- {expert-angular: sí/no}
- {expert-nestjs: sí/no}
- {expert-postgresql: sí/no}

### Notas
{decisiones técnicas, patrones seguidos, cosas a revisar}
```

## References

- `.atl/dag.json` — DAG maestro, reglas de estado y transiciones
- `.atl/skills/expert-angular/SKILL.md` — convenciones Angular 21 del proyecto
- `.atl/skills/expert-nestjs/SKILL.md` — convenciones NestJS 11 del proyecto
- `.atl/skills/expert-postgresql/SKILL.md` — convenciones PostgreSQL + TypeORM
- `.atl/skills/triage/SKILL.md` — output del triage con nodos atómicos
- `openspec/config.yaml` — configuración del proyecto
