import { IsString, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRequestDto {
  @ApiProperty({ enum: ['access', 'visit', 'service', 'complaint', 'claim'] })
  @IsEnum(['access', 'visit', 'service', 'complaint', 'claim'])
  requestType: 'access' | 'visit' | 'service' | 'complaint' | 'claim';

  @ApiProperty()
  @IsUUID()
  requesterPersonId: string;

  @ApiProperty()
  @IsString()
  description: string;
}

export class UpdateRequestDto {
  @ApiPropertyOptional({ enum: ['access', 'visit', 'service', 'complaint', 'claim'] })
  @IsOptional()
  @IsEnum(['access', 'visit', 'service', 'complaint', 'claim'])
  requestType?: 'access' | 'visit' | 'service' | 'complaint' | 'claim';

  @ApiPropertyOptional({ enum: ['pending', 'approved', 'rejected', 'in_progress'] })
  @IsOptional()
  @IsEnum(['pending', 'approved', 'rejected', 'in_progress'])
  status?: 'pending' | 'approved' | 'rejected' | 'in_progress';

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  requesterPersonId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;
}

export class RespondRequestDto {
  @ApiProperty()
  @IsUUID()
  responderPersonId: string;

  @ApiProperty()
  @IsString()
  response: string;
}
