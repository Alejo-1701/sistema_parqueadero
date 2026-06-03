import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ParkingLot } from '../entities/parking-lot.entity';

@Injectable()
export class ParkingLotService {
  constructor(
    @InjectRepository(ParkingLot)
    private readonly parkingLotRepository: Repository<ParkingLot>,
  ) {}

  async findAll(): Promise<ParkingLot[]> {
    return this.parkingLotRepository.find({ relations: ['vehicleCategory'] });
  }

  async findOne(id: string): Promise<ParkingLot | null> {
    return this.parkingLotRepository.findOne({
      where: { id },
      relations: ['vehicleCategory'],
    });
  }

  async create(parkingLot: Partial<ParkingLot>): Promise<ParkingLot> {
    const newLot = this.parkingLotRepository.create(parkingLot);
    return this.parkingLotRepository.save(newLot);
  }

  async update(id: string, parkingLot: Partial<ParkingLot>): Promise<ParkingLot | null> {
    await this.parkingLotRepository.update(id, parkingLot);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.parkingLotRepository.delete(id);
  }
}
