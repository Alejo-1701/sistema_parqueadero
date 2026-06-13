import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { RequestController } from './request.controller';
import { RequestService } from '../services/request.service';
import { CreateRequestDto, UpdateRequestDto, RespondRequestDto } from '../dto/request.dto';

describe('RequestController', () => {
  let controller: RequestController;
  let service: any;

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

  const mockService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    respond: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequestController],
      providers: [
        {
          provide: RequestService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<RequestController>(RequestController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all requests', async () => {
      mockService.findAll.mockResolvedValue([mockRequest]);
      const result = await controller.findAll();
      expect(result).toEqual([mockRequest]);
    });

    it('should filter by status and requestType', async () => {
      mockService.findAll.mockResolvedValue([mockRequest]);
      await controller.findAll('pending', 'access');
      expect(mockService.findAll).toHaveBeenCalledWith('pending', 'access');
    });
  });

  describe('findOne', () => {
    it('should return a request by id', async () => {
      mockService.findOne.mockResolvedValue(mockRequest);
      const result = await controller.findOne(mockRequest.id);
      expect(result).toEqual(mockRequest);
    });

    it('should throw NotFoundException if not found', async () => {
      mockService.findOne.mockResolvedValue(null);
      await expect(controller.findOne('nonexistent-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a request', async () => {
      const dto: CreateRequestDto = {
        requestType: 'access',
        requesterPersonId: '550e8400-e29b-41d4-a716-446655440002',
        description: 'Solicito acceso',
      };
      mockService.create.mockResolvedValue(mockRequest);
      const result = await controller.create(dto);
      expect(result).toEqual(mockRequest);
      expect(mockService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should update a request', async () => {
      const dto: UpdateRequestDto = { description: 'Actualizado' };
      mockService.update.mockResolvedValue(mockRequest);
      const result = await controller.update(mockRequest.id, dto);
      expect(result).toEqual(mockRequest);
    });

    it('should throw NotFoundException if not found', async () => {
      mockService.update.mockResolvedValue(null);
      await expect(controller.update('nonexistent-id', {} as UpdateRequestDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('respond', () => {
    it('should respond to a request', async () => {
      const dto: RespondRequestDto = {
        responderPersonId: '550e8400-e29b-41d4-a716-446655440003',
        response: 'Aprobado',
      };
      mockService.respond.mockResolvedValue({ ...mockRequest, status: 'approved' });
      const result = await controller.respond(mockRequest.id, dto);
      expect(result.status).toBe('approved');
    });

    it('should throw NotFoundException if not found', async () => {
      mockService.respond.mockResolvedValue(null);
      await expect(
        controller.respond('nonexistent-id', {} as RespondRequestDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should soft-delete a request', async () => {
      mockService.findOne.mockResolvedValue(mockRequest);
      mockService.remove.mockResolvedValue(undefined);
      await expect(controller.remove(mockRequest.id)).resolves.toBeUndefined();
    });

    it('should throw NotFoundException if not found', async () => {
      mockService.findOne.mockResolvedValue(null);
      await expect(controller.remove('nonexistent-id')).rejects.toThrow(NotFoundException);
    });
  });
});
