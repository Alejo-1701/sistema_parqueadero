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
import { PqrsService } from '../services/pqrs.service';
import { CreatePqrsDto, UpdatePqrsDto, RespondPqrsDto, ScorePqrsDto } from '../dto/pqrs.dto';
import { Pqrs } from '../entities/pqrs.entity';

@ApiTags('pqrs')
@Controller('pqrs')
export class PqrsController {
  constructor(private readonly pqrsService: PqrsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar PQRS' })
  @ApiResponse({ status: 200, description: 'Lista de PQRS' })
  findAll(
    @Query('status') status?: string,
    @Query('pqr_type') pqrType?: string,
  ): Promise<Pqrs[]> {
    return this.pqrsService.findAll(status, pqrType);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de PQRS' })
  @ApiResponse({ status: 200, description: 'PQRS encontrada' })
  @ApiResponse({ status: 404, description: 'PQRS no encontrada' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Pqrs> {
    const pqrs = await this.pqrsService.findOne(id);
    if (!pqrs) {
      throw new NotFoundException('PQRS no encontrada');
    }
    return pqrs;
  }

  @Post()
  @ApiOperation({ summary: 'Crear PQRS' })
  @ApiResponse({ status: 201, description: 'PQRS creada exitosamente' })
  create(@Body() dto: CreatePqrsDto): Promise<Pqrs> {
    return this.pqrsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar PQRS' })
  @ApiResponse({ status: 200, description: 'PQRS actualizada' })
  @ApiResponse({ status: 404, description: 'PQRS no encontrada' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePqrsDto,
  ): Promise<Pqrs> {
    const pqrs = await this.pqrsService.update(id, dto);
    if (!pqrs) {
      throw new NotFoundException('PQRS no encontrada');
    }
    return pqrs;
  }

  @Post(':id/respond')
  @ApiOperation({ summary: 'Responder PQRS (la marca como resuelta)' })
  @ApiResponse({ status: 200, description: 'PQRS respondida exitosamente' })
  @ApiResponse({ status: 400, description: 'La PQRS ya está cerrada o rechazada' })
  @ApiResponse({ status: 404, description: 'PQRS no encontrada' })
  async respond(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: RespondPqrsDto,
  ): Promise<Pqrs> {
    const pqrs = await this.pqrsService.respond(id, dto);
    if (!pqrs) {
      throw new NotFoundException('PQRS no encontrada');
    }
    return pqrs;
  }

  @Post(':id/score')
  @ApiOperation({ summary: 'Calificar PQRS resuelta (la marca como cerrada)' })
  @ApiResponse({ status: 200, description: 'PQRS calificada exitosamente' })
  @ApiResponse({ status: 400, description: 'Solo se puede calificar una PQRS resuelta' })
  @ApiResponse({ status: 404, description: 'PQRS no encontrada' })
  async score(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ScorePqrsDto,
  ): Promise<Pqrs> {
    const pqrs = await this.pqrsService.score(id, dto);
    if (!pqrs) {
      throw new NotFoundException('PQRS no encontrada');
    }
    return pqrs;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Rechazar PQRS (soft-delete)' })
  @ApiResponse({ status: 204, description: 'PQRS rechazada' })
  @ApiResponse({ status: 404, description: 'PQRS no encontrada' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    const pqrs = await this.pqrsService.findOne(id);
    if (!pqrs) {
      throw new NotFoundException('PQRS no encontrada');
    }
    await this.pqrsService.remove(id);
  }
}
