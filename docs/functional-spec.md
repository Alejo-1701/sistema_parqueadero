# Especificación de Funcionalidades

## Sistema de Parqueadero Residencial

---

## 1. Módulo de Autenticación

### 1.1 Inicio de Sesión
- **Descripción**: Autenticación de usuarios mediante email/username y password
- **Entrada**: credentials (email/username, password)
- **Salida**: JWT access_token, refresh_token, datos del usuario
- **Validaciones**:
  - Credenciales correctas
  - Cuenta activa (no bloqueada)
  - Password hasheado con bcrypt
- **Casos de error**:
  - Credenciales inválidas
  - Cuenta bloqueada (intentos fallidos)
  - Cuenta inactiva

### 1.2 Refresh Token
- **Descripción**: Renovación de token de acceso
- **Entrada**: refresh_token válido
- **Salida**: Nuevo access_token
- **Validaciones**: Token no vencido, token válido

### 1.3 Cierre de Sesión
- **Descripción**: Invalidación de token
- **Entrada**: access_token
- **Salida**: Confirmación de logout

### 1.4 Autenticación plataforma (SUPERADMIN)
- **Descripción**: Login de operadores del proveedor almacenados en `platform_accounts` (sin `tenant_id`); JWT o claims **separados** del flujo de `accounts` tenant para evitar escalada accidental cross-tenant.
- **Salida**: Token con alcance plataforma; solo endpoints explícitos (p. ej. CRUD global de tenants, soporte).
- **Referencia**: `docs/architecture.md`, `backend/docs/data-dictionary.md` (`platform_accounts`).

---

## 2. Módulo de Tenants

### 2.1 CRUD de Tenants
- **Listar (plataforma)**: Obtener tenants del sistema — actor **`SUPERADMIN`** (`platform_accounts`), sin restricción a un solo `tenant_id`.
- **Listar (tenant)**: Listados acotados al `tenant_id` del JWT — actores con rol **`ADMIN`** (u otros según política) **solo** dentro de su tenant.
- **Obtener**: Ver detalle de un tenant (SUPERADMIN cualquiera; usuario tenant solo el propio contexto si aplica).
- **Crear**: Registrar nuevo tenant — típicamente **`SUPERADMIN`** (onboarding de un nuevo conjunto/cliente).
- **Actualizar**: Modificar datos del tenant (SUPERADMIN o `ADMIN` del tenant, según reglas de negocio).
- **Eliminar**: Soft-delete de tenant (normalmente SUPERADMIN o proceso controlado).

### 2.2 Gestión de Estado
- Estados: active, inactive, suspended

---

## 3. Módulo de Personas (People)

### 3.1 CRUD de Personas
- **Listar**: Obtener personas con filtros (documento, nombre, estado)
- **Obtener**: Ver detalle de persona
- **Crear**: Registrar nueva persona
- **Actualizar**: Modificar datos personales
- **Eliminar**: Soft-delete (cambiar estado)

### 3.2 Datos de Persona
- Tipo de documento: CC, CE, TI, PP, NIT
- Número de documento (único por tenant)
- Nombres y apellidos
- Teléfono, email, dirección, ciudad
- Fecha de nacimiento

---

## 4. Módulo de Cuentas (Accounts)

### 4.1 CRUD de Cuentas
- **Listar**: Obtener cuentas con filtros
- **Obtener**: Ver detalle de cuenta
- **Crear**: Registrar nueva cuenta (vincular a persona opcional)
- **Actualizar**: Modificar datos de cuenta
- **Eliminar**: Desactivar cuenta

### 4.2 Gestión de Acceso
- Username y email (únicos por tenant)
- Password hash (bcrypt)
- Estado: active, inactive, blocked
- Intentos fallidos (lockout automático)
- Último acceso

### 4.3 Asignación de Roles
- Asignar/remover roles a cuentas
- Ver roles de una cuenta

---

## 5. Módulo de Roles (RBAC)

### 5.1 Alcance: tenant vs plataforma

- **Roles de tenant**: definidos en `roles` (con `tenant_id`) y asignados vía `account_roles` a `accounts`. Aplican **solo** a datos de ese tenant.
- **Rol de plataforma**: **`SUPERADMIN`** en `platform_accounts` (sin `tenant_id`). Gestión cross-tenant (creación de tenants, soporte). Detalle en [diccionario de datos](../backend/docs/data-dictionary.md) (`platform_accounts`).

### 5.2 Gestión de Roles (tenant)

- **Listar**: Ver roles disponibles del tenant
- **Crear**: Definir nuevo rol (si el producto permite roles custom además del catálogo fijo)
- **Actualizar**: Modificar nombre/descripción
- **Eliminar**: Desactivar rol

### 5.3 Catálogo de roles por tenant (`roles.code`)

| Código | Descripción |
|--------|-------------|
| ADMIN | Administración del tenant (usuarios, catálogos, reportes del conjunto) |
| OPERATOR | Operación diaria (registros, facturación operativa) |
| GUARD | Portería / control de acceso |
| RESIDENT | Residente (autoservicio) |
| OWNER | Titular de unidad (propietario) |
| LESSEE | Arrendatario / ocupante por contrato |
| VISITOR | Visitante (acceso limitado) |

### 5.4 Rol de plataforma

| Código | Descripción |
|--------|-------------|
| SUPERADMIN | Operador del proveedor; puede actuar sobre cualquier tenant según políticas de API y auditoría |

### 5.5 Permisos por rol (resumen)

- **SUPERADMIN**: creación/configuración global de tenants; no debe mezclarse con el JWT estándar de residentes sin un canal de auth explícito para plataforma.
- **ADMIN**: acceso amplio **dentro de su** `tenant_id` (no otros tenants).
- **OWNER**: gestión de unidades y residentes según política del producto.
- **OPERATOR**: operación y soporte dentro del tenant.
- **RESIDENT** / **LESSEE**: acceso a datos propios y flujos de residente.
- **GUARD**: registro de visitantes, check-in/out.
- **VISITOR**: verificación o portal de visita según reglas.

---

## 6. Módulo Residencial

### 6.1 Apartamentos
- **CRUD**: gestión completa de apartamentos
- **Datos**: torre, número, área, habitaciones, baños, tipo
- **Estados**: available, occupied, maintenance, for_sale
- **Propietario**: vinculación a persona

### 6.2 Residentes
- **CRUD**: gestión de residentes
- **Vinculación**: persona ↔ apartamento
- **Datos**: código de residente, tipo (resident/tenant), fechas de ingreso/salida
- **Estados**: active, inactive

---

## 7. Módulo de Parqueadero

### 7.1 Categorías de Vehículos
- **CRUD**: gestión de categorías
- **Datos**: nombre, descripción, tipo de servicio, tarifa base, fracción mínima
- **Tipos de servicio**: private, public, cargo, official, emergency

### 7.2 Parqueaderos
- **CRUD**: gestión de espacios de parqueo
- **Datos**: capacidad, ubicación, tipo (visitors/residents/mixed/emergency)
- **Horario**: hora de apertura/cierre
- **Estados**: available, full, maintenance, closed

### 7.3 Tarifas
- **CRUD**: gestión de tarifas
- **Datos**: tipo (standard/preferential/night/weekend/holiday), monto mínimo/máximo, fracción
- **Vigencia**: fecha desde/hasta
- **Vínculos**: categoría de vehículo, parqueadero

---

## 8. Módulo de Visitantes

### 8.1 Registro de Visitantes
- **Registro**: crear visitante vinculado a persona
- **Datos**: tipo de visita, vehículo, placa, apartamento a visitar
- **Autorización**: quién autoriza la visita

### 8.2 Control de Acceso
- **Check-in**: registrar ingreso (fecha/hora)
- **Check-out**: registrar salida (fecha/hora)
- **Estados**: active, inactive, expired

### 8.3 Tipos de Visita
| Tipo | Descripción |
|------|-------------|
| frequent | Visitante frecuente |
| occasional | Ocasional |
| service | Servicio (delivery, mantenimiento) |
| emergency | Emergencia |

---

## 9. Módulo de Facturación

### 9.1 Facturas (Invoices)
- **Crear**: generar factura
- **Datos**: total, descuento, impuestos, método de pago
- **Estados**: pending, paid, cancelled, overdue
- **Métodos**: cash, card, bank_transfer, nequi, daviplata

### 9.2 Detalle de Precios (Prices)
- **Vínculo**: factura y/o tarifa
- **Datos**: cantidad, unidad de facturación (hour/day/week/month/event/fraction)
- **Vigencia**: fechas desde/hasta

### 9.3 Generación Automática
- Calcular precio basado en:
  - Tiempo de estancia
  - Tarifa aplicable
  - Categoría de vehículo
  - Parqueadero usado

---

## 10. Módulo de Solicitudes (Requests)

### 10.1 Gestión de Solicitudes
- **Crear**: registrar nueva solicitud
- **Listar**: ver solicitudes con filtros (estado, tipo, fecha)
- **Actualizar**: cambiar estado, agregar respuesta
- **Asignar**: asignar a responsable

### 10.2 Tipos de Solicitud
| Tipo | Descripción |
|------|-------------|
| access | Solicitud de acceso |
| visit | Solicitud de visita |
| service | Solicitud de servicio |
| complaint | Queja |
| claim | Reclamo |

### 10.3 Estados
- pending → approved / rejected
- in_progress → resolved

### 10.4 Datos Adicionales
- Descripción de la solicitud
- Respuesta del responsable
- Fechas: solicitada, respondida

---

## 11. Módulo de Notificaciones

### 11.1 Envío de Notificaciones
- **Crear**: enviar notificación
- **Datos**: título, mensaje, prioridad, canal
- **Destinatario**: persona (recipient)
- **Remitente**: cuenta (sender, opcional)

### 11.2 Canales
| Canal | Descripción |
|-------|-------------|
| email | Correo electrónico |
| sms | Mensaje de texto |
| push | Notificación push |
| app | Notificación en app |

### 11.3 Estados
- unread → read → archived

### 11.4 Tipos
- entry: Ingreso de vehículo
- exit: Salida de vehículo
- payment: Pago recibido
- security: Alerta de seguridad
- maintenance: Notificación de mantenimiento
- general: General

---

## 12. Módulo de PQRs

### 12.1 Gestión de PQRs
- **Crear**: registrar PQR
- **Listar**: ver PQRs con filtros
- **Actualizar**: cambiar estado, agregar respuesta
- **Asignar**: asignar a responsable
- **Evaluar**: agregar puntaje de satisfacción

### 12.2 Tipos de PQR
| Tipo | Descripción |
|------|-------------|
| petition | Petición |
| complaint | Queja |
| claim | Reclamo |
| suggestion | Sugerencia |
| congratulation | Felicitaciones |

### 12.3 Estados
- open → in_progress → resolved / closed / rejected

### 12.4 Prioridades
- low, normal, high, urgent

### 12.5 Satisfacción
- Puntaje: 1-5 estrellas

---

## 13. Funcionalidades Transversales

### 13.1 Búsqueda y Filtros
- Búsqueda por texto en campos relevantes
- Filtros por estado, fecha, tipo
- Paginación de resultados

### 13.2 Validación de Datos
- Validación de tipos de documento
- Validación de emails y teléfonos
- Restricciones por tenant (unicidad)

### 13.3 Auditoría
- Timestamps (created_at, updated_at)
- Registro de cambios relevantes

### 13.4 Multi-Tenancy
- Aislamiento de datos por tenant
- Filtrado automático en consultas

---

## 14. API Reference

### 14.1 Formato de Respuesta
```json
{
  "success": true,
  "data": { ... },
  "message": "Operación exitosa"
}
```

### 14.2 Códigos de Estado
| Código | Descripción |
|--------|-------------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 422 | Unprocessable Entity |
| 500 | Internal Server Error |

### 14.3 Autenticación
- Header: `Authorization: Bearer <token>`
- Token JWT en Swagger

---

## 15. Referencias

- Arquitectura: [docs/architecture.md](./architecture.md)
- Diccionario de datos: [backend/docs/data-dictionary.md](./backend/docs/data-dictionary.md)
- Runbook: [backend/_tmp/runbook-backend.md](./backend/_tmp/runbook-backend.md)