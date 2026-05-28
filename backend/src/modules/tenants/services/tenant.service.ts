import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from '../entities/tenant.entity';

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
  ) { }

  findAll(): Promise<Tenant[]> {
    return this.tenantRepository.find();
  }

  findOne(id: string): Promise<Tenant | null> {
    return this.tenantRepository.findOne({ where: { id } });
  }

  create(tenant: Partial<Tenant>): Promise<Tenant> {
    const newTenant = this.tenantRepository.create(tenant);
    return this.tenantRepository.save(newTenant);
  }

  async update(id: string, tenant: Partial<Tenant>): Promise<Tenant | null> {
    await this.tenantRepository.update(id, tenant);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.tenantRepository.delete(id);
  }
}
