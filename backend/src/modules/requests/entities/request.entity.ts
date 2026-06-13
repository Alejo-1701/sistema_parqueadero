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

@Entity('requests')
@Index(['tenantId', 'status', 'requestedAt'])
@Index(['tenantId', 'requesterPersonId'])
export class Request {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id' })
  tenantId: string;

  @Column({
    name: 'request_type',
    type: 'enum',
    enum: ['access', 'visit', 'service', 'complaint', 'claim'],
  })
  requestType: 'access' | 'visit' | 'service' | 'complaint' | 'claim';

  @Column({
    type: 'enum',
    enum: ['pending', 'approved', 'rejected', 'in_progress'],
    default: 'pending',
  })
  status: 'pending' | 'approved' | 'rejected' | 'in_progress';

  @Column({ name: 'requester_person_id' })
  requesterPersonId: string;

  @Column({ name: 'responder_person_id', nullable: true })
  responderPersonId?: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', nullable: true })
  response?: string;

  @Column({ name: 'requested_at', type: 'timestamptz', default: () => 'NOW()' })
  requestedAt: Date;

  @Column({ name: 'responded_at', type: 'timestamptz', nullable: true })
  respondedAt?: Date;

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
  @JoinColumn({ name: 'responder_person_id' })
  responder?: Person;
}
