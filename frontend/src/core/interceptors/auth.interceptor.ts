import {
  HttpInterceptorFn,
  HttpRequest,
  HttpEvent,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // Add auth token to requests
  const authToken = authService.getToken();

  if (authToken) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });
  }

  return next(req).pipe(
    map((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        // Handle successful responses
        return event;
      }
      return event;
    }),
    catchError((error: HttpErrorResponse) => {
      // Handle errors globally
      let errorMessage = 'Ocurrió un error desconocido';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Server-side error
        errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;

        // Handle specific error codes
        if (error.status === 401) {
          authService.logout();
          errorMessage = 'Sesión expirada. Por favor inicie sesión nuevamente.';
        } else if (error.status === 403) {
          errorMessage = 'Acceso denegado. No tiene permisos para realizar esta acción.';
        } else if (error.status === 404) {
          errorMessage = 'El recurso solicitado no fue encontrado.';
        } else if (error.status >= 500) {
          errorMessage = 'Error del servidor. Por favor intente más tarde.';
        }
      }

      console.error('HTTP Error:', error);
      return throwError(() => errorMessage);
    })
  );
};
