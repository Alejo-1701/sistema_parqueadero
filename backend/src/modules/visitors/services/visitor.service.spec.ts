import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { VisitorService } from './visitor.service';
import { Visitor } from '../entities/visitor.entity';

describe('VisitorService', () => {
  let service: VisitorService;
  let repository: Repository<Visitor>;

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VisitorService,
        {
          provide: getRepositoryToken(Visitor),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            preload: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<VisitorService>(VisitorService);
    repository = module.get<Repository<Visitor>>(getRepositoryToken(Visitor));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all visitors without filters', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue([mockVisitor]);
      const result = await service.findAll();
      expect(result).toEqual([mockVisitor]);
      expect(repository.find).toHaveBeenCalledWith({
        where: {},
        relations: ['person', 'visitingApartment', 'authorizedBy'],
        order: { checkInAt: 'DESC' },
      });
    });

    it('should filter by status', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue([mockVisitor]);
      await service.findAll('active');
      expect(repository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: 'active' },
        }),
      );
    });
  });

  describe('findActive', () => {
    it('should return only active visitors', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue([mockVisitor]);
      const result = await service.findActive();
      expect(result).toEqual([mockVisitor]);
      expect(repository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: 'active' },
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a visitor by id', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockVisitor);
      const result = await service.findOne(mockVisitor.id);
      expect(result).toEqual(mockVisitor);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: mockVisitor.id },
        relations: ['person', 'visitingApartment', 'authorizedBy', 'tenant'],
      });
    });

    it('should return null if not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      const result = await service.findOne('non-existent-id');
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a visitor with status active', async () => {
      const dto = {
        visitType: 'occasional' as const,
        vehicleType: 'car' as const,
        personId: 'person-uuid-1',
        vehiclePlate: 'ABC-123',
        visitingApartmentId: 'apt-uuid-1',
      };

      jest.spyOn(repository, 'create').mockReturnValue(mockVisitor);
      jest.spyOn(repository, 'save').mockResolvedValue(mockVisitor);

      const result = await service.create(dto);

      expect(result.status).toBe('active');
      expect(repository.create).toHaveBeenCalledWith({
        ...dto,
        status: 'active',
      });
    });
  });

  describe('checkOut', () => {
    it('should set status to expired and record check_out_at', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockVisitor);
      jest.spyOn(repository, 'save').mockResolvedValue({
        ...mockVisitor,
        status: 'expired',
        checkOutAt: new Date(),
      });

      const result = await service.checkOut(mockVisitor.id);

      expect(result?.status).toBe('expired');
      expect(result?.checkOutAt).toBeDefined();
    });

    it('should throw if visitor already checked out', async () => {
      const expiredVisitor = { ...mockVisitor, status: 'expired' as const };
      jest.spyOn(repository, 'findOne').mockResolvedValue(expiredVisitor as Visitor);

      await expect(service.checkOut(mockVisitor.id)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('remove', () => {
    it('should set status to inactive (soft-delete)', async () => {
      jest.spyOn(repository, 'update').mockResolvedValue({ affected: 1 } as any);
      await service.remove(mockVisitor.id);
      expect(repository.update).toHaveBeenCalledWith(mockVisitor.id, {
        status: 'inactive',
      });
    });
  });
});
