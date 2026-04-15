# Frontend - Sistema de Parqueadero

Este proyecto fue generado utilizando [Angular CLI](https://github.com/angular/angular-cli) versión 21.2.7.

## Servidor de desarrollo

Para iniciar el servidor de desarrollo local, ejecuta:

```bash
ng serve
```

Una vez que el servidor esté en ejecución, abre tu navegador y navega a `http://localhost:4200/`. La aplicación se recargará automáticamente cada vez que modifiques cualquiera de los archivos fuente.

## Generación de código

Angular CLI incluye poderosas herramientas de generación de código. Para generar un nuevo componente, ejecuta:

```bash
ng generate component nombre-del-componente
```

Para obtener una lista completa de los esquemas disponibles (como `components`, `directives`, o `pipes`), ejecuta:

```bash
ng generate --help
```

## Construcción

Para construir el proyecto, ejecuta:

```bash
ng build
```

Esto compilará tu proyecto y almacenará los artefactos de construcción en el directorio `dist/`. Por defecto, la construcción de producción optimiza tu aplicación para rendimiento y velocidad.

## Ejecución de pruebas unitarias

Para ejecutar pruebas unitarias con el ejecutor de pruebas [Vitest](https://vitest.dev/), usa el siguiente comando:

```bash
ng test
```

## Ejecución de pruebas end-to-end

Para pruebas end-to-end (e2e), ejecuta:

```bash
ng e2e
```

Angular CLI no incluye un framework de pruebas end-to-end por defecto. Puedes elegir uno que se adapte a tus necesidades.

## Recursos adicionales

Para más información sobre el uso de Angular CLI, incluyendo referencias detalladas de comandos, visita la página [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli).

## Estructura del proyecto

- `src/app/` - Módulo principal de la aplicación
- `src/features/` - Módulos por característica (home, auth, parqueadero)
- `src/shared/` - Componentes compartidos
- `src/core/` - Servicios e interceptores de núcleo
- `src/environments/` - Configuración de entornos

## Configuración

- **Tipado estricto**: Configurado en `tsconfig.json`
- **Estilos**: Variables SCSS globales en `src/styles.scss`
- **Lazy Loading**: Configurado en el enrutamiento principal
- **Interceptores HTTP**: Para autenticación y manejo de errores
