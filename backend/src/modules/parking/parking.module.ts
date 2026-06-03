import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParkingController } from './controllers/parking.controller';
import { ParkingService } from './services/parking.service';
import { VehicleCategoryController } from './controllers/vehicle-category.controller';
import { VehicleCategoryService } from './services/vehicle-category.service';
import { ParkingLotController } from './controllers/parking-lot.controller';
import { ParkingLotService } from './services/parking-lot.service';
import { ParkingSpace, ParkingRecord } from './entities/parking.entity';
import { VehicleCategory } from './entities/vehicle-category.entity';
import { ParkingLot } from './entities/parking-lot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ParkingSpace, ParkingRecord, VehicleCategory, ParkingLot])],
  controllers: [ParkingController, VehicleCategoryController, ParkingLotController],
  providers: [ParkingService, VehicleCategoryService, ParkingLotService],
  exports: [ParkingService, VehicleCategoryService, ParkingLotService],
})
export class ParkingModule {}
