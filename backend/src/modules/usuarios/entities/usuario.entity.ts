import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Vehiculo } from '../../vehiculos/entities/vehiculo.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 100 })
  apellido: string;

  @Column({ length: 20, nullable: true })
  telefono: string;

  @Column({ select: false })
  password: string;

  @Column({ default: true })
  activo: boolean;

  @Column({ type: 'enum', enum: ['admin', 'operador', 'cliente'], default: 'cliente' })
  rol: string;

  @OneToMany(() => Vehiculo, vehiculo => vehiculo.propietario)
  vehiculos: Vehiculo[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
