import { Person } from '../../people/entities/person.entity';
export declare class ResidentialUnit {
    id: string;
    direccion: string;
    ciudad: string;
    departamento: string;
    area: number;
    numeroHabitaciones: number;
    estado: 'DISPONIBLE' | 'OCUPADO' | 'MANTENIMIENTO';
    propietarioId?: string;
    residentes: Person[];
    createdAt: Date;
    updatedAt: Date;
}
export declare class ResidentialAssignment {
    id: string;
    unidad: ResidentialUnit;
    residente: Person;
    fechaInicio: Date;
    fechaFin?: Date;
    estado: 'ACTIVO' | 'FINALIZADO';
    createdAt: Date;
    updatedAt: Date;
}
