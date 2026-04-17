import { Repository } from 'typeorm';
import { ParkingSpace, ParkingRecord } from '../entities/parking.entity';
import { CreateParkingDto, UpdateParkingDto } from '../dto/parking.dto';
export declare class ParkingService {
    private readonly parkingSpaceRepository;
    private readonly parkingRecordRepository;
    constructor(parkingSpaceRepository: Repository<ParkingSpace>, parkingRecordRepository: Repository<ParkingRecord>);
    getParkingSpaces(): Promise<ParkingSpace[]>;
    createParkingSpace(createParkingDto: CreateParkingDto): Promise<ParkingSpace>;
    getParkingSpace(id: string): Promise<ParkingSpace | null>;
    updateParkingSpace(id: string, updateParkingDto: UpdateParkingDto): Promise<ParkingSpace | null>;
    deleteParkingSpace(id: string): Promise<void>;
    registerEntry(entryDto: any): Promise<ParkingRecord>;
    registerExit(exitDto: any): Promise<ParkingRecord | null>;
    getParkingRecords(): Promise<ParkingRecord[]>;
}
