import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  title = 'Sistema de Parqueadero';
  subtitle = 'Gestión eficiente de espacios de estacionamiento';
  
  features = [
    { title: 'Control de Acceso', description: 'Registro de entrada y salida de vehículos' },
    { title: 'Gestión de Usuarios', description: 'Administración de clientes y operadores' },
    { title: 'Reportes', description: 'Estadísticas y reportes en tiempo real' },
    { title: 'Tarifas Flexibles', description: 'Configuración de tarifas por tiempo' }
  ];
}
