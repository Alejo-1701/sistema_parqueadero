import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Person } from '../../people/entities/person.entity';

@Entity('residential_units')
export class ResidentialUnit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  direccion: string;

  @Column()
  ciudad: string;

  @Column()
  departamento: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  area: number;

  @Column({ type: 'int' })
  numeroHabitaciones: number;

  @Column({ default: 'DISPONIBLE' })
  estado: 'DISPONIBLE' | 'OCUPADO' | 'MANTENIMIENTO';

  @Column({ nullable: true })
  propietarioId?: string;

  @ManyToMany(() => Person)
  @JoinTable()
  residentes: Person[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('residential_assignments')
export class ResidentialAssignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ResidentialUnit)
  unidad: ResidentialUnit;

  @ManyToOne(() => Person)
  residente: Person;

  @Column({ type: 'date' })
  fechaInicio: Date;

  @Column({ type: 'date', nullable: true })
  fechaFin?: Date;

  @Column({ default: 'ACTIVO' })
  estado: 'ACTIVO' | 'FINALIZADO';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
