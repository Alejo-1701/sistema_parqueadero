import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PqrsController } from './pqrs.controller';
import { PqrsService } from '../services/pqrs.service';

describe('PqrsController', () => {
  let controller: PqrsController;
  let service: any;

  const mockPqrs = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Falta alumbrado',
    pqrType: 'complaint',
    requesterPersonId: 'uuid',
    status: 'open',
    priority: 'normal',
  };

  const mockService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    respond: jest.fn(),
    score: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PqrsController],
      providers: [{ provide: PqrsService, useValue: mockService }],
    }).compile();

    controller = module.get<PqrsController>(PqrsController);
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all pqrs', async () => {
    mockService.findAll.mockResolvedValue([mockPqrs]);
    const result = await controller.findAll();
    expect(result).toEqual([mockPqrs]);
  });

  it('should return a pqrs by id', async () => {
    mockService.findOne.mockResolvedValue(mockPqrs);
    const result = await controller.findOne(mockPqrs.id);
    expect(result).toEqual(mockPqrs);
  });

  it('should throw NotFoundException', async () => {
    mockService.findOne.mockResolvedValue(null);
    await expect(controller.findOne('bad-id')).rejects.toThrow(NotFoundException);
  });

  it('should create a pqrs', async () => {
    const dto = {
      description: 'Test',
      pqrType: 'complaint' as const,
      requesterPersonId: 'uuid',
    };
    mockService.create.mockResolvedValue(mockPqrs);
    const result = await controller.create(dto);
    expect(result).toEqual(mockPqrs);
  });

  it('should respond to a pqrs', async () => {
    const dto = { response: 'Solucionado' };
    mockService.respond.mockResolvedValue({ ...mockPqrs, status: 'resolved' });
    const result = await controller.respond(mockPqrs.id, dto);
    expect(result.status).toBe('resolved');
  });

  it('should score a pqrs', async () => {
    const dto = { satisfactionScore: 5 };
    mockService.score.mockResolvedValue({ ...mockPqrs, status: 'closed', satisfactionScore: 5 });
    const result = await controller.score(mockPqrs.id, dto);
    expect(result.status).toBe('closed');
  });
});
