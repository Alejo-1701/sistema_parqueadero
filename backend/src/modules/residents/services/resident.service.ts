import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { Resident } from '../entities/resident.entity';
import { CreateResidentDto, UpdateResidentDto } from '../dto/resident.dto';

@Injectable()
export class ResidentService {
  constructor(
    @InjectRepository(Resident)
    private readonly residentRepository: Repository<Resident>,
  ) {}

  async findAll(
    status?: string,
    residentType?: string,
    apartmentId?: string,
  ): Promise<Resident[]> {
    const where: Record<string, string> = {};

    if (status) where.status = status;
    if (residentType) where.residentType = residentType;
    if (apartmentId) where.apartmentId = apartmentId;

    return this.residentRepository.find({
      where,
      relations: ['person', 'apartment'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Resident | null> {
    return this.residentRepository.findOne({
      where: { id },
      relations: ['person', 'apartment', 'tenant'],
    });
  }

  async create(dto: CreateResidentDto): Promise<Resident> {
    this.validateDateRange(dto.moveInDate, dto.moveOutDate);

    const resident = this.residentRepository.create({
      ...dto,
      status: dto.status ?? 'active',
    });

    return this.saveWithErrorHandling(resident);
  }

  async update(id: string, dto: UpdateResidentDto): Promise<Resident | null> {
    if (dto.moveOutDate) {
      const existing = await this.residentRepository.findOne({ where: { id } });
      if (existing) {
        this.validateDateRange(
          dto.moveInDate ?? existing.moveInDate.toISOString().split('T')[0],
          dto.moveOutDate,
        );
      }
    }

    const resident = await this.residentRepository.preload({ id, ...dto });
    if (!resident) return null;

    return this.saveWithErrorHandling(resident);
  }

  async remove(id: string): Promise<void> {
    await this.residentRepository.update(id, { status: 'inactive' });
  }

  private validateDateRange(moveInDate: string, moveOutDate?: string): void {
    if (moveOutDate && new Date(moveOutDate) < new Date(moveInDate)) {
      throw new BadRequestException(
        'La fecha de salida no puede ser anterior a la fecha de ingreso',
      );
    }
  }

  private async saveWithErrorHandling(
    entity: Resident,
  ): Promise<Resident> {
    try {
      return await this.residentRepository.save(entity);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const driverError = error as any;
        const code = driverError?.code ?? driverError?.driverError?.code;

        if (code === '23505') {
          throw new BadRequestException(
            'El código de residente ya existe en este tenant',
          );
        }
        if (code === '23503') {
          const detail = driverError?.detail ?? driverError?.driverError?.detail ?? '';
          if (detail.includes('person_id')) {
            throw new BadRequestException('La persona especificada no existe');
          }
          if (detail.includes('apartment_id')) {
            throw new BadRequestException('El apartamento especificado no existe');
          }
          throw new BadRequestException('Error de referencia: entidad relacionada no encontrada');
        }
      }
      throw error;
    }
  }
}
