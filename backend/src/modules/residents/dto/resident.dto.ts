import { IsString, IsOptional, IsEnum, IsUUID, IsDateString } from 'class-validator';

export class CreateResidentDto {
  @IsString()
  residentCode: string;

  @IsEnum(['resident', 'tenant'])
  residentType: 'resident' | 'tenant';

  @IsUUID()
  personId: string;

  @IsUUID()
  apartmentId: string;

  @IsDateString()
  moveInDate: string;

  @IsOptional()
  @IsDateString()
  moveOutDate?: string;

  @IsOptional()
  @IsEnum(['active', 'inactive'])
  status?: 'active' | 'inactive';

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateResidentDto {
  @IsOptional()
  @IsString()
  residentCode?: string;

  @IsOptional()
  @IsEnum(['resident', 'tenant'])
  residentType?: 'resident' | 'tenant';

  @IsOptional()
  @IsUUID()
  personId?: string;

  @IsOptional()
  @IsUUID()
  apartmentId?: string;

  @IsOptional()
  @IsDateString()
  moveInDate?: string;

  @IsOptional()
  @IsDateString()
  moveOutDate?: string;

  @IsOptional()
  @IsEnum(['active', 'inactive'])
  status?: 'active' | 'inactive';

  @IsOptional()
  @IsString()
  notes?: string;
}
