import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Tenant } from '../../tenants/entities/tenant.entity';
import { VehicleCategory } from '../../parking/entities/vehicle-category.entity';
import { ParkingLot } from '../../parking/entities/parking-lot.entity';

@Entity('rates')
@Index(['tenantId', 'vehicleCategoryId', 'parkingLotId', 'rateType', 'validFrom'], { unique: true })
export class Rate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id' })
  tenantId: string;

  @Column({
    name: 'rate_type',
    type: 'enum',
    enum: ['standard', 'preferential', 'night', 'weekend', 'holiday'],
  })
  rateType: 'standard' | 'preferential' | 'night' | 'weekend' | 'holiday';

  @Column({ name: 'min_amount', type: 'decimal', precision: 10, scale: 2, nullable: true })
  minAmount?: number;

  @Column({ name: 'max_amount', type: 'decimal', precision: 10, scale: 2, nullable: true })
  maxAmount?: number;

  @Column({ name: 'fraction_minutes', default: 60 })
  fractionMinutes: number;

  @Column({ name: 'valid_from', type: 'date' })
  validFrom: Date;

  @Column({ name: 'valid_to', type: 'date', nullable: true })
  validTo?: Date;

  @Column({ name: 'vehicle_category_id', nullable: true })
  vehicleCategoryId?: string;

  @Column({ name: 'parking_lot_id', nullable: true })
  parkingLotId?: string;

  @Column({ length: 20, default: 'active' })
  status: 'active' | 'inactive';

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

  @ManyToOne(() => ParkingLot)
  @JoinColumn({ name: 'parking_lot_id' })
  parkingLot?: ParkingLot;
}
