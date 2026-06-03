import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ParkingLotService } from '../services/parking-lot.service';
import { ParkingLot } from '../entities/parking-lot.entity';

@Controller('parking-lots')
export class ParkingLotController {
  constructor(private readonly parkingLotService: ParkingLotService) {}

  @Get()
  findAll(): Promise<ParkingLot[]> {
    return this.parkingLotService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ParkingLot | null> {
    return this.parkingLotService.findOne(id);
  }

  @Post()
  create(@Body() parkingLot: Partial<ParkingLot>): Promise<ParkingLot> {
    return this.parkingLotService.create(parkingLot);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() parkingLot: Partial<ParkingLot>): Promise<ParkingLot | null> {
    return this.parkingLotService.update(id, parkingLot);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.parkingLotService.remove(id);
  }
}
