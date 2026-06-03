---
name: expert-angular
description: "Trigger: Angular, component, standalone, lazy loading, signal, SSR, HTTP interceptor, route guard. Guía de patrones y mejores prácticas Angular 21 específicas del proyecto sistema_parqueadero."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

# Expert Angular 21 — sistema_parqueadero

## Activation Contract

Usar este skill cuando se necesite crear, modificar o revisar código del frontend Angular del proyecto. NO es para decisiones de arquitectura general — eso va al skill de arquitectura o al Triage.

## Convenciones del Proyecto (Extraídas del Código Real)

### 1. Standalone Components (OBLIGATORIO)

Todos los componentes son **standalone: true**. No se usan NgModules en features.

```typescript
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent { }
```

### 2. Estructura de Archivos por Feature

```
src/features/{feature}/
├── {feature}.routes.ts         ← Rutas lazy de la feature
├── components/
│   ├── {nombre}/
│   │   ├── {nombre}.component.ts
│   │   ├── {nombre}.component.html
│   │   └── {nombre}.component.scss
│   └── {otro}/
│       └── ...
```

### 3. Lazy Loading (OBLIGATORIO)

Todas las rutas de features usan `loadComponent`. No se importan componentes directamente en rutas.

```typescript
// app.routes.ts
{
  path: 'auth',
  loadChildren: () => import('../features/auth/auth.routes').then(m => m.AUTH_ROUTES)
}

// auth.routes.ts
{
  path: 'login',
  loadComponent: () => import('./components/login/login.component').then(c => c.LoginComponent),
  title: 'Iniciar Sesión'
}
```

### 4. Signals para Estado Local

Usar `signal()` para estado interno del componente, no propiedades planas. Para estado compartido, usar `BehaviorSubject` + `asObservable()` (patrón existente en `auth.service.ts`).

```typescript
// Estado local
protected readonly loading = signal(false);
protected readonly items = signal<Item[]>([]);

// Expuesto como señal de solo lectura
protected readonly items = signal<Item[]>([]);
readonly items$ = toObservable(this.items); // cuando sea necesario
```

### 5. Servicios con providedIn: 'root'

```typescript
@Injectable({ providedIn: 'root' })
export class MiServicio {
  constructor(private http: HttpClient) {}
}
```

Patrón de estado compartido existente: `BehaviorSubject` + método público para emitir.

### 6. HTTP Interceptors Funcionales

Usar `HttpInterceptorFn` (no clases). El interceptor existente en `core/interceptors/auth.interceptor.ts` es el modelo:

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  // ... lógica
  return next(req).pipe(
    map(event => { ... }),
    catchError(error => { ... })
  );
};
```

### 7. Route Guards Funcionales

Usar `CanActivateFn` (no clases). Modelo existente en `core/guards/auth.guard.ts`:

```typescript
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isLoggedIn()) return true;
  router.navigate(['/auth/login']);
  return false;
};
```

### 8. Estilos: SCSS con BEM

```scss
.login-container {
  min-height: 100vh;
  // ...
  .login-card {
    background: white;
    // ...
    h2 { text-align: center; }
  }
}
```

### 9. SSR con Event Replay

```typescript
// app.config.ts
provideClientHydration(withEventReplay())
```

### 10. Modelos de Datos

Las interfaces se definen en `core/models/` o dentro de cada feature. El `ApiResponse<T>` genérico es obligatorio para respuestas del backend:

```typescript
export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  timestamp: string;
  path: string;
}
```

## Testing con Vitest

- Tests junto al componente (`*.spec.ts`)
- Usar `TestBed` para pruebas de integración
- Usar mocks de servicios con `jasmine.createSpyObj` o similares

## Reglas NO Negociables

1. **NUNCA** crear un NgModule nuevo — todo es standalone.
2. **NUNCA** importar componentes directamente en rutas — siempre `loadComponent`.
3. **NUNCA** usar `styleUrls` como array — siempre `styleUrl` singular.
4. **SIEMPRE** usar `title` en rutas lazy para SEO/UX.
5. **SIEMPRE** estructurar features como `routes.ts` + `components/`.

## References

- `frontend/src/app/app.ts` — componente raíz standalone
- `frontend/src/app/app.routes.ts` — lazy loading a features
- `frontend/src/app/app.config.ts` — providers globales
- `frontend/src/core/services/auth.service.ts` — patrón servicio + estado
- `frontend/src/core/interceptors/auth.interceptor.ts` — interceptor funcional
- `frontend/src/core/guards/auth.guard.ts` — guard funcional
- `frontend/src/core/models/user.model.ts` — interfaces de datos
- `frontend/src/features/auth/auth.routes.ts` — lazy feature routes
- `frontend/src/features/auth/components/login/login.component.ts` — standalone component
