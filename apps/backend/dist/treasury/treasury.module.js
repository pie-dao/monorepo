"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreasuryModule = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const mongoose_1 = require("@nestjs/mongoose");
const treasury_service_1 = require("./treasury.service");
const treasury_controller_1 = require("./treasury.controller");
const treasury_entity_1 = require("./entities/treasury.entity");
let TreasuryModule = class TreasuryModule {
};
TreasuryModule = __decorate([
    common_1.Module({
        imports: [
            axios_1.HttpModule,
            mongoose_1.MongooseModule.forFeature([
                { name: treasury_entity_1.TreasuryEntity.name, schema: treasury_entity_1.TreasurySchema },
            ]),
        ],
        controllers: [treasury_controller_1.TreasuryController],
        providers: [treasury_service_1.TreasuryService],
    })
], TreasuryModule);
exports.TreasuryModule = TreasuryModule;
//# sourceMappingURL=treasury.module.js.map