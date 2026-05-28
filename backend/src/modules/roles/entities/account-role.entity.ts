import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Account } from '../../accounts/entities/account.entity';
import { Role } from './role.entity';

@Entity('account_roles')
@Index(['tenantId', 'accountId', 'roleId'], { unique: true })
export class AccountRole {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id' })
  tenantId: string;

  @Column({ name: 'account_id' })
  accountId: string;

  @Column({ name: 'role_id' })
  roleId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'account_id' })
  account?: Account;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'role_id' })
  role?: Role;
}
