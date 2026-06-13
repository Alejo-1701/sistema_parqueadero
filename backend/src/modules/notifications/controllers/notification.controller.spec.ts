import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from '../services/notification.service';

describe('NotificationController', () => {
  let controller: NotificationController;
  let service: any;

  const mockNotification = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    notificationType: 'entry',
    recipientPersonId: '550e8400-e29b-41d4-a716-446655440002',
    title: 'Entrada de vehículo',
    message: 'Vehículo ingresó',
    status: 'unread',
    priority: 'normal',
  };

  const mockService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    markAsRead: jest.fn(),
    archive: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationController],
      providers: [{ provide: NotificationService, useValue: mockService }],
    }).compile();

    controller = module.get<NotificationController>(NotificationController);
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all notifications', async () => {
    mockService.findAll.mockResolvedValue([mockNotification]);
    const result = await controller.findAll();
    expect(result).toEqual([mockNotification]);
  });

  it('should return a notification by id', async () => {
    mockService.findOne.mockResolvedValue(mockNotification);
    const result = await controller.findOne(mockNotification.id);
    expect(result).toEqual(mockNotification);
  });

  it('should throw NotFoundException if not found', async () => {
    mockService.findOne.mockResolvedValue(null);
    await expect(controller.findOne('bad-id')).rejects.toThrow(NotFoundException);
  });

  it('should create a notification', async () => {
    const dto = {
      notificationType: 'entry' as const,
      recipientPersonId: 'uuid',
      title: 'Test',
      message: 'Test msg',
    };
    mockService.create.mockResolvedValue(mockNotification);
    const result = await controller.create(dto);
    expect(result).toEqual(mockNotification);
  });

  it('should mark as read', async () => {
    mockService.markAsRead.mockResolvedValue({ ...mockNotification, status: 'read' });
    const result = await controller.markAsRead(mockNotification.id);
    expect(result.status).toBe('read');
  });

  it('should archive', async () => {
    mockService.archive.mockResolvedValue({ ...mockNotification, status: 'archived' });
    const result = await controller.archive(mockNotification.id);
    expect(result.status).toBe('archived');
  });
});
