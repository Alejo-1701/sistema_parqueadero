import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Tenant } from '../../tenants/entities/tenant.entity';

@Entity('vehicle_categories')
@Index(['tenantId', 'name'], { unique: true })
export class VehicleCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id' })
  tenantId: string;

  @Column({ length: 50 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'service_type', length: 30 })
  serviceType: 'private' | 'public' | 'cargo' | 'official' | 'emergency';

  @Column({ name: 'base_rate', type: 'decimal', precision: 10, scale: 2, nullable: true })
  baseRate?: number;

  @Column({ name: 'fraction_minutes', default: 60 })
  fractionMinutes: number;

  @Column({ length: 20, default: 'active' })
  status: 'active' | 'inactive';

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant?: Tenant;
}
