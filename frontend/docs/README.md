# Documentación del Frontend (Aplicación Web)

Este componente del sistema está construido con **Angular**.

## 🛠️ Tecnologías
- **Framework**: Angular 19
- **Estado**: RxJS (Observables)
- **Estilos**: Tailwind CSS / Vanilla CSS
- **HTTP**: HttpClient para consumo de API REST

## 📂 Estructura de Carpetas
- `src/app/core`: Servicios singleton, guards y modelos base.
- `src/app/features`: Módulos de funcionalidades (ej: login, dashboard).
- `src/app/shared`: Componentes reutilizables.
- `src/environments`: Configuración de URLs de API según el entorno.

## 🌐 Conexión con la API
La URL base se define en `src/environments/environment.ts`. Asegúrate de que el backend esté corriendo en el puerto configurado (por defecto 3000).

## 🚀 Comandos Útiles
```bash
ng serve        # Iniciar servidor de desarrollo
ng build        # Compilar para producción
ng test         # Ejecutar pruebas unitarias
```
