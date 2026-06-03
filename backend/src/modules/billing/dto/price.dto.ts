import { IsString, IsOptional, IsEnum, IsUUID, IsNumber, IsDateString, Min } from 'class-validator';

export class CreatePriceDto {
  @IsNumber()
  @Min(0)
  amount: number;

  @IsEnum(['hour', 'day', 'week', 'month', 'event', 'fraction'])
  billingUnit: 'hour' | 'day' | 'week' | 'month' | 'event' | 'fraction';

  @IsOptional()
  @IsNumber()
  @Min(1)
  quantity?: number;

  @IsUUID()
  invoiceId: string;

  @IsOptional()
  @IsUUID()
  rateId?: string;

  @IsOptional()
  @IsDateString()
  validFrom?: string;

  @IsOptional()
  @IsDateString()
  validTo?: string;

  @IsOptional()
  @IsEnum(['active', 'inactive'])
  status?: 'active' | 'inactive';

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdatePriceDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;

  @IsOptional()
  @IsEnum(['hour', 'day', 'week', 'month', 'event', 'fraction'])
  billingUnit?: 'hour' | 'day' | 'week' | 'month' | 'event' | 'fraction';

  @IsOptional()
  @IsNumber()
  @Min(1)
  quantity?: number;

  @IsOptional()
  @IsUUID()
  invoiceId?: string;

  @IsOptional()
  @IsUUID()
  rateId?: string;

  @IsOptional()
  @IsDateString()
  validFrom?: string;

  @IsOptional()
  @IsDateString()
  validTo?: string;

  @IsOptional()
  @IsEnum(['active', 'inactive'])
  status?: 'active' | 'inactive';

  @IsOptional()
  @IsString()
  notes?: string;
}
