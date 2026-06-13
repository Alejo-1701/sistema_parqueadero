import { IsString, IsOptional, IsEnum, IsUUID, IsInt, Min, Max, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePqrsDto {
  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ enum: ['petition', 'complaint', 'claim', 'suggestion', 'congratulation'] })
  @IsEnum(['petition', 'complaint', 'claim', 'suggestion', 'congratulation'])
  pqrType: 'petition' | 'complaint' | 'claim' | 'suggestion' | 'congratulation';

  @ApiProperty()
  @IsUUID()
  requesterPersonId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  assignedPersonId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({ enum: ['low', 'normal', 'high', 'urgent'] })
  @IsOptional()
  @IsEnum(['low', 'normal', 'high', 'urgent'])
  priority?: 'low' | 'normal' | 'high' | 'urgent';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdatePqrsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: ['petition', 'complaint', 'claim', 'suggestion', 'congratulation'] })
  @IsOptional()
  @IsEnum(['petition', 'complaint', 'claim', 'suggestion', 'congratulation'])
  pqrType?: 'petition' | 'complaint' | 'claim' | 'suggestion' | 'congratulation';

  @ApiPropertyOptional({ enum: ['open', 'in_progress', 'resolved', 'closed', 'rejected'] })
  @IsOptional()
  @IsEnum(['open', 'in_progress', 'resolved', 'closed', 'rejected'])
  status?: 'open' | 'in_progress' | 'resolved' | 'closed' | 'rejected';

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  assignedPersonId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({ enum: ['low', 'normal', 'high', 'urgent'] })
  @IsOptional()
  @IsEnum(['low', 'normal', 'high', 'urgent'])
  priority?: 'low' | 'normal' | 'high' | 'urgent';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class RespondPqrsDto {
  @ApiProperty()
  @IsString()
  response: string;
}

export class ScorePqrsDto {
  @ApiProperty({ minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  satisfactionScore: number;
}
