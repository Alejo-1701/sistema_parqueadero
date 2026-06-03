# SDD Spec: Módulo de Residentes

## Entidad: `Resident`

### Tabla: `residents`

| Columna | Tipo | Restricciones |
|---|---|---|
| `id` | UUID | PK, default `gen_random_uuid()` |
| `tenant_id` | UUID | NOT NULL, FK → `tenants(id)` ON DELETE RESTRICT |
| `resident_code` | VARCHAR(20) | NOT NULL |
| `resident_type` | VARCHAR(20) | NOT NULL, CHECK IN ('resident','tenant') |
| `person_id` | UUID | NOT NULL, FK → `people(id)` ON DELETE CASCADE |
| `apartment_id` | UUID | NOT NULL, FK → `apartments(id)` ON DELETE RESTRICT |
| `move_in_date` | DATE | NOT NULL |
| `move_out_date` | DATE | NULLABLE |
| `status` | VARCHAR(20) | NOT NULL, DEFAULT 'active', CHECK IN ('active','inactive') |
| `notes` | TEXT | NULLABLE |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() |

### Índices
- `UQ_residents_tenant_code` — UNIQUE sobre `(tenant_id, resident_code)`
- `IDX_residents_tenant_person` — sobre `(tenant_id, person_id)`
- `IDX_residents_tenant_apartment` — sobre `(tenant_id, apartment_id)`

### Relaciones ORM
- `Resident.tenant` → `Tenant` (ManyToOne)
- `Resident.person` → `Person` (ManyToOne)
- `Resident.apartment` → `Apartment` (ManyToOne)

---

## API Endpoints

### `GET /residents`
Listar residentes.

**Query params (opcionales):**
- `status` — filtrar por active/inactive
- `resident_type` — filtrar por resident/tenant
- `apartment_id` — filtrar por apartamento

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "residentCode": "R-001",
      "residentType": "resident",
      "personId": "uuid",
      "apartmentId": "uuid",
      "moveInDate": "2026-01-15",
      "moveOutDate": null,
      "status": "active",
      "notes": null,
      "person": { "id": "uuid", "firstName": "...", "lastName": "..." },
      "apartment": { "id": "uuid", "tower": "A", "apartmentNumber": "101" }
    }
  ]
}
```

**Response `200` (vacío):**
```json
{
  "success": true,
  "data": []
}
```

---

### `GET /residents/:id`
Obtener residente por ID.

**Response `200`:**
```json
{
  "success": true,
  "data": { "id": "uuid", "residentCode": "R-001", ... }
}
```

**Response `404`:**
```json
{
  "success": false,
  "message": "Residente no encontrado",
  "data": null
}
```

---

### `POST /residents`
Crear residente.

**Request body:**
```json
{
  "residentCode": "R-001",
  "residentType": "resident",
  "personId": "uuid",
  "apartmentId": "uuid",
  "moveInDate": "2026-01-15",
  "notes": "Opcional"
}
```

**Response `201`:**
```json
{
  "success": true,
  "data": { "id": "uuid", ... }
}
```

**Response `400` (validación):**
```json
{
  "success": false,
  "message": "Error de validación",
  "data": null,
  "errors": [
    { "field": "personId", "constraints": ["personId debe ser un UUID válido"] }
  ]
}
```

**Response `400` (resident_code duplicado):**
```json
{
  "success": false,
  "message": "El código de residente ya existe en este tenant"
}
```

---

### `PATCH /residents/:id`
Actualizar residente.

**Request body (todos opcionales):**
```json
{
  "residentCode": "R-002",
  "moveOutDate": "2026-06-01",
  "status": "inactive"
}
```

**Response `200`:**
```json
{
  "success": true,
  "data": { "id": "uuid", ... }
}
```

**Response `400` (move_out_date anterior a move_in_date):**
```json
{
  "success": false,
  "message": "La fecha de salida no puede ser anterior a la fecha de ingreso"
}
```

**Response `404`:**
```json
{
  "success": false,
  "message": "Residente no encontrado"
}
```

---

### `DELETE /residents/:id`
Eliminar (desactivar) residente.

Cambia `status` a `inactive`. No elimina físicamente el registro.

**Response `200`:**
```json
{
  "success": true,
  "data": { "id": "uuid", "status": "inactive" }
}
```

**Response `404`:**
```json
{
  "success": false,
  "message": "Residente no encontrado"
}
```

---

## Escenarios

| # | Escenario | Input | Expected |
|---|---|---|---|
| 1 | Crear residente con datos válidos | ResidentCode, personId, apartmentId, moveInDate válidos | 201 + residente creado |
| 2 | Crear sin campos requeridos | Body vacío | 400 + errores validación |
| 3 | Crear con person_id inexistente | UUID inexistente en people | Error FK constraint |
| 4 | Crear con apartment_id inexistente | UUID inexistente en apartments | Error FK constraint |
| 5 | Crear con resident_code duplicado en mismo tenant | Mismo código que otro residente activo | 400 + unique constraint |
| 6 | Listar residentes | GET /residents | 200 + array (puede ser vacío) |
| 7 | Listar con filtro status=active | GET /residents?status=active | 200 + solo activos |
| 8 | Obtener residente por ID existente | UUID válido | 200 + residente con relaciones |
| 9 | Obtener residente por ID inexistente | UUID no existente | 404 |
| 10 | Actualizar todos los campos | PATCH con datos completos | 200 + datos actualizados |
| 11 | Actualizar con move_out_date anterior a move_in_date | Fecha inválida | 400 |
| 12 | Eliminar (desactivar) residente activo | DELETE | 200 + status = inactive |
| 13 | Eliminar residente ya inactivo | DELETE sobre inactive | 200 (idempotente) |

---

## Validaciones (class-validator)

| Campo | Create | Update | Decoradores |
|---|---|---|---|
| `residentCode` | Requerido | Opcional | `@IsString()` |
| `residentType` | Requerido | Opcional | `@IsEnum(['resident', 'tenant'])` |
| `personId` | Requerido | Opcional | `@IsUUID()` |
| `apartmentId` | Requerido | Opcional | `@IsUUID()` |
| `moveInDate` | Requerido | Opcional | `@IsDateString()` |
| `moveOutDate` | Opcional | Opcional | `@IsDateString()` |
| `status` | Opcional (default active) | Opcional | `@IsEnum(['active', 'inactive'])` |
| `notes` | Opcional | Opcional | `@IsString()` |
