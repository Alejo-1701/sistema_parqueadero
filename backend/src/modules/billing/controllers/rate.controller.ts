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
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RateService } from '../services/rate.service';
import { CreateRateDto, UpdateRateDto } from '../dto/rate.dto';
import { Rate } from '../entities/rate.entity';

@ApiTags('rates')
@Controller('rates')
export class RateController {
  constructor(private readonly rateService: RateService) {}

  @Get()
  @ApiOperation({ summary: 'Listar tarifas' })
  @ApiResponse({ status: 200, description: 'Lista de tarifas' })
  findAll(
    @Query('rate_type') rateType?: string,
    @Query('status') status?: string,
  ): Promise<Rate[]> {
    return this.rateService.findAll(rateType, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener tarifa por ID' })
  @ApiResponse({ status: 200, description: 'Tarifa encontrada' })
  @ApiResponse({ status: 404, description: 'Tarifa no encontrada' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Rate> {
    const rate = await this.rateService.findOne(id);
    if (!rate) {
      throw new NotFoundException('Tarifa no encontrada');
    }
    return rate;
  }

  @Post()
  @ApiOperation({ summary: 'Crear tarifa' })
  @ApiResponse({ status: 201, description: 'Tarifa creada exitosamente' })
  create(@Body() dto: CreateRateDto): Promise<Rate> {
    return this.rateService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar tarifa' })
  @ApiResponse({ status: 200, description: 'Tarifa actualizada' })
  @ApiResponse({ status: 404, description: 'Tarifa no encontrada' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRateDto,
  ): Promise<Rate> {
    const rate = await this.rateService.update(id, dto);
    if (!rate) {
      throw new NotFoundException('Tarifa no encontrada');
    }
    return rate;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Desactivar tarifa (soft-delete)' })
  @ApiResponse({ status: 204, description: 'Tarifa desactivada' })
  @ApiResponse({ status: 404, description: 'Tarifa no encontrada' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    const rate = await this.rateService.findOne(id);
    if (!rate) {
      throw new NotFoundException('Tarifa no encontrada');
    }
    await this.rateService.remove(id);
  }
}
