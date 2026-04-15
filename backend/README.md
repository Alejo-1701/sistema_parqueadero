<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Sistema de Parqueadero - Backend

Backend del sistema de gestión de parqueadero construido con NestJS, TypeScript y TypeORM.

## Características

- ✅ Arquitectura modular con NestJS
- ✅ TypeScript para tipado seguro
- ✅ TypeORM para gestión de base de datos
- ✅ Configuración de variables de entorno
- ✅ Global prefix `/api/v1`
- ✅ Manejo global de excepciones
- ✅ Interceptor para respuestas estandarizadas
- ✅ Validación de datos con class-validator
- ✅ Rate limiting para protección contra abusos

## Requisitos Previos

- Node.js (v18 o superior)
- PostgreSQL o MySQL
- npm o yarn

## Instalación

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
cd sistema_parqueadero/backend
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```

4. Editar el archivo `.env` con la configuración de tu base de datos:
```env
# Configuración de Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_contraseña
DB_DATABASE=sistema_parqueadero

# Configuración de la Aplicación
PORT=3000
NODE_ENV=development
API_PREFIX=api/v1

# Configuración JWT
JWT_SECRET=tu_secreto_jwt_cambiar_en_produccion
JWT_EXPIRES_IN=24h

# Seguridad
BCRYPT_ROUNDS=10

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=10
```

## Configuración de Base de Datos

### PostgreSQL
1. Crear la base de datos:
```sql
CREATE DATABASE sistema_parqueadero;
```

2. El sistema se conectará automáticamente y sincronizará las tablas en modo desarrollo.

### MySQL
1. Crear la base de datos:
```sql
CREATE DATABASE sistema_parqueadero;
```

2. Modificar el archivo `src/config/database.config.ts` para usar MySQL:
```typescript
export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'mysql', // Cambiar a mysql
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_DATABASE'),
  // ... resto de la configuración
});
```

## Ejecución del Proyecto

```bash
# Modo desarrollo (con watch)
npm run start:dev

# Modo normal
npm run start

# Modo producción
npm run start:prod
```

El servidor se iniciará en: `http://localhost:3000/api/v1`

## Verificación de Conexión

El sistema verificará automáticamente la conexión a la base de datos al iniciar. Si la conexión falla, verás mensajes de error en la consola indicando el problema.

## Estructura del Proyecto

```
src/
├── common/                 # Componentes compartidos
│   ├── filters/            # Filtros de excepciones
│   ├── guards/             # Guards de seguridad
│   ├── interceptors/      # Interceptores
│   └── pipes/              # Pipes de validación
├── config/                 # Configuración
│   ├── app.config.ts
│   └── database.config.ts
├── modules/                # Módulos de negocio
│   ├── auth/
│   ├── usuarios/
│   ├── vehiculos/
│   ├── parqueadero/
│   └── entrada-salida/
├── app.module.ts
└── main.ts
```

## Scripts Disponibles

```bash
# Desarrollo
npm run start:dev          # Inicia en modo watch
npm run start:debug        # Inicia en modo debug

# Producción
npm run build              # Compila el proyecto
npm run start:prod         # Inicia versión compilada

# Calidad de código
npm run lint               # Ejecuta ESLint
npm run format             # Formatea código con Prettier

# Pruebas
npm run test               # Ejecuta pruebas unitarias
npm run test:e2e           # Ejecuta pruebas e2e
npm run test:cov           # Ejecuta pruebas con cobertura
```

## Endpoints Principales

- `GET /api/v1` - Endpoint de prueba
- `POST /api/v1/usuarios` - Crear usuario
- `GET /api/v1/usuarios` - Listar usuarios
- `GET /api/v1/usuarios/:id` - Obtener usuario por ID

## Variables de Entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `DB_HOST` | Host de la base de datos | `localhost` |
| `DB_PORT` | Puerto de la base de datos | `5432` |
| `DB_USERNAME` | Usuario de la base de datos | `postgres` |
| `DB_PASSWORD` | Contraseña de la base de datos | `password` |
| `DB_DATABASE` | Nombre de la base de datos | `sistema_parqueadero` |
| `PORT` | Puerto del servidor | `3000` |
| `NODE_ENV` | Entorno de ejecución | `development` |
| `API_PREFIX` | Prefijo de la API | `api/v1` |

## Notas Importantes

- En modo desarrollo, las tablas se sincronizan automáticamente (`synchronize: true`)
- Para producción, desactiva la sincronización automática y usa migraciones
- Los mensajes de error y respuestas están configurados en español
- La API incluye validación automática de datos de entrada

## Soporte

Para problemas o preguntas, contacta al equipo de desarrollo.
