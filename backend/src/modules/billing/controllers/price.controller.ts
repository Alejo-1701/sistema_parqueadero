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
import { PriceService } from '../services/price.service';
import { CreatePriceDto, UpdatePriceDto } from '../dto/price.dto';
import { Price } from '../entities/price.entity';

@ApiTags('prices')
@Controller('prices')
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @Get()
  @ApiOperation({ summary: 'Listar precios' })
  @ApiResponse({ status: 200, description: 'Lista de precios' })
  findAll(
    @Query('invoice_id') invoiceId?: string,
    @Query('status') status?: string,
  ): Promise<Price[]> {
    return this.priceService.findAll(invoiceId, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener precio por ID' })
  @ApiResponse({ status: 200, description: 'Precio encontrado' })
  @ApiResponse({ status: 404, description: 'Precio no encontrado' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Price> {
    const price = await this.priceService.findOne(id);
    if (!price) {
      throw new NotFoundException('Precio no encontrado');
    }
    return price;
  }

  @Post()
  @ApiOperation({ summary: 'Crear precio' })
  @ApiResponse({ status: 201, description: 'Precio creado exitosamente' })
  create(@Body() dto: CreatePriceDto): Promise<Price> {
    return this.priceService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar precio' })
  @ApiResponse({ status: 200, description: 'Precio actualizado' })
  @ApiResponse({ status: 404, description: 'Precio no encontrado' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePriceDto,
  ): Promise<Price> {
    const price = await this.priceService.update(id, dto);
    if (!price) {
      throw new NotFoundException('Precio no encontrado');
    }
    return price;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Desactivar precio (soft-delete)' })
  @ApiResponse({ status: 204, description: 'Precio desactivado' })
  @ApiResponse({ status: 404, description: 'Precio no encontrado' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    const price = await this.priceService.findOne(id);
    if (!price) {
      throw new NotFoundException('Precio no encontrado');
    }
    await this.priceService.remove(id);
  }
}
