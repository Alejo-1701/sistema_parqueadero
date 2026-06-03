# SDD Design: Módulo de Residentes

## Arquitectura

El módulo sigue el patrón **Controller → Service → Repository (TypeORM)** establecido en los módulos existentes (people, residential, parking).

```
HTTP Request
  → [Global] ValidationPipe (class-validator)
    → ResidentController
      → ResidentService (inyecta Repository<Resident>)
        → TypeORM Entity Resident
          → PostgreSQL table: residents
```

No se introducen nuevas capas (como CQRS, eventos, etc.). Se mantiene la arquitectura actual del proyecto.

---

## Estructura de archivos

```
backend/src/modules/residents/
├── controllers/
│   └── resident.controller.ts
├── dto/
│   └── resident.dto.ts
├── entities/
│   └── resident.entity.ts
├── services/
│   └── resident.service.ts
└── residents.module.ts

backend/migrations/
└── 1700000000008-CreateResidents.ts
```

---

## Entity Design

### `Resident`

```typescript
@Entity('residents')
@Index(['tenantId', 'residentCode'], { unique: true })
@Index(['tenantId', 'personId'])
@Index(['tenantId', 'apartmentId'])
export class Resident {
  id: string;                    // UUID PK
  tenantId: string;              // FK → tenants
  residentCode: string;          // VARCHAR(20), unique por tenant
  residentType: 'resident' | 'tenant';
  personId: string;              // FK → people (CASCADE)
  apartmentId: string;           // FK → apartments (RESTRICT)
  moveInDate: Date;              // DATE required
  moveOutDate?: Date;            // DATE nullable
  status: 'active' | 'inactive'; // DEFAULT 'active'
  notes?: string;                // TEXT nullable
  createdAt: Date;
  updatedAt: Date;

  // Relations (read-only, for queries)
  tenant?: Tenant;
  person?: Person;
  apartment?: Apartment;
}
```

**Decisiones:**
- `person_id` ON DELETE CASCADE: si se elimina la persona, el residente se elimina automáticamente (no tiene sentido un residente sin persona).
- `apartment_id` ON DELETE RESTRICT: no permitir eliminar un apartamento que tiene residentes activos. Forzar desocupación manual primero.
- `tenant_id` ON DELETE RESTRICT: mismo criterio que el resto del sistema, no eliminar tenants con datos.
- `resident_code` se valida único por tenant, no global.

---

## DTO Design

### `CreateResidentDto`

```typescript
class CreateResidentDto {
  @IsString()
  residentCode: string;

  @IsEnum(['resident', 'tenant'])
  residentType: 'resident' | 'tenant';

  @IsUUID()
  personId: string;

  @IsUUID()
  apartmentId: string;

  @IsDateString()
  moveInDate: string;

  @IsOptional()
  @IsDateString()
  moveOutDate?: string;

  @IsOptional()
  @IsEnum(['active', 'inactive'])
  status?: 'active' | 'inactive';

  @IsOptional()
  @IsString()
  notes?: string;
}
```

### `UpdateResidentDto`

Mismos campos, todos opcionales (`@IsOptional()` en cada uno).

**Decisión:** Usar `@IsDateString()` (ISO 8601) en vez de `@IsDate()` para aceptar strings desde JSON sin necesidad de transformación manual. El `ValidationPipe` global se encarga del parseo.

---

## Service Design

`ResidentService` con inyección estándar:

```typescript
@Injectable()
class ResidentService {
  constructor(
    @InjectRepository(Resident)
    private readonly residentRepository: Repository<Resident>,
  ) {}
}
```

### Métodos

| Método | Query | Relaciones incluidas |
|---|---|---|
| `findAll(filters?)` | `repository.find({ where, relations, order })` | person, apartment |
| `findOne(id)` | `repository.findOne({ where: { id }, relations })` | person, apartment, tenant |
| `create(dto)` | `repository.create() + save()` | — |
| `update(id, dto)` | `repository.preload() + save()` | — |
| `remove(id)` | `repository.update(id, { status: 'inactive' })` | — |

**Filtros para `findAll`:**
- `status?` → `{ status }`
- `residentType?` → `{ residentType }`
- `apartmentId?` → `{ apartmentId }`

**Manejo de errores:**
- `findOne` devuelve `null` si no existe → controller retorna 404
- `create` puede lanzar `QueryFailedError` por unique/FK constraints → catch y convertir a 400 amigable
- `remove` es soft-delete (set status = 'inactive'), no DELETE físico

---

## Controller Design

```typescript
@Controller('residents')
@ApiTags('Residents')
export class ResidentController {
  constructor(private readonly residentService: ResidentService) {}

  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('resident_type') residentType?: string,
    @Query('apartment_id') apartmentId?: string,
  ): Promise<ApiResponse<Resident[]>>

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ApiResponse<Resident>>

  @Post()
  create(@Body(new ValidationPipe()) dto: CreateResidentDto): Promise<ApiResponse<Resident>>

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ValidationPipe()) dto: UpdateResidentDto,
  ): Promise<ApiResponse<Resident>>

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<ApiResponse<Resident>>
}
```

**Decisión:** El `@ApiTags` asume que Swagger está configurado (Issue #17 resuelto). El `ParseUUIDPipe` valida que los parámetros ID sean UUIDs válidos antes de llegar al servicio.

---

## Migration Design

La migración usa la misma API de TypeORM `Table` que las migraciones existentes:

```
1700000000008-CreateResidents.ts
```

### Columnas
Todas las del diccionario de datos.

### Foreign Keys
| Column(s) | Referenced Table | On Delete |
|---|---|---|
| `tenant_id` | `tenants(id)` | RESTRICT |
| `person_id` | `people(id)` | CASCADE |
| `apartment_id` | `apartments(id)` | RESTRICT |

### Check Constraints
| Nombre | Condición |
|---|---|
| `CHK_residents_type` | `resident_type IN ('resident', 'tenant')` |
| `CHK_residents_status` | `status IN ('active', 'inactive')` |

### Índices
| Nombre | Columnas | Unique |
|---|---|---|
| `UQ_residents_tenant_code` | `(tenant_id, resident_code)` | Sí |
| `IDX_residents_tenant_person` | `(tenant_id, person_id)` | No |
| `IDX_residents_tenant_apartment` | `(tenant_id, apartment_id)` | No |

---

## Module Registration

```typescript
// backend/src/app.module.ts
import { ResidentsModule } from './modules/residents/residents.module';

@Module({
  imports: [
    // ... existing imports
    ResidentialModule,
    ResidentsModule,  // <-- agregar después de ResidentialModule
    ParkingModule,
  ],
})
```

**Orden:** después de `ResidentialModule` y antes de `ParkingModule`, para reflejar la cadena de dependencias (Resident → Apartment).

---

## Flujo de datos

### Crear residente
```
POST /residents
  → ValidationPipe valida CreateResidentDto
  → ResidentController.create()
    → ResidentService.create(dto)
      → residentRepository.create(dto)  // crea instancia
      → residentRepository.save(resident)  // persiste
        → PostgreSQL INSERT (SQL: FK checks, unique check)
      ← resident (con id, timestamps)
    ← Resident
  ← 201 { success: true, data: resident }
```

### Error: código duplicado
```
POST /residents (mismo resident_code en mismo tenant)
  → ... save()
    → PostgreSQL unique violation (code 23505)
    → QueryFailedError
  ← Catch en controller → 400 "El código de residente ya existe"
```

### Error: FK violada
```
POST /residents (personId inexistente)
  → ... save()
    → PostgreSQL FK violation (code 23503)
    → QueryFailedError
  ← Catch en controller → 400 "Persona no encontrada"
```
