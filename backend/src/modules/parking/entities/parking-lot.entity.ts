import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Tenant } from '../../tenants/entities/tenant.entity';
import { VehicleCategory } from './vehicle-category.entity';

@Entity('parking_lots')
export class ParkingLot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id' })
  tenantId: string;

  @Column()
  capacity: number;

  @Column({ length: 20, default: 'available' })
  status: 'available' | 'full' | 'maintenance' | 'closed';

  @Column({ name: 'vehicle_category_id', nullable: true })
  vehicleCategoryId?: string;

  @Column({ length: 100, nullable: true })
  location?: string;

  @Column({ name: 'parking_type', length: 20, nullable: true })
  parkingType?: 'visitors' | 'residents' | 'mixed' | 'emergency';

  @Column({ name: 'opens_at', type: 'time', nullable: true })
  opensAt?: string;

  @Column({ name: 'closes_at', type: 'time', nullable: true })
  closesAt?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant?: Tenant;

  @ManyToOne(() => VehicleCategory)
  @JoinColumn({ name: 'vehicle_category_id' })
  vehicleCategory?: VehicleCategory;
}
