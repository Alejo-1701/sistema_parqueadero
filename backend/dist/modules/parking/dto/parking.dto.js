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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExitDto = exports.EntryDto = exports.UpdateParkingDto = exports.CreateParkingDto = void 0;
const class_validator_1 = require("class-validator");
class CreateParkingDto {
    numero;
    tipo;
    tarifa;
    vehiculoId;
}
exports.CreateParkingDto = CreateParkingDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateParkingDto.prototype, "numero", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['CARRO', 'MOTO', 'BICICLETA']),
    __metadata("design:type", String)
], CreateParkingDto.prototype, "tipo", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateParkingDto.prototype, "tarifa", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateParkingDto.prototype, "vehiculoId", void 0);
class UpdateParkingDto {
    numero;
    tipo;
    tarifa;
    estado;
}
exports.UpdateParkingDto = UpdateParkingDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateParkingDto.prototype, "numero", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['CARRO', 'MOTO', 'BICICLETA']),
    __metadata("design:type", String)
], UpdateParkingDto.prototype, "tipo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateParkingDto.prototype, "tarifa", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['DISPONIBLE', 'OCUPADO', 'MANTENIMIENTO']),
    __metadata("design:type", String)
], UpdateParkingDto.prototype, "estado", void 0);
class EntryDto {
    espacioId;
    vehiculoId;
    montoCobrado;
}
exports.EntryDto = EntryDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], EntryDto.prototype, "espacioId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EntryDto.prototype, "vehiculoId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], EntryDto.prototype, "montoCobrado", void 0);
class ExitDto {
    vehiculoId;
    montoCobrado;
}
exports.ExitDto = ExitDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExitDto.prototype, "vehiculoId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ExitDto.prototype, "montoCobrado", void 0);
//# sourceMappingURL=parking.dto.js.map