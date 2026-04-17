# Documentación del Proyecto: Sistema de Parqueadero

Este proyecto es un sistema integral para la gestión de parqueaderos residenciales, desarrollado con una arquitectura moderna de **NestJS** en el backend y **Angular** en el frontend.

## 🚀 Arquitectura del Proyecto

El sistema se divide en dos componentes principales:

### 1. Backend (NestJS)
Ubicado en la carpeta `/backend`.
- **Framework**: NestJS (Node.js).
- **Lenguaje**: TypeScript.
- **Base de Datos**: PostgreSQL.
- **ORM**: TypeORM.
- **Autenticación**: JWT (JSON Web Tokens).

### 2. Frontend (Angular)
Ubicado en la carpeta `/frontend`.
- **Framework**: Angular 19.
- **Estilos**: Tailwind CSS / Vanilla CSS.
- **Estado**: RxJS.

---

## 🛠️ Instalación y Configuración

### Requisitos Previos
- Node.js (v18 o superior)
- PostgreSQL corriendo localmente o en la nube.
- Angular CLI (`npm install -g @angular/cli`).

### Configuración del Backend
1. Entra a la carpeta: `cd backend`
2. Instala dependencias: `npm install`
3. Configura el entorno:
   - Copia `.env.example` a `.env`.
   - Ajusta las credenciales de la base de datos en `.env`.
4. Ejecuta en desarrollo: `npm run start:dev`

### Configuración del Frontend
1. Entra a la carpeta: `cd frontend`
2. Instala dependencias: `npm install`
3. Ejecuta en desarrollo: `npm start` (o `ng serve`)
4. Accede a: `http://localhost:4200`

---

## 🌐 Configuración de la API

El frontend está configurado para conectarse al backend en la siguiente dirección (por defecto):
- **URL**: `http://localhost:3000/api/v1`

Puedes modificar esta configuración en:
`frontend/src/environments/environment.ts`

---

## 📁 Estructura del Repositorio

```text
/
├── backend/          # Código fuente del servidor NestJS
│   ├── src/          # Módulos, entidades y lógica de negocio
│   └── test/         # Pruebas unitarias y e2e
├── frontend/         # Código fuente de la aplicación Angular
│   ├── src/          # Componentes, servicios y vistas
│   └── public/       # Recursos estáticos
└── docs/             # Documentación detallada del proyecto
```

---

## ✅ Recomendaciones de Seguridad (Git)
Para mantener el repositorio limpio y seguro:
- **NUNCA** subas el archivo `.env`.
- Asegúrate de que `node_modules` y `dist` no se rastreen (revisa tus archivos `.gitignore`).
