import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { Notification } from '../entities/notification.entity';
import { CreateNotificationDto, UpdateNotificationDto } from '../dto/notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async findAll(
    status?: string,
    recipientPersonId?: string,
  ): Promise<Notification[]> {
    const where: Record<string, string> = {};

    if (status) where.status = status;
    if (recipientPersonId) where.recipientPersonId = recipientPersonId;

    return this.notificationRepository.find({
      where,
      relations: ['recipient', 'sender'],
      order: { sentAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Notification | null> {
    return this.notificationRepository.findOne({
      where: { id },
      relations: ['recipient', 'sender', 'tenant'],
    });
  }

  async create(dto: CreateNotificationDto): Promise<Notification> {
    const notification = this.notificationRepository.create(dto);
    return this.saveWithErrorHandling(notification);
  }

  async update(id: string, dto: UpdateNotificationDto): Promise<Notification | null> {
    const notification = await this.notificationRepository.preload({ id, ...dto });
    if (!notification) return null;

    return this.saveWithErrorHandling(notification);
  }

  async markAsRead(id: string): Promise<Notification | null> {
    const notification = await this.notificationRepository.findOne({ where: { id } });
    if (!notification) return null;

    if (notification.status === 'archived') {
      throw new BadRequestException('No se puede marcar como leída una notificación archivada');
    }

    notification.status = 'read';
    notification.readAt = new Date();

    return this.saveWithErrorHandling(notification);
  }

  async archive(id: string): Promise<Notification | null> {
    const notification = await this.notificationRepository.findOne({ where: { id } });
    if (!notification) return null;

    notification.status = 'archived';

    return this.saveWithErrorHandling(notification);
  }

  async remove(id: string): Promise<void> {
    await this.notificationRepository.update(id, { status: 'archived' });
  }

  private async saveWithErrorHandling(entity: Notification): Promise<Notification> {
    try {
      return await this.notificationRepository.save(entity);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const driverError = error as any;
        const code = driverError?.code ?? driverError?.driverError?.code;

        if (code === '23505') {
          throw new BadRequestException('La notificación ya existe en este tenant');
        }
        if (code === '23503') {
          const detail = driverError?.detail ?? driverError?.driverError?.detail ?? '';
          if (detail.includes('recipient_person_id')) {
            throw new BadRequestException('La persona destinataria no existe');
          }
          if (detail.includes('sender_account_id')) {
            throw new BadRequestException('La cuenta remitente no existe');
          }
          throw new BadRequestException('Error de referencia: entidad relacionada no encontrada');
        }
      }
      throw error;
    }
  }
}
