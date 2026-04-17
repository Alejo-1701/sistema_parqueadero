import { User } from '../../auth/entities/user.entity';
export declare class ParkingSpace {
    id: string;
    numero: string;
    tipo: 'CARRO' | 'MOTO' | 'BICICLETA';
    estado: 'DISPONIBLE' | 'OCUPADO' | 'MANTENIMIENTO';
    tarifa: number;
    usuario: User;
    vehiculoId?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class ParkingRecord {
    id: string;
    espacio: ParkingSpace;
    usuario: User;
    horaEntrada: Date;
    horaSalida?: Date;
    montoCobrado?: number;
    estado: 'ACTIVO' | 'FINALIZADO';
    createdAt: Date;
    updatedAt: Date;
}
