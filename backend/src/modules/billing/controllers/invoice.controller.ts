import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InvoiceService } from '../services/invoice.service';
import { CreateInvoiceDto, UpdateInvoiceDto } from '../dto/invoice.dto';
import { Invoice } from '../entities/invoice.entity';

@ApiTags('invoices')
@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Get()
  @ApiOperation({ summary: 'Listar facturas' })
  @ApiResponse({ status: 200, description: 'Lista de facturas' })
  findAll(
    @Query('status') status?: string,
    @Query('payment_method') paymentMethod?: string,
    @Query('person_id') personId?: string,
  ): Promise<Invoice[]> {
    return this.invoiceService.findAll(status, paymentMethod, personId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener factura por ID' })
  @ApiResponse({ status: 200, description: 'Factura encontrada' })
  @ApiResponse({ status: 404, description: 'Factura no encontrada' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Invoice> {
    const invoice = await this.invoiceService.findOne(id);
    if (!invoice) {
      throw new NotFoundException('Factura no encontrada');
    }
    return invoice;
  }

  @Post()
  @ApiOperation({ summary: 'Crear factura' })
  @ApiResponse({ status: 201, description: 'Factura creada exitosamente' })
  create(@Body() dto: CreateInvoiceDto): Promise<Invoice> {
    return this.invoiceService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar factura' })
  @ApiResponse({ status: 200, description: 'Factura actualizada' })
  @ApiResponse({ status: 404, description: 'Factura no encontrada' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateInvoiceDto,
  ): Promise<Invoice> {
    const invoice = await this.invoiceService.update(id, dto);
    if (!invoice) {
      throw new NotFoundException('Factura no encontrada');
    }
    return invoice;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancelar factura' })
  @ApiResponse({ status: 204, description: 'Factura cancelada' })
  @ApiResponse({ status: 404, description: 'Factura no encontrada' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    const invoice = await this.invoiceService.findOne(id);
    if (!invoice) {
      throw new NotFoundException('Factura no encontrada');
    }
    await this.invoiceService.remove(id);
  }
}
