import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApartmentService } from '../services/apartment.service';
import { Apartment } from '../entities/apartment.entity';

@Controller('apartments')
export class ApartmentController {
  constructor(private readonly apartmentService: ApartmentService) {}

  @Get()
  findAll(): Promise<Apartment[]> {
    return this.apartmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Apartment | null> {
    return this.apartmentService.findOne(id);
  }

  @Post()
  create(@Body() apartment: Partial<Apartment>): Promise<Apartment> {
    return this.apartmentService.create(apartment);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() apartment: Partial<Apartment>): Promise<Apartment | null> {
    return this.apartmentService.update(id, apartment);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.apartmentService.remove(id);
  }
}
