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
import { Person } from '../../people/entities/person.entity';

@Entity('apartments')
@Index(['tenantId', 'tower', 'apartmentNumber'], { unique: true })
export class Apartment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id' })
  tenantId: string;

  @Column()
  tower: string;

  @Column({ name: 'apartment_number' })
  apartmentNumber: string;

  @Column({ name: 'owner_person_id', nullable: true })
  ownerPersonId?: string;

  @Column({ name: 'area_m2', type: 'decimal', precision: 8, scale: 2, nullable: true })
  areaM2?: number;

  @Column({ nullable: true })
  bedrooms?: number;

  @Column({ nullable: true })
  bathrooms?: number;

  @Column({ name: 'apartment_type', length: 20, nullable: true })
  apartmentType?: 'studio' | '1_bed' | '2_bed' | '3_bed' | 'penthouse';

  @Column({ length: 20, default: 'available' })
  status: 'available' | 'occupied' | 'maintenance' | 'for_sale';

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
  @JoinColumn({ name: 'owner_person_id' })
  owner?: Person;
}
