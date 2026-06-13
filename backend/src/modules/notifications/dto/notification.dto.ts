import { IsString, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty({ enum: ['entry', 'exit', 'payment', 'security', 'maintenance', 'general'] })
  @IsEnum(['entry', 'exit', 'payment', 'security', 'maintenance', 'general'])
  notificationType: 'entry' | 'exit' | 'payment' | 'security' | 'maintenance' | 'general';

  @ApiProperty()
  @IsUUID()
  recipientPersonId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  senderAccountId?: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  message: string;

  @ApiPropertyOptional({ enum: ['low', 'normal', 'high', 'urgent'] })
  @IsOptional()
  @IsEnum(['low', 'normal', 'high', 'urgent'])
  priority?: 'low' | 'normal' | 'high' | 'urgent';

  @ApiPropertyOptional({ enum: ['email', 'sms', 'push', 'app'] })
  @IsOptional()
  @IsEnum(['email', 'sms', 'push', 'app'])
  channel?: 'email' | 'sms' | 'push' | 'app';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateNotificationDto {
  @ApiPropertyOptional({ enum: ['unread', 'read', 'archived'] })
  @IsOptional()
  @IsEnum(['unread', 'read', 'archived'])
  status?: 'unread' | 'read' | 'archived';

  @ApiPropertyOptional({ enum: ['low', 'normal', 'high', 'urgent'] })
  @IsOptional()
  @IsEnum(['low', 'normal', 'high', 'urgent'])
  priority?: 'low' | 'normal' | 'high' | 'urgent';

  @ApiPropertyOptional({ enum: ['email', 'sms', 'push', 'app'] })
  @IsOptional()
  @IsEnum(['email', 'sms', 'push', 'app'])
  channel?: 'email' | 'sms' | 'push' | 'app';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
