import { Vehiculo } from '../../vehiculos/entities/vehiculo.entity';
export declare class Usuario {
    id: number;
    email: string;
    nombre: string;
    apellido: string;
    telefono: string;
    password: string;
    activo: boolean;
    rol: string;
    vehiculos: Vehiculo[];
    createdAt: Date;
    updatedAt: Date;
}
