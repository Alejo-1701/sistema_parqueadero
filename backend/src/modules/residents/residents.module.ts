import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResidentController } from './controllers/resident.controller';
import { ResidentService } from './services/resident.service';
import { Resident } from './entities/resident.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Resident])],
  controllers: [ResidentController],
  providers: [ResidentService],
  exports: [ResidentService],
})
export class ResidentsModule {}
