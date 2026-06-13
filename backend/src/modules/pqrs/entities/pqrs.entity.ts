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

@Entity('pqrs')
@Index(['tenantId', 'status', 'registeredAt'])
@Index(['tenantId', 'requesterPersonId'])
@Index(['tenantId', 'pqrType'])
export class Pqrs {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id' })
  tenantId: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    name: 'pqr_type',
    type: 'enum',
    enum: ['petition', 'complaint', 'claim', 'suggestion', 'congratulation'],
  })
  pqrType: 'petition' | 'complaint' | 'claim' | 'suggestion' | 'congratulation';

  @Column({ name: 'requester_person_id' })
  requesterPersonId: string;

  @Column({ name: 'assigned_person_id', nullable: true })
  assignedPersonId?: string;

  @Column({ name: 'registered_at', type: 'timestamptz', default: () => 'NOW()' })
  registeredAt: Date;

  @Column({ name: 'due_date', type: 'date', nullable: true })
  dueDate?: Date;

  @Column({ name: 'responded_at', type: 'timestamptz', nullable: true })
  respondedAt?: Date;

  @Column({
    type: 'enum',
    enum: ['open', 'in_progress', 'resolved', 'closed', 'rejected'],
    default: 'open',
  })
  status: 'open' | 'in_progress' | 'resolved' | 'closed' | 'rejected';

  @Column({
    type: 'enum',
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal',
  })
  priority: 'low' | 'normal' | 'high' | 'urgent';

  @Column({ type: 'text', nullable: true })
  response?: string;

  @Column({ name: 'satisfaction_score', type: 'int', nullable: true })
  satisfactionScore?: number;

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
  @JoinColumn({ name: 'requester_person_id' })
  requester?: Person;

  @ManyToOne(() => Person)
  @JoinColumn({ name: 'assigned_person_id' })
  assignedPerson?: Person;
}
