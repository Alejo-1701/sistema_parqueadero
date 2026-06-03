import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VehicleCategoryService } from '../services/vehicle-category.service';
import { VehicleCategory } from '../entities/vehicle-category.entity';

@Controller('vehicle-categories')
export class VehicleCategoryController {
  constructor(private readonly vehicleCategoryService: VehicleCategoryService) {}

  @Get()
  findAll(): Promise<VehicleCategory[]> {
    return this.vehicleCategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<VehicleCategory | null> {
    return this.vehicleCategoryService.findOne(id);
  }

  @Post()
  create(@Body() category: Partial<VehicleCategory>): Promise<VehicleCategory> {
    return this.vehicleCategoryService.create(category);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() category: Partial<VehicleCategory>): Promise<VehicleCategory | null> {
    return this.vehicleCategoryService.update(id, category);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.vehicleCategoryService.remove(id);
  }
}
