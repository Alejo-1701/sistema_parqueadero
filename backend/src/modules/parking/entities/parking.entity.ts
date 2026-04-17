import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('parking_spaces')
export class ParkingSpace {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  numero: string;

  @Column()
  tipo: 'CARRO' | 'MOTO' | 'BICICLETA';

  @Column({ default: 'DISPONIBLE' })
  estado: 'DISPONIBLE' | 'OCUPADO' | 'MANTENIMIENTO';

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  tarifa: number;

  @ManyToOne(() => User)
  usuario: User;

  @Column({ nullable: true })
  vehiculoId?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('parking_records')
export class ParkingRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ParkingSpace)
  espacio: ParkingSpace;

  @ManyToOne(() => User)
  usuario: User;

  @Column({ type: 'timestamp' })
  horaEntrada: Date;

  @Column({ type: 'timestamp', nullable: true })
  horaSalida?: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  montoCobrado?: number;

  @Column({ default: 'ACTIVO' })
  estado: 'ACTIVO' | 'FINALIZADO';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
