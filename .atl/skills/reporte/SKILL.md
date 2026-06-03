---
name: reporte
description: "Trigger: reporte, report, commit, commit message, conventional commit, informe, resumen, summary. Genera informe con archivos creados/modificados y justificación, y entrega mensaje de commit siguiendo Conventional Commits."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

# Reporte — Skill de Informe y Commit

## Activation Contract

Usar este skill cuando un nodo haya sido aprobado por reviewer (estado `done`) y se necesite generar el informe final con la justificación de cambios y el mensaje de commit correspondiente.

NO es para analizar, implementar ni revisar código. Es puramente generación de informe y commit message.

## Hard Rules

1. **LEER LOS 3 OUTPUTS**: el reporte SIEMPRE debe leer el output del triage (justificación), del implementer (archivos), y del reviewer (validación). No inventar nada.
2. **CONVENTIONAL COMMITS**: el mensaje de commit DEBE seguir el formato estándar `type(scope): description`. No se aceptan mensajes sin estructura.
3. **IDIOMA**: todos los commit messages DEBEN generarse **en español**. Description en imperativo presente, body en español.
4. **JUSTIFICACIÓN POR ARCHIVO**: cada archivo en el reporte debe tener su justificación asociada. "Archivos modificados" sin por qué no es válido.
5. **NO MODIFICAR CÓDIGO**: este skill es solo de lectura + generación de texto. No toca archivos de código.
6. **RESPETAR EL CICLO DE VIDA**: solo se genera reporte para nodos en estado `done`. Si el nodo no está aprobado, no hay reporte.

## Formato Conventional Commit

```
type(scope): description

- body point 1
- body point 2 (opcional)

footer (opcional)
```

### Types permitidos

| Type | Cuándo usarlo |
|------|---------------|
| `feat` | Nueva funcionalidad para el usuario |
| `fix` | Corrección de bug |
| `refactor` | Cambio que no agrega funcionalidad ni corrige bug |
| `test` | Agregar o corregir tests |
| `docs` | Cambios en documentación |
| `chore` | Tareas de mantenimiento, config, dependencias |
| `style` | Cambios de formato, estilos visuales |
| `perf` | Mejora de rendimiento |
| `ci` | Cambios en CI/CD |
| `build` | Cambios en el sistema de build |

### Scope

Usar el nombre del módulo o feature afectado:
- `backend` / `frontend` si toca toda la capa
- `backend/auth`, `frontend/login` si es un módulo específico
- Si toca ambos, usar `fullstack`

### Description (en español)

- **Idioma**: el mensaje DEBE generarse **en español**. Siempre.
- Imperativo, presente: "agrega", "corrige", "implementa", "elimina", NO "agregado", "corregido", "implementado"
- Máximo 72 caracteres
- Sin punto final

## Execution Steps

### 1. Recopilar Inputs

Leer los outputs de los roles anteriores para el nodo en estado `done`:

```
INPUTS:
├── Triage: qué se pidió, por qué, para quién, requires_tests
├── Implementer: archivos creados/modificados, tests, expert skills invocados
└── Reviewer: validación, tests ejecutados, decisión final
```

### 2. Construir Tabla de Archivos

Para cada archivo creado o modificado, extraer:

| Archivo | Acción | Stack | Justificación |
|---------|--------|-------|-------------|
| `path/archivo.ts` | creado/modificado | backend/frontend | por qué se creó/modificó |

La justificación NO es "se implementó X" — es EL PROPÓSITO: "para permitir la validación de email en el registro de usuarios" o "para corregir el error de timeout en la consulta de vehículos".

### 3. Determinar Tipo de Commit

Basado en el output del triage:

| Situación en Triage | Type |
|---------------------|------|
| Nueva feature | `feat` |
| Bug fix | `fix` |
| Refactor | `refactor` |
| Tests únicamente | `test` |
| Configuración/infra | `chore` |

### 4. Generar Mensaje de Commit (en español)

```text
feat(backend/residents): agrega validación de fecha de ingreso en residentes

- Valida que move_out_date no sea anterior a move_in_date en ResidentService
- Agrega tests unitarios para escenarios de fechas superpuestas
- Actualiza Resident DTO con campo opcional moveOutDate

Issue: #23
```

Reglas:
- **type** del paso 3
- **scope** del módulo principal afectado
- **description** en español, imperativo presente, ≤72 caracteres
- **body** bullets en español con archivos clave y qué hacen
- **footer** solo si hay issue/PR reference

### 5. Generar Reporte Completo

Estructura del reporte:

```markdown
## Reporte: {node-id}

### Resumen
{una línea describiendo el cambio}

### Justificación
{por qué se hizo este cambio — del triage}

### Archivos Creados/Modificados
| Archivo | Acción | Stack | Justificación |
|---------|--------|-------|-------------|
| {path} | {creado/modificado} | {backend/frontend/db} | {para qué} |

### Tests
{lista de tests creados o N/A}

### Validación
- Revisor: {quién}
- Estado: done
- Tests ejecutados: {sí/no}
- Resultado: {aprobado/NA}

### Commit Message (en español)
```text
{type}({scope}): {description en español, imperativo}

{body en español}

{footer}
```
```

### 6. Entregar al Usuario

El reporte y commit message se entregan al usuario para que decida:
- Si quiere ajustar el commit message
- Si quiere hacer el commit ahora
- Si quiere agrupar varios nodos en un solo commit

El reporte NO hace el commit automáticamente — eso lo decide el usuario.

## Output Contract

Siempre retornar esta estructura:

```markdown
## Reporte: {node-id}

### Resumen
{cambio en una línea}

### Justificación
{por qué}

### Archivos
| Archivo | Acción | Stack | Justificación |
|---------|--------|-------|-------------|

### Commit Message (en español)
{conventional commit message en español listo para usar}
```

## References

- `.atl/skills/triage/SKILL.md` — justificación del cambio
- `.atl/skills/implementer/SKILL.md` — archivos creados/modificados
- `.atl/skills/reviewer/SKILL.md` — validación y aprobación
- Conventional Commits: https://www.conventionalcommits.org/
