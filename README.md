# Sistema de Parqueadero

Repositorio principal del sistema de gestión de parqueadero, compuesto por:

- `backend`: API REST construida con NestJS, TypeORM y PostgreSQL.
- `frontend`: Aplicación web construida con Angular.

## Arquitectura General

El proyecto está dividido en dos aplicaciones independientes que se ejecutan en paralelo:

- **Frontend (`frontend`)**: interfaz de usuario para gestión operativa.
- **Backend (`backend`)**: servicios API, validaciones, seguridad y acceso a datos.

Comunicación esperada en local:

- Frontend: `http://localhost:4200`
- Backend: `http://localhost:3000/api/v1`

## Requisitos Previos

- Node.js 18 o superior (recomendado Node.js 20+)
- npm 10 o superior
- PostgreSQL (u otro motor compatible según configuración del backend)

## Estructura del Repositorio

```text
sistema-parqueadero/
├── backend/   # API NestJS + TypeORM
└── frontend/  # Cliente Angular
```

## Puesta en Marcha (Desarrollo Local)

### 1) Instalar dependencias

Ejecuta estos comandos desde la raíz del repositorio:

```bash
npm install --prefix backend
npm install --prefix frontend
```

### 2) Configurar variables de entorno del backend

Desde `backend`:

```bash
cp .env.example .env
```

Luego ajusta los valores de base de datos y seguridad en `backend/.env`.

### 3) Levantar backend y frontend

En dos terminales separadas:

```bash
# Terminal 1
cd backend
npm run start:dev
```

```bash
# Terminal 2
cd frontend
npm start
```

## Comandos Útiles

### Backend (`backend`)

```bash
npm run start:dev   # desarrollo con watch
npm run build       # compilación
npm run test        # pruebas unitarias
npm run test:e2e    # pruebas end-to-end
npm run lint        # análisis estático
```

### Frontend (`frontend`)

```bash
npm start           # servidor de desarrollo
npm run build       # compilación
npm run test        # pruebas unitarias
npm run e2e         # pruebas end-to-end
npm run lint        # análisis estático
```

## Documentación Específica

Para detalles avanzados y configuración específica:

- `backend/README.md`
- `frontend/README.md`

## Notas

- Este README es la guía global del monorepo.
- La configuración sensible debe mantenerse fuera del control de versiones (`.env`).
