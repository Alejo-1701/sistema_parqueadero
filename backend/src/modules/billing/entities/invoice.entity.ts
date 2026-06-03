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
import { Visitor } from '../../visitors/entities/visitor.entity';
import { ParkingLot } from '../../parking/entities/parking-lot.entity';

@Entity('invoices')
@Index(['tenantId', 'issuedAt'])
@Index(['tenantId', 'status'])
@Index(['tenantId', 'personId'])
@Index(['tenantId', 'visitorId'])
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id' })
  tenantId: string;

  @Column({ name: 'issued_at', type: 'timestamptz', default: () => 'NOW()' })
  issuedAt: Date;

  @Column({ name: 'total_amount', type: 'decimal', precision: 12, scale: 2 })
  totalAmount: number;

  @Column({ name: 'discount_amount', type: 'decimal', precision: 10, scale: 2, nullable: true })
  discountAmount?: number;

  @Column({ name: 'tax_amount', type: 'decimal', precision: 10, scale: 2, nullable: true })
  taxAmount?: number;

  @Column({ name: 'parking_lot_id', nullable: true })
  parkingLotId?: string;

  @Column({ name: 'person_id', nullable: true })
  personId?: string;

  @Column({ name: 'visitor_id', nullable: true })
  visitorId?: string;

  @Column({ length: 20, default: 'pending' })
  status: 'pending' | 'paid' | 'cancelled' | 'overdue';

  @Column({ name: 'payment_method', length: 30, nullable: true })
  paymentMethod?: 'cash' | 'card' | 'bank_transfer' | 'nequi' | 'daviplata';

  @Column({ name: 'paid_at', type: 'timestamptz', nullable: true })
  paidAt?: Date;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant?: Tenant;

  @ManyToOne(() => ParkingLot)
  @JoinColumn({ name: 'parking_lot_id' })
  parkingLot?: ParkingLot;

  @ManyToOne(() => Person)
  @JoinColumn({ name: 'person_id' })
  person?: Person;

  @ManyToOne(() => Visitor)
  @JoinColumn({ name: 'visitor_id' })
  visitor?: Visitor;
}
