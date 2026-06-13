import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { Pqrs } from '../entities/pqrs.entity';
import { CreatePqrsDto, UpdatePqrsDto, RespondPqrsDto, ScorePqrsDto } from '../dto/pqrs.dto';

@Injectable()
export class PqrsService {
  constructor(
    @InjectRepository(Pqrs)
    private readonly pqrsRepository: Repository<Pqrs>,
  ) {}

  async findAll(
    status?: string,
    pqrType?: string,
  ): Promise<Pqrs[]> {
    const where: Record<string, string> = {};

    if (status) where.status = status;
    if (pqrType) where.pqrType = pqrType;

    return this.pqrsRepository.find({
      where,
      relations: ['requester', 'assignedPerson'],
      order: { registeredAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Pqrs | null> {
    return this.pqrsRepository.findOne({
      where: { id },
      relations: ['requester', 'assignedPerson', 'tenant'],
    });
  }

  async create(dto: CreatePqrsDto): Promise<Pqrs> {
    const pqrs = this.pqrsRepository.create({
      ...dto,
      status: 'open',
    });

    return this.saveWithErrorHandling(pqrs);
  }

  async update(id: string, dto: UpdatePqrsDto): Promise<Pqrs | null> {
    const pqrs = await this.pqrsRepository.preload({ id, ...dto });
    if (!pqrs) return null;

    return this.saveWithErrorHandling(pqrs);
  }

  async respond(id: string, dto: RespondPqrsDto): Promise<Pqrs | null> {
    const pqrs = await this.pqrsRepository.findOne({ where: { id } });
    if (!pqrs) return null;

    if (pqrs.status === 'closed' || pqrs.status === 'rejected') {
      throw new BadRequestException('La PQRS ya está cerrada o rechazada');
    }

    pqrs.response = dto.response;
    pqrs.respondedAt = new Date();
    pqrs.status = 'resolved';

    return this.saveWithErrorHandling(pqrs);
  }

  async score(id: string, dto: ScorePqrsDto): Promise<Pqrs | null> {
    const pqrs = await this.pqrsRepository.findOne({ where: { id } });
    if (!pqrs) return null;

    if (pqrs.status !== 'resolved') {
      throw new BadRequestException('Solo se puede calificar una PQRS resuelta');
    }

    if (pqrs.satisfactionScore !== null && pqrs.satisfactionScore !== undefined) {
      throw new BadRequestException('La PQRS ya fue calificada');
    }

    pqrs.satisfactionScore = dto.satisfactionScore;
    pqrs.status = 'closed';

    return this.saveWithErrorHandling(pqrs);
  }

  async remove(id: string): Promise<void> {
    await this.pqrsRepository.update(id, { status: 'rejected' });
  }

  private async saveWithErrorHandling(entity: Pqrs): Promise<Pqrs> {
    try {
      return await this.pqrsRepository.save(entity);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const driverError = error as any;
        const code = driverError?.code ?? driverError?.driverError?.code;

        if (code === '23505') {
          throw new BadRequestException('La PQRS ya existe en este tenant');
        }
        if (code === '23503') {
          const detail = driverError?.detail ?? driverError?.driverError?.detail ?? '';
          if (detail.includes('requester_person_id')) {
            throw new BadRequestException('La persona solicitante no existe');
          }
          if (detail.includes('assigned_person_id')) {
            throw new BadRequestException('La persona asignada no existe');
          }
          throw new BadRequestException('Error de referencia: entidad relacionada no encontrada');
        }
      }
      throw error;
    }
  }
}
