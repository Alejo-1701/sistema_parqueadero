import { IsString, IsOptional, IsEnum, IsUUID, IsNumber, IsDateString, Min } from 'class-validator';

export class CreateRateDto {
  @IsEnum(['standard', 'preferential', 'night', 'weekend', 'holiday'])
  rateType: 'standard' | 'preferential' | 'night' | 'weekend' | 'holiday';

  @IsOptional()
  @IsNumber()
  @Min(0)
  minAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  fractionMinutes?: number;

  @IsDateString()
  validFrom: string;

  @IsOptional()
  @IsDateString()
  validTo?: string;

  @IsOptional()
  @IsUUID()
  vehicleCategoryId?: string;

  @IsOptional()
  @IsUUID()
  parkingLotId?: string;

  @IsOptional()
  @IsEnum(['active', 'inactive'])
  status?: 'active' | 'inactive';

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateRateDto {
  @IsOptional()
  @IsEnum(['standard', 'preferential', 'night', 'weekend', 'holiday'])
  rateType?: 'standard' | 'preferential' | 'night' | 'weekend' | 'holiday';

  @IsOptional()
  @IsNumber()
  @Min(0)
  minAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  fractionMinutes?: number;

  @IsOptional()
  @IsDateString()
  validFrom?: string;

  @IsOptional()
  @IsDateString()
  validTo?: string;

  @IsOptional()
  @IsUUID()
  vehicleCategoryId?: string;

  @IsOptional()
  @IsUUID()
  parkingLotId?: string;

  @IsOptional()
  @IsEnum(['active', 'inactive'])
  status?: 'active' | 'inactive';

  @IsOptional()
  @IsString()
  notes?: string;
}
