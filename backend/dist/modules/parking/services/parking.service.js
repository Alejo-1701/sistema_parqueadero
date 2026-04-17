"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParkingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const parking_entity_1 = require("../entities/parking.entity");
let ParkingService = class ParkingService {
    parkingSpaceRepository;
    parkingRecordRepository;
    constructor(parkingSpaceRepository, parkingRecordRepository) {
        this.parkingSpaceRepository = parkingSpaceRepository;
        this.parkingRecordRepository = parkingRecordRepository;
    }
    async getParkingSpaces() {
        return this.parkingSpaceRepository.find();
    }
    async createParkingSpace(createParkingDto) {
        const parkingSpace = this.parkingSpaceRepository.create(createParkingDto);
        return this.parkingSpaceRepository.save(parkingSpace);
    }
    async getParkingSpace(id) {
        return this.parkingSpaceRepository.findOne({ where: { id: id } });
    }
    async updateParkingSpace(id, updateParkingDto) {
        await this.parkingSpaceRepository.update(id, updateParkingDto);
        return this.getParkingSpace(id);
    }
    async deleteParkingSpace(id) {
        await this.parkingSpaceRepository.delete(id);
    }
    async registerEntry(entryDto) {
        const parkingRecord = this.parkingRecordRepository.create({
            ...entryDto,
            horaEntrada: new Date(),
            estado: 'ACTIVO',
        });
        return this.parkingRecordRepository.save(parkingRecord);
    }
    async registerExit(exitDto) {
        const activeRecord = await this.parkingRecordRepository.findOne({
            where: {
                vehiculo: { id: exitDto.vehiculoId },
                estado: 'ACTIVO'
            },
        });
        if (activeRecord) {
            await this.parkingRecordRepository.update(activeRecord.id, {
                horaSalida: new Date(),
                estado: 'FINALIZADO',
                montoCobrado: exitDto.montoCobrado,
            });
        }
        return activeRecord;
    }
    async getParkingRecords() {
        return this.parkingRecordRepository.find({
            relations: ['espacio', 'usuario'],
        });
    }
};
exports.ParkingService = ParkingService;
exports.ParkingService = ParkingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(parking_entity_1.ParkingSpace)),
    __param(1, (0, typeorm_1.InjectRepository)(parking_entity_1.ParkingRecord)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ParkingService);
//# sourceMappingURL=parking.service.js.map