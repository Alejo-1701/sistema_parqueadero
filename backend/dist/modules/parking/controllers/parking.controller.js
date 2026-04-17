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
exports.ParkingController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const parking_service_1 = require("../services/parking.service");
const parking_dto_1 = require("../dto/parking.dto");
const auth_guard_1 = require("../../auth/guards/auth.guard");
let ParkingController = class ParkingController {
    parkingService;
    constructor(parkingService) {
        this.parkingService = parkingService;
    }
    async getParkingSpaces() {
        return this.parkingService.getParkingSpaces();
    }
    async createParkingSpace(createParkingDto) {
        return this.parkingService.createParkingSpace(createParkingDto);
    }
    async getParkingSpace(id) {
        return this.parkingService.getParkingSpace(id);
    }
    async updateParkingSpace(id, updateParkingDto) {
        return this.parkingService.updateParkingSpace(id, updateParkingDto);
    }
    async deleteParkingSpace(id) {
        return this.parkingService.deleteParkingSpace(id);
    }
    async registerEntry(entryDto) {
        return this.parkingService.registerEntry(entryDto);
    }
    async registerExit(exitDto) {
        return this.parkingService.registerExit(exitDto);
    }
    async getParkingRecords() {
        return this.parkingService.getParkingRecords();
    }
};
exports.ParkingController = ParkingController;
__decorate([
    (0, common_1.Get)('spaces'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener espacios de parqueadero' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Espacios obtenidos exitosamente' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ParkingController.prototype, "getParkingSpaces", null);
__decorate([
    (0, common_1.Post)('spaces'),
    (0, swagger_1.ApiOperation)({ summary: 'Crear nuevo espacio de parqueadero' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Espacio creado exitosamente' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [parking_dto_1.CreateParkingDto]),
    __metadata("design:returntype", Promise)
], ParkingController.prototype, "createParkingSpace", null);
__decorate([
    (0, common_1.Get)('spaces/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener espacio de parqueadero por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del espacio' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Espacio obtenido exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Espacio no encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ParkingController.prototype, "getParkingSpace", null);
__decorate([
    (0, common_1.Put)('spaces/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar espacio de parqueadero' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del espacio' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Espacio actualizado exitosamente' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, parking_dto_1.UpdateParkingDto]),
    __metadata("design:returntype", Promise)
], ParkingController.prototype, "updateParkingSpace", null);
__decorate([
    (0, common_1.Delete)('spaces/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar espacio de parqueadero' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del espacio' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Espacio eliminado exitosamente' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ParkingController.prototype, "deleteParkingSpace", null);
__decorate([
    (0, common_1.Post)('entry'),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar entrada de vehículo' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Entrada registrada exitosamente' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ParkingController.prototype, "registerEntry", null);
__decorate([
    (0, common_1.Post)('exit'),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar salida de vehículo' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Salida registrada exitosamente' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ParkingController.prototype, "registerExit", null);
__decorate([
    (0, common_1.Get)('records'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener registros de parqueadero' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Registros obtenidos exitosamente' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ParkingController.prototype, "getParkingRecords", null);
exports.ParkingController = ParkingController = __decorate([
    (0, swagger_1.ApiTags)('parking'),
    (0, common_1.Controller)('parking'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [parking_service_1.ParkingService])
], ParkingController);
//# sourceMappingURL=parking.controller.js.map