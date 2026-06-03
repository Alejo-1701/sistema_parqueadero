---
name: expert-nestjs
description: "Trigger: NestJS, module, service, controller, guard, DTO, TypeORM, Swagger, JWT. Guía de patrones y mejores prácticas NestJS 11 específicas del proyecto sistema_parqueadero."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

# Expert NestJS 11 — sistema_parqueadero

## Activation Contract

Usar este skill cuando se necesite crear, modificar o revisar código del backend NestJS del proyecto. NO es para decisiones de base de datos — eso va a expert-postgresql.

## Convenciones del Proyecto (Extraídas del Código Real)

### 1. Estructura de Módulos (OBLIGATORIO)

```
src/modules/{feature}/
├── {feature}.module.ts
├── controllers/
│   └── {name}.controller.ts
├── services/
│   └── {name}.service.ts
├── entities/
│   └── {name}.entity.ts
└── dto/
    └── {name}.dto.ts
```

### 2. Feature Module con TypeORM

```typescript
@Module({
  imports: [TypeOrmModule.forFeature([Resident])],
  controllers: [ResidentController],
  providers: [ResidentService],
  exports: [ResidentService],
})
export class ResidentsModule {}
```

### 3. Controladores con Swagger

```typescript
@ApiTags('residents')
@Controller('residents')
export class ResidentController {
  constructor(private readonly residentService: ResidentService) {}

  @Get()
  findAll(
    @Query('status') status?: string,
  ): Promise<Resident[]> {
    return this.residentService.findAll(status);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Resident> {
    const resident = await this.residentService.findOne(id);
    if (!resident) throw new NotFoundException('Residente no encontrado');
    return resident;
  }

  @Post()
  @ApiOperation({ summary: 'Crear residente' })
  @ApiResponse({ status: 201, description: 'Creado exitosamente' })
  create(@Body() dto: CreateResidentDto): Promise<Resident> {
    return this.residentService.create(dto);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateResidentDto,
  ): Promise<Resident> {
    const resident = await this.residentService.update(id, dto);
    if (!resident) throw new NotFoundException('Residente no encontrado');
    return resident;
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    const resident = await this.residentService.findOne(id);
    if (!resident) throw new NotFoundException('Residente no encontrado');
    await this.residentService.remove(id);
  }
}
```

### 4. Servicios con Inyección de Dependencias

```typescript
@Injectable()
export class ResidentService {
  constructor(
    @InjectRepository(Resident)
    private readonly residentRepository: Repository<Resident>,
  ) {}

  async findAll(status?: string): Promise<Resident[]> {
    const where: Record<string, string> = {};
    if (status) where.status = status;
    return this.residentRepository.find({
      where,
      relations: ['person', 'apartment'],
      order: { createdAt: 'DESC' },
    });
  }
}
```

Patrón clave: `saveWithErrorHandling` para manejar errores de PostgreSQL:

```typescript
private async saveWithErrorHandling(entity: Resident): Promise<Resident> {
  try {
    return await this.residentRepository.save(entity);
  } catch (error) {
    if (error instanceof QueryFailedError) {
      const driverError = error as any;
      const code = driverError?.code ?? driverError?.driverError?.code;
      if (code === '23505') {
        throw new BadRequestException('El código ya existe en este tenant');
      }
      if (code === '23503') {
        throw new BadRequestException('Entidad relacionada no encontrada');
      }
    }
    throw error;
  }
}
```

### 5. DTOs con class-validator

```typescript
import { IsString, IsOptional, IsEnum, IsUUID, IsDateString } from 'class-validator';

export class CreateResidentDto {
  @IsString()
  residentCode: string;

  @IsEnum(['resident', 'tenant'])
  residentType: 'resident' | 'tenant';

  @IsUUID()
  personId: string;

  @IsDateString()
  moveInDate: string;

  @IsOptional()
  @IsDateString()
  moveOutDate?: string;
}
```

Siempre separar Create/Update DTOs. Update usa `@IsOptional()` en todos los campos.

### 6. Validación Global

Configurada en `main.ts` con whitelist + forbidNonWhitelisted + transform:

```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
);
```

### 7. AuthGuard con JWT

```typescript
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) return false;
    try {
      const payload = this.jwtService.verify(token);
      return !!payload;
    } catch {
      return false;
    }
  }
}
```

Usar `@UseGuards(AuthGuard)` o `@ApiBearerAuth()` según el endpoint.

### 8. Rate Limiting Global

```typescript
// En app.module.ts
ThrottlerModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => [{
    ttl: configService.get<number>('THROTTLE_TTL', 60),
    limit: configService.get<number>('THROTTLE_LIMIT', 10),
  }],
  inject: [ConfigService],
}),
```

### 9. Response Interceptor Unificado

Todas las respuestas pasan por `ResponseInterceptor` que envuelve en `{ success, statusCode, message, data, timestamp, path }`.

### 10. Manejo de Errores

`HttpExceptionFilter` captura todas las excepciones y devuelve `{ success: false, statusCode, message, timestamp, path, method }`.

## Reglas NO Negociables

1. **NUNCA** poner lógica de negocio en controladores — todo en servicios.
2. **NUNCA** exponer entidades directamente — siempre usar DTOs.
3. **SIEMPRE** usar `@IsOptional()` en todos los campos de Update DTOs.
4. **SIEMPRE** usar `ParseUUIDPipe` en parámetros `:id`.
5. **SIEMPRE** validar existencia antes de operar (NotFoundException si no existe).
6. **SIEMPRE** capturar errores de base de datos con `saveWithErrorHandling`.
7. **NUNCA** usar `synchronize: true` en producción — solo en development.

## References

- `backend/src/main.ts` — bootstrap, pipes globales, interceptors, swagger, cors
- `backend/src/app.module.ts` — módulo raíz, imports globales
- `backend/src/modules/residents/` — módulo de ejemplo completo (entity, controller, service, dto)
- `backend/src/modules/auth/` — módulo de autenticación (JWT, guards)
- `backend/src/common/filters/http-exception.filter.ts` — manejo de errores
- `backend/src/common/interceptors/response.interceptor.ts` — formato de respuesta
- `backend/src/config/app.config.ts` — validación de entorno
