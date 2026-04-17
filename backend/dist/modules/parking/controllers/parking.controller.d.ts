import { ParkingService } from '../services/parking.service';
import { CreateParkingDto, UpdateParkingDto } from '../dto/parking.dto';
export declare class ParkingController {
    private readonly parkingService;
    constructor(parkingService: ParkingService);
    getParkingSpaces(): Promise<import("../entities/parking.entity").ParkingSpace[]>;
    createParkingSpace(createParkingDto: CreateParkingDto): Promise<import("../entities/parking.entity").ParkingSpace>;
    getParkingSpace(id: string): Promise<import("../entities/parking.entity").ParkingSpace | null>;
    updateParkingSpace(id: string, updateParkingDto: UpdateParkingDto): Promise<import("../entities/parking.entity").ParkingSpace | null>;
    deleteParkingSpace(id: string): Promise<void>;
    registerEntry(entryDto: any): Promise<import("../entities/parking.entity").ParkingRecord>;
    registerExit(exitDto: any): Promise<import("../entities/parking.entity").ParkingRecord | null>;
    getParkingRecords(): Promise<import("../entities/parking.entity").ParkingRecord[]>;
}
