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
import { NotificationService } from '../services/notification.service';
import { CreateNotificationDto, UpdateNotificationDto } from '../dto/notification.dto';
import { Notification } from '../entities/notification.entity';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @ApiOperation({ summary: 'Listar notificaciones' })
  @ApiResponse({ status: 200, description: 'Lista de notificaciones' })
  findAll(
    @Query('status') status?: string,
    @Query('recipient_person_id') recipientPersonId?: string,
  ): Promise<Notification[]> {
    return this.notificationService.findAll(status, recipientPersonId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de notificación' })
  @ApiResponse({ status: 200, description: 'Notificación encontrada' })
  @ApiResponse({ status: 404, description: 'Notificación no encontrada' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Notification> {
    const notification = await this.notificationService.findOne(id);
    if (!notification) {
      throw new NotFoundException('Notificación no encontrada');
    }
    return notification;
  }

  @Post()
  @ApiOperation({ summary: 'Crear notificación' })
  @ApiResponse({ status: 201, description: 'Notificación creada exitosamente' })
  create(@Body() dto: CreateNotificationDto): Promise<Notification> {
    return this.notificationService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar notificación' })
  @ApiResponse({ status: 200, description: 'Notificación actualizada' })
  @ApiResponse({ status: 404, description: 'Notificación no encontrada' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateNotificationDto,
  ): Promise<Notification> {
    const notification = await this.notificationService.update(id, dto);
    if (!notification) {
      throw new NotFoundException('Notificación no encontrada');
    }
    return notification;
  }

  @Post(':id/read')
  @ApiOperation({ summary: 'Marcar notificación como leída' })
  @ApiResponse({ status: 200, description: 'Notificación marcada como leída' })
  @ApiResponse({ status: 400, description: 'No se puede marcar una notificación archivada' })
  @ApiResponse({ status: 404, description: 'Notificación no encontrada' })
  async markAsRead(@Param('id', ParseUUIDPipe) id: string): Promise<Notification> {
    const notification = await this.notificationService.markAsRead(id);
    if (!notification) {
      throw new NotFoundException('Notificación no encontrada');
    }
    return notification;
  }

  @Post(':id/archive')
  @ApiOperation({ summary: 'Archivar notificación' })
  @ApiResponse({ status: 200, description: 'Notificación archivada' })
  @ApiResponse({ status: 404, description: 'Notificación no encontrada' })
  async archive(@Param('id', ParseUUIDPipe) id: string): Promise<Notification> {
    const notification = await this.notificationService.archive(id);
    if (!notification) {
      throw new NotFoundException('Notificación no encontrada');
    }
    return notification;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Archivar notificación (soft-delete)' })
  @ApiResponse({ status: 204, description: 'Notificación archivada' })
  @ApiResponse({ status: 404, description: 'Notificación no encontrada' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    const notification = await this.notificationService.findOne(id);
    if (!notification) {
      throw new NotFoundException('Notificación no encontrada');
    }
    await this.notificationService.remove(id);
  }
}
