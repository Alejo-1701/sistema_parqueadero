# Documentación del Backend (API)

Este componente del sistema está construido con **NestJS**.

## 🛠️ Tecnologías
- **Framework**: NestJS
- **Autenticación**: Passport + JWT
- **Base de Datos**: PostgreSQL + TypeORM
- **Validación**: class-validator + class-transformer

## 📂 Estructura de Carpetas
- `src/common`: Filtros, interceptores y utilidades globales.
- `src/modules`: División modular de la lógica (ej: people, residential, parking).
- `src/modules/.../entities`: Definición de tablas de la BD.
- `src/modules/.../services`: Lógica de negocio.
- `src/modules/.../controllers`: Puntos de entrada de la API.

## ⚙️ Variables de Entorno
Consulta el archivo `.env.example` en la raíz de la carpeta `backend` para ver las variables necesarias.

## 🧪 Pruebas
Puedes ejecutar las pruebas con:
```bash
npm run test        # Pruebas unitarias
npm run test:e2e    # Pruebas de integración
```
