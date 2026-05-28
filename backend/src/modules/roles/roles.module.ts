import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleController } from './controllers/role.controller';
import { RoleService } from './services/role.service';
import { Role } from './entities/role.entity';
import { AccountRole } from './entities/account-role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, AccountRole])],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RolesModule {}
