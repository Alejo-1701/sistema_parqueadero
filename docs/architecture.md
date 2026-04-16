# Arquitectura del Sistema de Parqueadero

## 1. Visión General

Sistema de gestión de parqueaderos residenciales con arquitectura **multi-tenant**, desarrollado en **NestJS** (backend) y **Angular** (frontend).

## 2. Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| **Backend** | NestJS + TypeScript |
| **ORM** | TypeORM |
| **Database** | PostgreSQL |
| **Auth** | JWT + bcrypt |
| **Frontend** | Angular 19 + TailwindCSS |
| **Documentación** | Swagger (OpenAPI) |

## 3. Modelo de Datos

### 3.1 Esquema Multi-Tenant

```
platform_accounts (SUPERADMIN, sin tenant_id)
        │
        │ (gestión cross-tenant: crear/configurar tenants)
        ▼
tenants (1) ──────► (N) people
                  ──────► (N) accounts
                  ──────► (N) apartments
                  ──────► (N) requests
                  ──────► (N) pqrs
                  ──────► (N) notifications
```

`platform_accounts` representa operadores del **proveedor** del software (`SUPERADMIN`). Las cuentas en `accounts` pertenecen siempre a **un** `tenant_id` (administración **del** conjunto, no de toda la plataforma).

### 3.2 Entidades Base

| Entidad | Descripción | Relación |
|---------|-------------|----------|
| `tenants` | Cliente/organización | Raíz |
| `people` | Personas (identidad + contacto) | → tenants |
| `accounts` | Credenciales de acceso | → tenants, → people (opcional) |
| `roles` | Roles de usuario | → tenants |
| `account_roles` | Asignación rol-cuenta | → tenants, → accounts, → roles |
| `platform_accounts` | Cuenta plataforma (`SUPERADMIN`) | Sin `tenant_id`; acceso cross-tenant acotado por API |

### 3.3 Modelo Residencial

| Entidad | Descripción | Relación |
|---------|-------------|----------|
| `apartments` | Unidades residenciales | → tenants, → people (owner) |
| `residents` | Residentes vinculados a apartamentos | → tenants, → people, → apartments |

### 3.4 Parqueadero y Facturación

| Entidad | Descripción | Relación |
|---------|-------------|----------|
| `vehicle_categories` | Categorías de vehículos | → tenants |
| `parking_lots` | Parqueaderos | → tenants, → vehicle_categories |
| `rates` | Tarifas | → tenants, → vehicle_categories, → parking_lots |
| `invoices` | Facturas | → tenants, → parking_lots, → people\|visitors |
| `prices` | Detalle de precios | → tenants, → invoices, → rates |

### 3.5 Acceso y Operaciones

| Entidad | Descripción | Relación |
|---------|-------------|----------|
| `visitors` | Visitantes con check-in/out | → tenants, → people, → apartments |
| `requests` | Solicitudes/tickets | → tenants, → people (requester/responder) |
| `notifications` | Notificaciones | → tenants, → people, → accounts (sender) |
| `pqrs` | Peticiones, quejas, reclamos | → tenants, → people (requester/assigned) |

## 4. Arquitectura de Capas (Backend)

```
src/
├── common/                    # Compartido
│   ├── filters/               # Filtros de excepciones
│   ├── interceptors/          # Interceptors (respuesta, logging)
│   ├── guards/                # Guards (auth, tenant, throttle)
│   └── pipes/                 # Pipes de validación
├── config/                    # Configuración
│   ├── database.config.ts     # TypeORM
│   └── app.config.ts          # app.module
├── modules/
│   ├── tenants/              # Módulo de tenants
│   ├── platform/              # Cuentas plataforma (SUPERADMIN) — opcional / fase posterior
│   ├── people/                # Personas
│   ├── accounts/              # Cuentas de acceso
│   ├── roles/                 # Roles y permisos (tenant)
│   ├── apartments/            # Apartamentos
│   ├── residents/             # Residentes
│   ├── parking/               # Parqueaderos
│   ├── vehicles/              # Vehículos
│   ├── visitors/              # Visitantes
│   ├── billing/               # Facturación
│   ├── requests/              # Solicitudes
│   ├── notifications/         # Notificaciones
│   └── pqrs/                  # PQRs
├── app.module.ts              # Módulo raíz
└── main.ts                    # Entry point (Swagger config)
```

## 5. Seguridad

### 5.1 Autenticación
- JWT con `access_token` y `refresh_token`
- Password hasheado con bcrypt
- Lockout por intentos fallidos (configurable)

### 5.2 Autorización (RBAC)

**Dos planos:**

| Plano | Actores | Alcance |
|-------|---------|---------|
| **Tenant** | `accounts` + `roles` + `account_roles` | Códigos v1: `ADMIN`, `OPERATOR`, `GUARD`, `RESIDENT`, `OWNER`, `LESSEE`, `VISITOR` (ver [diccionario de datos](../backend/docs/data-dictionary.md)). `ADMIN` = administración **dentro de ese** `tenant_id`. |
| **Plataforma** | `platform_accounts` con `role_code = SUPERADMIN` | Operación del proveedor: alta/configuración de tenants, soporte, métricas globales. **No** usar filas en `roles` para `SUPERADMIN` (esa tabla exige `tenant_id`). |

- Guards por módulo y acción; JWT o claims deben distinguir **contexto tenant** vs **contexto plataforma**.
- Permisos granulares (fase posterior o módulo de permisos).

### 5.3 Multi-Tenancy
- `tenant_id` en toda tabla funcional
- Filtro automático en servicios
- Aislamiento de datos por contexto JWT

### 5.4 Otras Medidas
- CORS por whitelist
- Rate limiting (Throttler)
- Validación de payloads (ValidationPipe)
- Sanitización de inputs

## 6. API Endpoints (Estructura)

```
/api/v1
├── /auth
│   ├── POST /login
│   ├── POST /refresh
│   └── POST /logout
├── /platform/auth   (opcional: login SUPERADMIN, distinto de cuentas tenant)
├── /tenants
│   ├── GET / (list)
│   ├── GET /:id
│   ├── POST /
│   ├── PATCH /:id
│   └── DELETE /:id
├── /people
│   ├── GET / (list)
│   ├── GET /:id
│   ├── POST /
│   ├── PATCH /:id
│   └── DELETE /:id
├── /accounts
├── /apartments
├── /residents
├── /visitors
├── /parking
├── /billing
├── /requests
├── /notifications
└── /pqrs
```

## 7. Flujo de Desarrollo

| Fase | Descripción | Entregable |
|------|-------------|------------|
| **Fase 0** | Fundacion (env, lint, Swagger) | Proyecto listo |
| **Fase 1** | Modelo de datos (15 tablas) | Migraciones + entidades |
| **Fase 2** | Seguridad (auth, RBAC, tenant) | Endpoints protegidos |
| **Fase 3** | API funcional por módulos | CRUD completo |
| **Fase 4** | Documentación Swagger | API documentada |
| **Fase 5** | Pruebas y QA | Tests funcionales |
| **Fase 6** | Despliegue | Staging productivo |

## 8. Referencias

- Diccionario de datos: [backend/docs/data-dictionary.md](./backend/docs/data-dictionary.md)
- Runbook Backend: [backend/_tmp/runbook-backend.md](./backend/_tmp/runbook-backend.md)
- Swagger: `http://localhost:3000/api/v1/docs`