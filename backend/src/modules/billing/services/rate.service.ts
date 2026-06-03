import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { Rate } from '../entities/rate.entity';
import { CreateRateDto, UpdateRateDto } from '../dto/rate.dto';

@Injectable()
export class RateService {
  constructor(
    @InjectRepository(Rate)
    private readonly rateRepository: Repository<Rate>,
  ) {}

  async findAll(rateType?: string, status?: string): Promise<Rate[]> {
    const where: Record<string, string> = {};
    if (rateType) where.rateType = rateType;
    if (status) where.status = status;

    return this.rateRepository.find({
      where,
      relations: ['vehicleCategory', 'parkingLot'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Rate | null> {
    return this.rateRepository.findOne({
      where: { id },
      relations: ['vehicleCategory', 'parkingLot', 'tenant'],
    });
  }

  async create(dto: CreateRateDto): Promise<Rate> {
    const rate = this.rateRepository.create(dto as unknown as Partial<Rate>);
    return this.saveWithErrorHandling(rate);
  }

  async update(id: string, dto: UpdateRateDto): Promise<Rate | null> {
    const rate = await this.rateRepository.preload({ id, ...dto } as unknown as Partial<Rate>);
    if (!rate) return null;

    return this.saveWithErrorHandling(rate);
  }

  async remove(id: string): Promise<void> {
    await this.rateRepository.update(id, { status: 'inactive' } as Partial<Rate>);
  }

  private async saveWithErrorHandling(entity: Rate): Promise<Rate> {
    try {
      return await this.rateRepository.save(entity);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const driverError = error as any;
        const code = driverError?.code ?? driverError?.driverError?.code;

        if (code === '23505') {
          throw new BadRequestException('Ya existe una tarifa con los mismos parámetros en este tenant');
        }
        if (code === '23503') {
          const detail = driverError?.detail ?? driverError?.driverError?.detail ?? '';
          if (detail.includes('vehicle_category_id')) {
            throw new BadRequestException('La categoría de vehículo especificada no existe');
          }
          if (detail.includes('parking_lot_id')) {
            throw new BadRequestException('El parqueadero especificado no existe');
          }
          throw new BadRequestException('Error de referencia: entidad relacionada no encontrada');
        }
      }
      throw error;
    }
  }
}
