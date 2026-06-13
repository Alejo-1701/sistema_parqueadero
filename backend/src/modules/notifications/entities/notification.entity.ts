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
import { Account } from '../../accounts/entities/account.entity';

@Entity('notifications')
@Index(['tenantId', 'status', 'sentAt'])
@Index(['tenantId', 'recipientPersonId'])
@Index(['tenantId', 'notificationType'])
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id' })
  tenantId: string;

  @Column({
    name: 'notification_type',
    type: 'enum',
    enum: ['entry', 'exit', 'payment', 'security', 'maintenance', 'general'],
  })
  notificationType: 'entry' | 'exit' | 'payment' | 'security' | 'maintenance' | 'general';

  @Column({ name: 'recipient_person_id' })
  recipientPersonId: string;

  @Column({ name: 'sender_account_id', nullable: true })
  senderAccountId?: string;

  @Column({ length: 100 })
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ name: 'sent_at', type: 'timestamptz', default: () => 'NOW()' })
  sentAt: Date;

  @Column({ name: 'read_at', type: 'timestamptz', nullable: true })
  readAt?: Date;

  @Column({
    type: 'enum',
    enum: ['unread', 'read', 'archived'],
    default: 'unread',
  })
  status: 'unread' | 'read' | 'archived';

  @Column({
    type: 'enum',
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal',
  })
  priority: 'low' | 'normal' | 'high' | 'urgent';

  @Column({ length: 20, nullable: true })
  channel?: 'email' | 'sms' | 'push' | 'app';

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
  @JoinColumn({ name: 'recipient_person_id' })
  recipient?: Person;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'sender_account_id' })
  sender?: Account;
}
