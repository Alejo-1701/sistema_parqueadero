# Sistema de Parqueaderos — Diccionario de Datos (PostgreSQL) — Estándar EN

## Objetivo

Proveer una **especificación estable** (modelo objetivo) para la base de datos usando:

- **Nombres en inglés** (tablas/columnas)
- Soporte **multi-tenant** (el sistema puede ser usado por múltiples conjuntos/clientes)
- **Relaciones**, **restricciones** e **índices** definidos de forma clara

El DDL de este archivo es la **versión deseada** al migrar el esquema; no sustituye por sí solo el inventario de tablas generadas por TypeORM hasta que existan migraciones alineadas.

> Notas
>
> - La generación de UUID usa `gen_random_uuid()` y requiere `pgcrypto`.
> - `updated_at` debe ser mantenido por la aplicación o con triggers (PostgreSQL no lo actualiza automáticamente).

## Implementación actual (NestJS / TypeORM)

Hoy el backend puede divergir de este documento en nombres de tablas, columnas (`camelCase` en entidades sin `NamingStrategy` a `snake_case`), tipos de PK y ausencia de multi-tenant. Referencia de módulos en `backend/src/modules`:

| Este diccionario (objetivo) | Código / tablas actuales aproximadas |
|-----------------------------|--------------------------------------|
| `tenants`, `tenant_id` | No modelado aún en entidades |
| `people` (campos EN + tenant) | `people` (`Person`) con columnas en español y sin `tenant_id` |
| `accounts`, `roles`, `account_roles` | Autenticación: entidad `User` → tabla `users` |
| `apartments`, `residents` | `residential_units`, `residential_assignments` |
| `parking_lots`, `vehicle_categories`, `rates`, `invoices`, `prices` | `parking_spaces`, `parking_records` |
| — | Tablas legacy `usuarios`, `vehiculos` (PK entera, distinto dominio de usuarios de `auth`) |

Cuando el esquema real coincida con este archivo, esta sección puede sustituirse por un enlace a migraciones o a un diagrama ER generado desde la BD.

## Extensiones requeridas

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

## Convenciones de nombres (estándar)

- **snake_case** para tablas/columnas.
- Tablas en **plural** (ej. `tenants`, `people`).
- Llave primaria: `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`.
- Aislamiento multi-tenant: toda tabla funcional incluye `tenant_id UUID NOT NULL`.
- Timestamps: `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`, `updated_at TIMESTAMPTZ NOT NULL DEFAULT now()`.

## Modelo multi-tenant

### `tenants`

Representa un cliente/conjunto (tenant) dentro del sistema.

```sql
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(150) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','suspended')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

## Entidades base

### `people`

Registro de personas (identidad y datos de contacto). **Aislado por tenant**.

```sql
CREATE TABLE people (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,

  document_type VARCHAR(20) NOT NULL CHECK (document_type IN ('CC','CE','TI','PP','NIT')),
  document_number VARCHAR(20) NOT NULL,

  first_name VARCHAR(100) NOT NULL,
  last_name  VARCHAR(100) NOT NULL,

  phone VARCHAR(20),
  email VARCHAR(100),
  address TEXT,
  city VARCHAR(50),
  birth_date DATE,

  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','suspended')),

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (tenant_id, document_number),
  UNIQUE (tenant_id, email)
);
```

En PostgreSQL, `UNIQUE (tenant_id, email)` permite varias filas con `email IS NULL`; si el negocio exige un solo “sin email” por tenant, usar un índice único parcial (por ejemplo `WHERE email IS NOT NULL`) más una regla adicional para el caso `NULL`.

**Índices (recomendados)**:

- `(tenant_id, document_number)` (covered by UNIQUE)
- `(tenant_id, status)`
- `(tenant_id, last_name, first_name)`

### Autenticación / Cuentas (consolidación)

Para evitar duplicidad entre “perfil” y “usuario”, se debe consolidar la información de login en **una sola** tabla.

### `accounts`

Cuenta de acceso (username/email/password_hash) aislada por tenant. Se puede enlazar opcionalmente a una `person`.

```sql
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  person_id UUID REFERENCES people(id) ON DELETE SET NULL,

  username VARCHAR(50) NOT NULL,
  email VARCHAR(100),
  password_hash VARCHAR(255) NOT NULL,

  last_login_at TIMESTAMPTZ,
  failed_login_attempts INTEGER NOT NULL DEFAULT 0,
  locked_until TIMESTAMPTZ,

  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','blocked')),

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (tenant_id, username),
  UNIQUE (tenant_id, email)
);
```

### Roles (perfiles)

En vez de codificar roles en múltiples tablas, definir roles y su asignación.

#### `roles`

```sql
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,

  code VARCHAR(40) NOT NULL, -- valores permitidos: catálogo fijo v1 (sección siguiente)
  name VARCHAR(80) NOT NULL,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (tenant_id, code)
);
```

**Catálogo fijo `roles.code` (v1, inglés)** — códigos en **MAYÚSCULAS** (sin espacios); `name` es etiqueta para UI (puede traducirse).

| `code` | `name` (ejemplo UI) | Responsabilidad | Notas |
|--------|---------------------|-----------------|--------|
| `ADMIN` | Administrator | Configuración del tenant, usuarios/cuentas, catálogos sensibles, reportes globales | Sustituye el rol legacy `admin`. |
| `OPERATOR` | Operator | Operación diaria: registros, facturación operativa, soporte a residentes | Sustituye `operador`. |
| `GUARD` | Security guard | Portería y control de acceso; permisos más acotados que `OPERATOR` si se separan en políticas | Opcional si en v1 `OPERATOR` cubre portería. |
| `RESIDENT` | Resident | Autoservicio del ocupante (unidad, vehículos, visitas según producto) | Sustituye `cliente` y el default genérico `user` del módulo auth. |
| `OWNER` | Unit owner | Titular de unidad (propietario); puede coincidir o no con quien habita | Diferencia de negocio respecto a `LESSEE`. |
| `LESSEE` | Lessee | Arrendatario / ocupante por contrato de arriendo (no confundir con tabla `tenants` SaaS) | Se usa **LESSEE** en lugar de `TENANT` como código de rol para no chocar con “tenant multi-inquilino”. |
| `VISITOR` | Visitor | Acceso limitado o invitado (portal de visita, pre-registro, etc.) | Alcance según reglas de la app. |

**Semilla recomendada** (cada fila por tenant; ajustar `tenant_id`):

```sql
INSERT INTO roles (tenant_id, code, name) VALUES
  ($1, 'ADMIN', 'Administrator'),
  ($1, 'OPERATOR', 'Operator'),
  ($1, 'GUARD', 'Security guard'),
  ($1, 'RESIDENT', 'Resident'),
  ($1, 'OWNER', 'Unit owner'),
  ($1, 'LESSEE', 'Lessee'),
  ($1, 'VISITOR', 'Visitor');
```

Nuevos roles tras v1: añadir fila aquí en el diccionario + migración/seed + políticas de autorización.

### Implementación en código (fuera de este documento)

El catálogo anterior es **normativo para el modelo objetivo**; el repositorio puede seguir usando valores distintos hasta que se implemente la alineación. Tareas típicas (asignación sugerida: **Alejo**):

1. Sustituir enums / strings legacy (`usuarios`: `admin` / `operador` / `cliente`; `users` en auth: default `user`; frontend: `user.model`) por los códigos en inglés de la tabla de catálogo, con migración de datos si aplica.
2. Tras el cambio de esquema, ejecutar (o adaptar) la migración SQL de abajo en cada entorno.

**Migración de datos (referencia)** — ejecutar cuando el código ya persista los códigos en inglés en columnas compatibles (`VARCHAR` recomendado frente a `ENUM` nativo si los valores pueden evolucionar):

```sql
UPDATE usuarios SET rol = CASE rol
  WHEN 'admin' THEN 'ADMIN'
  WHEN 'operador' THEN 'OPERATOR'
  WHEN 'cliente' THEN 'RESIDENT'
  ELSE rol
END
WHERE rol IN ('admin', 'operador', 'cliente');
```

Seguimiento en GitHub: [issue #29](https://github.com/Alejo-1701/sistema_parqueadero/issues/29) (asignada a Alejo).

#### `account_roles`

```sql
CREATE TABLE account_roles (
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  PRIMARY KEY (tenant_id, account_id, role_id)
);
```

La PK incluye `tenant_id` para reforzar el aislamiento; en la práctica hay que garantizar (CHECK, trigger o aplicación) que `accounts.tenant_id`, `roles.tenant_id` y el `tenant_id` de la fila coincidan, para evitar combinaciones incoherentes.

## Solicitudes / Tickets

### `requests`

```sql
CREATE TABLE requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,

  request_type VARCHAR(30) NOT NULL CHECK (request_type IN ('access','visit','service','complaint','claim')),
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending','approved','rejected','in_progress')),

  requester_person_id UUID NOT NULL REFERENCES people(id) ON DELETE RESTRICT,
  responder_person_id UUID REFERENCES people(id) ON DELETE SET NULL,

  description TEXT,
  response TEXT,

  requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  responded_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

**Índices (recomendados)**:

- `(tenant_id, status, requested_at DESC)`
- `(tenant_id, requester_person_id)`

## Modelo residencial

### `apartments`

```sql
CREATE TABLE apartments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,

  tower VARCHAR(10) NOT NULL,
  apartment_number VARCHAR(10) NOT NULL,

  owner_person_id UUID REFERENCES people(id) ON DELETE SET NULL,

  area_m2 DECIMAL(8,2),
  bedrooms INTEGER,
  bathrooms INTEGER,
  apartment_type VARCHAR(20) CHECK (apartment_type IN ('studio','1_bed','2_bed','3_bed','penthouse')),
  status VARCHAR(20) NOT NULL DEFAULT 'available' CHECK (status IN ('available','occupied','maintenance','for_sale')),
  notes TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (tenant_id, tower, apartment_number)
);
```

> Si se requiere historial de propiedad, usar una tabla histórica `apartment_owners` en vez de `owner_person_id`.

### `residents`

```sql
CREATE TABLE residents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,

  resident_code VARCHAR(20) NOT NULL,
  resident_type VARCHAR(20) NOT NULL CHECK (resident_type IN ('resident','tenant')),

  person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  apartment_id UUID NOT NULL REFERENCES apartments(id) ON DELETE RESTRICT,

  move_in_date DATE NOT NULL,
  move_out_date DATE,

  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
  notes TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (tenant_id, resident_code)
);
```

**Índices (recomendados)**:

- `(tenant_id, person_id)`
- `(tenant_id, apartment_id)`

## Visitantes y control de acceso

### `visitors`

```sql
CREATE TABLE visitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,

  visit_type VARCHAR(30) NOT NULL CHECK (visit_type IN ('frequent','occasional','service','emergency')),
  vehicle_type VARCHAR(20) CHECK (vehicle_type IN ('car','motorcycle','bicycle','none')),

  person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  vehicle_plate VARCHAR(10),

  visiting_apartment_id UUID REFERENCES apartments(id) ON DELETE SET NULL,
  authorized_by_person_id UUID REFERENCES people(id) ON DELETE SET NULL,

  check_in_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  check_out_at TIMESTAMPTZ,

  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','expired')),
  notes TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

**Índices (recomendados)**:

- `(tenant_id, check_in_at DESC)`
- `(tenant_id, vehicle_plate)`
- `(tenant_id, visiting_apartment_id)`

## Parqueaderos y facturación

### `vehicle_categories`

```sql
CREATE TABLE vehicle_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,

  name VARCHAR(50) NOT NULL,
  description TEXT,

  service_type VARCHAR(30) NOT NULL CHECK (service_type IN ('private','public','cargo','official','emergency')),
  base_rate DECIMAL(10,2),
  fraction_minutes INTEGER NOT NULL DEFAULT 60,

  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (tenant_id, name)
);
```

### `parking_lots`

```sql
CREATE TABLE parking_lots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,

  capacity INTEGER NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('available','full','maintenance','closed')),

  vehicle_category_id UUID REFERENCES vehicle_categories(id) ON DELETE SET NULL,

  location VARCHAR(100),
  parking_type VARCHAR(20) CHECK (parking_type IN ('visitors','residents','mixed','emergency')),
  opens_at TIME,
  closes_at TIME,

  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

**Relación correcta**: `vehicle_categories (1) -> (N) parking_lots` (vía `parking_lots.vehicle_category_id`).

### `rates`

```sql
CREATE TABLE rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,

  rate_type VARCHAR(30) NOT NULL CHECK (rate_type IN ('standard','preferential','night','weekend','holiday')),
  min_amount DECIMAL(10,2) NOT NULL CHECK (min_amount > 0),
  max_amount DECIMAL(10,2),
  fraction_minutes INTEGER NOT NULL DEFAULT 60,

  valid_from DATE NOT NULL,
  valid_to DATE,

  vehicle_category_id UUID REFERENCES vehicle_categories(id) ON DELETE SET NULL,
  parking_lot_id UUID REFERENCES parking_lots(id) ON DELETE SET NULL,

  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
  notes TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### `invoices`

Regla: la factura pertenece a **una persona** o a **un visitante** (exactamente uno).

```sql
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,

  issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  total_amount DECIMAL(12,2) NOT NULL CHECK (total_amount > 0),

  parking_lot_id UUID REFERENCES parking_lots(id) ON DELETE SET NULL,

  person_id UUID REFERENCES people(id) ON DELETE SET NULL,
  visitor_id UUID REFERENCES visitors(id) ON DELETE SET NULL,

  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','cancelled','overdue')),
  payment_method VARCHAR(20) CHECK (payment_method IN ('cash','card','bank_transfer','nequi','daviplata')),
  paid_at TIMESTAMPTZ,

  discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  notes TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CHECK ( (person_id IS NOT NULL) <> (visitor_id IS NOT NULL) )
);
```

### `prices`

```sql
CREATE TABLE prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,

  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  billing_unit VARCHAR(30) NOT NULL CHECK (billing_unit IN ('hour','day','week','month','event','fraction')),

  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  rate_id UUID REFERENCES rates(id) ON DELETE SET NULL,

  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),

  valid_from DATE NOT NULL,
  valid_to DATE,

  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
  notes TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

**Relación correcta**: `rates (1) -> (N) prices` (vía `prices.rate_id`).

## Notificaciones y PQR

### Remitente de notificaciones (no confundir con una tabla `users`)

No hace falta una tabla adicional tipo “usuarios del sistema” salvo un requisito explícito de negocio. **Recomendación:** usar `accounts` como actor que envía (`sender_account_id` en `notifications`). Si en el futuro se creara otra tabla de identidad operativa, debe ser multi-tenant y seguir las convenciones de nombres en inglés de este documento.

### `notifications`

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,

  notification_type VARCHAR(30) NOT NULL CHECK (notification_type IN ('entry','exit','payment','security','maintenance','general')),

  recipient_person_id UUID NOT NULL REFERENCES people(id) ON DELETE RESTRICT,
  sender_account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,

  title VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,

  sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  read_at TIMESTAMPTZ,

  status VARCHAR(20) NOT NULL DEFAULT 'unread' CHECK (status IN ('unread','read','archived')),
  priority VARCHAR(20) NOT NULL DEFAULT 'normal' CHECK (priority IN ('low','normal','high','urgent')),
  channel VARCHAR(20) CHECK (channel IN ('email','sms','push','app')),

  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### `pqrs`

```sql
CREATE TABLE pqrs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,

  description TEXT NOT NULL,
  pqr_type VARCHAR(20) NOT NULL CHECK (pqr_type IN ('petition','complaint','claim','suggestion','congratulation')),

  requester_person_id UUID NOT NULL REFERENCES people(id) ON DELETE RESTRICT,
  assigned_person_id UUID REFERENCES people(id) ON DELETE SET NULL,

  registered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  due_date DATE,
  responded_at TIMESTAMPTZ,

  status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open','in_progress','resolved','closed','rejected')),
  priority VARCHAR(20) NOT NULL DEFAULT 'normal' CHECK (priority IN ('low','normal','high','urgent')),

  response TEXT,
  satisfaction_score INTEGER CHECK (satisfaction_score BETWEEN 1 AND 5),

  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

## Resumen de relaciones

Relaciones del **modelo objetivo** descrito arriba; contrastar con la sección **Implementación actual (NestJS / TypeORM)** si el código aún no está migrado.

- `tenants (1) -> (N) people`
- `tenants (1) -> (N) accounts`
- `people (1) -> (N) requests` (as requester / responder)
- `tenants (1) -> (N) apartments`
- `people (1) -> (N) residents`
- `apartments (1) -> (N) residents`
- `people (1) -> (N) visitors`
- `vehicle_categories (1) -> (N) parking_lots`
- `parking_lots (1) -> (N) invoices`
- `rates (1) -> (N) prices`
- `invoices (1) -> (N) prices`
- `people (1) -> (N) pqrs`
- `people (1) -> (N) notifications` (recipient)
- `accounts (1) -> (N) notifications` (sender, optional)
