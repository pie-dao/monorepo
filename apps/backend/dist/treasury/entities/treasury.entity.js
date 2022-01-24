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
exports.TreasurySchema = exports.TreasuryEntity = exports.AssetSchema = exports.AssetEntity = void 0;
const swagger_1 = require("@nestjs/swagger");
const mongoose_1 = require("@nestjs/mongoose");
let AssetEntity = class AssetEntity {
};
__decorate([
    mongoose_1.Prop({ required: true }),
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], AssetEntity.prototype, "network", void 0);
__decorate([
    mongoose_1.Prop({ required: true }),
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], AssetEntity.prototype, "protocol", void 0);
__decorate([
    mongoose_1.Prop({ required: true }),
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], AssetEntity.prototype, "assets", void 0);
__decorate([
    mongoose_1.Prop({ required: true }),
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], AssetEntity.prototype, "debt", void 0);
__decorate([
    mongoose_1.Prop({ required: true }),
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], AssetEntity.prototype, "total", void 0);
AssetEntity = __decorate([
    mongoose_1.Schema()
], AssetEntity);
exports.AssetEntity = AssetEntity;
exports.AssetSchema = mongoose_1.SchemaFactory.createForClass(AssetEntity);
let TreasuryEntity = class TreasuryEntity {
};
__decorate([
    mongoose_1.Prop({ required: true }),
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], TreasuryEntity.prototype, "treasury", void 0);
__decorate([
    mongoose_1.Prop({ required: true, type: Array }),
    swagger_1.ApiProperty(),
    __metadata("design:type", Array)
], TreasuryEntity.prototype, "underlying_assets", void 0);
TreasuryEntity = __decorate([
    mongoose_1.Schema({ timestamps: true })
], TreasuryEntity);
exports.TreasuryEntity = TreasuryEntity;
exports.TreasurySchema = mongoose_1.SchemaFactory.createForClass(TreasuryEntity);
//# sourceMappingURL=treasury.entity.js.map