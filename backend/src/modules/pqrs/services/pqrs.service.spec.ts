import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { PqrsService } from './pqrs.service';
import { Pqrs } from '../entities/pqrs.entity';

describe('PqrsService', () => {
  let service: PqrsService;

  function buildMockPqrs() {
    return {
      id: '550e8400-e29b-41d4-a716-446655440000',
      tenantId: '550e8400-e29b-41d4-a716-446655440001',
      description: 'Falta alumbrado en el parqueadero',
      pqrType: 'complaint',
      requesterPersonId: '550e8400-e29b-41d4-a716-446655440002',
      registeredAt: new Date('2025-01-01T00:00:00Z'),
      status: 'open' as const,
      priority: 'normal' as const,
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
        PqrsService,
        {
          provide: getRepositoryToken(Pqrs),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PqrsService>(PqrsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all pqrs without filters', async () => {
      const mockPqrs = buildMockPqrs();
      mockRepository.find.mockResolvedValue([mockPqrs]);
      const result = await service.findAll();
      expect(result).toEqual([mockPqrs]);
    });

    it('should filter by status', async () => {
      mockRepository.find.mockResolvedValue([buildMockPqrs()]);
      await service.findAll('open');
      expect(mockRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({ where: { status: 'open' } }),
      );
    });
  });

  describe('create', () => {
    const createDto = {
      description: 'Falta alumbrado',
      pqrType: 'complaint' as const,
      requesterPersonId: 'uuid',
    };

    it('should create a pqrs with open status', async () => {
      const mockPqrs = buildMockPqrs();
      mockRepository.create.mockReturnValue(mockPqrs);
      mockRepository.save.mockResolvedValue(mockPqrs);
      const result = await service.create(createDto);
      expect(result).toEqual(mockPqrs);
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createDto,
        status: 'open',
      });
    });
  });

  describe('respond', () => {
    const respondDto = { response: 'Problema solucionado' };

    it('should respond to an open pqrs', async () => {
      const mockPqrs = buildMockPqrs();
      mockRepository.findOne.mockResolvedValue(mockPqrs);
      mockRepository.save.mockResolvedValue({ ...mockPqrs, ...respondDto, status: 'resolved' });

      const result = await service.respond(mockPqrs.id, respondDto);
      expect(result?.status).toBe('resolved');
    });

    it('should throw if pqrs is closed', async () => {
      const mockPqrs = buildMockPqrs();
      mockRepository.findOne.mockResolvedValue({ ...mockPqrs, status: 'closed' });
      await expect(service.respond(mockPqrs.id, respondDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('score', () => {
    const scoreDto = { satisfactionScore: 4 };

    it('should score a resolved pqrs', async () => {
      const mockPqrs = buildMockPqrs();
      mockRepository.findOne.mockResolvedValue({ ...mockPqrs, status: 'resolved' });
      mockRepository.save.mockResolvedValue({ ...mockPqrs, ...scoreDto, status: 'closed' });

      const result = await service.score(mockPqrs.id, scoreDto);
      expect(result?.status).toBe('closed');
      expect(result?.satisfactionScore).toBe(4);
    });

    it('should throw if pqrs is not resolved', async () => {
      const mockPqrs = buildMockPqrs();
      mockRepository.findOne.mockResolvedValue(mockPqrs);
      await expect(service.score(mockPqrs.id, scoreDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw if already scored', async () => {
      const mockPqrs = buildMockPqrs();
      mockRepository.findOne.mockResolvedValue({
        ...mockPqrs,
        status: 'resolved',
        satisfactionScore: 5,
      });
      await expect(service.score(mockPqrs.id, scoreDto)).rejects.toThrow(BadRequestException);
    });
  });
});
