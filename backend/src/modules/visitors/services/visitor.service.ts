import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { Visitor } from '../entities/visitor.entity';
import { CreateVisitorDto, UpdateVisitorDto } from '../dto/visitor.dto';

@Injectable()
export class VisitorService {
  constructor(
    @InjectRepository(Visitor)
    private readonly visitorRepository: Repository<Visitor>,
  ) {}

  async findAll(
    status?: string,
    visitType?: string,
    apartmentId?: string,
  ): Promise<Visitor[]> {
    const where: Record<string, string> = {};

    if (status) where.status = status;
    if (visitType) where.visitType = visitType;
    if (apartmentId) where.visitingApartmentId = apartmentId;

    return this.visitorRepository.find({
      where,
      relations: ['person', 'visitingApartment', 'authorizedBy'],
      order: { checkInAt: 'DESC' },
    });
  }

  async findActive(): Promise<Visitor[]> {
    return this.visitorRepository.find({
      where: { status: 'active' },
      relations: ['person', 'visitingApartment', 'authorizedBy'],
      order: { checkInAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Visitor | null> {
    return this.visitorRepository.findOne({
      where: { id },
      relations: ['person', 'visitingApartment', 'authorizedBy', 'tenant'],
    });
  }

  async create(dto: CreateVisitorDto): Promise<Visitor> {
    const visitor = this.visitorRepository.create({
      ...dto,
      status: 'active',
    });

    return this.saveWithErrorHandling(visitor);
  }

  async update(id: string, dto: UpdateVisitorDto): Promise<Visitor | null> {
    const visitor = await this.visitorRepository.preload({ id, ...dto });
    if (!visitor) return null;

    return this.saveWithErrorHandling(visitor);
  }

  async checkOut(id: string, notes?: string): Promise<Visitor | null> {
    const visitor = await this.visitorRepository.findOne({ where: { id } });
    if (!visitor) return null;

    if (visitor.status === 'expired') {
      throw new BadRequestException('El visitante ya realizó check-out');
    }

    if (visitor.status === 'inactive') {
      throw new BadRequestException('No se puede hacer check-out de un visitante inactivo');
    }

    visitor.status = 'expired';
    visitor.checkOutAt = new Date();
    if (notes) visitor.notes = notes;

    return this.saveWithErrorHandling(visitor);
  }

  async remove(id: string): Promise<void> {
    await this.visitorRepository.update(id, { status: 'inactive' });
  }

  private async saveWithErrorHandling(entity: Visitor): Promise<Visitor> {
    try {
      return await this.visitorRepository.save(entity);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const driverError = error as any;
        const code = driverError?.code ?? driverError?.driverError?.code;

        if (code === '23505') {
          throw new BadRequestException('El visitante ya existe en este tenant');
        }
        if (code === '23503') {
          const detail = driverError?.detail ?? driverError?.driverError?.detail ?? '';
          if (detail.includes('person_id')) {
            throw new BadRequestException('La persona especificada no existe');
          }
          if (detail.includes('visiting_apartment_id')) {
            throw new BadRequestException('El apartamento especificado no existe');
          }
          if (detail.includes('authorized_by_person_id')) {
            throw new BadRequestException('La persona autorizadora no existe');
          }
          throw new BadRequestException('Error de referencia: entidad relacionada no encontrada');
        }
      }
      throw error;
    }
  }
}
