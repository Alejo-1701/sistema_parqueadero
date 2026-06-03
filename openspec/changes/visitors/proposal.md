# SDD Proposal: Implementar Módulo de Visitantes

## Cambio
Implementar el módulo `Visitors` (Issue #25), que gestiona el registro y control de acceso de visitantes al conjunto residencial, vinculando personas, vehículos y apartamentos.

## Intención
Cubrir la sección 8 de la especificación funcional (`docs/functional-spec.md`) y la tabla `visitors` definida en el diccionario de datos (`backend/docs/data-dictionary.md`), siguiendo el mismo patrón estructural que los módulos existentes (especialmente `residents/`).

## Alcance

### Incluye
- Entidad `Visitor` con relaciones a `Person` (visitante y autorizador), `Apartment` y `Tenant`
- Migración TypeORM para la tabla `visitors` con 4 FKs, 3 CHECK constraints, 3 índices + 1 índice parcial
- DTOs de creación, actualización y check-out con class-validator
- Servicio con CRUD + `checkOut()` + `findActive()`
- Controlador REST: CRUD estándar + `POST /visitors/:id/check-out` + `GET /visitors/active`
- Registro del módulo en `app.module.ts`

### No incluye
- Autenticación ni guards de autorización (se alinea con el patrón actual)
- Integración con frontend
- Tests unitarios (se agregan en fase de verificación)
- Lógica de notificaciones al residente cuando llega un visitante

## Enfoque
1. Seguir exactamente el patrón del módulo `residents/` (recién implementado)
2. Creación de visitante = check-in automático (`checkInAt` default `now()`)
3. Endpoint dedicado `POST /visitors/:id/check-out` que registra salida y cambia status a `expired`
4. Índice parcial para consultas de visitantes activos: `WHERE status = 'active'`
5. Errores FK/Unique traducidos a mensajes 400 (mismo patrón que Residents)

## Dependencias
- `people` — entidad Person (visitante y autorizador)
- `residential` — entidad Apartment (apartamento visitado)
- `tenants` — entidad Tenant (multi-tenant)
- Todos existen y están registrados

## Riesgos
- Ninguno significativo. El patrón está repetido 6+ veces.

## Archivos a crear/modificar

| Archivo | Acción | Descripción |
|---|---|---|
| `backend/src/modules/visitors/entities/visitor.entity.ts` | Crear | Entidad TypeORM con 4 relaciones |
| `backend/src/modules/visitors/dto/visitor.dto.ts` | Crear | CreateVisitorDto, UpdateVisitorDto, CheckOutVisitorDto |
| `backend/src/modules/visitors/services/visitor.service.ts` | Crear | CRUD + checkOut() + findActive() |
| `backend/src/modules/visitors/controllers/visitor.controller.ts` | Crear | Endpoints REST + check-out + active |
| `backend/src/modules/visitors/visitors.module.ts` | Crear | Módulo NestJS |
| `backend/migrations/1700000000009-CreateVisitors.ts` | Crear | Migración con FKs, índices, checks |
| `backend/src/app.module.ts` | Modificar | Agregar import e ingreso en imports |
