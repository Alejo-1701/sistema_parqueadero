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

## Configuración de Entorno

El sistema utiliza variables de entorno para una configuración segura y flexible. Sigue estos pasos para configurar tu entorno:

### 1. Configuración Inicial

Copia el archivo de ejemplo y ajusta los valores:

```bash
cp .env.example .env
```

### 2. Variables Obligatorias

Las siguientes variables deben estar definidas en **producción**:

| Variable | Requerida | Descripción |
|----------|-----------|------------|
| `DB_HOST` | ✅ | Host de la base de datos |
| `DB_PORT` | ✅ | Puerto de la base de datos |
| `DB_USERNAME` | ✅ | Usuario de la base de datos |
| `DB_PASSWORD` | ✅ | Contraseña de la base de datos |
| `DB_DATABASE` | ✅ | Nombre de la base de datos |
| `JWT_SECRET` | ✅ | Secreto para firmar tokens |
| `NODE_ENV` | ✅ | Entorno de ejecución |

### 3. Configuración por Entorno

#### Desarrollo (.env)
```env
# Configuración para desarrollo local
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=cambiar_esta_contraseña
DB_DATABASE=sistema_parqueadero

PORT=3000
NODE_ENV=development
API_PREFIX=api/v1

JWT_SECRET=secreto_desarrollo_no_usar_en_prod
JWT_EXPIRES_IN=24h

BCRYPT_ROUNDS=10
THROTTLE_TTL=60
THROTTLE_LIMIT=100

# CORS permisivo para desarrollo
CORS_ORIGINS=http://localhost:4200,http://localhost:3000
```

#### Producción (.env)
```env
# Configuración para producción
DB_HOST=tu-host-de-produccion.com
DB_PORT=5432
DB_USERNAME=usuario_produccion
DB_PASSWORD=contraseña_segura_produccion
DB_DATABASE=sistema_parqueadero_produccion

PORT=3000
NODE_ENV=production
API_PREFIX=api/v1

JWT_SECRET=generar_secreto_aleatorio_muy_seguro
JWT_EXPIRES_IN=24h

BCRYPT_ROUNDS=12
THROTTLE_TTL=60
THROTTLE_LIMIT=10

# CORS restrictivo para producción
CORS_ORIGINS=https://midominio.com,https://api.midominio.com
```

### 4. Validación Automática y Fail-Fast

El sistema implementa validación estricta de variables críticas al iniciar. Si faltan variables obligatorias en producción, el sistema fallará rápido con mensajes claros.

#### Comportamiento en Producción

- ✅ **Validación automática**: Verifica `JWT_SECRET`, `DB_*`, `PORT`, `NODE_ENV` al iniciar
- ✅ **Fail-Fast**: Detiene ejecución inmediatamente si faltan variables críticas
- ✅ **Mensajes claros**: Error específico con lista de variables faltantes
- ✅ **Guías incluidas**: Referencias directas a documentación de configuración

#### Variables Críticas Validadas

| Variable | Requerida | Descripción |
|----------|-----------|------------|
| `JWT_SECRET` | ✅ | Secreto para firmar tokens JWT |
| `DB_HOST` | ✅ | Host de la base de datos |
| `DB_PORT` | ✅ | Puerto de la base de datos |
| `DB_USERNAME` | ✅ | Usuario de la base de datos |
| `DB_PASSWORD` | ✅ | Contraseña de la base de datos |
| `DB_DATABASE` | ✅ | Nombre de la base de datos |
| `PORT` | ✅ | Puerto del servidor |
| `NODE_ENV` | ✅ | Entorno de ejecución |

#### Mensajes de Error

```
❌ Variables de entorno requeridas faltantes: JWT_SECRET, DB_PASSWORD
💡 Configuración requerida: cp .env.example .env
🔧 Guía de configuración: https://github.com/tu-repo/backend/README.md#configuración-de-entorno

Error: ❌ Variables de entorno requeridas faltantes: JWT_SECRET, DB_PASSWORD. El servidor no puede iniciar en producción sin estas variables.
```

#### Características de Seguridad Adicionales

- Validación de formato para variables específicas (PORT numérico, CORS_ORIGINS con URLs válidas)
- Sin fallbacks inseguros para variables sensibles
- Mensajes descriptivos con emojis para fácil identificación

### 5. Configuración de Base de Datos

#### PostgreSQL
1. Crear la base de datos:
```sql
CREATE DATABASE sistema_parqueadero;
```

2. El sistema se conectará automáticamente y sincronizará las tablas en modo desarrollo.

#### MySQL
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
| `THROTTLE_TTL` | Tiempo de vida del límite (segundos) | `60` |
| `THROTTLE_LIMIT` | Límite de peticiones por ventana | `10` |
| `CORS_ORIGINS` | Orígenes permitidos para CORS | `http://localhost:4200` |

## Configuración de Rate Limiting

El sistema incluye protección contra abusos mediante rate limiting configurado globalmente. Para ajustar los límites según tu entorno:

### Desarrollo (.env)
```env
# Límites más permisivos para desarrollo
THROTTLE_TTL=60      # 60 segundos
THROTTLE_LIMIT=100     # 100 peticiones por minuto
```

### Producción (.env)
```env
# Límites más restrictivos para producción
THROTTLE_TTL=60      # 60 segundos
THROTTLE_LIMIT=10      # 10 peticiones por minuto

# CORS restrictivo para producción
CORS_ORIGINS=https://midominio.com,https://api.midominio.com
```

### Personalización por Entorno

Puedes ajustar estos valores según las necesidades específicas de cada entorno:

- **Desarrollo**: Valores más altos para facilitar pruebas
- **Staging**: Valores intermedios para simular producción
- **Producción**: Valores más bajos para protección máxima

El sistema mostrará un mensaje `Too many requests, please try again later` cuando se exceda el límite configurado.

## Configuración de CORS

El sistema incluye configuración segura de CORS con whitelist de orígenes permitidos.

### Variables de Entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `CORS_ORIGINS` | Orígenes permitidos para CORS | `http://localhost:4200` |

### Configuración por Entorno

#### Desarrollo (.env)
```env
# CORS permisivo para desarrollo local
CORS_ORIGINS=http://localhost:4200,http://localhost:3000
```

#### Producción (.env)
```env
# CORS restrictivo para producción
CORS_ORIGINS=https://midominio.com,https://api.midominio.com
```

### Comportamiento

- **Desarrollo**: Se permiten múltiples orígenes locales para facilitar pruebas
- **Producción**: Solo dominios específicos y confiables
- **Credentials**: Solo se habilitan si hay una whitelist definida
- **Seguridad**: No se permite `origin: true` para evitar accesos no deseados

### Ejemplos de Configuración

```typescript
// app.config.ts - Configuración dinámica
cors: {
  origins: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['http://localhost:4200'],
  credentials: process.env.CORS_ORIGINS ? true : false,
}

// main.ts - Aplicación segura
app.enableCors({
  origin: configService.get('cors.origins'),
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type, Authorization',
  credentials: configService.get('cors.credentials', false),
});
```

## Notas Importantes

- En modo desarrollo, las tablas se sincronizan automáticamente (`synchronize: true`)
- Para producción, desactiva la sincronización automática y usa migraciones
- Los mensajes de error y respuestas están configurados en español
- La API incluye validación automática de datos de entrada

## Soporte

Para problemas o preguntas, contacta al equipo de desarrollo.
