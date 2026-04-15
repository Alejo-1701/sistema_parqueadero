import { Routes } from '@angular/router';

export const PARQUEADERO_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(c => c.DashboardComponent),
    title: 'Panel Principal'
  },
  {
    path: 'vehiculos',
    loadComponent: () => import('./components/vehiculos/vehiculos.component').then(c => c.VehiculosComponent),
    title: 'Gestión de Vehículos'
  },
  {
    path: 'entrada-salida',
    loadComponent: () => import('./components/entrada-salida/entrada-salida.component').then(c => c.EntradaSalidaComponent),
    title: 'Control de Acceso'
  }
];
