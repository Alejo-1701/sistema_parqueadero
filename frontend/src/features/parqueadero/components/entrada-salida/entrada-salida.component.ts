import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-entrada-salida',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './entrada-salida.component.html',
  styleUrl: './entrada-salida.component.scss'
})
export class EntradaSalidaComponent {
  title = 'Control de Acceso';
}
