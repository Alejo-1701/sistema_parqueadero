import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { Request } from '../entities/request.entity';
import { CreateRequestDto, UpdateRequestDto, RespondRequestDto } from '../dto/request.dto';

@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(Request)
    private readonly requestRepository: Repository<Request>,
  ) {}

  async findAll(
    status?: string,
    requestType?: string,
  ): Promise<Request[]> {
    const where: Record<string, string> = {};

    if (status) where.status = status;
    if (requestType) where.requestType = requestType;

    return this.requestRepository.find({
      where,
      relations: ['requester', 'responder'],
      order: { requestedAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Request | null> {
    return this.requestRepository.findOne({
      where: { id },
      relations: ['requester', 'responder', 'tenant'],
    });
  }

  async create(dto: CreateRequestDto): Promise<Request> {
    const request = this.requestRepository.create({
      ...dto,
      status: 'pending',
    });

    return this.saveWithErrorHandling(request);
  }

  async update(id: string, dto: UpdateRequestDto): Promise<Request | null> {
    const request = await this.requestRepository.preload({ id, ...dto });
    if (!request) return null;

    return this.saveWithErrorHandling(request);
  }

  async respond(id: string, dto: RespondRequestDto): Promise<Request | null> {
    const request = await this.requestRepository.findOne({ where: { id } });
    if (!request) return null;

    if (request.status === 'approved' || request.status === 'rejected') {
      throw new BadRequestException('La solicitud ya fue respondida');
    }

    request.responderPersonId = dto.responderPersonId;
    request.response = dto.response;
    request.respondedAt = new Date();
    request.status = 'approved';

    return this.saveWithErrorHandling(request);
  }

  async remove(id: string): Promise<void> {
    await this.requestRepository.update(id, { status: 'rejected' });
  }

  private async saveWithErrorHandling(entity: Request): Promise<Request> {
    try {
      return await this.requestRepository.save(entity);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const driverError = error as any;
        const code = driverError?.code ?? driverError?.driverError?.code;

        if (code === '23505') {
          throw new BadRequestException('La solicitud ya existe en este tenant');
        }
        if (code === '23503') {
          const detail = driverError?.detail ?? driverError?.driverError?.detail ?? '';
          if (detail.includes('requester_person_id')) {
            throw new BadRequestException('La persona solicitante no existe');
          }
          if (detail.includes('responder_person_id')) {
            throw new BadRequestException('La persona respondedora no existe');
          }
          throw new BadRequestException('Error de referencia: entidad relacionada no encontrada');
        }
      }
      throw error;
    }
  }
}
