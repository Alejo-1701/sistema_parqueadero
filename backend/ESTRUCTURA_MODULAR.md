# Estructura Modular del Backend

## Convención de Organización

El backend sigue una estructura modular por dominio de negocio para facilitar el mantenimiento y escalabilidad.

## 📁 Estructura Base

```
backend/src/
├── common/                 # Componentes compartidos entre módulos
│   ├── guards/            # Guards de autenticación y autorización
│   ├── interceptors/      # Interceptores HTTP globales
│   ├── filters/          # Filtros de excepciones
│   └── pipes/           # Pipes de validación
├── config/                 # Configuración de aplicación y base de datos
├── modules/                # Módulos por dominio de negocio
│   ├── auth/             # Autenticación y gestión de usuarios
│   ├── people/            # Gestión de personas
│   ├── residential/       # Gestión de unidades residenciales
│   ├── parking/           # Gestión de parqueadero
│   ├── billing/           # Facturación y pagos
│   ├── pqr/              # Peticiones, quejas y reclamos
│   └── notifications/     # Sistema de notificaciones
├── app.module.ts           # Módulo principal de la aplicación
└── main.ts                # Punto de entrada de la aplicación
```

## 🏗️ Estructura por Módulo

Cada módulo de negocio sigue la siguiente estructura estándar:

```
modules/{modulo}/
├── controllers/           # Controladores HTTP
│   └── {modulo}.controller.ts
├── services/              # Lógica de negocio
│   └── {modulo}.service.ts
├── dto/                   # Data Transfer Objects
│   └── {modulo}.dto.ts
├── entities/              # Entidades de base de datos
│   └── {entidad}.entity.ts
├── guards/                # Guards específicos del módulo (opcional)
│   └── {modulo}.guard.ts
└── {modulo}.module.ts      # Módulo de NestJS
```

## 📋 Módulos Implementados

### ✅ auth
- **Propósito**: Autenticación y gestión de usuarios
- **Entidades**: User
- **DTOs**: LoginDto, RegisterDto, ProfileDto
- **Controllers**: AuthController
- **Services**: AuthService
- **Guards**: AuthGuard

### ✅ parking
- **Propósito**: Gestión de espacios de parqueadero
- **Entidades**: ParkingSpace, ParkingRecord
- **DTOs**: CreateParkingDto, UpdateParkingDto, EntryDto, ExitDto
- **Controllers**: ParkingController
- **Services**: ParkingService

### ✅ people
- **Propósito**: Gestión de personas
- **Entidades**: Person
- **DTOs**: CreatePersonDto, UpdatePersonDto
- **Controllers**: PersonController
- **Services**: PersonService

### 🚧 En Desarrollo
- **residential**: Gestión de unidades residenciales
- **billing**: Facturación y pagos
- **pqr**: Peticiones, quejas y reclamos
- **notifications**: Sistema de notificaciones

## 🔧 Cómo Crear un Nuevo Módulo

1. **Crear estructura de carpetas**:
   ```bash
   mkdir -p modules/{modulo}/{controllers,services,dto,entities,guards}
   ```

2. **Crear archivos base**:
   - **entities/{entidad}.entity.ts**: Definición de entidad TypeORM
   - **dto/{modulo}.dto.ts**: DTOs para validación
   - **services/{modulo}.service.ts**: Lógica de negocio
   - **controllers/{modulo}.controller.ts**: Controladores HTTP
   - **guards/{modulo}.guard.ts**: Guards específicos (opcional)
   - **{modulo}.module.ts**: Módulo de NestJS

3. **Ejemplo de Entidad**:
   ```typescript
   import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

   @Entity('table_name')
   export class EntityName {
     @PrimaryGeneratedColumn('uuid')
     id: string;

     @Column()
     campo: string;

     @CreateDateColumn()
     createdAt: Date;

     @UpdateDateColumn()
     updatedAt: Date;
   }
   ```

4. **Ejemplo de DTO**:
   ```typescript
   import { IsString, IsEmail, IsOptional } from 'class-validator';

   export class CreateDto {
     @IsString()
     campo: string;

     @IsOptional()
     @IsString()
     opcional?: string;
   }
   ```

5. **Ejemplo de Servicio**:
   ```typescript
   import { Injectable } from '@nestjs/common';
   import { InjectRepository } from '@nestjs/typeorm';
   import { Repository } from 'typeorm';
   import { Entity } from '../entities/entity.entity';

   @Injectable()
   export class EntityService {
     constructor(
       @InjectRepository(Entity)
       private readonly entityRepository: Repository<Entity>,
     ) {}

     async findAll(): Promise<Entity[]> {
       return this.entityRepository.find();
     }

     async create(createDto: any): Promise<Entity> {
       const entity = this.entityRepository.create(createDto);
       return this.entityRepository.save(entity);
     }
   }
   ```

6. **Ejemplo de Controlador**:
   ```typescript
   import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';

   @Controller('entity')
   export class EntityController {
     @Get()
     async findAll() {
       return { message: 'Obtener todos' };
     }

     @Post()
     async create(@Body() createDto: any) {
       return { message: 'Crear entidad' };
     }
   }
   ```

7. **Ejemplo de Módulo**:
   ```typescript
   import { Module } from '@nestjs/common';
   import { TypeOrmModule } from '@nestjs/typeorm';
   import { EntityController } from './controllers/entity.controller';
   import { EntityService } from './services/entity.service';
   import { Entity } from './entities/entity.entity';

   @Module({
     imports: [TypeOrmModule.forFeature([Entity])],
     controllers: [EntityController],
     providers: [EntityService],
     exports: [EntityService],
   })
   export class EntityModule {}
   ```

## 📝 Reglas y Convenciones

- **Nomenclatura**: Usar kebab-case para nombres de archivos y carpetas
- **Entidades**: Sufijo `.entity.ts`
- **DTOs**: Sufijo `.dto.ts`
- **Servicios**: Sufijo `.service.ts`
- **Controladores**: Sufijo `.controller.ts`
- **Módulos**: Sufijo `.module.ts`
- **Guards**: Sufijo `.guard.ts` (opcional)

## 🚀 Beneficios

1. **Escalabilidad**: Fácil agregar nuevos módulos de negocio
2. **Mantenimiento**: Código organizado por dominio
3. **Colaboración**: Equipos pueden trabajar en módulos diferentes sin conflictos
4. **Testing**: Cada módulo puede tener sus pruebas unitarias
5. **Reutilización**: Componentes compartidos en `common/`

Esta estructura permite que el proyecto crezca de manera ordenada y mantenible a largo plazo.
