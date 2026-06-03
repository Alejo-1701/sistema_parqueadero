# SDD Proposal: Implementar Módulo de Residentes

## Cambio
Implementar el módulo `Residents` (Issue #23), que vincula personas (`people`) con apartamentos (`apartments`) para gestionar quién vive en cada unidad del conjunto residencial.

## Intención
Cubrir la sección 6.2 de la especificación funcional (`docs/functional-spec.md`) y la tabla `residents` definida en el diccionario de datos (`backend/docs/data-dictionary.md`), siguiendo el mismo patrón estructural que los módulos existentes.

## Alcance

### Incluye
- Entidad `Resident` con relaciones ManyToOne a `Person`, `Apartment` y `Tenant`
- Migración TypeORM para la tabla `residents` con FKs, índices y CHECK constraints
- DTOs de creación y actualización con class-validator
- Servicio con CRUD completo
- Controlador REST con endpoints `GET`, `POST`, `PATCH`, `DELETE`
- Registro del módulo en `app.module.ts`

### No incluye
- Autenticación ni guards de autorización (se alinea con el patrón actual — los módulos existentes tampoco los tienen)
- Integración con frontend
- Tests unitarios (se agregan en fase de verificación)
- Lógica de negocio adicional más allá del CRUD

## Enfoque
1. Seguir exactamente la estructura de directorios de los módulos existentes: `entities/`, `dto/`, `services/`, `controllers/`
2. Usar class-validator con nombres de campo en inglés (como el módulo `parking`)
3. Migración usando `Table`, `TableForeignKey`, `TableIndex`, `TableCheck` de TypeORM (patrón existente)
4. Relaciones: `person_id` → `people` (ON DELETE CASCADE), `apartment_id` → `apartments` (ON DELETE RESTRICT)

## Dependencias
- `people` — entidad Person ya existe
- `residential` — entidad Apartment ya existe
- Ambos módulos están registrados y funcionales

## Riesgos
- Ninguno significativo. El patrón está repetido 5+ veces en el códigobase.

## Archivos a crear/modificar

| Archivo | Acción | Descripción |
|---|---|---|
| `backend/src/modules/residents/entities/resident.entity.ts` | Crear | Entidad TypeORM con mapeo a tabla `residents` |
| `backend/src/modules/residents/dto/resident.dto.ts` | Crear | DTOs CreateResidentDto y UpdateResidentDto |
| `backend/src/modules/residents/services/resident.service.ts` | Crear | CRUD con TypeORM Repository |
| `backend/src/modules/residents/controllers/resident.controller.ts` | Crear | Endpoints REST |
| `backend/src/modules/residents/residents.module.ts` | Crear | Módulo NestJS con TypeOrmModule.forFeature |
| `backend/migrations/1700000000008-CreateResidents.ts` | Crear | Migración con Table, FKs, índices y checks |
| `backend/src/app.module.ts` | Modificar | Agregar import e ingreso en imports array |
