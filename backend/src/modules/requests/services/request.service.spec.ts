import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { RequestService } from './request.service';
import { Request } from '../entities/request.entity';
import { QueryFailedError } from 'typeorm';

describe('RequestService', () => {
  let service: RequestService;
  let repository: any;

  const mockRequest = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    tenantId: '550e8400-e29b-41d4-a716-446655440001',
    requestType: 'access',
    status: 'pending',
    requesterPersonId: '550e8400-e29b-41d4-a716-446655440002',
    description: 'Solicito acceso al parqueadero',
    requestedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    preload: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestService,
        {
          provide: getRepositoryToken(Request),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<RequestService>(RequestService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all requests without filters', async () => {
      mockRepository.find.mockResolvedValue([mockRequest]);
      const result = await service.findAll();
      expect(result).toEqual([mockRequest]);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: {},
        relations: ['requester', 'responder'],
        order: { requestedAt: 'DESC' },
      });
    });

    it('should filter by status', async () => {
      mockRepository.find.mockResolvedValue([mockRequest]);
      await service.findAll('pending');
      expect(mockRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: 'pending' },
        }),
      );
    });

    it('should filter by requestType', async () => {
      mockRepository.find.mockResolvedValue([mockRequest]);
      await service.findAll(undefined, 'access');
      expect(mockRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { requestType: 'access' },
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a request by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockRequest);
      const result = await service.findOne(mockRequest.id);
      expect(result).toEqual(mockRequest);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockRequest.id },
        relations: ['requester', 'responder', 'tenant'],
      });
    });

    it('should return null if not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      const result = await service.findOne('nonexistent-id');
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    const createDto = {
      requestType: 'access' as const,
      requesterPersonId: '550e8400-e29b-41d4-a716-446655440002',
      description: 'Solicito acceso al parqueadero',
    };

    it('should create a request with pending status', async () => {
      mockRepository.create.mockReturnValue(mockRequest);
      mockRepository.save.mockResolvedValue(mockRequest);

      const result = await service.create(createDto);
      expect(result).toEqual(mockRequest);
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createDto,
        status: 'pending',
      });
    });

    it('should throw BadRequestException on duplicate', async () => {
      mockRepository.create.mockReturnValue(mockRequest);
      const queryError = new QueryFailedError('INSERT', [], { code: '23505' } as any);
      mockRepository.save.mockRejectedValue(queryError);

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException on FK violation', async () => {
      mockRepository.create.mockReturnValue(mockRequest);
      const queryError = new QueryFailedError('INSERT', [], {
        code: '23503',
        detail: 'requester_person_id',
      } as any);
      mockRepository.save.mockRejectedValue(queryError);

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update an existing request', async () => {
      const updateDto = { description: 'Descripción actualizada' };
      mockRepository.preload.mockResolvedValue(mockRequest);
      mockRepository.save.mockResolvedValue({ ...mockRequest, ...updateDto });

      const result = await service.update(mockRequest.id, updateDto);
      expect(result).toBeDefined();
      expect(mockRepository.preload).toHaveBeenCalledWith({
        id: mockRequest.id,
        ...updateDto,
      });
    });

    it('should return null if request not found', async () => {
      mockRepository.preload.mockResolvedValue(null);
      const result = await service.update('nonexistent-id', { description: 'test' });
      expect(result).toBeNull();
    });
  });

  describe('respond', () => {
    const respondDto = {
      responderPersonId: '550e8400-e29b-41d4-a716-446655440003',
      response: 'Solicitud aprobada',
    };

    it('should respond to a pending request', async () => {
      mockRepository.findOne.mockResolvedValue(mockRequest);
      mockRepository.save.mockResolvedValue({
        ...mockRequest,
        ...respondDto,
        status: 'approved',
        respondedAt: expect.any(Date),
      });

      const result = await service.respond(mockRequest.id, respondDto);
      expect(result).toBeDefined();
      expect(result?.status).toBe('approved');
    });

    it('should throw if request was already responded', async () => {
      mockRepository.findOne.mockResolvedValue({
        ...mockRequest,
        status: 'approved',
      });

      await expect(service.respond(mockRequest.id, respondDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should return null if request not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      const result = await service.respond('nonexistent-id', respondDto);
      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should soft-delete by setting status to rejected', async () => {
      mockRepository.update.mockResolvedValue({ affected: 1 });
      await service.remove(mockRequest.id);
      expect(mockRepository.update).toHaveBeenCalledWith(mockRequest.id, {
        status: 'rejected',
      });
    });
  });
});
