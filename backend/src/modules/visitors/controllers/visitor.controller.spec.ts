import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { VisitorController } from './visitor.controller';
import { VisitorService } from '../services/visitor.service';
import { Visitor } from '../entities/visitor.entity';

describe('VisitorController', () => {
  let controller: VisitorController;
  let service: VisitorService;

  const mockVisitor = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    tenantId: 'tenant-uuid-1',
    visitType: 'occasional' as const,
    vehicleType: 'car' as const,
    personId: 'person-uuid-1',
    vehiclePlate: 'ABC-123',
    visitingApartmentId: 'apt-uuid-1',
    authorizedByPersonId: undefined,
    checkInAt: new Date(),
    checkOutAt: undefined,
    status: 'active' as const,
    notes: undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Visitor;

  const mockService = {
    findAll: jest.fn(),
    findActive: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    checkOut: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VisitorController],
      providers: [
        {
          provide: VisitorService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<VisitorController>(VisitorController);
    service = module.get<VisitorService>(VisitorService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all visitors', async () => {
      mockService.findAll.mockResolvedValue([mockVisitor]);
      const result = await controller.findAll();
      expect(result).toEqual([mockVisitor]);
      expect(mockService.findAll).toHaveBeenCalled();
    });

    it('should pass query filters to service', async () => {
      mockService.findAll.mockResolvedValue([mockVisitor]);
      await controller.findAll('active', 'occasional', 'apt-uuid-1');
      expect(mockService.findAll).toHaveBeenCalledWith(
        'active',
        'occasional',
        'apt-uuid-1',
      );
    });
  });

  describe('findActive', () => {
    it('should return active visitors only', async () => {
      mockService.findActive.mockResolvedValue([mockVisitor]);
      const result = await controller.findActive();
      expect(result).toEqual([mockVisitor]);
      expect(mockService.findActive).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a visitor if found', async () => {
      mockService.findOne.mockResolvedValue(mockVisitor);
      const result = await controller.findOne(mockVisitor.id);
      expect(result).toEqual(mockVisitor);
    });

    it('should throw NotFoundException if not found', async () => {
      mockService.findOne.mockResolvedValue(null);
      await expect(controller.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create a visitor', async () => {
      const dto = {
        visitType: 'occasional' as const,
        vehicleType: 'car' as const,
        personId: 'person-uuid-1',
      };
      mockService.create.mockResolvedValue(mockVisitor);
      const result = await controller.create(dto);
      expect(result).toEqual(mockVisitor);
      expect(mockService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should update a visitor if found', async () => {
      const dto = { vehiclePlate: 'XYZ-789' };
      mockService.update.mockResolvedValue({ ...mockVisitor, ...dto });
      const result = await controller.update(mockVisitor.id, dto);
      expect(result.vehiclePlate).toBe('XYZ-789');
    });

    it('should throw NotFoundException if not found', async () => {
      mockService.update.mockResolvedValue(null);
      await expect(controller.update('non-existent-id', {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('checkOut', () => {
    it('should check out a visitor', async () => {
      const checkedOut = {
        ...mockVisitor,
        status: 'expired' as const,
        checkOutAt: new Date(),
      };
      mockService.checkOut.mockResolvedValue(checkedOut);
      const result = await controller.checkOut(mockVisitor.id, {});
      expect(result.status).toBe('expired');
      expect(result.checkOutAt).toBeDefined();
    });

    it('should throw NotFoundException if visitor not found', async () => {
      mockService.checkOut.mockResolvedValue(null);
      await expect(controller.checkOut('non-existent-id', {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should soft-delete a visitor if found', async () => {
      mockService.findOne.mockResolvedValue(mockVisitor);
      mockService.remove.mockResolvedValue(undefined);
      await controller.remove(mockVisitor.id);
      expect(mockService.remove).toHaveBeenCalledWith(mockVisitor.id);
    });

    it('should throw NotFoundException if not found', async () => {
      mockService.findOne.mockResolvedValue(null);
      await expect(controller.remove('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
