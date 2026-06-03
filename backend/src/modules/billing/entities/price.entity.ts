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
import { Invoice } from './invoice.entity';
import { Rate } from './rate.entity';

@Entity('prices')
@Index(['tenantId', 'invoiceId'])
@Index(['tenantId', 'rateId'])
export class Price {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id' })
  tenantId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({
    name: 'billing_unit',
    type: 'enum',
    enum: ['hour', 'day', 'week', 'month', 'event', 'fraction'],
  })
  billingUnit: 'hour' | 'day' | 'week' | 'month' | 'event' | 'fraction';

  @Column({ default: 1 })
  quantity: number;

  @Column({ name: 'invoice_id' })
  invoiceId: string;

  @Column({ name: 'rate_id', nullable: true })
  rateId?: string;

  @Column({ name: 'valid_from', type: 'date', nullable: true })
  validFrom?: Date;

  @Column({ name: 'valid_to', type: 'date', nullable: true })
  validTo?: Date;

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

  @ManyToOne(() => Invoice)
  @JoinColumn({ name: 'invoice_id' })
  invoice?: Invoice;

  @ManyToOne(() => Rate)
  @JoinColumn({ name: 'rate_id' })
  rate?: Rate;
}
