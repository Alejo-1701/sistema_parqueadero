export declare class Person {
    id: string;
    tipoDocumento: 'CC' | 'TI' | 'CE';
    numeroDocumento: string;
    nombre: string;
    apellido: string;
    telefono?: string;
    email?: string;
    estado: 'ACTIVO' | 'INACTIVO';
    createdAt: Date;
    updatedAt: Date;
}
