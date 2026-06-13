import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Notification } from '../entities/notification.entity';

describe('NotificationService', () => {
  let service: NotificationService;

  function buildMockNotification() {
    return {
      id: '550e8400-e29b-41d4-a716-446655440000',
      tenantId: '550e8400-e29b-41d4-a716-446655440001',
      notificationType: 'entry',
      recipientPersonId: '550e8400-e29b-41d4-a716-446655440002',
      title: 'Entrada de vehículo',
      message: 'El vehículo ABC-123 ha ingresado',
      sentAt: new Date('2025-01-01T00:00:00Z'),
      status: 'unread',
      priority: 'normal',
      createdAt: new Date('2025-01-01T00:00:00Z'),
      updatedAt: new Date('2025-01-01T00:00:00Z'),
    };
  }

  let mockRepository: {
    find: jest.Mock;
    findOne: jest.Mock;
    create: jest.Mock;
    preload: jest.Mock;
    save: jest.Mock;
    update: jest.Mock;
  };

  beforeEach(async () => {
    mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      preload: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: getRepositoryToken(Notification),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all notifications without filters', async () => {
      const mockNotification = buildMockNotification();
      mockRepository.find.mockResolvedValue([mockNotification]);
      const result = await service.findAll();
      expect(result).toEqual([mockNotification]);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: {},
        relations: ['recipient', 'sender'],
        order: { sentAt: 'DESC' },
      });
    });

    it('should filter by status', async () => {
      mockRepository.find.mockResolvedValue([buildMockNotification()]);
      await service.findAll('unread');
      expect(mockRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({ where: { status: 'unread' } }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a notification by id', async () => {
      const mockNotification = buildMockNotification();
      mockRepository.findOne.mockResolvedValue(mockNotification);
      const result = await service.findOne(mockNotification.id);
      expect(result).toEqual(mockNotification);
    });
  });

  describe('create', () => {
    const createDto = {
      notificationType: 'entry' as const,
      recipientPersonId: '550e8400-e29b-41d4-a716-446655440002',
      title: 'Entrada de vehículo',
      message: 'El vehículo ABC-123 ha ingresado',
    };

    it('should create a notification', async () => {
      const mockNotification = buildMockNotification();
      mockRepository.create.mockReturnValue(mockNotification);
      mockRepository.save.mockResolvedValue(mockNotification);
      const result = await service.create(createDto);
      expect(result).toEqual(mockNotification);
    });
  });

  describe('markAsRead', () => {
    it('should mark a notification as read', async () => {
      const mockNotification = buildMockNotification();
      const unread = { ...mockNotification, status: 'unread', readAt: null };
      mockRepository.findOne.mockResolvedValue(unread);
      mockRepository.save.mockResolvedValue({ ...unread, status: 'read', readAt: new Date('2025-01-02T00:00:00Z') });

      const result = await service.markAsRead(mockNotification.id);
      expect(result?.status).toBe('read');
    });

    it('should throw if notification is archived', async () => {
      const mockNotification = buildMockNotification();
      mockRepository.findOne.mockResolvedValue({ ...mockNotification, status: 'archived' });
      await expect(service.markAsRead(mockNotification.id)).rejects.toThrow(BadRequestException);
    });
  });

  describe('archive', () => {
    it('should archive a notification', async () => {
      const mockNotification = buildMockNotification();
      mockRepository.findOne.mockResolvedValue(mockNotification);
      mockRepository.save.mockResolvedValue({ ...mockNotification, status: 'archived' });

      const result = await service.archive(mockNotification.id);
      expect(result?.status).toBe('archived');
    });
  });
});
