import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleCategory } from '../entities/vehicle-category.entity';

@Injectable()
export class VehicleCategoryService {
  constructor(
    @InjectRepository(VehicleCategory)
    private readonly vehicleCategoryRepository: Repository<VehicleCategory>,
  ) {}

  async findAll(): Promise<VehicleCategory[]> {
    return this.vehicleCategoryRepository.find();
  }

  async findOne(id: string): Promise<VehicleCategory | null> {
    return this.vehicleCategoryRepository.findOne({ where: { id } });
  }

  async create(category: Partial<VehicleCategory>): Promise<VehicleCategory> {
    const newCategory = this.vehicleCategoryRepository.create(category);
    return this.vehicleCategoryRepository.save(newCategory);
  }

  async update(id: string, category: Partial<VehicleCategory>): Promise<VehicleCategory | null> {
    await this.vehicleCategoryRepository.update(id, category);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.vehicleCategoryRepository.delete(id);
  }
}
