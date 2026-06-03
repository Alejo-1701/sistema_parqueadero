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

@Entity('residents')
@Index(['tenantId', 'residentCode'], { unique: true })
@Index(['tenantId', 'personId'])
@Index(['tenantId', 'apartmentId'])
export class Resident {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id' })
  tenantId: string;

  @Column({ name: 'resident_code' })
  residentCode: string;

  @Column({
    name: 'resident_type',
    type: 'enum',
    enum: ['resident', 'tenant'],
  })
  residentType: 'resident' | 'tenant';

  @Column({ name: 'person_id' })
  personId: string;

  @Column({ name: 'apartment_id' })
  apartmentId: string;

  @Column({ name: 'move_in_date', type: 'date' })
  moveInDate: Date;

  @Column({ name: 'move_out_date', type: 'date', nullable: true })
  moveOutDate?: Date;

  @Column({
    type: 'enum',
    enum: ['active', 'inactive'],
    default: 'active',
  })
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

  @ManyToOne(() => Person)
  @JoinColumn({ name: 'person_id' })
  person?: Person;

  @ManyToOne(() => Apartment)
  @JoinColumn({ name: 'apartment_id' })
  apartment?: Apartment;
}
