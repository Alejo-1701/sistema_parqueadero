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
exports.ResidentialAssignment = exports.ResidentialUnit = void 0;
const typeorm_1 = require("typeorm");
const person_entity_1 = require("../../people/entities/person.entity");
let ResidentialUnit = class ResidentialUnit {
    id;
    direccion;
    ciudad;
    departamento;
    area;
    numeroHabitaciones;
    estado;
    propietarioId;
    residentes;
    createdAt;
    updatedAt;
};
exports.ResidentialUnit = ResidentialUnit;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ResidentialUnit.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ResidentialUnit.prototype, "direccion", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ResidentialUnit.prototype, "ciudad", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ResidentialUnit.prototype, "departamento", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], ResidentialUnit.prototype, "area", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], ResidentialUnit.prototype, "numeroHabitaciones", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'DISPONIBLE' }),
    __metadata("design:type", String)
], ResidentialUnit.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ResidentialUnit.prototype, "propietarioId", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => person_entity_1.Person),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], ResidentialUnit.prototype, "residentes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ResidentialUnit.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ResidentialUnit.prototype, "updatedAt", void 0);
exports.ResidentialUnit = ResidentialUnit = __decorate([
    (0, typeorm_1.Entity)('residential_units')
], ResidentialUnit);
let ResidentialAssignment = class ResidentialAssignment {
    id;
    unidad;
    residente;
    fechaInicio;
    fechaFin;
    estado;
    createdAt;
    updatedAt;
};
exports.ResidentialAssignment = ResidentialAssignment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ResidentialAssignment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ResidentialUnit),
    __metadata("design:type", ResidentialUnit)
], ResidentialAssignment.prototype, "unidad", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => person_entity_1.Person),
    __metadata("design:type", person_entity_1.Person)
], ResidentialAssignment.prototype, "residente", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], ResidentialAssignment.prototype, "fechaInicio", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], ResidentialAssignment.prototype, "fechaFin", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'ACTIVO' }),
    __metadata("design:type", String)
], ResidentialAssignment.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ResidentialAssignment.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ResidentialAssignment.prototype, "updatedAt", void 0);
exports.ResidentialAssignment = ResidentialAssignment = __decorate([
    (0, typeorm_1.Entity)('residential_assignments')
], ResidentialAssignment);
//# sourceMappingURL=residential.entity.js.map