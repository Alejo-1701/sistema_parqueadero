import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParkingController } from './controllers/parking.controller';
import { ParkingService } from './services/parking.service';
import { ParkingSpace, ParkingRecord } from './entities/parking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ParkingSpace, ParkingRecord])],
  controllers: [ParkingController],
  providers: [ParkingService],
  exports: [ParkingService],
})
export class ParkingModule {}
