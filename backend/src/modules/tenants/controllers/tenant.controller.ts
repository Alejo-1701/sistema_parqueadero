import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TenantService } from '../services/tenant.service';
import { Tenant } from '../entities/tenant.entity';

@Controller('tenants')
export class TenantController {
  constructor(private readonly tenantService: TenantService) { }

  @Get()
  findAll(): Promise<Tenant[]> {
    return this.tenantService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Tenant | null> {
    return this.tenantService.findOne(id);
  }

  @Post()
  create(@Body() tenant: Partial<Tenant>): Promise<Tenant> {
    return this.tenantService.create(tenant);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() tenant: Partial<Tenant>): Promise<Tenant | null> {
    return this.tenantService.update(id, tenant);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.tenantService.remove(id);
  }
}
