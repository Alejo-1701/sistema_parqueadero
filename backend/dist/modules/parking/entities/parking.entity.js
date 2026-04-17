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
exports.ParkingRecord = exports.ParkingSpace = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../auth/entities/user.entity");
let ParkingSpace = class ParkingSpace {
    id;
    numero;
    tipo;
    estado;
    tarifa;
    usuario;
    vehiculoId;
    createdAt;
    updatedAt;
};
exports.ParkingSpace = ParkingSpace;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ParkingSpace.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ParkingSpace.prototype, "numero", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ParkingSpace.prototype, "tipo", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'DISPONIBLE' }),
    __metadata("design:type", String)
], ParkingSpace.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], ParkingSpace.prototype, "tarifa", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    __metadata("design:type", user_entity_1.User)
], ParkingSpace.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ParkingSpace.prototype, "vehiculoId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ParkingSpace.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ParkingSpace.prototype, "updatedAt", void 0);
exports.ParkingSpace = ParkingSpace = __decorate([
    (0, typeorm_1.Entity)('parking_spaces')
], ParkingSpace);
let ParkingRecord = class ParkingRecord {
    id;
    espacio;
    usuario;
    horaEntrada;
    horaSalida;
    montoCobrado;
    estado;
    createdAt;
    updatedAt;
};
exports.ParkingRecord = ParkingRecord;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ParkingRecord.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ParkingSpace),
    __metadata("design:type", ParkingSpace)
], ParkingRecord.prototype, "espacio", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    __metadata("design:type", user_entity_1.User)
], ParkingRecord.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], ParkingRecord.prototype, "horaEntrada", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], ParkingRecord.prototype, "horaSalida", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], ParkingRecord.prototype, "montoCobrado", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'ACTIVO' }),
    __metadata("design:type", String)
], ParkingRecord.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ParkingRecord.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ParkingRecord.prototype, "updatedAt", void 0);
exports.ParkingRecord = ParkingRecord = __decorate([
    (0, typeorm_1.Entity)('parking_records')
], ParkingRecord);
//# sourceMappingURL=parking.entity.js.map