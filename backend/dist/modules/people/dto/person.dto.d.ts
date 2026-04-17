export declare class CreatePersonDto {
    tipoDocumento: 'CC' | 'TI' | 'CE';
    numeroDocumento: string;
    nombre: string;
    apellido: string;
    telefono?: string;
    email?: string;
    estado?: 'ACTIVO' | 'INACTIVO';
}
export declare class UpdatePersonDto {
    nombre?: string;
    apellido?: string;
    telefono?: string;
    email?: string;
    estado?: 'ACTIVO' | 'INACTIVO';
}
