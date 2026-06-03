import { IsString, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVisitorDto {
  @ApiProperty({ enum: ['frequent', 'occasional', 'service', 'emergency'] })
  @IsEnum(['frequent', 'occasional', 'service', 'emergency'])
  visitType: 'frequent' | 'occasional' | 'service' | 'emergency';

  @ApiPropertyOptional({ enum: ['car', 'motorcycle', 'bicycle', 'none'] })
  @IsOptional()
  @IsEnum(['car', 'motorcycle', 'bicycle', 'none'])
  vehicleType?: 'car' | 'motorcycle' | 'bicycle' | 'none';

  @ApiProperty()
  @IsUUID()
  personId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  vehiclePlate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  visitingApartmentId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  authorizedByPersonId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateVisitorDto {
  @ApiPropertyOptional({ enum: ['frequent', 'occasional', 'service', 'emergency'] })
  @IsOptional()
  @IsEnum(['frequent', 'occasional', 'service', 'emergency'])
  visitType?: 'frequent' | 'occasional' | 'service' | 'emergency';

  @ApiPropertyOptional({ enum: ['car', 'motorcycle', 'bicycle', 'none'] })
  @IsOptional()
  @IsEnum(['car', 'motorcycle', 'bicycle', 'none'])
  vehicleType?: 'car' | 'motorcycle' | 'bicycle' | 'none';

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  personId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  vehiclePlate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  visitingApartmentId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  authorizedByPersonId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(['active', 'inactive', 'expired'])
  status?: 'active' | 'inactive' | 'expired';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CheckOutVisitorDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
