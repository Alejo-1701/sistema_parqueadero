import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { ResidentService } from '../services/resident.service';
import { CreateResidentDto, UpdateResidentDto } from '../dto/resident.dto';
import { Resident } from '../entities/resident.entity';

@Controller('residents')
export class ResidentController {
  constructor(private readonly residentService: ResidentService) {}

  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('resident_type') residentType?: string,
    @Query('apartment_id') apartmentId?: string,
  ): Promise<Resident[]> {
    return this.residentService.findAll(status, residentType, apartmentId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Resident> {
    const resident = await this.residentService.findOne(id);
    if (!resident) {
      throw new NotFoundException('Residente no encontrado');
    }
    return resident;
  }

  @Post()
  create(@Body() dto: CreateResidentDto): Promise<Resident> {
    return this.residentService.create(dto);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateResidentDto,
  ): Promise<Resident> {
    const resident = await this.residentService.update(id, dto);
    if (!resident) {
      throw new NotFoundException('Residente no encontrado');
    }
    return resident;
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    const resident = await this.residentService.findOne(id);
    if (!resident) {
      throw new NotFoundException('Residente no encontrado');
    }
    await this.residentService.remove(id);
  }
}
