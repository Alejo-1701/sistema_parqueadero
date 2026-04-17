import { Usuario } from '../../usuarios/entities/usuario.entity';
export declare class Vehiculo {
    id: number;
    placa: string;
    marca: string;
    modelo: string;
    color: string;
    tipo: string;
    propietario: Usuario;
    propietarioId: number;
    activo: boolean;
    createdAt: Date;
    updatedAt: Date;
}
