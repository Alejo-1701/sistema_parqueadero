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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { VisitorService } from '../services/visitor.service';
import {
  CreateVisitorDto,
  UpdateVisitorDto,
  CheckOutVisitorDto,
} from '../dto/visitor.dto';
import { Visitor } from '../entities/visitor.entity';

@ApiTags('visitors')
@Controller('visitors')
export class VisitorController {
  constructor(private readonly visitorService: VisitorService) {}

  @Get()
  @ApiOperation({ summary: 'Listar visitantes' })
  @ApiResponse({ status: 200, description: 'Lista de visitantes' })
  findAll(
    @Query('status') status?: string,
    @Query('visit_type') visitType?: string,
    @Query('apartment_id') apartmentId?: string,
  ): Promise<Visitor[]> {
    return this.visitorService.findAll(status, visitType, apartmentId);
  }

  @Get('active')
  @ApiOperation({ summary: 'Listar visitantes activos (check-in vigente)' })
  @ApiResponse({ status: 200, description: 'Lista de visitantes con status active' })
  findActive(): Promise<Visitor[]> {
    return this.visitorService.findActive();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de visitante' })
  @ApiResponse({ status: 200, description: 'Visitante encontrado' })
  @ApiResponse({ status: 404, description: 'Visitante no encontrado' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Visitor> {
    const visitor = await this.visitorService.findOne(id);
    if (!visitor) {
      throw new NotFoundException('Visitante no encontrado');
    }
    return visitor;
  }

  @Post()
  @ApiOperation({ summary: 'Registrar visitante (check-in automático)' })
  @ApiResponse({ status: 201, description: 'Visitante creado exitosamente' })
  create(@Body() dto: CreateVisitorDto): Promise<Visitor> {
    return this.visitorService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar datos de visitante' })
  @ApiResponse({ status: 200, description: 'Visitante actualizado' })
  @ApiResponse({ status: 404, description: 'Visitante no encontrado' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateVisitorDto,
  ): Promise<Visitor> {
    const visitor = await this.visitorService.update(id, dto);
    if (!visitor) {
      throw new NotFoundException('Visitante no encontrado');
    }
    return visitor;
  }

  @Post(':id/check-out')
  @ApiOperation({ summary: 'Registrar salida de visitante (check-out)' })
  @ApiResponse({ status: 200, description: 'Check-out registrado exitosamente' })
  @ApiResponse({ status: 400, description: 'El visitante ya realizó check-out o está inactivo' })
  @ApiResponse({ status: 404, description: 'Visitante no encontrado' })
  async checkOut(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CheckOutVisitorDto,
  ): Promise<Visitor> {
    const visitor = await this.visitorService.checkOut(id, dto.notes);
    if (!visitor) {
      throw new NotFoundException('Visitante no encontrado');
    }
    return visitor;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Desactivar visitante (soft-delete)' })
  @ApiResponse({ status: 204, description: 'Visitante desactivado' })
  @ApiResponse({ status: 404, description: 'Visitante no encontrado' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    const visitor = await this.visitorService.findOne(id);
    if (!visitor) {
      throw new NotFoundException('Visitante no encontrado');
    }
    await this.visitorService.remove(id);
  }
}
