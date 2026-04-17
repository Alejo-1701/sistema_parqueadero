import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ParkingSpace, ParkingRecord } from '../entities/parking.entity';
import { CreateParkingDto, UpdateParkingDto } from '../dto/parking.dto';

@Injectable()
export class ParkingService {
  constructor(
    @InjectRepository(ParkingSpace)
    private readonly parkingSpaceRepository: Repository<ParkingSpace>,
    @InjectRepository(ParkingRecord)
    private readonly parkingRecordRepository: Repository<ParkingRecord>,
  ) {}

  async getParkingSpaces(): Promise<ParkingSpace[]> {
    return this.parkingSpaceRepository.find();
  }

  async createParkingSpace(
    createParkingDto: CreateParkingDto,
  ): Promise<ParkingSpace> {
    const parkingSpace = this.parkingSpaceRepository.create(createParkingDto);
    return this.parkingSpaceRepository.save(parkingSpace);
  }

  async getParkingSpace(id: string): Promise<ParkingSpace | null> {
    return this.parkingSpaceRepository.findOne({ where: { id: id as any } });
  }

  async updateParkingSpace(
    id: string,
    updateParkingDto: UpdateParkingDto,
  ): Promise<ParkingSpace | null> {
    await this.parkingSpaceRepository.update(id, updateParkingDto as any);
    return this.getParkingSpace(id);
  }

  async deleteParkingSpace(id: string): Promise<void> {
    await this.parkingSpaceRepository.delete(id);
  }

  async registerEntry(entryDto: any): Promise<ParkingRecord> {
    const parkingRecord = this.parkingRecordRepository.create({
      ...entryDto,
      horaEntrada: new Date(),
      estado: 'ACTIVO',
    }) as any;
    return this.parkingRecordRepository.save(parkingRecord);
  }

  async registerExit(exitDto: any): Promise<ParkingRecord | null> {
    const activeRecord = await this.parkingRecordRepository.findOne({
      where: {
        vehiculo: { id: exitDto.vehiculoId },
        estado: 'ACTIVO',
      } as any,
    });

    if (activeRecord) {
      await this.parkingRecordRepository.update(activeRecord.id, {
        horaSalida: new Date(),
        estado: 'FINALIZADO',
        montoCobrado: exitDto.montoCobrado,
      } as any);
    }

    return activeRecord;
  }

  async getParkingRecords(): Promise<ParkingRecord[]> {
    return this.parkingRecordRepository.find({
      relations: ['espacio', 'usuario'],
    });
  }
}
