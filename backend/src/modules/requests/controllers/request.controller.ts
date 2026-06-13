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
import { RequestService } from '../services/request.service';
import {
  CreateRequestDto,
  UpdateRequestDto,
  RespondRequestDto,
} from '../dto/request.dto';
import { Request } from '../entities/request.entity';

@ApiTags('requests')
@Controller('requests')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Get()
  @ApiOperation({ summary: 'Listar solicitudes' })
  @ApiResponse({ status: 200, description: 'Lista de solicitudes' })
  findAll(
    @Query('status') status?: string,
    @Query('request_type') requestType?: string,
  ): Promise<Request[]> {
    return this.requestService.findAll(status, requestType);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de solicitud' })
  @ApiResponse({ status: 200, description: 'Solicitud encontrada' })
  @ApiResponse({ status: 404, description: 'Solicitud no encontrada' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Request> {
    const request = await this.requestService.findOne(id);
    if (!request) {
      throw new NotFoundException('Solicitud no encontrada');
    }
    return request;
  }

  @Post()
  @ApiOperation({ summary: 'Crear solicitud' })
  @ApiResponse({ status: 201, description: 'Solicitud creada exitosamente' })
  create(@Body() dto: CreateRequestDto): Promise<Request> {
    return this.requestService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar solicitud' })
  @ApiResponse({ status: 200, description: 'Solicitud actualizada' })
  @ApiResponse({ status: 404, description: 'Solicitud no encontrada' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRequestDto,
  ): Promise<Request> {
    const request = await this.requestService.update(id, dto);
    if (!request) {
      throw new NotFoundException('Solicitud no encontrada');
    }
    return request;
  }

  @Patch(':id/respond')
  @ApiOperation({ summary: 'Responder solicitud (la marca como approved)' })
  @ApiResponse({ status: 200, description: 'Solicitud respondida exitosamente' })
  @ApiResponse({ status: 400, description: 'La solicitud ya fue respondida' })
  @ApiResponse({ status: 404, description: 'Solicitud no encontrada' })
  async respond(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: RespondRequestDto,
  ): Promise<Request> {
    const request = await this.requestService.respond(id, dto);
    if (!request) {
      throw new NotFoundException('Solicitud no encontrada');
    }
    return request;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Rechazar solicitud (soft-delete)' })
  @ApiResponse({ status: 204, description: 'Solicitud rechazada' })
  @ApiResponse({ status: 404, description: 'Solicitud no encontrada' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    const request = await this.requestService.findOne(id);
    if (!request) {
      throw new NotFoundException('Solicitud no encontrada');
    }
    await this.requestService.remove(id);
  }
}
