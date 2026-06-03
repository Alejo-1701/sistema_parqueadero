---
name: expert-postgresql
description: "Trigger: PostgreSQL, TypeORM, entity, migration, query, index, relation, DDL, DML. Guía de patrones y mejores prácticas PostgreSQL + TypeORM específicas del proyecto sistema_parqueadero."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

# Expert PostgreSQL + TypeORM — sistema_parqueadero

## Activation Contract

Usar este skill cuando se necesite crear, modificar o revisar entidades TypeORM, migraciones, consultas, índices, o esquemas de base de datos. NO es para lógica de servicios NestJS — eso va a expert-nestjs.

## Convenciones del Proyecto (Extraídas del Código Real)

### 1. Nomenclatura de Entidades

- **Tablas**: plural en snake_case (`residents`, `users`, `parking_spaces`)
- **Columnas**: snake_case con `@Column({ name: 'snake_case' })`
- **Primary Key**: UUID v4 con `@PrimaryGeneratedColumn('uuid')`
- **Timestamps**: `created_at`, `updated_at` con decoradores `@CreateDateColumn` / `@UpdateDateColumn`

```typescript
@Entity('residents')
export class Resident {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'resident_code' })
  residentCode: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

### 2. Enums como Column Type

Usar `type: 'enum'` con un array de valores literales, no TypeScript enums:

```typescript
@Column({
  name: 'resident_type',
  type: 'enum',
  enum: ['resident', 'tenant'],
})
residentType: 'resident' | 'tenant';

@Column({
  type: 'enum',
  enum: ['active', 'inactive'],
  default: 'active',
})
status: 'active' | 'inactive';
```

### 3. Índices Compuestos con tenantId

El patrón multi-tenant requiere índices compuestos con `tenantId`:

```typescript
@Entity('residents')
@Index(['tenantId', 'residentCode'], { unique: true })
@Index(['tenantId', 'personId'])
@Index(['tenantId', 'apartmentId'])
export class Resident {
  @Column({ name: 'tenant_id' })
  tenantId: string;
  // ...
}
```

### 4. Relaciones ManyToOne con JoinColumn Explícito

```typescript
@ManyToOne(() => Tenant)
@JoinColumn({ name: 'tenant_id' })
tenant?: Tenant;

@ManyToOne(() => Person)
@JoinColumn({ name: 'person_id' })
person?: Person;

@ManyToOne(() => Apartment)
@JoinColumn({ name: 'apartment_id' })
apartment?: Apartment;
```

La FK se declara como columna explícita (`tenantId: string`) Y como relación (`tenant?: Tenant`), ambas apuntando al mismo `@JoinColumn({ name: 'tenant_id' })`.

### 5. Columnas Opcionales

```typescript
@Column({ name: 'move_out_date', type: 'date', nullable: true })
moveOutDate?: Date;

@Column({ type: 'text', nullable: true })
notes?: string;
```

### 6. Configuración de Conexión

Desde `database.config.ts`:

```typescript
export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_DATABASE'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: configService.get<string>('NODE_ENV') === 'development',
  logging: configService.get<string>('NODE_ENV') === 'development',
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  migrationsRun: true,
});
```

⚠️ **ADVERTENCIA**: `synchronize: true` SOLO en development. En producción se corre con `migrationsRun: true`.

### 7. Repositorios en Servicios

```typescript
constructor(
  @InjectRepository(Resident)
  private readonly residentRepository: Repository<Resident>,
) {}

// Queries tipadas
async findAll(): Promise<Resident[]> {
  return this.residentRepository.find({
    where: { status: 'active' },
    relations: ['person', 'apartment'],
    order: { createdAt: 'DESC' },
  });
}
```

### 8. Manejo de Errores de PostgreSQL

Códigos de error PostgreSQL capturados:

| Código | Significado | Manejo |
|--------|-------------|--------|
| `23505` | Unique violation | `BadRequestException` con mensaje descriptivo |
| `23503` | Foreign key violation | `BadRequestException` con detalle de la FK violada |

```typescript
if (code === '23503') {
  const detail = driverError?.detail ?? '';
  if (detail.includes('person_id')) {
    throw new BadRequestException('La persona especificada no existe');
  }
}
```

### 9. Fechas con Type Date

Para fechas sin hora (ej: move_in_date), usar `type: 'date'`:

```typescript
@Column({ name: 'move_in_date', type: 'date' })
moveInDate: Date;
```

En los DTOs, recibir como `string` con `@IsDateString()` y TypeORM se encarga de la conversión.

### 10. Migraciones

Las migraciones están en `backend/migrations/`. Se ejecutan automáticamente con `migrationsRun: true`. Para crear una nueva migración:

```bash
npx typeorm migration:create backend/migrations/MigrationName
```

## Reglas NO Negociables

1. **NUNCA** usar `synchronize: true` en producción.
2. **NUNCA** omitir `@JoinColumn` en relaciones — siempre explícito con `name`.
3. **NUNCA** usar `enum` de TypeScript en decoradores — usar arrays literales.
4. **SIEMPRE** declarar FK como columna explícita + relación ManyToOne.
5. **SIEMPRE** agregar índices compuestos con `tenantId` en tablas multi-tenant.
6. **SIEMPRE** usar snake_case para nombres de columnas via `@Column({ name: '...' })`.
7. **NUNCA** exponer entidades directamente al cliente — pasar por DTOs.

## References

- `backend/src/modules/residents/entities/resident.entity.ts` — entidad de referencia
- `backend/src/modules/auth/entities/user.entity.ts` — entidad simple
- `backend/src/config/database.config.ts` — configuración de conexión
- `backend/src/config/app.config.ts` — validación de entorno
- `backend/src/modules/residents/services/resident.service.ts` — patrones de query + error handling
- `backend/.env.example` — variables de entorno requeridas
