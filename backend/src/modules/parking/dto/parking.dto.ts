import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsUUID,
} from 'class-validator';

export class CreateParkingDto {
  @IsString()
  numero: string;

  @IsEnum(['CARRO', 'MOTO', 'BICICLETA'])
  tipo: 'CARRO' | 'MOTO' | 'BICICLETA';

  @IsNumber()
  tarifa: number;

  @IsOptional()
  @IsString()
  vehiculoId?: string;
}

export class UpdateParkingDto {
  @IsOptional()
  @IsString()
  numero?: string;

  @IsOptional()
  @IsEnum(['CARRO', 'MOTO', 'BICICLETA'])
  tipo?: 'CARRO' | 'MOTO' | 'BICICLETA';

  @IsOptional()
  @IsNumber()
  tarifa?: number;

  @IsOptional()
  @IsEnum(['DISPONIBLE', 'OCUPADO', 'MANTENIMIENTO'])
  estado?: 'DISPONIBLE' | 'OCUPADO' | 'MANTENIMIENTO';
}

export class EntryDto {
  @IsUUID()
  espacioId: string;

  @IsOptional()
  @IsString()
  vehiculoId?: string;

  @IsOptional()
  @IsNumber()
  montoCobrado?: number;
}

export class ExitDto {
  @IsString()
  vehiculoId: string;

  @IsOptional()
  @IsNumber()
  montoCobrado?: number;
}
