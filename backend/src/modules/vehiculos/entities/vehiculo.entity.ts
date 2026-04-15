import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity('vehiculos')
export class Vehiculo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 20 })
  placa: string;

  @Column({ length: 50 })
  marca: string;

  @Column({ length: 50 })
  modelo: string;

  @Column({ length: 20 })
  color: string;

  @Column({ type: 'enum', enum: ['carro', 'moto', 'camioneta', 'bus', 'otro'] })
  tipo: string;

  @ManyToOne(() => Usuario, usuario => usuario.vehiculos)
  propietario: Usuario;

  @Column()
  propietarioId: number;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
