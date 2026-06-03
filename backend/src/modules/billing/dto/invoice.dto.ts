import { IsString, IsOptional, IsEnum, IsUUID, IsNumber, IsDateString, Min } from 'class-validator';

export class CreateInvoiceDto {
  @IsNumber()
  @Min(0)
  totalAmount: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discountAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  taxAmount?: number;

  @IsOptional()
  @IsUUID()
  parkingLotId?: string;

  @IsOptional()
  @IsUUID()
  personId?: string;

  @IsOptional()
  @IsUUID()
  visitorId?: string;

  @IsOptional()
  @IsEnum(['pending', 'paid', 'cancelled', 'overdue'])
  status?: 'pending' | 'paid' | 'cancelled' | 'overdue';

  @IsOptional()
  @IsEnum(['cash', 'card', 'bank_transfer', 'nequi', 'daviplata'])
  paymentMethod?: 'cash' | 'card' | 'bank_transfer' | 'nequi' | 'daviplata';

  @IsOptional()
  @IsDateString()
  paidAt?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateInvoiceDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discountAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  taxAmount?: number;

  @IsOptional()
  @IsUUID()
  parkingLotId?: string;

  @IsOptional()
  @IsUUID()
  personId?: string;

  @IsOptional()
  @IsUUID()
  visitorId?: string;

  @IsOptional()
  @IsEnum(['pending', 'paid', 'cancelled', 'overdue'])
  status?: 'pending' | 'paid' | 'cancelled' | 'overdue';

  @IsOptional()
  @IsEnum(['cash', 'card', 'bank_transfer', 'nequi', 'daviplata'])
  paymentMethod?: 'cash' | 'card' | 'bank_transfer' | 'nequi' | 'daviplata';

  @IsOptional()
  @IsDateString()
  paidAt?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
