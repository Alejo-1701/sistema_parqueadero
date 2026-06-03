import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { Price } from '../entities/price.entity';
import { CreatePriceDto, UpdatePriceDto } from '../dto/price.dto';

@Injectable()
export class PriceService {
  constructor(
    @InjectRepository(Price)
    private readonly priceRepository: Repository<Price>,
  ) {}

  async findAll(invoiceId?: string, status?: string): Promise<Price[]> {
    const where: Record<string, string> = {};
    if (invoiceId) where.invoiceId = invoiceId;
    if (status) where.status = status;

    return this.priceRepository.find({
      where,
      relations: ['rate'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Price | null> {
    return this.priceRepository.findOne({
      where: { id },
      relations: ['invoice', 'rate', 'tenant'],
    });
  }

  async create(dto: CreatePriceDto): Promise<Price> {
    const price = this.priceRepository.create(dto as unknown as Partial<Price>);
    return this.saveWithErrorHandling(price);
  }

  async update(id: string, dto: UpdatePriceDto): Promise<Price | null> {
    const price = await this.priceRepository.preload({ id, ...dto } as unknown as Partial<Price>);
    if (!price) return null;

    return this.saveWithErrorHandling(price);
  }

  async remove(id: string): Promise<void> {
    await this.priceRepository.update(id, { status: 'inactive' } as Partial<Price>);
  }

  private async saveWithErrorHandling(entity: Price): Promise<Price> {
    try {
      return await this.priceRepository.save(entity);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const driverError = error as any;
        const code = driverError?.code ?? driverError?.driverError?.code;

        if (code === '23505') {
          throw new BadRequestException('El precio ya existe en este tenant');
        }
        if (code === '23503') {
          const detail = driverError?.detail ?? driverError?.driverError?.detail ?? '';
          if (detail.includes('invoice_id')) {
            throw new BadRequestException('La factura especificada no existe');
          }
          if (detail.includes('rate_id')) {
            throw new BadRequestException('La tarifa especificada no existe');
          }
          throw new BadRequestException('Error de referencia: entidad relacionada no encontrada');
        }
      }
      throw error;
    }
  }
}
