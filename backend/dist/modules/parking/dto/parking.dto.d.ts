export declare class CreateParkingDto {
    numero: string;
    tipo: 'CARRO' | 'MOTO' | 'BICICLETA';
    tarifa: number;
    vehiculoId?: string;
}
export declare class UpdateParkingDto {
    numero?: string;
    tipo?: 'CARRO' | 'MOTO' | 'BICICLETA';
    tarifa?: number;
    estado?: 'DISPONIBLE' | 'OCUPADO' | 'MANTENIMIENTO';
}
export declare class EntryDto {
    espacioId: string;
    vehiculoId?: string;
    montoCobrado?: number;
}
export declare class ExitDto {
    vehiculoId: string;
    montoCobrado?: number;
}
