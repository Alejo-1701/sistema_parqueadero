# SDD Tasks: Módulo de Residentes

## Review Workload Forecast

- **Estimated changed lines**: ~250 (6 files created + 1 modified)
- **400-line budget risk**: Low ✅
- **Chained PRs recommended**: No (single PR is fine)
- **Decision needed before apply**: No

---

## Task List

### T1: Crear entidad Resident

**File:** `backend/src/modules/residents/entities/resident.entity.ts`

**Definition of Done:**
- [x] Archivo creado con `@Entity('residents')`
- [ ] Decorador `@Index(['tenantId', 'residentCode'], { unique: true })`
- [ ] Decorador `@Index(['tenantId', 'personId'])`
- [ ] Decorador `@Index(['tenantId', 'apartmentId'])`
- [ ] `@PrimaryGeneratedColumn('uuid') id`
- [ ] `@Column({ name: 'tenant_id' }) tenantId`
- [ ] `@Column({ name: 'resident_code' }) residentCode`
- [ ] `@Column({ name: 'resident_type', type: 'enum', enum: ['resident', 'tenant'] }) residentType`
- [ ] `@Column({ name: 'person_id' }) personId`
- [ ] `@Column({ name: 'apartment_id' }) apartmentId`
- [ ] `@Column({ name: 'move_in_date', type: 'date' }) moveInDate`
- [ ] `@Column({ name: 'move_out_date', type: 'date', nullable: true }) moveOutDate`
- [ ] `@Column({ type: 'enum', enum: ['active', 'inactive'], default: 'active' }) status`
- [ ] `@Column({ type: 'text', nullable: true }) notes`
- [ ] `@CreateDateColumn({ name: 'created_at' }) createdAt`
- [ ] `@UpdateDateColumn({ name: 'updated_at' }) updatedAt`
- [ ] `@ManyToOne(() => Tenant) @JoinColumn({ name: 'tenant_id' }) tenant`
- [ ] `@ManyToOne(() => Person) @JoinColumn({ name: 'person_id' }) person`
- [ ] `@ManyToOne(() => Apartment) @JoinColumn({ name: 'apartment_id' }) apartment`
- [ ] Build pasa sin errores

**Dependencies:** Ninguna

**Verification:** `npm run build` desde `backend/`

---

### T2: Crear migración de residents

**File:** `backend/migrations/1700000000008-CreateResidents.ts`

**Definition of Done:**
- [ ] Clase `CreateResidents1700000000008` implements `MigrationInterface`
- [ ] `up()` usa `queryRunner.createTable(new Table({...}))`
- [ ] Columnas: id (uuid PK), tenant_id, resident_code, resident_type, person_id, apartment_id, move_in_date, move_out_date, status, notes, created_at, updated_at
- [ ] FK: `tenant_id → tenants(id) ON DELETE RESTRICT`
- [ ] FK: `person_id → people(id) ON DELETE CASCADE`
- [ ] FK: `apartment_id → apartments(id) ON DELETE RESTRICT`
- [ ] CHECK: `resident_type IN ('resident','tenant')`
- [ ] CHECK: `status IN ('active','inactive')`
- [ ] UNIQUE INDEX: `(tenant_id, resident_code)`
- [ ] INDEX: `(tenant_id, person_id)`
- [ ] INDEX: `(tenant_id, apartment_id)`
- [ ] `down()` usa `queryRunner.dropTable('residents')`
- [ ] Build pasa sin errores

**Dependencies:** T1 (la migración referencia la misma estructura)

**Verification:** `npm run build && npm run migration:run` (opcional, solo si hay DB conectada)

---

### T3: Crear DTOs de Resident

**File:** `backend/src/modules/residents/dto/resident.dto.ts`

**Definition of Done:**
- [ ] `CreateResidentDto` con todos los campos requeridos (`@IsString`, `@IsUUID`, `@IsDateString`, `@IsEnum`)
- [ ] `UpdateResidentDto` con todos los campos opcionales (`@IsOptional` en cada uno)
- [ ] `residentType` validado con `@IsEnum(['resident', 'tenant'])`
- [ ] `status` validado con `@IsEnum(['active', 'inactive'])`
- [ ] Build pasa sin errores

**Dependencies:** Ninguna

**Verification:** `npm run build` desde `backend/`

---

### T4: Crear servicio de Resident

**File:** `backend/src/modules/residents/services/resident.service.ts`

**Definition of Done:**
- [ ] `@Injectable()` class `ResidentService`
- [ ] Inyecta `@InjectRepository(Resident) private residentRepository: Repository<Resident>`
- [ ] `findAll(status?, residentType?, apartmentId?)`: query con filtros opcionales, incluye `relations: ['person', 'apartment']`
- [ ] `findOne(id)`: busca por id con `relations: ['person', 'apartment', 'tenant']`
- [ ] `create(dto)`: `this.residentRepository.create(dto)` + `.save()`
- [ ] `update(id, dto)`: `this.residentRepository.preload({ id, ...dto })` + `.save()`
- [ ] `remove(id)`: `this.residentRepository.update(id, { status: 'inactive' })` (soft-delete)
- [ ] Build pasa sin errores

**Dependencies:** T1 (necesita la entidad Resident)

**Verification:** `npm run build` desde `backend/`

---

### T5: Crear controlador de Resident

**File:** `backend/src/modules/residents/controllers/resident.controller.ts`

**Definition of Done:**
- [ ] `@Controller('residents')` class `ResidentController`
- [ ] Inyecta `ResidentService`
- [ ] `@Get()` `findAll()` con `@Query()` params opcionales
- [ ] `@Get(':id')` `findOne()` con `@Param('id', ParseUUIDPipe)`
- [ ] `@Post()` `create()` con `@Body() dto: CreateResidentDto`
- [ ] `@Patch(':id')` `update()` con `@Param('id', ParseUUIDPipe)` y `@Body() dto: UpdateResidentDto`
- [ ] `@Delete(':id')` `remove()` con `@Param('id', ParseUUIDPipe)`
- [ ] Manejo de errores: 404 si `findOne` devuelve null, 400 si hay duplicados/FK errors
- [ ] Build pasa sin errores

**Dependencies:** T3, T4 (necesita DTOs y Service)

**Verification:** `npm run build` desde `backend/`

---

### T6: Crear módulo ResidentsModule

**File:** `backend/src/modules/residents/residents.module.ts`

**Definition of Done:**
- [ ] `@Module({ imports: [TypeOrmModule.forFeature([Resident])], controllers: [ResidentController], providers: [ResidentService], exports: [ResidentService] })`
- [ ] Importa `TypeOrmModule.forFeature([Resident])`
- [ ] Registra `ResidentController` y `ResidentService`
- [ ] Exporta `ResidentService`
- [ ] Build pasa sin errores

**Dependencies:** T1, T4, T5 (necesita Entity, Service, Controller)

**Verification:** `npm run build` desde `backend/`

---

### T7: Registrar ResidentsModule en AppModule

**File:** `backend/src/app.module.ts`

**Definition of Done:**
- [ ] Importa `ResidentsModule` de `./modules/residents/residents.module`
- [ ] Agrega `ResidentsModule` al array `imports` después de `ResidentialModule`
- [ ] Build pasa sin errores

**Dependencies:** T6 (necesita que ResidentsModule exista)

**Verification:** `npm run build` desde `backend/`

---

## Task Dependency Graph

```
T1 (Entity) ──→ T2 (Migration)
T1 ──→ T4 (Service)
T3 (DTOs) ──→ T5 (Controller)
T4 (Service) ──→ T5
T1, T4, T5 ──→ T6 (Module)
T6 ──→ T7 (AppModule registration)
```

## Recommended Apply Order

1. T1 (Entity) + T3 (DTOs) — paralelo
2. T2 (Migration) — después de T1
3. T4 (Service) — después de T1
4. T5 (Controller) — después de T3 + T4
5. T6 (Module) — después de T1 + T4 + T5
6. T7 (AppModule) — después de T6
