import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoleService } from '../services/role.service';
import { Role } from '../entities/role.entity';
import { AccountRole } from '../entities/account-role.entity';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  findAllRoles(): Promise<Role[]> {
    return this.roleService.findAllRoles();
  }

  @Get(':id')
  findOneRole(@Param('id') id: string): Promise<Role | null> {
    return this.roleService.findOneRole(id);
  }

  @Post()
  createRole(@Body() role: Partial<Role>): Promise<Role> {
    return this.roleService.createRole(role);
  }

  @Patch(':id')
  updateRole(@Param('id') id: string, @Body() role: Partial<Role>): Promise<Role | null> {
    return this.roleService.updateRole(id, role);
  }

  @Delete(':id')
  removeRole(@Param('id') id: string): Promise<void> {
    return this.roleService.removeRole(id);
  }

  @Get('account-roles/all')
  findAllAccountRoles(): Promise<AccountRole[]> {
    return this.roleService.findAllAccountRoles();
  }

  @Post('account-roles')
  assignRoleToAccount(@Body() accountRole: Partial<AccountRole>): Promise<AccountRole> {
    return this.roleService.assignRoleToAccount(accountRole);
  }

  @Delete('account-roles/:accountId/:roleId')
  removeAccountRole(@Param('accountId') accountId: string, @Param('roleId') roleId: string): Promise<void> {
    return this.roleService.removeAccountRole(accountId, roleId);
  }
}
