import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { Invoice } from '../entities/invoice.entity';
import { CreateInvoiceDto, UpdateInvoiceDto } from '../dto/invoice.dto';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
  ) {}

  async findAll(
    status?: string,
    paymentMethod?: string,
    personId?: string,
  ): Promise<Invoice[]> {
    const where: Record<string, string> = {};
    if (status) where.status = status;
    if (paymentMethod) where.paymentMethod = paymentMethod;
    if (personId) where.personId = personId;

    return this.invoiceRepository.find({
      where,
      relations: ['person', 'parkingLot'],
      order: { issuedAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Invoice | null> {
    return this.invoiceRepository.findOne({
      where: { id },
      relations: ['person', 'visitor', 'parkingLot', 'tenant'],
    });
  }

  async create(dto: CreateInvoiceDto): Promise<Invoice> {
    // Validate exactly one between person_id and visitor_id
    if (!dto.personId && !dto.visitorId) {
      throw new BadRequestException('Debe especificar una persona o un visitante');
    }
    if (dto.personId && dto.visitorId) {
      throw new BadRequestException('No puede especificar persona y visitante simultáneamente');
    }

    const invoice = this.invoiceRepository.create(dto as unknown as Partial<Invoice>);
    return this.saveWithErrorHandling(invoice);
  }

  async update(id: string, dto: UpdateInvoiceDto): Promise<Invoice | null> {
    if (dto.personId && dto.visitorId) {
      throw new BadRequestException('No puede especificar persona y visitante simultáneamente');
    }

    const invoice = await this.invoiceRepository.preload({ id, ...dto } as unknown as Partial<Invoice>);
    if (!invoice) return null;

    return this.saveWithErrorHandling(invoice);
  }

  async remove(id: string): Promise<void> {
    await this.invoiceRepository.update(id, { status: 'cancelled' } as Partial<Invoice>);
  }

  private async saveWithErrorHandling(entity: Invoice): Promise<Invoice> {
    try {
      return await this.invoiceRepository.save(entity);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      if (error instanceof QueryFailedError) {
        const driverError = error as any;
        const code = driverError?.code ?? driverError?.driverError?.code;

        if (code === '23503') {
          const detail = driverError?.detail ?? driverError?.driverError?.detail ?? '';
          if (detail.includes('person_id')) {
            throw new BadRequestException('La persona especificada no existe');
          }
          if (detail.includes('visitor_id')) {
            throw new BadRequestException('El visitante especificado no existe');
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
