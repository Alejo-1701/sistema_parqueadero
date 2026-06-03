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
import { Person } from '../../people/entities/person.entity';
import { Apartment } from '../../residential/entities/apartment.entity';

@Entity('visitors')
@Index(['tenantId', 'checkInAt'])
@Index(['tenantId', 'vehiclePlate'])
@Index(['tenantId', 'visitingApartmentId'])
@Index(['tenantId', 'status', 'checkInAt'])
export class Visitor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id' })
  tenantId: string;

  @Column({
    name: 'visit_type',
    type: 'enum',
    enum: ['frequent', 'occasional', 'service', 'emergency'],
  })
  visitType: 'frequent' | 'occasional' | 'service' | 'emergency';

  @Column({
    name: 'vehicle_type',
    type: 'enum',
    enum: ['car', 'motorcycle', 'bicycle', 'none'],
    nullable: true,
  })
  vehicleType?: 'car' | 'motorcycle' | 'bicycle' | 'none';

  @Column({ name: 'person_id' })
  personId: string;

  @Column({ name: 'vehicle_plate', length: 10, nullable: true })
  vehiclePlate?: string;

  @Column({ name: 'visiting_apartment_id', nullable: true })
  visitingApartmentId?: string;

  @Column({ name: 'authorized_by_person_id', nullable: true })
  authorizedByPersonId?: string;

  @Column({ name: 'check_in_at', type: 'timestamptz', default: () => 'NOW()' })
  checkInAt: Date;

  @Column({ name: 'check_out_at', type: 'timestamptz', nullable: true })
  checkOutAt?: Date;

  @Column({
    type: 'enum',
    enum: ['active', 'inactive', 'expired'],
    default: 'active',
  })
  status: 'active' | 'inactive' | 'expired';

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant?: Tenant;

  @ManyToOne(() => Person)
  @JoinColumn({ name: 'person_id' })
  person?: Person;

  @ManyToOne(() => Person)
  @JoinColumn({ name: 'authorized_by_person_id' })
  authorizedBy?: Person;

  @ManyToOne(() => Apartment)
  @JoinColumn({ name: 'visiting_apartment_id' })
  visitingApartment?: Apartment;
}
