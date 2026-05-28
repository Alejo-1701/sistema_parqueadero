import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { AccountRole } from '../entities/account-role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(AccountRole)
    private readonly accountRoleRepository: Repository<AccountRole>,
  ) {}

  findAllRoles(): Promise<Role[]> {
    return this.roleRepository.find();
  }

  findOneRole(id: string): Promise<Role | null> {
    return this.roleRepository.findOne({ where: { id } });
  }

  createRole(role: Partial<Role>): Promise<Role> {
    const newRole = this.roleRepository.create(role);
    return this.roleRepository.save(newRole);
  }

  async updateRole(id: string, role: Partial<Role>): Promise<Role | null> {
    await this.roleRepository.update(id, role);
    return this.findOneRole(id);
  }

  async removeRole(id: string): Promise<void> {
    await this.roleRepository.delete(id);
  }

  findAllAccountRoles(): Promise<AccountRole[]> {
    return this.accountRoleRepository.find();
  }

  assignRoleToAccount(accountRole: Partial<AccountRole>): Promise<AccountRole> {
    const newAccountRole = this.accountRoleRepository.create(accountRole);
    return this.accountRoleRepository.save(newAccountRole);
  }

  async removeAccountRole(accountId: string, roleId: string): Promise<void> {
    await this.accountRoleRepository.delete({ accountId, roleId } as any);
  }
}
