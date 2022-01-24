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
exports.PieSchema = exports.PieEntity = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose = require("mongoose");
let PieEntity = class PieEntity {
};
__decorate([
    mongoose_1.Prop(),
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], PieEntity.prototype, "name", void 0);
__decorate([
    mongoose_1.Prop(),
    swagger_1.ApiProperty(),
    class_validator_1.IsHexadecimal(),
    __metadata("design:type", String)
], PieEntity.prototype, "address", void 0);
__decorate([
    mongoose_1.Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'PieHistoryEntity' }]),
    swagger_1.ApiProperty(),
    __metadata("design:type", Array)
], PieEntity.prototype, "history", void 0);
PieEntity = __decorate([
    mongoose_1.Schema()
], PieEntity);
exports.PieEntity = PieEntity;
exports.PieSchema = mongoose_1.SchemaFactory.createForClass(PieEntity);
//# sourceMappingURL=pie.entity.js.map