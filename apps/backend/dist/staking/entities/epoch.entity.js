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
exports.EpochSchema = exports.EpochEntity = void 0;
const swagger_1 = require("@nestjs/swagger");
const mongoose_1 = require("@nestjs/mongoose");
let EpochEntity = class EpochEntity {
};
__decorate([
    mongoose_1.Prop(),
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], EpochEntity.prototype, "startDate", void 0);
__decorate([
    mongoose_1.Prop(),
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], EpochEntity.prototype, "endDate", void 0);
__decorate([
    mongoose_1.Prop(),
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], EpochEntity.prototype, "startBlock", void 0);
__decorate([
    mongoose_1.Prop(),
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], EpochEntity.prototype, "endBlock", void 0);
__decorate([
    mongoose_1.Prop(),
    swagger_1.ApiProperty(),
    __metadata("design:type", Array)
], EpochEntity.prototype, "participants", void 0);
__decorate([
    mongoose_1.Prop(),
    swagger_1.ApiProperty(),
    __metadata("design:type", Array)
], EpochEntity.prototype, "proposals", void 0);
__decorate([
    mongoose_1.Prop({ type: Object }),
    swagger_1.ApiProperty(),
    __metadata("design:type", Object)
], EpochEntity.prototype, "merkleTree", void 0);
__decorate([
    mongoose_1.Prop({ type: Object }),
    swagger_1.ApiProperty(),
    __metadata("design:type", Object)
], EpochEntity.prototype, "stakingStats", void 0);
__decorate([
    mongoose_1.Prop({ type: Object }),
    swagger_1.ApiProperty(),
    __metadata("design:type", Object)
], EpochEntity.prototype, "slice", void 0);
__decorate([
    mongoose_1.Prop(),
    swagger_1.ApiProperty(),
    __metadata("design:type", Array)
], EpochEntity.prototype, "rewards", void 0);
EpochEntity = __decorate([
    mongoose_1.Schema()
], EpochEntity);
exports.EpochEntity = EpochEntity;
exports.EpochSchema = mongoose_1.SchemaFactory.createForClass(EpochEntity);
//# sourceMappingURL=epoch.entity.js.map