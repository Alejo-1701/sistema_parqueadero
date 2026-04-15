import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(c => c.LoginComponent),
    title: 'Iniciar Sesión'
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register.component').then(c => c.RegisterComponent),
    title: 'Registrarse'
  }
];
